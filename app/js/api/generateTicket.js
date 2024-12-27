export async function fetchTicket(data) {
    data = {...data, "sucursal": localStorage.getItem("numero_sucursal")}
    console.log("------------------------------------------------------------------\nDATOS QUE ENVIO PARA CREAR EL TICKET \n---------------------------------------------------------------------\n", JSON.stringify(data))
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
            if(response.message) return responseData.message;
            return {};
        }

        console.log("------------------------------------------------------------------\nDATOS QUE ENVIO PARA CREAR EL TICKET \n---------------------------------------------------------------------\n", JSON.stringify(data))
   
        return validateTicket(responseData);
    } catch (error) {
        console.log("El error es", error);
        return {}
    }
}


/*function validateTicket(ticket) {
    if (!ticket || !ticket.ticket) return ticket;
    return { ...ticket };
}*/
