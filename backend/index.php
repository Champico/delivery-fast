<?php
/* 
Ubicacion:  delivery-fast/backend/index.php
API REST PHP
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");


$method = $_SERVER['REQUEST_METHOD'];

$uri = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$resource = isset($uri[3]) ? $uri[3] : null;
$action = isset($uri[4]) ? $uri[4] : null;



switch($resource){
    case 'shipment':
        include_once 'routes/shipmentRoutes.php';
        break;

    case 'users' :
        include_once 'routes/usersRoutes.php';
        break;

    case 'auth':
        include_once 'routes/authRoutes.php';
        break;
        

    default:
        http_response_code(404);
        echo json_encode(['message' => "Recurso no encontrado en raiz el recurso solicitad es $resource"]);
        break;
}

?>