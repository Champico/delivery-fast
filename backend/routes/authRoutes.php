<?php

// backend/routes/authRoutes.php

include_once __DIR__ . '/../controllers/authController.php';
include_once __DIR__ . '/../models/UserModel.php';
include_once __DIR__ . '/../config/conexion-bd.php';

$authController = new AuthController(new UserModel($conexionDB));

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