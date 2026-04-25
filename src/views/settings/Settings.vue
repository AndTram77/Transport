<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'

const toast = useToast()

const activeTab = ref(0)
const tabs = [
  { label: 'Компания',      icon: 'pi pi-building' },
  { label: 'Тарифы',        icon: 'pi pi-percentage' },
  { label: 'Яндекс Go',     icon: 'pi pi-car' },
  { label: 'Безопасность',  icon: 'pi pi-shield' },
]

// Компания
const company = ref({
  name:    localStorage.getItem('crm_company_name')    || '',
  inn:     localStorage.getItem('crm_company_inn')     || '',
  address: localStorage.getItem('crm_company_address') || '',
  phone:   localStorage.getItem('crm_company_phone')   || '',
  email:   localStorage.getItem('crm_company_email')   || '',
})

function saveCompany() {
  for (const [k, v] of Object.entries(company.value)) {
    localStorage.setItem(`crm_company_${k}`, v)
  }
  toast.add({ severity: 'success', summary: 'Сохранено', life: 3000 })
}

// Тарифы
const tariff = ref({
  parkPercent: parseFloat(localStorage.getItem('crm_tariff_parkPercent') || '15'),
  driverPercent: parseFloat(localStorage.getItem('crm_tariff_driverPercent') || '85'),
  minPayout: parseFloat(localStorage.getItem('crm_tariff_minPayout') || '0'),
  payoutDay: parseInt(localStorage.getItem('crm_tariff_payoutDay') || '1'),
})

function saveTariff() {
  for (const [k, v] of Object.entries(tariff.value)) {
    localStorage.setItem(`crm_tariff_${k}`, v)
  }
  toast.add({ severity: 'success', summary: 'Сохранено', life: 3000 })
}

// Яндекс Go
const yandex = ref({
  parkId:  localStorage.getItem('crm_yandex_parkId')  || '',
  apiKey:  localStorage.getItem('crm_yandex_apiKey')  || '',
  enabled: localStorage.getItem('crm_yandex_enabled') === 'true',
})

function saveYandex() {
  localStorage.setItem('crm_yandex_parkId',  yandex.value.parkId)
  localStorage.setItem('crm_yandex_apiKey',  yandex.value.apiKey)
  localStorage.setItem('crm_yandex_enabled', yandex.value.enabled)
  toast.add({ severity: 'success', summary: 'Сохранено', life: 3000 })
}

// Безопасность
const security = ref({
  login:    localStorage.getItem('crm_login')    || 'admin',
  password: '',
  confirm:  '',
})
const pwError = ref('')

function savePassword() {
  pwError.value = ''
  if (!security.value.password) { pwError.value = 'Введите новый пароль'; return }
  if (security.value.password !== security.value.confirm) { pwError.value = 'Пароли не совпадают'; return }
  if (security.value.password.length < 6) { pwError.value = 'Минимум 6 символов'; return }
  localStorage.setItem('crm_admin_password', security.value.password)
  security.value.password = ''
  security.value.confirm  = ''
  toast.add({ severity: 'success', summary: 'Пароль изменён', life: 3000 })
}
</script>

<template>
  <div>
    <Toast />

    <PageHeader title="Настройки" subtitle="Параметры системы и таксопарка" icon="pi pi-cog" />

    <!-- Табы -->
    <div class="flex gap-2 border-b border-surface-200 dark:border-surface-700 mb-6">
      <button
        v-for="(tab, i) in tabs" :key="i"
        @click="activeTab = i"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === i
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-surface-200'
        ]"
      >
        <i :class="tab.icon" /><span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Компания -->
    <div v-if="activeTab === 0" class="card max-w-2xl">
      <h3 class="font-semibold mb-5 text-surface-800 dark:text-surface-100">Реквизиты компании</h3>
      <div class="flex flex-col gap-4">
        <div class="field">
          <label class="field-label">Название компании</label>
          <InputText v-model="company.name" placeholder="ООО «Мой Парк»" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="field-label">ИНН</label>
            <InputText v-model="company.inn" placeholder="1234567890" class="w-full" />
          </div>
          <div class="field">
            <label class="field-label">Телефон</label>
            <InputText v-model="company.phone" placeholder="+7 (900) 000-00-00" class="w-full" />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Email</label>
          <InputText v-model="company.email" placeholder="info@mypark.ru" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Юридический адрес</label>
          <Textarea v-model="company.address" rows="2" class="w-full" autoResize />
        </div>
        <div>
          <Button label="Сохранить" icon="pi pi-check" @click="saveCompany" />
        </div>
      </div>
    </div>

    <!-- Тарифы -->
    <div v-else-if="activeTab === 1" class="card max-w-2xl">
      <h3 class="font-semibold mb-5 text-surface-800 dark:text-surface-100">Настройки тарифов</h3>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="field-label">Комиссия парка, %</label>
            <InputNumber v-model="tariff.parkPercent" :min="0" :max="100" :maxFractionDigits="1" suffix="%" class="w-full" />
          </div>
          <div class="field">
            <label class="field-label">Доля водителя, %</label>
            <InputNumber v-model="tariff.driverPercent" :min="0" :max="100" :maxFractionDigits="1" suffix="%" class="w-full" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="field-label">Мин. сумма выплаты, ₽</label>
            <InputNumber v-model="tariff.minPayout" :min="0" class="w-full" />
          </div>
          <div class="field">
            <label class="field-label">День выплаты (число месяца)</label>
            <InputNumber v-model="tariff.payoutDay" :min="1" :max="28" class="w-full" />
          </div>
        </div>
        <div class="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-sm text-amber-700 dark:text-amber-300">
          <i class="pi pi-info-circle mr-2" />
          Сумма долей должна составлять 100%. Текущая сумма: {{ tariff.parkPercent + tariff.driverPercent }}%
        </div>
        <div>
          <Button label="Сохранить" icon="pi pi-check" @click="saveTariff" />
        </div>
      </div>
    </div>

    <!-- Яндекс Go -->
    <div v-else-if="activeTab === 2" class="card max-w-2xl">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-semibold text-surface-800 dark:text-surface-100">Интеграция с Яндекс Go</h3>
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-500">{{ yandex.enabled ? 'Включено' : 'Отключено' }}</span>
          <ToggleSwitch v-model="yandex.enabled" />
        </div>
      </div>
      <div class="flex flex-col gap-4" :class="{ 'opacity-50 pointer-events-none': !yandex.enabled }">
        <div class="field">
          <label class="field-label">ID парка</label>
          <InputText v-model="yandex.parkId" placeholder="598ce48e692b4b09815b730121925861" class="w-full font-mono" />
        </div>
        <div class="field">
          <label class="field-label">API-ключ</label>
          <Password v-model="yandex.apiKey" :feedback="false" class="w-full"
            placeholder="EbzRXWwKk..." inputClass="w-full font-mono" />
        </div>
        <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg text-sm text-surface-500">
          <i class="pi pi-info-circle mr-2" />
          После сохранения можно будет импортировать смены и рейсы из Яндекс Go API.
        </div>
        <div>
          <Button label="Сохранить" icon="pi pi-check" @click="saveYandex" :disabled="!yandex.enabled" />
        </div>
      </div>
    </div>

    <!-- Безопасность -->
    <div v-else-if="activeTab === 3" class="card max-w-xl">
      <h3 class="font-semibold mb-5 text-surface-800 dark:text-surface-100">Смена пароля</h3>
      <div class="flex flex-col gap-4">
        <div class="field">
          <label class="field-label">Логин</label>
          <InputText v-model="security.login" disabled class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Новый пароль</label>
          <Password v-model="security.password" :feedback="false" class="w-full"
            placeholder="Минимум 6 символов" inputClass="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Подтвердить пароль</label>
          <Password v-model="security.confirm" :feedback="false" class="w-full"
            placeholder="Повторите пароль" inputClass="w-full" />
        </div>
        <div v-if="pwError" class="text-red-600 text-sm">
          <i class="pi pi-exclamation-circle mr-1" />{{ pwError }}
        </div>
        <div>
          <Button label="Изменить пароль" icon="pi pi-lock" @click="savePassword" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--text-color-secondary); }
</style>
