<script setup>
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

// Меню Transport CRM "Мой Парк"
const model = ref([
  {
    label: 'Главная',
    items: [
      { label: 'Дашборд', icon: 'pi pi-fw pi-th-large', to: '/dashboard' },
    ],
  },
  {
    label: 'Управление парком',
    items: [
      { label: 'Автопарк', icon: 'pi pi-fw pi-car', to: '/vehicles' },
      { label: 'Водители', icon: 'pi pi-fw pi-users', to: '/drivers' },
      { label: 'Смены', icon: 'pi pi-fw pi-calendar', to: '/shifts' },
    ],
  },
  {
    label: 'Операции',
    items: [
      { label: 'Заказы', icon: 'pi pi-fw pi-list', to: '/orders' },
      { label: 'Финансы', icon: 'pi pi-fw pi-wallet', to: '/finance' },
    ],
  },
  {
    label: 'Обслуживание',
    items: [
      { label: 'ТО', icon: 'pi pi-fw pi-wrench', to: '/maintenance' },
      { label: 'Договора', icon: 'pi pi-fw pi-file', to: '/contracts' },
    ],
  },
  {
    label: 'Аналитика',
    items: [
      { label: 'Отчёты', icon: 'pi pi-fw pi-chart-bar', to: '/reports' },
    ],
  },
  {
    label: 'Система',
    items: [
      { label: 'Настройки', icon: 'pi pi-fw pi-cog', to: '/settings' },
    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <AppMenuItem :item="item" :index="i" />
      <li class="menu-separator" v-if="i < model.length - 1"></li>
    </template>
  </ul>
</template>

<style scoped>
.menu-separator {
  border-top: 1px solid var(--surface-border);
  margin: 0.25rem 1rem;
}
</style>
