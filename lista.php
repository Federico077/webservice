<?php
header("Content-Type: application/json");
include "config.php";

$result = $conn->query("SELECT id, nome, email, data_creazione FROM utenti ORDER BY id DESC");

$utenti = [];

while ($row = $result->fetch_assoc()) {
    $utenti[] = $row;
}

echo json_encode($utenti);