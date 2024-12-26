import { hideLoadingScreen } from "./efects/loading-screen.js";
import { homePage } from "./staticsPages/homePage.js";
import { searchPage } from "./staticsPages/searchPage.js";
import { newShipmentPage } from "./staticsPages/newShipmentPage.js";

export var htmlPages = {};
export var currentPage = {};
export var menuSelected = {};
import { menuButtons } from "./sidebar/create-sidebar.js";
import { addFirstScriptNewShipment } from "./dinamicBehavior/dinamic-manager.js";

let contentContainer = null;

function saveMainContainer(){
    try{
        contentContainer = document.getElementById('content-section');
    }catch(e){
    }
}

async function loadFirstTime(){
    await showHomeScreen();
    menuSelected.value = "sb-bt-home";
    currentPage.value = "sb-bt-home";
    hideLoadingScreen();
}

export async function changePage(nuevaPagina){
    if(!nuevaPagina in menuButtons) return;

    //console.log("Pagina actual ", currentPage.value, "Nueva pagina ", nuevaPagina);
    if(!currentPage.value || currentPage.value !== nuevaPagina) saveStateOfPage(nuevaPagina);

    switch(nuevaPagina){
        case "sb-bt-home": await showHomeScreen(nuevaPagina); break;
        case "sb-bt-new-shipment": await showNewShipmentScreen(nuevaPagina);break;
        case "sb-bt-search-shipment": showSearchScreen(nuevaPagina); break;
        case "sb-bt-earnings": await showEarningScreen(nuevaPagina); break;
        case "sb-bt-package": await showPackageScreen(nuevaPagina); break;
        case "sb-bt-users": await showUsersScreen(nuevaPagina); break;
        case "sb-bt-about": await showAboutScreen(nuevaPagina); break;
        case "sb-bt-statistics": await showStatisticsScreen(nuevaPagina); break;
        default: await "<h1>Not found 404</h1>"; break;
    }

    currentPage.value = nuevaPagina;
}

function saveStateOfPage(stateId){
    if(!stateId) stateId = "page";

    const partes = stateId.split("-");
    const pageId = partes[2] ? partes[2] : stateId;

    const state = { pageId: pageId };
    const url = `#${pageId}`;
    history.pushState(state, '', url);
}

async function showHomeScreen(id){
    addToDOM(id, await homePage.create());
}

async function showNewShipmentScreen(id){
    addToDOM(id, await newShipmentPage.create());
    addFirstScriptNewShipment();
}

function showSearchScreen(id){
     addToDOM(id, searchPage.create());
}

function showEarningScreen(id){
     "<h1>Earnings</h1>"
}

function showPackageScreen(id){
     "<h1>Package</h1>"
}

function showUsersScreen(id){
     "<h1>Users</h1>"
}

function showAboutScreen(id){
     "<h1>About</h1>"
}

function showStatisticsScreen(id){
     "<h1>Statistics</h1>"
}

function addToDOM(nuevaPagina, page){
    if(page && contentContainer){
        contentContainer.innerHTML = page;
        currentPage["valor"] = nuevaPagina;
    }
}

















/* EJECUCIÓN FUNCIONAL */
console.log("INICIO"),
//console.log("Valores del local storage: \n Colaborador:", localStorage.getItem("numero_personal"), "\nRol:", localStorage.getItem("id_rol"), "\nSucursal:", localStorage.getItem("numero_sucursal"),"\nNombre:", localStorage.getItem("nombre"));
saveMainContainer();
loadFirstTime();
