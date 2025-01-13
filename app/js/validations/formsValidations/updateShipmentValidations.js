
import {validateCity, validateEmail, validateNeighborhood, validateName, validateState, validateStreet, validateTelephone, validateZipCode, validateNumExt, validateNumInt, validateHeight, validateWeigth, validateLength, validateWidth, validateDescription, validateService} from '../shipmentValidations.js';

export let errores = 0;

const keyHtmlParseSender = {
    "nombre-remitente":        "nombre_completo",
    "correo-remitente":        "correo",
    "telefono-remitente":      "telefono",
    "calle-remitente":         "calle",
    "noext-remitente":         "numero_ext",
    "noint-remitente":         "numero_int",
    "colonia-remitente":       "colonia",
    "cp-remitente":            "cp",
    "ciudad-remitente":        "ciudad",
    "referencias-remitente":   "referencias",
    "estado-remite":           "estado"
}

const keyHtmlParseRecipient = {
    "nombre-destinatario":      "nombre_completo",
    "correo-destinatario":      "correo",
    "telefono-destinatario":    "telefono",
    "calle-destinatario":       "calle",
    "noext-destinatario":       "numero_ext",
    "noint-destinatario":       "numero_int",
    "colonia-destinatario":     "colonia",
    "cp-destinatario":          "cp",
    "ciudad-destinatario":      "ciudad",
    "referencias-destinatario": "referencias",
    "estado-destinatario":      "estado"
}

export async function validateSenderDataFields(fieldsToModify, guide){
        let htmlElements = {}
        
        if(fieldsToModify["nombre"])   htmlElements["nombre-remitente"]     = document.getElementById("nombre-remitente");  
        if(fieldsToModify["cp"])       htmlElements["cp-remitente"]         = document.getElementById("cp-remitente");      
        if(fieldsToModify["estado"])   htmlElements["estado-remitente"]     = document.getElementById("estado-remitente");  
        if(fieldsToModify["ciudad"])   htmlElements["ciudad-remitente"]     = document.getElementById("ciudad-remitente");  
        if(fieldsToModify["colonia"])  htmlElements["colonia-remitente"]    = document.getElementById("colonia-remitente"); 
        if(fieldsToModify["calle"])    htmlElements["calle-remitente"]      = document.getElementById("calle-remitente");   
        if(fieldsToModify["noext"])    htmlElements["noext-remitente"]      = document.getElementById("noext-remitente");   
        if(fieldsToModify["noint"])    htmlElements["noint-remitente"]      = document.getElementById("noint-remitente");   
        if(fieldsToModify["correo"])   htmlElements["correo-remitente"]     = document.getElementById("correo-remitente");  
        if(fieldsToModify["telefono"]) htmlElements["telefono-remitente"]   = document.getElementById("telefono-remitente");

    if(Object.keys(htmlElements) === 0) return "No se modifico ningun campo";

    let values = {}

    Object.entries(htmlElements).forEach(([key, element]) => {
        values[key] = element.value || null;
        validateFieldData(key, values[key], htmlElements[key]);
    });

    console.log("Valores cambiados", values);

    if(errores === 0){
        let originalData = await getSenderData(guide);
        if(!originalData) return;

        console.log("Info original: ",originalData)
        let changes = [];

        Object.entries(values).forEach(([key, newText]) => {
            if(values[key] != originalData[keyHtmlParseSender[key]]){
                changes.push({
                    "html-key": key,
                    "data-key": keyHtmlParseSender[key],
                    "before": originalData[keyHtmlParseSender[key]],
                    "now": newText
                })
            }
        });

        console.log("Cambios", changes);

        if(changes.length === 0) return "No se modifico ningun campo";
        
        return changes;
    }
}





export function validateRecipientDataFields(){

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

    let values = {}

    Object.entries(htmlElements).forEach(([key, element]) => {
        values[key] = element.value || null;
        validateFieldData(key, values[key], htmlElements[key]);
    });

    return errores === 0 ? values : false;
}

function validateFieldData(nameField,valueField,htmlElement){
    const split = nameField.split("-");
    let idMsg = nameField + "-msg";

    switch(split[0]){
        case 'nombre':   if(manageValidationResponse(validateName(valueField),         htmlElement, idMsg)); break;
        case 'cp':       if(manageValidationResponse(validateZipCode(valueField),      htmlElement, idMsg)); break;
        case 'estado':   if(manageValidationResponse(validateState(valueField),        htmlElement, idMsg)); break;
        case 'ciudad':   if(manageValidationResponse(validateCity(valueField),         htmlElement, idMsg)); break;
        case 'colonia':  if(manageValidationResponse(validateNeighborhood(valueField), htmlElement, idMsg)); break;
        case 'calle':    if(manageValidationResponse(validateStreet(valueField),       htmlElement, idMsg)); break;
        case 'noext':    if(manageValidationResponse(validateNumExt(valueField),       htmlElement, idMsg)); break;
        case 'noint':    if(manageValidationResponse(validateNumInt(valueField),       htmlElement, idMsg)); break;
        case 'correo':   if(manageValidationResponse(validateEmail(valueField),        htmlElement, idMsg)); break;
        case 'telefono': if(manageValidationResponse(validateTelephone(valueField),    htmlElement, idMsg)); break;
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
        return true;
    }
}

function addErrorColorToInput(htmlInput){
    if(!htmlInput.classList.contains("input-error")){
        htmlInput.classList.add("input-error")
    }
}

function removeErrorColorToInput(htmlInput){
    if(htmlInput.classList.contains("input-error")){
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





async function getSenderData(guide){
    let sender;
    try{
        const module = await import("../../api/shipments.js");
        sender = await module.getInfoCustomer("remitente", guide);
    }catch(e){
        sender = {};
    }
    return sender;
}

async function getRecipientData(guide){
    let recipient;
    try{
        const module = await import("../../api/shipments.js");
        recipient = await module.getInfoCustomer("destinatario", guide);
    }catch(e){
        recipient = {};
    }
    return recipient;
}







