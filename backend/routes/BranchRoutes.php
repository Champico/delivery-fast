<?php
include_once(__DIR__ . '/../controllers/BranchController.php');
include_once(__DIR__ . '/../models/BranchModel.php');
include_once(__DIR__ . '/../config/ConnDeliveryDB.php');

$branchController = null;

try{
    $branchController = new BranchController(new BranchModel(ConnDeliveryDB::getInstance()));
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['error' => 'Error 500 Internal Server', 'details'=>$e->getMessage()]);
}

switch ($method) {
    case 'GET':
        if(isset($_GET['numero_sucursal'])) {
            $branchController->get();
        }else{
            http_response_code(405);
            echo json_encode(['error' => 'Metodo no valido']);
            break; 
        }
                
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

?>