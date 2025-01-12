export async function getPage(){
    return await getHtmlPage();
}

export async function addFunctionality(){
    console.log('Branch Page Functionality');
    return true;
}






async function getHtmlPage(){
    let branch = null;
    const numero_sucursal = localStorage.getItem("numero_sucursal");

    if(!numero_sucursal) return "<h1> Not found </h1>";

    try{
        const module = await import('../api/branch.js');
        branch = await module.fetchBranchInfo(numero_sucursal);
    }catch(e){
        console.log(e)
    }

    console.log(branch);

    return `
    <h1 class="title-section">Branch</h1>
    <div class="shupment-home-content">
        <div class="form-group branch-container">
            <div class="form-group">
                <h2 class="title-branch">Sucursal N° ${branch.numero_sucursal || ""}</h2>
            </div>
            <div class="form-group">
                <div class="form-group">
                    <h3 class="subtitle-branch">Datos</h3>
                </div>
                <form action="" class="branch-form">   
                    <div class="form-group">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchPostalCode">Codigo Postal*</label>
                                <input class="input" type="text" id="branchPostalCode" value="${branch.cp || ""}" placeholder="Codigo Postal de la sucursal"> 
                            </div>
                            
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchCity">Ciudad*</label>
                                <input class="input" type="text" id="branchPostalCity" value="${branch.ciudad || ""}" placeholder="Ciudad de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchColony">Colonia*</label>
                                <input class="input" type="text" id="branchColony" value="${branch.colonia || ""}" placeholder="Colonia de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchState">Estado*</label>
                                <input class="input" type="text" id="branchState" value="${branch.estado || ""}" placeholder="Estado de la sucursal"> 
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchStreet">Calle*</label>
                                <input class="input" type="text" id="branchStreet" value="${branch.calle || ""}" placeholder="Calle de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchNumExt">N° Ext*</label>
                                        <input class="input" type="text" id="branchNumExt" value="${branch.numero_ext || ""}" placeholder="N° Ext de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchNumInt">N° Int*</label>
                                        <input class="input" type="text" id="branchNumInt" value="${branch.numero_int || ''}" placeholder="N° Int de la sucursal"> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchLatitude">Latitud*</label>
                                <input class="input" type="text" id="branchLatitude" value="${branch.latitud_dec || ""}" placeholder="Latitud de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchLongitude">Longitud*</label>
                                <input class="input" type="text" id="branchLongitude" value="${branch.longitud_dec || ""}" placeholder="Longitud de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchTimeToOut">Hora Salida Diaria*</label>
                                <input class="input" type="text" id="branchTimeToOut" value="${branch.hora_salida_diaria || ""}" placeholder="Hora de salida diaria de la sucursal"> 
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchEmail">Correo*</label>
                                <input class="input" type="email" id="branchEmail" value="${branch.correo || ""}" placeholder="Correo de la sucursal"> 
                            </div>
                            <div class="form-group">
                                <label class="input-label about-titles-labels" for="branchPhone">Telefono*</label>
                                <input class="input" type="text" id="branchPhone" value="${branch.telefono || ""}" placeholder="Telefono de la sucursal"> 
                            </div>                                       
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="button">Modificar</button>
                    </div>                         
                </form>
            </div>
        </div>
    </div>`
}

