<?php
header("Content-Type: application/json");
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$nome = trim($data["nome"] ?? "");
$email = trim($data["email"] ?? "");

if (!$nome || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["messaggio" => "Dati non validi"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO utenti (nome, email) VALUES (?, ?)");
$stmt->bind_param("ss", $nome, $email);
$stmt->execute();

echo json_encode(["messaggio" => "Utente salvato"]);