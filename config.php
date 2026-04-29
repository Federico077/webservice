<?php

$host = "localhost";
$user = "root";
$password = "";
$db = "gestione_contatti";

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die("Connessione fallita");
}