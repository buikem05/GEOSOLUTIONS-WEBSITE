<?php
/**
 * POST /php/api/auth/logout.php
 * Header: Authorization: Bearer <token>
 * Returns: { status, data: { message } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$headers = function_exists('getallheaders') ? getallheaders() : [];
$auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
    $pdo->prepare("DELETE FROM sessions WHERE token = ?")->execute([trim($m[1])]);
}

// Always succeed — idempotent logout
jsonSuccess(['message' => 'Logged out successfully.']);
