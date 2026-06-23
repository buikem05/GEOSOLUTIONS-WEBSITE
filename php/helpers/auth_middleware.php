<?php
/**
 * Auth middleware.
 * Requires database.php to be loaded first (provides $pdo).
 *
 * Usage in any protected endpoint:
 *   $user = requireAuth();          // any logged-in user
 *   $user = requireAuth('admin');   // admin only
 */

function requireAuth(string $role = ''): array {
    global $pdo;

    $headers = function_exists('getallheaders') ? getallheaders() : [];
    // Fallback for servers that don't expose getallheaders()
    if (empty($headers)) {
        foreach ($_SERVER as $k => $v) {
            if (str_starts_with($k, 'HTTP_')) {
                $key = str_replace('_', '-', substr($k, 5));
                $headers[$key] = $v;
            }
        }
    }

    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        jsonError('Authentication required. Please log in.', 401);
    }

    $token = trim($m[1]);

    $stmt = $pdo->prepare("
        SELECT u.*
        FROM   sessions s
        JOIN   users    u ON u.id = s.user_id
        WHERE  s.token      = ?
          AND  s.expires_at > NOW()
          AND  u.status     = 'approved'
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        jsonError('Session expired or invalid. Please log in again.', 401);
    }

    if ($role && $user['role'] !== $role) {
        jsonError('Access denied. Insufficient permissions.', 403);
    }

    return $user;
}

/**
 * Map a DB user row to the camelCase shape the frontend expects.
 */
function formatUser(array $u): array {
    return [
        'id'         => $u['id'],
        'role'       => $u['role'],
        'fullName'   => $u['full_name'],
        'identifier' => $u['identifier'],
        'email'      => $u['email'],
        'status'     => $u['status'],
        'subject'    => $u['subject']    ?? null,
        'phone'      => $u['phone']      ?? null,
        'avatar'     => $u['avatar_initials'] ?? null,
        'avatarUrl'  => $u['avatar_url'] ?? null,
        'createdAt'  => $u['created_at'] ?? null,
    ];
}
