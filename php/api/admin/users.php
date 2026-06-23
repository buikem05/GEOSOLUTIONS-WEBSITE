<?php
/**
 * Admin User Management
 *
 * GET    /php/api/admin/users.php?role=&status=&q=   → list users
 * PATCH  /php/api/admin/users.php                    → update status
 *        Body: { userId, status: approved|rejected|suspended }
 * DELETE /php/api/admin/users.php?userId=            → delete user
 *
 * All routes require admin role.
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

$admin = requireAuth('admin');

switch ($_SERVER['REQUEST_METHOD']) {

    // ── List users ───────────────────────────────────────────
    case 'GET':
        $role   = $_GET['role']   ?? '';
        $status = $_GET['status'] ?? '';
        $q      = '%' . trim($_GET['q'] ?? '') . '%';

        $sql    = "SELECT * FROM users WHERE (full_name LIKE ? OR email LIKE ? OR identifier LIKE ?)";
        $params = [$q, $q, $q];

        if ($role)   { $sql .= " AND role = ?";   $params[] = $role; }
        if ($status) { $sql .= " AND status = ?"; $params[] = $status; }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        jsonSuccess(array_map('formatUser', $users));
        break;

    // ── Update user status ───────────────────────────────────
    case 'PATCH':
        $in     = json_decode(file_get_contents('php://input'), true) ?? [];
        $userId = trim($in['userId'] ?? '');
        $status = trim($in['status'] ?? '');

        if (!$userId || !$status) jsonError('userId and status are required.');

        $allowed = ['approved', 'rejected', 'suspended', 'pending'];
        if (!in_array($status, $allowed, true)) jsonError('Invalid status value.');

        // Prevent admin from demoting themselves
        if ($userId === $admin['id']) jsonError('You cannot change your own account status.');

        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$status, $userId]);

        if ($stmt->rowCount() === 0) jsonError('User not found.', 404);

        jsonSuccess(['userId' => $userId, 'newStatus' => $status]);
        break;

    // ── Delete user ──────────────────────────────────────────
    case 'DELETE':
        $userId = trim($_GET['userId'] ?? '');
        if (!$userId) jsonError('userId query param is required.');
        if ($userId === $admin['id']) jsonError('You cannot delete your own account.');

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);

        if ($stmt->rowCount() === 0) jsonError('User not found.', 404);

        jsonSuccess(['deleted' => $userId]);
        break;

    default:
        jsonError('Method not allowed', 405);
}
