
document.addEventListener('DOMContentLoaded', () => {
    readProduct();

});

function readProduct() {
    fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProducts(products);
        console.log("Продукти отримано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при отриманні продуктів!");
    });
}

function displayProducts(products) {
    const grid = document.getElementById('products-table');
    
    // Очищаємо попередні дані
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p>Немає продуктів для відображення</p>';
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
            </div>
            <div class="product-price">
                <p class="av"><strong>В наявності</strong></p>

                ${product.ProductDiscountPercent > 0 ? `<p style="font-size: 12px" class="oldcost"><s>${product.ProductCost} грн/кг</s></p>` : ``}
                
                <p class="newcost" style="${product.ProductDiscountPercent ? 'color: red' : ''}">
                    <strong>${newPrice} грн/кг</strong>
                </p>
            </div>
            <button class="details-button" onclick="">Придбати</button>
        `;
        grid.appendChild(card);
    });
}