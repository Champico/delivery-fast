
export let shipments = "";

let searchParams = {};

export async function getPage() {
  cleanParams();
  return await getHtmlPage();
}

export async function addFunctionality(){
    addFunctionalityToRows();
    addFunctionalityToFilters();
    return true;
}

function addFunctionalityToRows(){
    const shipmentTable = document.getElementById("shipment-table");
    if(!shipmentTable) return;

    const rows = shipmentTable.querySelectorAll('tr');
    if(!rows) return;
    
    rows.forEach(row =>{
            row.addEventListener('click', async () => {
                removeFunctionalityToRows();
                await openShipment(row.getAttribute('guide'))
            }
        );
    });
}


function addFunctionalityToFilters(){
    const serviceFilter = document.getElementById("filter-tipo");
    const statusFilter = document.getElementById("filter-estatus");
    const insureFilter = document.getElementById("filter-seguro");

    serviceFilter.addEventListener('change', async ()=>{
        searchParams['servicio'] = serviceFilter.value;
        removeFunctionalityToRows();
        if(!serviceFilter.classList.contains("filter-selects-selected")) serviceFilter.classList.add("filter-selects-selected");
        await reloadShipmentsTable();
    })

    statusFilter.addEventListener('change', async () =>{
        searchParams['estatus'] = statusFilter.value;
        removeFunctionalityToRows();
        if(!statusFilter.classList.contains("filter-selects-selected")) statusFilter.classList.add("filter-selects-selected");
        await reloadShipmentsTable();
    })

    insureFilter.addEventListener('change', async () => {
        searchParams['insure'] = insureFilter.value;
        removeFunctionalityToRows();
        if(!insureFilter.classList.contains("filter-selects-selected")) insureFilter.classList.add("filter-selects-selected");
        await reloadShipmentsTable();
    }) 

}











/*
======================================================================================
    S E C C I O N  D E  F U N C I O N E S  D E  L O G I C A  D E  N E G O C I O 
======================================================================================
*/

function cleanParams(){
    searchParams = [];
    searchParams['numero_sucursal'] = localStorage.getItem("numero_sucursal");
    searchParams["limite_min"] = 1;
    searchParams["limite_max"] = 20
    searchParams["orden"] = "desc";
}

async function openShipment(shipmentGuide){
  try{
      const module = await import("../router.js");
      module.navigateTo(`/app/shipment/${shipmentGuide}`);
  }catch(error){
      return;
  }
}

function removeFunctionalityToRows(){
  const shipmentTable = document.getElementById("shipment-table");
  if(!shipmentTable) return;
  
  const rows = shipmentTable.querySelectorAll('tr');
  if(!rows) return;
  
  rows.forEach(row =>{
          row.removeEventListener('click', () => {
              openShipment(row.getAttribute('guide'))
          }
      );
  });
}


async function reloadShipmentsTable(){
    const table = document.getElementById("body-table-shipments");
    if(!table) return;
    table.innerHTML = "";

    let shipments = null;
    try{
        const module = await import('../api/shipments.js');
        shipments = await module.getAllShipmentsWithParams(searchParams);
    }catch(e){}

    if(Array.isArray(shipments) && shipments.length > 0){
        let tableRows = "";
        shipments.forEach((shipment) => {
            tableRows = tableRows + generateTableRow(shipment);
        });
        table.innerHTML = tableRows;
    }


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
    let servicesSelectOptions = `<select class="filter-selects" name="tipo" id="filter-tipo"> <option value="Tipo" disabled selected>Tipo</option>`

    services.forEach(service => {
      servicesSelectOptions = servicesSelectOptions +`<option value="${service}">${service.replace(/_/g, ' ')}</option>`;
    });

    servicesSelectOptions += `</select>`
    return servicesSelectOptions;
}

function getStatusFilter(status){

  let statusSelectOptions = `<select class="filter-selects" name="estatus" id="filter-estatus">  <option value="Estatus" disabled selected>Estatus</option>`

    status.forEach(status => {
        statusSelectOptions = statusSelectOptions +`<option value="${status}">${status.replace(/_/g, ' ')}</option>`;
    });

    statusSelectOptions += `</select>`;

    return statusSelectOptions;
}

function getInsureFilter(){
    return `
        <select class="filter-selects" name="seguro" id="filter-seguro">
            <option value="Seguro" disabled selected>Seguro</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
        </select>`
}

function getPeriodFilter(){
return `<div class="dropdown">
      <button class="dropdown-button">Fecha de creación</button>
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
  if (!searchParams['numero_sucursal']) return;

  try{
    const module = await import('../api/shipments.js');
    shipments = await module.getAllShipmentsWithParams(searchParams);
  }catch(e){}

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
                    <tbody id="body-table-shipments">`;

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
