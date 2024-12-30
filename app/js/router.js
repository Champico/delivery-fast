import { hideLoadingScreen } from "./components/loadingScreen.js";
import { changeMenuButtonPresssed } from "./components/sidebar.js";

import("./components/loadingScreen.js");

let mainContainer = document.getElementById('content-section');

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
    "/app/package":         () => import('./pages/packageProfilePage.js')
};

export const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await renderContent();
}

const renderContent = async () => {
    const path = window.location.pathname;
    const route = routes[path.split("?")[0]];
    if(route){
        const module = await route();
        const page = await module.getPage();

        mainContainer.innerHTML = page;
        changeMenuButtonPresssed(path.split("?")[0]);
        const funcionality = await module.addFunctionality();
        
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