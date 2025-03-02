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
