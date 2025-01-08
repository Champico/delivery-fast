import { navigateTo } from "../router.js";

export async function getPage(){
    const guide = urlParser();

    if(guide === "Not found") navigateTo("/app/not-found");
    let shipment;
    
    try{
        const module = await import("../api/shipments.js");
        shipment = await module.getShipment(guide); 
    }catch(e){}

    if(shipment) return await getHtmlPage(shipment);
    
    return getShipmentNotFoundPage(); 
}

export async function addFunctionality(){
    const btnHome = document.getElementById("title-shipment-profile");
    btnHome.addEventListener('click', goHomePage)
}



function urlParser(){
    const completePath = window.location.pathname;
    const pathWitouthSearch = completePath.split("?")[0];
    const brokeRoute = pathWitouthSearch.split("/");
    if(brokeRoute[4]) return "Not found";
    const route = brokeRoute[3];
    return route;
}


/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  D E  L O G I C A  D E  N E G O C I O 
======================================================================================
*/


async function goHomePage(){
    try{
        const module = await import("../router.js");
        module.navigateTo(`/app/home`);
    }catch(error){
        return;
    }
  }

  






/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  H T M L 
======================================================================================
*/


export async function getHtmlPage(shipment) {
    return `
        <h1 class="title-section"><span id="title-shipment-profile">Envíos</span> > ${shipment["guia"]}</h1>
        <div class="shupment-home-content">
            <div class="title-container">
                <h1 class="ship-titles title-shipment-info">Datos del envío</h1>
            </div>
            <div class="shipping-information">
                <div class="ship-info sender-container">
                    <h2 class="ship-subtitle sbt-sender">Remitente</h2>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-sender">Nombre: <span class="ship-info-text cont-sender">${shipment["nombre_remitente"]}</span></p>
                        <p class="ship-info-text cont-sender">Dirección: <span class="ship-info-text cont-sender">${shipment["calle_remitente"]} #${shipment["numero_ext_remitente"]}${shipment["numero_int_remitente"] ? ' Int.' + shipment["numero_int_remitente"] : ''}, ${shipment["ciudad_remitente"]}, ${shipment["nombre_estado_remitente"]}. C.P ${shipment["cp_remitente"]}</span></p>
                        <p class="ship-info-text cont-sender">Teléfono: <span class="ship-info-text cont-sender">${shipment["telefono_remitente"]}</span></p>
                    </div>
                    <button class="button">Modificar</button>    
                </div>
                <div class="ship-info recipient-container">
                    <h2 class="ship-subtitle sbt-recipient">Destinatario</h2>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-recipient">Nombre: <span class="ship-info-text cont-recipient">${shipment["nombre_destinatario"]}</span></p>
                        <p class="ship-info-text cont-recipient">Dirección: <span class="ship-info-text cont-recipient">${shipment["calle_destinatario"]} #${shipment["numero_ext_destinatario"]}${shipment["numero_int_destinatario"] ? ' Int.' + shipment["numero_int_destinatario"] : ''}, ${shipment["ciudad_destinatario"]}, ${shipment["nombre_estado_destinatario"]}. C.P ${shipment["cp_destinatario"]}</span></p>
                        <p class="ship-info-text cont-recipient">Teléfono: <span class="ship-info-text cont-recipient">${shipment["telefono_destinatario"]}</span></p>
                    </div>
                    <button class="button">Modificar</button>
                </div>
                <div class="ship-info package-container">
                    <h2 class="ship-subtitle sbt-package">Paquete</h2>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-package">Peso: <span class="ship-info-text cont-package">${shipment["peso"]} kg</span></p>
                        <p class="ship-info-text cont-package">Dimensiones: <span class="ship-info-text cont-package">${shipment["largo"]} x ${shipment["ancho"]} x ${shipment["alto"]} cm</span></p>
                    </div>
                </div>
                <div class="ship-info status-container">
                    <h2 class="ship-subtitle sbt-status">Estado</h2>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-status">Estado: <span class="ship-info-text cont-status">En camino</span></p>
                    </div>
                </div>
                <div class="ship-info service-container">
                    <h2 class="ship-subtitle sbt-service">Servicio</h2>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-service">Servicio: <span class="ship-info-text cont-service">${shipment["servicio"]}</span></p>
                    </div>
                </div>
            </div>
            <div class="edit-status-shipment">
                <form class="form form-edit-status">
                    <div class="form-group">    
                        <h1 class="ship-titles title-shipment-info">Cambiar Estado</h1>
                    </div>
                    <div class="form-inline new-section1">
                        <div class="form-group">
                            <label class="input-label label-new-info-status" for="new-status">Nuevo estado*</label>
                            <select class="status-selects" name="estatus" id="new-status">
                                <option value="Estatus" disabled selected>Selecciona una opción</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Transito">En tránsito</option>
                                <option value="Detenido">Detenido</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="input-label label-new-info-status" for="new-ubication">Ubicación</label>
                            <input class="input input-new-info-status" type="text" id="new-ubication">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="input-label label-new-info-status" for="new-observation">Notas Adicionales</label>
                        <textarea class="textarea txta-input-new-notes" id="new-observation" placeholder="Puede agregar notas adicionales necesarias"></textarea>
                    </div>
                    <div class="form-group">
                        <button class="button btn-change-status" type="">Cambiar estatus</button>
                    </div>
                </form>
            </div>                
        </div>`;
}



async function getShipmentNotFoundPage(){
    return `
        <div class="form-inline-modal">
            <img id="not-found-img" src="/app/resources/icons/not-found-shipment.svg" alt="No encontrado">
            <span id="not-found-message">Envío no encontrado</span>
        </div>`
}