export async function getPage(){
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
                                    <th>Telefono</th>
                                    <th>Correo</th>
                                </tr>
                            </thead>
                            <tbody id="user-table-body">

                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
    
    `;
}


export async function addFunctionality(){
    console.log('Users Page Functionality');
    return true;
}