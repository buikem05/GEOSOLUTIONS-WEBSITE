<?php
/**
 * POST /php/api/auth/register.php
 * Body: { fullName, email, password, role, identifier, subject?, phone? }
 * Returns: { status, data: { userId, message } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$in = json_decode(file_get_contents('php://input'), true) ?? [];

$fullName   = trim($in['fullName']   ?? '');
$email      = strtolower(trim($in['email'] ?? ''));
$password   = $in['password']   ?? '';
$role       = $in['role']       ?? '';
$identifier = trim($in['identifier'] ?? '');
$subject    = trim($in['subject']    ?? '');
$phone      = trim($in['phone']      ?? '');

// ── Validate ─────────────────────────────────────────────────
if (!$fullName || !$email || !$password || !$role) {
    jsonError('fullName, email, password, and role are all required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Please enter a valid email address.');
}
if (strlen($password) < 6) {
    jsonError('Password must be at least 6 characters.');
}
$allowedRoles = ['student', 'teacher', 'admin', 'computer'];
if (!in_array($role, $allowedRoles, true)) {
    jsonError('Invalid role selected.');
}
// Students and computer roles need an identifier (REG NUMBER)
if (in_array($role, ['student', 'computer'], true) && !$identifier) {
    jsonError('REG NUMBER is required for student registration.');
}
// Teachers use email as identifier if none provided
if ($role === 'teacher' && !$identifier) {
    $identifier = $email;
}
// Admin needs code
if ($role === 'admin' && !$identifier) {
    jsonError('Admin code is required.');
}

// ── Duplicate checks ─────────────────────────────────────────
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) jsonError('An account with this email already exists.');

if ($identifier) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE identifier = ?");
    $stmt->execute([$identifier]);
    if ($stmt->fetch()) jsonError('This identifier (REG NUMBER / code) is already registered.');
}

// ── Compute initials ─────────────────────────────────────────
$parts    = explode(' ', $fullName);
$initials = strtoupper(
    substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : '')
);

// ── Insert ───────────────────────────────────────────────────
$userId = bin2hex(random_bytes(8)); // 16-char hex
$hash   = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("
    INSERT INTO users
        (id, role, full_name, identifier, email, password_hash, status, subject, phone, avatar_initials)
    VALUES
        (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
");
$stmt->execute([$userId, $role, $fullName, $identifier, $email, $hash,
                $subject ?: null, $phone ?: null, $initials]);

jsonSuccess([
    'userId'  => $userId,
    'message' => 'Account created successfully. Please wait for admin approval before logging in.'
], 201);
