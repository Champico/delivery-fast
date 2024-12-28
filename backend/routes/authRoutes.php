<?php

// backend/routes/authRoutes.php

include_once __DIR__ . '/../controllers/AuthController.php';
include_once __DIR__ . '/../models/UserModel.php';
include_once __DIR__ . '/../config/ConnDeliveryDB.php';

$authController = new AuthController(new AuthModel(ConnDeliveryDB::getInstance()));

switch ($method) {
    case 'POST':
            $authController->login();
        break;


    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}

?>