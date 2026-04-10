---
name: tech_stack
description: Технологический стек и ключевые архитектурные решения Transport CRM
type: project
---

Frontend: Vue 3 (Composition API, `<script setup>`) + PrimeVue 4 + Pinia + Vue Router + Tailwind CSS + Vite.
Backend/БД: Integram V2 (база `kval`) — REST API, без отдельного backend-сервера.
HTTP-клиент: Axios с Bearer token и interceptors (`src/api/index.js`).

**Why:** Integram V2 выбран вместо Laravel + PostgreSQL — не нужен отдельный backend, быстрее в разработке, уже используется в других проектах (BEEBOT, integram/).

**How to apply:** При разработке любого модуля — не писать backend, всё через `integram.js`. Компоненты брать из `/home/new/integram/src/` (самая чистая реализация), адаптировать под Transport CRM.
