document.addEventListener("DOMContentLoaded", () => {
    showAmountInCart()
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
})

function createCart(productId) {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/api/products/cart/${productId}`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Додано до кошику:", data);
        showCart();
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

    fetch(`http://localhost:3000/api/products/cart/${productId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Зменшено на один товар:", data);
        showCart();
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

    fetch(`http://localhost:3000/api/products/cart`, {
        method: 'GET',
        headers: {
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
            const product = await fetch(`http://localhost:3000/api/products/${productId}`)
            .then(res => res.json());

            let newPrice = product.ProductCost;

            if (product.ProductDiscountPercent != null) {
                newPrice = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
            }

            const card = document.createElement('tr');
            card.innerHTML = `
                <td><img class="image-td" src="${product.ProductPhoto}" alt="${product.ProductName}"></td>
                    <td class="text-td">
                        <h2>${product.ProductName}</h2>
                        <span>${product.ProductDiscountPercent > 0 ? `<span class="product-old-price"><s>${product.ProductCost} грн/кг</s></span>` : ``}
                        ${newPrice} грн/кг
                        </span>
                    </td> 
                    <td>
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

    fetch(`http://localhost:3000/api/products/cart`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => { 
        const entries = Object.entries(data);
        const span = document.getElementById('amount-display-text');

        if (entries.length != 0) {
            const totalCount = Object.values(data).reduce((sum, qty) => sum + Number(qty), 0);
            span.textContent = `${totalCount}`;
            span.style.display = 'block';
        }
    });
}

function finalPrice() {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/api/products/cart`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => {
        const entries = Object.entries(data); 
        let total = 0;

        for (const [productId, quantity] of entries) {
            const product = await fetch(`http://localhost:3000/api/products/${productId}`)
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

