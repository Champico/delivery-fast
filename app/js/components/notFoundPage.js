export async function getPage(){
    return `
        <div id="container-not-found-message">
            <div id="not-found-message">
                <img src="./resources/icons/not-found-page.svg" alt="Página no encontrada"></img>
                <p>La página que estás buscando no existe</p>
            </div>
        </div>`
    ;
}