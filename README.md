# Тестовое задание AmoCRM

-----
Эндпоинт главного метода `/client/search` принимает query параметры name, phone,
email. Например `/client/search?name=Testing&phone=1234567&email=test@test.ru`

Эндпоинт для кода регистрации `/auth/register`. Также необходимо указать полный
url включая этот ендпоинт в `.env` файле, в переменной `REDIRECT_URI`.

Для хранения токенов используется postgresql, в качестве orm - sequelize. Настройки для подключения к бд так же в `.env`.

