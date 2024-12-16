export function getPageStepThree() {
  document.getElementById("new-shupment-page-content").innerHTML = page3();

  const boton = document.getElementById("btn-ns-p2-siguiente");
  if (boton) {
    boton.id = "btn-ns-p3-siguiente";
  } else {
    console.error("Error al cargar el boton");
  }

  const script_container = document.getElementById("script_container_ns");

  if (script_container) {
    const script = document.createElement("script");
    script.src = "../../js/main/newShipmentPage/script_s3.js";
    script.defer = true;
    script.type = "module";
    if (script_container.firstChild) script_container.removeChild(script_container.firstChild);
    script_container.appendChild(script);
  } else {
    console.error("No se encontro el contenedor de los scripts");
  }
}




function page3(){
    return(`
    <div class="form-card form-sender">
        <h2 class="form-title">Desglose</h2>
        <div class="table-container-shipment">
            <table class="details-shipment">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Importe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Costo Guía</td>
                        <td>$210</td>
                    </tr>
                    <tr>
                        <td>Sobrecargo</td>
                        <td>$60</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>$270</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h2 class="form-title">Método de pago</h2>
        <div class="payment-method">
            <label class="radio-label payment">
                <input class="radio-input" type="radio" name="r-payment-method" id="r-payment-method">
                Efectivo
            </label>
        </div>
    </div>`
        )
}