---
type: critical-context
updated: 2026-04-17
project: transport-crm
---

# SUPER CONTEXT — Transport CRM "Мой Парк"

## Задача проекта

Разработка веб-CRM для управления таксопарком (50–500+ авто) для компании ИЖАВТОХОЛДИНГ в Удмуртии.

**Основные модули:** Дашборд, Автопарк, Водители, Смены, Финансы, ТО, Отчёты, Договора, Настройки.

## Статус (2026-04-17)

**Спринт:** 0 (Фундамент) — ✅ ЗАВЕРШЁН
**Общий прогресс:** ~15% MVP
**Дата последнего обновления:** 2026-04-10

### Что готово
- ✅ Vue 3 + PrimeVue 4 + Pinia + Router + Tailwind (настроены)
- ✅ Vite сборка
- ✅ Docker Compose (postgres + adminer)
- ✅ GitHub репозиторий (AndTram77/Transport)
- ✅ API-слой (Axios + Integram CRUD)
- ✅ Layout (AppLayout, Sidebar, Topbar, Footer)
- ✅ Auth система (Login, stores, guards)
- ✅ Компоненты (StatusBadge, PageHeader, EmptyState)
- ✅ Composables (useTable, useForm)

### Что НЕ готово (стоп-пойнт)
- ❌ Integram credentials для ai2o.ru/kval (нужны для MCP)
- ❌ transport-memory MCP (ломается без credentials)

## Технологический стек

| Слой | Технологии |
|------|-----------|
| Frontend | Vue 3 Composition API + PrimeVue 4 + Pinia + Tailwind |
| Сборка | Vite |
| HTTP | Axios |
| БД | Integram V2 (REST API, база kval) |
| Деплой | Docker + Nginx, сервер 185.233.200.13:3010 |

## Integram таблицы (ID в базе kval)

| Таблица | ID | Назначение |
|---------|-----|-----------|
| Transport_Водители | 1875997 | ФИО, ВУ, паспорт, баланс, рейтинг |
| Transport_Автомобили | 1876002 | Номер, VIN, ОСАГО, ТО, статус |
| Transport_Заказы | 1876007 | Маршрут, стоимость, комиссия |
| Transport_Смены | 1876012 | Водитель + авто, выручка, пробег |
| Transport_Финансы | 1876017 | Доходы, расходы, выплаты |
| Transport_ТО | 1876022 | Тип, стоимость, сервис |

## Два пользователя (hive и new)

- Проект: `/home/hive/transport-crm/` (setgid + group-writable)
- Память: `/home/hive/transport-crm/shared-memory/` (общая для обоих)
- Git: Push работает из обоих аккаунтов (токен в URL)

## План разработки (9 спринтов)

| # | Спринт | Статус |
|---|--------|--------|
| 0 | Фундамент | ✅ ГОТОВО |
| 1 | Дашборд | ⏳ СЛЕДУЮЩИЙ |
| 2 | Автопарк | ❌ |
| 3 | Водители | ❌ |
| 4 | Смены | ❌ |
| 5 | Финансы | ❌ |
| 6 | ТО и Договора | ❌ |
| 7 | Отчёты | ❌ |
| 8 | Деплой и адаптивность | ❌ |

## Дедлайн

⏳ **Не установлен** — уточнить с заказчиком

## Контакты и доступы

- **VPS:** ai-agent@185.233.200.13 (деплой)
- **GitHub:** https://github.com/AndTram77/Transport
- **Integram API:** https://ai2o.ru (прод) / http://localhost:8081 (дев)
- **Credentials:** ⏳ НУЖНЫ для ai2o.ru/kval

## Если что-то забыли

Проверь в этом порядке:
1. `shared-memory/MEMORY.md` — индекс всех файлов
2. `PROGRESS.md` — статус проекта
3. `CLAUDE.md` — инструкции
4. `shared-memory/[файл].md` — детальный анализ
