function loginUser() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    
    if ((user === "user" && pass === "qwerty") || (user === "ivan" && pass === "1234")) {
        document.getElementById("loginForm").style.display = "none";
        document.querySelector(".profile-page").style.display = "flex";
        document.querySelector("header").style.display = "flex";
    } else {
        const msg = document.getElementById("loginMessage");
        msg.style.display = "block";
        msg.textContent = "Невірний логін або пароль!";
    }
}

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

const burgerMenu = document.querySelector('.burger-wrap');
const nav = document.querySelector('.nav');
burgerMenu.addEventListener('click', () => {
    nav.classList.toggle('open');
});