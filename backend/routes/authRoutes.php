<?php

// backend/routes/authRoutes.php

include_once __DIR__ . '/../controllers/AuthController.php';
include_once __DIR__ . '/../models/AuthModel.php';
include_once __DIR__ . '/../config/ConnDeliveryDB.php';

$authController = null;

try{
    $authController = new AuthController(new AuthModel(ConnDeliveryDB::getInstance()));
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['error' => 'Error 500 Internal Server', 'details'=>$e->getMessage()]);
}

switch ($method) {
    case 'POST':
        if(isset($action) && $action="login"){
            $authController->login();
        }else{
            http_response_code(405);
            echo json_encode(['message' => 'Método no permitido']);
            break; 
        }
    break;

    case 'GET':
        if(isset($action) && $action="logout"){
            $authController->logout();
        }else{
            http_response_code(405);
            echo json_encode(['message' => 'Método no permitido']);
        }
    break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}

?>