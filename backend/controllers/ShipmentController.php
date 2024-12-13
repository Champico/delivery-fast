<?php

class ShipmentController{

    public static function getShipments(){
        echo json_encode(['message' => 'Lista de envíos'], JSON_UNESCAPED_UNICODE);    
    }
    
    public static function getShipment($guia){
        echo json_encode(['message' => "Envío con la guía " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public static function createShipment(){
        echo json_encode(['message' => 'Se creo el envio'], JSON_UNESCAPED_UNICODE);
    }

    public static function updateShipment($guia){
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteShipment($guia){
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    } 


}

?>