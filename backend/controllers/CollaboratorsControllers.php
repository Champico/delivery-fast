<?php
// backend/controllers/CollaboratorsControllers.php

include_once __DIR__ . '/../models/UserModel.php';

class CollaboratorsControllers {
    private $userModel;

    public function __construct($userModel) {
        $this->userModel = $userModel;
    }

    public function getAllUsersColab() {
        try{
            $users = $this->userModel->getAllUsersColab();
            echo json_encode($users, JSON_UNESCAPED_UNICODE);
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function createUserColab () {
        $data = json_decode(file_get_contents("php://input"), true);
        error_log("Datos recibidos en el controlador: " . print_r($data, true));

        if ($this->userModel->createUserColab($data)) {
            echo json_encode(['message' => 'Colaborador creado exitosamente']);
        } else {
            echo json_encode(['message' => 'Error al crear el colaborador']);
        }
    }

    public function deleteUserColab($personalNumber) {
        try {
            if ($this->userModel->deleteUserColab($personalNumber)) {
                echo json_encode(['message' => 'Usuario eliminado exitosamente']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Error al eliminar el usuario: No encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
        
    }

    public function updateUserColab($personalNumber) {
        $data = json_decode(file_get_contents("php://input"), true);
        if ($this->userModel->updateUserColab($personalNumber, $data)) {
            echo json_encode(['message' => 'Colaborador actualizado exitosamente']);
        } else {
            echo json_encode(['message' => 'Error al actualizar el colaborador']);
        }
    }

    public function getInfoUserByNumPerso($personalNumber) {
        try {
            $user = $this->userModel->getInfoUserByNumPerso($personalNumber);
            if ($user) {
                echo json_encode($user, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Usuario no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }
}
?>