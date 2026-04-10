import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('crm_token') || null)
  const userName = ref(localStorage.getItem('crm_user') || '')

  const isAuthenticated = computed(() => !!token.value)

  function login(user, password) {
    // Проверяем логин/пароль из .env (с fallback на admin/admin для демо)
    const validLogin    = import.meta.env.VITE_ADMIN_LOGIN    || 'admin'
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

    if (user === validLogin && password === validPassword) {
      const fakeToken = btoa(`${user}:${Date.now()}`)
      token.value    = fakeToken
      userName.value = user
      localStorage.setItem('crm_token', fakeToken)
      localStorage.setItem('crm_user',  user)
      return true
    }
    return false
  }

  function logout() {
    token.value    = null
    userName.value = ''
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user')
  }

  return { token, userName, isAuthenticated, login, logout }
})
