# Прогресс разработки — Transport CRM "Мой Парк"

## Текущий статус

**Спринт:** 0 — Фундамент
**Спринт 0:** ЗАВЕРШЁН ✅
**Общий прогресс:** ~15% MVP
**Дата последнего обновления:** 2026-04-10

## Что готово

### Инфраструктура
- [x] Vue 3 + PrimeVue 4 + Pinia + Router + Tailwind — настроены
- [x] Vite сборка работает (`npm run dev`)
- [x] Docker Compose (postgres + adminer)
- [x] GitHub репозиторий создан и настроен

### API-слой (src/api/)
- [x] Axios instance с Bearer token и interceptors
- [x] Integram CRUD клиент (list, get, create, update, delete)
- [x] 6 таблиц Integram созданы, ID сконфигурированы

### Роутинг
- [x] 7 маршрутов: dashboard, drivers, vehicles, orders, finance, reports, settings

### Документация
- [x] ТЗ-комбинированное.md — полное ТЗ
- [x] CLAUDE.md — инструкции для Claude

## Что НЕ готово (следующие шаги)

### Спринт 0 — Фундамент ✅ ЗАВЕРШЁН
- [x] AppLayout + AppSidebar + AppTopbar + AppMenu + AppFooter
- [x] composables/layout.js — тема, сворачивание сайдбара
- [x] Страница Login + форма авторизации (LoginView.vue)
- [x] Auth store (Pinia) + router guards
- [x] Базовые компоненты: StatusBadge, PageHeader, EmptyState
- [x] Composables: useTable, useForm

### Следующий после Спринта 0
- Спринт 1: Дашборд (KPI, графики)

## Последняя сессия

**Дата:** 2026-04-02
**Что делали:** Аудит состояния проекта, настройка CLAUDE.md и системы памяти
**Следующий шаг:** Начать Спринт 0 — создать AppLayout (sidebar + header), затем авторизацию

## Последняя сессия

**Дата:** 2026-04-10 (сессия 5)
**Что делали:**
- Спринт 0 закрыт: StatusBadge, PageHeader, EmptyState (src/components/common/)
- Добавлены composables: useTable.js, useForm.js
- Все views обновлены: используют PageHeader + EmptyState + StatusBadge + useTable
- Сборка чистая (0 ошибок), пуш в GitHub
- Настроена файловая память (6 файлов в memory/)
- Обнаружен готовый MCP-сервер transport-memory (memory/bridge.mjs) — сломана авторизация
- Обнаружен пустой mcp__memory граф
- Добавлен промт инициализации нового проекта в общую память
- CLAUDE.md обновлён: правило немедленного сохранения решений

**СТОП-ПОЙНТ — ждём от Андрея:**
- Логин + пароль для Integram ai2o.ru/kval → исправить .mcp.json → починить transport-memory

**Следующий шаг после credentials:**
1. Починить transport-memory MCP (исправить .mcp.json)
2. Заполнить MCP-память всеми фактами проекта
3. Тестирование (npm run dev → login, sidebar, все страницы)
4. Деплой на 185.233.200.13:3010
5. Спринт 1 — Дашборд

## Решения и заметки

- Integram V2 выбран вместо Laravel + PostgreSQL — не нужен отдельный backend
- PrimeVue 4 — основная библиотека компонентов, кастомные компоненты только при необходимости
- **Деплой:** сервер 185.233.200.13 (ai-agent@), порт 3010, Docker + Nginx reverse proxy
- **Домен:** нет, URL для демо — `http://185.233.200.13:3010` (домен добавим позже)
- **Компоненты брать из integram/** (самая чистая реализация), адаптировать под Transport CRM
- Layout, Auth, DataTable, composables — всё есть готовое, писать с нуля НЕ нужно
