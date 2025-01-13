let dataNewShipment = {
    sucursal:       null,
    colaborador:    null,
    peso:           null,
    largo:          null,
    ancho:          null,
    alto:           null,
    contenido:      null,
    servicio:       null,
    seguro:         null,
    metodo_de_pago: null,
    pago_con:       null,

    nombre_remitente:    null,
    correo_remitente:    null,
    telefono_remitente:  null,
    calle_remitente:     null,
    numeroExt_remitente: null,
    numeroInt_remitente: null,
    colonia_remitente:   null,
    cp_remitente:        null,
    ciudad_remitente:    null,
    estado_remitente:    null,

    nombre_destinatario:      null,
    correo_destinatario:      null,
    telefono_destinatario:    null,
    calle_destinatario:       null,
    numeroExt_destinatario:   null,
    numeroInt_destinatario:   null,
    colonia_destinatario:     null,
    cp_destinatario:          null,
    ciudad_destinatario:      null,
    referencias_destinatario: null,
    estado_destinatario:      null
};

let dataOfPackage = null;
let states = null;
let services = null;
let container = null;
let topButton = null;
let bottomButton = null;
let lastPage = null;
let currentPage = null;
let modalContainer = null;
let ticketPreview = null;
let newShipment = null;

export async function getPage(){
    return getTopPage() + await getContent() + getBottomPage();
}

export async function addFunctionality(){
    addFuncionalityToWizard();
    await getFuncionality();
}

async function navigateToInside(url){
    if(container) container.scrollTop = 0;
    history.pushState(null, null, url);
    await renderContent(await getContent());
    getFuncionality();
}

async function renderContent(html){
    if(!container) container = document.getElementById("new-shupment-page-content");
    if(!container) return
    container.innerHTML = html;
}

async function urlParser(){
    const completePath = window.location.pathname;
    const pathAndSearch= completePath.split("?");
    const brokePath = pathAndSearch[0].split("/");
    if(brokePath[4] || pathAndSearch[1]) await notFoundPage();
    const route = "/" + brokePath[2] + (brokePath[3] ? ("/" + brokePath[3]) : "");
    return route;
}

async function getContent(){
    currentPage = await urlParser();
    console.log("CARGAR CONTENIDO | Url es: ", currentPage);

    switch(currentPage){
        case "/new-shipment":              return await getPageStepOne(); break;
        case "/new-shipment/package-info": return await getPageStepTwo(); break;
        case "/new-shipment/ticket-info":  return await getPageStepThree(); break;
        default: await notFoundPage(); break;  
    }

    return '<h1>Not Found</h1>';
}

async function getFuncionality(){
    if(!getButtonReference()) return;
    if(!currentPage) currentPage = await urlParser();
    console.log("FUNCIONALIDAD | La url actual > ", currentPage, "y la ultima ", lastPage);

    if(lastPage){
        switch(lastPage){
            case "/new-shipment":              await removeFunctionalityPageOne(); break;
            case "/new-shipment/package-info": await removeFuncionalityPageTwo(); break;
            case "/new-shipment/ticket-info":  await removeFuncionalityPageThree(); break;
            default: await notFoundPage(); break;  
        }
    }

    switch(currentPage){
        case "/new-shipment":              await addFunctionalityPageOne();  paintWizard("step-one"); break;
        case "/new-shipment/package-info": await addFuncionalityPageTwo();   paintWizard("step-two"); break;
        case "/new-shipment/ticket-info":  await addFuncionalityPageThree(); paintWizard("step-three"); break;
        default: await notFoundPage(); break;  
    }
}





/* P A G I N A S */
async function getPageStepOne(){
    return await getHtmlStepOne();
}

async function getPageStepTwo(){
    if(dataNewShipment["ciudad_destinatario"] === null || dataNewShipment["cp_destinatario"] === null || dataNewShipment["calle_destinatario"] === null){
        await navigateToInside("/app/new-shipment");
        return await getHtmlStepOne();
    }else{
        return await getHtmlStepTwo();
    }
}

async function getPageStepThree(){
    if(dataNewShipment["servicio"] === null || dataNewShipment["peso"] === null){
        if(dataNewShipment["ciudad_destinatario"] === null || dataNewShipment["cp_destinatario"] === null || dataNewShipment["calle_destinatario"] === null){
            await navigateToInside("/app/new-shipment");
            return await getHtmlStepOne();
        }else{
            await navigateToInside("/app/new-shipment/package-info");
            return await getHtmlStepTwo();
        }
    }else{
        return await getHtmlStepThree();
    }
}



function getButtonReference(){
    if(!topButton)    topButton = document.getElementById("new-shipment-btn-siguiente");
    if(!bottomButton) bottomButton = document.getElementById("new-shipment-btn-siguiente-2");
    if(topButton && bottomButton) return true;
    return false;
}





/* A D D   F U N C I O N A L I T Y */
async function addFunctionalityPageOne(){
    topButton.addEventListener("click", goToStepTwo);
    bottomButton.addEventListener("click", goToStepTwo);
}

async function addFuncionalityPageTwo(){ 
    topButton.addEventListener("click", goToStepThree);
    bottomButton.addEventListener("click", goToStepThree);
}

async function addFuncionalityPageThree(){
    topButton.addEventListener("click", goToPayAndCreate);
    bottomButton.addEventListener("click", goToPayAndCreate);
}


/* R E M O V E   F U N C I O N A L I T Y */
async function removeFunctionalityPageOne(){
    topButton.removeEventListener("click", goToStepTwo);
    bottomButton.removeEventListener("click", goToStepTwo);
}

async function removeFuncionalityPageTwo(){
    topButton.removeEventListener("click", goToStepThree);
    bottomButton.removeEventListener("click", goToStepThree);
}

async function removeFuncionalityPageThree(){
    topButton.removeEventListener("click", goToPayAndCreate);
    bottomButton.removeEventListener("click", goToPayAndCreate);
}



/* F U N C I O N A L I D A D  W I Z A R D */
function addFuncionalityToWizard(){
    const stepOneButton = document.getElementById("ws-datos-envio");
    const stepTwoButton = document.getElementById("ws-datos-paquete");
    const stepThreeButton = document.getElementById("ws-datos-pago");

    if(stepOneButton) stepOneButton.addEventListener('click', async () => {
        wizardNavigation("step-one")
    });
    if(stepTwoButton) stepTwoButton.addEventListener('click', async () => {
        wizardNavigation("step-two")
    });
    if(stepThreeButton) stepThreeButton.addEventListener('click', async () => {
        wizardNavigation("step-three")
    });
}

async function wizardNavigation(wizardClicked){
    console.log("Wizard activado xd", wizardClicked)
    console.log("Pagina actual", currentPage)
    switch(currentPage){
        case "/new-shipment":
            switch(wizardClicked){
                case "step-two": await goToStepTwo(); break;
                case "step-three":
                    if(!ticketPreview || Object.keys(ticketPreview) === 0){
                        const stepThreeButton = document.getElementById("ws-datos-pago");
                        if(stepThreeButton) paintWizardError(stepThreeButton);
                    }else{
                        lastPage = currentPage;
                        await navigateToInside("/app/new-shipment/ticket-info");
                    }
                break;
            }
        break;

        case "/new-shipment/package-info": 
            switch(wizardClicked){
                case "step-one":
                    lastPage = currentPage;
                    await navigateToInside("/app/new-shipment");
                break;

                case "step-three": goToStepThree(); break;
            }
        break;

        case "/new-shipment/ticket-info": 
            switch(wizardClicked){
                case "step-one":
                    lastPage = currentPage;
                    await navigateToInside("/app/new-shipment");
                break;

                case "step-two":
                    lastPage = currentPage;
                    await navigateToInside("/app/new-shipment/package-info");
                break;
            }
        break;
    }
}

function removeFuncionalityToWizard(){
    const stepOneButton = document.getElementById("ws-datos-envio");
    const stepTwoButton = document.getElementById("ws-datos-paquete");
    const stepThreeButton = document.getElementById("ws-datos-pago");

    if(stepOneButton) stepOneButton.removeEventListener('click', async () => {
        wizardNavigation("step-one")
    });
    if(stepTwoButton) stepTwoButton.removeEventListener('click', async () => {
        wizardNavigation("step-two")
    });
    if(stepThreeButton) stepThreeButton.removeEventListener('click', async () => {
        wizardNavigation("step-three")
    });
}

/* P I N T A R   W I Z A R D  S T E P S */
function paintWizard(button){
    const stepOneButton = document.getElementById("ws-datos-envio");
    const stepTwoButton = document.getElementById("ws-datos-paquete");
    const stepThreeButton = document.getElementById("ws-datos-pago");
    
    switch(button){
        case "step-one": 
            if(!stepOneButton.classList.contains("wizard-step-selected"))  stepOneButton.classList.add("wizard-step-selected");
            if(stepTwoButton.classList.contains("wizard-step-selected"))   stepTwoButton.classList.remove("wizard-step-selected");
            if(stepThreeButton.classList.contains("wizard-step-selected")) stepThreeButton.classList.remove("wizard-step-selected");
        break;
        case "step-two": 
            if(!stepOneButton.classList.contains("wizard-step-selected"))  stepOneButton.classList.add("wizard-step-selected");
            if(!stepTwoButton.classList.contains("wizard-step-selected"))  stepTwoButton.classList.add("wizard-step-selected");
            if(stepThreeButton.classList.contains("wizard-step-selected")) stepThreeButton.classList.remove("wizard-step-selected");    
        break;
        case "step-three": 
            if(!stepOneButton.classList.contains("wizard-step-selected"))   stepOneButton.classList.add("wizard-step-selected");
            if(!stepTwoButton.classList.contains("wizard-step-selected"))   stepTwoButton.classList.add("wizard-step-selected");
            if(!stepThreeButton.classList.contains("wizard-step-selected")) stepThreeButton.classList.add("wizard-step-selected");    
        break;
    }
}

function paintWizardError(button){
    if(!button) return;

    button.classList.add("wizard-step-error");

    setTimeout(() => {
        elemento.classList.remove("wizard-step-error");
    }, 1000);

}















async function goToStepTwo(){
    if(await validateDataPageStepOne() === true){
        lastPage = currentPage;
        await navigateToInside("/app/new-shipment/package-info");
    }
}

async function goToStepThree(){
    if(await validateDataPageStepTwo() === true){
        lastPage = currentPage;
        await navigateToInside("/app/new-shipment/ticket-info");
    }
}

async function goToPayAndCreate(){
    showModalCashPayment();
}








/* V A L I D A C I O N E S  D E  D A T O S  D E  F O R M U L A R I O S */
async function validateDataPageStepOne(){
    let data = null;

    try{
        const module = await import("../validations/formsValidations/newShipmentValidations.js");
        data = await module.validateShipmentDataFields();    
    }catch(e){
        return false;
    }
    
    if(data === false) return false;
    
    dataNewShipment = {...dataNewShipment, ...data};
    let validateZipCodeSender = true
    let validateZipCodeRecipient = true;

    try{
        const module = await import("../api/utils.js");
        validateZipCodeSender = module.validateZipCode(dataNewShipment["cp_remitente"]);
        validateZipCodeRecipient = module.validateZipCode(dataNewShipment["cp_destinatario"]);
    }catch{}

    if(validateZipCodeSender === false && validateZipCodeRecipient === false){
        showModalErrorZipCode(true, true);
        return false;
    }else if(validateZipCodeSender === false || validateZipCodeRecipient === false){
        if(validateZipCodeSender === false) showModalErrorZipCode(true, false);
        if(validateZipCodeRecipient === false) showModalErrorZipCode(false, true);
        return false;
    }

    return true;
}

async function validateDataPageStepTwo(){
    let data = null;
    try{
        const module = await import("../validations/formsValidations/newShipmentValidations.js");
        data = module.validatePackageDataFields();
    }catch(e){
        return false;
    }
    
    if(data === false) return false;

    dataOfPackage = data;
    dataOfPackage.sucursal = localStorage.getItem("numero_sucursal") || null;
    dataOfPackage.colaborador =  localStorage.getItem("numero_personal") || null;

    dataNewShipment = {...dataNewShipment, ...dataOfPackage};
    
    ticketPreview = await generatePreviewTicket({...dataOfPackage , "cp_destinatario": dataNewShipment.cp_destinatario});
    
    if(ticketPreview === false) return false;

    ticketPreview = ticketPreview.ticket;

    return true;
}

async function generatePreviewTicket(data){
    let ticket = null;
    try{
        const module = await import('../api/ticket.js');
        ticket = await module.fetchTicket(data);
    }catch(error){
        return false;
    }
    if(!ticket || ticket == {} || Object.keys(ticket) == 0) return false;
    return ticket;
}




/*L Ó G I C A :  M O D A L   V E N T A N A   D E   P A G O  */
function showModalCashPayment(){
    if(!modalContainer) modalContainer = document.getElementById("modal-container");
    if(!modalContainer) return;

    if(modalContainer.querySelector("#payment-cash-modal")){
        const cashModal = document.getElementById("payment-cash-modal");

        const inputCashModel = document.getElementById("cash-input");
        const totalPrice = document.getElementById("price-total");

        if(!inputCashModel || !totalPrice) return;

        inputCashModel.value = ticketPreview.total;
        totalPrice.value = ticketPreview.total;

        showModal(cashModal);
    }else{
        modalContainer.innerHTML =  getHTMLModalCash();

        const inputCashModel = document.getElementById("cash-input");
        const botonModal = document.getElementById("btn-cobrar");

        if(!inputCashModel || !botonModal ) return;

        inputCashModel.addEventListener('input', calculateChange);
        botonModal.addEventListener('click', createShipmentWithCash);
    }
}

function hideModalCashPayment(){
    const modal = document.getElementById("payment-cash-modal");
    if(!modal) return;
    hideModal(modal);
}

function calculateChange() {
    const total = document.getElementById("price-total").innerHTML;
    const inputCash = document.getElementById("cash-input");
    const spanChange = document.getElementById("span-cambio");
    const boton = document.getElementById("btn-cobrar");
    const msg = document.getElementById("cash-msg");
    const regexValido = /^[0-9]+(\.[0-9]+)?$/;


    if (!total || !inputCash || !spanChange || !boton || !msg) return;
    if(!inputCash.value || inputCash.value === ".") return;
    if(regexValido.test(inputCash.value) === false) inputCash.value = inputCash.value.replace(/e|E|\+|\-/g, "");
    
    const cash = parseFloat(inputCash.value);
    const change = cash - total;

    if (change < 0) {
        msg.innerHTML = "El monto debe ser mayor al total";
        if(msg.classList.contains("input-message-hide")){
            msg.classList.remove("input-message-hide");
        }
        boton.disabled = true;
        spanChange.innerText = "0";
    } else {
        msg.innerHTML = "";
        if(!msg.classList.contains("input-message-hide")) msg.classList.add("input-message-hide");
        boton.disabled = false;
        spanChange.innerText = change.toFixed(2);
    }
}


/* C R E A R  E N V I O */
async function createShipmentWithCash(){
    newShipment = null;

    let cashInput = document.getElementById("cash-input");
    let cash = cashInput ? parseFloat(cashInput.value) || 0 : 0;

    if(!cash || cash < dataNewShipment.total) return;

    dataNewShipment.metodo_de_pago = "Efectivo";
    dataNewShipment.pago_con = cash;
    
    try{
        const module = await import('../api/shipments.js')
        newShipment = await module.fetchCreateShipment(dataNewShipment);    
    }catch(error){}

    if(!newShipment){
        alert("Error al crear el envío")
        return;
    }
            
    hideModalCashPayment();
    showModalSuccess();
}

function getModalContainerReference(){
    if(!modalContainer) modalContainer = document.getElementById("modal-container");
    if(!modalContainer) return false;
    return true;      
}



/* L Ó G I C A :  M O D A L  E N V I O  C R E A D O  C O R R E C T A M E N T E */
function showModalSuccess(){
    if(getModalContainerReference() === false) return;

    modalContainer.innerHTML +=  getHtmlModalSucces();
    addFunToModalSucces(newShipment["guia"]);
}

function removeModalSuccess(){
    if(getModalContainerReference() === false) return;

    if(modalContainer.querySelector("#modal-success")){
        removeFunToModalSucces()
        const child = document.getElementById("modal-success");
        modalContainer.removeChild(child);
    }
}

async function addFunToModalSucces($guia){
    const btnFinish = document.getElementById("btn-finish");
    const btnPrintTicket = document.getElementById("btn-print-ticket");
    const btnPrintGuide = document.getElementById("btn-print-guide");
    if(btnFinish) btnFinish.addEventListener('click', () => {  
        removeModalSuccess();
        cleanPage();
        window.location.href = "http://localhost/app/home"; });
    if(btnPrintTicket) btnPrintTicket.addEventListener('click', async () => { await printTicket($guia) });
    if(btnPrintGuide) btnPrintGuide.addEventListener('click', async () => { await printGuide($guia) });
}

async function removeFunToModalSucces($guia){
    const btnFinish = document.getElementById("btn-finish");
    const btnPrintTicket = document.getElementById("btn-print-ticket");
    const btnPrintGuide = document.getElementById("btn-print-guide");
    if(btnFinish) btnFinish.removeEventListener('click', () => {  
        removeModalSuccess();
        cleanPage();
        window.location.href = "http://localhost/app/home"; });
    if(btnPrintTicket) btnPrintTicket.removeEventListener('click', async () => { await printTicket($guia) });
    if(btnPrintGuide) btnPrintGuide.removeEventListener('click', async () => { await printGuide($guia) });
}

async function printTicket($guia){
    try{
        const module = await import("../api/ticket.js");
        const success = await module.getTicketPDFByGuide($guia);    
        return success;
    }catch(e){
        return false;
    }
}

async function printGuide($guia){
    try{
        const module = await import("../api/ticket.js");
        const success = await module.getGuidePDF($guia);    
        return success;
    }catch(e){
        return false;
    }
}

function cleanPage(){
    container = null;
    topButton = null;
    bottomButton = null;
    lastPage = null;
    currentPage = null;
    modalContainer = null;
    ticketPreview = null;
    newShipment = null;

    Object.entries(dataNewShipment).forEach(([key, value]) => {
        dataNewShipment[key] = null;
    });
}




/* L Ó G I C A :  M O D A L  E R R O R  C Ó D I G O  P O S T A L */
function showModalErrorZipCode(sender, recipient){
    if(getModalContainerReference() === false) return;

    if(modalContainer.querySelector("#shipment-not-found-zip-code-modal")){
        const messageHtml = document.getElementById("not-found-message-zip-code");
        let message = "";
        if(sender === true && remitente === true){
            message =  "Los códigos postales del remitente y del destinatario no fueron encontrados";
        }else{
            if(sender === true) message = "El código postal del remitente no fue encontrado";
            if(recipient === true) message = "El código postal del destinatario no fue encontrado";
        }
        messageHtml.innerText = message;
        const modal = document.getElementById("shipment-not-found-zip-code-modal");
        showModal(modal);
    }else{
        const modal = getModalErrorZipCodes(sender, recipient);
        modalContainer.innerHTML += modal;

        const closeModalButton = document.getElementById("close-modal-button-not-found");
        if(closeModalButton) closeModalButton.addEventListener('click', hideModalErrorZipCode);
    
        const aceptarButton = document.getElementById("btn-aceptar");
        if(aceptarButton) aceptarButton.addEventListener('click', hideModalErrorZipCode);
    }
}

function hideModalErrorZipCode(){
    const modal = document.getElementById("shipment-not-found-zip-code-modal");
    if(!modal) return;
    hideModal(modal);
}


function showModal(modal){
    if(!modal || !(modal instanceof HTMLElement)) return;
    if(modal.classList.contains("modal-hide")) modal.classList.remove("modal-hide");
}

function hideModal(modal){
    if(!modal || !(modal instanceof HTMLElement)) return;
    if(!modal.classList.contains("modal-hide")) modal.classList.add("modal-hide");
}




/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  H T M L 
======================================================================================
*/

/* =========================
    H T M L  P A G E  O N E 
   ========================= */

async function getHtmlStepOne(){

    if(!states || !Array.isArray(states)){
        try{
            const module = await import('../api/utils.js');
            states = await module.fetchStates();
        } catch (error) {
            return;
        }
    }
    if(!states) return;
    return getSenderForm() + getRecipientForm();
}

function getTopPage(){
    return `
        <div class="new-shupment-page-header">
            <h1 class="title-section">Nuevo envío</h1>
            <Button type="button" class="button btn-siguiente" id="new-shipment-btn-siguiente">Siguiente</Button>
        </div>
    
        <div class="new-shupment-wizard">
            <div class="wizard-step-container" id="wsc-datos-envio">
                <div class="wizard-step" id="ws-datos-envio">
                    <span class="newStepButtonLabel">Datos de envío</span>
                </div>
            </div>
            <div class="wizard-step-container" id="wsc-datos-paquete">
                <div class="wizard-step" id="ws-datos-paquete">
                    <span class="newStepButtonLabel">Datos de paquete</span>
                </div>
            </div>
            <div class="wizard-step-container" id="wsc-datos-pago">
                <div class="wizard-step" id="ws-datos-pago">
                    <span class="newStepButtonLabel">Datos de pago</span>
                </div>
            </div>
        </div>
        
        <!--Contenido dinamico-->
        <div class="new-shupment-page-content" id="new-shupment-page-content">`
}

function getBottomPage(){
    return `
            </div>
            <div class="new-shupment-page-bottom" id="new-shupment-page-bottom">
                <div id="modal-container"></div>
                <Button type="button" class="button btn-siguiente" id="new-shipment-btn-siguiente-2">Siguiente</Button>
            </div>`
    
}

function getSenderForm(){
    return `
        <div class="form-card form-sender">
            <h2 class="form-title">Enviar desde</h2>
            <form class="form">

                <div class="form-group">
                    <label class="input-label" for="nombre-remitente">Nombre*</label>
                    <input class="input" type="text" id="nombre-remitente" placeholder="Ingrese el nombre completo del remitente" value = "${dataNewShipment["nombre_remitente"] || ""}">
                    <span class="input-message input-message-hide" id="nombre-remitente-msg"></span>
                </div>

                <div class="form-inline">
                    <div class="form-group">
                        <label class="input-label label-cp" for="cp-remitente">Código postal*</label>
                        <input class="input" type="text" id="cp-remitente" placeholder="Ej. 91140" value = "${dataNewShipment["cp_remitente"] || ""}">
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
                        <input class="input" type="text" id="ciudad-remitente" value = "${dataNewShipment["ciudad_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="ciudad-remitente-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="colonia-remitente">Colonia*</label>
                        <input class="input" type="text" id="colonia-remitente" value = "${dataNewShipment["colonia_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="colonia-remitente-msg"></span>
                    </div>

                </div>

                <div class="form-inline">
                    <div class="form-group form-group-two-spaces">
                        <label class="input-label" for="calle-remitente">Calle*</label>
                        <input class="input" type="text" id="calle-remitente" placeholder="Ingrese el domicilio del remitente" value = "${dataNewShipment["calle_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="calle-remitente-msg">Hola</span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="noext-remitente">No. ext*</label>
                        <input class="input" type="text" id="noext-remitente" value = "${dataNewShipment["numeroExt_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="noext-remitente-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="noint-remitente">No. int</label>
                        <input class="input" type="text" id="noint-remitente" value = "${dataNewShipment["numeroInt_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="noint-remitente-msg"></span>
                    </div>
                </div>
                <div class="form-inline">
                    <div class="form-group">
                        <label class="input-label" for="correo-remitente">Correo</label>
                        <input class="input" type="text" id="correo-remitente" placeholder="example@dominio.com" value = "${dataNewShipment["correo_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="correo-remitente-msg"></span>
                    </div>
                    <div class="form-group">
                        <label class="input-label" for="telefono-remitente">Teléfono</label>
                        <input class="input" type="text" id="telefono-remitente" value = "${dataNewShipment["telefono_remitente"] || ""}">
                        <span class="input-message input-message-hide" id="telefono-remitente-msg"></span>
                    </div>
                </div>
            </form>
        </div>`
}

function getRecipientForm(){
    return `
        <div class="form-card form-recipient">
            <h2 class="form-title">Para</h2>
            <form>
            
                <div class="form-group">
                    <label class="input-label" for="nombre-destinatario">Nombre*</label>
                    <input class="input" type="text" id="nombre-destinatario" placeholder="Ingrese el nombre completo del destinatario" value = "${dataNewShipment["nombre_destinatario"] || ""}">
                    <span class="input-message input-message-hide" id="nombre-destinatario-msg"></span>
                </div>

                <div class="form-inline">
                    <div class="form-group">
                        <label class="input-label label-cp" for="cp-destinatario">Código postal*</label>
                        <input class="input" type="text" id="cp-destinatario" placeholder="Ej. 91140" value = "${dataNewShipment["cp_destinatario"] || ""}">
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
                        <input class="input" type="text" id="ciudad-destinatario" value = "${dataNewShipment["ciudad_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="ciudad-destinatario-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="colonia-destinatario">Colonia*</label>
                        <input class="input" type="text" id="colonia-destinatario" value = "${dataNewShipment["colonia_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="colonia-destinatario-msg"></span>
                    </div>
                </div>

                <div class="form-inline">

                    <div class="form-group form-group-two-spaces">
                        <label class="input-label" for="calle-destinatario">Calle*</label>
                        <input class="input" type="text" id="calle-destinatario" placeholder="Ingrese el domicilio del remitente" value = "${dataNewShipment["calle_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="calle-destinatario-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="noext-destinatario">No. ext*</label>
                        <input class="input" type="text" id="noext-destinatario" value = "${dataNewShipment["numeroExt_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="noext-destinatario-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="noint-destinatario">No. int</label>
                        <input class="input" type="text" id="noint-destinatario" value = "${dataNewShipment["numeroInt_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="noint-destinatario-msg"></span>
                    </div>

                </div>

                <div class="form-inline">

                    <div class="form-group">
                        <label class="input-label" for="correo-destinatario">Correo</label>
                        <input class="input" type="text" id="correo-destinatario" placeholder="example@dominio.com" value = "${dataNewShipment["correo_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="correo-destinatario-msg"></span>
                    </div>

                    <div class="form-group">
                        <label class="input-label" for="telefono-destinatario">Teléfono</label>
                        <input class="input" type="text" id="telefono-destinatario" value = "${dataNewShipment["telefono_destinatario"] || ""}">
                        <span class="input-message input-message-hide" id="telefono-destinatario-msg"></span>
                    </div>

                </div>

                <div class="form-group">
                    <label class="input-label" for="referencias">Referencias</label>
                    <textarea class="textarea" id="referencias" rows="3" placeholder="Breve descripción del lugar de destino..." value = "${dataNewShipment["referencias_destinatario"] || ""}"></textarea>
                    <span class="input-message input-message-hide" id="referencias-destinatario-msg"></span>
                </div>

            </form>
        </div> `
}

function getSelectStates(){
    if(!states || !Array.isArray(states)) return "";
    let statesOptions = "";
    states.forEach(state => {
        statesOptions = statesOptions +`<option value="${state.clave}">${state.nombre}</option>`
    });
    return statesOptions;
}


/* =========================
    H T M L  P A G E  T W O
   ========================= */

   async function getHtmlStepTwo() {
    return ` 
        <div class="form-card form-sender">
            <h2 class="form-title">Datos del paquete</h2>
            <form class="form">
                <div class="form-inline">
                    <div class="form-group">
    
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label" for="peso-package">Peso*</label>
                                <input class="input" type="text" id="peso-package" placeholder="Kg">
                                <span class="input-message input-message-hide" id="peso-package-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="largo-package">Largo*</label>
                                <input class="input" type="text" id="largo-package" placeholder="Cm">
                                <span class="input-message input-message-hide" id="largo-package-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="ancho-package">Ancho*</label>
                                <input class="input" type="text" id="ancho-package" placeholder="Cm">
                                <span class="input-message input-message-hide" id="ancho-package-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="alto-package">Alto*</label>
                                <input class="input" type="text" id="alto-package" placeholder="Cm">
                                <span class="input-message input-message-hide" id="alto-package-msg"></span>
                            </div>
                        </div>
                            ${await getServicesOptions()}
                        <div class="form-group">
                            <label class="input-label" for="security-package">Seguro de paquete</label>
                            <label class="switch">
                                <input class="input" type="checkbox" id="security-package">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="input-label label-new-info-status" for="new-observation">Contenido</label>
                            <textarea class="textarea txta-input-new-notes" id="new-observation" placeholder="Describa brevemente el contenido del paquete..."></textarea>
                            <span class="input-message input-message-hide" id="new-observation-msg"></span>
                        </div>                          
                    </div>
                    <div class="form-group">
                        <img src="/app/resources/icons/dimensionesFinal.svg" alt="Caja con dimensiones">
                    </div>
                </div>
            </form>
        </div>`;
}

async function getServicesOptions(){
    if(!services){
        try{
            const module = await import('../api/utils.js')
            services = await module.fetchServices();
        }catch(error){
            return; 
        }
    }

    let servicesSelectOptions = `
            <div class="form-group">
                <label class="input-label" for="service-package">Tipo de servicio*</label>
                <select class="filter-selects" name="service-package" id="service-package">
                    <option value="" disabled selected>Selecciona una opcion</option>`

    services.forEach(service => {
        servicesSelectOptions = servicesSelectOptions +`<option value="${service}">${service.replace(/_/g, ' ')}</option>`;
    });

    servicesSelectOptions= servicesSelectOptions +`
                    </select>
                <span class="input-message input-message-hide" id="service-package-msg"></span>
            </div>`
    return servicesSelectOptions;
}


/* =========================
    H T M L  P A G E  T H R E E
   ========================= */


function getHtmlStepThree(){
    return(`
        <div class="form-card form-sender" id="form-sender">
            <h2 class="form-title">Desglose</h2>
            <div class="table-container-shipment">
                <table class="details-shipment">
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${buildTicket()}
                        <tr>
                            <td>Total</td>
                            <td>${ticketPreview.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2 class="form-title">Método de pago</h2>
            <div class="payment-method">
                <label class="radio-label payment">
                    <input class="radio-input" type="radio" name="r-payment-method" id="r-payment-method">
                    Efectivo
                </label>
            </div>
        </div>`
  )
}


function buildTicket(){
    let rows = "";

    if(ticketPreview.conceptos_ticket){
        ticketPreview.conceptos_ticket.forEach((concepto) =>{
            const description = concepto.descripcion ? concepto.descripcion.replace(/_/g, ' ') : "";
            const value = concepto.valor ? concepto.valor : ""; 
            rows = rows + `<tr>
                <td>${description}</td>
                <td>${value}</td>
            </tr>`
        });
    }
    return rows;
  }

/* =========================
    H T M L  C A S H  M O D A L 
   ========================= */

function getHTMLModalCash(){
    return `
        <div class="body-modal modal-hide" id="payment-cash-modal">
            <div id="userModal" class="modal">
                <div class="modal-content-small">
                    <div class="form-group-modal">
                        <div class="head-title-modal-container">
                            <h1 class="title-modal-user">COBRAR (EFECTIVO)</h1>
                        </div>                    
                    </div>

                    <div class="form-group-modal">

                        <div class="form-group-modal price-total-container">
                            <h1 class="price-total">$<span class="price-total" id="price-total">${ticketPreview.total}</span></h1>
                        </div>

                        <div class="form-inline-modal">
                            <label class="input-label input-label-modal" for="cash-input">Paga con</label>
                            <input type="number" class="input input-modal" id="cash-input" value=${ticketPreview.total} name="cash-input" placeholder="Ingrese una cantidad">
                        </div>

                        <span class="input-message input-message-hide" id="cash-msg"></span>

                        <div class="form-inline-modal">
                            <p class="input-label input-label-modal" >Cambio</label>
                            <p class="p-cambio">$
                                <span class="span-cambio" id="span-cambio">0</span>
                            </p>
                        </div>
                    </div>
                    <div class="button-group-modal">
                        <button class=" button btn-cobrar" id="btn-cobrar">Cobrar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

/* =========================
    H T M L  M O D A L  S U C C E S
   ========================= */


function getHtmlModalSucces() {
    return `
        <div class="body-modal" id="modal-success">
            <div id="userModal" class="modal">
                <div class="modal-content">
                    <div class="form-group-modal">
                        <div class="head-title-modal-container">
                            <h1 class="title-modal-user">¡Envío creado correctamente!</h1>
                        </div>

                        <div class="form-group-modal">
                            <p class="p-subtitles">No.Folio: 
                                <span class="span-content" id="folio-dinamic">${newShipment.folio}</span> 
                            </p>
                            <p class="p-subtitles">Guía: 
                                <span class="span-content" id="guia-dinamic">${newShipment.guia}</span>
                            </p>
                        </div>

                        <div class="shipping-information-modal">
                            <div class="ship-info-modal sender-container-modal">
                                <h2 class="ship-subtitle-modal sbt-sender-modal">Remitente</h2>
                                <div class="container-p-span-info-modal">
                                    <p class="ship-info-text-modal cont-sender-modal">Nombre: <span>${newShipment.nombre_remitente}</span></p>
                                    <p class="ship-info-text-modal cont-sender-modal">Dirección: <span>${newShipment.calle_remitente} ${newShipment.numero_ext_remitente}${newShipment.numero_int_remitente ? `, Int ${newShipment.numero_int_remitente}` : ""}, ${newShipment.colonia_remitente}, ${newShipment.ciudad_remitente}, ${newShipment.estado_remitente}. C.P ${newShipment.cp_remitente}</span></p>
                                    <p class="ship-info-text-modal cont-sender-modal">Teléfono: <span>${newShipment.telefono_remitente}</span></p>
                                </div>
                            </div>

                            <div class="ship-info-modal recipient-container-modal">
                                <h2 class="ship-subtitle-modal sbt-recipient-modal">Destinatario</h2>
                                <div class="container-p-span-info-modal">
                                    <p class="ship-info-text-modal cont-recipient-modal">Nombre: <span>${newShipment.nombre_destinatario}</span></p>
                                    <p class="ship-info-text-modal cont-recipient-modal">Dirección: <span>${newShipment.calle_destinatario} ${newShipment.numero_ext_destinatario}${newShipment.numero_int_destinatario ? `, Int ${newShipment.numero_int_destinatario}` : ""}, ${newShipment.colonia_destinatario}, ${newShipment.ciudad_destinatario}, ${newShipment.estado_destinatario}. C.P ${newShipment.cp_destinatario}</span></p>
                                    <p class="ship-info-text-modal cont-recipient-modal">Teléfono: <span>${newShipment.telefono_destinatario}</span></p>
                                </div>
                            </div>

                            <div class="ship-info-modal package-container-modal">
                                <h2 class="ship-subtitle-modal sbt-package-modal">Paquete</h2>
                                <div class="container-p-span-info-modal">
                                    <p class="ship-info-text-modal cont-package-modal">Peso: <span>${newShipment.peso} kg</span></p>
                                    <p class="ship-info-text-modal cont-package-modal">Dimensiones: <span>${newShipment.largo} x ${newShipment.ancho} x ${newShipment.alto} cm</span></p>
                                    <p class="ship-info-text-modal cont-package-modal">Contenido: <span>${newShipment.contenido}</span></p>
                                </div>
                            </div>

                            <div class="ship-info-modal service-container-modal">
                                <h2 class="ship-subtitle-modal sbt-service-modal">Servicio</h2>
                                <div class="container-p-span-info-modal">
                                    <p class="ship-info-text-modal cont-service-modal">Servicio: <span>${newShipment.servicio}</span></p>
                                    <p class="ship-info-text-modal cont-service-modal">Seguro: <span>${newShipment.seguro === "1" ? "Sí" : "No"}</span></p>
                                </div>
                            </div>
                        </div>

                        <div class=" form-inline form-group-modal">
                            <button class="button-modals" id="btn-print-ticket">
                                <img src="/app/resources/icons/ticket-print.svg" alt="Ticket">
                                <span>Imprimir ticket</span>
                            </button>
                            <button class="button-modals" id="btn-print-guide">
                                <img src="/app/resources/icons/guide-print.svg" alt="Giua">
                                <span>Imprimir guía</span>
                            </button>
                            <button class="button-modals" id="btn-finish">Terminar</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>`;
}


/* =========================
    N O T  F O U N D  P A G E 
   ========================= */



async function notFoundPage(){
    try{
        const module = await import('../router.js');
        await module.navigateTo("/app/not-found");
    }catch(error){
        window.location.href = "http://localhost/app/home";
    }
}


/* =========================
    N O T  F O U N D  Z I P  C O D E 
   ========================= */

function getModalErrorZipCodes(sender, remitente){
    return `
        <div class="body-modal" id="shipment-not-found-zip-code-modal">
            <div id="notFoundModal" class="modal">
                <div class="modal-content-small">
                    <button class="close-modal-button" id="close-modal-button-not-found">x</button>
                    <div class="form-group-modal">
                        <div class="form-inline-modal">
                            <img class="not-found-img-modal" id="not-found-package" src="/app/resources/icons/not-found-place.svg" alt="No encontrado">
                            <span class="not-found-message-modal" id="not-found-message-zip-code">
                                ${()=>{
                                        if(sender === true && remitente === true){
                                            return "Los códigos postales del remitente y del destinatario no fueron encontrados";
                                        }else{
                                            if(sender === true) return "El código postal del remitente no fue encontrado";
                                            if(recipient === true) return "El código postal del destinatario no fue encontrado";
                                        }
                                    }
                                }
                            </span>
                        </div>
                    </div>
                    <div class="form-group-modal">
                        <button class=" button btn-aceptar" id="btn-aceptar">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>`
}