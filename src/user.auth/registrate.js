var BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

function addNewAccount(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const productData = {
        username: username,
        phoneNumber: phoneNumber,
        email: email,
        password: password
    };

    if (!username || !phoneNumber || !email || !password) {
        document.getElementById("error").textContent = "Всі поля повинні бути заповнені!";
        return;
    }

    fetch(`${BASE_URL}/api/auth/registrate`, {
        method: 'POST',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    
    .then(async res => {
    const data = await res.json();

    if (!res.ok) {
        document.getElementById("error").textContent = data.message;
        return;
    }

    alert("Аккаунт створено!");
    window.location.href = "/index.html";
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при створенні аккаунту!");
    });
}