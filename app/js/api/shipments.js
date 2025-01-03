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
        alert(error.message);
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