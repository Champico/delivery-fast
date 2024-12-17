import { getHomePage } from "./home/script_home.js";
import { hideLoadingScreen } from "./efects/loading-screen.js";


let contentContainer = null;

function saveMainContainer(){
    try{
        contentContainer = document.getElementById('content-section');
    }catch(e){
    }
}

async function chargeHomePage(){
    const homePage = await getHomePage();
    if(homePage){
        console.log("Contenedor", contentContainer);
        contentContainer.innerHTML = homePage;
    }else{
        console.error("Error al cargar la página. Lo sentimos");
    }

    hideLoadingScreen();
}

console.log("Valores del local storage: \n Colaborador:", localStorage.getItem("numero_personal"), "\nRol:", localStorage.getItem("id_rol"), "\nSucursal:", localStorage.getItem("numero_sucursal"),"\nNombre:", localStorage.getItem("nombre"));

saveMainContainer();
chargeHomePage();