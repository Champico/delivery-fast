// delivery-fast/js/api/authSessions.js

function login() {
    const username = document.getElementById('numero-personal').value;
    const password = document.getElementById('contrasena').value;
    

    const usernameCasted = String(username);
    const passwordCasted = String(password);

    const data = {
        username: usernameCasted,
        password: passwordCasted
    };


    fetch('http://localhost/delivery-fast/backend/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(data)
    })
    
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
    })
    .then(data => {
        if (data.success) {
            localStorage.setItem("numero_personal", data.session.numero_pesonal);
            localStorage.setItem("id_rol", data.session.id_rol);
            localStorage.setItem("numero_sucursal", data.numero_sucursal);
            localStorage.setItem("nombre", data.nombre)

            window.location.href = 'http://localhost/delivery-fast/view/app.html';
        } else {
            alert(data.message);
        }
    });
    
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("login-form").addEventListener('submit', function(event) {
        event.preventDefault();
        login();
    });
});