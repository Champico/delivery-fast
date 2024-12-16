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
  if (isNaN(min_character) || isNaN(max_character))
    throw new Error("min_character and max_character must be int");
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

// ________________________________________________________________________________________
//
//    F U N C I O N E S  P A R A  A N A L I Z A R  C A D E N A S  C L A S I C A S
// ________________________________________________________________________________________

//Devuelve verdadero si una cadena tiene un numero de caracteres dentro de un rango definido
export function isOfSizeBetween(string, min_character, max_character) {
  if (!string) return false;
  if (isNaN(min_character) || isNaN(max_character))
    throw new Error("min_character and max_character must be int");
  return string.length >= min_character && string.length <= max_character;
}

//Devuelve verdadero si una cadena tiene solo letras (incluidas las del español) o numeros
export function hasOnlyBasicCharacters(string) {
  if (!string) return false;
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  return regex.test(string);
}
