<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$fornamn     = isset($data['fornamn'])     ? strip_tags(trim($data['fornamn']))     : '';
$efternamn   = isset($data['efternamn'])   ? strip_tags(trim($data['efternamn']))   : '';
$epost       = isset($data['epost'])       ? strip_tags(trim($data['epost']))       : '';
$myndighet   = isset($data['myndighet'])   ? strip_tags(trim($data['myndighet']))   : '(ej valt)';
$beskrivning = isset($data['beskrivning']) ? strip_tags(trim($data['beskrivning'])) : '';

if (empty($epost) || !filter_var($epost, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ogiltig e-postadress']);
    exit;
}
if (empty($beskrivning)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Beskriv din situation']);
    exit;
}

$to      = 'info@svardirekt.se';
$subject = '=?UTF-8?B?' . base64_encode('Nytt arende: ' . $myndighet . ' - ' . $fornamn . ' ' . $efternamn) . '?=';

$message  = "NY FORFRAGAN - svardirekt.site\n";
$message .= "================================\n\n";
$message .= "Fornamn:    " . ($fornamn ?: '-') . "\n";
$message .= "Efternamn:  " . ($efternamn ?: '-') . "\n";
$message .= "E-post:     $epost\n";
$message .= "Myndighet:  $myndighet\n\n";
$message .= "BESKRIVNING:\n";
$message .= "$beskrivning\n\n";
$message .= "================================\n";
$message .= "Svara till: $epost\n";
$message .= "Forsta svaret ar gratis. Fortsattning: 99 kr/svar.\n";

$headers  = "From: info@svardirekt.se\r\n";
$headers .= "Reply-To: $epost\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Serverfel']);
}
