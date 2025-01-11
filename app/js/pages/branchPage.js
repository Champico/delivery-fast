export async function getPage(){
    return getHtmlPage();
}

export async function addFunctionality(){
    console.log('Branch Page Functionality');
    return true;
}






function getHtmlPage(){
    return `
        <h1 class="title-section">Branch</h1>
            <div class="shupment-home-content">
                <div class="form-group branch-container">
                    <div class="form-group">
                        <h1 class="title-branch">Sucursal N° 00000</h1>
                    </div>
                    <div class="form-group">
                        <div class="form-group">
                            <h2 class="subtitle-branch"> Datos</h2>
                        </div>
                        <form action="" class="branch-form">   
                            <div class="form-group">
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchPostalCode">Codigo Postal*</label>
                                        <input class="input" type="text" id="branchPostalCode"
                                        placeholder="Codigo Postal de la sucursal"> 
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchCity">Ciudad*</label>
                                        <input class="input" type="text" id="branchPostalCity"
                                        placeholder="Ciudad de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchColony">Colonia*</label>
                                        <input class="input" type="text" id="branchColony"
                                        placeholder="Colonia de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchState">Estado*</label>
                                        <input class="input" type="text" id="branchState"
                                        placeholder="Estado de la sucursal"> 
                                    </div>
                                </div>
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchStreet">Calle*</label>
                                        <input class="input" type="text" id="branchStreet"
                                        placeholder="Calle de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <div class="form-inline">
                                            <div class="form-group">
                                                <label class="input-label about-titles-labels" for="branchNumExt">N° Ext*</label>
                                                <input class="input" type="text" id="branchNumExt"
                                                placeholder="N° Ext de la sucursal"> 
                                            </div>
                                            <div class="form-group">
                                                <label class="input-label about-titles-labels" for="branchNumExt">N° Int*</label>
                                                <input class="input" type="text" id="branchNumInt"
                                                placeholder="N° Int de la sucursal"> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchLatitude">Latitud*</label>
                                        <input class="input" type="text" id="branchLatitude"
                                        placeholder="Latitud de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchLongitude">Longitud*</label>
                                        <input class="input" type="text" id="branchLongitude"
                                        placeholder="Longitud la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchTimeToOut">Horsa Salida Diaria*</label>
                                        <input class="input" type="number" id="branchTimeToOut"
                                        placeholder="Hora de salida diaria de la sucursal"> 
                                    </div>
                                </div>
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchEmail">Correo*</label>
                                        <input class="input" type="email" id="branchEmail"
                                        placeholder="Correo de la sucursal"> 
                                    </div>
                                    <div class="form-group">
                                        <label class="input-label about-titles-labels" for="branchPhone">Telefono*</label>
                                        <input class="input" type="number" id="branchPhone"
                                        placeholder="Telefono de la sucursal"> 
                                    </div>                                       
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="button">Crear</button>
                            </div>                         
                        </form>
                    </div>
                </div>
            </div>`
}

