<?php

class TaxController
{
    private $taxModel;

    public function __construct($taxModel)
    {
        $this->taxModel = $taxModel;
    }

    public function getTaxDataToTicket(){
        try{
            $data = $this->taxModel->getTaxDataToTicket();
            return $data ? $data : null;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }


}

?>