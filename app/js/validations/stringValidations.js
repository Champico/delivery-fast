//  delivery-fast/js/utils/stringValidations.js

// ________________________________________________________________________________________
//
//    F U N C I O N E S  P A R A  A N A L I Z A R  C A D E N A S  C O N  N U M E R O S
// ________________________________________________________________________________________

//Devuelve verdadero si una cadena es un numero
export function isNumber(string) {
  if (!string) return false;
  return !isNaN(Number(string)) && string !== "";
}

//Devuelve verdadero si una cadena es un numero entero
export function isInteger(string) {
  if (!string) return false;
  const num = Number(string);
  return !isNaN(num) && Number.isInteger(num) && string !== "";
}

//Devuelve verdadero si una cadena es un numero flotante
export function isFloat(string) {
  if (!string) return false;
  const num = parseFloat(string);
  return !isNaN(num) && num !== Math.floor(num) && string !== "";
}

//Devuelve verdadero si una cadena es un numero entero y tiene un numero de caracteres dentro de un rango definido
export function isIntegerOfSizeBetween(string, min_character, max_character) {
  if (!string) return false;
  if (isNaN(min_character) || isNaN(max_character)) return false;
  return (
    isInteger(string) &&
    string.length >= min_character &&
    string.length <= max_character
  );
}

//Devuelve verdadero si una cadena es un numero entero y tiene un numero de caracteres exacto
export function isIntegerOfSize(string, characters_length) {
  if (!string) return false;
  if (isNaN(characters_length)) throw new Error("characters_length must be int");
  return isInteger(string) && string.length === characters_length;
}

//Devuelve verdadero si un numero flotante esta entre un rango definido
export function isFloatValueBetween(numero, min, max){
  if (!numero) return false;
  if (isNaN(min) || isNaN(max)) return false;
  let floatValue = parseFloat(numero);
  if (isNaN(floatValue)) return false;
  return numero >= min && numero <= max;
}




// ________________________________________________________________________________________
//
//    F U N C I O N E S  P A R A  A N A L I Z A R  C A D E N A S  C L A S I C A S
// ________________________________________________________________________________________

//Devuelve verdadero si una cadena tiene un numero de caracteres dentro de un rango definido
export function isOfSizeBetween(string, min_character, max_character) {
  if (!string) return false;
  if (isNaN(min_character) || isNaN(max_character)) return false;
  return string.length >= min_character && string.length <= max_character;
}

//Devuelve verdadero si una cadena tiene solo letras (incluidas las del español) o numeros
export function hasOnlyBasicCharacters(string) {
  if (!string) return false;
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  return regex.test(string);
}






// ________________________________________________________________________________________
//
//    F U N C I O N E S  P A R A  A N A L I Z A R  C A D E N A S  C O M P L E J A S
// ________________________________________________________________________________________



export function isValidEmail(email) {
  if (!email) return "Este campo es obligatorio";
  if(email.length > 255) return "El correo no puede tener más de 100 caracteres";
  const charactersValidPattern =  /^[a-zA-Z0-9._@-]+$/;
  if (!charactersValidPattern.test(email)) return "El correo contiene caracteres no permitidos, se permiten letras(a-z), números, puntos y guiones";
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
  if (!emailPattern.test(email)) return "El correo no es válido";
  if (email.startsWith("_")) return "El correo no puede empezar con guion bajo";
  if (email.startsWith("_")) return "El correo no puede empezar con guion";
  if (email.startsWith(".")) return "El correo no puede empezar con guion punto";
  if(/\d/.test(email.charAt(0))) return "El correo no puede empezar con números";
  if (email.includes("..")) return "El correo no puede tener dos puntos consecutivos";
  if (email.includes("--")) return "El correo no puede tener dos guiones medios consecutivos";
  if (email.includes("__")) return "El correo no puede tener dos guiones consecutivos";
  const threeSameCharacters= /(.)\1\1/;
  if(threeSameCharacters.test(cadena)) return "El correo no puede tener más de 2 caracteres iguales seguidos";
  const domain = email.split("@")[1];
  if (domain && (domain.includes("_") || domain.includes("-"))) return "El correo no puede tener guion en el dominio";
  return true;
}


export function isValidCurp(curp) {
  if (!curp) return "Este campo es obligatorio";
  if(curp.length !== 18) return "El CURP debe tener 18 caracteres";
  const curpPattern = /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z]{2}\d{2}[A-Z]{1}$/;
  if (!curpPattern.test(curp)) return "El CURP no es válido";
  return true;
}

export function isValidPhoneNumber(phone) {
  if (!phone) return "Este campo es obligatorio";
  const phonePattern = /^(\+?\d{10,13})$/;
  if (!phonePattern.test(phone)) return "El número de teléfono no es válido";
  return true;
}
