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

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->setDefaultFont('Lucida Console');

        $dompdf = new Dompdf($options);

        $logo = base64_encode(file_get_contents(__DIR__ . '/../src/images/logotipo-extendido.svg'));

        $width_milimeters = Self::$widthTicket - (Self::$widthTicket * 0.1);
        $width_points = Self::$widthTicket * 2.83465;

        $html = "
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    *{
                        font-family: Lucida Console, Arial, sans-serif;
                        font-size: 16px;
                    }
                
                    html{
                        width: ". $width_milimeters . "mm;
                        padding: 0;
                        margin: 0;
                    }
                
                    body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                    }
                    
                    #logotipo{
                        width: ". $width_milimeters . "mm;
                    }

                    img{
                        width: 100%;
                        fill: #000;
                    }
                
                    #ticket{
                        width: 100%;
                        box-sizing: border-box;
                        padding: 3mm;
                        margin: 0;
                        border: 1px solid #000;
                    }
                
                    div{
                        box-sizing: border-box;
                        padding: 0;
                        margin: 0;
                    }
                    #fiscal-info, #branch-info, #ticket-info{
                        padding-top: 2mm;
                        padding-bottom: 3mm;
                        line-height: 3px;
                        border-bottom: solid 1px #000;
                    }
                
                    #package-info{
                        padding-top: 2mm;
                        padding-bottom: 3mm;
                        line-height: 3px;
                    }
                
                    table {
                        width: 90%;
                        border-collapse: collapse;
                        margin-top: 15px;
                        border-bottom: solid 1px #666;
                    }

                    th, td{
                        text-align: left;
                    }

                    thead {
                        font-weight: bold;
                        background-color: transparent;
                    }

                    .total-grid {
                        padding-bottom: 20px;
                        border-bottom: solid 1px #000;
                        line-height: 3px;
                    }

                    .total-grid{
                        padding-bottom: 20px;
                        border-bottom: solid 1px #000;
                        line-height: 3px;
                    }

                    #total {
                        font-weight: bold;
                    }

                    td {
                        margin-top: 0;
                        margin-bottom: 0;
                        padding-top: 0;
                        padding-bottom: 0;
                        line-height: 14px;
                    }   

                    td > p {
                        display: block;
                        margin: 0;
                        padding-top: 3px;
                        padding-bottom: 3px;
                    }
                </style>
            </head>
            <body>
                <div id='ticket'>
                    <div id='header'>
                        <div id='logotipo'>
                            <img src='data:image/svg+xml;base64,{$logo}' alt='Logotipo'>
                        </div>
                        <div id='fiscal-info'>
                            <p>" . htmlspecialchars($tax_data['nombre']) . " " . htmlspecialchars($tax_data['apellido_paterno']) . "</p>
                            <p>" . htmlspecialchars($tax_data['nombre_vialidad']) . " " . htmlspecialchars($tax_data['numero_exterior']) . "</p>
                            <p>" . htmlspecialchars($tax_data['colonia']) . " CP". htmlspecialchars($tax_data['cp']) . "</p>
                            <p>" . htmlspecialchars($tax_data['municipio']) ." " . htmlspecialchars($tax_data['entidad_federativa']) . ". </p>
                            <p>R.F.C " . htmlspecialchars($tax_data['RFC']) . "</p>
                        </div>
                        <div id='branch-info'>
                            <p>Sucursal: " . htmlspecialchars($sucursal['calle']) . " " . htmlspecialchars($sucursal['numero_ext']) ." </p>
                            <p>". htmlspecialchars($sucursal['ciudad']) .", " . htmlspecialchars($sucursal['abr_inf_estado']) .". CP." . htmlspecialchars($sucursal['cp']) ."</p>
                        </div>
                        <div id='ticket-info'>
                            <p>No. Tiket: ". htmlspecialchars($ticket['id']) ."</p>
                            <p>Vendedor: ". "Generico" ."</p>
                        </div>
                    </div>
                
                    <div id='package-info'>
                        <p id='guia'>Guia:". htmlspecialchars($shipment['guia']) ."</p>
                        <p>Contenido: ". htmlspecialchars($shipment['contenido']) ."</p>
                        <p>Destinatario: ". htmlspecialchars($shipment['nombre_destinatario']) ."</p>
                        <p>Destino: ". htmlspecialchars($shipment['ciudad_destinatario']) . htmlspecialchars($shipment['estado_destinatario']) . "</p>
                        <p>Peso: " . htmlspecialchars($shipment['peso']) . "</p>
                        <p>Referencias: " . htmlspecialchars($shipment['referencias_destinatario']) ."</p>
                    <div>
                
                    <table>
                        <thead>
                            <tr>
                                <th><p>C.</p></th>
                                <th><p>Des.</p></th>
                                <th><p>Pre.</p></th>
                                <th><p>Imp.</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><p>1</p></td>
                                <td><p>Guía</p></td>
                                <td><p>$340</p></td>
                                <td><p>$340</p></td>
                            </tr>
                            <tr>
                                <td><p>1</p></td>
                                <td><p>Costo por sobrepeso y un poco mas jaja</p></td>
                                <td><p>$30</p></td>
                                <td><p>$30</p></td>
                            </tr>
                            <tr>
                                <td><p>1</p></td>
                                <td><p>Costo por combustible</p></td>
                                <td><p>$30</p></td>
                                <td><p>$30</p></td>
                            </tr>
                        </tbody>
                    </table>
                
                    <div class='total-grid'>
                        <p>Subtotal: 20</p>
                        <p>Iva: 10</p>
                        <p>Total: 30</p>
                    </div>
                
                </div>
            </body>
            </html>
        ";

        $dompdf->loadHtml($html);
        $dompdf->setPaper([0, 0, $width_points, 1800]);
        $dompdf->render();
        return $dompdf->output();
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
}




?>

