<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router   = useRouter()
const authStore = useAuthStore()

const login    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

const handleSubmit = async () => {
  error.value = ''
  if (!login.value || !password.value) {
    error.value = 'Введите логин и пароль'
    return
  }
  loading.value = true
  // Небольшая задержка для UX
  await new Promise(r => setTimeout(r, 400))
  const ok = authStore.login(login.value, password.value)
  loading.value = false
  if (ok) {
    router.push('/dashboard')
  } else {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Логотип -->
      <div class="login-logo">
        <i class="pi pi-car"></i>
        <span>Мой Парк</span>
      </div>
      <p class="login-subtitle">Transport CRM — ИЖАВТОХОЛДИНГ</p>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="field">
          <label for="login">Логин</label>
          <InputText
            id="login"
            v-model="login"
            placeholder="Введите логин"
            class="w-full"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="password">Пароль</label>
          <Password
            id="password"
            v-model="password"
            placeholder="Введите пароль"
            class="w-full"
            :feedback="false"
            toggleMask
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <Message v-if="error" severity="error" :closable="false" class="mb-3">
          {{ error }}
        </Message>

        <Button
          type="submit"
          label="Войти"
          icon="pi pi-sign-in"
          class="w-full"
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
}

.login-card {
  width: 100%;
  max-width: 24rem;
  padding: 2.5rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.login-logo i {
  font-size: 2rem;
  color: var(--primary-color);
}

.login-logo span {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.login-subtitle {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}
</style>
