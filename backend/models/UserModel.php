<?php

// backend/models/UserModel.php
class UserModel {
    private $conexionDB;

    public function __construct($conexionDB) {
        $this->conexionDB = $conexionDB;
    }

    public function getUserByNumPerso($numero_personal) {
        try {
            $query = "SELECT numero_personal, contrasena, nombre, id_rol, numero_sucursal FROM Colaboradores WHERE numero_personal = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $numero_personal);
            $stmt->execute();
            $result = $stmt->get_result();

            if($result->num_rows > 0){
                $row = $result->fetch_assoc();
                return $row;
            }else{
                return null;
            }

        } catch (mysqli_sql_exception $e) {
            throw new Exception("Error al obtener el usuario: " . $e->getMessage());
        }
        
    }
}

?>