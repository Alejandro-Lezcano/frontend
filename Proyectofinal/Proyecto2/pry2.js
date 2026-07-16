fetch('https://fakestoreapi.com/products')
 .then(r => r.json())

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ESTADO GLOBAL DEL CARRITO
    // ==========================================
    let cart = [];
    const COSTO_ENVIO = 20000; 

    // Elementos del DOM
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const miniCartDropdown = document.getElementById("mini-cart-dropdown");
    const cartCounter = document.getElementById("cart-counter");
    const miniCartItems = document.getElementById("mini-cart-items");
    
    // Elementos del Resumen de Compra
    const miniCartSubtotal = document.getElementById("mini-cart-subtotal");
    const miniCartEnvio = document.getElementById("mini-cart-envio");
    const miniCartTotal = document.getElementById("mini-cart-total");

    // Abrir y cerrar el carrito de forma ultra segura
    if (cartToggleBtn && miniCartDropdown) {
        cartToggleBtn.addEventListener("click", (e) => {
            // Prevenimos que el evento "suba" al document y se cierre inmediatamente
            e.stopPropagation(); 
            
            // Alternamos la clase hidden
            const isHidden = miniCartDropdown.classList.contains("hidden");
            if (isHidden) {
                miniCartDropdown.classList.remove("hidden");
                miniCartDropdown.classList.add("flex");
            } else {
                miniCartDropdown.classList.add("hidden");
                miniCartDropdown.classList.remove("flex");
            }
        });
    } else {
        console.error("Error: No se encontró 'cart-toggle-btn' o 'mini-cart-dropdown' en el HTML.");
    }

    // Cerrar el carrito si el usuario hace click en cualquier otra parte de la pantalla
    document.addEventListener("click", (e) => {
        if (miniCartDropdown && !miniCartDropdown.contains(e.target)) {
            // Solo si el click NO fue en el botón del carrito
            if (cartToggleBtn && !cartToggleBtn.contains(e.target)) {
                miniCartDropdown.classList.add("hidden");
                miniCartDropdown.classList.remove("flex");
            }
        }
    });

    // ... (El resto del código JS de agregar, quitar y renderizar sigue exactamente igual)

    // ==========================================
    // 2. FUNCIÓN DE ACTUALIZACIÓN DE INTERFAZ (UI)
    // ==========================================
    function updateCartUI() {
        if (!cartCounter || !miniCartItems) return;

        // Actualizar contador del Header
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCounter.textContent = totalItems;
        
        // Limpiar contenedor del modal
        miniCartItems.innerHTML = "";

        // Si el carrito está completamente vacío
        if (cart.length === 0) {
            miniCartItems.innerHTML = `<p class="text-center text-gray-400 text-sm py-8">Tu carrito está vacío.</p>`;
            if (miniCartSubtotal) miniCartSubtotal.textContent = "0 Gs.";
            if (miniCartEnvio) miniCartEnvio.textContent = "0 Gs.";
            if (miniCartTotal) miniCartTotal.textContent = "0 Gs.";
            
            resetAllCardButtons();
            return;
        }

        let subtotal = 0;

        // Renderizar cada elemento del carrito en el desglose
        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            
            const itemHTML = `
                <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <div class="flex-1 pr-2">
                        <p class="m-0 font-bold text-xs text-primary leading-tight truncate">${item.name}</p>
                        <p class="m-0 text-[11px] text-gray-500 mt-0.5">${item.price.toLocaleString('es-PY')} Gs. c/u</p>
                    </div>
                    
                    <!-- Selector de cantidad dentro del modal -->
                    <div class="flex items-center bg-gray-100 rounded border border-gray-200 mr-2">
                        <button class="decrease-qty-btn px-2 py-1 text-gray-600 hover:text-black font-bold text-xs cursor-pointer border-none bg-transparent" data-id="${item.id}">-</button>
                        <span class="px-2 text-xs font-semibold text-primary">${item.quantity}</span>
                        <button class="increase-qty-btn px-2 py-1 text-gray-600 hover:text-black font-bold text-xs cursor-pointer border-none bg-transparent" data-id="${item.id}">+</button>
                    </div>

                    <!-- Botón eliminar item -->
                    <button class="remove-item-btn bg-transparent border-none text-red-400 cursor-pointer p-1 hover:text-red-600 transition-colors" data-id="${item.id}">
                        <span class="material-icons-outlined text-lg">delete</span>
                    </button>
                </div>
            `;
            miniCartItems.insertAdjacentHTML("beforeend", itemHTML);
        });

        // Calcular y pintar resumen de compra
        if (miniCartSubtotal) miniCartSubtotal.textContent = `${subtotal.toLocaleString('es-PY')} Gs.`;
        if (miniCartEnvio) miniCartEnvio.textContent = `${COSTO_ENVIO.toLocaleString('es-PY')} Gs.`;
        if (miniCartTotal) {
            const totalNeto = subtotal + COSTO_ENVIO;
            miniCartTotal.textContent = `${totalNeto.toLocaleString('es-PY')} Gs.`;
        }

        // Sincronizar botones en la grilla
        syncCardButtons();
        // Asignar los eventos de click a los botones del menú desplegable
        registerCartEvents();
    }

    // ==========================================
    // 3. FUNCIONES GLOBALES PARA EL CONTROL DE PRODUCTOS
    // ==========================================
    window.addItemToCart = function(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCartUI();

        // Abre el mini carrito automáticamente al añadir
        if (miniCartDropdown) {
            miniCartDropdown.classList.remove("hidden");
            miniCartDropdown.classList.add("flex");
        }
    };

    window.decrementItemFromCard = function(id) {
        const product = cart.find(item => item.id === id);
        if (product) {
            product.quantity -= 1;
            if (product.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }
        updateCartUI();
    };

    // Sincronizar botones normales para convertirlos en selector de cantidad interactivo
    function syncCardButtons() {
        cart.forEach(item => {
            const container = document.getElementById(`btn-container-${item.id}`);
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-between bg-gray-100 border border-gray-300 rounded w-full overflow-hidden">
                        <button onclick="decrementItemFromCard(${item.id})" class="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-primary font-bold text-sm cursor-pointer transition-colors border-none">-</button>
                        <span class="text-xs font-bold text-primary select-none">${item.quantity} un.</span>
                        <button onclick="addItemToCart(${item.id}, '${item.name}', ${item.price})" class="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-primary font-bold text-sm cursor-pointer transition-colors border-none">+</button>
                    </div>
                `;
            }
        });

        // Reestablecer las tarjetas que ya no tengan el artículo en el carrito
        const cardContainers = document.querySelectorAll("[id^='btn-container-']");
        cardContainers.forEach(container => {
            const id = parseInt(container.id.replace("btn-container-", ""));
            const isInCart = cart.some(item => item.id === id);
            if (!isInCart) {
                resetCardButton(container, id);
            }
        });
    }

    function resetCardButton(container, id) {
        const productName = container.getAttribute("data-name");
        const productPrice = parseFloat(container.getAttribute("data-price"));
        const btnSize = container.getAttribute("data-size") || "large";

        if (btnSize === "large") {
            container.innerHTML = `
                <button onclick="addItemToCart(${id}, '${productName}', ${productPrice})" 
                        class="w-full bg-primary text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded transition-all duration-300 hover:bg-secondary hover:text-primary cursor-pointer border-none">
                    Agregar al Carrito
                </button>
            `;
        } else {
            container.innerHTML = `
                <button onclick="addItemToCart(${id}, '${productName}', ${productPrice})" 
                        class="w-full bg-primary text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-2 rounded transition-all duration-300 hover:bg-secondary hover:text-primary cursor-pointer border-none">
                    Agregar
                </button>
            `;
        }
    }

    function resetAllCardButtons() {
        const cardContainers = document.querySelectorAll("[id^='btn-container-']");
        cardContainers.forEach(container => {
            const id = parseInt(container.id.replace("btn-container-", ""));
            resetCardButton(container, id);
        });
    }

    // Registrar eventos para elementos que viven dentro del modal desplegable
    function registerCartEvents() {
        miniCartItems.querySelectorAll(".increase-qty-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.getAttribute("data-id"));
                const product = cart.find(item => item.id === productId);
                if (product) product.quantity += 1;
                updateCartUI();
            });
        });

        miniCartItems.querySelectorAll(".decrease-qty-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.getAttribute("data-id"));
                const product = cart.find(item => item.id === productId);
                if (product) {
                    product.quantity -= 1;
                    if (product.quantity <= 0) {
                        cart = cart.filter(item => item.id !== productId);
                    }
                }
                updateCartUI();
            });
        });

        miniCartItems.querySelectorAll(".remove-item-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.getAttribute("data-id"));
                cart = cart.filter(item => item.id !== productId);
                updateCartUI();
            });
        });
    }

    // Cerrar carrito al clickear en cualquier otra parte del sitio
    document.addEventListener("click", (e) => {
        if (miniCartDropdown && !miniCartDropdown.contains(e.target) && e.target !== cartToggleBtn) {
            miniCartDropdown.classList.add("hidden");
            miniCartDropdown.classList.remove("flex");
        }
    });
});