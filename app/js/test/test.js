import { faker } from 'https://cdn.skypack.dev/@faker-js/faker/locale/es_MX';

import { fetchCreateShipment } from '../api/shipments.js';
createShipmentFakeData();

async function createShipmentFakeData(){
    const body = document.getElementById("body");

    for(let i=0; i<=50; i++){
        let localidad_remitente = getLocationDataOfXalapa();
        let localidad_destinatario = getLocationData();

        let shipmentData = {
            sucursal: "00001",
            colaborador: "111111",
            peso: parseFloat(faker.number.float({ min: 0.5, max: 50, precision: 0.01 }).toFixed(2)), // Peso en kg
            largo: parseFloat(faker.number.float({ min: 10, max: 200, precision: 0.01 }).toFixed(2)), // Largo en cm
            ancho: parseFloat(faker.number.float({ min: 10, max: 200, precision: 0.01 }).toFixed(2)), // Ancho en cm
            alto: parseFloat(faker.number.float({ min: 10, max: 200, precision: 0.01 }).toFixed(2)),  // Alto en cm
            contenido: faker.commerce.productName(), // Contenido del paquete
            servicio: faker.helpers.arrayElement(['Express','Día_siguiente','2-5_Dias','Terrestre']), // Tipo de servicio
            seguro: faker.datatype.boolean(), // Seguro (true o false)
            metodo_de_pago: "Efectivo",
            pago_con: faker.number.float({ min: 100, max: 50000, precision: 100 }), // Pago con billetes grandes
            
            // Datos del remitente
            nombre_remitente: faker.person.fullName(),
            correo_remitente: faker.internet.email(),
            telefono_remitente: faker.number.int({min: 2200000000, max: 9600000000}),
            calle_remitente: faker.location.street(),
            numeroExt_remitente: faker.location.buildingNumber(),

            colonia_remitente: localidad_remitente["nombre"],
            cp_remitente: localidad_remitente["cp"],
            ciudad_remitente: localidad_remitente["municipio"],
            estado_remitente: localidad_remitente["estado"],

            // Datos del destinatario
            nombre_destinatario: faker.person.fullName(),
            correo_destinatario: faker.internet.email(),
            telefono_destinatario: faker.number.int({min: 2281000000, max: 2283000000}),
            calle_destinatario: faker.location.street(),
            numeroExt_destinatario: faker.location.buildingNumber(),
            referencias_destinatario: faker.lorem.sentence(),

            colonia_destinatario: localidad_destinatario["nombre"],
            cp_destinatario: localidad_destinatario["cp"],
            ciudad_destinatario: localidad_destinatario["municipio"],
            estado_destinatario: localidad_destinatario["estado"],
        };
        
        let shipment = null;
        
        if(shipmentData){
        try{

            shipment = await fetchCreateShipment(shipmentData);
        }catch(e){
            const nuevoElemento = document.createElement('p');
            nuevoElemento.textContent = `Error del servidor, [${i}]`;
            body.appendChild(nuevoElemento);
        }
        }

        console.log(shipment && shipment != []);

        if(shipment){
            const nuevoElemento = document.createElement('p');
            nuevoElemento.textContent = `<br>Elemento ${i} : Creado con exito. Guia: ${shipment["guia"]}`;
            body.appendChild(nuevoElemento);
        }else{
            const nuevoElemento = document.createElement('p');
            nuevoElemento.textContent = `Error al crear el envio, [${i}]`;
            body.appendChild(nuevoElemento);
        }
    
    }
}


async function getLocationData(){
    let success = false;
    let cont = 0;

    let location = {};

    while(!success && cont < 20){
        const tempZipCode = faker.number.int({min: 10000, max: 99999});

        try{
            const response = fetch(`http://localhost/backend/utils/location-data/${tempZipCode}`);

            if(response.ok){
                location = await response.json()
                success = true;
            }
        }catch(error){}

        cont++;
    }

    return location;
}


async function getLocationDataOfXalapa(){
    let success = false;
    let cont = 0;

    let location = {};

    while(!success && cont < 20){
        const tempZipCode = faker.number.int({min: 91000, max: 95281});
        
        try{
            const response = fetch(`http://localhost/backend/utils/location-data/${tempZipCode}`);

            if(response.ok){
                location = await response.json()
                success = true;
            }
        }catch(error){}

        cont++;
    }

    return location;
}
