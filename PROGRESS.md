# Прогресс разработки — Transport CRM "Мой Парк"

## Текущий статус

**Спринт:** 0 — Фундамент
**Общий прогресс:** ~5% MVP
**Дата последнего обновления:** 2026-04-02

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

### Спринт 0 — Фундамент (текущий)
- [x] AppLayout + AppSidebar + AppTopbar + AppMenu + AppFooter
- [x] composables/layout.js — тема, сворачивание сайдбара
- [x] Страница Login + форма авторизации (LoginView.vue)
- [x] Auth store (Pinia) + router guards
- [ ] Базовые компоненты: StatusBadge, PageHeader, EmptyState
- [ ] Composables: useTable, useForm

### Следующий после Спринта 0
- Спринт 1: Дашборд (KPI, графики)

## Последняя сессия

**Дата:** 2026-04-02
**Что делали:** Аудит состояния проекта, настройка CLAUDE.md и системы памяти
**Следующий шаг:** Начать Спринт 0 — создать AppLayout (sidebar + header), затем авторизацию

## Последняя сессия

**Дата:** 2026-04-10 (сессия 4)
**Что делали:**
- Зафиксировали деплой: сервер 185.233.200.13:3010, Docker + Nginx, без домена (MVP)
- Настроили двупользовательский доступ (hive + new): setgid, group-writable, git sharedRepository
- Прописали токен AndTram77 в git remote URL, добавили в gh config
- Спринт 0: создали AppLayout, AppSidebar, AppTopbar, AppMenu, AppMenuItem, AppFooter
- Спринт 0: создали composables/layout.js (тема, сворачивание сайдбара)
- Спринт 0: создали Auth — LoginView.vue, authStore.js, router guard
**Следующий шаг:** Спринт 0 — базовые компоненты (StatusBadge, PageHeader, EmptyState) + composables (useTable, useForm), затем Спринт 1 — Дашборд

## Решения и заметки

- Integram V2 выбран вместо Laravel + PostgreSQL — не нужен отдельный backend
- PrimeVue 4 — основная библиотека компонентов, кастомные компоненты только при необходимости
- **Деплой:** сервер 185.233.200.13 (ai-agent@), порт 3010, Docker + Nginx reverse proxy
- **Домен:** нет, URL для демо — `http://185.233.200.13:3010` (домен добавим позже)
- **Компоненты брать из integram/** (самая чистая реализация), адаптировать под Transport CRM
- Layout, Auth, DataTable, composables — всё есть готовое, писать с нуля НЕ нужно
