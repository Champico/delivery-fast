<?php
// delivery-fast/backend/routes/utilsRoutes.php

include_once(__DIR__ . '/../controllers/UtilsController.php');
include_once(__DIR__ . '/../models/UtilsModel.php');
include_once(__DIR__ . '/../config/conexion-bd.php');

$utilController = new UtilsController(new UtilsModel($conexionDB));

switch ($method) {
    case 'GET':
        switch ($action){
            case 'states': $utilController->getStatesOfMexico();
            break;

            default:
            http_response_code(404);
            echo json_encode(['message' => 'No existe la accion solicitada']);
            break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
