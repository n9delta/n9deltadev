# N9Δ

Для того, чтобы начать работать с ботом нужно создать файл .env по примеру ниже
```
TOKEN="ТОКЕН_БОТА"
ID="АЙДИ_БОТА"
GUILD="АЙДИ_СЕРВЕРА"
ADMINS=АЙДИ_АДМИНА,АЙДИ_АДМИНА_2,...
APIKEY="ТОКЕН_КИВИ"
PHONE="НОМЕР_КИВИ_С_7_БЕЗ_ПЛЮСА"
```

И запустить соответствующий скрипт
- npm run start // Запуск бота
- npm run slashInit // Добавление команд на сервер
- npm run dbSync // Синхронизация базы данных
- npm run dbInit // Синхронизация базы данных с обнулением данных таблиц
