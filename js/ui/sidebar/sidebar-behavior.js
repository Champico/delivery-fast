import { changePage } from "../screen-manager.js";

function addFuncionalityToSideBar(){
const sidebar = document.getElementById("sidebar-menu-container");

sidebar.addEventListener('click', async function(event) {
    console.log("Dio click en ", event.target);

    const liElement = event.target.closest(".sidebar-clickeable");

    if (liElement) {
        console.log("Padre", liElement )
        await changePage(liElement.id);
    }
});
}

addFuncionalityToSideBar();

