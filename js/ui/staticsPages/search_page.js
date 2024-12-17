const page = {
    page : "",
    id_page : "",

    create(){
        if(page !== null) return load();

        page = `<div class="shupment-home-guide-view">
                <div class="guide-input-container">
                    <h2 class="guide-title">Ingrese Guía o Folio</h2>
                    <div class="form-group">
                        <input type="text" class="guide-input" placeholder="123456789 ...">
                        <button class="button guide-button">Buscar</button>
                    </div>
                </div>                
            </div>`

        return page;
    },
    
    load(){
        if(page === null) return create();
    }
}



