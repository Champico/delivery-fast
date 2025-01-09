export async function getPage(){
    const guide = urlParser();

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
        <h1 class="title-section"><span id="title-shipment-profile">Envíos</span><span id="guide-shipment"> > ${shipment["guia"]}</span></h1>
        <div class="shupment-home-content">
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
                    <button class="button">Modificar</button>    
                </div>
                <div class="ship-info recipient-container">
                    <h2 class="ship-subtitle sbt-recipient">Destinatario</h2>
                    <div class="container-p-span-info">
                        <p id="d1-recipient">Nombre: <span id="d2-recipient">${shipment["nombre_destinatario"]}</span></p>
                        <p id="d1-recipient">Dirección: <span id="d2-recipient">${shipment["calle_destinatario"]} #${shipment["numero_ext_destinatario"]}${shipment["numero_int_destinatario"] ? ' Int.' + shipment["numero_int_destinatario"] : ''}, ${shipment["ciudad_destinatario"]}, ${shipment["nombre_estado_destinatario"]}. C.P ${shipment["cp_destinatario"]}</span></p>
                        <p id="d1-recipient">Tel: <span id="d2-recipient">${shipment["telefono_destinatario"]}</span></p>
                    </div>
                    <button class="button">Modificar</button>
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



async function getShipmentNotFoundPage(){
    return `
        <div class="form-inline-modal">
            <img id="not-found-img" src="/app/resources/icons/not-found-shipment.svg" alt="No encontrado">
            <span id="not-found-message">Envío no encontrado</span>
        </div>`
}

async function getModalUpdateInfoSender(){
    return `
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="head-title-modal-container">    
                <h2 class="title-modal-user">Enviar desde</h2>
            </div>
            <form class="form-container-modal">
                <div class="form-group-modal">
                    <label for="name-colab">Nombre*</label>
                    <input class="input-modal" type="text" id="name-colab" placeholder="Nombre completo del colaborador" required>
                </div>

                <div class="form-inline-modal">
                    <div class="form-group-modal">
                        <label for="cp-modal">Codigo postal*</label>
                        <input class="input-modal" type="text" id="cp-modal" placeholder="Ej. 91140" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="estate-modal">Estado*</label>
                        <input class="input-modal" type="text" id="estate-modal" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="city-modal">Ciudad*</label>
                        <input class="input-modal" type="text" id="city-modal" required>
                    </div>
                    <div class="form-group-modal">
                        <label for="col-modal">Colonia*</label>
                        <input class="input-modal" type="text" id="col-modal" required>
                    </div>
                </div>


                <div class="form-inline-modal">

                    <div class="form-group-modal">
                        <label for="street-modal">Calle*</label>
                        <input class="input-modal " type="text" id="street-modal" placeholder="Ingrese el domicilio remitente" required>
                    </div>
                        
                        <div class="form-group-modal">
                            <label for="no-ext-modal">No.ext*</label>
                            <input class="input-modal" type="text" id="no-ext-modal" required>
                        </div>
                        <div class="form-group-modal">
                            <label for="no-int-modal">No.int</label>
                            <input class="input-modal" type="text" id="no-int-modal" required>
                        </div>
                    
                </div>
                
                
                <div class="form-inline-modal">
                    <div class="form-group-modal">
                        <h1 class="title-modal-info-contac">Datos de Contacto</>
                            <div class="form-inline-modal">
                                <div class="form-group-modal">
                                    <label for="email-contac">Correo</label>
                                    <input class="input-modal" type="email" id="email-contac" placeholder="example@dominio.com">
                                </div>
                                <div class="form-group-modal">
                                    <label for="phone-contac">Teléfono</label>
                                    <input class="input-modal" type="tel" id="phone-contac" placeholder="Teléfono">
                                </div>
                            </div>
                    </div>
                </div>

                
                <div class="button-group-modal">
                    <button type="submit" class="create">Guardar</button>
                </div>
            </form>
        </div>
    </div>
    `
}

async function getModalUpdateInfoRecipient(){
    
}