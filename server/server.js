require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const fileUpload   = require('express-fileupload');
const path         = require('path');

const app = express();

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (Postman, curl, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Security headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow avatar images cross-origin
}));

// ── Rate limiting ─────────────────────────────────────────────
// Strict: auth endpoints — prevents brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: 'Too many attempts. Please wait 15 minutes and try again.' },
});
// General: all other API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: 'Too many requests. Please slow down.' },
});
app.use('/api/', apiLimiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ── File uploads ──────────────────────────────────────────────
app.use(fileUpload({
  limits:      { fileSize: 2 * 1024 * 1024 }, // 2 MB
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
}));

// ── Serve uploaded avatar images as static files ───────────────
app.use('/images', express.static(path.join(__dirname, '../images')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/results',  require('./routes/results'));
app.use('/api/payments', require('./routes/payments'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: true, message: 'GEO ACADEMY API is running ✅' });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[GEO API ERROR]', err.message);
  res.status(500).json({ status: false, message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅  GEO ACADEMY API → http://localhost:${PORT}/api\n`);
});
