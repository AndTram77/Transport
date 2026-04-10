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
- [ ] AppLayout + AppSidebar + AppHeader
- [ ] Страница Login + форма авторизации
- [ ] Auth store (Pinia) + router guards
- [ ] Таблица Transport_Пользователи в Integram
- [ ] Базовые компоненты: StatusBadge, PageHeader, ConfirmDialog, EmptyState
- [ ] Composables: useTable, useForm

### Следующий после Спринта 0
- Спринт 1: Дашборд (KPI, графики)

## Последняя сессия

**Дата:** 2026-04-02
**Что делали:** Аудит состояния проекта, настройка CLAUDE.md и системы памяти
**Следующий шаг:** Начать Спринт 0 — создать AppLayout (sidebar + header), затем авторизацию

## Последняя сессия

**Дата:** 2026-04-02 (сессия 3)
**Что делали:**
- Аудит состояния проекта (~5% MVP, Спринт 0 не начат)
- Настроена система памяти и PROGRESS.md для непрерывности между сессиями
- Аудит родственных проектов (integram, dronedoc2026, fund) — стек идентичный
- Найдены и задокументированы готовые компоненты для переиспользования (Layout, Auth, DataTable)
- Обновлён CLAUDE.md: источники компонентов, правила завершения сессии
- Исправлен рендеринг Markdown-таблиц в ТЗ на GitHub (расширены разделители)
**Следующий шаг:** Начать Спринт 0 — скопировать и адаптировать Layout из integram/, затем Auth

## Решения и заметки

- Integram V2 выбран вместо Laravel + PostgreSQL — не нужен отдельный backend
- PrimeVue 4 — основная библиотека компонентов, кастомные компоненты только при необходимости
- **Деплой:** сервер 185.233.200.13 (ai-agent@), порт 3010, Docker + Nginx reverse proxy
- **Домен:** нет, URL для демо — `http://185.233.200.13:3010` (домен добавим позже)
- **Компоненты брать из integram/** (самая чистая реализация), адаптировать под Transport CRM
- Layout, Auth, DataTable, composables — всё есть готовое, писать с нуля НЕ нужно
