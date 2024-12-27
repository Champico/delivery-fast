
export async function getShipmentList(num_sucursal) {
    try {
        const response = await fetch(`http://localhost/backend/shipment/branch/${num_sucursal}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        return data ? data : [];
    } catch (error) {
        return [];
    }
}