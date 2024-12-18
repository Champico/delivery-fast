// adminFunctions.js

let selectedUser = null;
let selectRow = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

function loadUsers() {
    const userList = document.getElementById('user-table-body');

    fetch('http://localhost/delivery-fast/backend/users', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        userList.innerHTML = '';
        data.forEach(user => {
            const row = document.createElement('tr');
            row.setAttribute('data-personal-number', user.numero_personal);
            row.innerHTML = `
                <td>${user.numero_personal}</td>
                <td>${user.nombre}</td>
                <td>${user.id_rol}</td>
                <td>${user.telefono}</td>
                <td>${user.correo}</td>
            `;
            row.style.cursor = 'pointer';
            userList.appendChild(row);
        });

        const rows = userList.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('click', () => {

                if (row.style.backgroundColor === 'rgb(255, 167, 38)') {

                    row.style.backgroundColor = ''; 
                    selectedUser = null; 
                } else {
                    rows.forEach(r => r.style.backgroundColor = ''); 
                    row.style.backgroundColor = '#ffa726'; 
                    selectedUser = row.getAttribute('data-personal-number');
                    selectedRow = row;
                    console.log(selectedUser);
                }
            });
        });
    })
    .catch(error => console.error('Error al cargar los usuarios:', error));
}

function insertModal(isCreateMode = true) {
    if (document.getElementById('modalContainer')) {
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.style.display = 'flex';

        if (isCreateMode) {
            const form = document.getElementById('form-create-user');
            form?.reset(); // Reiniciar el formulario
            selectedUser = null; // Limpiar usuario seleccionado
            if (selectedRow) {
                selectedRow.style.backgroundColor = ''; // Limpiar selección visual
                selectedRow = null;
            }
        }

        return;
    }

    fetch('modal-create-new-user.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el modal');
            }
            return response.text();
        })
        .then(htmlContent => {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'modalContainer';
            modalContainer.style.display = 'flex';
            modalContainer.innerHTML = htmlContent;

            document.body.appendChild(modalContainer);

            setupModalEvents();

            if (isCreateMode) {
                const form = document.getElementById('form-create-user');
                form?.reset(); // Reiniciar el formulario
                selectedUser = null; // Limpiar usuario seleccionado
                if (selectedRow) {
                    selectedRow.style.backgroundColor = ''; // Limpiar selección visual
                    selectedRow = null;
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });
}


function openModalCreateUser(){
    insertModal(true);
}

function setupModalEvents() {
    const modalContainer = document.getElementById('modalContainer');
    const modal = document.getElementById('userModal');
    const cancelButton = modal.querySelector('.cancel');

    cancelButton?.addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });

    const form = document.getElementById('form-create-user');

    form?.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name-user')?.value;
        const lastName = document.getElementById('pt-lastName-user')?.value;
        const secondLastName = document.getElementById('mt-lastName-user')?.value;
        const personalNumber = document.getElementById('personalNumber')?.value;
        const role = parseInt(document.getElementById('role')?.value, 10);
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone')?.value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

         if (!name || !lastName || !personalNumber || !role || !email) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }


        const curp = generateCURP(name, lastName, secondLastName, personalNumber);
        const fechaContratacion = getCurrentDate();

        const data = {
            nombre: name,
            apellido_paterno: lastName,
            apellido_materno: secondLastName,
            numero_personal: personalNumber,
            rol: role,
            contrasena: password,
            correo: email,
            telefono: phone,
            curp: curp,
            fecha_contratacion: fechaContratacion
        };

        if (selectedUser) {
            updateUser(selectedUser,data);            
        } else{
            createUser(data);
        }
    });
}

function createUser(data) {
    fetch('http://localhost/delivery-fast/backend/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al crear el usuario');
        }
        return response.json();
    })
    .then(() => {
        alert('Usuario creado con éxito');
        document.getElementById('modalContainer').style.display = 'none';
        loadUsers();
    })
    .catch((error) => console.error('Error al crear el usuario:', error));
}

function updateUser(personalNumber, data) {
    fetch(`http://localhost/delivery-fast/backend/users/${personalNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return response.json();
    })
    .then(() => {
        alert('Usuario actualizado con éxito');
        document.getElementById('modalContainer').style.display = 'none';
        loadUsers();
    })
    .catch((error) => console.error('Error al actualizar el usuario:', error));
}

function generateCURP(name, lastName, secondLastName, personalNumber) {
    const currentDate = new Date();

    const curp =
        lastName.slice(0, 2).toUpperCase() + // Primeras 2 letras del apellido paterno
        secondLastName.charAt(0).toUpperCase() + // Primera letra del apellido materno
        name.charAt(0).toUpperCase() + // Primera letra del nombre
        personalNumber.slice(-4) + // Últimos 4 dígitos del número personal
        currentDate.getFullYear().toString().slice(-2) + // Año actual (2 dígitos)
        ("0" + (currentDate.getMonth() + 1)).slice(-2) + // Mes actual (2 dígitos)
        ("0" + currentDate.getDate()).slice(-2); // Día actual (2 dígitos)

    return curp;
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2); // Mes en formato 2 dígitos
    const day = ("0" + today.getDate()).slice(-2); // Día en formato 2 dígitos
    return `${year}-${month}-${day}`;
}

function deleteUserPreAction(){
    if(selectedUser){
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
        if(confirmation){
            deleteUser(selectedUser);
        }else{
            selectedUser = null;
            selectedRow.style.backgroundColor = '';
        }
    }else{
        alert('Seleccione un usuario para eliminar');
    }
}

function deleteUser(selectedUser){
    const personalNumber = selectedUser;

    fetch(`http://localhost/delivery-fast/backend/users/${personalNumber}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar al usuario'+ response.statusText);
            }
            alert('Usuario eliminado exitosamente');
            loadUsers();
            if (selectedRow) {
                selectedUser  = null; // Reiniciar la selección
                selectedRow = null; 
            }
        })
        .catch(error => {
            console.error('Error al eliminar:', error);
            alert('Hubo un error al eliminar el usuario');
            });

}

function editUserPreAction(){
    if (!selectedUser) {
        alert('Seleccione un usuario para modificar');
        return;
    }
        insertModal(false);
        loadUserDataInModal(selectedUser);
}

function loadUserDataInModal(personalNumber) {
    fetch(`http://localhost/delivery-fast/backend/users/${personalNumber}`, {
        method: 'GET',
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }
        return response.json();
    })
    .then((user) => {
        document.getElementById('name-user').value = user.nombre || '';
        document.getElementById('pt-lastName-user').value = user.apellido_paterno || '';
        document.getElementById('mt-lastName-user').value = user.apellido_materno || '';
        document.getElementById('personalNumber').value = user.numero_personal || '';
        document.getElementById('role').value = user.id_rol || '';
        document.getElementById('email').value = user.correo || '';
        document.getElementById('phone').value = user.telefono || '';
    })
    .catch((error) => {
        console.error('Error al cargar los datos del usuario:', error);
    });
}
