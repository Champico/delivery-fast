export const searchPage = {
    page : "",
    id_btn : "",

    create(){
        this.page = `<div class="shupment-home-guide-view">
                <div class="guide-input-container">
                    <h2 class="guide-title">Ingrese Guía o Folio</h2>
                    <div class="form-group">
                        <input type="text" class="guide-input" placeholder="123456789 ...">
                        <button class="button guide-button">Buscar</button>
                    </div>
                </div>                
            </div>`

        return this.page;
    },
}



