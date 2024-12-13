<?php
//  delivery-fast/backend/models/ShipmentModel.php

class ShipmentModel
{
    private $conexionDB;

    public function __construct($conexionDB)
    {
        $this->conexionDB = $conexionDB;
    }

    public function getAll()
    {
        $sql = "SELECT * FROM Sucursales";

        try {
            $result = $this->conexionDB->query($sql);
            if ($result->num_rows > 0) {
                $shupments = [];
                while ($row = $result->fetch_assoc()) {
                    $shupments[] = $row;
                }
                return $shupments;
            } else {
                return null;
            }
        } finally {
            return null;
        }
    }

    public function create($data)
    {
    /* > LOGICA PARA CREAR UN ENVIO MODEL <
    
    Pre-condición: Se considera que el controller ya verifico que todos los datos cumplen las reglas de negocio

    Pasos:
        - Generar una guía aleatorioa
        - Generar un folio incrementando en 1 el anterior
        - Insertar el envio
        - Insertar el remitente
        - Insertar el destinatario
    */
        $guia = null;
        $folio = null;

        try {
            $guia = $this->generateGuia();
        } catch (Exception $e) {
            throw new Exception("Error al generar la guía");
        }

        try {
            $folio = $this->generateFolio();
        } catch (Exception $e) {
            throw new Exception("Error al generar el folio");
        }

        try {
            $issetEnvio = $this->insertEnvio(
                $guia,
                $folio,
                $data['costo'],
                $data['peso'],
                $data['largo'],
                $data['alto'],
                $data['ancho'],
                $data['contenido'],
                $data['tipo'],
                $data['seguro'],
                $data['conductor_asignado']
            );
        } catch (Exception $e) {
            throw new Exception("Error al crear el envío");
        }

        try {
            $issetSender = $this->insertContacto(
                $guia,
                $data['tipo'],
                $data['nombre_remitente'],
                $data['correo_remitente'],
                $data['telefono_remitente'],
                $data['calle_remitente'],
                $data['numeroExt_remitente'],
                $data['numeroInt_remitente'],
                $data['colonia_remitente'],
                $data['cp_remitente'],
                $data['ciudad_remitente'],
                $data['referencias_remitente'],
                $data['estado_remitente']
            );
        } catch (Exception $e) {
            throw new Exception("Error al guardar los datos del remitente");
        }

        try {
            $issetRecipient = $this->insertContacto(
                $guia,
                $data['tipo_destinatario'],
                $data['nombre_destinatario'],
                $data['correo_destinatario'],
                $data['telefono_destinatario'],
                $data['calle_destinatario'],
                $data['numeroExt_destinatario'],
                $data['numeroInt_destinatario'],
                $data['colonia_destinatario'],
                $data['cp_destinatario'],
                $data['ciudad_destinatario'],
                $data['referencias_destinatario'],
                $data['estado_destinatario']
            );
        } catch (Exception $e) {
            throw new Exception("Error al guardar los datos del destinatario");
        }

        try {
            $queryGetEnvio = "SELECT * FROM Datos_completos_Envio WHERE guia=$guia";
            $result = $this->conexionDB->query($queryGetEnvio);
        } catch (Exception $e) {
            return null;
        }
    }

















    private function generateGuia()
    {
        $queryGuia = "SELECT generarGuia() AS nuevaGuia";
        $result = $this->conexionDB->query($queryGuia);
        if ($result) {
            $row = $result->fetch_assoc();
            return $row['nuevaGuia'];
        } else {
            throw new Exception("Error al generar la guía");
        }
    }

    private function generateFolio()
    {
        $queryFolio = "SELECT obtenerFolio() AS nuevoFolio";
        $result = $this->conexionDB->query($queryFolio);
        if ($result) {
            $row = $result->fetch_assoc();
            return $row['nuevoFolio'];
        } else {
            throw new Exception("Error al generar el folio");
        }
    }

    private function insertEnvio($guia, $folio, $costo, $peso, $largo, $alto, $ancho, $contenido, $tipo, $seguro, $conductor_asignado)
    {
        try {
            $stmt = $this->conexionDB->prepare("
        INSERT INTO Envios (guia, folio, costo, peso, largo, alto, ancho, contenido, tipo, seguro, conductor_asignado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
            $stmt->bind_param(
                "siddddddssis",
                $guia,
                $folio,
                $costo,
                $peso,
                $largo,
                $alto,
                $ancho,
                $contenido,
                $tipo,
                $seguro,
                $conductor_asignado
            );
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al crear el envío");
        }
    }

    private function insertContacto($guia, $tipo, $nombre_completo, $correo, $telefono, $calle, $numero_ext, $numero_int, $colonia, $cp, $ciudad, $referencias, $estado)
    {
        try {
            $stmt = $this->conexionDB->prepare("
        INSERT INTO Contactos (guia, tipo, nombre_completo, correo, telefono, calle, numero_ext, numero_int, colonia, cp, ciudad, referencias, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
            $stmt->bind_param(
                "ssssssssssssi",
                $guia,
                $tipo,
                $nombre_completo,
                $correo,
                $telefono,
                $calle,
                $numero_ext,
                $numero_int,
                $colonia,
                $cp,
                $ciudad,
                $referencias,
                $estado
            );
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al cargar los datos de contacto");
        }
    }





    public function getCoordinatesOfState($codigo_entidad)
    {
        $coordinates = null;
        try {
            $query = "SELECT latitud, longitud FROM Entidades_Federativas WHERE ? >= min_cp AND ? <= max_cp";
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
