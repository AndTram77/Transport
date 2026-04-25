# Прогресс разработки — Transport CRM "Мой Парк"

## Текущий статус

**MVP: ЗАВЕРШЁН ✅**
**Демо-данные: ЗАПОЛНЕНЫ ✅**
**Общий прогресс:** 100% основной функциональности
**Дата завершения:** 2026-04-25
**Деплой:** http://185.233.200.13:3010 (работает)

## Реализованные спринты

| # | Спринт | Статус | Что сделано |
|---|--------|--------|------------|
| 0 | Фундамент | ✅ | Layout, Auth, Router, базовые компоненты |
| 1 | Дашборд | ✅ | 4 KPI + график выручки 14 дней + последние смены |
| 2 | Автопарк | ✅ | Список + CRUD + карточка с 3 табами (Инфо / Смены / ТО) |
| 3 | Водители | ✅ | Список + CRUD + карточка (Профиль / Смены / Финансы), должники |
| 4 | Смены | ✅ | Список + CRUD + фильтры (водитель / статус / дата), итоги |
| 5 | Финансы | ✅ | KPI (доходы/расходы/баланс) + таблица + фильтры |
| 6 | ТО и Договора | ✅ | ТО: CRUD + предупреждения о просрочке; Договора: заглушка |
| 7 | Отчёты | ✅ | 4 отчёта + CSV экспорт |
| 8 | Настройки | ✅ | Компания, тарифы, Яндекс Go, безопасность |

## Демо-данные (заполнено 2026-04-25)

| Таблица | Записей | Примечание |
|---------|---------|-----------|
| Автомобили | 10 | Госномера А777АА18–Т012ТТ18, 1 на ремонте |
| Водители | 15 | ФИО заполнены, 2 временно недоступны, 4 должника |
| Смены | 10 | Тестовый день 25.04.2026, выручка 57 400₽ |
| Финансы | 5 | Комиссия, выплаты, ГСМ, ремонт |
| ТО | 4 | Замена масла, диагностика, колодки, ремонт подвески |

**Известные баги данных** (не блокируют демо фронтенда):
- Комиссия парка у 2 смен (Сидоров/Козлов) хранится как ref — баг Integram
- Рейтинг у 6 водителей показывает "Дата и время" — баг схемы Integram

## Технологический стек

| Слой | Технологии |
|------|-----------|
| Frontend | Vue 3 Composition API + PrimeVue 4 + Pinia + Tailwind CSS |
| HTTP | Axios + Integram V2 REST API |
| Сборка | Vite |
| Деплой | Docker multi-stage + Nginx |
| БД | Integram workspace: transport-crm на ai2o.online |

## Файловая структура

```
src/
├── api/integram.js           # Axios клиент, TABLES IDs
├── composables/
│   ├── useDrivers.js         # Водители CRUD
│   ├── useVehicles.js        # Автомобили CRUD
│   ├── useShifts.js          # Смены CRUD
│   ├── useFinance.js         # Финансы CRUD
│   ├── useMaintenance.js     # ТО CRUD
│   └── useDashboard.js       # Дашборд данные
├── components/
│   ├── common/               # PageHeader, StatusBadge, EmptyState, KpiCard
│   ├── drivers/DriverDialog.vue
│   ├── vehicles/VehicleDialog.vue
│   ├── shifts/ShiftDialog.vue
│   ├── finance/FinanceDialog.vue
│   └── maintenance/MaintenanceDialog.vue
└── views/
    ├── Dashboard.vue
    ├── auth/LoginView.vue
    ├── drivers/DriversList.vue + DriverDetail.vue
    ├── vehicles/VehiclesList.vue + VehicleDetail.vue
    ├── shifts/ShiftsList.vue
    ├── finance/FinanceDashboard.vue
    ├── maintenance/MaintenanceList.vue
    ├── contracts/ContractsView.vue
    ├── reports/ReportsList.vue
    └── settings/Settings.vue
```

## Следующие шаги (пост-демо)

- Протестировать с заказчиком ИЖАВТОХОЛДИНГ
- Исправить баги в Integram платформе (валюта/ref коллизия, confirm_action)
- Договора — полная реализация (если нужна)
- Импорт смен из Яндекс Go API
- Домен для продакшена
- Мобильная адаптивность (проверить на телефоне)

## Доступы

- **Прод:** http://185.233.200.13:3010
- **GitHub:** https://github.com/AndTram77/Transport
- **Integram:** https://ai2o.online/transport-crm/
- **Сервер:** ai-agent@185.233.200.13
