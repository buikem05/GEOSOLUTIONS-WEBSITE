<?php
/**
 * GET /php/api/admin/stats.php
 * Header: Authorization: Bearer <token>  (admin)
 * Returns: { status, data: { totalStudents, totalTeachers, totalPending, totalUsers, totalRevenue } }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

requireAuth('admin');

$stats = $pdo->query("
    SELECT
        SUM(role = 'student'  AND status = 'approved') AS totalStudents,
        SUM(role = 'teacher'  AND status = 'approved') AS totalTeachers,
        SUM(status = 'pending')                         AS totalPending,
        COUNT(*)                                        AS totalUsers
    FROM users
")->fetch(PDO::FETCH_ASSOC);

$revenue = $pdo->query("
    SELECT COALESCE(SUM(amount), 0) AS totalRevenue
    FROM payments
    WHERE status = 'success'
")->fetch(PDO::FETCH_ASSOC);

jsonSuccess([
    'totalStudents' => (int)($stats['totalStudents'] ?? 0),
    'totalTeachers' => (int)($stats['totalTeachers'] ?? 0),
    'totalPending'  => (int)($stats['totalPending']  ?? 0),
    'totalUsers'    => (int)($stats['totalUsers']    ?? 0),
    'totalRevenue'  => (float)($revenue['totalRevenue'] ?? 0),
]);
