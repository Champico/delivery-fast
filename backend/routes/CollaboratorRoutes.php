<?php
// backend/routes/ColaboratorRoutes.php

include_once __DIR__ . '/../controllers/CollaboratorControllers.php';
include_once __DIR__ . '/../models/CollaboratorModel.php';
include_once __DIR__ . '/../config/ConnDeliveryDB.php';

try{
    $collaboratorController = new CollaboratorController(new CollaboratorModel(ConnDeliveryDB::getInstance()));
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['error' => 'Error 500 Internal Server', 'details'=>$e->getMessage()]);
}

switch ($method) {
    case 'GET':
        if (isset($uri[3])) {
            $personalNumber = $uri[3]; 
            $collaboratorController->getInfoCollaboratorByNumPerso($personalNumber);
        } elseif (isset($_GET['search'])) {
            $collaboratorController->searchCollaborators($searchTerm);
        } else {
            $collaboratorController->getAllCollaboratorsColab();
        }
        break;

    case 'POST':
        $collaboratorController->createCollaboratorColab();
        break;

    case 'DELETE':
        $personalNumber = isset($uri[3]) ? $uri[3] : null;
        if ($personalNumber) {
            $collaboratorController->deleteCollaboratorColab($personalNumber);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Número personal no proporcionado']);
        }
        break;

    case 'PUT':
        $personalNumber = isset($uri[3]) ? $uri[3] : null;
        if ($personalNumber) {
            $collaboratorController->updateCollaboratorColab($personalNumber);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Número personal no proporcionado']);
        }
        break;

        default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
?>