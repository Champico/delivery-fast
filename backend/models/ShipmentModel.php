<?php

class ShipmentModel{

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
            throw new Exception("Ocurrio un error en el servidor");
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
            throw new Exception("Ocurrio un error en el servidor");
        }
    }

    public function get($guide){
        try {
            $query = "SELECT * FROM Datos_completos_Envio WHERE guia = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $guide);
            $stmt->execute();
            $result = $stmt->get_result();
            $shipment = $result->fetch_assoc();
            return  $shipment ?  $shipment : null;
        } catch (Exception $e) {
            throw new Exception("Ocurrio un error en el servidor");
        }
    }


    public function create($data)
    {
        $guia = null;
        $folio = null;
        $data = $this->fillOptionalFields($data);

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
            $this->insertShipment(
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
            $this->insertContacto(
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
            $this->insertContacto(
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

        if(isset($data['ticket']['conceptos_ticket']) && !empty(isset($data['ticket']['conceptos_ticket'])) ){
            try{
                $this->insertTicket($data['ticket']['conceptos_ticket'], $data['costo'], $guia);
            }catch(Exception $e){
                throw new Exception("Error al crear el ticket");
            }
        }
        
        $newShipment = null;

        try {
            $queryGetEnvio = "SELECT * FROM Datos_completos_Envio WHERE guia=$guia";
            $result = $this->conexionDB->query($queryGetEnvio);
            $newShipment = $result->fetch_assoc();
        } catch (Exception $e) {
        }

        try{
            $this->createStatusWithDate($newShipment["guia"], $data["colaborador"], "Pendiente", $newShipment["fecha_creacion"]);
        } catch (Exception $e) {       
        }

        return $newShipment;
    }

    public function getCoordinatesOfBranch($id_branch){
        $coordinates = null;
        try {
            $query = "SELECT latitud_dec, longitud_dec FROM Sucursales WHERE numero_sucursal = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $id_branch);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $coordinates = $resultado->fetch_assoc();
            return  $coordinates ?  $coordinates : null;
        } catch (Exception $e) {
            return null;
        }
    }

    public function exists($guide){
        try {
            $query = "SELECT COUNT(*) AS count FROM envios WHERE guia = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $guide);
            $stmt->execute();
            $result = $stmt->get_result();
            $shipment = $result->fetch_assoc();
            if($shipment['count'] > 0){
                return true;
            }else{
                return false;
            }
        } catch (Exception $e) {
            throw new Exception("Ocurrio un error en el servidor");
        }
    }

    public function getAllBrWithParams($params){

        $where_clauses = [];
        $bind_types = "";
        $bind_values = [];

        $query = "SELECT * FROM Envios_general ";

        if(isset($params['numero_sucursal'])){
            $where_clauses[] = "numero_sucursal = ? ";
            $bind_types .= "s";
            $bind_values[] = $params['numero_sucursal'];
        }

        if(isset($params['servicio'])){
            $where_clauses[] = "servicio = ? ";
            $bind_types .= "s";
            $bind_values[] = $params['servicio'];
        }

        if(isset($params['estatus'])){
            $where_clauses[] = "estatus = ? ";
            $bind_types .= "s";
            $bind_values[] = $params['estatus'];
        }

        if(isset($params['seguro'])){
            $where_clauses[] = "seguro = ? ";
            $bind_types .= "i";
            $bind_values[] = (int) $params['seguro'];
        }

        if(isset($params['fecha_inicio']) || isset($params['fecha_final'])){
            $bind_values[] = $params['fecha_inicio'] ?: "2020-01-01";
            $bind_values[] = $params['fecha_final'] ?: date('Y-m-d');
            $where_clauses[] =  "fecha_creacion BETWEEN ? AND ? ";
            $bind_types .= "ss";
        }

        if (count($where_clauses) > 0) {
            $query .= "WHERE " . implode(" AND ", $where_clauses) . " ";
        }

        $query .= $params['orden'] === "asc" ? "ORDER BY folio ASC " : "ORDER BY folio DESC ";

        $bind_values[] = (int) $params['limite_max'] - (int) $params['limite_min'];
        $bind_values[] = (int) $params['limite_min'];
        $query .= "LIMIT ? OFFSET ?;";
        $bind_types .= "ii";

        try {
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param($bind_types, ...$bind_values );
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $shipments = [];
                while ($row = $result->fetch_assoc()) {
                    $shipments[] = $row;
                }

                return $shipments;
            } else {
                return [];
            }
        } catch(Exception $e){
            return [];
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

    private function insertShipment($guia, $folio, $costo, $peso, $largo, $alto, $ancho, $contenido, $tipo_servicio, $seguro, $conductor_asignado, $numero_sucursal)
    {
        if(!isset($guia) || empty($guia)) throw new Exception("Es necesaria una guia para crear el envío");

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
                "sssssssssssss",
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
            echo json_encode($e->getMessage());
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
            return "No se encontró ninguna zona";
        }
      } catch(Exception $ex){
        return "No se encontró ninguna zona";
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
            $query = "SELECT 
                    	s.numero_sucursal,
                        s.correo,
                        s.telefono,
                        s.calle,
                        s.numero_ext,
                        s.numero_int,
                        s.cp,
                        s.colonia,
                        s.ciudad,
                        s.latitud_dec,
                        s.longitud_dec,
                        s.hora_salida_diaria,
                        s.estado,
                        e.nombre AS nombre_estado,
                        e.abreviatura_informal AS abr_inf_estado
                    FROM Sucursales AS s
                    INNER JOIN entidades_federativas AS e ON e.clave = s.estado
                    WHERE numero_sucursal = ?;
                    ";
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

    private function createStatusWithDate($guia, $colaborador, $estatus, $datestamp){

        try{
            $query1 = "INSERT INTO Estatus_Paquete(guia, colaborador, estatus, fecha_cambio) VALUES (?,?,?,?)";
            $stmt = $this->conexionDB->prepare($query1);
            $stmt->bind_param("ssss", $guia, $colaborador, $estatus, $datestamp);
            if($stmt->execute()){
                return true;
            }else{
                return false;
            }
        }catch(Exception $e){
            throw new Exception("Error al crear el estatus");
        }

    }







    /*__________________________________________________________________

           O  B  T  E  N  E  R    C  O  N  S  T  A  N  T  E  S 
    __________________________________________________________________*/

    public function getShippingGuidePrice($zone, $service){
        $precios = null;
        try{
            $query = "SELECT precio FROM  Precios WHERE zona = ? AND servicio = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ss", $zone, $service);
            $stmt->execute();
            $result = $stmt->get_result();
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener el precio de la guía");
        }

        if($result->num_rows > 0){
            $precios = $result->fetch_assoc();
            return (float) $precios["precio"];
        }else{
            throw new Exception("La zona o el precio no existen");
        }
    }
    
    public function getInsuranseCost(){
        try{
            $query = "SELECT precio_seguro FROM Configuracion_global";
            $result = $this->conexionDB->query($query);
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener el precio del seguro");
        }
        
        if ($result) {
            $row = $result->fetch_assoc();
            return (float) $row['precio_seguro'];
        } else {
            return 0;
        }
    }

    public function getAdditionalPercentageForFuel(){
        try{
            $query = "SELECT cargo_por_combustible FROM Configuracion_global";
            $result = $this->conexionDB->query($query);
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener el cargo por combustible");
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return (float) $row['cargo_por_combustible'];
        } else {
            return 0;
        }
    }


    public function getPricesForOverweight($zone, $service){
        try{
            $query = "SELECT ts.peso_max_amparado, p.medida_aumento_peso, p.precio_aumento
                      FROM Tipo_servicio AS ts
                      INNER JOIN Precios AS p ON p.servicio = ts.nombre
                      WHERE p.zona = ? AND p.servicio = ?;";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ss", $zone, $service);
            $stmt->execute();
            $result = $stmt->get_result();
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener el costo por sobrepeso");
        }

        if ($result->num_rows > 0) {
            $precios = $result->fetch_assoc();
            $precios["peso_max_amparado"] = (float) $precios["peso_max_amparado"]; 
            $precios["precio_aumento"] = (float)  $precios["precio_aumento"]; 
            $precios["medida_aumento_peso"] = (float) $precios["medida_aumento_peso"];
            return $precios;
        } else {
            throw new Exception("Ocurrio un error al obtener los costos por sobrepeso");
        }
       
    }

    public function getNameServices(){
        try{
            $query = "SELECT nombre FROM tipo_servicio;";
            $result = $this->conexionDB->query($query);
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener los servicios");
        }

        if ($result->num_rows > 0) {
            $services = [];
            while ($row = $result->fetch_assoc()) {
                $services[] = $row["nombre"];
            }
            return $services;
        } else {
            throw new Exception("No se encontro ningún servicio");
        }
    }

    public function getNameStatus(){
        try{
            $query = "SELECT id FROM estatus;";
            $result = $this->conexionDB->query($query);
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener los Estatus");
        }

        if ($result->num_rows > 0) {
            $services = [];
            while ($row = $result->fetch_assoc()) {
                $services[] = $row["id"];
            }
            return $services;
        } else {
            throw new Exception("No se encontro ningún Estatus");
        }
    }



    private function fillOptionalFields($data){
        if(!isset($data['correo_remitente']))         $data['correo_remitente'] = null;
        if(!isset($data['telefono_remitente']))       $data['telefono_remitente'] = null;
        if(!isset($data['numeroInt_remitente']))      $data['numeroInt_remitente'] = null;
        if(!isset($data['referencias_remitente']))    $data['referencias_remitente'] = null;

        if(!isset($data['correo_destinatario']))      $data['correo_destinatario'] = null;
        if(!isset($data['telefono_destinatario']))    $data['telefono_destinatario'] = null;
        if(!isset($data['numeroInt_destinatario']))   $data['numeroInt_destinatario'] = null;
        if(!isset($data['referencias_destinatario'])) $data['referencias_destinatario'] = null;
        
        if(!isset($data['conductor_asignado']))       $data['conductor_asignado'] = null;
        return $data;
    }


}