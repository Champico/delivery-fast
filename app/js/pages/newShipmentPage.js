import { fetchStates } from "../../api/states.js";
import { fetchCreateShipment } from "../../api/createShipment.js";
import { fetchTicket } from "../../api/generateTicket.js";
import { validateShipmentDataFields, validatePackageDataFields, shipmentsList } from "../../bussines/newShipmentPage/script_s1_validations.js";
import { changePage } from "../screen-manager.js";
import { dataNewShipment } from "./dinamic-manager.js";

let states = [];

export const newShipmentPage = {
    page : null,
    id_page : "",
    stateSelectSender : "",
    stateSelectRecipient : "",
    async create(){
        if(!this.page) this.page = await this.createFirstTime();
        return this.page;
    },
    async createFirstTime(){
        await this.getStates();
        this.page = this.getTop() + this.getSenderForm() + this.getRecipientForm() + this.getBottom();
        return this.page;
    },
    async getStates(){
       let states =  await fetchStates();
        
        let sender = `
            <div class="form-group">
                <label class="input-label" for="estado-destinatario">Estado*</label>
                <select class="form-select" id="estado-destinatario">`
        

        let recipient =`
            <div class="form-group">
                <label class="input-label" for="estado-remitente">Estado*</label>
                <select class="form-select" id="estado-remitente">`

        let stateSelectOptions = "";

        states.forEach(state => {
            stateSelectOptions = stateSelectOptions +`<option value="${state.id_entidad}">${state.nombre}</option>`
        });

        sender = sender + stateSelectOptions;
        recipient = recipient + stateSelectOptions;

        sender = sender + `
                    </select>
                <span class="input-message input-message-hide" id="estado-destinatario-msg"></span>
            </div>`

        recipient = recipient + `
                    </select>
                <span class="input-message input-message-hide" id="estado-remitente-msg"></span>
            </div>`

        this.stateSelectRecipient = recipient;
        this.stateSelectSender = sender;
    },
    getTop(){
        return `<div class="new-shupment-page-header">
                    <h1 class="title-section">Nuevo envío</h1>
                    <Button type="button" class="button btn-siguiente" id="btn-ns-p1-siguiente">Siguiente</Button>
                </div>


                <div class="new-shupment-wizard">
                    <div class="wizard-step-container wsc-datos-envio">
                        <div class="wizard-step wizard-step-selected ws-datos-envio">
                            <span class="newStepButtonLabel">Datos de envío</span>
                        </div>
                    </div>
                    <div class="wizard-step-container wsc-datos-paquete">
                        <div class="wizard-step ws-datos-paquete">
                            <span class="newStepButtonLabel">Datos de paquete</span>
                        </div>
                    </div>
                    <div class="wizard-step-container wsc-datos-pago">
                        <div class="wizard-step ws-datos-pago">
                            <span class="newStepButtonLabel">Datos de pago</span>
                        </div>
                    </div>
                </div>

                <!--Contenido dinamico-->
                <div class="new-shupment-page-content" id="new-shupment-page-content">`
    },
    getBottom(){
         return `</div>`
    },
    getSenderForm(){
        return `
                <div class="form-card form-sender">
                    <h2 class="form-title">Enviar desde</h2>
                    <form class="form">
                        <div class="form-group">
                            <label class="input-label" for="nombre-remitente">Nombre*</label>
                            <input class="input" type="text" id="nombre-remitente" placeholder="Ingrese el nombre completo del remitente">
                            <span class="input-message input-message-hide" id="nombre-remitente-msg"></span>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label" for="cp-remitente">Código postal*</label>
                                <input class="input" type="text" id="cp-remitente" placeholder="Ej. 91140">
                                <span class="input-message input-message-hide" id="cp-remitente-msg"></span>
                            </div>
                                ${this.stateSelectSender}
                            <div class="form-group">
                                <label class="input-label" for="ciudad-remitente">Ciudad*</label>
                                <input class="input" type="text" id="ciudad-remitente">
                                <span class="input-message input-message-hide" id="ciudad-remitente-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="colonia-remitente">Colonia*</label>
                                <input class="input" type="text" id="colonia-remitente">
                                <span class="input-message input-message-hide" id="colonia-remitente-msg"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="input-label" for="calle-remitente">Calle*</label>
                            <input class="input" type="text" id="calle-remitente" placeholder="Ingrese el domicilio del remitente">
                            <span class="input-message input-message-hide" id="calle-remitente-msg">Hola</span>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label" for="noext-remitente">No. ext*</label>
                                <input class="input" type="text" id="noext-remitente">
                                <span class="input-message input-message-hide" id="noext-remitente-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="noint-remitente">No. int</label>
                                <input class="input" type="text" id="noint-remitente">
                                <span class="input-message input-message-hide" id="noint-remitente-msg"></span>
                            </div>
                            <div class="form-group"> </div>
                            <div class="form-group"> </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label" for="correo-remitente">Correo</label>
                                <input class="input" type="text" id="correo-remitente" placeholder="example@dominio.com">
                                <span class="input-message input-message-hide" id="correo-remitente-msg"></span>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="telefono-remitente">Teléfono</label>
                                <input class="input" type="text" id="telefono-remitente">
                                <span class="input-message input-message-hide" id="telefono-remitente-msg"></span>
                            </div>
                        </div>
                    </form>
                </div>
        `
    },
    getRecipientForm(){
        return `
                <div class="form-card form-recipient">
                <h2 class="form-title">Para</h2>
                <form>
                    <div class="form-group">
                        <label class="input-label" for="nombre-destinatario">Nombre*</label>
                        <input class="input" type="text" id="nombre-destinatario" placeholder="Ingrese el nombre completo del destinatario">
                        <span class="input-message input-message-hide" id="nombre-destinatario-msg"></span>
                    </div>
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="input-label" for="cp-destinatario">Código postal*</label>
                            <input class="input" type="text" id="cp-destinatario" placeholder="Ej. 91140">
                            <span class="input-message input-message-hide" id="cp-destinatario-msg"></span>
                        </div>
                        ${this.stateSelectRecipient}
                        <div class="form-group">
                            <label class="input-label" for="ciudad-destinatario">Ciudad*</label>
                            <input class="input" type="text" id="ciudad-destinatario">
                            <span class="input-message input-message-hide" id="ciudad-destinatario-msg"></span>
                        </div>
                        <div class="form-group">
                            <label class="input-label" for="colonia-destinatario">Colonia*</label>
                            <input class="input" type="text" id="colonia-destinatario">
                            <span class="input-message input-message-hide" id="colonia-destinatario-msg"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="input-label" for="calle-destinatario">Calle*</label>
                        <input class="input" type="text" id="calle-destinatario" placeholder="Ingrese el domicilio del remitente">
                        <span class="input-message input-message-hide" id="calle-destinatario-msg"></span>
                    </div>
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="input-label" for="noext-destinatario">No. ext*</label>
                            <input class="input" type="text" id="noext-destinatario">
                            <span class="input-message input-message-hide" id="noext-destinatario-msg"></span>
                        </div>
                        <div class="form-group">
                            <label class="input-label" for="noint-destinatario">No. int</label>
                            <input class="input" type="text" id="noint-destinatario">
                            <span class="input-message input-message-hide" id="noint-destinatario-msg"></span>
                        </div>
                    </div>
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="input-label" for="correo-destinatario">Correo</label>
                            <input class="input" type="text" id="correo-destinatario" placeholder="example@dominio.com">
                            <span class="input-message input-message-hide" id="correo-destinatario-msg"></span>
                        </div>
                        <div class="form-group">
                            <label class="input-label" for="telefono-destinatario">Teléfono</label>
                            <input class="input" type="text" id="telefono-destinatario">
                            <span class="input-message input-message-hide" id="telefono-destinatario-msg"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="input-label" for="referencias">Referencias</label>
                        <textarea class="textarea" id="referencias" rows="3" placeholder="Breve descripción del lugar de destino..."></textarea>
                        <span class="input-message input-message-hide" id="referencias-destinatario-msg"></span>
                    </div>
                </form>
            </div>
        `
    }
}

export function getPageStepTwo() {
    const boton = document.getElementById("btn-ns-p1-siguiente");
    if (!boton) return;

    boton.disabled = true;
    let data = validateShipmentDataFields();

    if (data === false) {
        boton.disabled = false;
        return;
    }

     Object.assign(dataNewShipment, data);

    boton.removeEventListener('click', getPageStepTwo);
    boton.id = "btn-ns-p2-siguiente";
    boton.addEventListener('click', getPageStepThree);
    boton.disabled = false;

    document.getElementById("new-shupment-page-content").innerHTML = page2();
}

function page2() {
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
                            <div class="form-group">
                                <label class="input-label" for="service-package">Tipo de servicio*</label>
                                <select class="filter-selects" name="service-package" id="service-package">
                                    <option value="" disabled selected>Selecciona una opcion</option>
                                    <option value="Express">Express</option>
                                    <option value="Dia-siguiente">Dia siguiente</option>
                                    <option value="Terrestre">Terrestre</option>
                                </select>
                                <span class="input-message input-message-hide" id="service-package-msg"></span>
                            </div>
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
                            <img src="../resources/icons/dimensionesFinal.svg" alt="Caja con dimensiones">
                        </div>
                    </div>
                </form>
            </div>
            `;
}


export async function getPageStepThree() {
    const boton = document.getElementById("btn-ns-p2-siguiente");
    if (!boton) return;

    boton.disabled = true;
    let data = validatePackageDataFields();

    if (data === false) {
        boton.disabled = false;
        return;
    }

    const dataToSend = {...data, "cp_destinatario" : dataNewShipment.cp_destinatario };
    let ticketData = await getDataToGenerateTicket(dataToSend);

  Object.assign(dataNewShipment, ticketData);

    boton.removeEventListener('click', getPageStepThree);
    boton.innerHTML = "Pagar";
    boton.id = "btn-ns-p3-siguiente";
    boton.addEventListener('click', pay);
    boton.disabled = false;

    document.getElementById("new-shupment-page-content").innerHTML = page3(ticketData.ticket);
}

async function getDataToGenerateTicket(data){
    const ticket = await fetchTicket(data);
    return ticket;
}
  function page3(ticket){
      return(`
      <div class="form-card form-sender" id="form-sender">
            <div id="modal-container">${buildModal(ticket)} </div>
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
                      ${buildTicket(ticket)}
                      <tr>
                          <td>Total</td>
                          <td>${ticket.total}</td>
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


  export function pay(){
    const boton = document.getElementById("btn-ns-p3-siguiente");

    if (!boton) return;
    boton.innerHTML = "Siguiente";
    boton.id = "btn-ns-p1-siguiente";
    boton.disabled = true;
    boton.removeEventListener('click', pay);

    let datosAEnviar = dataNewShipment;
    datosAEnviar.ticket.metodo_de_pago = "Efectivo";

    showModalPayment();

    boton.disabled = false;
  }



  function buildTicket(ticket){

    let rows = "";
    
    if(ticket.conceptos_ticket){
        Object.entries(ticket.conceptos_ticket).forEach(([key, value]) => {
            const nombre = key.replace(/_/g, ' ');
            rows = rows + `<tr>
                <td>${nombre}</td>
                <td>${value}</td>
            </tr>`
        });
    }

    return rows;
  }



  function buildModal(ticket){
    return `<div class="body-modal modal-hide" id="paymentModal">
        <div id="userModal" class="modal">
            <div class="modal-content-small">
                <div class="form-group-modal">
                    <div class="head-title-modal-container -charge">
                        <h1 class="title-modal-user">COBRAR (EFECTIVO)</h1>
                    </div>                    
                </div>

                <div class="form-group-modal">

                    <div class="form-group-modal price-total-container">
                        <h1 class="price-total">$<span class="price-total">${ticket.total}</span></h1>
                    </div>

                    <div class="form-inline-modal">
                        <label class="input-label input-label-modal" for="">Paga con</label>
                        <input class="input input-modal" id="cash-input" value=${ticket.total} type="text" name="" id="" placeholder="">
                    </div>

                    <div class="form-inline-modal">
                        <label class="input-label input-label-modal" for="">Cambio</label>
                        <p class="p-cambio">$
                            <span class="span-cambio">0</span>
                        </p>
                    </div>
                </div>
                <div class="button-group-modal">
                    <button class="btnCobrar" id="btnCobrar">Cobrar</button>
                </div>
            </div>
        </div>
    </div>`
  }


  function showModalPayment(){
    const modal = document.getElementById("paymentModal");
    const botonModal = document.getElementById("btnCobrar");

    if(modal){
        if (modal.classList.contains("modal-hide")) {
            modal.classList.remove("modal-hide");
        }
    }else{
        return false;
    }

    if(botonModal){
        botonModal.addEventListener('click',createShipment);
    }else{
        return false;
    }
    return true;
  }

  function hideModalPayment(){
    const modal = document.getElementById("paymentModal");

    if(modal){
        if (!modal.classList.contains("modal-hide")) {
            modal.classList.add("modal-hide");
            return true;
        }
    }
  }

async function createShipment(){

    try{
        let dataShipment = dataNewShipment;
        dataShipment = {...dataShipment, "sucursal": localStorage.getItem("numero_sucursal"), "colaborador": localStorage.getItem("numero_personal")}
        newShipment = await fetchCreateShipment(dataShipment);

        if(newShipment === false){
            alert("Error de conexión");
            return;
        }
        
        hideModalPayment();

        const modalExito = buildModal2(newShipment);
        const parent = document.getElementById("modal-container");

        if(parent){
            parent.add(modalExito);
        }

        const boton = document.getElementById("btnTerminar");

        if(boton){
            boton.addEventListener('click', changePage("sb-bt-home"))
        }

    }catch(e){
        alert("Error de conexión")
    }
}


function buildModal2(shipment) {
    return `<div class="body-modal">
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="form-group-modal">
                <div class="head-title-modal-container">
                    <h1 class="title-modal-user">¡Envío creado correctamente!</h1>
                </div>

                <div class="form-group-modal">
                    <p class="p-subtitles">No.Folio: 
                        <span class="span-content" id="folio-dinamic">${shipment.folio}</span> 
                    </p>
                    <p class="p-subtitles">Guía: 
                        <span class="span-content" id="guia-dinamic">${shipment.guia}</span>
                    </p>
                </div>

                <div class="shipping-information-modal">
                    <div class="ship-info-modal sender-container-modal">
                        <h2 class="ship-subtitle-modal sbt-sender-modal">Remitente</h2>
                        <div class="container-p-span-info-modal">
                            <p class="ship-info-text-modal cont-sender-modal">Nombre: <span>${shipment.nombre_remitente}</span></p>
                            <p class="ship-info-text-modal cont-sender-modal">Dirección: <span>${shipment.calle_remitente} ${shipment.numero_ext_remitente}${shipment.numero_int_remitente ? `, Int ${shipment.numero_int_remitente}` : ""}, ${shipment.colonia_remitente}, ${shipment.ciudad_remitente}, ${shipment.estado_remitente}. C.P ${shipment.cp_remitente}</span></p>
                            <p class="ship-info-text-modal cont-sender-modal">Teléfono: <span>${shipment.telefono_remitente}</span></p>
                        </div>
                    </div>

                    <div class="ship-info-modal recipient-container-modal">
                        <h2 class="ship-subtitle-modal sbt-recipient-modal">Destinatario</h2>
                        <div class="container-p-span-info-modal">
                            <p class="ship-info-text-modal cont-recipient-modal">Nombre: <span>${shipment.nombre_destinatario}</span></p>
                            <p class="ship-info-text-modal cont-recipient-modal">Dirección: <span>${shipment.calle_destinatario} ${shipment.numero_ext_destinatario}${shipment.numero_int_destinatario ? `, Int ${shipment.numero_int_destinatario}` : ""}, ${shipment.colonia_destinatario}, ${shipment.ciudad_destinatario}, ${shipment.estado_destinatario}. C.P ${shipment.cp_destinatario}</span></p>
                            <p class="ship-info-text-modal cont-recipient-modal">Teléfono: <span>${shipment.telefono_destinatario}</span></p>
                        </div>
                    </div>

                    <div class="ship-info-modal package-container-modal">
                        <h2 class="ship-subtitle-modal sbt-package-modal">Paquete</h2>
                        <div class="container-p-span-info-modal">
                            <p class="ship-info-text-modal cont-package-modal">Peso: <span>${shipment.peso} kg</span></p>
                            <p class="ship-info-text-modal cont-package-modal">Dimensiones: <span>${shipment.largo} x ${shipment.ancho} x ${shipment.alto} cm</span></p>
                            <p class="ship-info-text-modal cont-package-modal">Contenido: <span>${shipment.contenido}</span></p>
                        </div>
                    </div>

                    <div class="ship-info-modal service-container-modal">
                        <h2 class="ship-subtitle-modal sbt-service-modal">Servicio</h2>
                        <div class="container-p-span-info-modal">
                            <p class="ship-info-text-modal cont-service-modal">Servicio: <span>${shipment.servicio}</span></p>
                            <p class="ship-info-text-modal cont-service-modal">Seguro: <span>${shipment.seguro === "1" ? "Sí" : "No"}</span></p>
                        </div>
                    </div>
                </div>

                <div class="form-group-modal btnTerminar-container">
                    <button class="button-modals btnTerminar" id="btnTerminar">Terminar</button>
                </div>
            </div>
        </div>
    </div>
</div>`;
}












