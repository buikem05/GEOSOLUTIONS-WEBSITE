const router = require('express').Router();
const db     = require('../config/db');
const { requireAuth, adminOnly } = require('../middleware/auth');

function formatUser(u) {
  return {
    id:         u.id,
    role:       u.role,
    fullName:   u.full_name,
    identifier: u.identifier,
    email:      u.email,
    status:     u.status,
    subject:    u.subject   ?? null,
    phone:      u.phone     ?? null,
    avatar:     u.avatar_initials ?? null,
    avatarUrl:  u.avatar_url ?? null,
    createdAt:  u.created_at ?? null,
  };
}

/* ── GET /api/admin/users?role=&status=&q= ───────────────── */
router.get('/users', requireAuth, adminOnly, async (req, res) => {
  const { role = '', status = '', q = '' } = req.query;
  const like = `%${q}%`;

  let sql    = 'SELECT * FROM users WHERE (full_name LIKE ? OR email LIKE ? OR identifier LIKE ?)';
  const vals = [like, like, like];

  if (role)   { sql += ' AND role = ?';   vals.push(role); }
  if (status) { sql += ' AND status = ?'; vals.push(status); }
  sql += ' ORDER BY created_at DESC';

  try {
    const [rows] = await db.query(sql, vals);
    res.json({ status: true, data: rows.map(formatUser) });
  } catch (err) {
    console.error('[admin/users GET]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── PATCH /api/admin/users — update status ──────────────── */
router.patch('/users', requireAuth, adminOnly, async (req, res) => {
  const { userId, status } = req.body;
  if (!userId || !status)
    return res.status(400).json({ status: false, message: 'userId and status are required.' });

  const allowed = ['approved', 'rejected', 'suspended', 'pending'];
  if (!allowed.includes(status))
    return res.status(400).json({ status: false, message: 'Invalid status value.' });

  if (userId === req.user.id)
    return res.status(400).json({ status: false, message: 'You cannot change your own account status.' });

  try {
    const [result] = await db.query('UPDATE users SET status=? WHERE id=?', [status, userId]);
    if (result.affectedRows === 0)
      return res.status(404).json({ status: false, message: 'User not found.' });
    res.json({ status: true, data: { userId, newStatus: status } });
  } catch (err) {
    console.error('[admin/users PATCH]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── DELETE /api/admin/users?userId= ────────────────────── */
router.delete('/users', requireAuth, adminOnly, async (req, res) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(400).json({ status: false, message: 'userId query param is required.' });
  if (userId === req.user.id)
    return res.status(400).json({ status: false, message: 'You cannot delete your own account.' });

  try {
    const [result] = await db.query('DELETE FROM users WHERE id=?', [userId]);
    if (result.affectedRows === 0)
      return res.status(404).json({ status: false, message: 'User not found.' });
    res.json({ status: true, data: { deleted: userId } });
  } catch (err) {
    console.error('[admin/users DELETE]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── GET /api/admin/stats ────────────────────────────────── */
router.get('/stats', requireAuth, adminOnly, async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        SUM(role = 'student'  AND status = 'approved') AS totalStudents,
        SUM(role = 'teacher'  AND status = 'approved') AS totalTeachers,
        SUM(status = 'pending')                         AS totalPending,
        COUNT(*)                                        AS totalUsers
      FROM users
    `);
    const [[rev]] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalRevenue
      FROM payments WHERE status = 'success'
    `);

    // Monthly revenue
    const [monthlyRevenue] = await db.query(`
      SELECT MONTH(payment_date) as month, SUM(amount) as revenue
      FROM payments
      WHERE status = 'success' AND YEAR(payment_date) = YEAR(CURDATE())
      GROUP BY MONTH(payment_date)
    `);

    // Daily registrations
    const [dailyRegistrations] = await db.query(`
      SELECT DATE(created_at) as date, role, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at), role
    `);

    // Course distribution
    const [courseDistribution] = await db.query(`
      SELECT subject, COUNT(*) as count
      FROM users
      WHERE role = 'student' AND subject IS NOT NULL AND subject != ''
      GROUP BY subject
    `);

    // Generate dynamic notifications from recent users and payments
    const [recentUsers] = await db.query(`
      SELECT id, full_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5
    `);
    const [recentPayments] = await db.query(`
      SELECT id, amount, payment_date as created_at FROM payments ORDER BY payment_date DESC LIMIT 5
    `);
    
    let notifications = [];
    recentUsers.forEach(u => notifications.push({
      id: 'u-' + u.id,
      title: 'New Registration',
      msg: `${u.full_name} registered as a ${u.role}.`,
      time: u.created_at,
      icon: '👤',
      type: 'user'
    }));
    recentPayments.forEach(p => notifications.push({
      id: 'p-' + p.id,
      title: 'New Payment',
      msg: `Payment of ₦${Number(p.amount).toLocaleString()} received.`,
      time: p.created_at,
      icon: '💰',
      type: 'payment'
    }));
    
    // Sort notifications by time descending
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    notifications = notifications.slice(0, 10); // keep top 10

    res.json({
      status: true,
      data: {
        totalStudents: Number(stats.totalStudents ?? 0),
        totalTeachers: Number(stats.totalTeachers ?? 0),
        totalPending:  Number(stats.totalPending  ?? 0),
        totalUsers:    Number(stats.totalUsers    ?? 0),
        totalRevenue:  parseFloat(rev.totalRevenue ?? 0),
        monthlyRevenue,
        dailyRegistrations,
        courseDistribution,
        notifications
      }
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

module.exports = router;
