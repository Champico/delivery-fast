import { fetchStates } from "../../api/states.js";

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