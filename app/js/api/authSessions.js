// delivery-fast/app/js/api/authSessions.js

export async function login() {
  const username = document.getElementById("numero-personal").value;
  const password = document.getElementById("contrasena").value;

  const usernameCasted = String(username);
  const passwordCasted = String(password);

  const data = {
    username: usernameCasted,
    password: passwordCasted
  };


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

    if (!response.ok) return;
    const dataR = await response.json();

    if (dataR) {
      localStorage.setItem("numero_personal",dataR.session.numero_personal);
      localStorage.setItem("id_rol", dataR.session.id_rol);
      localStorage.setItem("numero_sucursal",dataR.session.numero_sucursal);
      localStorage.setItem("nombre", dataR.session.nombre);

      window.location.href = "http://localhost/app/home";
    } else {
      if(dataR.message) alert(dataR.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      await login();
    });
});


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
    const url = "http://localhost/backend/auth/logout";
    const response = await fetch(url);
    const responseData = await response.json();
    if(response.ok && responseData['sesion']) return true;
    return false;
  }catch(e){
    return false;
  }
}

