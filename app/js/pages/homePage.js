
export let shipments = "";

let searchParams = {};

export async function getPage() {
  return await getHtmlPage();
}

export async function addFunctionality(){
    addFunctionalityToRows();
    return true;
}

function addFunctionalityToRows(){
    const shipmentTable = document.getElementById("shipment-table");
    const rows = shipmentTable.querySelectorAll('tr');
    rows.forEach(row =>{
            row.addEventListener('click', () => {
                openShipment(row.getAttribute('guide'))
            }
        );
    });
}












/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  D E  L O G I C A  D E  N E G O C I O 
======================================================================================
*/


async function openShipment(shipmentGuide){
  try{
      const module = await import("../router.js");
      module.navigateTo(`/app/shipment/${shipmentGuide}`);
  }catch(error){
      return;
  }
}

async function reloadShipmentsTable(){

}


















/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  H T M L 
======================================================================================
*/


async function getHtmlPage() {
  return `
        <h1 class="title-section">Envíos</h1> <div class="shupment-home-content">
            ${await getControlPanel()}
            ${await getTable()}
        </div> </section>`;
}

async function getControlPanel() {
    let services = [];
    let status = [];

    try{
        const module = await import('../api/utils.js')
        services = await module.fetchServices();
        status = await module.fetchStatus();
    }catch(error){}

    return `
          <div class="filter-container">
              ${getServicesFilter(services)}
              ${getStatusFilter(status)}
              ${getInsureFilter()}
              ${getPeriodFilter()}
          </div>`;
} 

function getServicesFilter(services){
    let servicesSelectOptions = `<select class="filter-selects" name="tipo" id="tipo"> <option value="Tipo" disabled selected>Tipo</option>`

    services.forEach(service => {
      servicesSelectOptions = servicesSelectOptions +`<option value="${service}">${service}</option>`;
    });

    servicesSelectOptions += `</select>`
    return servicesSelectOptions;
}

function getStatusFilter(status){

  let statusSelectOptions = `<select class="filter-selects" name="estatus" id="estatus">  <option value="Estatus" disabled selected>Estatus</option>`

    status.forEach(status => {
        statusSelectOptions = statusSelectOptions +`<option value="${status}">${status.replace(/_/g, ' ')}</option>`;
    });

    statusSelectOptions += `</select>`;

    return statusSelectOptions;
}

function getInsureFilter(){
    return `
        <select class="filter-selects" name="seguro" id="seguro">
            <option value="Seguro" disabled selected>Seguro</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
        </select>`
}

function getPeriodFilter(){
return `<div class="dropdown">
      <button class="dropdown-button">Modificado</button>
      <div class="dropdown-content">
        <ul>
          <li>Hoy</li>
          <li>Últimos 7 días</li>
          <li>Últimos 30 días</li>
          <li>Este año (2025)</li>
          <li>El año pasado (2024)</li>
          <li class="dd-custom-period">
            <span>Período personalizado</span>
            <div class="dd-custom-period-panel">
              <label>
                Después del:
                <input type="date" />
              </label>
              <label>
                Antes del:
                <input type="date" />
              </label>
              <div class="dd-buttons">
                <button class="dd-cancel-button">Cancelar</button>
                <button class="dd-apply-button">Aplicar</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>`
}

async function getTable() {
  searchParams['numero_sucursal'] = localStorage.getItem("numero_sucursal");
  if (!searchParams['numero_sucursal']) return;

  searchParams["limite_min"] = 1;
  searchParams["limite_max"] = 20
  searchParams["orden"] = "desc";
  
  try{
    const module = await import('../api/shipments.js');
    shipments = await module.getAllShipmentsWithParams(searchParams);
  }catch(e){
    console.log(e.message)
  }

  let table = `<div class="table-container">
                <table id="shipment-table">
                    <thead>
                        <tr>
                            <th>No Folio</th>
                            <th>Consignatario</th>
                            <th>Estatus</th>
                            <th>Tipo de servicio</th>
                            <th>Ciudad destino</th>
                        </tr>
                    </thead>
                    <tbody>`;

  if(Array.isArray(shipments) && shipments.length > 0){
      let tableRows = "";

      shipments.forEach((shipment) => {
        tableRows = tableRows + generateTableRow(shipment);
      });
      table = table + tableRows;
  }

  table += `</tbody> </table> </div>`;

  return table;
}

function generateTableRow(data) {
  if (!data) return;

  const guia = data.guia || "";
  const folio = data.folio || "";
  const servicio = data.servicio || "";
  const destinatario = data.destinatario || "";
  const ciudad_destino = data.ciudad_destino || "";
  const estado_destino = data.estado_destino || "";
  const estatus = data.estatus || "";
  const numero_sucursal = data.numero_sucursal || "";

  return `<tr class="shipment-row" guide="${guia}">
            <td>${folio}</td>
            <td>${destinatario}</td>
            <td>${estatus}</td>
            <td>${servicio}</td>
            <td>${ciudad_destino}</td>
        </tr>`;
}
