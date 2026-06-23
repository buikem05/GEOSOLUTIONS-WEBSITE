<?php
/**
 * GET /php/api/payments/history.php
 * Header: Authorization: Bearer <token>
 * Returns the logged-in student's payment history.
 * Admins may pass ?studentId= to view any student.
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('Method not allowed', 405);

$user = requireAuth();

if ($user['role'] === 'admin' && !empty($_GET['studentId'])) {
    $studentId = trim($_GET['studentId']);
} else {
    $studentId = $user['id'];
}

$stmt = $pdo->prepare("
    SELECT p.id, p.reference, p.amount, p.payment_method,
           p.status, p.payment_date,
           s.current_period_end, s.status AS subscription_status
    FROM   payments p
    LEFT   JOIN student_subscriptions s ON s.student_id = p.student_id
    WHERE  p.student_id = ?
    ORDER  BY p.payment_date DESC
");
$stmt->execute([$studentId]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$history = array_map(fn($r) => [
    'id'                 => $r['id'],
    'reference'          => $r['reference'],
    'amount'             => (float)$r['amount'],
    'method'             => $r['payment_method'],
    'status'             => $r['status'],
    'date'               => $r['payment_date'],
    'subscriptionExpiry' => $r['current_period_end'],
    'subscriptionStatus' => $r['subscription_status'] ?? 'expired',
], $rows);

jsonSuccess($history);
