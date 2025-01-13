export async function fetchAllUsersOfBranch(data) {
  let response;
  try {
    response = await fetch("http://localhost/backend/users");
  } catch (error) {
    return [];
  }

  let responseData = await response.json();
  if (!response.ok) return [];
  return responseData ? responseData : [];
}

export async function getUser(personalNumber) {
  if(!personalNumber) return null;
  
  try {
      const response = await fetch(`http://localhost/backend/users/${personalNumber}`, {
          method: 'GET',
      });

      if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
      }

      const data = await response.json();

      return data;
  } catch (error) {
      return null;
  }
}

export async function createUser(data) {
  if(!data) return null;

  try {
      const response = await fetch('http://localhost/backend/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) return false;

      const responseData = await response.json(); 

      return responseData;
  } catch (error) {
      return null;
  }
}

export async function updateUser(personalNumber, data) {
  console.log("Se envian los datos para actualixzasr", personalNumber, data);
  let jsonData;
  try {
     jsonData = JSON.stringify(data);
    console.log("JSON generado:", jsonData);
} catch (error) {
    console.error("Error al convertir a JSON:", error);
}

  try {
      const response = await fetch(`http://localhost/backend/users/${personalNumber}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: jsonData
      });

      if (!response.ok) return false;
      const responseData = await response.json();
    
      console.log("aqui llega", responseData)
      return true;
  } catch (error) {
    console.error(error)
      return false;
  }
}

export async function deleteUser(personalNumber) {
  if(!personalNumber) return false;

  try {
      const response = await fetch(`http://localhost/backend/users/${personalNumber}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) throw new Error('Error al eliminar al usuario: ' + response.statusText);

       const responseData = await response.json();

      return responseData;
  } catch (error) {
      return false;
  }
}


export async function searchUsers(data){
    try {
      const response = await fetch(`http://localhost/backend/users?search=${encodeURIComponent(searchInput)}`, {
        method: 'GET'
      });
  
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta ' + response.statusText);
      }
  
      const data = await response.json();
      return data || [];
    } catch (error) {
      return [];
    }
  }