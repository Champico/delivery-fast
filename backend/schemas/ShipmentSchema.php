<?php

//  delivery-fast/backend/schemas/ShipmentSchema.php

class ShipmentSchema {
    public static function validateNewShipmentSchema($data) {
        $errors = ['error' => 'yes'];

        // Helper function for numeric range validation
        function validateNumericRange($value, $min, $max, $fieldName, &$errors) {
            if (!is_numeric($value)) {
                $errors[$fieldName] = "$fieldName debe ser un número.";
                return;
            }
            if ($value < $min || $value > $max) {
                $errors[$fieldName] = "$fieldName debe estar entre $min y $max.";
            }
        }

        // Helper function for string length validation
        function validateStringLength($value, $maxLength, $fieldName, &$errors, $exactLength = null) {
            if (!is_string($value)) {
                $errors[$fieldName] = "$fieldName debe ser un string.";
                return;
            }
            if ($exactLength && strlen($value) !== $exactLength) {
                $errors[$fieldName] = "$fieldName debe tener exactamente $exactLength caracteres.";
            } elseif (strlen($value) > $maxLength) {
                $errors[$fieldName] = "$fieldName no debe exceder $maxLength caracteres.";
            }
        }

        // Validate numeric fields
        validateNumericRange($data['peso'] ?? null, 0, 69, 'peso', $errors);
        validateNumericRange($data['largo'] ?? null, 0, 200, 'largo', $errors);
        validateNumericRange($data['ancho'] ?? null, 0, 200, 'ancho', $errors);
        validateNumericRange($data['alto'] ?? null, 0, 150, 'alto', $errors);

        // Validate strings
        validateStringLength($data['contenido'] ?? null, 255, 'contenido', $errors);
        validateStringLength($data['tipo'] ?? null, 50, 'tipo', $errors);

        // Validate boolean fields
        if (!isset($data['seguro']) || !is_bool($data['seguro'])) {
            $errors['seguro'] = "seguro debe ser un valor booleano.";
        }

        // Optional exact length string validation
        if (isset($data['conductor_asignado'])) {
            validateStringLength($data['conductor_asignado'], 6, 'conductor_asignado', $errors, 6);
        }

        // Validate remitente fields
        validateStringLength($data['nombreRemitente'] ?? null, 255, 'nombreRemitente', $errors);
        if (isset($data['correoRemitente'])) validateStringLength($data['correoRemitente'], 255, 'correoRemitente', $errors);
        if (isset($data['telefonoRemitente'])) validateStringLength($data['telefonoRemitente'], 13, 'telefonoRemitente', $errors);
        validateStringLength($data['calleRemitente'] ?? null, 50, 'calleRemitente', $errors);
        validateStringLength($data['numExtRemitente'] ?? null, 10, 'numExtRemitente', $errors);
        if (isset($data['numIntRemitente'])) validateStringLength($data['numIntRemitente'], 10, 'numIntRemitente', $errors);
        validateStringLength($data['coloniaRemitente'] ?? null, 50, 'coloniaRemitente', $errors);
        validateStringLength($data['cpRemitente'] ?? null, 5, 'cpRemitente', $errors, 5);
        validateStringLength($data['ciudadRemitente'] ?? null, 50, 'ciudadRemitente', $errors);
        if (isset($data['referenciasRemitente'])) validateStringLength($data['referenciasRemitente'], 255, 'referenciasRemitente', $errors);
        validateStringLength($data['estadoRemitente'] ?? null, 255, 'estadoRemitente', $errors);
        validateNumericRange($data['estadoRemitente'] ?? null, 1, 32, 'estadoRemitente', $errors);

        // Validate destinatario fields
        validateStringLength($data['nombreDestinatario'] ?? null, 255, 'nombreDestinatario', $errors);
        if (isset($data['correoDestinatario'])) validateStringLength($data['correoDestinatario'], 255, 'correoDestinatario', $errors);
        if (isset($data['telefonoDestinatario'])) validateStringLength($data['telefonoDestinatario'], 13, 'telefonoDestinatario', $errors);
        validateStringLength($data['calleDestinatario'] ?? null, 50, 'calleDestinatario', $errors);
        validateStringLength($data['numExtDestinatario'] ?? null, 10, 'numExtDestinatario', $errors);
        if (isset($data['numIntDestinatario'])) validateStringLength($data['numIntDestinatario'], 10, 'numIntDestinatario', $errors);
        validateStringLength($data['coloniaDestinatario'] ?? null, 50, 'coloniaDestinatario', $errors);
        validateStringLength($data['cpDestinatario'] ?? null, 5, 'cpDestinatario', $errors, 5);
        validateStringLength($data['ciudadDestinatario'] ?? null, 50, 'ciudadDestinatario', $errors);
        if (isset($data['referenciasDestinatario'])) validateStringLength($data['referenciasDestinatario'], 255, 'referenciasDestinatario', $errors);
        validateStringLength($data['estadoDestinatario'] ?? null, 255, 'estadoDestinatario', $errors);
        validateNumericRange($data['estadoDestinatario'] ?? null, 1, 32, 'estadoDestinatario', $errors);

        // Return errors if any
        if (count($errors) > 1) {
            return $errors;
        }

        // Return valid data
        return $data;
    }
}
?>
