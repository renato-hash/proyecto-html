

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// ==========================================
// LÓGICA DEL CARRITO DE COMPRAS
// ==========================================
let cart = [];

function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    updateCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-muted text-center my-3">El carrito está vacío.</p>';
        cartTotal.textContent = '$0';
        localStorage.removeItem('carrito'); // Limpia la memoria si se vacía el carrito
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2">
            <div class="d-flex align-items-center">
                <img src="${item.img}" alt="${item.name}" style="width: 45px; height: 45px; object-fit: cover;" class="rounded me-3">
                <div>
                    <h6 class="mb-0 text-light fs-6">${item.name}</h6>
                    <small class="text-warning">$${item.price.toLocaleString('es-CL')} c/u</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary text-light px-2 py-0 me-2" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="fw-bold text-light me-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary text-light px-2 py-0 me-3" onclick="changeQuantity('${item.id}', 1)">+</button>
                <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = `$${totalPrice.toLocaleString('es-CL')}`;

    // Guarda los datos para que la boleta los pueda leer
    localStorage.setItem('carrito', JSON.stringify(cart));
}


// ==========================================
// LÓGICA DEL PAGO (Corregida para el botón)
// ==========================================
const btnPagar = document.getElementById('btn-pagar');

if (btnPagar) {
    btnPagar.addEventListener('click', function(e) {
        e.preventDefault(); 

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Cambiamos el texto para que sepas que está funcionando
        btnPagar.disabled = true;
        btnPagar.textContent = 'Procesando pago...';

        setTimeout(() => {
            // Genera la orden usando price y quantity
            const orden = {
                numero: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                fecha: new Date().toLocaleDateString(),
                total: carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                productos: carrito
            };

            // Guarda la orden y limpia el carrito
            localStorage.setItem('ultimaOrden', JSON.stringify(orden));
            localStorage.removeItem('carrito');

            // Envía a la boleta DESPUÉS de guardar los datos
            window.location.href = 'boleta.html';
        }, 1500); // Espera 1.5 segundos
    });
}


// ==========================================
// LÓGICA DE LA BOLETA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const fechaHoy = document.getElementById('fecha-hoy');
    if (fechaHoy) {
        fechaHoy.innerText = new Date().toLocaleDateString();
    }

    // Leemos la orden que acabamos de guardar
    let ordenGuardada = JSON.parse(localStorage.getItem('ultimaOrden'));
    
    let contenedorProductos = document.getElementById('lista-productos-boleta');
    let totalBoleta = document.getElementById('total-boleta');

    if (contenedorProductos) {
        if (ordenGuardada && ordenGuardada.productos.length > 0) {
            let htmlProductos = '';
            
            // Recorremos los productos usando name, price y quantity
            ordenGuardada.productos.forEach(producto => {
                let subtotal = producto.price * producto.quantity;
                
                htmlProductos += `
                    <div class="d-flex justify-content-between mb-2 pb-2 border-bottom" style="font-size: 14px;">
                        <span>${producto.name} <strong>x${producto.quantity}</strong></span>
                        <span>$${subtotal.toLocaleString('es-CL')}</span>
                    </div>
                `;
            });
            
            // Inyectamos el HTML y el total
            contenedorProductos.innerHTML = htmlProductos;
            if (totalBoleta) {
                totalBoleta.innerText = ordenGuardada.total.toLocaleString('es-CL');
            }
            
        } else {
            contenedorProductos.innerHTML = '<p class="text-center text-muted">No hay compras recientes.</p>';
        }
    }
});