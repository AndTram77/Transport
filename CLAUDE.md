# Transport CRM — Инструкция для Claude

## Что это за проект

**Transport CRM** — система управления таксопарком. Разрабатывается для автоматизации операций: управление водителями, автопарком, заказами и финансами.

GitHub: https://github.com/AndTram77/Transport

## Технологический стек

- **Frontend**: Vue 3 + PrimeVue 4 + Vite + Pinia + Vue Router
- **Стили**: Tailwind CSS + PrimeIcons
- **База данных**: PostgreSQL 16 (Docker)
- **HTTP-клиент**: Axios
- **DB Admin UI**: Adminer (порт 8080)

## Структура проекта

```
src/
├── views/            # Страницы приложения
│   ├── drivers/      # Управление водителями
│   ├── vehicles/     # Управление автопарком
│   ├── orders/       # Заказы и диспетчеризация
│   ├── finance/      # Финансы и аналитика
│   ├── reports/      # Отчёты
│   └── settings/     # Настройки
├── components/       # Переиспользуемые компоненты
├── composables/      # Vue composables
├── stores/           # Pinia stores
├── router/           # Vue Router
├── api/              # API-клиент (Axios)
└── utils/            # Утилиты

backend/
├── db/
│   └── init.sql      # Схема БД (расширяется по ТЗ)
├── api/              # REST API (будет добавлен)
└── services/         # Бизнес-логика
```

## Как запустить

```bash
# Запустить БД
docker-compose up -d

# Запустить фронтенд
npm install
npm run dev          # http://localhost:5173

# Adminer (управление БД)
# http://localhost:8080
# Server: postgres, User: crm_user, Pass: crm_pass, DB: transport_crm
```

## Статус

- [ ] ТЗ получено (ожидается)
- [x] Репозиторий склонирован
- [x] Базовая структура Vue 3 + PrimeVue 4
- [x] Docker Compose для PostgreSQL
- [ ] Схема БД (после ТЗ)
- [ ] API (после ТЗ)
- [ ] UI компоненты (после ТЗ)

## Рабочая ветка

Основная ветка: `main`
