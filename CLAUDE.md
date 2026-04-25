# Transport CRM "Мой Парк" — Инструкция для Claude

## Быстрый старт сессии

**При каждом запуске:**
1. Прочитай `PROGRESS.md` — там текущий статус, последняя сессия и следующий шаг
2. Прочитай `memory/MEMORY.md` — индекс сохранённых решений
3. Кратко сообщи пользователю: где мы остановились и что делаем дальше
4. Жди подтверждения или новой задачи

## Правило памяти — ОБЯЗАТЕЛЬНО

**Сохранять в память СРАЗУ, не откладывая**, когда в разговоре принято любое из:
- Архитектурное решение (стек, библиотека, подход)
- Решение по деплою / серверу / домену
- Решение по интеграции (API, сервис, таблица)
- Договорённость с заказчиком (требование, приоритет, дедлайн)
- Любой факт, который нужно помнить в следующей сессии

**Как сохранять:**
1. Создать/обновить файл в `memory/` (например `project_deploy.md`)
2. Добавить/обновить строку в `memory/MEMORY.md`

**При завершении сессии — финальная проверка:**
Перед коммитом PROGRESS.md спросить себя: *"Всё ли важное из этой сессии записано в memory/?"*
Если нет — сохранить, потом коммитить.

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
| БД / API | Integram V2 (workspace `transport-crm` на ai2o.online) |
| Деплой | Docker + Nginx, сервер 185.233.200.13:3010 |

## Integram — таблицы (workspace: transport-crm, ai2o.online)

| Константа | ID | Таблица | Назначение |
|-----------|-----|---------|-----------|
| DRIVERS | 20 | Водители | ФИО, ВУ, паспорт, баланс, рейтинг |
| VEHICLES | 19 | Автомобили | Номер, VIN, ОСАГО, ТО, статус |
| RIDES | 26 | Рейсы | Маршрут, стоимость, источник |
| SHIFTS | 22 | Смены | Водитель + авто, выручка, пробег |
| FINANCE | 29 | Финансы | Доходы, расходы, выплаты |
| MAINTENANCE | 31 | ТО | Тип, стоимость, сервис |
| USERS | 33 | Пользователи системы | ФИО, email, роль |

Полный список справочников — `shared-memory/project_integram_tables.md`

## Integram API — формат запросов

```js
GET    /transport-crm/{tableId}?JSON              // список записей
GET    /transport-crm/{tableId}/{id}?JSON         // одна запись
POST   /transport-crm/{tableId}?JSON   { ... }    // создать
PUT    /transport-crm/{tableId}/{id}?JSON { ... } // обновить
DELETE /transport-crm/{tableId}/{id}?JSON         // удалить
```

**API URL:** `https://ai2o.online`
**Авторизация:** Bearer token → `VITE_INTEGRAM_TOKEN` в `.env`

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

## Два пользователя — hive и new

Проект ведётся под двумя пользователями на одной машине. Оба имеют полный доступ.

### Настройка доступа (уже сделано под hive)
- Директория проекта: `/home/hive/transport-crm/` — setgid + group-writable (`drwxrwsr-x hive:hive`)
- Git: `core.sharedRepository = group` — новые объекты group-writable
- `new` входит в группу `hive` → полный доступ к файлам проекта

### Первый запуск под пользователем `new`
При ПЕРВОМ открытии проекта под `new` — выполнить ОДИН РАЗ:
```bash
mkdir -p ~/.claude/projects/-home-hive-transport-crm
ln -s /home/hive/transport-crm/shared-memory ~/.claude/projects/-home-hive-transport-crm/memory
```
Это создаёт симлинк на общую память — обе сессии (hive и new) читают и пишут в одно место.

### Push из любого пользователя
Remote настроен с токеном в URL — пуш работает из любого аккаунта:
```bash
git push origin main  # работает и под hive, и под new
```

### Контекст между сессиями
- `PROGRESS.md` — единая точка состояния, читается при любом пользователе
- `CLAUDE.md` — этот файл, инструкции для Claude при любом пользователе
- **Общая память:** `/home/hive/transport-crm/shared-memory/` — физически здесь, доступна обоим
- Память hive: `~/.claude/projects/-home-hive-transport-crm/memory` → симлинк на shared-memory ✅
- Память new: `~/.claude/projects/-home-hive-transport-crm/memory` → симлинк на shared-memory (после первого запуска)
- **ЧИТАТЬ при старте:** `shared-memory/MEMORY.md` — там все решения проекта

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

## Правило верификации — ОБЯЗАТЕЛЬНО

**После любого автоматического или bulk-действия — немедленная проверка результата.**

Это касается: создания схемы БД, массового создания таблиц/колонок/записей, действий через AI-агент Integram, любого внешнего агента или скрипта.

### Алгоритм верификации схемы Integram

После создания или изменения таблиц — выполнить ДО перехода к следующей задаче:

1. `list_tables` — убедиться что все таблицы созданы (количество и имена)
2. `get_table_schema(typeId)` для каждой основной таблицы — сверить колонки со спеком построчно
3. `list_objects(typeId)` для каждого справочника — убедиться что записи созданы без дублей
4. Явно отчитаться Андрею: **что совпало ✅ / что пропущено ⚠️ / что расходится ❌**

### Правило доверия к AI-агентам

**Никогда не верить отчёту AI-агента о выполнении.** Сообщение "Схема готова" или "Создано X таблиц" — не является подтверждением. Всегда проверять результат независимо через MCP или API.

### Definition of Done для схемы БД

Схема считается **готовой** только когда:
- [ ] Каждая таблица проверена через `get_table_schema`
- [ ] Каждая колонка сверена со спеком (тип, связь, название)
- [ ] Каждый справочник проверен через `list_objects` (нет дублей, все записи на месте)
- [ ] Отчёт о верификации предоставлен пользователю
