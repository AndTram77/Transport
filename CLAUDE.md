# Transport CRM — Инструкция для Claude

## Что это за проект

**Transport CRM** — система управления таксопарком. Разрабатывается для автоматизации операций: управление водителями, автопарком, заказами и финансами.

GitHub: https://github.com/AndTram77/Transport

## Технологический стек

- **Frontend**: Vue 3 + PrimeVue 4 + Vite + Pinia + Vue Router
- **Стили**: Tailwind CSS + PrimeIcons
- **База данных**: Integram V2 (kval) — основная БД
- **HTTP-клиент**: Axios
- **Integram API**: http://localhost:8081 (локально) / https://ai2o.ru (прод)

## Integram — таблицы проекта (база: kval)

| Таблица | ID | Описание |
|---|---|---|
| Transport_Водители | 1875997 | Водители: ФИО, ВУ, паспорт, баланс, рейтинг |
| Transport_Автомобили | 1876002 | Авто: номер, VIN, ОСАГО, ТО, статус |
| Transport_Заказы | 1876007 | Заказы: маршрут, стоимость, комиссия, агрегатор |
| Transport_Смены | 1876012 | Смены: водитель + авто, выручка, пробег |
| Transport_Финансы | 1876017 | Транзакции: доходы, расходы, выплаты |
| Transport_ТО | 1876022 | Техобслуживание: тип, стоимость, сервис |

## Структура проекта

```
src/
├── views/            # Страницы приложения
│   ├── Dashboard.vue          # Главная
│   ├── drivers/               # Управление водителями
│   ├── vehicles/              # Управление автопарком
│   ├── orders/                # Заказы и диспетчеризация
│   ├── finance/               # Финансы и аналитика
│   ├── reports/               # Отчёты
│   └── settings/              # Настройки
├── components/       # Переиспользуемые компоненты
├── composables/      # Vue composables
├── stores/           # Pinia stores
├── router/           # Vue Router
├── api/              # API-клиент (Axios → Integram)
└── utils/            # Утилиты
```

## Integram API — как работать

```js
// Прочитать водителей
GET /kval/1875997?JSON

// Создать водителя
POST /kval/1875997?JSON
{ "ФИО": "Иванов И.И.", "Телефон": "+7..." }

// Обновить запись
PUT /kval/1875997/{id}?JSON
```

## Как запустить

```bash
npm install
npm run dev    # http://localhost:5173
```

## Переменные окружения

```
VITE_INTEGRAM_URL=http://localhost:8081
VITE_INTEGRAM_DB=kval
VITE_INTEGRAM_TOKEN=...
```

## Статус

- [x] Репозиторий склонирован
- [x] Vue 3 + PrimeVue 4 + Pinia + Router + Tailwind
- [x] Integram выбран как основная БД
- [x] 6 таблиц созданы в Integram (база kval)
- [ ] ТЗ получено (ожидается)
- [ ] API-слой для Integram
- [ ] UI компоненты
