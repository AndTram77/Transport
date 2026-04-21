---
type: critical-context
updated: 2026-04-21
project: transport-crm
---

# SUPER CONTEXT — Transport CRM "Мой Парк"

## Задача проекта

Разработка веб-CRM для управления таксопарком (50–500+ авто) для компании ИЖАВТОХОЛДИНГ в Удмуртии.

**Основные модули:** Дашборд, Автопарк, Водители, Смены, Финансы, ТО, Отчёты, Договора, Настройки.

## Статус (2026-04-21)

**Спринт:** 0 (Фундамент) — ✅ ЗАВЕРШЁН
**Текущий этап:** Проектирование схемы данных Integram — SPEC ГОТОВ, ожидает ревью
**Общий прогресс:** ~15% MVP

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
- ✅ **Spec схемы данных Integram** — `specs/2026-04-21-integram-schema-design.md`

### Блокер РАЗРЕШЁН
- ~~❌ Integram credentials для workspace~~ → ✅ Workspace `taxi` на ai2o.ru, логин: mav / mav
- Старый workspace `kval` с ID ~1.8M — НЕ ИСПОЛЬЗУЕТСЯ
- Новый workspace: `taxi` (ai2o.ru/taxi/)

### Следующий шаг
1. Андрей ревьюит spec схемы данных
2. Создать план реализации (writing-plans skill)
3. Реализовать схему в Integram workspace `taxi` через MCP
4. Обновить `src/api/integram.js` — новые ID таблиц, workspace `taxi`
5. Далее — Спринт 1 (Дашборд)

## Технологический стек

| Слой | Технологии |
|------|-----------|
| Frontend | Vue 3 Composition API + PrimeVue 4 + Pinia + Tailwind |
| Сборка | Vite |
| HTTP | Axios |
| БД | Integram (REST API, workspace `taxi` на ai2o.ru) |
| Деплой | Docker + Nginx, сервер 185.233.200.13:3010 |

## Integram — НОВАЯ СХЕМА (workspace taxi)

**Spec:** `specs/2026-04-21-integram-schema-design.md`

**Архитектура:** плоская структура, 21 таблица (14 справочников + 7 основных), связи через ref-колонки.

**Справочники (14):** Роли, Пол, Статусы водителей, Статусы авто, Статусы смен, Статусы рейсов, Марки авто, Типы кузова, Типы топлива, Способы оплаты, Источники заказа, Типы работ ТО, Типы финоперации, Категории финансов

**Основные (7):** Пользователи, Водители, Автомобили, Смены, Рейсы, Финансы, ТО

**Роли CRM:** Админ, Диспетчер, Механик, Бухгалтер, Водитель

**Существующие таблицы в taxi** (черновик, будут удалены/скрыты):
Пользователь(18), Роль(42), Пол(1022), Автомобиль(1029), Марка(1030), Водитель(1038), Рейтинг(1042), Клиент(1053), Рейс(1057), Состав работ(1076)

## Integram доступы

- **Workspace:** taxi
- **URL:** ai2o.ru/taxi/
- **Логин:** mav
- **Пароль:** mav
- **MCP:** текущий MCP-сервер integram НЕ имеет доступа к taxi (нет в list_workspaces). Нужно: либо добавить taxi в MCP-аккаунт, либо работать через Playwright

## Яндекс Такси (задел)

- Clid: taxi/park/598ce48e692b4b09815b730121925861
- API-ключ: EbzRXWwKkDqrQSVOrzFDjUbBuyORmtPRSF
- ID парка: 598ce48e692b4b09815b730121925861
- Интеграция — позже, но учтена в схеме (поле "Источник заказа" = "Яндекс")

## Два пользователя (hive и new)

- Проект: `/home/hive/transport-crm/` (setgid + group-writable)
- Память: `/home/hive/transport-crm/shared-memory/` (общая для обоих)
- Git: Push работает из обоих аккаунтов (токен в URL)
- **Внимание:** директория `docs/` принадлежит `new`, hive не может создавать в ней поддиректории. Specs хранятся в `specs/` (корень проекта).

## План разработки (9 спринтов)

| # | Спринт | Статус |
|---|--------|--------|
| 0 | Фундамент | ✅ ГОТОВО |
| 0.5 | Схема данных Integram | ⏳ SPEC ГОТОВ, реализация следующая |
| 1 | Дашборд | ❌ |
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
- **Integram:** ai2o.ru/taxi/ (логин: mav/mav)
- **Prod VPS:** 185.233.200.13, host: vm3881174.firstbyte.club, user: ai-agent, key: ~/.ssh/id_ed25519

## Если что-то забыли

Проверь в этом порядке:
1. `shared-memory/MEMORY.md` — индекс всех файлов
2. `specs/2026-04-21-integram-schema-design.md` — утверждённая схема данных
3. `PROGRESS.md` — статус проекта
4. `CLAUDE.md` — инструкции
5. `shared-memory/[файл].md` — детальный анализ
