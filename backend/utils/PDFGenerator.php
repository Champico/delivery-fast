<?php
require 'vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;
//use Picqer\Barcode\BarcodeGeneratorPNG;

class PDFGenerator
{
    public static $widthTicket = 80;
    public static $widthGuide = 160;

    public static function createTicketPDF($ticket, $tax_data, $sucursal, $shipment){
        echo error_log(json_encode(["EL TICKET EN PDF CREATOR > " => var_dump($ticket)]));

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->setDefaultFont('Sans');

        $dompdf = new Dompdf($options);

        $html = "<!DOCTYPE html>
                <html>
                    <head>";

        $html .= Self::getStylesTicketHtml(); 

        $html .= "
            </head>
            <body>
                <div id='ticket'>
                    <div id='header'>
                        <div id='logotipo'>";


        try{
            if (file_exists(__DIR__ . '/../src/images/logotipo-extendido.svg')) {
                $logo = base64_encode(file_get_contents(__DIR__ . '/../src/images/logotipo-extendido.svg'));
                $html.= "<img src='data:image/svg+xml;base64,{$logo}' alt='Logotipo'>";
            }
        }catch(Exception $e){
            error_log($e->getMessage()); 
        }


                            
        $html .= "      </div>

                        <div class='info' id='fiscal-info'>
                            <p>" . htmlspecialchars($tax_data['nombre'] ?? "") . " " . htmlspecialchars($tax_data['apellido_paterno'] ?? "") . "</p>
                            <p>" . htmlspecialchars($tax_data['nombre_vialidad'] ?? "") . " " . htmlspecialchars($tax_data['numero_exterior'] ?? "") . "</p>
                            <p>" . htmlspecialchars($tax_data['colonia'] ?? "") . " CP". htmlspecialchars($tax_data['cp'] ?? "") . "</p>
                            <p>" . htmlspecialchars($tax_data['municipio'] ?? "") ." " . htmlspecialchars($tax_data['entidad_federativa'] ?? "") . ". </p>
                            <p>R.F.C " . htmlspecialchars($tax_data['RFC'] ?? "") . "</p>
                        </div>

                        <div class='info' id='branch-info'>
                            <p><span>Sucursal: </span>" . htmlspecialchars($sucursal['calle'] ?? "") . " " . htmlspecialchars($sucursal['numero_ext'] ?? "") ." </p>
                            <p>". htmlspecialchars($sucursal['ciudad'] ?? "") .", " . htmlspecialchars($sucursal['abr_inf_estado'] ?? "") .". CP." . htmlspecialchars($sucursal['cp'] ?? "") ."</p>
                        </div>

                        <div class='info' id='ticket-info'>
                            <p><span>No. Tiket: </span>". htmlspecialchars($ticket['id'] ?? "") ."</p>
                            <p><span>Vendedor: </span>". "Generico" ."</p>
                        </div>

                    </div>
                
                    <div class='info' id='package-info'>
                        <p id='guia'><span>Guia: </span>". htmlspecialchars($shipment['guia'] ?? "") ."</p>
                        <p><span>Contenido: </span>".      htmlspecialchars($shipment['contenido'] ?? "") ."</p>
                        <p><span>Destinatario: </span>".   htmlspecialchars($shipment['nombre_destinatario'] ?? "") ."</p>
                        <p><span>Destino: </span>".        htmlspecialchars($shipment['ciudad_destinatario'] ?? "") . htmlspecialchars($shipment['estado_destinatario'] ?? "") . "</p>
                        <p><span>Peso: </span>" .          htmlspecialchars($shipment['peso'] ?? "") . "</p>
                        <p><span>Referencias: </span>" .   htmlspecialchars($shipment['referencias_destinatario'] ?? "") ."</p>
                    <div>
                
                    <table>
                        <thead>
                            <tr>
                                <th class='c1'><p>C.</p></th>
                                <th class='c2'><p>Des.</p></th>
                                <th class='c3'><p>Pre.</p></th>
                                <th class='c4'><p>Imp.</p></th>
                            </tr>
                        </thead>
                        <tbody>";

    $html .= PDFGenerator::createConcepts($ticket);

    $html .= "          </tbody>
                    </table>
                
                    <div class='total-container'>
                        <div class='total'>
                            <p><span>Total:</span>" . htmlspecialchars($shipment['costo'] ?? "") . "</p>
                        </div>
                    </div>
                
                </div>
            </body>
            </html>
        ";

        error_log(json_encode($html, JSON_UNESCAPED_UNICODE));
        $dompdf->loadHtml($html);
        $dompdf->setPaper([0, 0, (Self::$widthTicket * 2.83465), 1800]);
        $dompdf->render();

        return $dompdf->output();
    }

    private static function createConcepts($ticket){

        $htmlConceptos = "";

        if($ticket){

            foreach($ticket['conceptos_ticket'] as $indice => $concepto) {
                $row = "<tr>";
                $row .= "<td class='c1'><span>" . htmlspecialchars($concepto['cantidad'] ?? "")        . "</span></td>";
                $row .= "<td class='c2'>" .       htmlspecialchars($concepto['descripcion'] ?? "")     . "</td>";
                $row .= "<td class='c3'><span>" . htmlspecialchars($concepto['precio_unitario'] ?? "") . "</span></td>";
                $row .= "<td class='c4'><span>" . htmlspecialchars($concepto['subtotal'] ?? "")        . "</span></td>";
                $row .="</tr>";
                $htmlConceptos .= $row;
            }

        }
        return $htmlConceptos;
    }

    public static function createGuidePDF($shipment){
        echo (["shipment" => $shipment]);

        $generator = //new BarcodeGeneratorPNG();

        $code128 = //base64_encode($generator->getBarcode('123456789', $generator::TYPE_CODE_128));

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);

        $html = ' <p> Hola </p>'; 
        
        //'<img src="data:image/png;base64,' . $code128 . '" alt="Código 128">';

        $dompdf->loadHtml($html);
        $dompdf->setPaper([0, 0, (PDFGenerator::$widthGuide * 2.835), 0]);
        $dompdf->render();
        return $dompdf->output();
    }









private static function getStylesTicketHtml(){

    $width_milimeters = Self::$widthTicket - (Self::$widthTicket * 0.1);


    return "
    <style>
        * {
            font-family: Lucida Console, Arial, sans-serif;
            font-size: 16px;
        }
        html {
            width: ". $width_milimeters ." mm;
            padding: 0;
            margin: 0;
        }
        body {
            width: 100%;
            padding: 0;
            margin: 0;
        }
        #logotipo {
            width: ". $width_milimeters ."mm;
        }
        img {
            width: 100%;
            fill: #000;
        }
        #ticket {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding: 3mm;
            margin: 0;
            border: 1px solid #000;
        }
        div {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }

        .info > p {
            display: block;
            margin: 0;
            padding-top: 1px;
            padding-bottom: 1px;
            line-height: 1.1;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .info > p > span {
            font-weight: 700;
        }

        #fiscal-info, #branch-info, #ticket-info {
            padding-top: 2mm;
            padding-bottom: 3mm;
            border-bottom: solid 1px #000;
        }
        #package-info {
            padding-top: 2mm;
            padding-bottom: 3mm;
            line-height: 3px;
        }


        /* T A B L A */
        table {
            position: relative;
            top: 0;
            left: 0;
            font-size: 12px;
            width: ". $width_milimeters - 1 ."mm;
            border-collapse: collapse;
            margin-top: 15px;
            border-bottom: solid 1px #666;
        }

        thead {
            font-weight: bold;
            background-color: transparent;
            border-bottom: solid 1px #000;
        }

        thead > tr{
            padding-bottom: 2px;
            margin-bottom: 4px;
        }

        thead > tr > th > p{
            line-height: 1;
            margin-bottom: 2px;
            margin-top: 2px;
        }

        tr{
            min-height: 30px;
            max-height: 80px;
            height: 30px;
            position: relative;
        }

        th, td{
            position: relative;
            display: inline-block;
            text-align: left;
            margin: 0;
            font-size: 13px;
            padding-top: 3px;
            padding-bottom: 3px;
            line-height: 1.5;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .c1{ width: 9%; }
        .c2{ width: 43%;}
        .c3{ width: 20%;}
        .c4{ width: 20%;}

        .c1 > span, .c2 > span, .c3 > span, .c4 > span{
            position: absolute;
            display: block;
            top: 0;
            font-size: 13px;
        }

        /* C O S T O  F I N A L */
        .total-container{
            padding-bottom: 20px;
            border-bottom: solid 1px #000;
            line-height: 3px;
            height: 40px;
            position: relative;
        }

        .total{
            position: absolute;
            background: transparent;
            right: 20;
            top: 20;
        }
    </style>
    ";
}

}
?>

