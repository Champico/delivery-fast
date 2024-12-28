<?php
// backend/controllers/CollaboratorController.php

include_once __DIR__ . '/../models/collaboratorModel.php';

class CollaboratorController {
    private $collaboratorModel;

    public function __construct($collaboratorModel) {
        $this->collaboratorModel = $collaboratorModel;
    }

    public function getAllcollaboratorsColab() {
        try{
            $collaborators = $this->collaboratorModel->getAllCollaboratorsColab();
            echo json_encode($collaborators, JSON_UNESCAPED_UNICODE);
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function createcollaboratorColab () {
        $data = json_decode(file_get_contents("php://input"), true);
        error_log("Datos recibidos en el controlador: " . print_r($data, true));

        if ($this->collaboratorModel->createCollaboratorColab($data)) {
            echo json_encode(['message' => 'Colaborador creado exitosamente']);
        } else {
            echo json_encode(['message' => 'Error al crear el colaborador']);
        }
    }

    public function deletecollaboratorColab($personalNumber) {
        try {
            if ($this->collaboratorModel->deleteCollaboratorColab($personalNumber)) {
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

    public function updatecollaboratorColab($personalNumber) {
        $data = json_decode(file_get_contents("php://input"), true);
        if ($this->collaboratorModel->updateCollaboratorColab($personalNumber, $data)) {
            echo json_encode(['message' => 'Colaborador actualizado exitosamente']);
        } else {
            echo json_encode(['message' => 'Error al actualizar el colaborador']);
        }
    }

    public function getInfocollaboratorByNumPerso($personalNumber) {
        try {
            $collaborator = $this->collaboratorModel->getInfoCollaboratorByNumPerso($personalNumber);
            if ($collaborator) {
                echo json_encode($collaborator, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Usuario no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function searchcollaborators($searchTerm) {
        try {
            $collaborators = $this->collaboratorModel->searchCollaborators($searchTerm);
            echo json_encode($collaborators, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }
}
?>