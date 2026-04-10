<script setup>
import { computed, ref, watch } from 'vue'
import { useLayout } from '@/composables/layout'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import AppFooter from './AppFooter.vue'

const { layoutConfig, layoutState, isSidebarActive } = useLayout()

const outsideClickListener = ref(null)

watch(isSidebarActive, (newVal) => {
  if (newVal) bindOutsideClickListener()
  else unbindOutsideClickListener()
})

const containerClass = computed(() => ({
  'layout-overlay': layoutConfig.menuMode === 'overlay',
  'layout-static': layoutConfig.menuMode === 'static',
  'layout-static-inactive':
    layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
  'layout-overlay-active': layoutState.overlayMenuActive,
  'layout-mobile-active': layoutState.staticMenuMobileActive,
  'sidebar-collapsed': layoutState.sidebarCollapsed,
}))

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive = false
        layoutState.staticMenuMobileActive = false
        layoutState.menuHoverActive = false
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event) {
  const sidebarEl = document.querySelector('.layout-sidebar')
  const topbarEl = document.querySelector('.layout-menu-button')
  return !(
    sidebarEl?.isSameNode(event.target) ||
    sidebarEl?.contains(event.target) ||
    topbarEl?.isSameNode(event.target) ||
    topbarEl?.contains(event.target)
  )
}
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <AppSidebar />
    <div class="layout-main-container">
      <AppTopbar />
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>
    <div class="layout-mask animate-fadein" @click="() => { layoutState.overlayMenuActive = false; layoutState.staticMenuMobileActive = false }"></div>
  </div>
  <Toast />
</template>

<style>
/* =====================
   Базовые переменные
   ===================== */
:root {
  --sidebar-width: 16rem;
  --sidebar-collapsed-width: 4.5rem;
  --topbar-height: 4rem;
}

/* =====================
   Wrapper
   ===================== */
.layout-wrapper {
  min-height: 100vh;
}

/* =====================
   Main container
   ===================== */
.layout-main-container {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-collapsed .layout-main-container {
  margin-left: var(--sidebar-collapsed-width);
}

/* =====================
   Main content area
   ===================== */
.layout-main {
  flex: 1;
  padding: 1.5rem;
  margin-top: var(--topbar-height);
}

/* =====================
   Topbar сдвигается при свернутом сайдбаре
   ===================== */
.sidebar-collapsed .layout-topbar {
  left: var(--sidebar-collapsed-width) !important;
}

/* =====================
   Mask (overlay mode / mobile)
   ===================== */
.layout-mask {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.layout-mobile-active .layout-mask {
  display: block;
}

/* =====================
   Menu items
   ===================== */
.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.layout-root-menuitem > .layout-menuitem-root-text {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.06rem;
  color: var(--text-color-secondary);
  padding: 0.75rem 1rem 0.25rem 1rem;
}

.layout-menuitem-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 0.375rem;
  margin: 0.1rem 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}

.layout-menuitem-link:hover {
  background: var(--surface-hover);
  color: var(--primary-color);
}

.layout-menuitem-link.active-route {
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
}

.layout-menuitem-icon {
  font-size: 1rem;
  flex-shrink: 0;
  width: 1.25rem;
  text-align: center;
}

.layout-menuitem-text {
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s ease;
}

/* Свернутый сайдбар: скрыть текст и заголовки групп */
.sidebar-collapsed .layout-menuitem-text,
.sidebar-collapsed .layout-menuitem-root-text,
.sidebar-collapsed .menu-separator {
  display: none;
}

.sidebar-collapsed .layout-menuitem-link {
  justify-content: center;
  padding: 0.6rem;
  margin: 0.1rem auto;
  width: 2.75rem;
}

/* =====================
   Submenu transition
   ===================== */
.layout-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.layout-submenu-enter-active,
.layout-submenu-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease;
  max-height: 400px;
}

.layout-submenu-enter-from,
.layout-submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

/* =====================
   Адаптивность (мобильные)
   ===================== */
@media (max-width: 991px) {
  .layout-main-container {
    margin-left: 0 !important;
  }

  .layout-topbar {
    left: 0 !important;
  }

  .layout-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease, width 0.2s ease;
  }

  .layout-mobile-active .layout-sidebar {
    transform: translateX(0);
  }
}
</style>
