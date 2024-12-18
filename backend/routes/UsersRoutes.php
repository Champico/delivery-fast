<?php
// backend/routes/UserRoutes.php

include_once __DIR__ . '/../controllers/CollaboratorsControllers.php';
include_once __DIR__ . '/../models/UserModel.php';
include_once __DIR__ . '/../config/conexion-bd.php';

$userModel = new UserModel($conexionDB);
$colabController = new CollaboratorsControllers($userModel);

switch ($method) {
    case 'GET':
        if (isset($uri[4])) {
            $personalNumber = $uri[4]; 
            $colabController->getInfoUserByNumPerso($personalNumber);
        } elseif (isset($_GET['search'])) {
            $searchTerm = $_GET['search'];
            $colabController->searchUsers($searchTerm);
        } else {
            $colabController->getAllUsersColab();
        }
        break;

    case 'POST':
        $colabController->createUserColab();
        break;

    case 'DELETE':
        $personalNumber = isset($uri[4]) ? $uri[4] : null;
        if ($personalNumber) {
            $colabController->deleteUserColab($personalNumber);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Número personal no proporcionado']);
        }
        break;

    case 'PUT':
        $personalNumber = isset($uri[4]) ? $uri[4] : null;
        if ($personalNumber) {
            $colabController->updateUserColab($personalNumber);
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