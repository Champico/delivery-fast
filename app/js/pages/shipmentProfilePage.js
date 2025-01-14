
let states = null;
let guide = null;
let type = null;
let newData = [];
let finalData = {};

export async function getPage(){
    guide = urlParser();
    if(guide === "Not found") return getShipmentNotFoundPage(); 
    let shipment;
    let lastStatus;

    try{
        const module = await import("../api/shipments.js");
        shipment = await module.getShipment(guide);
        lastStatus = await module.getLastStatus(guide); 
    }catch(e){}

    if(shipment) return await getHtmlPage(shipment, lastStatus);
    return getShipmentNotFoundPage(); 
}

export async function addFunctionality(){
    addFuncionalityReturn();
    addFuncionalityModify();
    addFuncionalityStatus();
}

function removeFuncionality(){
    removeFuncionalityReturn();
    removeFuncionalityModify();
    removeFuncionalityStatus();
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
    type = "sender";
    await getStates();
    const modalContainer = document.getElementById("modify-modal-container");
    const sender = await getSenderData();
    modalContainer.innerHTML += getModalUpdateInfoSender(sender);
    addFuncionalitySenderModal();
}

async function showRecipientModal(){
    type ="recipient"
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

function addFuncionalityStatus(){
    const btnChangeStatus = document.getElementById("change-status");
    if(btnChangeStatus) btnChangeStatus.addEventListener('click', changeStatus);
}



async function changeStatus(e){
    if(e) e.preventDefault();
    const new_status = document.getElementById("new-status").value;
    const notes = document.getElementById("new-observation").value;

    if(!new_status) alert("Seleccione una opcion para cambiar el estatus");

    let success = false; 
    try{
        const module = await import("../api/shipments.js");
        
        success = await module.fetchCreateNewStatus(new_status, notes, guide);
        
    }catch(e){
        success = false;
    }

        if(success){
        await rechargePage()
        }
}



async function getStates(){
    if(states !== null && states != []) return;
    
    try{
        const module = await import("../api/utils.js");
        states = await module.fetchStates();
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

function clean(){
    newData = [];
    finalData = {};
    guide = null;
    type = null;

    Object.entries(fieldsToModify).forEach(([key, value]) => {
        fieldsToModify[key] = false;
    });
}

function addFuncionalitySenderModal(){
    const closeModalButton = document.getElementById("close-modal-button-sender");
    const cancelButton = document.getElementById("btn-modal-cancel-sender");
    const modifyButton = document.getElementById("btn-modal-modify-sender");
    if(closeModalButton) closeModalButton.addEventListener('click', hideSenderModal);
    if(cancelButton) cancelButton.addEventListener('click', hideSenderModal);
    if(modifyButton) modifyButton.addEventListener('click', async() =>{
        type = "sender"
        await modifyData();
    })

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
        if(element){
            element.addEventListener('input', ()=>{
                let newKey = key.split("-")[0];
                if(!fieldsToModify[newKey]) fieldsToModify[newKey] = true;
                console.log("Este input ha sido modificado", newKey);
            });
        }
    });
}

function addFuncionalityRecipientModal(){
    const closeModalButton = document.getElementById("close-modal-button-recipient");
    const cancelButton = document.getElementById("btn-modal-cancel-recipient");
    const modifyButton = document.getElementById("btn-modal-modify-recipient");
    if(closeModalButton) closeModalButton.addEventListener('click', hideRecipientModal);
    if(cancelButton) cancelButton.addEventListener('click', hideSenderModal);
    if(modifyButton) modifyButton.addEventListener('click', async() =>{
        type = "recipient"
        await modifyData();
    });

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
        if(element){
            element.addEventListener('input', ()=>{
                let newKey = key.split("-")[0];
                if(!fieldsToModify[newKey]) fieldsToModify[newKey] = true;
                console.log("Este input ha sido modificado", newKey);
            });
        }
    });
}

function removeFuncionalitySenderModal(){
    
}

function removeFuncionalityRecipientModal(){

}

function verifyFieldsToModifyConst(){
    let found = false;
    Object.entries(fieldsToModify).forEach(([key, value]) => {
        if(found === false){
            if(fieldsToModify[key] = true); found = true;
        }
    });
    return found;
}

async function modifyData(){
    console.log("Modificando la info de ", type);
    console.log("Fields modificados ", verifyFieldsToModifyConst(),"Desglose:" , fieldsToModify)

    if(verifyFieldsToModifyConst() === false){
        showNoChangesDialog();
        return;
    }


    switch(type){



        case 'sender':
            try{
                const module = await import("../validations/formsValidations/updateShipmentValidations.js");
                newData = await module.validateSenderDataFields(fieldsToModify, guide);
            }catch(error){
                console.log(error);
                return;
            }
            if(newData && Array.isArray(newData)){
                newData.forEach((value, index) => {
                    finalData[value["data-key"]] = value["now"];
                })
                showConfirmDialog("remitente");
            }else{
                if(newData = "No se modifico ningun campo") showNoChangesDialog();   
            }
        break;
        


        case 'recipient':
            try{
                const module = await import("../validations/formsValidations/updateShipmentValidations.js");
                newData = await module.validateRecipientDataFields(fieldsToModify, guide);
            }catch(error){
                console.log(error);
                return;
            }
            if(newData && Array.isArray(newData)){
                newData.forEach((value, index) => {
                    finalData[value["data-key"]] = value["now"];
                })
                showConfirmDialog("destinatario");
            }else{
                if(newData = "No se modifico ningun campo") showNoChangesDialog();   
            }
        break;

    }
}

function showConfirmDialog(type){
    const modalContainer = document.getElementById("modal-layer2");
    modalContainer.innerHTML += getModalConfirm(type);
    addFuncionalityConfirmDialog();
}

function hideConfirmDialog(){
    const modalContainer = document.getElementById("modal-layer2");
    const modal = document.getElementById("confirm-modal");
    if(modalContainer && modal ) modalContainer.removeChild(modal);
}

function addFuncionalityConfirmDialog(){
    const yes = document.getElementById("btn-yes");
    const no =  document.getElementById("btn-no");

    if(yes) yes.addEventListener('click', updateUser);
    if(no) no.addEventListener('click', cancelUpdate);
}

function removeFuncionalityConfirmDialog(){
    const yes = document.getElementById("btn-yes");
    const no =  document.getElementById("btn-no");

    if(yes) yes.removeEventListener('click', updateUser);
    if(no) no.removeEventListener('click', cancelUpdate);
}









function showNoChangesDialog(){
    const modalContainer = document.getElementById("modal-layer2");
    modalContainer.innerHTML += getHtmlModalNoUpdates();
    addFuncionalityNoChangesDialog();
}

function hideNoChangesDialog(){
    const modalContainer = document.getElementById("modal-layer2");
    const modal = document.getElementById("no-changes-modal");
    removeFuncionalityNoChangesDialog();
    if(modalContainer && modal ) modalContainer.removeChild(modal);
}

function addFuncionalityNoChangesDialog(){
    const closeModalButton = document.getElementById("close-modal-button-no-changes");
    if(closeModalButton) closeModalButton.addEventListener('click',  hideNoChangesDialog);

    const aceptarButton = document.getElementById("btn-aceptar-no-changes");
    if(aceptarButton) aceptarButton.addEventListener('click',  hideNoChangesDialog);
}

function removeFuncionalityNoChangesDialog(){
    const closeModalButton = document.getElementById("close-modal-button-no-changes");
    if(closeModalButton) closeModalButton.removeEventListener('click',  hideNoChangesDialog);

    const aceptarButton = document.getElementById("btn-aceptar-no-changes");
    if(aceptarButton) aceptarButton.removeEventListener('click',  hideNoChangesDialog);
}






function showSuccessDialog(){
    const modalContainer = document.getElementById("modal-layer2");
    modalContainer.innerHTML += getHtmlSuccess();
    addFuncionalitySuccessDialog();
}

function hideSuccessDialog(){
    const modalContainer = document.getElementById("modal-layer2");
    const modal = document.getElementById("success-modal");
    removeFuncionalitySuccessDialog();
    if(modalContainer && modal ) modalContainer.removeChild(modal);
}

function addFuncionalitySuccessDialog(){
    const closeModalButton = document.getElementById("close-modal-button-success");
    if(closeModalButton) closeModalButton.addEventListener('click',  async () =>{
        hideSuccessDialog()
        hideRecipientModal()
        hideSenderModal()
        await rechargePage();
        clean();
    });

    const aceptarButton = document.getElementById("btn-aceptar-success");
    if(aceptarButton) aceptarButton.addEventListener('click',  async () =>{
        hideSuccessDialog()
        hideRecipientModal()
        hideSenderModal()
        await rechargePage();
        clean();
    });

}

function removeFuncionalitySuccessDialog(){
    const closeModalButton = document.getElementById("close-modal-button-success");
    if(closeModalButton) closeModalButton.removeEventListener('click',  () =>{
        hideSuccessDialog()
        hideRecipientModal()
        hideSenderModal()
    });


    const aceptarButton = document.getElementById("btn-aceptar-success");
    if(aceptarButton) aceptarButton.removeEventListener('click',  () =>{
        hideSuccessDialog()
        hideRecipientModal()
        hideSenderModal()
    });

}





async function updateUser(){
    try{
        const module = await import("../api/shipments.js");
        const success = await module.fetchUpdateCustomerData(finalData,guide,type);

        if(success){
            hideConfirmDialog();
            showSuccessDialog();
        }else{
            alert("No se pudo modificar");
        }
    }catch(error){
        alert("No se pudo modificar", error);
    }
}

function cancelUpdate(){
    hideConfirmDialog();
    hideRecipientModal();
    hideRecipientModal();
    clean();
}

async function goHomePage(){
    try{
        const module = await import("../router.js");
        await module.navigateTo("/app/home");
    }catch(error){
        return;
    }
  }

  async function rechargePage(){
    try{
        const module = await import("../router.js");
        removeFuncionality();
        await module.navigateTo(`/app/shipment/${guide}`);
    }catch(error){
        await goHomePage()
        return;
    }
  }

  






/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  H T M L 
======================================================================================
*/


export async function getHtmlPage(shipment, lastStatus) {
    return `
        <h1 class="title-section"><span id="title-shipment-profile">Envíos</span><span id="guide-shipment"> > ${shipment["guia"]}</span></h1>
        <div class="shupment-home-content">
            <div id="modify-modal-container"></div>
            <div id="modal-layer2"></div>
            <div class="title-container">
                <h2 class="ship-titles title-shipment-info">Datos del envío</h2>
            </div>
            <div class="shipping-information">
                <div class="ship-info sender-container">
                    <h3 class="ship-subtitle sbt-sender">Remitente</h3>
                    <div class="container-p-span-info">
                        <p id="d1-sender">Nombre: <span id="d2-sender">${shipment["nombre_remitente"]}</span></p>
                        <p id="d1-sender">Dirección: <span id="d2-sender">${shipment["calle_remitente"]} #${shipment["numero_ext_remitente"]}${shipment["numero_int_remitente"] ? ' Int.' + shipment["numero_int_remitente"] : ''}, ${shipment["ciudad_remitente"]}, ${shipment["nombre_estado_remitente"]}. C.P ${shipment["cp_remitente"]}</span></p>
                        <p id="d1-sender">Tel: <span id="d2-sender">${shipment["telefono_remitente"]}</span></p>
                    </div>
                    <button class="button" id="btn-modify-sender">Modificar</button>    
                </div>
                <div class="ship-info recipient-container">
                    <h3 class="ship-subtitle sbt-recipient">Destinatario</h3>
                    <div class="container-p-span-info">
                        <p id="d1-recipient">Nombre: <span id="d2-recipient">${shipment["nombre_destinatario"]}</span></p>
                        <p id="d1-recipient">Dirección: <span id="d2-recipient">${shipment["calle_destinatario"]} #${shipment["numero_ext_destinatario"]}${shipment["numero_int_destinatario"] ? ' Int.' + shipment["numero_int_destinatario"] : ''}, ${shipment["ciudad_destinatario"]}, ${shipment["nombre_estado_destinatario"]}. C.P ${shipment["cp_destinatario"]}</span></p>
                        <p id="d1-recipient">Tel: <span id="d2-recipient">${shipment["telefono_destinatario"]}</span></p>
                    </div>
                    <button class="button" id="btn-modify-recipient">Modificar</button>
                </div>
                <div class="ship-info package-container">
                    <h3 class="ship-subtitle sbt-package">Paquete</h3>
                    <div class="container-p-span-info">
                        <p id="d1-package">Peso: <span id="d2-package">${shipment["peso"]} kg</span></p>
                        <p id="d1-package">Dimensiones: <span id="d2-package">${shipment["largo"]} x ${shipment["ancho"]} x ${shipment["alto"]} cm</span></p>
                    </div>
                </div>
                <div class="ship-info status-container">
                    <h3 class="ship-subtitle sbt-status">Estado</h3>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-status">Estado: <span class="ship-info-text cont-status">${lastStatus["estatus"]}</span></p>
                    </div>
                </div>
                <div class="ship-info service-container">
                    <h3 class="ship-subtitle sbt-service">Servicio</h3>
                    <div class="container-p-span-info">
                        <p class="ship-info-text cont-service">Servicio: <span class="ship-info-text cont-service">${shipment["servicio"].replace(/_/g, ' ')}</span></p>
                    </div>
                </div>
            </div>
            <div class="edit-status-shipment">
                <form class="form form-edit-status">
                    <div class="form-group">    
                        <h2 class="ship-titles title-shipment-info">Cambiar Estado</h2>
                    </div>
                    <div class="form-inline new-section1">
                        <div class="form-group">
                            <label class="input-label label-new-info-status" for="new-status">Nuevo estado*</label>
                            ${await getSelectStatus()}
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
                        <button class="button btn-change-status" id="change-status">Cambiar estatus</button>
                    </div>


                    <div class="form-group">    
                        <h2 class="ship-titles title-shipment-info">Operaciones</h2>
                    </div>

                    <div class=" form-inline">
                        <button class="button-modals" id="btn-print-ticket">
                            <img src="/app/resources/icons/ticket-print.svg" alt="Ticket">
                            <span>Imprimir ticket</span>
                        </button>
                        <button class="button-modals" id="btn-print-guide">
                            <img src="/app/resources/icons/guide-print.svg" alt="Giua">
                            <span>Imprimir guía</span>
                        </button>
                    </div>


                </form>
            </div>                
        </div>`;
}

async function getSelectStatus(){
    let status;
    try{
        const module = await import('../api/utils.js')
        status = await module.fetchStatus();
    }catch(error){}

    let statusSelectOptions = `<select class="filter-selects" name="estatus" id="new-status">  <option value="" disabled selected>Estatus</option>`
    status.forEach(status => {
        statusSelectOptions = statusSelectOptions +`<option value="${status}">${status.replace(/_/g, ' ')}</option>`;
    });
    statusSelectOptions += `</select>`;
    return statusSelectOptions;
}

function getShipmentNotFoundPage(){
    return `
        <div class="form-inline-modal">
            <img id="not-found-img" src="/app/resources/icons/not-found-shipment.svg" alt="No encontrado">
            <span id="not-found-message">Envío no encontrado</span>
        </div>`
}

function getModalUpdateInfoRecipient(dataRecipient){
    return `
        <div class="body-modal" id="recipient-modal">
            <div class="modal">
                <div class="modal-content">
                    <button class="close-modal-button" id="close-modal-button-recipient">x</button>
                    <div class="head-title-modal-container">    
                        <h2 class="title-modal-user">Modificar datos destinatario</h2>
                    </div>

                    <form class="form" id="form-modify-recipient">

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
                                <label class="input-label" for="estado-destinatario">Estado*</label>
                                <select class="form-select" id="estado-destinatario">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    ${getSelectStates(dataRecipient["estado"] || "")}
                                </select>
                                <span class="input-message input-message-hide" id="estado-destinatario-msg"></span>
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
                        <button ync function changeStatus(){="button" class="cancel" id="btn-modal-cancel-recipient">Cancelar</button>
                        <button type="button" class="create" id="btn-modal-modify-recipient">Modificar</button>
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
                    <button class="close-modal-button" id="close-modal-button-sender">x</button>
                    <div class="head-title-modal-container">    
                        <h2 class="title-modal-user">Modificar datos remitente</h2>
                    </div>

                    <form class="form" id="form-modify-sender">

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
                                <label class="input-label" for="estado-remitente">Estado*</label>
                                <select class="form-select" id="estado-remitente">
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    ${getSelectStates(dataSender["estado"] || "")}
                                </select>
                                <span class="input-message input-message-hide" id="estado-remitente-msg"></span>
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
                        <button type="button" class="cancel" id="btn-modal-cancel-sender">Cancelar</button>
                        <button type="button" class="create" id="btn-modal-modify-sender">Modificar</button>
                    </div>

                </div>

            </div>

        </div>`
}


function getSelectStates(selected) {
    if (!states) return "";
    let statesOptions = "";
    states.forEach(state => {
        const isSelected = state.clave === selected ? "selected" : "";
        statesOptions += `<option value="${state.clave}" ${isSelected}>${state.nombre}</option>`;
    });
    return statesOptions;
}

function getModalConfirm(type){
    return ` 
    <div class="body-modal body-modal-layer-2" id="confirm-modal">
        <div class="modal">
            <div class="modal-content">
                
                <div class="head-title-modal-container">    
                    <h2 class="title-modal-user">Modificar ${type}</h2>
                </div>

                <p class="confirm-info"> Información que se va a modificar </p>

                <table id="modified-fields">
                    <thead>
                        <tr>
                           <th>Campo</th>
                           <th>Valor Anterior</th>
                           <th>Nuevo Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                       ${buildTableUpdateFields()}
                    </tbody>
                </table>

                <p class="confirm-info"> ¿Esta seguro que quiere modificar? </p>

                <div class="button-group-modal">
                    <button type="button" class="cancel" id="btn-no">Cancelar</button>
                    <button type="button" class="create" id="btn-yes">Si</button>
                </div>

            </div>

        </div>

    </div>`
}

function buildTableUpdateFields(){
    let tableRows = "";
    if (!Array.isArray(newData)) return;
    newData.forEach( (value, index) => {
        tableRows += `<tr>        
                        <td>${value["data-key"].replace(/_/g, ' ')}</td>
                        <td>${value["before"]}</td>
                        <td>${value["now"]}</td>
                    </tr>`
    })
    return tableRows;
}


function getHtmlModalNoUpdates(){
    return `
    <div class="body-modal body-modal-layer-2" id="no-changes-modal">
        <div id="notChangesModal" class="modal">
            <div class="modal-content-small">
                <button class="close-modal-button" id="close-modal-button-no-changes">x</button>
                <div class="form-group-modal">
                    <div class="form-inline-modal">
                        <img class="success-img-modal" id="success" src="/app/resources/icons/alert.svg" alt="No se modifico ningun campo">
                        <span class="not-found-message-modal" id="not-found-message-package">No se modifico ningun campo</span>
                    </div>
                </div>
                <div class="form-group-modal">
                    <button class=" button btn-aceptar" id="btn-aceptar-no-changes">Aceptar</button>
                </div>
            </div>
        </div>
    </div>`
}


function getHtmlSuccess(){
    return `
    <div class="body-modal body-modal-layer-2" id="success-modal">
        <div id="notChangesModal" class="modal">
            <div class="modal-content-small">
                <button class="close-modal-button" id="close-modal-button-success">x</button>
                <div class="form-group-modal">
                    <div class="form-inline-modal">
                        <img class="not-found-img-modal" id="not-found-package" src="/app/resources/icons/success.svg" alt="No se modifico ningun campo">
                        <span class="not-found-message-modal" id="not-found-message-package">Se modifico con exito</span>
                    </div>
                </div>
                <div class="form-group-modal">
                    <button class=" button btn-aceptar" id="btn-aceptar-success">Aceptar</button>
                </div>
            </div>
        </div>
    </div>`
}

