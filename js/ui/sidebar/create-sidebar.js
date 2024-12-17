function createSideBar(){
    const rol = localStorage.getItem("id_rol") ? localStorage.getItem("id_rol") : 2;

    /* ROLES
    1. Administrador
    2. Colaborador
    3. Repartidor
    */

    let menu = null;

    switch(rol){
        case "1": menu = createAdministratorSideBar(); break;
        case "2": menu = createCollaboratorSideBar(); break;
        case "3": menu = createDealerSideBar(); break;
    }

    const menu_container = document.getElementById("sidebar-menu-container");

    if(menu_container){
        menu_container.innerHTML = menu;
    }else{
        console.log("No se pudo crear");
        throw new Error("No se puedo crear el menu lateral ");
    }

}

function createAdministratorSideBar(){
    return " " + getNewShipmentButton() + getShipmentModule(true, true, true) + getPackageModule(true) + getAdminstrationModule(true, true, true);
}

function createCollaboratorSideBar(){
    return " " + getNewShipmentButton() + getShipmentModule(true, true, true) + getPackageModule(true);
}

function createDealerSideBar(){
    return " " + getShipmentModule(true, false, false) + getPackageModule(true);
}


function getNewShipmentButton(){
    return (`
        <div class="sidebar-card module-create">
            <button class="new-shupment-btn">
                <img class="new-shupment-btn-icon" src="../resources/icons/nuevoFinal.svg"
                    alt="crear nuevo envio">
                Nuevo envío
            </button>
        </div>
    `);
}


function getShipmentModule(home, search, earnings){
    let shipmentModule = `<div class="sidebar-card module-shupment">
                                <p class="list-title">Modulo envíos</p>
                                    <ul>`;

    if(home){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/inicio.svg" alt="">
            Inicio</a>
        </li>`
    }

    if(search){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/lupa.svg" alt="">
            Buscar envíos</a>
        </li>
        `
    }

    if(earnings){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/caja-registradora.svg" alt="">
            Ingresos</a>
        </li>
        `
    }

    shipmentModule = shipmentModule + `</ul> </div>`;

    return shipmentModule;
}

function getPackageModule(packages){

    let packageModule = `<div class="sidebar-card module-packet">
                            <p class="list-title">Modulo paquetes</p>
                                <ul>`

    if(packages){
        packageModule = packageModule +`
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon sidebar-item-icon-car" src="../resources/icons/buscar-envioFinal.svg" alt="">
            Paquetes</a>
        </li>`;
    }

    packageModule = packageModule +`</ul></div>`;

    return packageModule;
}



function getAdminstrationModule(users, info, about){
    let administrationModule =`<div class="sidebar-card module-admin last-module">
                                    <p class="list-title">Modulo administracion</p>
                                        <ul>`;

    if(users){
        administrationModule = administrationModule +`                    
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/editar.svg" alt="">
            Usuarios</a>
        </li>`
    }

    if(info){
        administrationModule = administrationModule +`                    
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/informacion.svg" alt="">
            Acerca de</a>
        </li>`
    }

    if(about){
        administrationModule = administrationModule +`
        <li class="sidebar-item-li">
            <a class="sidebar-item-a" href="#">
                <img class="sidebar-item-icon" src="../resources/icons/grafico-de-barras.svg" alt="">
            Reportes</a>
        </li>`
    }

    administrationModule = administrationModule +`</ul></div>`;

    return administrationModule;
}

createSideBar();