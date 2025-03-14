# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

Классы:
-API
Предназначен для взаимодействия с RESTful API и обработки HTTP запросов. Он инкапсулирует базовый URL и параметры запроса, что позволяет легко настраивать и использовать его в различных частях приложения.
baseUrl: string — URL, который будет использоваться для всех запросов.
options: RequestInit — объект с параметрами запроса, такими как заголовки. По умолчанию заголовок Content-Type установлен на application/json.

Методы класса API:

Handle Response: Защищенный метод, который проверяет значение промиса, пропускает запрос если ответ успешен и отклоняет, выводя текст ошибки, в противном случае.
Get: выполняет GET-запрос по указанному URI. Возвращает промис, который разрешается в данные ответа.
Post: выполняет запросы с методами POST, PUT или DELETE по указанному URI с переданными данными. По умолчанию используется метод POST. Возвращает промис, который разрешается в данные ответа.


 Интерфейсы:

- Product: Описывает структуру продукта.
- ProductListResponse: Описывает ответ на запрос списка продуктов.
- ProductItemResponse: Описывает ответ на запрос одного продукта.
- ApiError: Описывает структуру ошибки.
- Order: Описывает структуру заказа.
- OrderResponse: Описывает ответ на создание заказа.

Функции:
- fetchProductList: Получает список продуктов.
- fetchProductItem: Получает один продукт по его ID.
- createOrder: Создает заказ.

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
