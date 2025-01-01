<?php
class TaxModel
{
    private $conexionDB;

    public function __construct($conexionDB)
    {
        $this->conexionDB = $conexionDB;
    }

    public function getTaxDataToTicket(){
        try{
            $query = "SELECT
                        d.RFC,
                        d.nombre,
                        d.apellido_paterno,
                        d.apellido_materno,
                        d.nombre_vialidad,
                        d.numero_exterior,
                        d.colonia,
                        d.municipio,
                        d.codigo_postal AS cp,
                        e.abreviatura_informal AS entidad_federativa,
                        d.regimen
                    FROM
                    	Datos_fiscales AS d
                    INNER JOIN
                    	Entidades_federativas AS e ON d.entidad_federativa = e.clave;";
            $result = $this->conexionDB->query($query);
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener los datos fiscale");
        }

        if ($result) {
            $row = $result->fetch_assoc();
            return $row;
        } else {
            return 0;
        }
    }

}
?>