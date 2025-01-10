<?php
//  delivery-fast/backend/schemas/ShipmentSchema.php

class ShipmentSchema
{
    public static $maxWeight = 69;
    public static $maxLength = 200;
    public static $maxWidth = 200;
    public static $maxHeight = 150;
    public static $maxMoney = 9999999;

    public static function validateDataToCreateShipment($data)
    {
        $errors = [];
        
        if(empty($data) || !is_array($data)){
            $errors[] = "Debe enviar los datos necesarios";
            return $errors;
        }

        foreach (
            [
                "sucursal" => "Ingrese la sucursal",
                "colaborador" => "Ingrese el número de personal del colaborador",
                "peso" => "Ingrese el peso",
                "largo" => "Ingrese el largo",
                "ancho" => "Ingrese el ancho",
                "alto" => "Ingrese el alto",
                "servicio" => "Ingrese el tipo de servicio",
                "seguro" => "Ingrese si el paquete tiene seguro",
                "metodo_de_pago" => "Ingrese el método de pago",

                "nombre_remitente" => "Ingrese el nombre del remitente",
                "calle_remitente" => "Ingrese la calle del remitente",
                "numeroExt_remitente" => "Ingrese el numero exterior del remitente",
                "colonia_remitente" => "Ingrese la colonia del remitente",
                "cp_remitente" => "Ingrese el código postal del remitente",
                "ciudad_remitente" => "Ingrese la ciudad del remitente",
                "estado_remitente" => "Ingrese el estado del remitente",

                "nombre_destinatario" => "Ingrese el nombre del destinatario",
                "calle_destinatario" => "Ingrese la calle del destinatario",
                "numeroExt_destinatario" => "Ingrese el numero exterior del destinatario",
                "colonia_destinatario" => "Ingrese la colonia del destinatario",
                "cp_destinatario" => "Ingrese el código postal del destinatario",
                "ciudad_destinatario" => "Ingrese la ciudad del destinatario",
                "estado_destinatario" => "Ingrese el estado del destinatario",
            ] as $key => $errorMessage
        ) {
            if (!isset($data[$key])) {
                $errors[] = $errorMessage;
            }
        }

        if(!empty($errors)) return $errors;

        $errValidation = ShipmentSchema::validateShipment($data);
        $errors = [...$errors, ...(is_array($errValidation) ? $errValidation : [])];

        if(!empty($errors)) return $errors;
        return false;
    }

    public static function validateDataToModifiedShipment() {

        if(empty($data) || is_array($data)){
            $errors[] = "Debe enviar los datos necesarios";
            return $errors;
        }

        foreach (
            [
                "guia" => "Ingrese la guía",
                "sucursal" => "Ingrese la sucursal",
                "colaborador" => "Ingrese el número de personal del colaborador",
            ] as $key => $errorMessage
        ) {
            if (!isset($data[$key])) {
                $errors[] = $errorMessage;
            }
        }
        return $errors;
    }

    private static function validateShipment($data)
    {
        $errors = [];
        $isNumericString = fn($value) => is_string($value) && ctype_digit($value);
        $isNumericStringOfLength = fn($value, $length) => is_string($value) && ctype_digit($value) && strlen($value) === $length;


        // D A T O S  D E  I D E N T I F I C A C I O N
        foreach
        (
            [
                "sucursal" => [5, "La clave de la sucursal debe ser un número de 5 dígitos"],
                "colaborador" => [6, "El número de personal del colaborador debe ser de 6 dígitos"],
                "guia" => [15, "La guía debe ser de 15 dígitos"],
                "conductor_asignado" => [6, "El número de personal del conductor asignado debe ser de 6 dígitos"]
            ] as $key => [$length, $errorMessage]
        ){
            if (isset($data[$key]) && !$isNumericStringOfLength($data[$key], $length)){
                $errors[] = $errorMessage;
            }
        }
        
        if(isset($data['folio']) && !$isNumericString($data['folio'])){
            $errors[] = "El folio debe ser un número";
        }


        // M E D I D A S  F L O T A N T E S
        foreach (
            [
                'peso' => [0, ShipmentSchema::$maxWeight, 'Peso debe ser un número decimal','El peso no puede ser negativo', "El peso no puede ser mayor a " . ShipmentSchema::$maxWeight . " kg"],
                'largo' => [0, ShipmentSchema::$maxLength, 'Largo debe ser un número decimal', 'El largo no puede ser negativo', "El largo no puede ser mayor a " . ShipmentSchema::$maxLength . " cm"],
                'ancho' => [0, ShipmentSchema::$maxWidth, 'Ancho debe ser un número decimal', 'El ancho no puede ser negativo', "El ancho no puede ser mayor a " . ShipmentSchema::$maxWidth . " cm"],
                'alto' => [0, ShipmentSchema::$maxHeight, 'Alto debe ser un número decimal', 'El alto no puede ser negativo', "El alto no puede ser mayor a " . ShipmentSchema::$maxHeight . " cm"],
                'costo' => [0, ShipmentSchema::$maxMoney, 'Costo debe ser un número decimal', 'El costo no puede ser negativo', "El costo no puede ser mayor a " . ShipmentSchema::$maxMoney . " $"],
                'pago_con' => [0, ShipmentSchema::$maxMoney, 'El pago debe ser un número decimal', 'El pago no puede ser negativo', "El pago no puede ser mayor a " . ShipmentSchema::$maxMoney . " $"],
            ] as $key => [$min, $max, $errorMessageNotDecimal, $errorMessageLessThanAllowed, $errorMessageMoreThanAllowed]
        ) {
            if (isset($data[$key])) {
                if(!is_numeric($data[$key])){
                    $errors[] = $errorMessageNotDecimal;
                    continue;
                }
                if((float)$data[$key] < $min){
                    $errors[] = $errorMessageLessThanAllowed;
                    continue;
                }
                if((float)$data[$key] > $max){
                    $errors[] = $errorMessageMoreThanAllowed;
                }
            }
        }

        // S T R I M G S  O B L I G A T O R I O S 
        foreach (
            [
                'tipo' => [50, 'Tipo debe tener máximo 50 caracteres', 'Tipo debe ser una cadena de caracteres'],
                'servicio' => [50, 'Servicio debe tener máximo 50 caracteres', 'Servicio debe ser una cadena de caracteres'],
                'nombre_remitente' => [255, 'Nombre del remitente debe tener máximo 255 caracteres', 'Nombre del remitente debe ser una cadena de caracteres'],
                'calle_remitente' => [50, 'Calle del remitente debe tener máximo 50 caracteres', 'Calle del remitente debe ser una cadena de caracteres'],
                'numeroExt_remitente' => [10, 'Número exterior del remitente debe tener máximo 10 caracteres', 'Número exterior del remitente debe ser una cadena de caracteres'],
                
                'colonia_remitente' => [50, 'Colonia del remitente debe tener máximo 50 caracteres', 'Colonia del remitente debe ser una cadena de caracteres'],
                'ciudad_remitente' => [50, 'Ciudad del remitente debe tener máximo 50 caracteres', 'Ciudad del remitente debe ser una cadena de caracteres'],
                'nombre_destinatario' => [255, 'Nombre del destinatario debe tener máximo 255 caracteres', 'Nombre del destinatario debe ser una cadena de caracteres'],
                
                'calle_destinatario' => [50, 'Calle del destinatario debe tener máximo 50 caracteres', 'Calle del destinatario debe ser una cadena de caracteres'],
                'numeroExt_destinatario' => [10, 'Número exterior del destinatario debe tener máximo 10 caracteres', 'Número exterior del destinatario debe ser una cadena de caracteres'],
                'colonia_destinatario' => [50, 'Colonia del destinatario debe tener máximo 50 caracteres', 'Colonia del destinatario debe ser una cadena de caracteres'],
                'ciudad_destinatario' => [50, 'Ciudad del destinatario debe tener máximo 50 caracteres', 'Ciudad del destinatario debe ser una cadena de caracteres'],
               
            ] as $key => [$maxLength, $errorMessageMoreLengthThanAllowed, $errorMessageNotString]
        ) {
            if (isset($data[$key])){
                if(!is_string($data[$key])){
                    $errors[] = $errorMessageNotString;
                    continue;
                }
                if(strlen($data[$key]) > $maxLength){
                    $errors[] = $errorMessageMoreLengthThanAllowed;
                    continue;
                }
                if(strlen($data[$key]) < 1){
                    $errors[] = "Ingrese el campo " . $key;
                }
            }
        }

        // S T R I N G S  O P C I O N A L E S 
        foreach (
            [
                'contenido' => [255, 'Contenido debe tener máximo 255 caracteres', 'Contenido debe ser una cadena de caracteres'],

                'correo_remitente' => [255, 'Correo del remitente debe tener máximo 255 caracteres', 'Correo del remitente debe ser una cadena de caracteres'],
                'telefono_remitente' => [13, 'Teléfono del remitente debe tener máximo 13 caracteres', 'Teléfono del remitente debe ser una cadena de caracteres'],
                'numeroInt_remitente' => [10, 'Número interior del remitente debe tener máximo 10 caracteres', 'Número interior del remitente debe ser una cadena de caracteres'],
                'referencias_remitente' => [255, 'Referencias del remitente debe tener máximo 255 caracteres', 'Referencias del remitente debe ser una cadena de caracteres'],
                
                'correo_destinatario' => [255, 'Correo del destinatario debe tener máximo 255 caracteres', 'Correo del destinatario debe ser una cadena de caracteres'],
                'telefono_destinatario' => [13, 'Teléfono del destinatario debe tener máximo 13 caracteres', 'Teléfono del destinatario debe ser una cadena de caracteres'],
                'numeroInt_destinatario' => [10, 'Número interior del destinatario debe tener máximo 10 caracteres', 'Número interior del destinatario debe ser una cadena de caracteres'],
                'referencias_destinatario' => [255, 'Referencias del destinatario debe tener máximo 255 caracteres', 'Referencias del destinatario debe ser una cadena de caracteres'],
        ] as $key => [$maxLength, $errorMessageMoreLengthThanAllowed, $errorMessageNotString]
        ) {
            if (isset($data[$key])){
                if(!is_string($data[$key])){
                    $errors[] = $errorMessageNotString;
                    continue;
                }
                if(strlen($data[$key]) > $maxLength){
                    $errors[] = $errorMessageMoreLengthThanAllowed;
                    continue;
                }
            }
        }


        // C O D I G O S  P O S T A L E S
        foreach(
            [
                "cp_remitente" => ["El código postal del remitente deber ser un número", "El código postal del remitente debe tener 5 digitos"], 
                "cp_destinatario" => ["El código postal del destinatario debe ser un número", "El código postal del destinatario debe tener 5 digitos"]
            ] as $key => [$errorMessageNotInteger, $errorMessageLengthNotAllowed]
        ){
            if (isset($data[$key])){
                if(!$isNumericString($data[$key])){
                    $errors[] = $errorMessageNotInteger;
                    continue;
                }
                if(strlen($data[$key]) !== 5){
                    $errors[] = $errorMessageLengthNotAllowed;
                }
            }
        }

        foreach
        (
            [
                "estado_remitente" => ["El estado del remitente debe ser la clave de entidad el cual es en formato númerico","La clave del estado del remitente debe ser 01 y 32" ],
                "estado_destinatario" => ["El estado del destinatario debe ser la clave de entidad el cual es en formato númerico", "La clave del estado del remitente debe ser 01 y 32"]
            ] as $key => [$errorMessageNotInteger, $errorMessageNotValidState]
        ){
            if(isset($data[$key])){
                if(!$isNumericString($data[$key])){
                    $errors[] = $errorMessageNotInteger;
                    continue;
                }
                if((float) $data[$key] < 1 || (float) $data[$key] >32){
                    $errors = $errorMessageNotValidState;
                }
            }
        }

        if (isset($data['seguro']) && !is_bool($data['seguro'])) {
            $errors[] = "Seguro debe ser un booleano.";
        }

        if (isset($ticket['metodo_de_pago']) && !in_array($ticket['metodo_de_pago'], ['Efectivo', 'Tarjeta de débito'], true)) {
            $errors[] = "El método de pago debe ser 'Efectivo' o 'Tarjeta de débito' (Espacios con guion bajo)";
        }

        if(isset($ticket['servicio']) && !in_array($ticket['servicio'], ['Express','Día_siguiente','2-5_Dias','Terrestre'], true)){
            $errors[] = "El servicio debe ser 'Express','Día siguiente','2-5 Dias','Terrestre' (Espacios con guion bajo)";
        }

        return $errors;
    }

    public static function validateDataToTicket($data)
    {
        $errors = [];
        
        if(empty($data) || !is_array($data)){
            $errors[] = "Debe enviar los datos necesarios";
            return $errors;
        }

        foreach (
            [
                "sucursal" => "Ingrese la sucursal",
                "colaborador" => "Ingrese el número de personal del colaborador",
                "peso" => "Ingrese el peso",
                "largo" => "Ingrese el largo",
                "ancho" => "Ingrese el ancho",
                "alto" => "Ingrese el alto",
                "servicio" => "Ingrese el tipo de servicio",
                "seguro" => "Ingrese si el paquete tiene seguro",
                "cp_destinatario" => "Ingrese el código postal del destinatario",
            ] as $key => $errorMessage
        ) {
            if (!isset($data[$key])) {
                $errors[] = $errorMessage;
            }
        }

        if(!empty($errors)) return $errors;

        $errValidation = ShipmentSchema::validateShipment($data);
        $errors = [...$errors, ...(is_array($errValidation) ? $errValidation : [])];

        if(!empty($errors)) return $errors;
        return false;
    }

    public static function validateGuide($guide)
    {
        $errors = [];
        if(empty($guide)) $errors[] = "Ingrese la guía";
        $isNumericStringOfLength = fn($value, $length) => is_string($value) && ctype_digit($value) && strlen($value) === $length;
        if (isset($guide) && !$isNumericStringOfLength($guide, 15)) $errors[] = "La guía debe ser de 15 dígitos";
        return $errors;
    }

    public static function validateZipCode($zipCode)
    {
        $errors = [];
        if(empty($zipCode)) $errors[] = "Ingrese el código postal";
        $isNumericStringOfLength = fn($value, $length) => is_string($value) && ctype_digit($value) && strlen($value) === $length;
        if (isset($zipCode) && !$isNumericStringOfLength($zipCode, 5)) $errors[] = "El código postal debe ser de 5 digitos";
        return $errors;
    }

    public static function validateParamsToSearch($params)
    {
        $errors = [];

        if(empty($params)){
            $errors[] = "Debe enviar los parametros de busqueda";
        }

        $isNumericStringOfLength = fn($value, $length) => is_string($value) && ctype_digit($value) && strlen($value) === $length;

        foreach
        (
            [
                "numero_sucursal" => [5, "La sucursal es obligatoria", "La clave de la sucursal debe ser un número de 5 dígitos"],
             ] as $key => [$length, $errorNotSet, $errorNotValid]
        ){
            if(!isset($params[$key]) || empty($params[$key])){
                $error[] = $errorNotSet;
            }

            if (!$isNumericStringOfLength($params[$key], $length)){
                $errors[] = $errorNotValid;
            }
        }

        foreach (
            [
                "limite_min" => ["Debe ingresar el limite inferior","Ingrese un valor valido para el limite inferior", "Ingrese solo números positivos para el limite inferior"],
                "limite_max" => ["Debe ingresar el limite superior","Ingrese un valor valido para el limite superior", "Ingrese solo números positivos para el limite superior"],
            ] as $key => [$errorNotSet, $errorNotValid, $errorNotNumber]
        ) {
            if (!isset($params[$key]) || empty($params[$key])) {
                $errors[] = $errorNotSet;
            }

            if(!is_string($params[$key])){
                $error[] = $errorNotValid;
            }

            if(!ctype_digit($params[$key])){
                $error[] = $errorNotNumber;
            }
        }

        if(empty($error)){
            $dif = (int) $params["limite_max"] - (int) $params["limite_min"];
            if($dif > 100) $error[] = "No se pueden retornar mas de 100 valores en una sóla consulta con parametros";
        }

        if(!isset($params['orden']) || empty(($params['orden'])) || !in_array(strtolower($params['orden']), ['asc', 'desc']))
        {
            $errors[] = "El orden debe ser ascendente(asc) o descendente(desc)";
        }

        foreach (
            [
                'tipo' => [50, 'Tipo debe tener máximo 50 caracteres', 'Tipo debe ser una cadena de caracteres'],
                'servicio' => [50, 'Servicio debe tener máximo 50 caracteres', 'Servicio debe ser una cadena de caracteres'],
            ] as $key => [$maxLength, $errorMessageMoreLengthThanAllowed, $errorMessageNotString]
        ) {
            if (isset($data[$key])){
                if(!is_string($data[$key])){
                    $errors[] = $errorMessageNotString;
                    continue;
                }
                if(strlen($data[$key]) > $maxLength){
                    $errors[] = $errorMessageMoreLengthThanAllowed;
                    continue;
                }
                if(strlen($data[$key]) < 1){
                    $errors[] = "Ingrese el campo " . $key;
                }
            }
        }

        if (isset($data['seguro']) && !is_bool($data['seguro'])) {
            $errors[] = "Seguro debe ser un booleano.";
        }

        foreach
        (
            [
                "fecha_inicio" => "La fecha de inicio no es valida ('YYYY-MM-DD')",
                "fecha_final" => "La fecha de inicio no es valida ('YYYY-MM-DD')"
            ] as $key => $errorMessage
        ){
            if(isset($params[$key])){
                $format = 'Y-m-d';
                $dateTimeInstance = DateTime::createFromFormat($format, $params[$key]); //Crea una nueva fecha correcta
                if(!($dateTimeInstance->format($format) === $params[$key])){ //Compara la nueva fecha correcta con la enviada
                   $error[] = $errorMessage;
                }
            }
        }

        return $errors;
    }

}