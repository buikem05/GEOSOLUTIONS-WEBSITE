<?php
/**
 * PATCH /php/api/auth/update_profile.php
 * Header: Authorization: Bearer <token>
 * Body: { fullName?, email?, phone?, subject? }
 * Returns: { status, data: { ...updatedUser } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'PATCH' && $method !== 'POST') jsonError('Method not allowed', 405);

$user = requireAuth();
$in   = json_decode(file_get_contents('php://input'), true) ?? [];

$fullName = trim($in['fullName'] ?? $user['full_name']);
$email    = strtolower(trim($in['email']   ?? $user['email']));
$phone    = trim($in['phone']   ?? $user['phone'] ?? '');
$subject  = trim($in['subject'] ?? $user['subject'] ?? '');

if (!$fullName) jsonError('Full name cannot be empty.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('Invalid email address.');

// Ensure email not taken by someone else
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
$stmt->execute([$email, $user['id']]);
if ($stmt->fetch()) jsonError('This email is already used by another account.');

// Compute new initials if name changed
$parts    = explode(' ', $fullName);
$initials = strtoupper(
    substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : '')
);

$pdo->prepare("
    UPDATE users
    SET full_name = ?, email = ?, phone = ?, subject = ?, avatar_initials = ?
    WHERE id = ?
")->execute([$fullName, $email, $phone ?: null, $subject ?: null, $initials, $user['id']]);

// Return fresh user
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user['id']]);

jsonSuccess(formatUser($stmt->fetch(PDO::FETCH_ASSOC)));
