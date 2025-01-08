export function showLoadingScreen(){
    const container = document.getElementById("loading-container");

    if(container.childElementCount === 0){
        const screen = (`<div class="loading-screen"><div class="loading"></div><img src="/app/resources/brand/isotipo/isotipo.svg" alt="Cargando" class="image-loader"></div>`);
        container.innerHTML = screen;
    }
}

export function hideLoadingScreen(){
    const container = document.getElementById("loading-container");

    if(container.childElementCount > 0){
        container.innerHTML = "";
    }
}
