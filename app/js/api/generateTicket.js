export async function fetchTicket(data) {
    const url = "http://localhost/backend/shipment/ticket";
    console.log("VA\n_________________________________________________\n", data,"\n");

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
        
        console.log("VIENE\n_________________________________________________\n",responseData, "\n");
       
        return responseData;
    } catch (error) {
        alert(error.message);
        return [];
    }
}
