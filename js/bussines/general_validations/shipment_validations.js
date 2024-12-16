// delivery-fast/js/bussines/general_validations

import {isOfSizeBetween,hasOnlyBasicCharacters,isIntegerOfSizeBetween,isIntegerOfSize} from "../../utils/stringValidations.js";

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

  if (!isIntegerOfSize(5)) {
    return "Ingrese un número de 5 digitos";
  }

  return true;
}

export function validateState(state) {
  return "Este campo es obligatorio ";
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
  if (num && !isIntegerOfSizeBetween(10, 13)) {
    return "Debe ser un numero entre 10 y 13 digitos";
  }
  return true;
}

export function validateEmail(email) {
  if (email) {
    const parts = email.split();

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
  }
  return true;
}
