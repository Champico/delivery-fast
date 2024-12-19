<?php
//  delivery-fast/backend/schemas/ShipmentSchema.php

class ShipmentSchema
{
    public static function validateNewShipmentSchema(array $data): array
    {
        $errors = [];

        $isNumericString = fn($value) => is_string($value) && ctype_digit($value);
        $isDecimal = fn($value, $min, $max) => is_numeric($value) && $value >= $min && $value <= $max;

        if (!isset($data['sucursal']) || !$isNumericString($data['sucursal']) || strlen($data['sucursal']) !== 5) {
            $errors[] = "Sucursal debe ser un string numérico de exactamente 5 caracteres.";
        }

        if (isset($data['colaborador']) && (!$isNumericString($data['colaborador']) || strlen($data['colaborador']) !== 6)) {
            $errors[] = "Colaborador debe ser un string numérico de exactamente 6 caracteres.";
        }

        foreach (
            [
                'peso' => [0, 69, 'Peso debe ser un número decimal entre 0 y 69.'],
                'largo' => [0, 200, 'Largo debe ser un número decimal entre 0 y 200.'],
                'ancho' => [0, 200, 'Ancho debe ser un número decimal entre 0 y 200.'],
                'alto' => [0, 150, 'Alto debe ser un número decimal entre 0 y 150.'],
                'costo' => [0, INF, 'Costo debe ser un número decimal.'],
            ] as $key => [$min, $max, $errorMessage]
        ) {
            if (isset($data[$key]) && !$isDecimal($data[$key], $min, $max)) {
                $errors[] = $errorMessage;
            }
        }

        foreach (
            [
                'contenido' => [255, 'Contenido debe ser un string de máximo 255 caracteres.'],
                'tipo' => [50, 'Tipo debe ser un string de máximo 50 caracteres.'],
                'servicio' => [50, 'Servicio debe ser un string de máximo 50 caracteres.'],
                'nombre_remitente' => [255, 'Nombre del remitente debe ser un string de máximo 255 caracteres.'],
                'correo_remitente' => [255, 'Correo del remitente debe ser un string de máximo 255 caracteres.'],
                'telefono_remitente' => [13, 'Teléfono del remitente debe ser un string de máximo 13 caracteres.'],
                'calle_remitente' => [50, 'Calle del remitente debe ser un string de máximo 50 caracteres.'],
                'numeroExt_remitente' => [10, 'Número exterior del remitente debe ser un string de máximo 10 caracteres.'],
                'numeroInt_remitente' => [10, 'Número interior del remitente debe ser un string de máximo 10 caracteres.'],
                'colonia_remitente' => [50, 'Colonia del remitente debe ser un string de máximo 50 caracteres.'],
                'ciudad_remitente' => [50, 'Ciudad del remitente debe ser un string de máximo 50 caracteres.'],
                'referencias_remitente' => [255, 'Referencias del remitente debe ser un string de máximo 255 caracteres.'],
                'nombre_destinatario' => [255, 'Nombre del destinatario debe ser un string de máximo 255 caracteres.'],
                'correo_destinatario' => [255, 'Correo del destinatario debe ser un string de máximo 255 caracteres.'],
                'telefono_destinatario' => [13, 'Teléfono del destinatario debe ser un string de máximo 13 caracteres.'],
                'calle_destinatario' => [50, 'Calle del destinatario debe ser un string de máximo 50 caracteres.'],
                'numeroExt_destinatario' => [10, 'Número exterior del destinatario debe ser un string de máximo 10 caracteres.'],
                'numeroInt_destinatario' => [10, 'Número interior del destinatario debe ser un string de máximo 10 caracteres.'],
                'colonia_destinatario' => [50, 'Colonia del destinatario debe ser un string de máximo 50 caracteres.'],
                'ciudad_destinatario' => [50, 'Ciudad del destinatario debe ser un string de máximo 50 caracteres.'],
                'referencias_destinatario' => [255, 'Referencias del destinatario debe ser un string de máximo 255 caracteres.'],
            ] as $key => [$maxLength, $errorMessage]
        ) {
            if (isset($data[$key]) && (!is_string($data[$key]) || strlen($data[$key]) > $maxLength)) {
                $errors[] = $errorMessage;
            }
        }

        if (isset($data['cp_remitente']) && (!$isNumericString($data['cp_remitente']) || strlen($data['cp_remitente']) !== 5 || $data['cp_remitente'][0] === '0')) {
            $errors[] = "Código postal del remitente debe ser un string numérico de 5 caracteres que no comience con 0.";
        }

        if (isset($data['cp_destinatario']) && (!$isNumericString($data['cp_destinatario']) || strlen($data['cp_destinatario']) !== 5 || $data['cp_destinatario'][0] === '0')) {
            $errors[] = "Código postal del destinatario debe ser un string numérico de 5 caracteres que no comience con 0.";
        }

        if (isset($data['estado_remitente']) && (!is_int($data['estado_remitente']) || $data['estado_remitente'] < 1 || $data['estado_remitente'] > 32)) {
            $errors[] = "Estado del remitente debe ser un entero entre 1 y 32.";
        }

        if (isset($data['estado_destinatario']) && (!is_int($data['estado_destinatario']) || $data['estado_destinatario'] < 1 || $data['estado_destinatario'] > 32)) {
            $errors[] = "Estado del destinatario debe ser un entero entre 1 y 32.";
        }

        if (isset($data['seguro']) && !is_bool($data['seguro'])) {
            $errors[] = "Seguro debe ser un booleano.";
        }

        if (isset($data['ticket']) && is_array($data['ticket'])) {
            $ticket = $data['ticket'];

            if (isset($ticket['total']) && !$isDecimal($ticket['total'], 0, INF)) {
                $errors[] = "El total del ticket debe ser un número decimal.";
            }

            if (isset($ticket['metodo_de_pago']) && !in_array($ticket['metodo_de_pago'], ['Efectivo', 'Tarjeta de debito'], true)) {
                $errors[] = "El método de pago debe ser 'Efectivo' o 'Tarjeta de debito'.";
            }

            if (isset($ticket['conceptos_ticket']) && is_array($ticket['conceptos_ticket'])) {
                foreach ($ticket['conceptos_ticket'] as $concepto) {
                    if (isset($concepto['nombre']) && (!is_string($concepto['nombre']) || strlen($concepto['nombre']) > 255)) {
                        $errors[] = "El nombre de un concepto del ticket debe ser un string de máximo 255 caracteres.";
                    }

                    if (isset($concepto['valor']) && !$isDecimal($concepto['valor'], 0, INF)) {
                        $errors[] = "El valor de un concepto del ticket debe ser un número decimal.";
                    }
                }
            }
        }

        return $errors;
    }




    public static function validateTicket($data)
    {
        $errors = [];

        $isNumericString = fn($value) => is_string($value) && ctype_digit($value);
        $isDecimal = fn($value, $min, $max) => is_numeric($value) && $value >= $min && $value <= $max;

        
        if (!isset($data['sucursal']) || !$isNumericString($data['sucursal']) || strlen($data['sucursal']) !== 5) {
            $errors[] = "Sucursal debe ser un string numérico de exactamente 5 caracteres.";
        }

        foreach (
            [
                'peso' => [0, 69, 'Peso debe ser un número decimal entre 0 y 69.'],
                'largo' => [0, 200, 'Largo debe ser un número decimal entre 0 y 200.'],
                'ancho' => [0, 200, 'Ancho debe ser un número decimal entre 0 y 200.'],
                'alto' => [0, 150, 'Alto debe ser un número decimal entre 0 y 150.'],
                'costo' => [0, INF, 'Costo debe ser un número decimal.'],
            ] as $key => [$min, $max, $errorMessage]
        ) {
            if (isset($data[$key]) && !$isDecimal($data[$key], $min, $max)) {
                $errors[] = $errorMessage;
            }
        }

        if (isset($data['seguro']) && !is_bool($data['seguro'])) {
            $errors[] = "Seguro debe ser un booleano.";
        }

        if (!isset($data['servicio']) || (!is_string($data['servicio']) || strlen($data['servicio']) > 50)) {
            $errors[] = "El servicio no debe ser mayor a 50 caracteres";
        }

        return $errors;
    }
}
