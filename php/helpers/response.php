<?php
/**
 * Unified JSON response helpers.
 * Calls exit so nothing is output after.
 */

function jsonSuccess($data = null, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['status' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['status' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
