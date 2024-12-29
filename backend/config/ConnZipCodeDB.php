<?php
class ConnZipCodeDB
{
    private static $instance;
    public $connection;

    public static function getInstance()
    {
        if (!self::$instance || self::$instance->isConnectionLost()) {
            self::$instance = new Self();
        }
        return self::$instance->getConnection();
    }

    private function __construct()
    {
        $this->initializeConnection();
    }

    private function initializeConnection(){
        $direccion = $_ENV['DATABASE_HOST'];
        $nombreBD = $_ENV['DATABASE2_NAME'];
        $usuario = $_ENV['DATABASE_USER'];
        $password = $_ENV['DATABASE_PASSWORD'];

        if (!$direccion || !$nombreBD || !$usuario || !$password) throw new Exception("Servicio denegado por falta de credenciales");

        $this->connection = new mysqli($direccion, $usuario, $password, $nombreBD);

        if ($this->connection->connect_error) {
            $this->closeConnection();
            throw new Exception("Error al conectar al servidor de datos de Codigos Postales");
        }
    }

    public function getConnection()
    {
        if ($this->connection && !$this->connection->connect_error) return $this->connection;
        $this->reconnect(); 
        return $this->connection;
    }


    private function reconnect()
    {
        $maxRetries = 3;
        $attempt = 0;

        $this->closeConnection();

        while ($attempt < $maxRetries && !$this->connection) {
            try {
                $this->initializeConnection();
            }catch(Exception $e){
                $attempt++;
                sleep(1);
            }
        }
        if ($attempt == $maxRetries) {
            throw new Exception("No se pudo reconectar al servidor de datos después de $maxRetries intentos.");
        }

        return true;
    }

    public function isConnectionLost()
    {
        if (!$this->connection) return true;
        return !$this->connection->ping();
    }

    public function closeConnection()
    {
        if ($this->connection) {
            $this->connection->close();
        }
        $this->connection = null;
    }
}
