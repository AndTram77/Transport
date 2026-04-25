# Прогресс разработки — Transport CRM "Мой Парк"

## Текущий статус

**Спринт:** 4 — Смены
**Общий прогресс:** ~55% MVP
**Дата последнего обновления:** 2026-04-25

## Что готово

### Инфраструктура
- [x] Vue 3 + PrimeVue 4 + Pinia + Router + Tailwind
- [x] Vite сборка без ошибок
- [x] Docker + Nginx, деплой на 185.233.200.13:3010 ✅
- [x] GitHub: AndTram77/Transport, ветка main

### API-слой (src/api/)
- [x] Axios instance с Bearer token
- [x] Integram CRUD клиент (list, get, create, update, delete)
- [x] Workspace: transport-crm на ai2o.online (21 таблица)

### Компоненты / Layout
- [x] AppLayout + AppSidebar + AppTopbar + AppMenu
- [x] StatusBadge, PageHeader, EmptyState
- [x] composables: useTable, useForm

### Спринт 0 ✅ ЗАВЕРШЁН
- [x] Авторизация (LoginView + auth store + router guard)
- [x] Layout, sidebar, theme switch

### Спринт 1 ✅ ЗАВЕРШЁН
- [x] Dashboard: 4 KPI-карточки + график выручки 14 дней + последние смены
- [x] useDashboard.js, KpiCard.vue

### Спринт 2 ✅ ЗАВЕРШЁН
- [x] Автопарк: список + CRUD + карточка с 3 табами (Информация / Смены / ТО)
- [x] VehiclesList.vue, VehicleDetail.vue, VehicleDialog.vue, useVehicles.js

### Спринт 3 ✅ ЗАВЕРШЁН
- [x] Водители: список + CRUD + карточка с 3 табами (Профиль / Смены / Финансы)
- [x] DriversList.vue, DriverDetail.vue, DriverDialog.vue, useDrivers.js
- [x] Должники, рейтинг ★, поиск по имени/телефону

## Следующий шаг

**Спринт 4 — Смены (в работе)**
- [ ] useShifts.js — CRUD для таблицы Смены (ID=22)
- [ ] ShiftDialog.vue — форма открытия/закрытия смены
- [ ] ShiftsList.vue — список смен с фильтром по водителю/авто/дате
- [ ] Маршрут /shifts

**Спринт 5 — Финансы**
- [ ] FinanceDashboard.vue — полная реализация
- [ ] Транзакции, выплаты, фильтры

**Спринт 6 — ТО и Договора**
**Спринт 7 — Отчёты**
**Спринт 8 — Деплой / Настройки / Адаптивность**

## Последняя сессия

**Дата:** 2026-04-25
**Что делали:**
- Спринт 3 завершён: useDrivers.js, DriverDialog.vue, DriversList.vue, DriverDetail.vue
- Маршрут /drivers/:id добавлен в router
- Сборка чистая, коммит f3519cb, деплой на 185.233.200.13:3010 ✅

**Следующий шаг:** Спринт 4 — Смены

## Решения и заметки

- Integram workspace: transport-crm на ai2o.online (новый, не kval)
- MCP confirm_action сломан → workaround: browser fetch через page.evaluate()
- PrimeVue компоненты регистрируются глобально в main.js
- Деплой: Docker multi-stage build, git pull + docker build на сервере
- URL демо: http://185.233.200.13:3010
