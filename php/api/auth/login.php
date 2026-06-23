<?php
/**
 * POST /php/api/auth/login.php
 * Body: { role, identifier, password }
 * Returns: { status, data: { token, user } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$in         = json_decode(file_get_contents('php://input'), true) ?? [];
$role       = trim($in['role']       ?? '');
$identifier = trim($in['identifier'] ?? '');
$password   = $in['password']        ?? '';

if (!$role || !$identifier || !$password) {
    jsonError('role, identifier, and password are required.');
}

// ── Lookup user ───────────────────────────────────────────────
$stmt = $pdo->prepare("SELECT * FROM users WHERE role = ? AND identifier = ?");
$stmt->execute([$role, $identifier]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    // Same message for both — prevents user enumeration
    jsonError('Invalid credentials. Please check your role, ID, and password.', 401);
}

// ── Account status checks ─────────────────────────────────────
switch ($user['status']) {
    case 'pending':
        jsonError('Your account is pending admin approval. Please check back later.', 403);
    case 'rejected':
        jsonError('Your account application was rejected. Contact the administration.', 403);
    case 'suspended':
        jsonError('Your account has been suspended. Contact the administration.', 403);
}

// ── Create session token ──────────────────────────────────────
$token     = bin2hex(random_bytes(32)); // 64-char hex
$expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

$pdo->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)")
    ->execute([$user['id'], $token, $expiresAt]);

// Clean up stale sessions for this user
$pdo->prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at < NOW()")
    ->execute([$user['id']]);

jsonSuccess([
    'token' => $token,
    'user'  => formatUser($user),
]);
