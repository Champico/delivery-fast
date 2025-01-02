export async function getPage(){
    return getHtmlPage();
}

export async function addFunctionality(){
    const boton = document.getElementById("btn-search-shipment");
    if(!boton) return;
    boton.addEventListener('click', searchShipmentWithGuide);

    const closeModalButton = document.getElementById("close-modal-button");
    if(closeModalButton) closeModalButton.addEventListener('click', hideModalNotFound);

    const aceptarButton = document.getElementById("btn-aceptar");
    if(aceptarButton) aceptarButton.addEventListener('click', hideModalNotFound);
}

async function searchShipmentWithGuide(){
    hideMessage();
    const input = document.getElementById("guide-input");
    if(!input) return;

    const shipmentGuide = input.value || "";
    let correct = false;
    let exists = false;

    if(!shipmentGuide){
        showMessage("Ingrese una guía")
        return;
    }

    try{
        const module = await import('../validations/shipmentValidations.js');
        correct = await module.validateGuide(shipmentGuide);    
    }catch(error){
        return;
    }

    if(correct !== true){
        showMessage(correct);
        return;
    }

    try{
        const module = await import('../api/shipments.js');
        exists = await module.verifyIfExistsShipmentByGuide(shipmentGuide);    
    }catch(error){
        return;
    }

    if(exists === true){
        try{
            const module = await import("../router.js");
            module.navigateTo(`/app/shipment/${shipmentGuide}`);
        }catch(error){
            return;
        }

    }else{
        showModalNotFound();
    }
}

function showMessage(message){
    const msg = document.getElementById("guide-input-msg");
    if(!msg) return;
    msg.innerText = message;
    if(msg.classList.contains("input-message-hide")) msg.classList.remove("input-message-hide");
}

function hideMessage(){
    const msg = document.getElementById("guide-input-msg");
    if(!msg) return;
    msg.innerText = "";
    if(!msg.classList.contains("input-message-hide")) msg.classList.add("input-message-hide");
}

function showModalNotFound(){
    const modal = document.getElementById("shipment-not-found-modal");
    if(!modal) return;
    if(modal.classList.contains("modal-hide")) modal.classList.remove("modal-hide");
}

function hideModalNotFound(){
    const modal = document.getElementById("shipment-not-found-modal");
    if(!modal) return;
    if(!modal.classList.contains("modal-hide")) modal.classList.add("modal-hide");
}











function getHtmlPage(){
    return `
    <div class="shupment-home-guide-view">
        <div class="guide-input-container">
            <h2 class="guide-title">Ingrese Guía o Folio</h2>
            <div class="form-group">
                <input type="text" class="guide-input" id="guide-input" placeholder="123456789 ...">
                <button class="button guide-button" id="btn-search-shipment">Buscar</button>
                <p><span class="input-message input-message-hide" id="guide-input-msg"></span></p>
            </div>
        </div>
        
        ${getHtmlModal()}
    
    </div>`
}

function getHtmlModal(){
    return `
    <div class="body-modal modal-hide" id="shipment-not-found-modal">
        <div id="notFoundModal" class="modal">
            <div class="modal-content-small">
                <button id="close-modal-button">x</button>
                <div class="form-group-modal">
                    <div class="form-inline-modal">
                        <img id="not-found-img" src="resources/icons/not-found-shipment.svg" alt="No encontrado">
                        <span id="not-found-message">Envío no encontrado</span>
                    </div>
                </div>
                <div class="form-group-modal">
                    <button class=" button btn-aceptar" id="btn-aceptar">Aceptar</button>
                </div>
            </div>
        </div>
    </div>`
}