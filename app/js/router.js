import { hideLoadingScreen } from "./components/loadingScreen.js";
import { changeMenuButtonPresssed } from "./components/sidebar.js";

const routes = {
    "/app/home":            () => import('./pages/homePage.js'),
    "/app/new-shipment":    () => import('./pages/newShipmentPage.js'),
    "/app/branch" :         () => import('./pages/branchPage.js'),
    "/app/earnings":        () => import('./pages/earningsPage.js'),
    "/app/users":           () => import('./pages/collaboratorsPage.js'),
    "/app/search-shipment": () => import('./pages/searchShipmentPage.js'),
    "/app/search-package":  () => import('./pages/searchPackagePage.js'),
    "/app/statistics":      () => import('./pages/statisticsPage.js'),
    "/app/shipment":        () => import('./pages/shipmentProfilePage.js'),
    "/app/package":         () => import('./pages/packageProfilePage.js'),
    "/app/not-found":       () => import('./pages/notFoundPage.js'),
};

let mainContainer = document.getElementById('content-section');
window.addEventListener("popstate", renderContent);
renderContent().then(hideLoadingScreen);

export const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await renderContent();
}

async function renderContent() {
    const path = urlParser();
    const route = routes[path];
    try{
        if(!route) throw new Error("Error al cargar la url");
        const module = await route();
        const page = await module.getPage();
        mainContainer.innerHTML = page;
        changeMenuButtonPresssed(path);
        await module.addFunctionality();
    }catch(error){
        mainContainer.innerHTML = `<h1 class="NotFound">Not found 404</h1>`;
    }
}

function urlParser(){
    const completePath = window.location.pathname;
    const pathWitouthSearch = completePath.split("?")[0];
    const brokeRoute = pathWitouthSearch.split("/");
    const route = "/" + (brokeRoute[1] || "") + "/" + (brokeRoute[2] || "");
    return route;
}

