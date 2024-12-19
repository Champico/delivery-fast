export async function fetchTicket(data) {
    data = {...data, "sucursal": localStorage.getItem("numero_sucursal")}
    console.log("DATOS QUE SE ENVIAN PARA CREAR EL TICKET GG", JSON.stringify(data))
    try {
        const response = await fetch("http://localhost/delivery-fast/backend/shipment/ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) console.log("Respuesta del servidor en seco", response);

        const responseData = await response.json();

        return validateTicket(responseData);
    } catch (error) {
        console.log("El error es", error);
        return {}
    }
}


function validateTicket(ticket) {
    if (!ticket || !ticket.ticket) return ticket;
    return { ...ticket };
}
