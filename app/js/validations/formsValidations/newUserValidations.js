export let errores = 0;

export const userList = [];

export function validateUserDataFields(){
    errores = 0;
    let userData = verifyUserData();
    if(!userData) return false;
    return formatShipmentData(shipmentData);
}


function verifyUserData() {
    const htmlElements = {
        name :            document.getElementById('name'),
        lastName :        document.getElementById('lastName'),
        secondLastName :  document.getElementById('secondLastName'),
        personalNumber :  document.getElementById('personalNumber'),
        role :            document.getElementById('role'),
        password :        document.getElementById('password'),
        confirmPassword : document.getElementById('confirmPassword'),
        email :           document.getElementById('email'),
        phone :           document.getElementById('phone'),
        curp :            document.getElementById('curp'),
    }

   Object.entries(htmlElements).forEach(([key, element]) => {
        values[key] = element.value || null;
        validateFieldData(key, values[key], htmlElements[key]);
    });

    if (password !== confirmPassword) {
        addErrorColorToInput(htmlElements['confirmPassword']);
        addErrorMessageInput('confirmPassword-msg', 'La contraseña no coincide');
        return;
    }

    const userData = {
        nombre:             values['name'] || "",
        apellido_paterno:   values['lastName'] || "",
        apellido_materno:   values['secondLastName'] || "",
        numero_personal:    values['personalNumber'] || "",
        rol:                values['role'] || "",
        contrasena:         values['password'] || "",
        correo:             values['email'] || "",
        telefono:           values['phone'] || "",
        curp:               values['curp'] || ""
    };

    return userData;
}

function validateFieldData(nameField, valueField, htmlElement) {
    let idMsg = nameField + "-msg";
    switch(nameField) {
        case 'name':            if(manageValidationResponse(validateName(valueField),             htmlElement, idMsg)); break;
        case 'lastName':        if(manageValidationResponse(validateLastName(valueField),         htmlElement, idMsg)); break;
        case 'secondLastName':  if(manageValidationResponse(validateSecondLastName(valueField),   htmlElement, idMsg)); break;
        case 'personalNumber':  if(manageValidationResponse(validatePersonalNumber(valueField),   htmlElement, idMsg)); break;
        case 'role':            if(manageValidationResponse(validateRole(valueField),             htmlElement, idMsg)); break;
        case 'password':        if(manageValidationResponse(validatePassword(valueField),         htmlElement, idMsg)); break;
        case 'email':           if(manageValidationResponse(validateEmail(valueField),            htmlElement, idMsg)); break;
        case 'phone':           if(manageValidationResponse(validatePhone(valueField),            htmlElement, idMsg)); break;
        case 'curp':            if(manageValidationResponse(validateCurp(valueField),             htmlElement, idMsg)); break;
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