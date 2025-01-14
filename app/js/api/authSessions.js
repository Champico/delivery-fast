
export async function login(data) {
  if(!data) return "Ingrese los datos";

  try {          
    const url = "http://localhost/backend/auth/login";
    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      }
    );

    const dataR = await response.json();

    if (response.ok && dataR) {
      localStorage.setItem("numero_personal",dataR.session.numero_personal);
      localStorage.setItem("id_rol", dataR.session.id_rol);
      localStorage.setItem("numero_sucursal",dataR.session.numero_sucursal);
      localStorage.setItem("nombre", dataR.session.nombre);
      return true;
    } else {
      if(dataR.message) return dataR.message;
    }
  } catch (error) {
    return "Ocurrio un error de conexión con el servidor";
  }
}

export async function logout(){
  try{
      const url = "http://localhost/backend/auth/logout";
      const response = await fetch(url);

      localStorage.removeItem("numero_personal");
      localStorage.removeItem("id_rol");
      localStorage.removeItem("numero_sucursal");
      localStorage.removeItem("nombre");

      if(response.ok) return true;
      return false;
    }catch(e){
      return false;
    }
}

export async function status(){
    try{
      const url = "http://localhost/backend/auth/status";
      const response = await fetch(url);
      const responseData = await response.json();
      if(response.ok && responseData['sesion']) return true;
      return false;
    }catch(e){
      return false;
    }
}

export async function changeTheme(theme){
  if(!theme) return;
  try{
      const url = `http://localhost/backend/auth/theme?theme=${theme}`;
      const response = await fetch(url);
      const responseData = await response.json();
      if(response.ok) return true;
      return false;
    }catch(e){
      return false;
    }
}