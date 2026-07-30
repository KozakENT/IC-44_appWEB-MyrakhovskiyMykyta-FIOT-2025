var  BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

document.addEventListener("DOMContentLoaded", () => {
    showAmountInCart()

    if (document.getElementById('cart-table-body')) {
        showCart();
        finalPrice();
    }

    // Відкриття/закриття кошику
    document.addEventListener('click', (e) => {
        const button = e.target.closest('#open-cart-button');
        const closeBtn = e.target.closest('#close-cart');
        const cart = document.querySelector('.cart');

        if (button) {
            e.preventDefault();
            cart.style.display = 'flex';
            showCart();
            finalPrice()
        }
        if (closeBtn) {
            cart.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.increment, .de-increment');
        if (!btn) return;

        const productId = btn.dataset.productId;

        if (btn.classList.contains('increment')) {
            createCart(productId);
        }   
        if (btn.classList.contains('de-increment')) {
            removeFromCart(productId);
        }
    })

    // Виклик/перехід в кошик
    document.addEventListener('click', (e) => {
    const button = e.target.closest('.to-cart-button');

    if (button) {
        e.preventDefault();
        // ID з атрибута id кнопки, прибрав префікс "data-button-"
        const productId = button.id.replace('data-button-', '');

        if (button.textContent.trim() === "Придбати") {
            button.style.backgroundColor = `gray`;
            button.textContent = "В кошику";
            
            buttonBuyClick(productId);
            createCart(productId);
            showAmountInCart()
        
        } else {
            button.style.backgroundColor = `#79B3FF`;
            button.textContent = "Придбати";
        }
    }
    });

    document.addEventListener('click', (e) => {
        const button = e.target.closest('#redirect-to-checkout');
        if (button) {
            location.href = 'checkout.html'
        }
    })
})

function createCart(productId) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/cart/${productId}`, {
        method: 'POST',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Додано до кошику:", data);
        
        if (document.getElementById('cart-table-body')) {
            const btn = document.querySelector(`[data-product-id="${productId}"]`)
            const tr = btn.closest('tr');

            const counterSpan = tr.querySelector('.counter span');
            counterSpan.textContent = data;
            const price = tr.dataset.price;
            tr.querySelector('td b').textContent = price * data + " грн";
        }

        finalPrice();
        showAmountInCart()
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при створенні корзинки!");
    })
}

function removeFromCart(productId) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/cart/${productId}`, {
        method: 'DELETE',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Зменшено на один товар:", data);

        const btn = document.querySelector(`[data-product-id="${productId}"]`)
        const tr = btn.closest('tr');

        if (data <= 0) {
            tr.remove();
        }
        else {
            const counterSpan = tr.querySelector('.counter span');
            counterSpan.textContent = data;
            const price = tr.dataset.price;
            tr.querySelector('td b').textContent = price * data + " грн";
        }

        finalPrice();
        showAmountInCart()
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при зменшенні!");
    })
}


function showCart() {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/cart`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => {
        const grid = document.getElementById('cart-table-body');
        grid.innerHTML = '';
        
        const entries = Object.entries(data); // Подтянуть айди продукта и колличество с Редис корзинки

        if (entries.length === 0) {
            grid.innerHTML = '<p class="text-td without-products">Кошик порожній</p>';
            return;
        }

        for (const [productId, quantity] of entries) {
            const product = await fetch(`${BASE_URL}/api/products/${productId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            })
            .then(res => res.json());

            let newPrice = product.ProductCost;

            if (product.ProductDiscountPercent != null) {
                newPrice = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
            }

            const card = document.createElement('tr');
            card.dataset.price = newPrice;
            card.innerHTML = `
                    <td><img class="image-td" src="${product.ProductPhoto}" alt="${product.ProductName}"></td>
                    <td class="text-td">
                        <h2>${product.ProductName}</h2>
                        <span>${product.ProductDiscountPercent > 0 ? `<span class="product-old-price"><s>${product.ProductCost} грн/кг</s></span>` : ``}
                        ${newPrice} грн/кг
                        </span>
                    </td> 
                    <td class="text-center">
                        <div class="counter">
                            <button data-product-id="${product.ProductId}" class="btn de-increment">-</button>
                            <span>${quantity}</span>
                            <button data-product-id="${product.ProductId}" class="btn increment">+</button>
                        </div>
                    </td> 
                    <td><b>${newPrice * quantity} грн</b</td> 
            `;
            grid.appendChild(card);
        }
    })
}

function showAmountInCart() {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/cart`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => { 
        const span = document.getElementById('amount-display-text');
        if (!span) return;
        const entries = Object.entries(data);

        if (entries.length != 0) {
            const totalCount = Object.values(data).reduce((sum, qty) => sum + Number(qty), 0);
            span.textContent = `${totalCount}`;
            span.style.display = 'flex';
        }
    });
}

function finalPrice() {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/cart`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => {
        const entries = Object.entries(data); 
        let total = 0;

        for (const [productId, quantity] of entries) {
            const product = await fetch(`${BASE_URL}/api/products/${productId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            })
            .then(res => res.json());

            let newPrice = product.ProductCost; 

            if (product.ProductDiscountPercent != null) {
                newPrice = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
            }

            total += newPrice * Number(quantity);
        }

        document.getElementById('sum-price').textContent = `${total} грн`;
    })
}

function buttonBuyClick(productId) {
    fetch(`${BASE_URL}/api/products/buy/${productId}`, {
        method: 'POST',
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    })
    .then(res => res.json())
    .then(productId => {
        console.log("Клік на продукт пораховано:", productId);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при рахуванні кліку на продукт!");
    });
}