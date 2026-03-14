
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('.nav');
burgerMenu.addEventListener('click', () => {
    nav.classList.toggle('open');
});

const token = localStorage.getItem("token");

const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== "User") {
    window.location.href = "/login.html";
}
