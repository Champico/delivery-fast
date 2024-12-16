
import { destinatario, remitente } from '../../data/newShipmentData/form_data.js';
import {validateCity, validateEmail, validateNeighborhood, validateName, validateState, validateStreet, validateTelephone, validateZipCode, validateNumExt, validateNumInt} from '../general_validations/shipment_validations.js'

export let errores = 0;

export function validateShipmentDataFields(){
    verifySenderData();
    verifyRecipientData();
}

function verifySenderData(){
    //htmls
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

    //values
    const valueElements = Object.entries(htmlElements).reduce((acc, [key, element]) =>{
        acc[key] = element ? element.value : null;
        return acc;
    },{});

    //Validación
    Object.entries(valueElements).forEach(([key, value]) => {
        validateFieldData(key, value, htmlElements[key], remitente);
    });
}

function verifyRecipientData(){
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

    //values
    const valueElements = Object.entries(htmlElements).reduce((acc, [key, element]) =>{
        acc[key] = element ? element.value : null;
        return acc;
    },{});

    //Validación
    Object.entries(valueElements).forEach(([key, value]) => {
        validateFieldData(key, value, htmlElements[key], destinatario);
    });
}

function validateFieldData(nameField,valueField,htmlElement, cliente){
    const split = nameField.split("-");
    let idMsg = nameField + "-msg";

    switch(split[0]){
        case 'nombre':   if(manageValidationResponse(validateName(valueField), htmlElement, idMsg)) cliente["nombre"]; break;
        case 'cp':       if(manageValidationResponse(validateZipCode(valueField), htmlElement, idMsg)) cliente["cp"]; break;
        case 'estado':   if(manageValidationResponse(validateState(valueField), htmlElement, idMsg)) cliente["estado"]; break;
        case 'ciudad':   if(manageValidationResponse(validateCity(valueField), htmlElement, idMsg)) cliente["ciudad"]; break;
        case 'colonia':  if(manageValidationResponse(validateNeighborhood(valueField), htmlElement, idMsg)) cliente["colonia"]; break;
        case 'calle':    if(manageValidationResponse(validateStreet(valueField), htmlElement, idMsg)) cliente["calle"]; break;
        case 'noext':    if(manageValidationResponse(validateNumExt(valueField), htmlElement, idMsg)) cliente["numeroExt"]; break;
        case 'noint':    if(manageValidationResponse(validateNumInt(valueField), htmlElement, idMsg)) cliente["numeroInt"]; break;
        case 'correo':   if(manageValidationResponse(validateEmail(valueField), htmlElement, idMsg)) cliente["correo"]; break;
        case 'telefono': if(manageValidationResponse(validateTelephone(valueField), htmlElement, idMsg)) cliente["telefono"]; break;
    }
}

//Funciones individuales
function manageValidationResponse(msg, htmlElement, idMsg){
    if(msg !== true){
        addErrorColorToInput(htmlElement);
        addErrorMessageInput(idMsg,msg);
        errores+= 1;
        return false;
    }else{
        removeErrorColorToInput(htmlElement);
        removeErrorMessageInput(idMsg);
        errores-= 1;
        return true;
    }
}

function addErrorColorToInput(htmlInput){
    if(!htmlInput.classList.contains("input-error")){
        htmlInput.classList.add("input-error")
    }
}

function removeErrorColorToInput(htmlInput){
    if(!htmlInput.classList.contains("input-error")){
        htmlInput.classList.remove("input-error")
    }
}

function addErrorMessageInput(id, message){
    const htmlMsg = document.getElementById(id);

    if(htmlMsg){
        htmlMsg.innerText = message;
        if(htmlMsg.classList.contains("input-message-hide")){
            htmlMsg.classList.remove("input-message-hide");
        }
    }
}   

function removeErrorMessageInput(id){
    const htmlMsg = document.getElementById(id);
    if(htmlMsg){
        if(!htmlMsg.classList.contains("input-message-hide")){
            htmlMsg.classList.add("input-message-hide")
        }
    }
}

