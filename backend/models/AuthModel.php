<?php
class AuthModel
{
    private $conexionDB;

    public function __construct($conexionDB)
    {
        $this->conexionDB = $conexionDB;
    }

    public function login($user, $password){
        try{
            $query = "SELECT * FROM Colaboradores WHERE numero_personal = ? AND contrasena = ?";
            $stmt = $this->conexionDB->prepare($query);
            $stmt->bind_param("ss", $user, $password);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            if($result->num_rows > 0){
                return $result->fetch_assoc();    
            }else{
                return false;
            }
        }catch(Exception $e){
            throw new Exception("Ocurrio un error al iniciar sesión");
        }
    }

}

?>