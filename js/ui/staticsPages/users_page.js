const page = {
    page : {},
    id_page : "",

    create(){
        if(page !== null) return load();
    },
    
    load(){
        if(page === null) return create();
    }
}


