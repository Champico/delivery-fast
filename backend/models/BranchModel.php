<?php
class BranchModel{

private $conexionDB;

    public function __construct($conexionDB)
    {
        $this->conexionDB = $conexionDB;
    }


    public function get($numero_sucursal){
        try {
            $query = "SELECT * FROM Sucursales WHERE numero_sucursal = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $numero_sucursal);
            $stmt->execute();
            $result = $stmt->get_result();
            $branch = $result->fetch_assoc();
            return  $branch ?  $branch : null;
        } catch (Exception $e) {
            throw new Exception("Ocurrio un error en el servidor");
        }
    }


}
?>