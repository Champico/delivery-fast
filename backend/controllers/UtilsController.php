<?php

//  delivery-fast/backend/controllers/UtilsController.php

class UtilsController{
    private $zipCodeController;
    private $shipmentModel;

    public function __construct($shipmentModel, $zipCodesModel){
        $this->zipCodeController = new ZipCodeController($zipCodesModel);
        $this->shipmentModel = $shipmentModel;
    }

    public function getStatesOfMexico(){
        try{
        $estados = $this->zipCodeController->getStatesOfMexico();
        echo json_encode($estados, JSON_UNESCAPED_UNICODE);
    }catch(Exception $e){
        http_response_code(422);
        echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    }
}



?>