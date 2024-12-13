<?php
// Delivery-Fast/backend/conexion-bd.php

//Obtener conexion a la base de datos
try {
    loadEnv(__DIR__ . '/config/.env');
    $conexionBD = createConexionDB();
} catch (Exception $e) {
    $msg = $e->getMessage();
    if($msg == 'ENV_ERROR'){
        echo "<span class='error'>Not found</span>";
    }else if($msg == 'BD_ERROR'){
        echo "<span class='error'>Error del servidor</span>";
    }
}


// Funcion para cargar el archivo .env
function loadEnv($file)
{
    if (!file_exists($file)) {
        throw new Exception("ENV_ERROR");
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);

        $key = trim($key);
        $value = trim($value);

        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

//Funcion para crear la base de datos
function createConexionDB()
{
    $direccion = getenv('DATABASE_HOST');
    $nombreBD = getenv('DATABASE_NAME');
    $usuario = getenv('DATABASE_USER');
    $password = getenv('DATABASE_PASSWORD');

    if (!$direccion || !$nombreBD || !$usuario || !$password) {
        throw new Exception("BD_ERROR");
    }

    $conexionBD = new mysqli($direccion, $usuario, $password, $nombreBD);

    if ($conexionBD->connect_error) {
        die("No se pudo realizar la conexion: " . $conexionBD->connect_error);
    }

    return $conexionBD;
}
