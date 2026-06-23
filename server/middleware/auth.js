const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('Missing required env var: JWT_SECRET');
}

/**
 * Middleware: verify JWT Bearer token.
 * Attaches decoded payload to req.user: { id, role, status }
 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ status: false, message: 'Authentication required. Please log in.' });
  }

  try {
    req.user = jwt.verify(match[1], jwtSecret);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid session. Please log in again.';
    return res.status(401).json({ status: false, message: msg });
  }
}

/**
 * Middleware: require admin role (use AFTER requireAuth).
 */
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ status: false, message: 'Access denied. Admins only.' });
  }
  next();
}

/**
 * Middleware: require teacher or admin role.
 */
function teacherOrAdmin(req, res, next) {
  if (!['teacher', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ status: false, message: 'Access denied. Teachers and admins only.' });
  }
  next();
}

module.exports = { requireAuth, adminOnly, teacherOrAdmin };
