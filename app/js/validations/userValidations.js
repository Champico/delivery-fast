import {
  isOfSizeBetween,
  hasOnlyBasicCharacters,
  isIntegerOfSize,
  isValidEmail,
  isValidPhoneNumber,
  isValidCurp,
} from "./stringValidations.js";

export function validateName(name) {
  if (!name) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(name, 1, 60)) {
    return "El nombre debe tener entre 1 y 60 caracteres";
  }

  if (!hasOnlyBasicCharacters(name)) {
    return "El nombre contiene caracteres no permitidos";
  }

  return true;
}

export function validateLastName(lastName) {
  if (!lastName) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(lastName, 1, 60)) {
    return "El apellido debe tener entre 1 y 60 caracteres";
  }

  if (!hasOnlyBasicCharacters(lastName)) {
    return "El apellido contiene caracteres no permitidos";
  }

  return true;
}

export function validateSecondLastName(secondLastName) {
  if (!secondLastName) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(secondLastName, 1, 60)) {
    return "El segundo apellido debe tener entre 1 y 60 caracteres";
  }

  if (!hasOnlyBasicCharacters(secondLastName)) {
    return "El segundo apellido contiene caracteres no permitidos";
  }

  return true;
}

export function validatePersonalNumber(personalNumber) {
  if (!personalNumber) {
    return "Este campo es obligatorio";
  }

  if (!isIntegerOfSize(personalNumber, 6)) {
    return "El número personal debe tener 6 dígitos";
  }

  return true;
}

export function validateRole(role) {
  if (!role) {
    return "Este campo es obligatorio";
  }

  if (!isIntegerOfSize(role, 1)) {
    return "El rol debe ser un dígito";
  }

  return true;
}

export function validatePassword(password) {
  if (!password) {
    return "Este campo es obligatorio";
  }

  if (!isOfSizeBetween(password, 8, 25)) {
    return "La contraseña debe tener entre 8 y 25 caracteres";
  }

  if (!hasOnlyBasicCharacters(password)) {
    return "La contraseña contiene caracteres no permitidos";
  }

  if (!/[0-9]/.test(password)) {
    return "La contraseña debe contener al menos un número";
  }

  if (/(\w)\1{2,}/.test(password)) {
    return "La contraseña no puede tener más de 2 caracteres iguales seguidos";
  }

  if (/12345|password/i.test(password)) {
    return "La contraseña no puede contener patrones comunes como '12345' o 'password'";
  }

  return true;
}

export function validateEmail(email) {
    const message = isValidEmail(email);
    if (message !== true) return message;
    return true;
}

export function validatePhone(phone) {
    const message = isValidPhoneNumber(phone)
    if (message !== true) return message;
    return true;
}

export function validateCurp(curp) {
    const message = !isValidCurp(curp);
    if (message !== true) return message;
    return true;
}
