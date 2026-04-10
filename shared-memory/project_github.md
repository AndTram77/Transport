---
name: github_repo
description: GitHub репозиторий и настройки git для Transport CRM
type: project
---

Репозиторий: https://github.com/AndTram77/Transport (аккаунт AndTram77, не gaveron18).
Ветка: `main`.
Remote настроен с токеном в URL — `git push origin main` работает без дополнительной настройки.

Два пользователя на одной машине: `hive` и `new`. Оба имеют полный доступ.
- Директория: `/home/hive/transport-crm/` — setgid + group-writable
- Git: `core.sharedRepository = group`

**Why:** Проект ведётся под двумя пользователями. Репозиторий на аккаунте заказчика AndTram77 (не личный gaveron18).

**How to apply:** Push делать через `git push origin main`. Не использовать `gh` CLI для этого репо без переключения аккаунта на AndTram77.
