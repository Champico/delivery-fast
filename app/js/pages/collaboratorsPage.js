import {fetchAllUsersOfBranch} from '../api/users.js';

let selectedUser = null;
let selectedRow = null;

export async function getPage(){
   await urlParser();
   return await getHtmlPage();
}

export async function addFunctionality(){
    await addFunctionalityButtons();
    await addFunctionalityCreateUserModal();
    await addFunctionalitySearch();
    addFunctionalityRows();
    return true;
}

async function urlParser(){
    const completePath = window.location.pathname;
    const pathAndSearch= completePath.split("?");
    const brokePath = pathAndSearch[0].split("/");
    if(brokePath[4] || pathAndSearch[1]){
        try{
            const module = await import('../router.js');
            await module.navigateTo("/app/not-found");
        }catch(error){
            window.location.href = "http://localhost/app/home";
        }
    }
}

async function cleanForm(){
    const htmlElements = {
        name :            document.getElementById('name'),
        lastName :        document.getElementById('lastName'),
        secondLastName :  document.getElementById('secondLastName'),
        personalNumber :  document.getElementById('personalNumber'),
        role :            document.getElementById('role'),
        password :        document.getElementById('password'),
        confirmPassword : document.getElementById('confirmPassword'),
        email :           document.getElementById('email'),
        phone :           document.getElementById('phone'),
        curp :            document.getElementById('curp'),
    }

    Object.entries(htmlElements).forEach(([key, element]) => {
        element.value = "";
    });
}




async function addFunctionalityButtons(){
    const newUserButton = document.getElementById('newUser');
    const editUserButton = document.getElementById('editUser');
    const deleteUserButton = document.getElementById('deleteUser');

    const createUserModalButton = document.getElementById("btn-create");
    const modal = document.getElementById("title-create-user");
    
    if(createUserModalButton && modal){
        newUserButton.addEventListener('click', () =>{
            cleanForm();
            createUserModalButton.setAttribute('action','create');
            createUserModalButton.innerText = "Crear";
            modal.innerText = "Crear nuevo usuario";
            openModalCreateUser();
        });
    
        editUserButton.addEventListener('click', async () =>{
            createUserModalButton.setAttribute('action','update');
            createUserModalButton.innerText = "Modificar";
            modal.innerText = "Modificar un usuario";
            
            if(selectedUser){
                let user = null;
                try{
                    const module = await import('../api/users.js');
                    user = await module.getUser(selectedUser);
                    console.log(user);
                }catch(e){
                    console.log(e);
                }

                if(user){
                    try{
                        const module = await import('../validations/formsValidations/newUserValidations.js');
                        await module.fillUserForm(user);
                    }catch(e){
                        console.log(e);
                    }

                    openModalCreateUser();
                }
               
            }
        });
    }
    deleteUserButton.addEventListener('click', deleteUser);
}

async function addFunctionalityCreateUserModal(){
    const buttonCancel = document.getElementById("btn-cancel");
    const buttonCreate = document.getElementById("btn-create");

    if(buttonCancel) buttonCancel.addEventListener('click', hideModalCreateUser);
    if(buttonCreate) buttonCreate.addEventListener('click', async() =>{
        await actionUser(buttonCreate.getAttribute('action'));
    });

    const buttonEyePass = document.getElementById("eye-button-pass");
    const buttonEyeConfirm = document.getElementById("eye-button-confirm");

    const inputPassword = document.getElementById("password");
    const inputConfirm = document.getElementById("confirmPassword");

    if(buttonEyePass) buttonEyePass.addEventListener('click', ()=>{
        const currentType = inputPassword.getAttribute('type');
        inputPassword.setAttribute('type', currentType === 'password' ? 'text' : 'password');
        buttonEyePass.textContent = currentType === 'password' ? '🙈' : '🙉';
    });

    if(buttonEyeConfirm) buttonEyeConfirm.addEventListener('click', ()=>{
        const currentType = inputConfirm.getAttribute('type');
        inputConfirm.setAttribute('type', currentType === 'password' ? 'text' : 'password');
        buttonEyeConfirm.textContent = currentType === 'password' ? '🙈' : '🙉';
    });
}

function addFunctionalityRows(){
    const userTable = document.getElementById('user-table-body');
    const rows = userTable.querySelectorAll('tr');
    const editUserButton = document.getElementById('editUser');
    const deleteUserButton = document.getElementById('deleteUser');
    rows.forEach(row => { row.addEventListener('click', 
            () => {
                if(selectedRow) selectedRow.classList.remove('row-selected');
                row.classList.add('row-selected');
                selectedRow = row;
                selectedUser = row.getAttribute('data-personal-number');
                editUserButton.disabled = false;
                deleteUserButton.disabled = false;
            }
        ); 
    })
}

async function addFunctionalitySearch(){
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    if(searchButton) searchButton.addEventListener('click', searchUsers);
    if(searchInput) searchInput.addEventListener('change', searchUsersDinamic);

}




function openModalCreateUser(){
    const modal = document.getElementById('modal-create-user');
    if(!modal) return;
    if(modal.classList.contains('modal-hide')) modal.classList.remove('modal-hide');
}

function hideModalCreateUser(){
    const modal = document.getElementById('modal-create-user');
    if(!modal) return;
    if(!modal.classList.contains('modal-hide')) modal.classList.add('modal-hide');
}

/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  D E  L O G I C A  D E  N E G O C I O 
======================================================================================
*/

async function actionUser(action){
    let data = null;
    let newUser = null;
    let userUpdate = null;


    if (data === false) return;
    if(!action) return;

    switch(action){
        case 'create':

        let data2 = getData2();
        
            try{
                const module = await import("../api/users.js");
                newUser = await module.createUser(data2);
            }catch(e){
                console.log(e);
                newUser = null;
            }

            if(newUser){
                addUserToTable(newUser);
                hideModalCreateUser();
            }else{
                alert('Error al crear el usuario');
            }
        break;

        case 'update':
            if(!selectedUser){
                alert("Seleccione un usuario");
            }

            let data = getData();
            try{
                const module = await import("../api/users.js");
                userUpdate = await module.updateUser(selectedUser, data);
            }catch(e){
                console.log("El error fue", e);
                userUpdate = null;
            }
        
            if(userUpdate){
                alert('Usuario modificado exitosamente');
                hideModalCreateUser();
                editUserButton.disabled = true;
                deleteUserButton.disabled = true;
                selectedUser = null;
                selectedRow = null;
            }else{
                console.log("Seleccione un usuario", "data", data);
                alert('Error al modificar el usuario');
            }
        break;
    }

}

function getData(){
    return ({
        name :            document.getElementById('name').value,
        lastName :        document.getElementById('lastName').value,
        secondLastName :  document.getElementById('secondLastName').value,
        password :        document.getElementById('password').value,
        confirmPassword : document.getElementById('confirmPassword').value,
        email :           document.getElementById('email').value,
        phone :           document.getElementById('phone').value,
        curp :            document.getElementById('curp').value,
    });
}

function getData2(){
    return ({
        name :            document.getElementById('name').value,
        numero_personal:  document.getElementById('personalNumber').value,
        lastName :        document.getElementById('lastName').value,
        secondLastName :  document.getElementById('secondLastName').value,
        password :        document.getElementById('password').value,
        rol:              document.getElementById('role').value,
        confirmPassword : document.getElementById('confirmPassword').value,
        email :           document.getElementById('email').value,
        phone :           document.getElementById('phone').value,
        curp :            document.getElementById('curp').value,
    });
}

function addUserToTable(user){
    const tableBody = document.getElementById('user-table-body');
    const row = document.createElement('tr');
    row.setAttribute('data-personal-number', user.numero_personal);
    row.innerHTML = `
        <td>${user.numero_personal}</td>
        <td>${user.nombre}</td>
        <td>${user.rol}</td>
        <td>${user.correo}</td>
    `;
    tableBody.appendChild(row);
}


async function deleteUser(){
    if(selectedUser){
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
        if(confirmation){
            let deleted = false;
            try{
                const module = await import("../api/users.js");
                deleted = await module.deleteUser(selectedUser);
            }catch(e){}

            if(deleted){
                alert('Usuario eliminado exitosamente');
                await reloadPage()
                if (selectedRow) {
                    selectedUser  = null;
                    selectedRow = null; 
                }
            }
        }else{
            selectedUser = null;
            if(selectedRow && selectedRow.classList.contains('row-selected')) selectedRow.classList.remove('row-selected');
        }
    }else{
        alert('Seleccione un usuario para eliminar');
    }
}



async function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput === "" || !searchInput) return;
    let users;
    try {
        const module = await import("../api/users.js");
        users = await module.searchUsers(searchInput);
        console.log('los usuarios regresados',users);
    } catch (e) {
        console.error("Error al buscar usuarios: ", e);
    }
    if (users) reloadListUserCustom(users);
}


async function searchUsersDinamic(){
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput === "" || !searchInput) {
        await reloadPage()
        return;
    }
    let users = null;
    try{
        const module = await import("../api/users.js");
        users = await module.searchUsers(searchInput);
    }catch(e){
    }
    if(users) reloadListUserCustom(users);
}


async function reloadPage(){
    const mainContainer = document.getElementById('content-section');
    mainContainer.innerHTML = await getHtmlPage();
}

async function reloadListUser(){
    let users = [];
    const branch = localStorage.getItem("numero_sucursal");
    
    try{
        users = await fetchAllUsersOfBranch(branch);
    }catch(e){}

    const table = document.getElementById("user-table-body");
    if(users && table){
        table.innerHTML = "";
        users.forEach(user => {
            let row = `<tr class="row-selectable" data-personal-number=${user.numero_personal}>`;
            row = row + `
                <td>${user.numero_personal}</td>
                <td>${user.nombre}</td>
                <td class="column-rol">${user.rol}</td>
                <td class="column-correo">${user.correo}</td>
            `;
            userRows = userRows + row;
        })
        table.innerHTML= userRows;
        addFunctionalityRows();
    }  
}

async function reloadListUserCustom(users){
    const table = document.getElementById("user-table-body");

    if(users && table){
        table.innerHTML = ""; 

        if (users.length === 0) {
            table.innerHTML = "<tr><td colspan='4'>No se encontraron resultados</td></tr>";
            return;
        }

        const userRows = users.map(user => {
            return `
                <tr class="row-selectable" data-personal-number="${user.numero_personal}">
                    <td>${user.numero_personal}</td>
                    <td>${user.nombre}</td>
                    <td class="column-rol">${user.rol}</td>
                    <td class="column-correo">${user.correo}</td>
                </tr>
            `;
        }).join('');

        table.innerHTML = userRows; 
        addFunctionalityRows(); 
    } else {
        console.error("Error: No se pudo actualizar la tabla, los usuarios o la tabla son nulos.");
    }
}

async function cleanListUser(){
    const table = document.getElementById("user-table-body");
    table.innerHTML = "";
}


/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  H T M L 
======================================================================================
*/

/* =========================
    H T M L  P A G E  O N E 
   ========================= */

async function getHtmlPage(){
    return `
        <h1 class="title-section">Colaboradores</h1>
            <div class="shupment-home-content">
                <div class="form-group">
                    <div class="form-inline" id="buttons-container">
                        <div class="form-group">

                            <div class="form-inline">
                                <button class="button" id="newUser">Nuevo</button>
                                <button class="button" id="editUser" disabled>Modificar</button>
                                <button class="button button-red" id="deleteUser" disabled>Eliminar</button>
                            </div>

                            <div class="form-inline search-container">
                                <input class="input" type="text" id="searchInput" placeholder="Buscar por nombre, número o rol" />
                                <button class="button btnBuscar" id="searchButton"">
                                    <img id="searchIcon" src="/app/resources/icons/lupa.svg" alt="">
                                    <span id="searchButtonText">Buscar</span>
                                </button>
                            </div>

                        </div>
                        
                    </div>
                        <div class="table-container">
                            <table class="main-table" id="users-table">
                            <thead>
                                <tr>
                                    <th>No. Personal</th>
                                    <th>Nombre</th>
                                    <th class="column-rol">Rol</th>
                                    <th class="column-correo">Correo</th>
                                </tr>
                            </thead>
                                ${await buildUserList()}
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal-container">
                ${getModalCreateUser()}
                </div>
    `;
}


async function buildUserList(){
    let users = [];
    const branch = localStorage.getItem("numero_sucursal");
    
    try{
        users = await fetchAllUsersOfBranch(branch);
    }catch(e){}

    let userRows = `<tbody id="user-table-body">`

    if(users){
        users.forEach(user => {
            let row = `<tr class="row-selectable" data-personal-number=${user.numero_personal}>`;
            row = row + `
                <td>${user.numero_personal}</td>
                <td>${user.nombre}</td>
                <td class="column-rol">${user.rol}</td>
                <td class="column-correo">${user.correo}</td>
            `;
            userRows = userRows + row;
        })
    }
    userRows = userRows + `</tbody>`;
    return userRows;
}



/* ===============================
   M O D A L  C R E A T E  U S E R 
   =============================== */

function getModalCreateUser(){
    return `
        <div class="body-modal modal-hide" id="modal-create-user">
            <div id="userModal" class="modal">
                <div class="modal-content-large">
                    <div class="head-title-modal-container">    
                        <h2 class="title-modal-user" id="title-create-user">Gestion de Usuario</h2>
                    </div>
                    <form class="form-container-modal" id="form-create-user">
                        <div class="form-group-modal">
                            <label for="name">Nombre*</label>
                            <input class="input-modal" type="text" id="name" name="name" placeholder="Nombre del colaborador">
                            <span class="input-message input-message-hide" id="name-msg"></span>
                        </div>

                        <div class="form-group-modal">
                            <label for="lastName">Apellido Paterno*</label>
                            <input class="input-modal" type="text" id="lastName" name="lastName" placeholder="Apellido paterno del colaborador">
                            <span class="input-message input-message-hide" id="lastName-msg"></span>
                        </div>

                        <div class="form-group-modal">
                            <label for="secondLastName">Apellido Materno</label>
                            <input class="input-modal" type="text" id="secondLastName" placeholder="Apellido materno del colaborador">
                            <span class="input-message input-message-hide" id="secondLastName-msg"></span>
                        </div>

                        <div class="form-inline-modal">
                            <div class="form-group-modal">
                                <label for="personalNumber">Número de personal*</label>
                                <input class="input-modal" type="text" id="personalNumber" name="personalNumber" placeholder="6 Dígitos">
                                <span class="input-message input-message-hide" id="personalNumber-msg"></span>
                            </div>

                            <div class="form-group-modal">
                                <label for="role">Rol*</label>
                                <select id="role" class="select-input">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Colaborador</option>
                                    <option value="3">Repartidor</option>
                                </select>
                                <span class="input-message input-message-hide" id="role-msg"></span>
                            </div>
                        </div>

                        <div class="form-group-modal" id="cn-pass">
                            <label for="password">Contraseña*</label>
                            <input class="input-modal" type="password" id="password" name="password" placeholder="Ingresa la contraseña (8 caracteres mínimo)">
                            <span class="input-message input-message-hide" id="password-msg"></span>
                             <button type="button" class="eye-button" id="eye-button-pass"> 🙉 </button>
                        </div>

                        <div class="form-group-modal" id="cn-confirm">
                            <label for="confirmPassword">Confirmar Contraseña*</label>
                            <input class="input-modal" type="password" id="confirmPassword" name="confirmPassword" placeholder="Repite la contraseña">
                            <span class="input-message input-message-hide" id="confirmPassword-msg"></span>
                            <button type="button" class="eye-button" id="eye-button-confirm"> 🙉 </button>
                            </div>

                        <div class="form-group-modal">
                            <label for="email">Correo</label>
                            <input class="input-modal" type="email" id="email" name="email" placeholder="example@dominio.com">
                            <span class="input-message input-message-hide" id="email-msg"></span>
                        </div>

                        <div class="form-group-modal">
                            <label for="phone">Teléfono</label>
                            <input class="input-modal" type="tel" id="phone" name="phone" placeholder="Teléfono">
                            <span class="input-message input-message-hide" id="phone-msg"></span>
                        </div>

                        <div class="form-group-modal">
                            <label for="curp">Curp</label>
                            <input class="input-modal" type="text" id="curp" placeholder="Ingrese el curp">
                            <span class="input-message input-message-hide" id="curp-msg"></span>
                        </div>

                        <div class="button-group-modal">
                            <button type="button" class="cancel" id="btn-cancel">Cancelar</button>
                            <button type="button" class="create" id="btn-create">Crear</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>`
}
