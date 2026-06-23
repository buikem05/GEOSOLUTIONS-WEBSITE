<?php
/**
 * GET /php/api/auth/me.php
 * Header: Authorization: Bearer <token>
 * Returns: { status, data: { ...user } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$user = requireAuth(); // 401 if token missing/invalid/expired

jsonSuccess(formatUser($user));
