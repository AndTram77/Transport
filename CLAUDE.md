# Transport CRM "Мой Парк" — Инструкция для Claude

## Быстрый старт сессии

**При каждом запуске:**
1. Прочитай `PROGRESS.md` — там текущий статус, последняя сессия и следующий шаг
2. Кратко сообщи пользователю: где мы остановились и что делаем дальше
3. Жди подтверждения или новой задачи

## О проекте

**Transport CRM "Мой Парк"** — веб-CRM для управления таксопарком (50–500+ авто).
Заказчик: ИЖАВТОХОЛДИНГ, регион: Ижевск / Удмуртия.

**Основные модули:** Дашборд, Автопарк, Водители, Смены, Финансы, ТО, Отчёты, Договора, Настройки.

## Технологический стек

| Слой | Технологии |
|------|-----------|
| Frontend | Vue 3 (Composition API) + PrimeVue 4 + Pinia + Vue Router |
| Стили | Tailwind CSS + PrimeIcons |
| Сборка | Vite |
| HTTP | Axios |
| БД / API | Integram V2 (база `kval`, REST API) |
| Деплой | Docker + Nginx, сервер 185.233.200.13:3010 |

## Integram — таблицы (база: kval)

| Таблица | ID | Назначение |
|---------|-----|-----------|
| Transport_Водители | 1875997 | ФИО, ВУ, паспорт, баланс, рейтинг |
| Transport_Автомобили | 1876002 | Номер, VIN, ОСАГО, ТО, статус |
| Transport_Заказы | 1876007 | Маршрут, стоимость, комиссия, агрегатор |
| Transport_Смены | 1876012 | Водитель + авто, выручка, пробег |
| Transport_Финансы | 1876017 | Доходы, расходы, выплаты |
| Transport_ТО | 1876022 | Тип, стоимость, сервис |

## Integram API — формат запросов

```js
GET  /kval/{tableId}?JSON              // список записей
GET  /kval/{tableId}/{id}?JSON         // одна запись
POST /kval/{tableId}?JSON   { ... }    // создать
PUT  /kval/{tableId}/{id}?JSON { ... } // обновить
DELETE /kval/{tableId}/{id}?JSON       // удалить
```

**API URL:** http://localhost:8081 (дев) / https://ai2o.ru (прод)

## Структура проекта

```
src/
├── api/              # Axios + Integram клиент (ГОТОВО)
│   ├── index.js      # Axios instance с Bearer token
│   └── integram.js   # CRUD-методы + ID таблиц
├── views/            # Страницы (пока заглушки)
├── components/       # Переиспользуемые компоненты
├── composables/      # Vue composables
├── stores/           # Pinia stores
├── router/           # Vue Router (маршруты настроены)
└── utils/            # Утилиты
```

## GitHub

- **Репозиторий:** https://github.com/AndTram77/Transport
- **Ветка:** main
- После каждого логического блока работы — коммит + push

## План разработки (9 спринтов)

Полное ТЗ: `ТЗ-комбинированное.md` (раздел 17)

| # | Спринт | Содержание |
|---|--------|-----------|
| 0 | Фундамент | Layout, Auth, базовые компоненты, composables |
| 1 | Дашборд | KPI-виджеты, график выручки, фильтры |
| 2 | Автопарк | CRUD авто, карточка с табами, документы |
| 3 | Водители | CRUD водителей, карточка, должники, Яндекс Go |
| 4 | Смены | Открытие/закрытие, импорт из Яндекс Go |
| 5 | Финансы | Дашборд, транзакции, выплаты |
| 6 | ТО и Договора | Список ТО, плановое ТО, договора |
| 7 | Отчёты | 4 отчёта, Excel/PDF экспорт |
| 8 | Деплой | Настройки, Nginx proxy, Docker, адаптивность |

## Источники готовых компонентов

Стек идентичен проектам Integram, DronDoc 2026 и Fund (VentureOS). При разработке **брать за основу готовые решения**, а не писать с нуля.

### Layout (sidebar, header, footer)
**Источник:** `/home/new/integram/src/components/layout/` (самый чистый вариант)
- `AppLayout.vue`, `AppSidebar.vue`, `AppTopbar.vue`, `AppMenu.vue`, `AppMenuItem.vue`, `AppFooter.vue`
- Composable: `composables/layout.js`

### Auth (login, регистрация, guards)
**Источник:** `/home/new/integram/src/`
- Страницы: `views/pages/auth/Login.vue`, `Register.vue`
- Store: `stores/authStore.js`
- Composable: `composables/useAdminAuth.js`
- Сервисы: `services/unifiedAuthService.js`, `emailAuthService.js`

### Integram DataTable / CRUD
**Источник:** `/home/new/integram/src/components/integram/`
- `DataTable.vue` — основная таблица
- `IntegramDataTableWrapper.vue` — обёртка с Integram backend
- `IntegramForm.vue`, `IntegramFormBuilder.vue` — формы
- `IntegramObjectEditor.vue` — редактор записей
- Composables: `DataTable/composables/` (cell editing, row editing, sort, selection, virtual scroll)
- Диалоги: `DataTable/dialogs/` (ImagePreview, MemoEdit, ConditionalFormatting)
- Утилиты: `DataTable/utils/formatters.js`, `constants.js`

### Composables общего назначения
| Composable | Путь (integram) | Назначение |
|-----------|----------------|-----------|
| useIntegramSession | `composables/useIntegramSession.js` | Сессия Integram |
| useGrants | `composables/useGrants.js` | Права доступа |
| notifications | `composables/notifications.js` | Toast-уведомления |

### Deploy / Vite конфиг
- Vite config: `/home/new/integram/vite.config.mjs`
- Deploy: `/home/new/integram/deploy-vue-to-production.sh`

## Деплой — решения

- **Сервер:** `185.233.200.13` (ai-agent@)
- **Порт:** `3010` (отдельный от BEEBOT)
- **Схема:** Docker контейнер (Vue SPA build) → Nginx reverse proxy → порт 3010
- **Домен:** нет (добавить позже, когда заказчик купит)
- **URL для демо:** `http://185.233.200.13:3010`

## Правила работы

- Код и комментарии — на русском (названия переменных — на английском)
- Vue 3 Composition API (`<script setup>`)
- PrimeVue 4 компоненты — приоритет перед кастомными
- **При создании нового модуля — сначала проверить аналог в integram/dronedoc2026/fund**
- Коммиты на русском: `feat:`, `fix:`, `refactor:`, `docs:`
- Один коммит = одно завершённое действие, пушить сразу
- **При завершении сессии (автоматически):**
  1. Коммит + пуш всей готовой работы
  2. Обновить `PROGRESS.md` (что сделано, следующий шаг, дата)
  3. Коммит + пуш `PROGRESS.md`
