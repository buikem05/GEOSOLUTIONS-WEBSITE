<?php
/**
 * POST /php/api/auth/upload_avatar.php  (multipart/form-data)
 * Header: Authorization: Bearer <token>
 * Field:  avatar  (image file, max 2MB, jpg/png/gif/webp)
 * Returns: { status, data: { avatarUrl } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$user = requireAuth();

if (empty($_FILES['avatar'])) jsonError('No file uploaded. Use field name "avatar".');

$file   = $_FILES['avatar'];
$maxMB  = 2;
$maxBytes = $maxMB * 1024 * 1024;

if ($file['error'] !== UPLOAD_ERR_OK) jsonError('File upload error. Please try again.');
if ($file['size'] > $maxBytes)        jsonError("File too large. Maximum size is {$maxMB}MB.");

$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$mime    = mime_content_type($file['tmp_name']);
if (!in_array($mime, $allowed, true)) {
    jsonError('Invalid file type. Allowed: JPG, PNG, GIF, WEBP.');
}

$ext     = match($mime) {
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/gif'  => 'gif',
    'image/webp' => 'webp',
    default      => 'jpg',
};

// Save to images/avatars/{userId}.{ext}  (relative to project root)
$uploadDir = __DIR__ . '/../../../../images/avatars/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$filename  = $user['id'] . '.' . $ext;
$destPath  = $uploadDir . $filename;
$publicUrl = '../images/avatars/' . $filename; // relative from pages/

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonError('Could not save the file. Check server write permissions.');
}

// Update DB
$pdo->prepare("UPDATE users SET avatar_url = ? WHERE id = ?")
    ->execute([$publicUrl, $user['id']]);

jsonSuccess(['avatarUrl' => $publicUrl]);
