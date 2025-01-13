export async function getAllShipmentsOfBranch(num_sucursal) {
   let response;
      try {
          response = await fetch(`http://localhost/backend/shipment/branch/${num_sucursal}`);
    } catch (error) {
        return [];
    }
  
    let responseData = await response.json();
    if (!response.ok) return [];
    return responseData ? responseData : [];
}

export async function getAllShipmentsWithParams(params) {
    let response;

    console.log(params);

    let url = `http://localhost/backend/shipment/branch?search=true&numero_sucursal=${params['numero_sucursal']}&limite_min=${params['limite_min']}&limite_max=${params['limite_max']}&orden=${params['orden']}`

    if(params['fecha_inicio']) url = url + "&fecha_inicio=" + params['fecha_inicio']; 
    if(params['fecha_final'])  url = url + "&fecha_final=" + params['fecha_final'];
    if(params['servicio'])     url = url + "&servicio=" + params['servicio'];
    if(params['estatus'])      url = url + "&estatus=" + params['estatus'];
    if(params['seguro'])       url = url + "&seguro=" + params['seguro'];

    try {
        console.log(url);
        response = await fetch(url);
    } catch (error) {
        return [];
    }
   
     let responseData = await response.json();
     if (!response.ok) return [];
     return responseData ? responseData : [];
 }


export async function fetchCreateShipment(shipmentData) {
    const url = "http://localhost/backend/shipment";
    console.log("VA\n_________________________________________________\n", shipmentData,"\n");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shipmentData)
        });
        
        const responseData = await response.json();
        if (!response.ok) if(responseData.message) throw new Error(responseData.message);
       
        console.log("VIENE\n_________________________________________________\n",responseData, "\n");
       
        return responseData;
    } catch (error) {
        return [];
    }
}



export async function verifyIfExistsShipmentByGuide(guide) {
    let response;
       try {
           response = await fetch(`http://localhost/backend/shipment/search/${guide}`);
     } catch (error) {
         return false;
     }
   
     let responseData = await response.json();
     if (!response.ok) return false;
     return responseData ? true : false;
 }
 

 export async function getShipment(guide) {
    let response;
       try {
           response = await fetch(`http://localhost/backend/shipment/search/${guide}`);
     } catch (error) {
         return null;
     }
   
     let responseData = await response.json();
     if (!response.ok) return null;
     return responseData ? responseData : null;
 }

 export async function getInfoCustomer(type, guide){
    const types = ["remitente", "destinatario"];

    if(!types.includes(type)) return null;

    let response;
    try {
        response = await fetch(`http://localhost/backend/shipment/customer?type=${type}&guide=${guide}`);
    } catch (error) {
        return null;
    }

    let responseData = await response.json();
    console.log("Customer > ", responseData)
    if (!response.ok) return null;
    return responseData ? responseData : null;
 }


 export async function fetchUpdateCustomerData(customerData, guide, type) { 
    let url = `http://localhost/backend/shipment/${type}/${guide}`;
                
    console.log("SE ENVIA A LA RUTA", url)
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
        });
        
        const responseData = await response.json();
        console.log("Respuesta del servidor", responseData);
        if (!response.ok) if(responseData.message) throw new Error(responseData.message);
       
        return true;
    } catch (error) {
        return false;
    }
}






