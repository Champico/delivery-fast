/* V A R I A B L E S   G L O B A L E S */
let header = null;
let mainContainer = null;

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
};

/* F L U J O  N O R M A L  I N I C I O */
changeTheme();
createHeader();
createSideBar();
mainContainer = document.getElementById('content-section');
window.addEventListener("popstate", renderContent);
renderContent().then(hideLoadingScreen());


/* F U N C I Ó N  P A R A  C A M B I A R  D E  P Á G I N A*/
export async function navigateTo(url){
    history.pushState(null, null, url);
    await renderContent();
}

/* F U N C I O N  P A R A  R E N D E R I Z A R  E L  C O N T E N I D O */
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
        console.log("El error es: ", error)
        try{
            const module = await import("./components/notFoundPage.js");
            const page = await module.getPage();
            mainContainer.innerHTML = page;
        }catch(error){
            mainContainer.innerHTML = `<h1 class="NotFound">Not Found 404</h1>`;
        }
    }
}

/* F U N C I O N  P A R A  A N A L I Z A R  L A  U R L */
function urlParser(){
    const completePath = window.location.pathname;
    const pathWitouthSearch = completePath.split("?")[0];
    const brokeRoute = pathWitouthSearch.split("/");
    const route = "/" + (brokeRoute[1] || "") + "/" + (brokeRoute[2] || "");
    return route;
}







/* F U N C I O N E S  A D I C I O N A L E S */

async function createHeader(){
    try{
        header = await import("./components/header.js");
        await header.createHeader();
    }catch(e){}
}

async function createSideBar(){
    try{
        sideBar = await import("./components/sidebar.js");
        await sideBar.createSideBar();
    }catch(e){}
}

async function hideLoadingScreen(){
    try{
        const module = await import("./components/loadingScreen.js");
        module.hideLoadingScreen();
    }catch(e){}
}

async function changeMenuButtonPresssed(path){
    try{
        sideBar = await import("./components/sidebar.js");
        await sideBar.changeMenuButtonPresssed(path);
    }catch(e){}
}


export async function changeTheme(){
    console.log("Se cambia el tema");
    const cookies = document.cookie;
    const theme = cookies
    .split('; ')
    .find(row => row.startsWith('theme='))
    ?.split('=')[1];

    if(theme && theme === "dark"){
        const newStyleLink = document.createElement("link");
        newStyleLink.rel = 'stylesheet';
        newStyleLink.type = 'text/css';
        newStyleLink.href = '/app/styles/dark-theme.css';
        newStyleLink.id = 'darkcss';
        document.head.appendChild(newStyleLink);
    }else{
        const linkDarkTheme = document.getElementById("darkcss");
        if(linkDarkTheme) document.head.removeChild(linkDarkTheme);
    }

}