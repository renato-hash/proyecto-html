document.addEventListener('DOMContentLoaded', () => {
    let ordenGuardada = JSON.parse(localStorage.getItem('ultimaOrden'));
    

    const fechaHoy = document.getElementById('fecha-hoy');
    if (fechaHoy) fechaHoy.innerText = new Date().toLocaleDateString();

    let contenedorProductos = document.getElementById('lista-productos-boleta');
    let totalBoleta = document.getElementById('total-boleta');

    if (ordenGuardada && ordenGuardada.productos && ordenGuardada.productos.length > 0) {
        let htmlProductos = '';
        
        ordenGuardada.productos.forEach(producto => {
            let subtotal = Number(producto.price) * Number(producto.quantity);
            
            htmlProductos += `
                <div class="d-flex justify-content-between mb-2 pb-2 border-bottom" style="font-size: 14px;">
                    <span>${producto.name} <strong>x${producto.quantity}</strong></span>
                    <span>$${subtotal.toLocaleString('es-CL')}</span>
                </div>
            `;
        });
        
        if (contenedorProductos) contenedorProductos.innerHTML = htmlProductos;
        if (totalBoleta) totalBoleta.innerText = Number(ordenGuardada.total).toLocaleString('es-CL');
        
    } else {
        if (contenedorProductos) contenedorProductos.innerHTML = '<p class="text-center text-muted">No hay compras recientes.</p>';
    }
});