export async function fetchTicket(data) {
    console.log("La informacion que se envia al backend es: ", data);
    try {
        const response = await fetch("http://localhost/backend/shipment/ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (!response.ok){
            if(responseData.error) return responseData.error;
            if(responseData.message) return responseData.message;
            return "Ocurrio un error del servidor";
        }
        console.log("La información que llega ",responseData);
        return responseData;
        
    } catch (error) {
        return "Ocurrio un error del servidor";
    }
}
