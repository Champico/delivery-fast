
chargeRouter();

async function chargeRouter(){
    try{
        await import("./router.js");
    }catch(error){
        window.href.location("http://localhost");
    }
}

