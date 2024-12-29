<?php
require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

try {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    $dotenv->required([
        'DATABASE_HOST',
        'DATABASE_USER',
        'DATABASE_PASSWORD',
        'DATABASE_NAME',
        'DATABASE2_NAME',
        'GOOGLE_API_KEY'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Ocurrio un error en el servidor"]);
}
