import { navigateTo } from "../router.js";

export function createHeader() {
    const nombre = localStorage.getItem("nombre") || 'Usuario';
    const numero_personal = localStorage.getItem("numero_personal") || '######';

    const sessionCard = ` 
        <div class="sessionCard sessionCardHidden" id="sessionCard">
            <div class="sessionCardInfoUsuario">
                <div class="sessionCardPerfilImageContainer">
                    <img class="sessionCardPerfilImage" src="./resources/icons/perfil-icon.svg" alt="Perfil">
                </div>
                <div class="sessionCardData">
                    <span class="sessionCardUserName">${nombre}</span>
                    <span class="sessionCardUserCorreo">${numero_personal}</span>
                </div>
            </div>
            <div class="sessionCardMenuContainer">
                <ul class="sessionCardMenuList">
                    <button class="sessionCardButton" id="logoutButton">
                        <span class="sessionCardButtonText">Cerrar sesión</span>
                    </button>
                </ul>
            </div>
        </div>`

    const headerBase = `
        <nav class="nav-menu" id="nav-menu">
            <img class="menu-icon" src="resources/icons/menu.svg" alt="Menu Icon Header">
        </nav>
        <div class="container-logo" id="logo">
            <img class="logo-extendido" src="resources/brand/logotipo/logotipo-extendido.svg" alt="Delivery Fast Logo Header">
        </div>
        <div class="user-info-container">
            <h1 class="user-rol"> ${nombre} </h1>
            <div id="sessionButton">
                <img class="user-logo" src="resources/icons/perfil-icon.svg" alt="Profile Picture">
            </div>
        </div>
        ${sessionCard}
        `
        
    document.getElementById("header").innerHTML = headerBase;
    addFuncionality();
}

function addFuncionality(){
    addFuncionalityToSessionCard();
    addFuncionalityToLogo();
    addFuncionalityToMenuIcon();
}

function addFuncionalityToSessionCard(){
    const sessionCardButton = document.getElementById("sessionButton");
    const sessionCard = document.getElementById("sessionCard");

    if(!sessionCardButton || !sessionCard) return;

    sessionCardButton.addEventListener('click', () => {
        if(sessionCard.classList.contains("sessionCardHidden")){
            sessionCard.classList.remove("sessionCardHidden");
        }else{
            sessionCard.classList.add("sessionCardHidden");
        }
    })

    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton){
        logoutButton.addEventListener('click', async () =>{
            try{
                const module = await import('../api/authSessions.js');
                const success = await module.logout();
                if(success === true){
                    window.location.href = "http://localhost";
                }
            }catch(e){
                console.log(e);
            }
        })
    }
    
}

function addFuncionalityToLogo(){
    const buttonLogo = document.getElementById("logo");
    if(!buttonLogo) return;
    buttonLogo.addEventListener('click', ()=>{
        navigateTo("/app/home");
    });
}

function addFuncionalityToMenuIcon(){
    const buttonMenu = document.getElementById("nav-menu");
    if(!buttonMenu) return;
} 
