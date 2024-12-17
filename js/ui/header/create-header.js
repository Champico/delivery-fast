function createHeader() {
    const header_base = (`
      <nav class="nav-menu">
          <img class="menu-icon" src="../resources/icons/menu.svg" alt="Menu Icon Header">
      </nav>
      <div class="container-logo">
          <img class="logo-extendido" src="../resources/brand/logotipo/logotipo-extendido.svg" alt="Delivery Fast Logo Header">
      </div>
      <div class="user-info-container">
          <h1 class="user-rol">${localStorage.getItem("nombre")}</h1>
          <img class="user-logo" src="../resources/icons/perfil-icon.svg" alt="Profile Picture">
      </div>`);
  
      document.getElementById("header").innerHTML = header_base;
  }
  
  createHeader();