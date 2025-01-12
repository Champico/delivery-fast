let states = null;
let guide = null;

export async function getPage(){
    guide = urlParser();
    if(guide === "Not found") return getShipmentNotFoundPage(); 
    let shipment;
    try{
        const module = await import("../api/shipments.js");
        shipment = await module.getShipment(guide); 
    }catch(e){}
    if(shipment) return await getHtmlPage(shipment);
    return getShipmentNotFoundPage(); 
}

export async function addFunctionality(){
    addFuncionalityReturn();
    addFuncionalityModify();
}
    

function urlParser(){
    const completePath = window.location.pathname;
    const pathWitouthSearch = completePath.split("?")[0];
    const brokeRoute = pathWitouthSearch.split("/");
    if(brokeRoute[4]) return "Not found";
    const route = brokeRoute[3];
    return route;
}

function addFuncionalityReturn(){
    const btnHome = document.getElementById("title-shipment-profile");
    if(btnHome) btnHome.addEventListener('click', goHomePage);
}

function removeFuncionalityReturn(){
    const btnHome = document.getElementById("title-shipment-profile");
    if(!btnHome)
    btnHome.removeEventListener('click', goHomePage);
}

function addFuncionalityModify(){
    const sender = document.getElementById("btn-modify-sender");
    const recipient = document.getElementById("btn-modify-recipient");
    if(sender) sender.addEventListener('click', showSenderModal);
    if(recipient) recipient.addEventListener('click', showRecipientModal);
}


function removeFuncionalityModify(){
    const sender = document.getElementById("btn-modify-sender");
    const recipient = document.getElementById("btn-modify-recipient");
    if(sender) sender.removeEventListener('click', showSenderModal);
    if(recipient) recipient.removeEventListener('click', showRecipientModal);
}

async function showSenderModal(){
    await getStates();
    const modalContainer = document.getElementById("modify-modal-container");
    const sender = await getSenderData();
    modalContainer.innerHTML += getModalUpdateInfoSender(sender);
    addFuncionalitySenderModal();
}

async function showRecipientModal(){
    await getStates();
    const modalContainer = document.getElementById("modify-modal-container");
    const recipient = await getRecipientData();
    modalContainer.innerHTML += getModalUpdateInfoRecipient(recipient)
    addFuncionalityRecipientModal();
}

async function hideRecipientModal(){
    removeFuncionalityRecipientModal();
    const modalContainer = document.getElementById("modify-modal-container");
    const modal = document.getElementById("recipient-modal");
    if(modalContainer && modal ) modalContainer.removeChild(modal);
}

async function hideSenderModal(){
    removeFuncionalitySenderModal();
    const modalContainer = document.getElementById("modify-modal-container");
    const modal = document.getElementById("sender-modal");
    if(modalContainer && modal ) modalContainer.removeChild(modal);
}


async function getStates(){
    if(states !== null) return;
    
    try{
        const module = await import("../api/utils.js");
        states = module.fetchStates();
    }catch(e){
        states = [];
    }
}

async function getSenderData(){
    let sender;
    try{
        const module = await import("../api/shipments.js");
        sender = module.getInfoCustomer("remitente", guide);
    }catch(e){
        sender = {};
    }
    return sender;
}

async function getRecipientData(){
    let recipient;
    try{
        const module = await import("../api/shipments.js");
        recipient = module.getInfoCustomer("destinatario", guide);
    }catch(e){
        recipient = {};
    }
    return recipient;
}


const fieldsToModify = {
    "nombre":   false,
    "cp":       false,
    "estado":   false,
    "ciudad":   false,
    "colonia":  false,
    "calle":    false,
    "noext":    false,
    "noint":    false,
    "correo":   false,
    "telefono": false
}

function addFuncionalitySenderModal(){
    const closeModalButton = document.getElementById("close-modal-button-not-found");
    const cancelButton = document.getElementById("btn-cancel");
    if(closeModalButton) closeModalButton.addEventListener('click', hideSenderModal);
    if(cancelButton) cancelButton.addEventListener('click', hideSenderModal);

    const htmlElements = {
        "nombre-remitente":   document.getElementById("nombre-remitente"),
        "cp-remitente":       document.getElementById("cp-remitente"),
        "estado-remitente":   document.getElementById("estado-remitente"),
        "ciudad-remitente":   document.getElementById("ciudad-remitente"),
        "colonia-remitente":  document.getElementById("colonia-remitente"),
        "calle-remitente":    document.getElementById("calle-remitente"),
        "noext-remitente":    document.getElementById("noext-remitente"),     
        "noint-remitente":    document.getElementById("noint-remitente"),
        "correo-remitente":   document.getElementById("correo-remitente"),
        "telefono-remitente": document.getElementById("telefono-remitente")
    };

    Object.entries(htmlElements).forEach(([key, element]) => {
        element.addEventListener('click', ()=>{
            newKey = key.split("-")[0];
            if(!fieldsToModify[newKey]) fieldsToModify[newKey] = true;
        });
    });

    const modify = document.getElementById("btn-modify");
    if(modify) modify.addEventListener('click', () =>{
        modifyData("sender");
    })

}

function addFuncionalityRecipientModal(){
    const closeModalButton = document.getElementById("close-modal-button-not-found");
    const cancelButton = document.getElementById("btn-cancel");
    if(closeModalButton) closeModalButton.addEventListener('click', hideRecipientModal);
    if(cancelButton) cancelButton.addEventListener('click', hideSenderModal);

    const htmlElements = {  
        "nombre-destinatario":   document.getElementById("nombre-destinatario"), 
        "cp-destinatario":       document.getElementById("cp-destinatario"),
        "estado-destinatario":   document.getElementById("estado-destinatario"),
        "ciudad-destinatario":   document.getElementById("ciudad-destinatario"),
        "colonia-destinatario":  document.getElementById("colonia-destinatario"),
        "calle-destinatario":    document.getElementById("calle-destinatario"),
        "noext-destinatario":    document.getElementById("noext-destinatario"),
        "noint-destinatario":    document.getElementById("noint-destinatario"),
        "correo-destinatario":   document.getElementById("correo-destinatario"),
        "telefono-destinatario": document.getElementById("telefono-destinatario")
    };

    Object.entries(htmlElements).forEach(([key, element]) => {
        element.addEventListener('click', ()=>{
            newKey = key.split("-")[0];
            if(!fieldsToModify[newKey]) fieldsToModify[newKey] = true;
        });
    });

}

function removeFuncionalitySenderModal(){
    
}

function removeFuncionalityRecipientModal(){

}

function modifyData(type){
    
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
        <h1 class="title-section"><span id="title-shipment-profile">Envíos</span><span id="guide-shipment"> > ${shipment["guia"]}</span></h1>
        <div class="shupment-home-content">
            <div id="modify-modal-container"></div>
            <div class="title-container">
                <h1 class="ship-titles title-shipment-info">Datos del envío</h1>
            </div>
            <div class="shipping-information">
                <div class="ship-info sender-container">
                    <h2 class="ship-subtitle sbt-sender">Remitente</h2>
                    <div class="container-p-span-info">
                        <p id="d1-sender">Nombre: <span id="d2-sender">${shipment["nombre_remitente"]}</span></p>
                        <p id="d1-sender">Dirección: <span id="d2-sender">${shipment["calle_remitente"]} #${shipment["numero_ext_remitente"]}${shipment["numero_int_remitente"] ? ' Int.' + shipment["numero_int_remitente"] : ''}, ${shipment["ciudad_remitente"]}, ${shipment["nombre_estado_remitente"]}. C.P ${shipment["cp_remitente"]}</span></p>
                        <p id="d1-sender">Tel: <span id="d2-sender">${shipment["telefono_remitente"]}</span></p>
                    </div>
                    <button class="button" id="btn-modify-sender">Modificar</button>    
                </div>
                <div class="ship-info recipient-container">
                    <h2 class="ship-subtitle sbt-recipient">Destinatario</h2>
                    <div class="container-p-span-info">
                        <p id="d1-recipient">Nombre: <span id="d2-recipient">${shipment["nombre_destinatario"]}</span></p>
                        <p id="d1-recipient">Dirección: <span id="d2-recipient">${shipment["calle_destinatario"]} #${shipment["numero_ext_destinatario"]}${shipment["numero_int_destinatario"] ? ' Int.' + shipment["numero_int_destinatario"] : ''}, ${shipment["ciudad_destinatario"]}, ${shipment["nombre_estado_destinatario"]}. C.P ${shipment["cp_destinatario"]}</span></p>
                        <p id="d1-recipient">Tel: <span id="d2-recipient">${shipment["telefono_destinatario"]}</span></p>
                    </div>
                    <button class="button" id="btn-modify-recipient">Modificar</button>
                </div>
                <div class="ship-info package-container">
                    <h2 class="ship-subtitle sbt-package">Paquete</h2>
                    <div class="container-p-span-info">
                        <p id="d1-package">Peso: <span id="d2-package">${shipment["peso"]} kg</span></p>
                        <p id="d1-package">Dimensiones: <span id="d2-package">${shipment["largo"]} x ${shipment["ancho"]} x ${shipment["alto"]} cm</span></p>
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



function getShipmentNotFoundPage(){
    return `
        <div class="form-inline-modal">
            <img id="not-found-img" src="/app/resources/icons/not-found-shipment.svg" alt="No encontrado">
            <span id="not-found-message">Envío no encontrado</span>
        </div>`
}

function getModalUpdateInfoRecipient(dataRecipient){
    console.log(dataRecipient["nombre_completo"]);
    return `
        <div class="body-modal" id="recipient-modal">
            <div class="modal">
                <div class="modal-content-large">
                    <button class="close-modal-button" id="close-modal-button-not-found">x</button>
                    <div class="head-title-modal-container">    
                        <h2 class="title-modal-user">Enviar a</h2>
                    </div>

                    <form>

                        <div class="form-group">
                            <label class="input-label" for="nombre-destinatario">Nombre*</label>
                            <input class="input" type="text" id="nombre-destinatario" placeholder="Ingrese el nombre completo del destinatario" value = "${dataRecipient["nombre_completo"] || ""}">
                            <span class="input-message input-message-hide" id="nombre-destinatario-msg"></span>
                        </div>

                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label label-cp" for="cp-destinatario">Código postal*</label>
                                <input class="input" type="text" id="cp-destinatario" placeholder="Ej. 91140" value = "${dataRecipient["cp"] || ""}">
                                <span class="input-message input-message-hide" id="cp-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="estado-remitente">Estado*</label>
                                <select class="form-select" id="estado-remitente">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    ${getSelectStates()}
                                </select>
                                <span class="input-message input-message-hide" id="estado-remitente-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="ciudad-destinatario">Ciudad*</label>
                                <input class="input" type="text" id="ciudad-destinatario" value = "${dataRecipient["ciudad"] || ""}">
                                <span class="input-message input-message-hide" id="ciudad-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="colonia-destinatario">Colonia*</label>
                                <input class="input" type="text" id="colonia-destinatario" value = "${dataRecipient["colonia"] || ""}">
                                <span class="input-message input-message-hide" id="colonia-destinatario-msg"></span>
                            </div>
                        </div>

                        <div class="form-inline">

                            <div class="form-group form-group-two-spaces">
                                <label class="input-label" for="calle-destinatario">Calle*</label>
                                <input class="input" type="text" id="calle-destinatario" placeholder="Ingrese el domicilio del remitente" value = "${dataRecipient["calle"] || ""}">
                                <span class="input-message input-message-hide" id="calle-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="noext-destinatario">No. ext*</label>
                                <input class="input" type="text" id="noext-destinatario" value = "${dataRecipient["numero_ext"] || ""}">
                                <span class="input-message input-message-hide" id="noext-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="noint-destinatario">No. int</label>
                                <input class="input" type="text" id="noint-destinatario" value = "${dataRecipient["numero_int"] || ""}">
                                <span class="input-message input-message-hide" id="noint-destinatario-msg"></span>
                            </div>

                        </div>

                        <div class="form-inline">

                            <div class="form-group">
                                <label class="input-label" for="correo-destinatario">Correo</label>
                                <input class="input" type="text" id="correo-destinatario" placeholder="example@dominio.com" value = "${dataRecipient["correo"] || ""}">
                                <span class="input-message input-message-hide" id="correo-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="telefono-destinatario">Teléfono</label>
                                <input class="input" type="text" id="telefono-destinatario" value = "${dataRecipient["telefono"] || ""}">
                                <span class="input-message input-message-hide" id="telefono-destinatario-msg"></span>
                            </div>

                        </div>

                        <div class="form-group">
                            <label class="input-label" for="referencias">Referencias</label>
                            <textarea class="textarea" id="referencias" rows="3" placeholder="Breve descripción del lugar de destino..." value = "${dataRecipient["referencias"] || ""}"></textarea>
                            <span class="input-message input-message-hide" id="referencias-destinatario-msg"></span>
                        </div>

                    </form>

                    <div class="button-group-modal">
                        <button type="button" class="cancel" id="btn-cancel">Cancelar</button>
                        <button type="button" class="create" id="btn-modify">Modificar</button>
                    </div>

                </div>

            </div>

        </div>
    `
}

function getModalUpdateInfoSender(dataSender){
    return `
        <div class="body-modal" id="sender-modal">
            <div class="modal">
                <div class="modal-content-large">
                    <button class="close-modal-button" id="close-modal-button-not-found">x</button>
                    <div class="head-title-modal-container">    
                        <h2 class="title-modal-user">Enviar desde</h2>
                    </div>

                    <form class="form">

                        <div class="form-group">
                            <label class="input-label" for="nombre-remitente">Nombre*</label>
                            <input class="input" type="text" id="nombre-remitente" placeholder="Ingrese el nombre completo del remitente" value = "${dataSender["nombre_completo"] || ""}">
                            <span class="input-message input-message-hide" id="nombre-remitente-msg"></span>
                        </div>

                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label label-cp" for="cp-remitente">Código postal*</label>
                                <input class="input" type="text" id="cp-remitente" placeholder="Ej. 91140" value = "${dataSender["cp"] || ""}">
                                <span class="input-message input-message-hide" id="cp-remitente-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="estado-destinatario">Estado*</label>
                                <select class="form-select" id="estado-destinatario">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    ${getSelectStates()}
                                </select>
                                <span class="input-message input-message-hide" id="estado-destinatario-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="ciudad-remitente">Ciudad*</label>
                                <input class="input" type="text" id="ciudad-remitente" value = "${dataSender["ciudad"] || ""}">
                                <span class="input-message input-message-hide" id="ciudad-remitente-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="colonia-remitente">Colonia*</label>
                                <input class="input" type="text" id="colonia-remitente" value = "${dataSender["colonia"] || ""}">
                                <span class="input-message input-message-hide" id="colonia-remitente-msg"></span>
                            </div>

                        </div>

                        <div class="form-inline">
                            <div class="form-group form-group-two-spaces">
                                <label class="input-label" for="calle-remitente">Calle*</label>
                                <input class="input" type="text" id="calle-remitente" placeholder="Ingrese el domicilio del remitente" value = "${dataSender["calle"] || ""}">
                                <span class="input-message input-message-hide" id="calle-remitente-msg">Hola</span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="noext-remitente">No. ext*</label>
                                <input class="input" type="text" id="noext-remitente" value = "${dataSender["numero_ext"] || ""}">
                                <span class="input-message input-message-hide" id="noext-remitente-msg"></span>
                            </div>

                            <div class="form-group">
                                <label class="input-label" for="noint-remitente">No. int</label>
                                <input class="input" type="text" id="noint-remitente" value = "${dataSender["numero_int"] || ""}">
                                <span class="input-message input-message-hide" id="noint-remitente-msg"></span>
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label" for="correo-remitente">Correo</label>
                                <input class="input" type="text" id="correo-remitente" placeholder="example@dominio.com" value = "${dataSender["correo"] || ""}">
                                <span class="input-message input-message-hide" id="correo-remitente-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="telefono-remitente">Teléfono</label>
                                <input class="input" type="text" id="telefono-remitente" value = "${dataSender["telefono"] || ""}">
                                <span class="input-message input-message-hide" id="telefono-remitente-msg"></span>
                            </div>
                        </div>

                    </form>

                    <div class="button-group-modal">
                        <button type="button" class="cancel" id="btn-cancel">Cancelar</button>
                        <button type="button" class="create" id="btn-modify">Modificar</button>
                    </div>

                </div>

            </div>

        </div>`
}


function getSelectStates(){
    if(!states || !Array.isArray(states)) return "";
    let statesOptions = "";
    states.forEach(state => {
        statesOptions = statesOptions +`<option value="${state.clave}">${state.nombre}</option>`
    });
    return statesOptions;
}
