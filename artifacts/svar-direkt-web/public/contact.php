<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$epost      = isset($data['epost'])      ? strip_tags(trim($data['epost']))      : '';
$kategori   = isset($data['kategori'])   ? strip_tags(trim($data['kategori']))   : '—';
$amne       = isset($data['amne'])       ? strip_tags(trim($data['amne']))       : '—';
$meddelande = isset($data['meddelande']) ? strip_tags(trim($data['meddelande'])) : '—';

if (empty($epost) || !filter_var($epost, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ogiltig e-postadress']);
    exit;
}

$to      = 'info@svardirekt.se';
$subject = '=?UTF-8?B?' . base64_encode('Fråga från hemsidan' . ($amne !== '—' ? ': ' . $amne : '') . ($kategori !== '—' ? ' [' . $kategori . ']' : '')) . '?=';

$message  = "================================================\n";
$message .= "NY FÖRFRÅGAN – svardirekt.site (kontaktformulär)\n";
$message .= "================================================\n\n";
$message .= "AVSÄNDARENS UPPGIFTER\n";
$message .= "----------------------\n";
$message .= "E-post:    $epost\n";
$message .= "Kategori:  $kategori\n";
$message .= "Ämne:      $amne\n\n";
$message .= "MEDDELANDE\n";
$message .= "----------\n";
$message .= "$meddelande\n\n";
$message .= "================================================\n";
$message .= "Svara direkt till: $epost\n";
$message .= "================================================\n";

$headers  = "From: noreply@svardirekt.se\r\n";
$headers .= "Reply-To: $epost\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Serverfel – kunde inte skicka meddelandet']);
}
