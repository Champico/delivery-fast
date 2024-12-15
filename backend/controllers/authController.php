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
        $username = $inputData['username'] ?? '';
        $password = $inputData['password'] ?? '';

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Por favor, complete ambos campos.']);
            exit;
        }

        $stmt = $this->userModel->getUserByUsername($username);
        if ($stmt->num_rows > 0) {
            $user = $stmt->fetch_assoc();


            if (password_verify($password, $user['password'])) {

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                
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