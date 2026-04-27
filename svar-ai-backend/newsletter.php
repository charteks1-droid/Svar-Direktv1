<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = trim(strtolower($data['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ogiltig e-postadress']);
    exit;
}

$file = __DIR__ . '/emails.json';
$emails = file_exists($file) ? (json_decode(file_get_contents($file), true) ?? []) : [];

foreach ($emails as $row) {
    if ($row['email'] === $email) {
        echo json_encode(['success' => true]);
        exit;
    }
}

$emails[] = ['email' => $email, 'date' => date('Y-m-d H:i:s')];
file_put_contents($file, json_encode($emails, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
