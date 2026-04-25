# Memory — Transport CRM "Мой Парк"

## Индекс файлов памяти

| Файл | Описание |
|------|---------|
| `_SUPER_CONTEXT.md` | Критичный контекст (не потеряется) |
| `feedback_memory_saving.md` | Правило: сохранять решения СРАЗУ |
| `feedback_verification_rule.md` | После bulk-действий — верификация через MCP |

## Правила поведения
- [feedback_memory_saving.md](feedback_memory_saving.md) — сохранять решения СРАЗУ, не откладывать на конец сессии
- [feedback_verification_rule.md](feedback_verification_rule.md) — после любого bulk/AI-агент действия — ОБЯЗАТЕЛЬНАЯ верификация результата через MCP, не верить отчёту агента

## Незавершённое (требует действия Андрея)
- [project_memory_systems.md](project_memory_systems.md) — ❌ СТОП: нужны credentials для ai2o.ru/kval чтобы починить transport-memory MCP

## Консультации
- [consulting_dpt_education.md](consulting_dpt_education.md) — ДПТ для образовательных услуг: налоги, НДС, дробление, АНО, бухпроводки

## Integram — платформа
- [project_integram_api.md](project_integram_api.md) — MCP confirm_action сломан (404); резерв через browser fetch
- [project_integram_findings.md](project_integram_findings.md) — **НОВОЕ 2026-04-25:** честная оценка платформы, критические баги, паттерны работы с VALCOL

## Проект CRM "Мой Парк"
- [project_workspace_structure.md](project_workspace_structure.md) — архитектура workspace AndreyT
- [project_client.md](project_client.md) — заказчик ИЖАВТОХОЛДИНГ, назначение CRM, ТЗ
- [project_stack.md](project_stack.md) — стек: Vue 3 + PrimeVue 4 + Integram V2, без backend
- [project_integram_tables.md](project_integram_tables.md) — ID таблиц Integram (19–33)
- [project_deploy.md](project_deploy.md) — деплой: сервер 185.233.200.13:3010, Docker + Nginx
- [project_github.md](project_github.md) — репо AndTram77/Transport, два пользователя hive/new
- [project_demo_data.md](project_demo_data.md) — **НОВОЕ 2026-04-25:** демо-данные заполнены (10 авто, 15 водителей, 10 смен, финансы, ТО). Известные баги данных.
- [project_progress.md](project_progress.md) — все спринты завершены, MVP задеплоен
