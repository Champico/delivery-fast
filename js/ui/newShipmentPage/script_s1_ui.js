import {
    errores,
    validateShipmentDataFields,
} from "../../bussines/newShipmentPage/script_s1_validations.js";

export function getPageStepTwo() {
    const boton = document.getElementById("btn-ns-p1-siguiente");
    if (!boton) return;

    boton.disabled = true;
    validateShipmentDataFields();
    console.log("Hay este numero de errore", errores);

    if (errores > 0) {
        boton.disabled = false;
        return;
    }

    console.log("Por que llega a este punto ?");

    document.getElementById("new-shupment-page-content").innerHTML = page2();

    boton.disabled = false;
    boton.id = "btn-ns-p2-siguiente";

    const script_container = document.getElementById("script_container_ns");

    if (script_container) {
        const script = document.createElement("script");
        script.src = "../../js/main/newShipmentPage/script_s2.js";
        script.defer = true;
        script.type = "module";
        if (script_container.firstChild)
            script_container.removeChild(script_container.firstChild);
        script_container.appendChild(script);
    } else {
        console.error("No se encontro el contenedor de los scripts");
    }
}

function page2() {
    return ` 
            <div class="form-card form-sender">
                <h2 class="form-title">Datos del paquete</h2>
                <form class="form">
                    <div class="form-inline">
                        <div class="form-group">
        
                            <div class="form-inline">
                                <div class="form-group">
                                    <label class="input-label" for="peso-package">Peso*</label>
                                    <input class="input" type="text" id="peso-package" placeholder="Kg">
                                </div>
                                <div class="form-group">
                                    <label class="input-label" for="largo-package">Largo*</label>
                                    <input class="input" type="text" id="largo-package" placeholder="Cm">
                                </div>
                                <div class="form-group">
                                    <label class="input-label" for="ancho-package">Ancho*</label>
                                    <input class="input" type="text" id="ancho-package" placeholder="Cm">
                                </div>
                                <div class="form-group">
                                    <label class="input-label" for="alto-package">Alto*</label>
                                    <input class="input" type="text" id="alto-package" placeholder="Cm">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="service-package">Tipo de servicio</label>
                                <select class="filter-selects" name="service-package" id="service-package">
                                    <option value="Tipo" disabled selected>Selecciona una opcion</option>
                                    <option value="Express">Express</option>
                                    <option value="Dia-siguiente">Dia siguiente</option>
                                    <option value="Terrestre">Terrestre</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="input-label" for="security-package">Seguro de paquete</label>
                                <label class="switch">
                                    <input class="input" type="checkbox" id="security-package">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="input-label label-new-info-status" for="new-observation">Contenido</label>
                                <textarea class="textarea txta-input-new-notes" id="new-observation" placeholder="Describa brevemente el contenido del paquete..."></textarea>
                            </div>                          
                        </div>
                        <div class="form-group">
                            <img src="../../resources/icons/dimensionesFinal.svg" alt="Caja con dimensiones">
                        </div>
                    </div>
                </form>
            </div>
            `;
}
