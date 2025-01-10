
await verifySession();

async function verifySession(){
    try{
        const module = await import("../js/api/authSessions.js");
        const success = await module.status();
        if(success === true){
            await chargeRouter();
        }else{
            window.location.href = "http://localhost/login";
        }
    }catch(error){
        alert("Ocurrio un error al obtener la página", err);
        window.location.href = "http://localhost";
    }
}

async function chargeRouter(){
    try{
        await import("./router.js");
    }catch(error){
        alert("Ocurrio un error al obtener la página", err);
        window.location.href = "http://localhost";
    }
}

