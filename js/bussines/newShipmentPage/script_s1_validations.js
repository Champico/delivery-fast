export function validateShipmentDataFields(){
    verifySenderData();
    verifyRecipientData();
}

function verifySenderData(){
    const htmlElements = {   
        "cp_remitente":       document.getElementById("cp-remitente"),
        "estado_remitente":   document.getElementById("estado-remitente"),
        "ciudad_remitente":   document.getElementById("ciudad-remitente"),
        "colonia_remitente":  document.getElementById("colonia-remitente"),
        "calle_remitente":    document.getElementById("calle-remitente"),
        "noext_remitente":    document.getElementById("noext-remitente"),     
        "noint_remitente":    document.getElementById("noint-remitente"),
        "correo_remitente":   document.getElementById("correo-remitente"),
        "telefono_remitente": document.getElementById("telefono-remitent")
    };

    const data = {
        
    }
}

function verifyRecipientData(){
    const htmlElements = {   
        "cp-destinatario":       document.getElementById("cp-destinatario"),
        "estado-destinatario":   document.getElementById("estado-destinatario"),
        "ciudad-destinatario":   document.getElementById("ciudad-destinatario"),
        "colonia-destinatario":  document.getElementById("colonia-destinatario"),
        "calle-destinatario":    document.getElementById("calle-destinatario"),
        "noext-destinatario":    document.getElementById("noext-destinatario"),
        "noint-destinatario":    document.getElementById("noint-destinatario"),
        "correo-destinatario":   document.getElementById("correo-destinatario"),
        "telefono-destinatario": document.getElementById("telefono-destinatario")
    };
}