import { getShipmentList } from "../../api/shipmentsList.js";


export const homePage = {
  page: "",
  id_page: "",
  shipments: "",

  async create() {
    let topPage = this.getTop();
    let bottomPage = this.getBottom();
    let contentPage = await this.getTable();

    this.page = topPage + contentPage + bottomPage;

    return this.page;
  },

  load() {
    if (this.page === null) return create();
  },

  getTop() {
    return `<h1 class="title-section">Envíos</h1>
                <div class="shupment-home-content">
                    <div class="filter-container">
                        <select class="filter-selects" name="tipo" id="tipo">
                            <option value="Tipo" disabled selected>Tipo</option>
                            <option value="Express">Express</option>
                            <option value="Dia-siguiente">Dia siguiente</option>
                            <option value="Terrestre">Terrestre</option>
                        </select>
                        <select class="filter-selects" name="estatus" id="estatus">
                            <option value="Estatus" disabled selected>Estatus</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Transito">En tránsito</option>
                            <option value="Detenido">Detenido</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <select class="filter-selects" name="seguro" id="seguro">
                            <option value="Seguro" disabled selected>Seguro</option>
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                        </select>
                        <button class="btnClean">
                            <img class="filter-btnClean" src="../resources/icons/tacho-de-reciclaje.svg" alt="">
                        </button>
                    </div>`;
  },

  getBottom() {
    return `</div>
            </section>`;
  },

  async getTable() {
    const num_sucursal = localStorage.getItem("numero_sucursal");
    if (!num_sucursal) return ":,c";

    this.shipments = await getShipmentList(num_sucursal);

    if (!this.shipments)
      return `<p class="empty-data-message"> No hay envíos aún</p>`;

    let table = `<div class="table-container">
                        <table class="shipment-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" disabled></th>
                                    <th>No Folio</th>
                                    <th>Consignatario</th>
                                    <th>Estatus</th>
                                    <th>Tipo de servicio</th>
                                    <th>Ciudad destino</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>`;

    let tableRows = "";
    this.shipments.forEach((shipment) => {
      tableRows = tableRows + this.generateTableRow(shipment);
    });
    table = table + tableRows;

    table =
      table +
      `</tbody>
                        </table>
                    </div>
                    `;

    return table;
  },
  generateTableRow(data) {
    if (!data) return;

    const guia = data.guia || "";
    const folio = data.folio || "";
    const servicio = data.servicio || "";
    const destinatario = data.destinatario || "";
    const ciudad_destino = data.ciudad_destino || "";
    const estado_destino = data.estado_destino || "";
    const estatus = data.estatus || "";
    const numero_sucursal = data.numero_sucursal || "";

    return `<tr>
                        <td><input type="checkbox">
                        <td>${folio}</td>
                        <td>${destinatario}</td>
                        <td>${estatus}</td>
                        <td>${servicio}</td>
                        <td>${ciudad_destino}</td>
                        <td>
                            <button class="btnClean">
                                <img class=filter-btnClean src="../resources/icons/tacho-de-reciclaje.svg" alt="eliminar">
                            </button>
                        </td>
                    </tr>`;
  },
};
