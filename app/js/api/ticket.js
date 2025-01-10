export async function fetchTicket(data) {
    const url = "http://localhost/backend/shipment/ticket";
    console.log("Datos para crear el ticket: ", data);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (!response.ok) if(responseData.message) throw new Error(responseData.message);
        
        console.log("Ticket creado: ",responseData);
       
        return responseData;
    } catch (error) {
        return {};
    }
}


export async function getTicketPDFByGuide(guide) {
    let response;
    console.log("Se solicita el pdf del ticket con guía: ", guide);
    try {
        response = await fetch(`http://localhost/backend/shipment/ticket-pdf/${guide}`, { method: 'GET' });
    } catch (error) {
      return false;
    }

    if (!response.ok) return false;
  
    try{
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
  
        setTimeout(() => {URL.revokeObjectURL(url);}, 120000);

    }catch(error){
      return false;
    }

    return true;
}


export async function getGuidePDF(guide) {
    let response;
    console.log("Se solicita el pdf de la guía: ", guide);
    try {
        response = await fetch(`http://localhost/backend/shipment/guide-pdf/${guide}`, { method: 'GET' });
    } catch (error) {
      return false;
    }

    if (!response.ok) return false;
  
    try{
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
  
        setTimeout(() => {URL.revokeObjectURL(url);}, 120000);

    }catch(error){
      return false;
    }

    return true;
}