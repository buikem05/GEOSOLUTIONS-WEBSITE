<?php
/**
 * Teacher Salary Payout Requests
 *
 * POST /php/api/payments/teacher_payout.php   → submit payout request (teacher)
 * GET  /php/api/payments/teacher_payout.php   → list requests (admin or own teacher)
 * PATCH /php/api/payments/teacher_payout.php  → mark processed/rejected (admin)
 *       Body: { requestId, status: processed|rejected }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

$user = requireAuth();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'POST':
        if ($user['role'] !== 'teacher') jsonError('Only teachers can submit payout requests.', 403);

        $in = json_decode(file_get_contents('php://input'), true) ?? [];
        $bankName      = trim($in['bankName']      ?? '');
        $accountNumber = trim($in['accountNumber'] ?? '');
        $accountName   = trim($in['accountName']   ?? '');
        $amount        = (float)($in['amount']     ?? 0);
        $notes         = trim($in['notes']         ?? '');

        if (!$bankName || !$accountNumber || !$accountName || $amount <= 0) {
            jsonError('bankName, accountNumber, accountName, and amount are required.');
        }

        $pdo->prepare("
            INSERT INTO teacher_payout_requests
                (teacher_id, bank_name, account_number, account_name, amount, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ")->execute([$user['id'], $bankName, $accountNumber, $accountName, $amount, $notes ?: null]);

        jsonSuccess(['message' => 'Payout request submitted. Admin will process it shortly.'], 201);
        break;

    case 'GET':
        if ($user['role'] === 'admin') {
            $stmt = $pdo->prepare("
                SELECT r.*, u.full_name AS teacher_name, u.email AS teacher_email
                FROM   teacher_payout_requests r
                JOIN   users u ON u.id = r.teacher_id
                ORDER  BY r.created_at DESC
            ");
            $stmt->execute();
        } else {
            if ($user['role'] !== 'teacher') jsonError('Access denied.', 403);
            $stmt = $pdo->prepare("
                SELECT * FROM teacher_payout_requests
                WHERE  teacher_id = ?
                ORDER  BY created_at DESC
            ");
            $stmt->execute([$user['id']]);
        }

        jsonSuccess($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'PATCH':
        if ($user['role'] !== 'admin') jsonError('Only admins can process payouts.', 403);

        $in        = json_decode(file_get_contents('php://input'), true) ?? [];
        $requestId = (int)($in['requestId'] ?? 0);
        $status    = trim($in['status']     ?? '');

        if (!$requestId || !in_array($status, ['processed', 'rejected'], true)) {
            jsonError('requestId and status (processed|rejected) are required.');
        }

        $processedAt = $status === 'processed' ? date('Y-m-d H:i:s') : null;

        $stmt = $pdo->prepare("
            UPDATE teacher_payout_requests
            SET status = ?, processed_at = ?
            WHERE id = ?
        ");
        $stmt->execute([$status, $processedAt, $requestId]);

        if ($stmt->rowCount() === 0) jsonError('Payout request not found.', 404);

        jsonSuccess(['requestId' => $requestId, 'newStatus' => $status]);
        break;

    default:
        jsonError('Method not allowed', 405);
}
