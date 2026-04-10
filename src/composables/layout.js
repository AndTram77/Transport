import { computed, reactive } from 'vue'

// Инициализация темы из localStorage
const getInitialDarkTheme = () => {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('darkTheme')
  return saved ? JSON.parse(saved) : false
}

// Инициализация состояния сайдбара из localStorage
const getInitialSidebarCollapsed = () => {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('sidebarCollapsed')
  return saved ? JSON.parse(saved) : false
}

const layoutConfig = reactive({
  preset: 'Aura',
  primary: 'blue',
  surface: 'slate',
  darkTheme: getInitialDarkTheme(),
  menuMode: 'static',
})

const layoutState = reactive({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: null,
  sidebarCollapsed: getInitialSidebarCollapsed(),
})

// Применяем начальную тему
if (typeof window !== 'undefined') {
  document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme)
}

export function useLayout() {
  const toggleMenu = () => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive
    }
    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }
  }

  const toggleSidebarCollapse = () => {
    layoutState.sidebarCollapsed = !layoutState.sidebarCollapsed
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(layoutState.sidebarCollapsed))
    }
  }

  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      executeDarkModeToggle()
      return
    }
    document.startViewTransition(() => executeDarkModeToggle())
  }

  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkTheme', JSON.stringify(layoutConfig.darkTheme))
      document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme)
    }
  }

  const setActiveMenuItem = (item) => {
    layoutState.activeMenuItem = item?.value ?? item ?? null
  }

  const isSidebarActive = computed(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
  )

  const isDarkTheme = computed(() => layoutConfig.darkTheme)

  return {
    layoutConfig,
    layoutState,
    toggleMenu,
    toggleSidebarCollapse,
    toggleDarkMode,
    setActiveMenuItem,
    isSidebarActive,
    isDarkTheme,
  }
}
