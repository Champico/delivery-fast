
import { getPageStepTwo } from "./new-shipment-behavior.js";

export let dataNewShipment = {};

export function addFirstScriptNewShipment(){
    document.getElementById("btn-ns-p1-siguiente").addEventListener('click', getPageStepTwo);
}
