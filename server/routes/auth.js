const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const path    = require('path');
const fs      = require('fs');
const db      = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('Missing required env var: JWT_SECRET');
}

/* Helper: map DB snake_case row → camelCase frontend shape */
function formatUser(u) {
  return {
    id:         u.id,
    role:       u.role,
    fullName:   u.full_name,
    identifier: u.identifier,
    email:      u.email,
    status:     u.status,
    subject:    u.subject    ?? null,
    phone:      u.phone      ?? null,
    avatar:     u.avatar_initials ?? null,
    avatarUrl:  u.avatar_url ?? null,
    createdAt:  u.created_at ?? null,
  };
}

/* Helper: sign a JWT for the given user row */
function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/* ── POST /api/auth/register ─────────────────────────────── */
router.post('/register', async (req, res) => {
  const { fullName, email, password, role, identifier, subject, phone } = req.body;

  if (!fullName || !email || !password || !role)
    return res.status(400).json({ status: false, message: 'fullName, email, password, and role are required.' });

  const emailLc = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLc))
    return res.status(400).json({ status: false, message: 'Please enter a valid email address.' });

  if (password.length < 6)
    return res.status(400).json({ status: false, message: 'Password must be at least 6 characters.' });

  if (!['student', 'teacher', 'admin', 'computer'].includes(role))
    return res.status(400).json({ status: false, message: 'Invalid role.' });

  let id_ = (identifier || '').trim();
  if (['student', 'computer'].includes(role) && !id_)
    return res.status(400).json({ status: false, message: 'REG NUMBER is required for students.' });
  if (role === 'teacher' && !id_) id_ = emailLc;
  if (role === 'admin'   && !id_)
    return res.status(400).json({ status: false, message: 'Admin code is required.' });

  if (role === 'admin' && process.env.ADMIN_REGISTRATION_CODE && id_ !== process.env.ADMIN_REGISTRATION_CODE)
    return res.status(403).json({ status: false, message: 'Invalid admin registration code.' });

  try {
    const [[dup]] = await db.query('SELECT id FROM users WHERE email = ?', [emailLc]);
    if (dup) return res.status(409).json({ status: false, message: 'An account with this email already exists.' });

    if (id_) {
      const [[dupId]] = await db.query('SELECT id FROM users WHERE identifier = ?', [id_]);
      if (dupId) return res.status(409).json({ status: false, message: 'This identifier (REG NUMBER / code) is already registered.' });
    }

    const parts    = fullName.trim().split(' ');
    const initials = (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
    const hash     = await bcrypt.hash(password, 10);
    const userId   = crypto.randomBytes(8).toString('hex');

    await db.query(
      `INSERT INTO users
         (id, role, full_name, identifier, email, password_hash, status, subject, phone, avatar_initials)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [userId, role, fullName.trim(), id_, emailLc, hash,
       subject || null, phone || null, initials]
    );

    res.status(201).json({
      status: true,
      data: { userId, message: 'Account created successfully. Awaiting admin approval.' }
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ status: false, message: 'Server error. Please try again.' });
  }
});

/* ── POST /api/auth/login ────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { role, identifier, password } = req.body;
  if (!role || !identifier || !password)
    return res.status(400).json({ status: false, message: 'role, identifier, and password are required.' });

  try {
    const [[user]] = await db.query(
      'SELECT * FROM users WHERE role = ? AND identifier = ?',
      [role, identifier.trim()]
    );

    const valid = user && await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ status: false, message: 'Invalid credentials. Please check your role, ID, and password.' });

    const statusMessages = {
      pending:   'Your account is pending admin approval. Please check back later.',
      rejected:  'Your account application was rejected. Contact the administration.',
      suspended: 'Your account has been suspended. Contact the administration.',
    };
    if (statusMessages[user.status])
      return res.status(403).json({ status: false, message: statusMessages[user.status] });

    res.json({ status: true, data: { token: signToken(user), user: formatUser(user) } });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ status: false, message: 'Server error. Please try again.' });
  }
});

/* ── POST /api/auth/logout (stateless — client discards token) */
router.post('/logout', (req, res) => {
  res.json({ status: true, data: { message: 'Logged out successfully.' } });
});

/* ── GET /api/auth/me ────────────────────────────────────── */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT * FROM users WHERE id = ? AND status = "approved"',
      [req.user.id]
    );
    if (!user)
      return res.status(401).json({ status: false, message: 'User not found or not approved.' });
    res.json({ status: true, data: formatUser(user) });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── PATCH /api/auth/update_profile ─────────────────────── */
router.patch('/update_profile', requireAuth, async (req, res) => {
  const { fullName, email, phone, subject } = req.body;
  if (!fullName)
    return res.status(400).json({ status: false, message: 'Full name cannot be empty.' });

  const emailLc = (email || '').toLowerCase().trim();
  if (emailLc && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLc))
    return res.status(400).json({ status: false, message: 'Invalid email address.' });

  try {
    const [[current]] = await db.query(
      'SELECT id FROM users WHERE id = ? AND status = "approved"',
      [req.user.id]
    );
    if (!current)
      return res.status(401).json({ status: false, message: 'User not found or not approved.' });

    if (emailLc) {
      const [[dup]] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?', [emailLc, req.user.id]
      );
      if (dup) return res.status(409).json({ status: false, message: 'This email is already used by another account.' });
    }

    const parts    = fullName.trim().split(' ');
    const initials = (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();

    await db.query(
      'UPDATE users SET full_name=?, email=COALESCE(NULLIF(?,\'\'),email), phone=?, subject=?, avatar_initials=? WHERE id=?',
      [fullName.trim(), emailLc, phone || null, subject || null, initials, req.user.id]
    );

    const [[updated]] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json({ status: true, data: formatUser(updated) });
  } catch (err) {
    console.error('[update_profile]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

/* ── POST /api/auth/upload_avatar ───────────────────────── */
router.post('/upload_avatar', requireAuth, async (req, res) => {
  if (!req.files?.avatar)
    return res.status(400).json({ status: false, message: 'No file uploaded. Use field name "avatar".' });

  const file    = req.files.avatar;
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.mimetype))
    return res.status(400).json({ status: false, message: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP.' });

  const signatures = {
    'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    'image/png':  (b) => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/gif':  (b) => b.slice(0, 6).toString('ascii') === 'GIF87a' || b.slice(0, 6).toString('ascii') === 'GIF89a',
    'image/webp': (b) => b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP',
  };
  if (!Buffer.isBuffer(file.data) || !signatures[file.mimetype]?.(file.data))
    return res.status(400).json({ status: false, message: 'Uploaded file does not match the declared image type.' });

  const ext      = file.mimetype.split('/')[1].replace('jpeg', 'jpg');
  const filename = `${req.user.id}.${ext}`;
  const dir      = path.join(__dirname, '../../images/avatars');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    const [[current]] = await db.query(
      'SELECT id FROM users WHERE id = ? AND status = "approved"',
      [req.user.id]
    );
    if (!current)
      return res.status(401).json({ status: false, message: 'User not found or not approved.' });

    await file.mv(path.join(dir, filename));
    const avatarUrl = `../images/avatars/${filename}`;
    await db.query('UPDATE users SET avatar_url=? WHERE id=?', [avatarUrl, req.user.id]);
    res.json({ status: true, data: { avatarUrl } });
  } catch (err) {
    console.error('[upload_avatar]', err);
    res.status(500).json({ status: false, message: 'Could not save file.' });
  }
});

/* ── POST /api/auth/change_password ─────────────────────── */
router.post('/change_password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ status: false, message: 'currentPassword and newPassword are required.' });
  if (newPassword.length < 6)
    return res.status(400).json({ status: false, message: 'New password must be at least 6 characters.' });
  if (currentPassword === newPassword)
    return res.status(400).json({ status: false, message: 'New password must be different from your current password.' });

  try {
    const [[user]] = await db.query('SELECT password_hash FROM users WHERE id = ? AND status = "approved"', [req.user.id]);
    if (!user) return res.status(404).json({ status: false, message: 'User not found.' });

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid)
      return res.status(401).json({ status: false, message: 'Current password is incorrect.' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    res.json({ status: true, data: { message: 'Password changed successfully.' } });
  } catch (err) {
    console.error('[change_password]', err);
    res.status(500).json({ status: false, message: 'Server error.' });
  }
});

module.exports = router;
