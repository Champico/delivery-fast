<?php
    class ZipCodeModel {
        private $conexionDB;

        public function __construct($conexionDB){
            $this->conexionDB = $conexionDB;
        }

        public function getAllStates(){
            try {
                $sql = "SELECT clave, nombre, abreviatura FROM Estados";
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


        public function getUseGoogleApi(){
            try {
                $sql = "SELECT use_google_services FROM Configuracion_global";
                $result = $this->conexionDB->query($sql);
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    if($row['use_google_api'] === 'true'){
                        return true;
                    } else{
                        return false;
                    }
                } else {
                    return false;
                }
            } catch(Exception $e){
                return false;
            }
        }

        public function setUseGoogleApi($new_value){
            if(!$new_value || !is_bool($new_value)) throw new Exception("El valor ingresado no es válido");
            $new_value = $new_value ? 'true' : 'false';

            try {
                $sql = "UPDATE Configuracion_global SET use_google_api = 'true'";
                $result = $this->conexionDB->query($sql);
                if ($result === TRUE) {
                    return true;
                } else {
                    return false;
                }
            } catch(Exception $e){
                return false;
            }
        }


        public function getCoordinatesDecimalOfZipCode($zip_code){
            $result = null;
            try{
                $sql = "SELECT latitud_dec, longitud_dec from asentamiento where cp = ? LIMIT 1;";
                $stmt = $this->conexionDB->prepare($sql);
                $stmt->bind_param("s", $zip_code);
                $stmt->execute();
                $result = $stmt->get_result();
            }catch(Exception $e){
                throw new Exception("Error del servidor de codigos postales");
            }
            
            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                return $row;
            } else {
               throw new Exception("No se encontraron coordenadas para el código postal ingresado");
            }
        }


        public function getCoordinatesOfState($codigo_entidad)
        {
            $coordinates = null;
            try {
                $query = "SELECT latitud_dec, longitud_dec FROM Estado WHERE ? >= min_cp AND ? <= max_cp;";
                $stmt = $this->conexionDB->prepare($query);
                $stmt->bind_param("ii", $codigo_entidad, $codigo_entidad);
                $stmt->execute();
                $resultado = $stmt->get_result();
                $coordinates = $resultado->fetch_assoc();
                return  $coordinates ?  $coordinates : null;
            } catch (Exception $e) {
                return null;
            }
        }


    }

?>