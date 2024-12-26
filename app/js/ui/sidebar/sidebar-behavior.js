import { changePage } from "../screen-manager.js";

function addFuncionalityToSideBar(){
const sidebar = document.getElementById("sidebar-menu-container");

sidebar.addEventListener('click', async function(event) {
    const liElement = event.target.closest(".sidebar-clickeable");

    if (liElement) {
        await changePage(liElement.id);
    }
});
}

addFuncionalityToSideBar();

