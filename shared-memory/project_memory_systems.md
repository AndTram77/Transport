---
name: memory_systems_status
description: Состояние трёх систем памяти Transport CRM и что нужно сделать
type: project
---

В проекте обнаружены три системы памяти (сессия 5, 2026-04-10):

## 1. Файловая память ✅ РАБОТАЕТ
Путь: `/home/hive/.claude/projects/-home-hive-transport-crm/memory/`
6 файлов: client, stack, integram_tables, deploy, github, progress.
Читается через CLAUDE.md автоматически.

## 2. transport-memory MCP ❌ НУЖНЫ CREDENTIALS
Файл: `/home/hive/transport-crm/memory/bridge.mjs` — готовый Node.js MCP-сервер.
Конфиг: `/home/hive/transport-crm/.mcp.json`
Сервер: `https://ai2o.ru`, база: `kval`
Текущие credentials (`unidel@yandex.ru` / `Denver2035`) — НЕ РАБОТАЮТ.

**СЛЕДУЮЩИЙ ШАГ:** Андрей даёт правильный логин+пароль от ai2o.ru/kval →
исправить `.mcp.json` → проверить `memory_stats` → заполнить память через MCP.

Возможности MCP-сервера:
- memory_save — сохранить факт (type/name/content)
- memory_search — семантический + текстовый поиск
- memory_remember — контекст по теме
- memory_list — список всех записей
- memory_shared_state — KV-стейт между сессиями

## 3. mcp__memory граф (Neo4j) ⚪ ПУСТОЙ
Инструменты: mcp__memory__read_graph, mcp__memory__search_nodes и др.
Сейчас пустой. Можно использовать для хранения связей между фактами.
Решение об использовании — после того как разберёмся с transport-memory.

**Why:** transport-memory хранит память в Integram (та же база что и данные CRM) — удобно,
всё в одном месте. Семантический поиск лучше чем просто файлы.

**How to apply:** Как только получим credentials — сразу исправить .mcp.json и заполнить
память через MCP. После этого обновить промт инициализации нового проекта — добавить шаг
настройки MCP-памяти.
