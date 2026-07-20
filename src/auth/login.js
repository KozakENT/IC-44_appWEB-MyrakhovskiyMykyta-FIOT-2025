var BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

async function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { 
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json"
             },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            document.getElementById("error").textContent = data.message;
            return;
        }

        // Зберігаємо токен
        localStorage.setItem("token", data.token);

        // робимо другий запит на /auth/me
        const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `Bearer ${data.token}`
            }
        });

        const me = await meRes.json();

        if (me.role === "Admin") {
            window.location.href = "/admin.html";
        } else if (me.role === "User") {
            window.location.href = "/user.html";
        } else {
            window.location.href = "/index.html";
        }

    } catch (err) {
        console.error(err);
    }
}
