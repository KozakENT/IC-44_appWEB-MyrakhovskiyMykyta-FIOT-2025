# IC-44_appWEB-MyrakhovskiyMykyta-FIOT-2025

# OnlyFresh
Інтернет-магазин морепродуктів з адаптивним інтерфейсом.  

## Запуск
Перед початком переконайтеся, що у вас встановлено:
* **Node.js** (рекомендована версія >= 20)
  Перевірка встановлення:

2. Клонування репозиторію
git clone https://github.com/KozakENT/IC-44_appWEB-MyrakhovskiyMykyta-FIOT-2025
cd IC-44_appWEB-MyrakhovskiyMykyta-FIOT-2025

3. Встановлення залежностей
У кореневій папці проєкту виконайте:
npm install

Це встановить усі необхідні пакети, зазначені у `package.json`.
Основні технології, що використовуються:
* **Express.js** — серверний фреймворк Node.js
* **bcrypt** — хешування паролів
* **mssql** — для роботи з базою даних
* **jsonwebtoken** — авторизація через JWT
* **cors, dotenv** — налаштування середовища та безпеки

## 4. Налаштування середовища

1. Створіть файл `db.js` у папці config 

2. Заповніть ключові параметри:
const dbConfig = {
    user:'Admin',
    password:'admin12345',
    server:'localhost',
    database:'OnlyFreshBD',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
}  

## 6. Запуск сервера

Для запуску локально:

npm run .\config\app.js

Сервер за замовчуванням буде доступний за адресою:

http://localhost:3000

## 8. Фронтенд 

Сайт буде доступний за `http://localhost:5500`


