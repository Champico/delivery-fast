export async function fetchCreateShipment(shipmentData) {
    const url = "http://localhost/backend/shipment";

    console.log("Se envia el siguiente archivo: ", JSON.stringify(shipmentData));
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shipmentData)
        });
        
        const responseData = await response.json();
        if (!response.ok){
            if(responseData.error) throw new Error(responseData.error);
            if(responseData.message) throw new Error(responseData.message);
        }
        console.log("Se ha creado el envio: ", responseData);
        return responseData;

    } catch (error) {
        throw new Error(error.message);
    }
}