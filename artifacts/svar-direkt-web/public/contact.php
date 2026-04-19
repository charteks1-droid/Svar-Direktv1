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

$epost      = isset($data['epost'])      ? strip_tags(trim($data['epost']))      : '';
$kategori   = isset($data['kategori'])   ? strip_tags(trim($data['kategori']))   : '—';
$amne       = isset($data['amne'])       ? strip_tags(trim($data['amne']))       : '—';
$meddelande = isset($data['meddelande']) ? strip_tags(trim($data['meddelande'])) : '—';

if (empty($epost) || !filter_var($epost, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ogiltig e-postadress']);
    exit;
}

// ── SMTP config ──────────────────────────────────────────────────
$smtp_host  = 'smtp.hostinger.com';
$smtp_port  = 587;
$smtp_user  = 'info@svardirekt.se';
$smtp_pass  = 'Polska25!!!';
$from_email = 'info@svardirekt.se';
$to_email   = 'info@svardirekt.se';
// ────────────────────────────────────────────────────────────────

$subject = '=?UTF-8?B?' . base64_encode('Fråga från hemsidan' . ($amne !== '—' ? ': ' . $amne : '') . ($kategori !== '—' ? ' [' . $kategori . ']' : '')) . '?=';

$body  = "================================================\n";
$body .= "NY FORFRAGAN - svardirekt.site (kontaktformular)\n";
$body .= "================================================\n\n";
$body .= "AVSANDARDENS UPPGIFTER\n";
$body .= "----------------------\n";
$body .= "E-post:    $epost\n";
$body .= "Kategori:  $kategori\n";
$body .= "Amne:      $amne\n\n";
$body .= "MEDDELANDE\n";
$body .= "----------\n";
$body .= "$meddelande\n\n";
$body .= "================================================\n";
$body .= "Svara direkt till: $epost\n";
$body .= "================================================\n";

function smtp_send($host, $port, $user, $pass, $from, $to, $subject, $body, $reply_to = '') {
    $sock = @fsockopen($host, $port, $errno, $errstr, 30);
    if (!$sock) return false;

    $read = function() use ($sock) {
        $out = '';
        while ($line = fgets($sock, 512)) {
            $out .= $line;
            if ($line[3] === ' ') break;
        }
        return $out;
    };

    $read(); // 220 greeting
    fwrite($sock, "EHLO svardirekt.se\r\n"); $read();
    fwrite($sock, "STARTTLS\r\n");
    if (strpos($read(), '220') === false) { fclose($sock); return false; }

    if (!stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT)) {
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    }

    fwrite($sock, "EHLO svardirekt.se\r\n"); $read();
    fwrite($sock, "AUTH LOGIN\r\n"); $read();
    fwrite($sock, base64_encode($user) . "\r\n"); $read();
    fwrite($sock, base64_encode($pass) . "\r\n");
    $auth = $read();
    if (strpos($auth, '235') === false) { fclose($sock); return false; }

    fwrite($sock, "MAIL FROM:<$from>\r\n"); $read();
    fwrite($sock, "RCPT TO:<$to>\r\n"); $read();
    fwrite($sock, "DATA\r\n"); $read();

    $reply_header = $reply_to ? "Reply-To: <$reply_to>\r\n" : '';
    $msg  = "From: Svar Direkt <$from>\r\n";
    $msg .= "To: <$to>\r\n";
    $msg .= "Subject: $subject\r\n";
    $msg .= $reply_header;
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: 8bit\r\n";
    $msg .= "\r\n";
    $msg .= $body . "\r\n.\r\n";

    fwrite($sock, $msg);
    $data_resp = $read();
    fwrite($sock, "QUIT\r\n");
    fclose($sock);

    return strpos($data_resp, '250') !== false;
}

$sent = smtp_send($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $from_email, $to_email, $subject, $body, $epost);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Serverfel – kunde inte skicka meddelandet']);
}
