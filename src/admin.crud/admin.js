document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Если токена нет - редирект на страницу логина
        window.location.href = '/login.html';
        return;
    }

    const sidebar = document.querySelector('.sidebar');
    const adminHeader = document.querySelector('.admin-header');
    
    if (sidebar) sidebar.style.display = 'block';
    if (adminHeader) adminHeader.style.display = 'block';

    const sidebarLinks = document.querySelectorAll('.sidebar a');
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
            targetSection.style.display = 'block';
        });
    });
});

const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login.html";

    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.role !== "Admin") {
        window.location.href = "/user.html";
    }

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

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

