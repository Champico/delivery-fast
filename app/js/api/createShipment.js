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

        if (!response.ok) {
            console.log("El error es el siguiente: ", await response.json())
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("El errore es ", error)
    }
}