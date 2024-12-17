// delivery-fast/js/api/authSessions.js

async function login() {
  const username = document.getElementById("numero-personal").value;
  const password = document.getElementById("contrasena").value;

  const usernameCasted = String(username);
  const passwordCasted = String(password);

  const data = {
    username: usernameCasted,
    password: passwordCasted,
  };

  try {
    const url = "http://localhost/delivery-fast/backend/auth"
    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const dataR = await response.json();

    console.log(dataR);

    if (dataR) {
      localStorage.setItem("numero_personal",dataR.session.numero_personal);
      localStorage.setItem("id_rol", dataR.session.id_rol);
      localStorage.setItem("numero_sucursal",dataR.session.numero_sucursal);
      localStorage.setItem("nombre", dataR.session.nombre);
      window.location.href = "http://localhost/delivery-fast/view/app.html";
    } else {
      alert(dataR.message);
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
