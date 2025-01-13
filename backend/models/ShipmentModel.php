<?php

class ShipmentModel{

    private $conexionDB;

    public function __construct($conexionDB)
    {
        $this->conexionDB = $conexionDB;
    }




    /*╔═════════════════════════════════╗
      ║ C R E A C I Ó N  D E  E N V Í O ║
      ╚═════════════════════════════════╝*/
      
    public function create($data)
    {
        $newShipment = null;

        try{
            $data = $this->fillOptionalFields($data);
            $data["folio"] = $this->generateFolio();
            $data["guia"] = $this->generateGuia();
            $this->insertShipment($data);
            $this->insertContactos($data);
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }

        $guia = $data["guia"];

        try {
            $query = "SELECT * FROM Datos_completos_Envio WHERE guia=$guia";
            $result = $this->conexionDB->query($query);
            $newShipment = $result->fetch_assoc();
        } catch (Exception $e) {
            throw new Exception("Se creo el envío pero no fue posible obtenerlo");
        }

        $fecha_de_creacion = $newShipment["fecha_creacion"];

        try{
            $this->insertTicket($data, $fecha_de_creacion);
            $this->createStatusWithDate($guia, $data["colaborador"], "Pendiente", $fecha_de_creacion);
        }catch(Exception $e){
            throw new Exception("Se creo el envío pero no se pudo crear el ticket y el estatus");
        }
        
        return $newShipment;
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

    private function insertShipment($data)
    {
        try {
            $query = "INSERT INTO Envios(
                        guia,
                        folio,
                        costo,
                        peso,
                        largo,
                        alto,
                        ancho,
                        contenido,
                        servicio,
                        seguro,
                        conductor_asignado,
                        numero_sucursal) 
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param(
                "sidddddssiss",
                $data['guia'],
                $data['folio'],
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
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error al crear el envío " . $e->getMessage());
        }
    }

    private function insertContactos($data)
    {
        $remitente = "Remitente";
        $destinatario = "Destinatario";

        try {
            $query = "INSERT INTO Contactos (
                        guia,
                        tipo,
                        nombre_completo,
                        correo,
                        telefono,
                        calle,
                        numero_ext,
                        numero_int,
                        colonia,
                        cp,
                        ciudad,
                        referencias,
                        estado)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

            $stmt1 = $this->conexionDB->prepare($query);

            $stmt1->bind_param(
                "sssssssssssss",
                $data["guia"],
                $remitente,
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

            $stmt1->execute();

            $stmt2 = $this->conexionDB->prepare($query);

            $stmt2->bind_param(
                "sssssssssssss",
                $data["guia"],
                $destinatario,
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
              
            $stmt2->execute();

            try{
                $stmt1->close();
                $stmt2->close();
            }catch(Exception $e2){}
            
        } catch (Exception $e) {
            throw new Exception("Error al cargar los datos de contacto");
        }
    }

    private function insertTicket($data, $fecha_de_creacion){
        $ticket = null;
        $guia = $data["guia"];

        try{
            $query = "INSERT INTO ticket(
                        total,
                        fecha_creacion,
                        metodo_de_pago,
                        pago_con,
                        cambio,
                        guia)
                    VALUES (?,?,?,?,?,?)";

            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param(
                "dssdds",
                $data["ticket"]["total"],
                $fecha_de_creacion,
                $data["ticket"]["metodo_de_pago"],
                $data["ticket"]["pago_con"],
                $data["ticket"]["cambio"],
                $data['guia']
            );
            $stmt->execute();
            
            try{
                $stmt->close();
            }catch(Exception $e){}
        }catch(Exception $e){
            throw new Exception("No se pudo crear el ticket");
        }


        try {
            $query2 = "SELECT * FROM ticket WHERE guia=$guia";
            $result = $this->conexionDB->query($query2);
            $ticket = $result->fetch_assoc();
        } catch (Exception $e) {
        }

        try{
            $id_ticket = $ticket['id'];

            if($ticket){
                $cantidad = 1;

                foreach($data['ticket']['conceptos_ticket'] as $indice => $concepto) {
                    try{
                        $query3 = "INSERT INTO Concepto_ticket(
                                    id_ticket,
                                    cantidad,
                                    descripcion,
                                    precio_unitario,
                                    subtotal)
                                VALUES (?,?,?,?,?);";
                        $stmt2 = $this->conexionDB->prepare($query3);
                        $stmt2->bind_param(
                            "iisdd",
                            $id_ticket,
                            $cantidad,
                            $concepto["descripcion"],
                            $concepto["valor"],
                            $concepto["valor"]
                        );
                        $stmt2->execute();
                    }catch(Exception $e){}
                }

            }

        }catch(Exception $e){
            throw new Exception("Error al crear el ticket");
        }
    }















    /*╔═══════════════════════════════════════════════════╗
      ║   O B T E N E R  T O D O S  L O S  E N V I O S    ║
      ╚═══════════════════════════════════════════════════╝*/

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












    /*╔═══════════════════════════════════════════════════════╗
      ║   O B T E N E R  E N V I O S  D E  S U C U R S A L    ║
      ╚═══════════════════════════════════════════════════════╝*/

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

    









    /*╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
      ║   O B T E N E R  E N V I O S  D E  S U C U R S A L  C O N S U L T A  P E R S O N A L I Z A D A   ║
      ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝*/

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

    /*╔═════════════════════════════════════════════╗
      ║   O B T E N E R  E N V I O  E S T A T U S   ║
      ╚═════════════════════════════════════════════╝*/

      public function getStatusHistory($guide) {
        try {
            // Consultar todos los estatus asociados a la guía, ordenados por fecha de cambio
            $query = "SELECT * FROM estatus_paquete WHERE guia = ? ORDER BY fecha_cambio DESC";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("s", $guide);
            $stmt->execute();
            $result = $stmt->get_result();
            $statusHistory = $result->fetch_all(MYSQLI_ASSOC);
    
            // Devolver el historial de estatus o un array vacío si no hay registros
            return $statusHistory ?: [];
        } catch (Exception $e) {
            throw new Exception("Error al obtener el historial de estatus: " . $e->getMessage());
        }
    }
    

public function updateStatus($guide, $new_status, $colaborador, $notes) {
    try {
        // Insertar el nuevo estatus en la tabla `estatus_paquete`
        $query = "INSERT INTO estatus_paquete (fecha_cambio, estatus, guia, colaborador, notas) 
                VALUES (NOW(), ?, ?, ?, ?)";
        $stmt = $this->conexionDB->prepare($query);
        $stmt->bind_param("ssss", $new_status, $guide, $colaborador, $notes);
        $stmt->execute();


        // Verificar si la inserción fue exitosa
        if ($stmt->affected_rows > 0) {
            return true;
        } else {
            throw new Exception("No se pudo registrar el cambio de estatus.");
        }
    } catch (Exception $e) {
        throw new Exception("Error al actualizar el estatus: " . $e->getMessage());
    }
}












    /*╔═══════════════════════════════╗
      ║   O B T E N E R  E N V I O    ║
      ╚═══════════════════════════════╝*/

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

    public function updateSender($data, $guia){
        $query = "UPDATE contactos ";
        $sql_clauses = [];
        $bind_types = "";

        if(isset($data["nombre_completo"])) {
            $sql_clauses[] = "nombre_completo = ?";
            $bind_types .= "s";
            $bind_values[] = $data["nombre_completo"];
        }
        
        if(isset($data["cp"])){
            $sql_clauses[] = "cp = ?";
            $bind_types .= "s";
            $bind_values[] = $data["cp"];
        }

        if(isset($data["estado"])){
            $sql_clauses[] = "estao = ?";
            $bind_types .= "s";
            $bind_values[] = $data["estado"];
        }

        if(isset($data["ciudad"])){
            $sql_clauses[] = "ciudad = ?";
            $bind_types .= "s";
            $bind_values[] = $data["ciudad"];
        }

        if(isset($data["colonia"])){
            $sql_clauses[] = "colonia = ?";
            $bind_types .= "s";
            $bind_values[] = $data["colonia"];
        }
        if(isset($data["calle"])){
            $sql_clauses[] = "calle = ?";
            $bind_types .= "s";
            $bind_values[] = $data["calle"];
        }
        if(isset($data["numero_ext"])){
            $sql_clauses[] = "numero_ext = ?";
            $bind_types .= "s";
            $bind_values[] = $data["numero_ext"];
        }
        if(isset($data["numero_int"])){
            $sql_clauses[] = "numero_int = ?";
            $bind_types .= "s";
            $bind_values[] = $data["numero_int"];
        }
        if(isset($data["telefono"])){
            $sql_clauses[] = "telefono = ?";
            $bind_types .= "s";
            $bind_values[] = $data["telefono"];
        }
        if(isset($data["correo"])){
            $sql_clauses[] = "correo = ?";
            $bind_types .= "s";
            $bind_values[] = $data["correo"];
        }

        if (count($sql_clauses) > 0) {
            $query .= "SET " . implode(", ", $sql_clauses) . "";
        }

        $query .= " WHERE guia = ? AND tipo='remitente';";
        $bind_types .= "s";
        $bind_values[] = $guia;

        error_log(json_encode($query));

        try {
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param($bind_types, ...$bind_values );
            $stmt->execute();
            $result = $stmt->get_result();

            if($result){
                return true;
            } else {
                return false;
            }
        } catch(Exception $e){
            throw new Exception("Ocurrio un error al actualizar los datos" . $e->getMessage());
        }

    }



    
    public function updateRecipient($data, $guia){
        $query = "UPDATE contactos ";
        $sql_clauses = [];
        $bind_types = "";

        if(isset($data["nombre_completo"])) {
            $sql_clauses[] = "correo = ?";
            $bind_types .= "s";
            $bind_values[] = $data["nombre_completo"];
        }
        
        if(isset($data["cp"])){
            $sql_clauses[] = "cp = ?";
            $bind_types .= "s";
            $bind_values[] = $data["cp"];
        }

        if(isset($data["estado"])){
            $sql_clauses[] = "estao = ?";
            $bind_types .= "s";
            $bind_values[] = $data["estado"];
        }

        if(isset($data["ciudad"])){
            $sql_clauses[] = "ciudad = ?";
            $bind_types .= "s";
            $bind_values[] = $data["ciudad"];
        }

        if(isset($data["colonia"])){
            $sql_clauses[] = "colonia = ?";
            $bind_types .= "s";
            $bind_values[] = $data["colonia"];
        }
        if(isset($data["calle"])){
            $sql_clauses[] = "calle = ?";
            $bind_types .= "s";
            $bind_values[] = $data["calle"];
        }
        if(isset($data["numero_ext"])){
            $sql_clauses[] = "numero_ext = ?";
            $bind_types .= "s";
            $bind_values[] = $data["numero_ext"];
        }
        if(isset($data["numero_int"])){
            $sql_clauses[] = "numero_int = ?";
            $bind_types .= "s";
            $bind_values[] = $data["numero_int"];
        }
        if(isset($data["telefono"])){
            $sql_clauses[] = "telefono = ?";
            $bind_types .= "s";
            $bind_values[] = $data["telefono"];
        }
        if(isset($data["correo"])){
            $sql_clauses[] = "correo = ?";
            $bind_types .= "s";
            $bind_values[] = $data["correo"];
        }

        if (count($sql_clauses) > 0) {
            $query .= "SET " . implode(", ", $sql_clauses) . "";
        }

        $query .= " WHERE guia = ? AND tipo='destinatario';";
        $bind_types .= "s";
        $bind_values[] = $guia;

        error_log(json_encode($query));

        try {
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param($bind_types, ...$bind_values );
            $stmt->execute();
            $result = $stmt->get_result();

            if($result){
                return true;
            } else {
                return false;
            }
        } catch(Exception $e){
            throw new Exception("Ocurrio un error al actualizar los datos" . $e->getMessage());
        }

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

        try{
            $query2 = "SELECT * FROM Concepto_ticket WHERE id_ticket = ?;";
            $stmt2 = $this->conexionDB->prepare($query2);
            $stmt2->bind_param("s", $ticket['id']);
            $stmt2->execute();
            $result = $stmt2->get_result();

            if ($result->num_rows > 0) {
                $concepts = [];
                while ($row = $result->fetch_assoc()) {
                    $concepts[] = $row;
                }
                $ticket['conceptos_ticket'] = $concepts;
            } else {
                $ticket['conceptos_ticket'] = [];
            }
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al obtener los conceptos del ticket ." . $e->getMessage());
        }

        try{
            $stmt->close();
            $stmt2->close();
        }catch(Exception $e){}
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

    public function getCustomer($type, $guide){
        try{
            $query = "SELECT * FROM contactos WHERE guia=? AND tipo = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ss", $guide, $type);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $customer = $resultado->fetch_assoc();
            
            if($customer){
                return $customer;
            }else{
                throw new Exception("No se encontro el ticket");
            }
        }catch(Exception $e){
            throw new Exception("No se encontó el ticket");
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





?>