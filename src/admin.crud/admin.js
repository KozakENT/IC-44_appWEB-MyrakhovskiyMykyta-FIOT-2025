function loginAdmin() {
    const login = document.getElementById('adminName').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    
    if (login === "admin" && pass === "qwerty") {
        document.getElementById("loginForm").style.display = "none";
        document.querySelector(".sidebar").style.display = "block";
        document.querySelector(".admin-header").style.display = "block";
    } else {
        const msg = document.getElementById("adminError");
        msg.style.display = "block";
        msg.textContent = "Невірний логін або пароль!";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const adminHeader = document.querySelector('.admin-header');

    const sections = adminHeader.querySelectorAll('.section');

    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').replace('#', '');
            const targetSection = adminHeader.querySelector(`.section.${targetId}`);

            if (!targetSection) return;

            hideAllSections();
            adminHeader.style.display = 'block';
            targetSection.style.display = 'block';
        });
    });
});

function createProduct(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const cost = document.getElementById('cost').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const photo = document.getElementById('photo').value;

    const productData = {
        name: name,
        price: cost,
        description: description,
        category: category,
        photo: photo
    };

    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    
    .then(res => res.json())
    .then(data => {
        alert("Продукт створено!");
        console.log("Response:", data);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при створенні продукту!");
    });
}

function readProduct(event) {
    event.preventDefault();
    
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
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.ProductPhoto}" alt="${product.ProductName}">
            <h3>${product.ProductName}</h3>
            <p><strong>Ціна:</strong> ${product.ProductCost} грн</p>
            <p><strong>Категорія:</strong> ${product.ProductCategory}</p>
            <p>${product.ProductDescription}</p>
            <p><small>ID: ${product.ProductId}</small></p>
        `;
        grid.appendChild(card);
    });
    
    alert("Продукти завантажено!");
}

function deleteProduct(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('ProductId').value, 10);

    fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        console.log("Response:", data);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при видаленні продукту!");
    });
}

function updateProduct(event) { 
    event.preventDefault();
    const id = document.getElementById('id').value;
    const field = document.getElementById('field').value;
    const value = document.getElementById('value').value;

    if (!id || !field || !value) {
        alert("Всі поля повинні бути заповнені!");
        return;
    }

    fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ field, value })
    })
    .then(res => res.json())
    .then(data => {
        alert("Продукт оновлено!");
        console.log("Response:", data);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при оновленні продукту!");
    });
}

