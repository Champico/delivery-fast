<?php
// backend/controllers/authController.php

include_once(__DIR__ . '/../middlewares/validateJsonMiddleware.php');

class AuthController
{

    private $authModel;

    public function __construct($authModel)
    {
        $this->authModel = $authModel;
    }

    public function login()
    {
        $inputData =  validateJsonMiddleware();

        $this->validateData($inputData);

        try {
            $user = $this->authModel->login($inputData['username'], $inputData['password']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
            exit;
        }


        if ($user) {
            if (session_status() !== PHP_SESSION_ACTIVE) {

                session_set_cookie_params([
                    'lifetime' => 0, // La cookie expira al cerrar el navegador
                    'path' => '/', // Disponible en toda la aplicación
                    'domain' => '', // Usar el dominio actual
                    'secure' => false, // Solo enviar cookies a través de HTTPS
                    'httponly' => true, // La cookie no es accesible desde JavaScript
                ]);

                session_start();

                $_SESSION['user_id'] = $user['numero_personal'];
                $_SESSION['username'] = $user['nombre'];
                $_SESSION['role'] = $user['id_rol'];
                $_SESSION['sucursal'] = $user['numero_sucursal'];
            } else {
                session_regenerate_id(true);
            }
            http_response_code(200);
            echo json_encode(['session' => $user]);
        } else {
            if (session_status() === PHP_SESSION_ACTIVE) {
                session_unset();
                session_destroy();
            }
            http_response_code(404);
            echo json_encode(['message' => 'Usuario no encontrado.'], JSON_UNESCAPED_UNICODE);
        }
    }



    private function validateData($inputData)
    {
        $numero_personal = $inputData['username'] ?? '';
        $password = $inputData['password'] ?? '';

        if (empty($numero_personal) && empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Ingrese el campo de usuario y contraseña']);
            exit;
        }

        if (empty($numero_personal)) {
            http_response_code(400);
            echo json_encode(['message' => 'El campo de usuario es obligatorio']);
            exit;
        }

        if (empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'El campo de contraseña es obligatorio']);
            exit;
        }
    }
}
