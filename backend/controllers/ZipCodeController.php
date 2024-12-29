<?php
class ZipCodeController{
    private $zipCodesModel;

    public function __construct($zipCodesModel){
        $this->zipCodesModel = $zipCodesModel;
    }

    public function getStatesOfMexico(){
        try{
            $estados = $this->zipCodesModel->getAllStates();
            return $estados;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    public function getDistanceOfTwoZipCode($zipCodeOrigin, $zipCodeDestination){
        try{
            $coordinates["coordinatesOrigin"] = $this->getCoordinates($zipCodeOrigin);
            $coordinates["coordinatesDestination"] = $this->getCoordinates($zipCodeDestination);

            $distancia = $this->calculateDistance($coordinates["coordinatesOrigin"]["latitud_dec"],
                                                  $coordinates["coordinatesOrigin"]["longitud_dec"],
                                                  $coordinates["coordinatesDestination"]["latitud_dec"],
                                                  $coordinates["coordinatesDestination"]["longitud_dec"]);
            return $distancia;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    public function getDistanceOfCoordAndZipCode($latitud_decimal, $longitud_decimal, $zipCodeDestination){
        try{
            $coordinates = $this->getCoordinates($zipCodeDestination);
            $distancia = $this->calculateDistance($latitud_decimal,
                                                  $longitud_decimal,
                                                  $coordinates["latitud_dec"],
                                                  $coordinates["longitud_dec"]);
            return $distancia;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }


    private function getCoordinates($zipCode){
        $use_google_api = false;
        $coordinates = [];
        try{
            $use_google_api = $this->zipCodesModel->getUseGoogleApi();
            if($use_google_api) $coordinates = $this->getCoordinatesGoogle($zipCode);
            if(!$use_google_api || $coordinates == []) $coordinates = $this->getCoordinatesLocal($zipCode);
            if($coordinates == []) $coordinates = $this->getCoordinatesOfState($zipCode);
            if($coordinates == [])throw new Exception("No se pudieron obtener las coordenadas de los códigos postales");
            $coordinates["latitud_dec"] = (float) $coordinates["latitud_dec"]; 
            $coordinates["longitud_dec"] = (float) $coordinates["longitud_dec"];
            return $coordinates;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    private function getCoordinatesGoogle($zipCode){
        try{
            $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".$zipCode."&key=".$_ENV['GOOGLE_API_KEY'];
            $response = file_get_contents($url);
            $response = json_decode($response, true);
            return $response;
        }catch(Exception $e){
            return null;
        }
    }

    private function getCoordinatesLocal($zipCode){
        $coordinates = $this->zipCodesModel->getCoordinatesDecimalOfZipCode($zipCode);
        return $coordinates;
    }

    private function getCoordinatesOfState($zipCode){
        $codigo_entidad = (int)substr($zipCode, 0, 2);
        $coordinates = $this->zipCodesModel->getCoordinatesOfState($codigo_entidad);
        return $coordinates;
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        if(!isset($lat1) || !is_numeric($lat1)) throw new Exception("Falta la primera latitud parta calcular la distancia");
        if(!isset($lat2) || !is_numeric($lat2)) throw new Exception("Falta la primera longitud parta calcular la distancia");
        if(!isset($lon1) || !is_numeric($lon1)) throw new Exception("Falta la segunda latitud parta calcular la distancia");
        if(!isset($lon2) || !is_numeric($lon2)) throw new Exception("Falta la segunda longitud parta calcular la distancia");
        if($lat1 == $lat2 && $lon1 == $lon2) return 0;

        try{
            $radio_tierra = 6371;
            $dlat = deg2rad($lat2 - $lat1);
            $dlon = deg2rad($lon2 - $lon1);
            $a = sin($dlat / 2) * sin($dlat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dlon / 2) * sin($dlon / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            return $radio_tierra * $c;
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al calcular la distancia entre el origen y el destino");
        }
    }
}

?>