const router = require('express').Router();
const axios  = require('axios').default;
const db     = require('../config/db');
const { requireAuth, adminOnly } = require('../middleware/auth');

/* ── GET /api/payments/history ───────────────────────────── */
router.get('/history', requireAuth, async (req, res) => {
  const studentId = (req.user.role === 'admin' && req.query.studentId)
    ? req.query.studentId
    : req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT p.id, p.reference, p.amount, p.payment_method,
             p.status, p.payment_date,
             s.current_period_end, s.status AS subscription_status
      FROM   payments p
      LEFT   JOIN student_subscriptions s ON s.student_id = p.student_id
      WHERE  p.student_id = ?
      ORDER  BY p.payment_date DESC
    `, [studentId]);

    const data = rows.map(r => ({
      id:                 r.id,
      reference:          r.reference,
      amount:             parseFloat(r.amount),
      method:             r.payment_method,
      status:             r.status,
      date:               r.payment_date,
      subscriptionExpiry: r.current_period_end ?? null,
      subscriptionStatus: r.subscription_status ?? 'expired',
    }));

    res.json({ status: true, data });
  } catch (err) {
    console.error('[payments/history]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── POST /api/payments/verify — Paystack webhook ─────────── */
router.post('/verify', requireAuth, async (req, res) => {
  const { reference, student_id } = req.body;
  if (!reference || !student_id)
    return res.status(400).json({ status: false, message: 'reference and student_id are required.' });

  if (req.user.role !== 'admin' && student_id !== req.user.id)
    return res.status(403).json({ status: false, message: 'You can only verify payment for your own account.' });

  if (!process.env.PAYSTACK_SECRET_KEY)
    return res.status(500).json({ status: false, message: 'Payment gateway is not configured.' });

  try {
    const psRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const tranx = psRes.data;

    if (!tranx.status || tranx.data?.status !== 'success')
      return res.status(400).json({ status: false, message: `Payment not successful: ${tranx.data?.status}` });

    const amount      = tranx.data.amount / 100;
    const method      = tranx.data.channel;
    const now         = new Date();
    const expiry      = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
    const expiryStr   = expiry.toISOString().slice(0, 19).replace('T', ' ');

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `INSERT INTO payments (student_id, reference, amount, payment_method, status, gateway_response)
         VALUES (?, ?, ?, ?, 'success', ?)`,
        [student_id, reference, amount, method, JSON.stringify(tranx.data)]
      );
      await conn.query(
        `INSERT INTO student_subscriptions (student_id, current_period_end, status)
         VALUES (?, ?, 'active')
         ON DUPLICATE KEY UPDATE current_period_end = ?, status = 'active'`,
        [student_id, expiryStr, expiryStr]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    res.json({
      status: true,
      data: { reference, amount, expiryDate: expiryStr, message: 'Payment verified successfully.' }
    });
  } catch (err) {
    console.error('[payments/verify]', err.message);
    res.status(500).json({ status: false, message: 'Payment verification failed. ' + err.message });
  }
});

/* ── POST /api/payments/payout — teacher submits request ─── */
router.post('/payout', requireAuth, async (req, res) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ status: false, message: 'Only teachers can submit payout requests.' });

  const { bankName, accountNumber, accountName, amount, notes } = req.body;
  if (!bankName || !accountNumber || !accountName || !amount)
    return res.status(400).json({ status: false, message: 'bankName, accountNumber, accountName, and amount are required.' });

  try {
    await db.query(
      `INSERT INTO teacher_payout_requests (teacher_id, bank_name, account_number, account_name, amount, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, bankName, accountNumber, accountName, parseFloat(amount), notes || null]
    );
    res.status(201).json({ status: true, data: { message: 'Payout request submitted. Admin will process it shortly.' } });
  } catch (err) {
    console.error('[payments/payout POST]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── GET /api/payments/payout — list requests ────────────── */
router.get('/payout', requireAuth, async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'admin') {
      [rows] = await db.query(`
        SELECT r.*, u.full_name AS teacher_name, u.email AS teacher_email
        FROM   teacher_payout_requests r
        JOIN   users u ON u.id = r.teacher_id
        ORDER  BY r.created_at DESC
      `);
    } else if (req.user.role === 'teacher') {
      [rows] = await db.query(
        'SELECT * FROM teacher_payout_requests WHERE teacher_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
    } else {
      return res.status(403).json({ status: false, message: 'Access denied.' });
    }
    res.json({ status: true, data: rows });
  } catch (err) {
    console.error('[payments/payout GET]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── PATCH /api/payments/payout — admin processes request ── */
router.patch('/payout', requireAuth, adminOnly, async (req, res) => {
  const { requestId, status } = req.body;
  if (!requestId || !['processed', 'rejected'].includes(status))
    return res.status(400).json({ status: false, message: 'requestId and status (processed|rejected) are required.' });

  try {
    const processedAt = status === 'processed' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
    const [result] = await db.query(
      'UPDATE teacher_payout_requests SET status=?, processed_at=? WHERE id=?',
      [status, processedAt, requestId]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ status: false, message: 'Payout request not found.' });
    res.json({ status: true, data: { requestId, newStatus: status } });
  } catch (err) {
    console.error('[payments/payout PATCH]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

module.exports = router;
