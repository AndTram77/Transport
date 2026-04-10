<script setup>
import { ref } from 'vue'
import { useLayout } from '@/composables/layout'
import AppMenu from './AppMenu.vue'

const { layoutState, toggleSidebarCollapse } = useLayout()
</script>

<template>
  <div class="layout-sidebar" :class="{ 'sidebar-collapsed': layoutState.sidebarCollapsed }">
    <!-- Логотип -->
    <div class="sidebar-logo">
      <router-link to="/dashboard" class="logo-link">
        <i class="pi pi-car logo-icon"></i>
        <span class="logo-text">Мой Парк</span>
      </router-link>
      <Button
        :icon="layoutState.sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        @click="toggleSidebarCollapse"
        text
        rounded
        class="sidebar-toggle-btn"
        v-tooltip.right="layoutState.sidebarCollapsed ? 'Развернуть' : 'Свернуть'"
        aria-label="Переключить меню"
      />
    </div>

    <!-- Меню -->
    <div class="sidebar-menu-container">
      <AppMenu />
    </div>
  </div>
</template>

<style scoped>
.layout-sidebar {
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 16rem;
  background: var(--surface-overlay);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.layout-sidebar.sidebar-collapsed {
  width: 4.5rem;
}

/* Логотип */
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--surface-border);
  min-height: 4rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  overflow: hidden;
}

.logo-icon {
  font-size: 1.4rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-color);
  white-space: nowrap;
  transition: opacity 0.2s ease, width 0.2s ease;
}

.sidebar-collapsed .logo-text {
  opacity: 0;
  width: 0;
}

.sidebar-toggle-btn {
  flex-shrink: 0;
}

.sidebar-collapsed .sidebar-toggle-btn {
  margin: 0 auto;
}

.sidebar-collapsed .sidebar-logo {
  justify-content: center;
}

/* Меню */
.sidebar-menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0;
}

.sidebar-menu-container::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu-container::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 4px;
}
</style>
