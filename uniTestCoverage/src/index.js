/** 1. BASE DE DATOS DE PRODUCTOS */
const PRODUCTOS = [
    { id: 101, nombre: "Camiseta Compression Fit Black", precio: 29.99, cat: "HOMBRES", img: "https://underarmourcol.vtexassets.com/arquivos/ids/621610-1200-1800?v=638884677323870000&width=1200&height=1800&aspect=true" },
    { id: 102, nombre: "Camiseta Compression Fit Blue", precio: 29.99, cat: "HOMBRES", img: "https://underarmourcol.vtexassets.com/arquivos/ids/444610-1200-1800?v=637698345107900000&width=1200&height=1800&aspect=true" },
    { id: 105, nombre: "Camiseta UA HeatGear", precio: 29.99, cat: "HOMBRES", img: "https://underarmourcol.vtexassets.com/arquivos/ids/608481-300-400?v=638840588590170000&width=300&height=400&aspect=true" },
    { id: 106, nombre: "Camiseta UA Tech Training", precio: 29.99, cat: "HOMBRES", img: "https://underarmourcol.vtexassets.com/arquivos/ids/621520-300-400?v=638884677065530000&width=300&height=400&aspect=true" },
    { id: 103, nombre: "Zapatillas UltraRun X White", precio: 120.50, cat: "CALZADO", img: "https://underarmourcol.vtexassets.com/arquivos/ids/638351-300-400?v=639069666260930000&width=300&height=400&aspect=true" },
    { id: 107, nombre: "Zapatillas Flow Velociti", precio: 120.50, cat: "CALZADO", img: "https://underarmourcol.vtexassets.com/arquivos/ids/645711-300-400?v=639075521478130000&width=300&height=400&aspect=true" },
    { id: 108, nombre: "Zapatillas Hovr Phantom 3", precio: 120.50, cat: "CALZADO", img: "https://underarmourcol.vtexassets.com/arquivos/ids/637747-300-400?v=639069663280730000&width=300&height=400&aspect=true" },
    { id: 109, nombre: "Zapatillas Project Rock BSR", precio: 120.50, cat: "CALZADO", img: "https://underarmourcol.vtexassets.com/arquivos/ids/606084-300-400?v=638724700741370000&width=300&height=400&aspect=true" },
    { id: 104, nombre: "UA Performance Tech Shorts", precio: 65.00, cat: "UNISEX", img: "https://underarmourcol.vtexassets.com/arquivos/ids/634987-300-400?v=639052996535930000&width=300&height=400&aspect=true" },
    { id: 110, nombre: "UA Rival Fleece Shorts", precio: 65.00, cat: "UNISEX", img: "https://underarmourcol.vtexassets.com/arquivos/ids/637599-300-400?v=639053014640630000&width=300&height=400&aspect=true" },
    { id: 111, nombre: "UA Sportstyle Shorts", precio: 65.00, cat: "UNISEX", img: "https://underarmourcol.vtexassets.com/arquivos/ids/638864-300-400?v=639053018283000000&width=300&height=400&aspect=true" }
];

/** 2. ESTADO */
let carrito = JSON.parse(localStorage.getItem('activegear_cart')) || [];

/** 3. SELECTORES */
const cartOverlay = document.getElementById('cart-overlay');
const btnOpenCart = document.getElementById('cart-open');
const btnCloseCart = document.getElementById('cart-close');
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal-amount');
const countEl = document.getElementById('cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');

/** 4. LÓGICA DEL CARRITO */

const agregarAlCarrito = (id) => {
    const existe = carrito.find(p => p.id === id);
    if (existe) {
        carrito = carrito.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p);
    } else {
        const prod = PRODUCTOS.find(p => p.id === id);
        carrito = [...carrito, { ...prod, cantidad: 1 }];
    }
    actualizarApp();
};

const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(p => p.id !== id);
    actualizarApp();
};

const cambiarCantidad = (id, cambio) => {
    carrito = carrito.map(p => {
        if (p.id === id) {
            const nuevaCant = p.cantidad + cambio;
            return { ...p, cantidad: nuevaCant > 0 ? nuevaCant : 1 };
        }
        return p;
    });
    actualizarApp();
};

const vaciarCarrito = () => {
    if(confirm("¿Deseas vaciar el carrito?")) {
        carrito = [];
        actualizarApp();
    }
};

const actualizarApp = () => {
    localStorage.setItem('activegear_cart', JSON.stringify(carrito));
    renderCart();
};

/** 5. RENDERIZADO */

const renderCatalog = (lista = PRODUCTOS) => {
    productGrid.innerHTML = lista.map(p => `
        <article class="product-card">
            <img src="${p.img}" alt="${p.nombre}" loading="lazy">
            <div class="product-info">
                <small style="color:var(--primary)">${p.cat}</small>
                <h3>${p.nombre}</h3>
                <p style="font-weight: bold; margin-bottom: 1.5rem; font-size: 1.2rem">$${p.precio.toFixed(2)}</p>
                <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Añadir al Carrito</button>
            </div>
        </article>
    `).join('');
};

const renderCart = () => {
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `<div style="text-align:center; padding: 2rem; color: gray">Carrito vacío 👟</div>`;
    } else {
        cartItemsContainer.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <div class="cart-item-main">
                    <img src="${item.img}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.nombre}</h4>
                        <small style="color:var(--primary)">$${(item.precio * item.cantidad).toFixed(2)}</small>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    <button class="btn-del" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const q = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    subtotalEl.innerText = `$${total.toFixed(2)}`;
    countEl.innerText = q;
};

/** 6. FILTROS Y EVENTOS */
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.getAttribute('data-cat');
        renderCatalog(cat === "TODO" ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === cat));
    });
});

btnOpenCart.addEventListener('click', () => { cartOverlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; });
btnCloseCart.addEventListener('click', () => { cartOverlay.style.display = 'none'; document.body.style.overflow = 'auto'; });
document.getElementById('btn-empty').addEventListener('click', vaciarCarrito);
cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) btnCloseCart.click(); });

renderCatalog();
renderCart();