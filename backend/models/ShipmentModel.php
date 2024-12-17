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
        try {
            $query = "SELECT * FROM Envios_general";
            $result = $this->conexionDB->query($query);
            if ($result->num_rows > 0) {
                $shupments = [];
                while ($row = $result->fetch_assoc()) {
                    $shupments[] = $row;
                }
                return $shupments;
            } else {
                return null;
            }
        } catch(Exception $e){
            return null;
        }
    }

    public function getAllBranch($numero_sucursal)
    {
        try {
            $query = "SELECT * FROM Envios_general WHERE numero_sucursal = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $numero_sucursal);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $shupments = [];
                while ($row = $result->fetch_assoc()) {
                    $shupments[] = $row;
                }
                return $shupments;
            } else {
                return null;
            }
        } catch(Exception $e){
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
        - Insertar el ticket y los conceptos

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
                $data['servicio'],
                $data['seguro'],
                $data['conductor_asignado'],
                $data['sucursal']
            );
        } catch (Exception $e) {
            throw new Exception("Error al crear el envío en la base de datos");
        }

        try {
            $issetSender = $this->insertContacto(
                $guia,
                "Remitente",
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
                "Destinatario",
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

        if(isset($data['ticket']['conceptos_ticket'])){
            try{
                $this->insertTicket($data['ticket']['conceptos_ticket'], $data['costo'], $guia);
            }catch(Exception $e){
                throw new Exception("Error al crear el ticket");
            }
        }
        
        try {
            $queryGetEnvio = "SELECT * FROM Datos_completos_Envio WHERE guia=$guia";
            $result = $this->conexionDB->query($queryGetEnvio);
            $envio = $result->fetch_assoc();
            return $envio;
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

    private function insertEnvio($guia, $folio, $costo, $peso, $largo, $alto, $ancho, $contenido, $tipo_servicio, $seguro, $conductor_asignado, $numero_sucursal)
    {
        try {
            $query = " INSERT INTO Envios (guia,folio,costo,peso,largo,alto,ancho,contenido,servicio,seguro,conductor_asignado, numero_sucursal)
                       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param(
                "sidddddssiss",
                $guia,
                $folio,
                $costo,
                $peso,
                $largo,
                $alto,
                $ancho,
                $contenido,
                $tipo_servicio,
                $seguro,
                $conductor_asignado,
                $numero_sucursal
            );
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al crear el envío");
        }
    }

    private function insertContacto($guia, $tipo_cliente, $nombre_completo, $correo, $telefono, $calle, $numero_ext, $numero_int, $colonia, $cp, $ciudad, $referencias, $estado)
    {
        try {
            $query = "INSERT INTO Contactos (guia, tipo, nombre_completo, correo, telefono, calle, numero_ext, numero_int, colonia, cp, ciudad, referencias, estado)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param(
                "ssssssssssssi",
                $guia,
                $tipo_cliente,
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

    private function insertTicket($ticket_conceptos, $costo_total, $guia){
        try{
            $query1 = "INSERT INTO ticket(total, guia) VALUES (?,?)";
            $stmt = $this->conexionDB->prepare($query1);
            $stmt->bind_param("ds",$costo_total, $guia);
            $stmt->execute();
            $ticket = null;

            try {
                $query2 = "SELECT * FROM ticket WHERE guia=$guia";
                $result = $this->conexionDB->query($query2);
                $ticket = $result->fetch_assoc();
            } catch (Exception $e) {
            }

            if($ticket){
                foreach($ticket_conceptos as $nombre => $valor) {
                    try{
                        $query3 = "INSERT INTO Concepto_ticket(id_ticket, nombre, valor) VALUES (?,?,?);";
                        $stmt2 = $this->conexionDB->prepare($query3);
                        $stmt2->bind_param("isd",$ticket['id'],$nombre,$valor);
                        $stmt->execute();
                    }catch(Exception $e){
                    }
                }

                    try {
                        $query4 = "SELECT * FROM Concepto_ticket WHERE id_ticket = ?";
                        $stmt = $this->conexionDB->prepare($query4);
                        $stmt->bind_param("i", $ticket['id']);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                            $conceptos = [];
                            while ($row = $result->fetch_assoc()) {
                                $conceptos[] = $row;
                            }
                            $ticket["ticket_conceptos"] = $conceptos;
                        } else {
                            return null;
                        }
                    } catch(Exception $e){

                    }

            }

        }catch(Exception $e){
            throw new Exception("Error al crear el ticket");
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

    public function getPreciosServicios($zona, $servicio){
        $precios = null;
        try{
            $query = "SELECT t.peso_max_amparado, p.precio,  p.medida_aumento_peso,  p.precio_aumento 
            FROM Precios AS p INNER JOIN Tipo_servicio AS t ON p.servicio = t.nombre WHERE p.zona = ? AND p.servicio = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ss", $zona, $servicio);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $precios = $resultado->fetch_assoc();
            return $precios ? $precios : null;
        }catch(Exception $e){
            return null;
        }
    }

    public function getPorcentajeCombustible(){
        try{
            $query = "SELECT cargo_por_combustible FROM Configuracion_global";
            $result = $this->conexionDB->query($query);
            if ($result) {
                $row = $result->fetch_assoc();
                return $row['cargo_por_combustible'];
            } else {
                return 0;
            }
        }catch(Exception $e){
            return 0;
        }
    }

    public function getPrecioSeguro(){
        try{
            $query = "SELECT precio_seguro FROM Configuracion_global";
            $result = $this->conexionDB->query($query);
            if ($result) {
                $row = $result->fetch_assoc();
                return $row['precio_seguro'];
            } else {
                return 0;
            }
        }catch(Exception $e){
            return 0;
        }
    }

    public function getZonas(){
        try{
            $query = "SELECT * FROM Zonas";
            $result = $this->conexionDB->query($query);
            $zonas = $result->fetch_assoc();
            return $zonas ? $zonas : null;
        }catch(Exception $e){
            return null;
        }
    }

    public function getZonaOf($distancia){{
      try{
        $query = "SELECT nombre FROM zonas WHERE ? BETWEEN rango_min AND rango_max LIMIT 1";
        $stmt = $this->conexionDB->prepare($query);
        $stmt->bind_param("d", $distancia);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $nombre = $resultado->fetch_assoc();
        if ($nombre) {
            return $nombre['nombre'];
        } else {
            return "No se encontró ninguna zona para este número.";
        }
      } catch(Exception $ex){
        return "No se encontró ninguna zona para este número.";
      } 
    }}

    public function getTicket($guia){
        $ticket = null;
        try{
            $query = "SELECT * FROM ticket WHERE guia = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $guia);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $ticket = $resultado->fetch_assoc();
        }catch(Exception $e){
            throw new Exception("No se encontó el ticket");
        }

        $ticket_conceptos = null;

        try{
            $query = "SELECT * FROM Concepto_ticket WHERE id = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $ticket['id']);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $ticket_conceptos = $resultado->fetch_all();

            $ticket['ticket_conceptos'] = $ticket_conceptos;
        }catch(Exception $e){
        }

        return $ticket;
    }

    public function getSucursal($numero_sucursal){
        $sucursal = null;
        try{
            $query = "SELECT * FROM Sucursales WHERE numero_sucursal = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $numero_sucursal);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $sucursal = $resultado->fetch_assoc();
            
            if($sucursal){
                return $sucursal;
            }else{
                throw new Exception("No se encontro el ticket");
            }
        }catch(Exception $e){
            throw new Exception("No se encontó el ticket");
        }
    }

    public function createStatus($guia, $colaborador, $estatus){
        try{
            $query1 = "INSERT INTO Estatus_Paquete(guia, colaborador, estatus) VALUES (?,?,?)";
            $stmt = $this->conexionDB->prepare($query1);
            $stmt->bind_param("sss",$guia, $colaborador, $estatus);
            $stmt->execute();

            try {
                $query2 = "SELECT * FROM Estatus_Paquete WHERE guia = $guia ORDER BY fecha_cambio DESC LIMIT 1;";
                $result = $this->conexionDB->query($query2);
                $status = $result->fetch_assoc();

                if($status){
                    return $status;
                }else{
                    return;
                }
            } catch (Exception $e) {
            }

        }catch(Exception $e){
            throw new Exception("Error al crear el estatus");
        }
    }

}
