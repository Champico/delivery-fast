<?php

    $loaded = LoaderEnv::getInstance();

    class LoaderEnv{
        private $loaded = false;
        private static $instance;

        private function __construct($file)
        {
            $this->loadFile($file);
        }

        public static function getInstance(){
            if(self::$instance === null){
                self::$instance = new LoaderEnv(__DIR__ . '/.env');
            }
            return self::$instance;
        }

        public function loadEnv($file){
            if($this->loaded){
                return $this->loaded;
            }else{
                $this->loadFile($file);
                $this->loaded = true;
                return $this->loaded;
            }
        }

        public function reloadEnv($file){
            $this->loadFile($file);
            return true;
        }

        private function loadFile($file)
        {
            try{
                if (!file_exists($file)) {
                    throw new Exception("No se encontrarón las credenciales");
                }
        
                $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos($line, '#') === 0) {
                        continue;
                    }
        
                    list($key, $value) = explode('=', $line, 2);
        
                    $key = trim($key);
                    $value = trim($value);
        
                    putenv("$key=$value");
                    $_ENV[$key] = $value;
                }

            }catch(Exception $e){
                $this->loaded = false;
                throw new Exception("Error del servidor 'Forbiden' ");
            }
            
        }
    }
?>
