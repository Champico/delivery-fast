<?php

class UtilsModel{
    private $conexionDB;

    public function __construct($conexionDB){
        $this->conexionDB = $conexionDB;
    }

    public function getAllStates(){
        try {
            $sql = "SELECT id_entidad, nombre, abreviatura FROM Entidades_Federativas";
            $result = $this->conexionDB->query($sql);
            if ($result->num_rows > 0) {
                $states = [];
                while ($row = $result->fetch_assoc()) {
                    $states[] = $row;
                }
                return $states;
            } else {
                return null;
            }
        } catch(Exception $e){
            return null;
        }
    }
}



?>