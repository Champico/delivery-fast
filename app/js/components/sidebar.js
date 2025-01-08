import { navigateTo } from "../router.js";

const buttons = {
    "/app/home":            "sb-bt-home",
    "/app/branch" :         "sb-bt-about",
    "/app/earnings":        "sb-bt-earnings",
    "/app/users":           "sb-bt-users",
    "/app/search-shipment": "sb-bt-search-shipment",
    "/app/search-package":  "sb-bt-package",
    "/app/statistics":      "sb-bt-statistics",
};

const btnToRoute = {
    "sb-bt-home" :            "/app/home", 
    "sb-bt-new-shipment" :    "/app/new-shipment",
    "sb-bt-search-shipment" : "/app/search-shipment",
    "sb-bt-earnings" :        "/app/earnings",
    "sb-bt-package" :         "/app/search-package",
    "sb-bt-users" :           "/app/users",
    "sb-bt-about" :           "/app/branch",
    "sb-bt-statistics" :      "/app/statistics"
}

let idButtonPressed = null;

createSideBar();

function createSideBar(){
    buildSideBar();
    addFuncionalityToSideBar();
    const path = window.location.pathname;
    const route = path.split("?")[0];
    changeMenuButtonPresssed(route);
}

function addFuncionalityToSideBar(){
    const sidebar = document.getElementById("sidebar-menu-container");
    
    sidebar.addEventListener('click', async function(event) {
        const liElement = event.target.closest(".sidebar-clickeable");
        if (liElement) {
            await navigateTo(btnToRoute[liElement.id]);
        }
    });
}




export function changeMenuButtonPresssed(url){
    try{
        if(idButtonPressed !== null){
            const buttonPressed = document.getElementById(idButtonPressed);
            if(buttonPressed.classList.contains("sidebar-item-li-selected")) buttonPressed.classList.remove("sidebar-item-li-selected")
        }
        
        idButtonPressed = buttons[url] ? buttons[url] : "";
        if(idButtonPressed != ""){
            const newButton = document.getElementById(idButtonPressed);
            if(!newButton.classList.contains("sidebar-item-li-selected")) newButton.classList.add("sidebar-item-li-selected");
        }
           
    }catch(error){
    }
}

function buildSideBar(){
    let rol = "";

    try{
        rol = localStorage.getItem("id_rol");
    }catch(error){
        throw new Error("No se puedo crear el menu lateral");
    }
   
    let menu = null;

    switch(rol){
        case "1": menu = createAdministratorSideBar(); break;
        case "2": menu = createCollaboratorSideBar(); break;
        case "3": menu = createDealerSideBar(); break;
        default : menu = "<p>Error</p>";
    }

    const menu_container = document.getElementById("sidebar-menu-container");

    if(menu_container){
        menu_container.innerHTML = menu;
    }else{
        throw new Error("No se puedo crear el menu lateral");
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
            <button class="new-shupment-btn sidebar-clickeable" id="sb-bt-new-shipment">
                <img class="new-shupment-btn-icon" src="/app/resources/icons/nuevoFinal.svg"
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
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-home">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/inicio.svg" alt="">
            Inicio</span>
        </li>`

    }

    if(search){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-search-shipment">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/lupa.svg" alt="">
            Buscar envíos</span>
        </li>
        `
    }

    if(earnings){
        shipmentModule = shipmentModule + `
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-earnings">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/caja-registradora.svg" alt="">
            Ingresos</span>
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
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-package">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon sidebar-item-icon-car" src="/app/resources/icons/buscar-envioFinal.svg" alt="">
            Paquetes</span>
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
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-users">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/editar.svg" alt="">
            Usuarios</span>
        </li>`
    }

    if(info){
        administrationModule = administrationModule +`                    
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-about">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/informacion.svg" alt="">
            Acerca de</span>
        </li>`
    }

    if(about){
        administrationModule = administrationModule +`
        <li class="sidebar-item-li sidebar-clickeable" id="sb-bt-statistics">
            <span class="sidebar-item-a">
                <img class="sidebar-item-icon" src="/app/resources/icons/grafico-de-barras.svg" alt="">
            Reportes</span>
        </li>`
    }

    administrationModule = administrationModule +`</ul></div>`;

    return administrationModule;
}



