export async function getShipmentList(num_sucursal) {
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
