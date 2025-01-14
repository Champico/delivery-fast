addFuncionality();

async function addFuncionality() {
    const form = document.getElementById("login-form");
    if(form){
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            await login();
        });
    }
}

export async function login() {
    const username = document.getElementById("numero-personal").value || "";
    const password = document.getElementById("contrasena").value || "";
    const message = document.getElementById("message");
  
    if(username === ""){
      message.innerText = "Ingrese el nombre de usuario";
      return;
    }
  
    if(password === ""){
       message.innerText = "Ingrese el password";
      return;
    }
  
    const data = {
      username: username,
      password: password
    };
  
    let login = false;
  
    try {          
        const module = await import ('../api/authSessions.js');
        login = await module.login(data);
    }catch(e){}
  
    if (login === true) {
        window.location.href = "http://localhost/app/home";
    } else {
        message.innerText = login;
    }
  }

