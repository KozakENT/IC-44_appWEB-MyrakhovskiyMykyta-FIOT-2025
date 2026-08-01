var  BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('topsale-table')) {
        loadTopsale()
    }
    if (document.getElementById('discount-table')) {
        loadDiscountOnly()
    }

    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    burgerMenu.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('open');
    })

    const navCloseBtn = document.querySelector('.nav-mobile-close');
    navCloseBtn.addEventListener('click', () => {
        nav.classList.remove('open');
    })


    // Відкриття/закриття авторизації і реєстрації
    document.addEventListener('click', (e) => {
    const button = e.target.closest('.user-container');
    const regWrap = document.querySelector('.registrate-wrap')
    const regPopUp = document.getElementById('registrateForm')

    if (button) {
        e.preventDefault();
        regWrap.style.display = 'flex';
        regPopUp.style.display = 'flex';
    }
    else {
        const redirect = e.target.closest('.open-login');
        const loginWrap = document.querySelector('.login-wrap')
        const loginPopUp = document.getElementById('loginForm')

        if (redirect) {
            regPopUp.style.display = 'none';
            regWrap.style.display = 'none';
            loginWrap.style.display = 'flex';
            loginPopUp.style.display = 'flex';
        }
    }

    // После success редиректа
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');
    if (orderId) {
        alert(`Замовлення успішно оформлено! Номер: ${orderId}`);
    }
});
})

/* const token = localStorage.getItem("token");

const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== "User") {
    window.location.href = "/login.html";
}
*/
function displayProductsTo(products, containerId) {
    const grid = document.getElementById(containerId);
    
    // Очищаємо попередні дані
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="without-products">Немає продуктів для відображення</p>';
        return;
    }
    
    // Створюємо картки для кожного продукту
    products.forEach(product => {
        let newPrice = product.ProductCost

        if (product.ProductDiscountPercent != null) {
            newPrice = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.ProductPhoto}" alt="${product.ProductName}">
            </div>
            <div class="product-info">
                <h3>${product.ProductName}</h3>
                <p class="product-category">${product.ProductCategory}</p>
                <p class="av"><strong>В наявності</strong></p>
            </div>
            <div class="product-price">
                ${product.ProductDiscountPercent > 0 ? `<p style="font-size: 12px"><s>${product.ProductCost} грн/кг</s></p>` : ``}
                
                <p class="newcost" style="${product.ProductDiscountPercent ? 'color: red' : ''}">
                    <strong>${newPrice} грн/кг</strong>
                </p>
            </div>
            <button id="data-button-${product.ProductId}" class="to-cart-button">Придбати</button>
        `;
        grid.appendChild(card);
    });
}

function loadTopsale() {
    fetch(`${BASE_URL}/api/products/sort/new`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProductsTo(products.slice(0, 8), 'topsale-table');
        console.log("Продукти відсортовано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при сортуванні продуктів!");
    });
}

function loadDiscountOnly() {
    fetch(`${BASE_URL}/api/products/discount`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProductsTo(products, 'discount-table');
        console.log("Продукти відсортовано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при сортуванні продуктів!");
    });
}