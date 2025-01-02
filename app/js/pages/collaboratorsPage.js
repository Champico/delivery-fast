import {fetchAllUsersOfBranch} from '../api/users.js';

let selectedUser = null;
let selectRow = null;

export async function getPage(){
    return await getHtmlPage();
}

export async function addFunctionality(){
    addFunctionalityRows();
    return true;
}

function addFunctionalityRows(){
    const rows = userTable.querySelectorAll('tr');
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
            }
        });
    });
}

 
/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  D E  L O G I C A  D E  N E G O C I O 
======================================================================================
*/








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
        <h1 class="title-section">Envíos</h1>
            <div class="shupment-home-content">
                <div class="form-group">
                    <div class="form-inline buttonsContainer">
                        <div class="form-group">
                            <div class="form-inline">

                                <button class="button" id="newUser" onclick="openModalCreateUser()">Nuevo</button>
                                <button class="button" id="editUser" onclick="editUserPreAction()">Modificar</button>
                                <button class="button button-red" id="deleteUser" onclick="deleteUserPreAction()">Eliminar</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-inline">
                                <input type="text" id="searchInput" placeholder="Buscar por nombre, número o rol" onkeyup="searchUser()" />
                                <button class="button btnBuscar" id="searchButton" onclick="searchUser()">
                                    <img class="sidebar-item-icon" src="resources/icons/lupa.svg" alt="">
                                    Buscar
                                </button>
                            </div>
                        </div>
                        
                    </div>
                        <div class="table-container">
                            <table class="shipment-table">
                            <thead>
                                <tr>
                                    <th>No. Personal</th>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th>Correo</th>
                                </tr>
                            </thead>
                                ${await buildUserList()}
                            </table>
                        </div>
                    </div>
                </div>
    `;
}


async function buildUserList(){
    const users = await fetchAllUsersOfBranch("000000");

    let userRows = `<tbody id="user-table-body">`

    if(users){
        users.forEach(user => {
            let row = `<tr class="row-selectable" data-personal-number=${user.numero_personal}>`;
            row = row + `
                <td>${user.numero_personal}</td>
                <td>${user.nombre}</td>
                <td>${user.rol}</td>
                <td>${user.correo}</td>
            `;
            userRows = userRows + row;
        })
    }
    userRows = userRows + `</tbody>`;
    return userRows;
}