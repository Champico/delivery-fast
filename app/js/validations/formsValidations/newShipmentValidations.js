
import {validateCity, validateEmail, validateNeighborhood, validateName, validateState, validateStreet, validateTelephone, validateZipCode, validateNumExt, validateNumInt, validateHeight, validateWeigth, validateLength, validateWidth, validateDescription, validateService} from '../shipmentValidations.js';

export let errores = 0;

export const shipmentsList = [];

export function validateShipmentDataFields(){
    errores = 0;
    let sender = verifySenderData();
    let recipient = verifyRecipientData();
    if(!sender || !recipient) return false;
    let shipmentData = {};
    shipmentData = {...shipmentData, ...sender, ...recipient};
    return formatShipmentData(shipmentData);
}

function verifySenderData(){
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

    let values = {}

    Object.entries(htmlElements).forEach(([key, element]) => {
        values[key] = element.value || null;
        validateFieldData(key, values[key], htmlElements[key]);
    });

    return errores === 0 ? values : false;
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



















export function validatePackageDataFields(){

    errores = 0;

    const htmlElements = {
        "peso-package":     document.getElementById("peso-package"),
        "largo-package":    document.getElementById("largo-package"),
        "ancho-package":    document.getElementById("ancho-package"),
        "alto-package":     document.getElementById("alto-package"),
        "service-package":  document.getElementById("service-package"),
        "security-package": document.getElementById("security-package"),
        "new-observation":  document.getElementById("new-observation")
    };

    const valueElements = {
        "peso-package":     htmlElements['peso-package'].value,
        "largo-package":    htmlElements["largo-package"].value,
        "ancho-package":    htmlElements["ancho-package"].value,
        "alto-package":     htmlElements["alto-package"].value,
        "service-package":  htmlElements["service-package"].value,
        "security-package": htmlElements["security-package"].checked,
        "new-observation":  htmlElements["new-observation"].value
    };

    let valueElementsCorrect = {};

    //Validación
    Object.entries(valueElements).forEach(([key, value]) => {
        valueElementsCorrect[key] = validateFieldDataPackage(key, value, htmlElements[key]);
    });

    return errores === 0 ? formatPackageData(valueElementsCorrect) : false;
}

function validateFieldDataPackage(nameField,valueField,htmlElement){
    const split = nameField.split("-");
    let idMsg = nameField + "-msg";

    let data = "";

    switch(split[0]){
        case 'peso':    if(manageValidationResponse(validateWeigth(valueField), htmlElement, idMsg))       data = Number(valueField); break;
        case 'largo':   if(manageValidationResponse(validateLength(valueField), htmlElement, idMsg));      data = Number(valueField); break;
        case 'ancho':   if(manageValidationResponse(validateWidth(valueField), htmlElement, idMsg));       data = Number(valueField); break;
        case 'alto':    if(manageValidationResponse(validateHeight(valueField), htmlElement, idMsg));      data = Number(valueField); break;
        case 'service': if(manageValidationResponse(validateService(valueField), htmlElement, idMsg));     data = valueField; break;
        case 'new':     if(manageValidationResponse(validateDescription(valueField), htmlElement, idMsg)); data = valueField; break;
        case 'security': data = valueField; break;
      }
      
      return data;
}


function formatPackageData(data){

    return {
        "sucursal":  data["sucursal"] || "",
        "peso":      data["peso-package"] || "",
        "largo":     data["largo-package"] || "",
        "ancho":     data["ancho-package"] || "",
        "alto":      data["alto-package"] || "",
        "costo":     0.0,
        "seguro":    data["security-package"] || false,
        "servicio":  data["service-package"] || "",
        "contenido": data["new-observation"] || ""
    }
  }


  function formatShipmentData(data){
    return {
        // Remitente
        nombre_remitente: data["nombre-remitente"] || "",
        correo_remitente: data["correo-remitente"] || "",
        telefono_remitente: data["telefono-remitente"] || "",
        calle_remitente: data["calle-remitente"] || "",
        numeroExt_remitente: data["noext-remitente"] || "",
        numeroInt_remitente: data["noint-remitente"] || "",
        colonia_remitente: data["colonia-remitente"] || "",
        cp_remitente: data["cp-remitente"] || "",
        ciudad_remitente: data["ciudad-remitente"] || "",
        referencias_remitente: data["referencias-remitente"] || "",
        estado_remitente: data["estado-remitente"] || "",

        // Destinatario
        nombre_destinatario: data["nombre-destinatario"] || "",
        correo_destinatario: data["correo-destinatario"] || "",
        telefono_destinatario: data["telefono-destinatario"] || "",
        calle_destinatario: data["calle-destinatario"] || "",
        numeroExt_destinatario: data["noext-destinatario"] || "",
        numeroInt_destinatario: data["noint-destinatario"] || "",
        colonia_destinatario: data["colonia-destinatario"] || "",
        cp_destinatario: data["cp-destinatario"] || "",
        ciudad_destinatario: data["ciudad-destinatario"] || "",
        referencias_destinatario: data["referencias-destinatario"] || "",
        estado_destinatario: data["estado-destinatario"] || "",
    };
}
