<?php
/* 
Ubicacion:  delivery-fast/backend/index.php
API REST PHP
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");

require_once __DIR__ . '/config/LoaderEnv.php';

$method = $_SERVER['REQUEST_METHOD'];

$uri = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$resource = isset($uri[2]) ? $uri[2] : null;
$action = isset($uri[3]) ? $uri[3] : null;
$a2 = isset($uri[4]) ? $uri[4] : null;

switch($resource){
    case 'shipment':
        include_once 'routes/ShipmentRoutes.php';
        break;

    case 'users' :
        include_once 'routes/CollaboratorRoutes.php';
        break;

    case 'auth':
        include_once 'routes/AuthRoutes.php';
        break;
    
    case 'utils':
        include_once 'routes/UtilsRoutes.php';
        break;
    case 'packageEstatus':
        include_once 'routes/PackageEstatusRoutes.php';
        break;

    case 'branch':
        include_once 'routes/BranchRoutes.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['message' => "Recurso no encontrado en raiz el recurso solicitad es $resource"]);
        break;
}


?>