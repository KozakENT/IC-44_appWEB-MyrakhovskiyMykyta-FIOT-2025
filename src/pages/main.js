
const burgerMenu = document.querySelector('.burger-menu');
const nav = document.querySelector('.nav');
burgerMenu.addEventListener('click', () => {
    nav.classList.toggle('open');
});
burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('open');
})

/* const token = localStorage.getItem("token");

const payload = JSON.parse(atob(token.split('.')[1]));

if (payload.role !== "User") {
    window.location.href = "/login.html";
}
*/

// Відкриття/закриття кошику
document.addEventListener('click', (e) => {
    const button = e.target.closest('.user-container');
    const form = document.querySelector('.login-wrap')
    const form2 = document.getElementById('loginForm')

    if (button) {
        e.preventDefault();
        form2.style.display = 'flex';
        form.style.display = 'flex';
    }
});