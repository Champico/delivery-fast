<?php

//  delivery-fast/backend/controllers/UtilsController.php

class UtilsController{
    private $utilsModel;

    public function __construct($utilsModel){
        $this->utilsModel = $utilsModel;
    }

    public function getStatesOfMexico(){
        try{
        $estados = $this->utilsModel->getAllStates();
        echo json_encode($estados, JSON_UNESCAPED_UNICODE);
    }catch(Exception $e){
        http_response_code(422);
        echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    }
}



?>