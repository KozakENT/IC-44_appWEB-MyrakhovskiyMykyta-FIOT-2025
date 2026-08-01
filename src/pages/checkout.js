var BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

document.addEventListener('DOMContentLoaded', () => {
    createDeliveryUl();
    userInfo();

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.go-back-arrow')
        if (btn) {
            location.replace('catalog.html');
        }
    })
    // Закриття/відкриття дропдауну
    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.dropdown-content');
        const button = e.target.closest('.open-delivery-address');
        if (button) {
            dropdown.classList.add('active');
        }
        else {
            dropdown.classList.remove('active');
        }
    })

    let deliveryChoosed = false;
    // Вибір 
    document.addEventListener('click', (e) => {
        const deliveryAddress = e.target.closest('.branches-ul li');
        const openDelivery = document.querySelector('.open-delivery-address');
        const finalDelivery = document.getElementById('final-delivery')

        if (!deliveryAddress) return;

        const error = document.querySelector('.delivery-ul p');
        error.dataset.input = "valid";
        deliveryChoosed = true;
        saveDeliveryPlace(deliveryAddress.textContent);
        openDelivery.textContent = deliveryAddress.textContent;
        finalDelivery.textContent = deliveryAddress.textContent;
    })

    // Адреса доставки
    document.addEventListener('click', (e) => {
        const li = e.target.closest('.delivery-ul > li');
        if (!li) return;

        li.closest('ul').querySelectorAll('li').forEach(el => {
            el.style.color = '';
            el.classList.remove('active');
        })
        li.classList.add('active');
        
        const openDelivery = document.querySelector('.address');
        if (li.closest('#nova-post')) {
            openDelivery.classList.add('active');
        }
        else {
            openDelivery.classList.remove('active');
            const error = document.querySelector('.delivery-ul p');
            error.dataset.input = "valid";
            deliveryChoosed = true;
            saveDeliveryPlace("Самовивіз зі складу");
            const finalDelivery = document.getElementById('final-delivery')
            finalDelivery.textContent = "Самовивіз зі складу";
        }
    })

    let paymentChoosed = false;
    // Вибір способу оплати
    document.addEventListener('click', (e) => {
        const li = e.target.closest('.payment-ul li');
        const error = document.querySelector('.payment-ul p');
        if (!li) return;

        li.closest('ul').querySelectorAll('li').forEach(el => {
            el.style.color = '';
            el.classList.remove('active');
        })
        li.classList.add('active');
        error.dataset.input = "valid";

        paymentChoosed = true;
        savePaymentType(li.textContent.trim());
    })

    document.addEventListener('click', async (e) => {
        e.preventDefault();
        const purchaseBtn = e.target.closest('.make-order')
        if (!purchaseBtn) return;
        try {
            if (deliveryChoosed === false) {
                throw new Error("Delivery not choosed");
            }
            if (paymentChoosed === false) {
                throw new Error("PaymentType not choosed")
            }
            await liqpayRedirect();
        }
        catch (err) {
            if (err.message === "Delivery not choosed") {
                var delivery = document.querySelector('.delivery-ul');
                var errorParagraph = document.querySelector('.delivery-ul p');
                delivery.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
                errorParagraph.dataset.input = "invalid";
            }
            if (err.message === "PaymentType not choosed") {
                var payment = document.querySelector('.payment-ul');
                var errorParagraph = document.querySelector('.payment-ul p');
                payment.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
                errorParagraph.dataset.input = "invalid";
            }
        }
    })
})

// Рендер отделений: Массив строк, forEach по нему, каждой итерации создаёшь li, пишешь textContent, appended в ul. Никакого innerHTML не нужно — это проще и безопаснее.
function createDeliveryUl() {
    const novaPost = {
        1: 'Відділення №1: вул. Пирогівський шлях, 135',
        2: 'Відділення №2: вул. Богатирська, 11',
        3: 'Відділення №3 (до 30 кг на одне місце): вул. Слобожанська,13',
        4: 'Відділення №4 (до 200 кг): вул. Верховинна, 69',
        5: 'Відділення №5 (до 200 кг): вул. Федорова, 32 (м. Олімпійська)',
        6: 'Відділення №6: вул. Миколи Василенка, 2',
        7: 'Відділення №7 (до 10 кг): вул. Гната Хоткевича, 8 (м.Чернігівська)'
    };

    const ul = document.querySelector('.branches-ul');

    Object.values(novaPost).forEach(el => {
        let li = document.createElement('li');

        li.textContent = el;

        ul.appendChild(li);
    })
}

function saveDeliveryPlace(deliveryPlace) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/checkout/delivery`, {
        method: 'POST',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({deliveryPlace})
    })
    .then(res => res.json())
    .then(async (data) => { 
        console.log("Записано місце доставки:", deliveryPlace);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при зменшенні!");
    })
}

function savePaymentType(TypeOfPayment) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/products/checkout/payment`, {
        method: 'POST',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({TypeOfPayment})
    })
    .then(res => res.json())
    .then(async (data) => { 
        console.log("Записано спосіб доставки:", TypeOfPayment);
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при зменшенні!");
    })
}


// Фронт делает fetch на твой бэкенд (/api/checkout/liqpay)
async function liqpayRedirect() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/products/checkout/liqpay`, {
            method: 'POST',
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const { data, signature } = await res.json();

        const form = document.createElement('form');
        form.method = "POST";
        form.action = "https://www.liqpay.ua/api/3/checkout";
        form.acceptCharset = "utf-8";

        const dataInput = document.createElement('input');
        dataInput.type = "hidden";
        dataInput.name = "data";
        dataInput.value = data;

        const signInput = document.createElement('input');
        signInput.type = "hidden";
        signInput.name = "signature";
        signInput.value = signature;

        form.appendChild(dataInput);
        form.appendChild(signInput);
        document.body.appendChild(form);
        form.submit();
    }
    catch (err) {
        console.error('liqpay fetch error:', err);
    }
}

/* function renderUser() {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/user/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(async (data) => { 
        
    })
}   */

function userInfo() {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${token}`,
        }
    })
    .then(res => res.json())
    .then(user => {
        const username = document.querySelector('.user-name');
        const userphn = document.querySelector('.user-phnnumber');
        username.textContent = user.Username;
        userphn.textContent = user.PhoneNumber;
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Помилка при відображенні юзеру!");
    })
}
