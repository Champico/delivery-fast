import { hideLoadingScreen } from "./efects/loading-screen.js";
import { currentPage, menuButtons, menuSelected } from "../data/htmlPages_data.js";
import { homePage } from "./staticsPages/homePage.js";

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
    console.log("Dio click para cambiar a la pagina -> ", nuevaPagina);

    if(!nuevaPagina in menuButtons) return;

    if(!currentPage === nuevaPagina) saveStateOfPage(currentPage);

    let page = "";

    switch(nuevaPagina){
        case "sb-bt-home": page = await getHomeScreen(); break;
        case "sb-bt-new-shipment": page = await getNewShipmentScreen();
        case "sb-bt-search-shipment": page = await getSearchScreen(); break;
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

function getNewShipmentScreen(){
    return "<h1>New shipment</h1>"
}

function getSearchScreen(){
    return "<h1>Search</h1>"
}

function getEarningScreen(){
    return "<h1>Earning</h1>"
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