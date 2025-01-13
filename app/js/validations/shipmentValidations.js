// delivery-fast/js/bussines/general_validations

import {isOfSizeBetween,hasOnlyBasicCharacters,isIntegerOfSizeBetween,isIntegerOfSize, isInteger, isNumber, isFloatValueBetween, isValidEmail} from "./stringValidations.js";


export function validateGuide(guide){
    if (!guide) {
      return "Este campo es obligatorio";
    }

    if(!isNumber(guide)){
      return "La guía debe ser un número";
    }

    if(!isIntegerOfSize(guide, 15)){
      return "La guía debe tener 15 digitos"
    }

    return true;
}

export function validateName(name) {
  if (!name) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(name, 4, 255)) {
    return "El nombre debe tener entre 4 y 255 caracteres";
  }

  if (!hasOnlyBasicCharacters(name)) {
    return "No se permiten caracteres especiales";
  }

  return true;
}

export function validateZipCode(cp) {
  if (!cp) {
    return "Este campo es obligatorio";
  }

  if (!isIntegerOfSize(cp,5)) {
    return "Ingrese un número de 5 digitos";
  }

  return true;
}

export function validateState(state) {
  if(!state){
    return "Seleccione una opción";
  }

  if(!isIntegerOfSizeBetween(state,1,2)){
    return "Seleccione una opción";
  }

  return true;
}

export function validateCity(city) {
  if (!city) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(city, 1, 50)) {
    return "Máximo 50 caracteres";
  }

  return true;
}

export function validateStreet(street) {
  if (!street) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(street, 1, 50)) {
    return "Máximo 50 caracteres";
  }

  return true;
}

export function validateNeighborhood(neighborhood) {
  if (!neighborhood) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(neighborhood, 1, 50)) {
    return "Máximo 50 caracteres";
  }

  return true;
}

export function validateNumExt(num) {
  if (!num) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(num, 1, 10)) {
    return "Maximo 10 caracteres";
  }

  return true;
}

export function validateNumInt(num) {
  if (num && !isOfSizeBetween(num, 1, 10)) {
    return "Maximo 10 caracteres";
  }
  return true;
}

export function validateTelephone(num) {
  if (num && !isIntegerOfSizeBetween(num, 10, 13)) {
    return "Debe ser un numero entre 10 y 13 digitos";
  }
  return true;
}

export function validateEmail(email) {
  if (email) {
    if(!isValidEmail(email)){
      return "No es un email valido";
    }

    /*const parts = email.split();

    if (parts.length !== 2) {
      return "Formato de correo no válido";
    }

    if (email[0] === ".") {
      return "El correo no puede empezar con punto (.)";
    }

    if (email.includes("..")) {
      return "No puede haber dos puntos consecutivos (..)";
    }

    const regexUsuario = /^[a-zA-Z][a-zA-Z0-9.]{5,29}(?!.*\.\.)$/;
    if (!regexUsuario.test(parts[0])) {
      return "El nombre de usuario puede contener letras, números y punto(.)";
    }

    const regexDominio = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]{2,}$/;
    if (!regexDominio.test(parts[1])) {
      return "El dominio del correo no es válido";
    }
  }*/
  }
  return true;
}



export function validateWeigth(num){
  if (!num) {
    return "Este campo es obligatorio";
  }
  
  if(!isNumber(num)){
    return "Ingresa sólo numeros";
  }

  if(!isFloatValueBetween(num,0,69)){
    return "Máximo 69kg";
  }

  return true;
}


export function validateWidth(num){
  if (!num) {
    return "Este campo es obligatorio";
  }

  if(!isNumber(num)){
    return "Ingresa sólo numeros";
  }

  if(!isFloatValueBetween(num,0,200)){
    return "Ancho máximo de 200cm";
  }

  return true;
}


export function validateLength(num){
  if (!num) {
    return "Este campo es obligatorio";
  }

  if(!isNumber(num)){
    return "Ingresa sólo numeros";
  }

  if(!isFloatValueBetween(num,0,200)){
    return "Largo máximo de 200cm";
  }

  return true;
}


export function validateHeight(num){
  if (!num) {
    return "Este campo es obligatorio";
  }

  if(!isNumber(num)){
    return "Ingresa sólo numeros";
  }

  if(!isFloatValueBetween(num,0,150)){
    return "Alto máximo de 150cm";
  }

  return true;
}

export function validateDescription(text){
  if(!text) return true

  if(!hasOnlyBasicCharacters(text)){
    return "Ingresa sólo letras y números";
  }

  if(text.length > 255){
    return "Máximo 255 caracteres";
  }

  return true;
}

export function validateService(text){
  if(!text){
    return "Selecciona una opción"
  }

  return true;
}