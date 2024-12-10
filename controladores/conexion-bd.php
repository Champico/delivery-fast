<?php
    $direccion = "";
    $nombreBD = "";
    $usuario = "";
    $password = "";


    $conexionBD = new mysqli($direccion,$usuario,$password,$nombreBD);
    
    if($conexionBD->connect_error){
        die("No se pudo realizar la conexion: " .$conexionBD->connect_error);
    }

?>