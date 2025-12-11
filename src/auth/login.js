async function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const meRes = await fetch("http://localhost:3000/api/auth/me", {
            headers: {
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
