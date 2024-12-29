<?php
function validateJsonMiddleware(){

 $data = json_decode(file_get_contents("php://input"), true);

 // Verificar si el JSON es válido
 if (json_last_error() !== JSON_ERROR_NONE) {
     http_response_code(400);
     echo json_encode([
         "message" => "El cuerpo de la solicitud no contiene un JSON válido."
     ]);
     exit;
 }else{
    return $data;
 }

}
?>