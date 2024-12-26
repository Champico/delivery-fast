<?php

$start_time = microtime(true);

echo "<h1>Inyección de datos a mysql con php</h1>";
echo "<br><br> Empieza el proceso de inyectar los datos a partir del txt";
set_time_limit((1000*60*20));

$direction = 'localhost:3306';
$user = 'root';
$password = 'password2024';
$database = 'codigosPostalesDB';

$conexionCPDB = new mysqli($direction, $user, $password, $database);

if ($conexionCPDB->connect_error) {
    die("<br> Error en la conexión: " . $conexionCPDB->connect_error);
    exit();
}


$archivo = fopen('MX.txt', 'r');

if ($archivo) {
    $clave_estado_actual = 0;
    $clave_municipio_actual = 0;
    $id_municipio_actual = 0;

    while (($linea = fgets($archivo)) !== false) {
        $columnas = explode("\t", $linea);

        $clave_estado = $columnas[4];
        $clave_municipio = $columnas[6];
        $codigo_postal = $columnas[1];
        $nombre_asentamiento = $columnas[2];
        $nombre_municipio = $columnas[5];
        $latitud = $columnas[8];
        $longitud = $columnas[9];

        if($clave_estado_actual !== $clave_estado){
            echo "<br><br> ::::::::::::::::: NUEVO ESTADO > $columnas[5] < :::::::::::::::::::::::::<br>";
            $clave_estado_actual = $clave_estado;
        }

        if($clave_municipio_actual !== $clave_municipio){
            try{
                $id_municipio_actual = $id_municipio_actual + 1;
                echo "<br> > > > [$id_municipio_actual] Se inserta un nuevo municipio llamado $nombre_municipio < < <";
                $stmt_municipio = $conexionCPDB->prepare("INSERT INTO municipio (clave, nombre, clave_estado) VALUES (?, ?, ?);");
                $stmt_municipio->bind_param("sss", $clave_municipio, $nombre_municipio, $clave_estado);

                if (!$stmt_municipio->execute()){
                    echo "<br> Error al insertar municipio: " . $stmt_municipio->error . "<br>";
                } 

            }catch(Exception $e){
                echo "<br> Error al crear un municipio :,c por: ". $e->getMessage();
            }
            $clave_municipio_actual = $clave_municipio;
        }
        
        try{

            $stmt_asentamiento = $conexionCPDB->prepare(
                "INSERT INTO asentamiento (
                    cp,
                    nombre,
                    latitud_dec,
                    longitud_dec,
                    id_municipio_sis,
                    clave_estado)
                VALUES (?, ?, ?, ?, ?, ?);");

            $stmt_asentamiento->bind_param(
                "ssddss",
                $codigo_postal,
                $nombre_asentamiento,
                $latitud,
                $longitud,
                $id_municipio_actual,
                $clave_estado
            );

            if (!$stmt_asentamiento->execute()) echo "Error al insertar asentamiento: " . $stmt_asentamiento->error . "<br>";
        } catch(Exception $e){
            echo "<br>Error al crear el asentamiento :,c por " . $e->getMessage();
        }
    }


    fclose($archivo);
} else {
    echo "<br> Error al abrir el archivo.";
}


$end_time = microtime(true);

$execution_time = $end_time - $start_time;
echo "<br><br><h2> !Ha concluido el proceso¡ </h2>";
echo "<br><br>El script tardó: " . $execution_time . " segundos";


?>