document.addEventListener('DOMContentLoaded', () => {
    const guia = document.getElementById('guia-dinamic').textContent.trim();
    const statusContainer = document.querySelector('.container-status-progress');

    fetch(`http://localhost/backend/packageEstatus/${guia}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el estado del paquete.');
            }
            return response.json();
        })
        .then(data => {
            const statusHtml = `
                <div>
                    <p><strong>Estatus:</strong> ${data.estatus}</p>
                    <p><strong>Descripción:</strong> ${data.descripcion}</p>
                    <p><strong>Notas:</strong> ${data.notas || 'Sin notas adicionales.'}</p>
                    <p><strong>Última actualización:</strong> ${data.fecha_cambio}</p>
                </div>
            `;
            statusContainer.innerHTML = statusHtml; 
        })
        .catch(error => {
            console.error(error);
            statusContainer.innerHTML = '<p>Error al cargar el estado del paquete.</p>';
        });
});
