<?php
// backend/controllers/authController.php


session_start();
include_once __DIR__ . '/../config/conexion-bd.php';

class AuthController {

    private $userModel;

    public function __construct($userModel) {
        $this->userModel = $userModel;
    }

    public function login() {
        $inputData = json_decode(file_get_contents("php://input"), true);
        $numero_personal = $inputData['username'] ?? '';
        $password = $inputData['password'] ?? '';

        if (empty($numero_personal) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Por favor, complete ambos campos.']);
            exit;
        }

        $stmt = $this->userModel->getUserByNumPerso($numero_personal);

        if ($stmt) {
             if ($password === $stmt['contrasena']) {

                $_SESSION['user_id'] = $stmt['numero_personal'];
                $_SESSION['username'] = $stmt['nombre'];
                $_SESSION['role'] = $stmt['id_rol'];
                $_SESSION['sucursal'] =$stmt['numero_sucursal'];
                
                echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
        }
    }
}
?>