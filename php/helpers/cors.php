<?php
/**
 * CORS + Content-Type headers
 * Include at the very top of every API endpoint.
 */

// Allow same-origin AND XAMPP local dev (VS Code Live Server on :5500)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
$allowed = ['http://localhost', 'http://localhost:5500', 'http://127.0.0.1', 'http://127.0.0.1:5500'];
if (in_array($origin, $allowed, true) || $origin === '*') {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
