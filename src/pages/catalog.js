document.addEventListener('DOMContentLoaded', () => {
    readProduct();
    priceGlider();

    const SORT_OPTIONS = {
        option0: "popular",
        option1: "new",
        option2: "priceASC",
        option3: "priceDESC",
        option4: "default"
    }
    for (const [key, value] of Object.entries(SORT_OPTIONS)) {
        document.getElementById(key).addEventListener('click', () => {
            getSorted(value);
        })
    }

    document.querySelector('.search')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchValue = document.getElementById('search').value;
        searchBy(searchValue);
    });

    document.getElementById('price-sort-confirm')?.addEventListener('click', (e)=> {
        e.preventDefault();
        const minvalue = document.querySelector('.min-range').value;
        const maxvalue = document.querySelector('.max-range').value;
        sortByPriceSlider(minvalue, maxvalue);
    });
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
        displayCategory(products);
        categoryAmount(products);
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

function categoryAmount(products) {
    const discount = products.filter(p => p.ProductDiscountPercent > 0).length;
    document.getElementById('discount-amount').textContent = discount;

    // const newposition 

    const uniqueCategories = [...new Set(products.map(p => p.ProductCategory))];
    uniqueCategories.forEach(category => {
        const count = products.filter(p => p.ProductCategory === category).length;
        const el = document.getElementById(`${category}-amount`);
        if (el) el.textContent = count;
    })
}

function displayCategory(products) {

    // категорії
    const categoryGrid = document.getElementById('category-grid');

    // Очищаємо попередні дані
    categoryGrid.innerHTML = '';

    const uniqueCategories = [...new Set(products.map(p => p.ProductCategory))];

    uniqueCategories.forEach(category => {
            const categoryCard = document.createElement('a');
            categoryCard.className='a-reset checkbox-wrap';
            categoryCard.href='#';
            categoryCard.dataset.category = category;
            categoryCard.innerHTML = `
            <span class="checkbox">
                <i class="fa-regular fa-square js-checkbox-icon"></i>
            </span>
            <span class="label">
                <span class="filter-title">${category}</span>
            </span>
            <span class="amount-wrap">
                <span class="amount" id="${category}-amount"></span>
            </span>
            `;

        categoryCard.addEventListener('click', (e) => {
            e.preventDefault();

            const icon = categoryCard.querySelector('.js-checkbox-icon');
            icon.classList.toggle('fa-square');
            icon.classList.toggle('fa-square-check');
            
            categoryCard.classList.toggle('active');
            filterByCategory();
        })

        categoryGrid.appendChild(categoryCard);
        }
    )
}

function getSorted(sortType) {
    fetch(`http://localhost:3000/api/products/sort/${sortType}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProducts(products);
        console.log("Продукти відсортовано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при сортуванні продуктів!");
    });
}

function searchBy(inputContent) {
    fetch(`http://localhost:3000/api/products/search/${encodeURIComponent(inputContent)}`, {
        method: 'GET',
    headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProducts(products);
        console.log("Продукти відсортовано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при сортуванні продуктів!");
    });
}

function sortByPriceSlider(minvalue, maxvalue) {
    fetch(`http://localhost:3000/api/products/price/${minvalue}-${maxvalue}`, {
        method: 'GET',
    headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(products => {
        displayProducts(products);
        console.log("Продукти відсортовано:", products);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при сортуванні продуктів!");
    });
}

function buttonBuyClick(productId) {
    fetch(`http://localhost:3000/api/products/buy/${productId}`, {
        method: 'POST',
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

const sortFilter = document.getElementById('sort-filter');
const dropdownContent = document.querySelector('.dropdown-content');
const dropArrow = document.getElementById('dropdown-arrow');

sortFilter.addEventListener('click', () => {
     dropdownContent.classList.toggle('open');
     dropArrow.classList.toggle('open');
});

function priceGlider() {
    const rangeHandler = document.querySelectorAll('.slider-handler');
    const inputValue = document.querySelectorAll('.price-container input');
    let container = document.querySelector(".slider-container");

    let activeHandler = null;

    let priceGap = 12.5;
    let leftValue = 0;
    let rightValue = 100;

    rangeHandler[0].style.left = leftValue + "%";
    rangeHandler[1].style.left = rightValue + "%";

    rangeHandler.forEach(handler => {
        handler.addEventListener("mousedown", () => {
            activeHandler = handler;
        });
    });

    document.addEventListener("mousemove", e => {
        if (activeHandler != null) {

            let containerData = container.getBoundingClientRect();

            let calculatedPos = (e.clientX - containerData.left) / containerData.width * 100;
            
            let mousePosition = Math.min(Math.max(calculatedPos, 0), 100);

            if (activeHandler === rangeHandler[0]) {
                mousePosition = Math.min(mousePosition, rightValue - priceGap);
                leftValue = mousePosition;

                const price = Math.round(50 + (mousePosition / 100) * (4500 - 50));
                inputValue[0].value = price;
            } 
            else {
                mousePosition = Math.max(mousePosition, leftValue + priceGap);
                rightValue = mousePosition;
                
                const price = Math.round(50 + (mousePosition / 100) * (4500 - 50));
                inputValue[1].value = price;
            }

            activeHandler.style.left = mousePosition + "%";
        }

        inputValue[0].addEventListener("input", () => {
            let value = Number(inputValue[0].value);
            let percent = (value - 50) / (4500 - 50) * 100;
            leftValue = Math.min(percent, rightValue - priceGap);
            rangeHandler[0].style.left = leftValue + "%";
        });

        inputValue[1].addEventListener("input", () => {
            let value = Number(inputValue[1].value);
            let percent = (value - 50) / (4500 - 50) * 100;
            rightValue = Math.max(percent, leftValue + priceGap);
            rangeHandler[1].style.left = rightValue + "%";
        });
    });

    rangeHandler.forEach(handler => {
        handler.addEventListener("mouseover", (e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.transition = "transform 0.2s ease";
        });

        handler.addEventListener("mouseout", (e) => {
        // перевірка куди пішла мишка
            if (!e.relatedTarget || !e.target.contains(e.relatedTarget)) {
                e.target.style.transform = "scale(1)";
            }
        });
    });

    document.addEventListener("mouseup", () => {
        activeHandler = null;
    });
}