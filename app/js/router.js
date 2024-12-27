import { hideLoadingScreen } from "./components/loadingScreen.js";

import("./components/loadingScreen.js");

let mainContainer = document.getElementById('content-section');

const routes = {
    "/app/home":            () => import('./pages/homePage.js'),
    "/app/new-shipment":    () => import('./pages/newShipmentPage.js'),
    "/app/shipment":        () => import('./pages/shipmentProfilePage.js'),
    "/app/branch-page" :    () => import('./pages/branchPage.js'),
    "/app/earnings":        () => import('./pages/earningsPage.js'),
    "/app/package":         () => import('./pages/packageProfikePage.js'),
    "/app/users":           () => import('./pages/usersPage.js'),
    "/app/search-shipment": () => import('./pages/searchShipmentPage.js'),
    "/app/search-package":  () => import('./pages/searchPackagePage.js')
};

export const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await renderContent();
}

const renderContent = async () => {
    const path = window.location.pathname;
    console.log("Ruta completa:");
    route = path.substring()
    if(route){
        const module = await route();
        const page = module.getPage();
        mainContainer.innerHTML = html;

        const queryParams = new URLSearchParams(window.location.search);
        if(queryParams && path.startsWith("/app/shipment")){
            const shipmentId = queryParams.get("id");
            console.log("ID DE ENVIO: ", shipmentId);
        }
    }else{
        mainContainer.innerHTML = `<h1 class="NotFound">Not found 404</h1>`;
    }
}

window.addEventListener("popstate", renderContent);

renderContent().then(hideLoadingScreen);