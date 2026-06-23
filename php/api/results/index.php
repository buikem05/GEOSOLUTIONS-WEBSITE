<?php
/**
 * Student Academic Results
 *
 * GET  /php/api/results/index.php              → own results (student)
 * GET  /php/api/results/index.php?studentId=  → any student's results (teacher/admin)
 * POST /php/api/results/index.php             → add/update result (teacher/admin)
 *      Body: { studentId, subject, score, term, sessionYear }
 */
require_once __DIR__ . '/../../helpers/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_middleware.php';

$user = requireAuth();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        if ($user['role'] === 'student') {
            $studentId = $user['id'];
        } else {
            // Teachers and admins can query any student
            $studentId = trim($_GET['studentId'] ?? '');
            if (!$studentId) jsonError('studentId query param is required.', 400);
        }

        $stmt = $pdo->prepare("
            SELECT id, subject, score, grade, term, session_year, created_at
            FROM   results
            WHERE  student_id = ?
            ORDER  BY session_year DESC, term ASC, subject ASC
        ");
        $stmt->execute([$studentId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // camelCase for frontend
        $results = array_map(fn($r) => [
            'id'          => $r['id'],
            'subject'     => $r['subject'],
            'score'       => (float)$r['score'],
            'grade'       => $r['grade'],
            'term'        => $r['term'],
            'sessionYear' => $r['session_year'],
            'createdAt'   => $r['created_at'],
        ], $rows);

        jsonSuccess($results);
        break;

    case 'POST':
        if (!in_array($user['role'], ['teacher', 'admin'], true)) {
            jsonError('Only teachers and admins can add results.', 403);
        }

        $in          = json_decode(file_get_contents('php://input'), true) ?? [];
        $studentId   = trim($in['studentId']   ?? '');
        $subject     = trim($in['subject']     ?? '');
        $score       = (float)($in['score']    ?? -1);
        $term        = trim($in['term']        ?? '');
        $sessionYear = trim($in['sessionYear'] ?? '');

        if (!$studentId || !$subject || $score < 0 || !$term || !$sessionYear) {
            jsonError('studentId, subject, score, term, and sessionYear are all required.');
        }
        if ($score < 0 || $score > 100) jsonError('Score must be between 0 and 100.');

        // Compute grade
        $grade = match(true) {
            $score >= 75 => 'A1',
            $score >= 70 => 'B2',
            $score >= 65 => 'B3',
            $score >= 60 => 'C4',
            $score >= 55 => 'C5',
            $score >= 50 => 'C6',
            $score >= 45 => 'D7',
            $score >= 40 => 'E8',
            default      => 'F9',
        };

        // Upsert (update if same student+subject+term+year already exists)
        $pdo->prepare("
            INSERT INTO results (student_id, subject, score, grade, term, session_year, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE score = VALUES(score), grade = VALUES(grade), created_by = VALUES(created_by)
        ")->execute([$studentId, $subject, $score, $grade, $term, $sessionYear, $user['id']]);

        jsonSuccess(['grade' => $grade, 'message' => 'Result saved.'], 201);
        break;

    default:
        jsonError('Method not allowed', 405);
}
