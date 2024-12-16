// frontend/login.js

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
            alert(data.message);
            window.location.href = 'view/archivos-temporales-html/colabview-home.html';
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