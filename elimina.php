<?php
header("Content-Type: application/json");
include "config.php";

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "ID non valido"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM utenti WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);