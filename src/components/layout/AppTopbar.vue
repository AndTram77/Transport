<script setup>
import { ref } from 'vue'
import { useLayout } from '@/composables/layout'
import { useRouter } from 'vue-router'

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout()
const router = useRouter()

// Имя пользователя из localStorage
const userName = ref(localStorage.getItem('userName') || 'Администратор')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  router.push('/login')
}
</script>

<template>
  <div class="layout-topbar">
    <!-- Кнопка открытия меню -->
    <div class="topbar-left">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu" aria-label="Меню">
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <!-- Название страницы / хлебные крошки -->
    <div class="topbar-center">
      <span class="topbar-title">Transport CRM</span>
    </div>

    <!-- Правая часть: действия -->
    <div class="topbar-right layout-topbar-actions">
      <!-- Переключение темы -->
      <button
        type="button"
        class="layout-topbar-action"
        @click="toggleDarkMode"
        :title="isDarkTheme ? 'Светлая тема' : 'Тёмная тема'"
      >
        <i :class="['pi', isDarkTheme ? 'pi-sun' : 'pi-moon']"></i>
      </button>

      <!-- Профиль -->
      <div class="topbar-user">
        <i class="pi pi-user topbar-user-icon"></i>
        <span class="topbar-user-name">{{ userName }}</span>
        <button
          type="button"
          class="layout-topbar-action"
          @click="handleLogout"
          title="Выйти"
        >
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-topbar {
  position: fixed;
  top: 0;
  left: 16rem;
  right: 0;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: var(--surface-overlay);
  border-bottom: 1px solid var(--surface-border);
  z-index: 998;
  transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Сдвиг топбара при свёрнутом сайдбаре */
:deep(.sidebar-collapsed) ~ .layout-main-container .layout-topbar,
.layout-wrapper.sidebar-collapsed .layout-topbar {
  left: 4.5rem;
}

.topbar-left {
  display: flex;
  align-items: center;
}

.topbar-center {
  flex: 1;
  text-align: center;
}

.topbar-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color-secondary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.layout-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.layout-topbar-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: background 0.2s, color 0.2s;
}

.layout-topbar-action:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}

.layout-menu-button {
  font-size: 1.1rem;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  background: var(--surface-ground);
  margin-left: 0.5rem;
}

.topbar-user-icon {
  color: var(--primary-color);
  font-size: 1rem;
}

.topbar-user-name {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .topbar-title,
  .topbar-user-name {
    display: none;
  }
}
</style>
