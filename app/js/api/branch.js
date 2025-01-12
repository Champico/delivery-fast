

export async function fetchBranchInfo(numero_sucursal) {
    let response;
       try {
        const url = `http://localhost/backend/branch?numero_sucursal=${numero_sucursal}`;
        response = await fetch(url);
     } catch (error) {
         return false;
     }
   
     let responseData = await response.json();
     if (!response.ok) return [];
     return responseData ? responseData : [];
 }