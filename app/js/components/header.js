import { navigateTo } from "../router.js";

export function createHeader() {
    const nombre = localStorage.getItem("nombre") || 'Usuario';
    const numero_personal = localStorage.getItem("numero_personal") || '######';

    const sessionCard = ` 
        <div class="sessionCard sessionCardHidden" id="sessionCard">
            <div class="sessionCardInfoUsuario">
                <div class="sessionCardPerfilImageContainer">
                    <img class="sessionCardPerfilImage" src="/app/resources/icons/perfil-icon.svg" alt="Perfil">
                </div>
                <div class="sessionCardData">
                    <span class="sessionCardUserName">${nombre}</span>
                    <span class="sessionCardUserCorreo">${numero_personal}</span>
                </div>
            </div>
            <div class="sessionCardMenuContainer">
                <ul class="sessionCardMenuList">
                    <button class="sessionCardButton" id="themeButton">
                        <span class="sessionCardButtonText">Cambiar tema</span>
                    </button>
                    <button class="sessionCardButton" id="logoutButton">
                        <span class="sessionCardButtonText">Cerrar sesión</span>
                    </button>
                </ul>
            </div>
        </div>`

    const headerBase = `
        <div class="nav-menu" id="nav-menu" title="menu">
            <img class="menu-icon" src="/app/resources/icons/menu.svg" alt="Menu Icon Header">
        </div>
        <div class="container-logo" id="logo" title="Delivery Fast">
            <img class="logo-extendido" src="/app/resources/brand/logotipo/logotipo-extendido.svg" alt="Delivery Fast Logo Header">
        </div>
        <div class="user-info-container">
            <h1 class="user-rol"> ${nombre} </h1>
            <div id="sessionButton">
                <img class="user-logo" src="/app/resources/icons/perfil-icon.svg" alt="Profile Picture">
            </div>
        </div>
        ${sessionCard}
        <div class="background-hide" id="background-sidebar-small"></div>
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

    /* Boton cerrar sesión*/
    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton){
        logoutButton.addEventListener('click', async () =>{
            try{
                const module = await import('../api/authSessions.js');
                const success = await module.logout();
                if(success === true){
                    window.location.href = "http://localhost";
                }
            }catch(e){ }
        })
    }

    /* Boton cambiar tema*/
    const themeButton = document.getElementById("themeButton");
    if(themeButton){
        themeButton.addEventListener('click', async () =>{
            try{
                let newTheme = "";
                if(getCurrentTheme() === "dark"){
                    newTheme = "light";
                }else{
                    newTheme = "dark";
                }
                const module = await import('../api/authSessions.js');
                const success = await module.changeTheme(newTheme);

                if(success){
                    const module2 = await import('../router.js');
                    await module2.changeTheme();   
                }
                
            }catch(e){
             }
        });
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

    buttonMenu.addEventListener('click', ()=>{
        const width = window.innerWidth;
        const sidebar = document.getElementById("sidebar-menu-container");

        if(!sidebar || !width) return;

        if(width > 800){
            if(sidebar.classList.contains("openSmallScreen")) sidebar.classList.remove("openSmallScreen");
            

        }else{
            const background = document.getElementById("background-sidebar-small");
            if(sidebar.classList.contains("openSmallScreen")){
                sidebar.classList.remove("openSmallScreen");
                if(background && !background.classList.contains("background-hide")) background.classList.add("background-hide")
            }else{
                sidebar.classList.add("openSmallScreen");
                if(background && background.classList.contains("background-hide"))background.classList.remove("background-hide")
            }

        }
    });
}





function getCurrentTheme(){
    const cookies = document.cookie;
    const theme = cookies
    .split('; ')
    .find(row => row.startsWith('theme='))
    ?.split('=')[1];

    if(theme && theme === "dark"){
        return "dark";
    }else{
        return "light";
    }
}
