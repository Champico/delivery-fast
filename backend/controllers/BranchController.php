<?php

class BranchController
{
    private $branchModel;

    public function __construct($branchModel)
    {
        $this->branchModel = $branchModel;
    }

    public function get()
    {

        $numero_sucursal = $_GET["numero_sucursal"];

        try {
            $envio = $this->branchModel->get($numero_sucursal);
            http_response_code(200);
            echo json_encode($envio, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

}
?>