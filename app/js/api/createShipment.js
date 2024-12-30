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