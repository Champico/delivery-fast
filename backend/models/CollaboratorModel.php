<?php

// backend/models/UserModel.php
class CollaboratorModel {
    private $conexionDB;

    public function __construct($conexionDB) {
        $this->conexionDB = $conexionDB;
    }

    public function getCollaboratorByNumPerso($numero_personal) {
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

    public function getAllCollaboratorsColab() {
        try {
            $query = "
            SELECT 
                c.numero_personal, 
                c.nombre, 
                r.nombre_rol AS rol,
                c.telefono, 
                c.correo 
            FROM 
                Colaboradores c
            JOIN 
                roles r ON c.id_rol = r.id_rol";

            $result = $this->conexionDB->query($query);
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            return $users;
        } catch (Exception $e) {
            throw new Exception("Error al obtener los colaboradores: " . $e->getMessage());
        }
    }

    public function createCollaboratorColab($data) {
        if(session_start()){
            $numero_sucursal = $_SESSION['sucursal'];
            if($numero_sucursal === null){
                $numero_sucursal = "00000";
                }
            }else{
            $numero_sucursal = "00000";
        }    
        try {
            $query = "INSERT INTO Colaboradores (numero_personal, contrasena, nombre, apellido_paterno, apellido_materno, curp, correo, telefono, fecha_contratacion, id_rol, numero_sucursal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
            $stmt = $this->conexionDB->prepare($query);
    
            $fecha_contratacion = date('Y-m-d', strtotime($data['fecha_contratacion']));  // Asegura el formato adecuado
    
            $stmt->bind_param("sssssssssis", 
                $data['numero_personal'], 
                $data['contrasena'], 
                $data['nombre'], 
                $data['apellido_paterno'], 
                $data['apellido_materno'], 
                $data['curp'], 
                $data['correo'], 
                $data['telefono'],
                $fecha_contratacion,   
                $data['rol'],          
                $numero_sucursal
            );
    
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al crear el colaborador: " . $e->getMessage());
        }
    }
    
    public function deleteCollaboratorColab($personalNumber) {
        try {
            $query = "DELETE FROM Colaboradores WHERE numero_personal = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $personalNumber);
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al eliminar el colaborador: " . $e->getMessage());
        }
    }

    public function updateCollaboratorColab($personalNumber, $data) {
        try {
            $query = "UPDATE Colaboradores SET 
                nombre = ?, 
                apellido_paterno = ?, 
                apellido_materno = ?, 
                correo = ?, 
                telefono = ?, 
                id_rol = ? 
                WHERE numero_personal = ?";
            
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ssssssi", 
                $data['nombre'], 
                $data['apellido_paterno'], 
                $data['apellido_materno'], 
                $data['correo'], 
                $data['telefono'], 
                $data['rol'], 
                $personalNumber
            );

            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al actualizar el colaborador: " . $e->getMessage());
        }
    }

    public function getInfoCollaboratorByNumPerso($numero_personal) {
        try {
            $query = "SELECT * FROM Colaboradores WHERE numero_personal = ?";
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

    public function searchCollaborators($searchTerm) {
        try {
            $query = "
                SELECT 
                    c.numero_personal, 
                    c.nombre, 
                    r.nombre_rol AS rol,
                    c.telefono, 
                    c.correo 
                FROM 
                    Colaboradores c
                JOIN 
                    roles r ON c.id_rol = r.id_rol
                WHERE 
                    c.numero_personal LIKE ? 
                    OR c.nombre LIKE ? 
                    OR r.nombre_rol LIKE ?";

            $stmt = $this->conexionDB->prepare($query);
            $searchTerm = '%' . $searchTerm . '%';
            $stmt->bind_param('sss', $searchTerm, $searchTerm, $searchTerm);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            return $users;
        } catch (Exception $e) {
            throw new Exception("Error al buscar los colaboradores: " . $e->getMessage());
        }
    }
}
?>