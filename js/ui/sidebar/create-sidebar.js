import { menuButtons } from "../../data/htmlPages_data.js";

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
            <button class="new-shupment-btn sidebar-clickeable" id="sb-bt-new-shupment">
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
                                    <ul">`;

    if(home){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li sidebar-item-li-selected sidebar-clickeable" id="sb-bt-home">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/inicio.svg" alt="">
            Inicio</span>
        </li>`

        menuButtons["sb-bt-home"] = "sb-bt-home";
    }

    if(search){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-search-shipment">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/lupa.svg" alt="">
            Buscar envíos</span>
        </li>
        `
        menuButtons["sb-bt-search-shipment"] = "sb-bt-search-shipment";
    }

    if(earnings){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-earnings">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/caja-registradora.svg" alt="">
            Ingresos</span>
        </li>
        `
        menuButtons["sb-bt-earnings"] = "sb-bt-earnings";
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
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-package">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon sidebar-item-icon-car" src="../resources/icons/buscar-envioFinal.svg" alt="">
            Paquetes</span>
        </li>`;

        menuButtons["sb-bt-package"] = "sb-bt-package";
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
        <li class="sidebar-item-li id="sb-bt-users">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/editar.svg" alt="">
            Usuarios</span>
        </li>`

        menuButtons["sb-bt-users"] = "sb-bt-users";
    }

    if(info){
        administrationModule = administrationModule +`                    
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-about">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/informacion.svg" alt="">
            Acerca de</span>
        </li>`

        menuButtons["sb-bt-about"] = "sb-bt-about";
    }

    if(about){
        administrationModule = administrationModule +`
        <li class="sidebar-item-li sidebar-clickeable" "sb-bt-statistics">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="../resources/icons/grafico-de-barras.svg" alt="">
            Reportes</span>
        </li>`

        menuButtons["sb-bt-statistics"] = "sb-bt-statistics";
    }

    administrationModule = administrationModule +`</ul></div>`;

    return administrationModule;
}

createSideBar();