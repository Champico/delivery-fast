import { hideLoadingScreen } from "./efects/loading-screen.js";
import { homePage } from "./staticsPages/homePage.js";
import { searchPage } from "./staticsPages/searchPage.js";
import { newShipmentPage } from "./staticsPages/newShipmentPage.js";

export var htmlPages = {};
export var currentPage = {"value" : ""};
export var menuSelected = {"value" : ""};
import { menuButtons } from "./sidebar/create-sidebar.js";

let contentContainer = null;

function saveMainContainer(){
    try{
        contentContainer = document.getElementById('content-section');
    }catch(e){
    }
}

async function loadFirstTime(){
    const homePage = await getHomeScreen();
    if(homePage){
        contentContainer.innerHTML = homePage;
        menuSelected["value"] = "sb-bt-home";
        currentPage["value"] = "sb-bt-home";
    }
    hideLoadingScreen();
}

export async function changePage(nuevaPagina){
    if(!nuevaPagina in menuButtons) return;

    if(!currentPage["value"] === nuevaPagina) saveStateOfPage(currentPage["value"]);

    console.log("Pagina actual ", currentPage, "Nueva pagina ", nuevaPagina)
    let page = "";

    switch(nuevaPagina){
        case "sb-bt-home": page = await getHomeScreen(); break;
        case "sb-bt-new-shipment": page = await getNewShipmentScreen();break;
        case "sb-bt-search-shipment": page = getSearchScreen(); break;
        case "sb-bt-earnings": page = await getEarningScreen(); break;
        case "sb-bt-package": page = await getPackageScreen(); break;
        case "sb-bt-users": page = await getUsersScreen(); break;
        case "sb-bt-about": page = await getAboutScreen(); break;
        case "sb-bt-statistics": page = await getStatisticsScreen(); break;
        default: page = await "<h1>Not found 404</h1>"; break;
    }

    if(page && contentContainer){
        contentContainer.innerHTML = page;
        currentPage["valor"] = nuevaPagina;
    }
}

function saveStateOfPage(stateId){
    console.log("-----------El objeto es",stateId)
    if(!stateId || typeof miVariable === "string") return;

    const partes = stateId.split("-");
    const pageId = partes[2] ? partes[2] : stateId;

    const state = { pageId: pageId };
    const url = `#${pageId}`;
    history.pushState(state, '', url);
}

async function getHomeScreen(){
    return await homePage.create();
}

async function getNewShipmentScreen(){
    return await newShipmentPage.create();
}

function getSearchScreen(){
    return searchPage.create();
}

function getEarningScreen(){
    return 
}

function getPackageScreen(){
    return "<h1>Package</h1>"
}

function getUsersScreen(){
    return "<h1>Users</h1>"
}

function getAboutScreen(){
    return "<h1>About</h1>"
}

function getStatisticsScreen(){
    return "<h1>Statistics</h1>"
}

















/* EJECUCIÓN FUNCIONAL */

console.log("Valores del local storage: \n Colaborador:", localStorage.getItem("numero_personal"), "\nRol:", localStorage.getItem("id_rol"), "\nSucursal:", localStorage.getItem("numero_sucursal"),"\nNombre:", localStorage.getItem("nombre"));
saveMainContainer();
loadFirstTime();