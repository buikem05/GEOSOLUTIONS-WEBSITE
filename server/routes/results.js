const router = require('express').Router();
const db     = require('../config/db');
const { requireAuth, teacherOrAdmin } = require('../middleware/auth');

function gradeFromScore(score) {
  if (score >= 75) return 'A1';
  if (score >= 70) return 'B2';
  if (score >= 65) return 'B3';
  if (score >= 60) return 'C4';
  if (score >= 55) return 'C5';
  if (score >= 50) return 'C6';
  if (score >= 45) return 'D7';
  if (score >= 40) return 'E8';
  return 'F9';
}

/* ── GET /api/results ─────────────────────────────────────
   Students: own results only
   Teachers/Admins: pass ?studentId= for any student
────────────────────────────────────────────────────────── */
router.get('/', requireAuth, async (req, res) => {
  const studentId = req.user.role === 'student'
    ? req.user.id
    : (req.query.studentId || '');

  if (!studentId)
    return res.status(400).json({ status: false, message: 'studentId query param is required.' });

  try {
    const [rows] = await db.query(`
      SELECT id, subject, score, grade, term, session_year, created_at
      FROM   results
      WHERE  student_id = ?
      ORDER  BY session_year DESC, term ASC, subject ASC
    `, [studentId]);

    const data = rows.map(r => ({
      id:          r.id,
      subject:     r.subject,
      score:       parseFloat(r.score),
      grade:       r.grade,
      term:        r.term,
      sessionYear: r.session_year,
      createdAt:   r.created_at,
    }));

    res.json({ status: true, data });
  } catch (err) {
    console.error('[results GET]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── POST /api/results — add / update result ──────────────
   Teachers and admins only.
────────────────────────────────────────────────────────── */
router.post('/', requireAuth, teacherOrAdmin, async (req, res) => {
  const { studentId, subject, score, term, sessionYear } = req.body;

  if (!studentId || !subject || score == null || !term || !sessionYear)
    return res.status(400).json({ status: false, message: 'studentId, subject, score, term, and sessionYear are all required.' });

  const numScore = parseFloat(score);
  if (numScore < 0 || numScore > 100)
    return res.status(400).json({ status: false, message: 'Score must be between 0 and 100.' });

  const grade = gradeFromScore(numScore);

  try {
    await db.query(`
      INSERT INTO results (student_id, subject, score, grade, term, session_year, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score), grade = VALUES(grade), created_by = VALUES(created_by)
    `, [studentId, subject, numScore, grade, term, sessionYear, req.user.id]);

    res.status(201).json({ status: true, data: { grade, message: 'Result saved.' } });
  } catch (err) {
    console.error('[results POST]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

module.exports = router;
