<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import DriverDialog from '@/components/drivers/DriverDialog.vue'
import { useDrivers } from '@/composables/useDrivers'
import { integram, TABLES } from '@/api/integram'

const route  = useRoute()
const router = useRouter()
const toast  = useToast()

const { loadOne, loadLookups, save, saving, statuses, vehicles, genders } = useDrivers()

const driver      = ref(null)
const shifts      = ref([])
const finances    = ref([])
const loadingPage = ref(true)
const dialogVisible = ref(false)
const activeTab   = ref(0)

const tabs = [
  { label: 'Профиль',    icon: 'pi pi-user' },
  { label: 'Смены',      icon: 'pi pi-clock' },
  { label: 'Финансы',    icon: 'pi pi-wallet' },
]

function parseList(res) {
  const d = res.data
  return d?.objects ?? d ?? []
}

onMounted(async () => {
  const id = route.params.id
  await loadLookups()
  const [d, s, f] = await Promise.all([
    loadOne(id),
    integram.list(TABLES.SHIFTS),
    integram.list(TABLES.FINANCE),
  ])
  driver.value   = d
  shifts.value   = parseList(s).filter(item => String(item['ВодительId'] ?? item['Водитель.id']) === String(id))
  finances.value = parseList(f).filter(item => String(item['ВодительId'] ?? item['Водитель.id']) === String(id))
  loadingPage.value = false
})

const title = computed(() => driver.value?.value ?? 'Водитель')

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function balanceClass(val) {
  if (!val) return ''
  return val < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'
}

function expiryClass(val) {
  if (!val) return ''
  const days = (new Date(val) - new Date()) / 86400000
  if (days < 0)  return 'text-red-600 font-semibold'
  if (days < 30) return 'text-amber-500 font-semibold'
  return 'text-green-600'
}

const totalRevenue = computed(() =>
  shifts.value.reduce((s, sh) => s + (parseFloat(sh['Выручка']) || 0), 0)
)
const totalPayout = computed(() =>
  shifts.value.reduce((s, sh) => s + (parseFloat(sh['Выплата водителю']) || 0), 0)
)

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    driver.value = await loadOne(id)
    toast.add({ severity: 'success', summary: 'Сохранено', life: 3000 })
  }
}
</script>

<template>
  <div>
    <Toast />

    <div v-if="loadingPage" class="flex items-center justify-center h-64">
      <ProgressSpinner />
    </div>

    <template v-else-if="driver">
      <PageHeader :title="title" subtitle="Карточка водителя" icon="pi pi-id-card">
        <template #actions>
          <Button label="Редактировать" icon="pi pi-pencil" outlined @click="dialogVisible = true" />
          <Button icon="pi pi-arrow-left" text @click="router.back()" v-tooltip.left="'Назад'" />
        </template>
      </PageHeader>

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

      <!-- Таб: Профиль -->
      <div v-if="activeTab === 0" class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Аватар + ключевые показатели -->
        <div class="card flex flex-col items-center text-center gap-3">
          <Avatar :label="(driver.value ?? '?')[0]" size="xlarge" shape="circle"
            class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-3xl w-20 h-20" />
          <div>
            <h2 class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ driver.value }}</h2>
            <p class="text-sm text-surface-400">{{ driver['Автомобиль'] ?? 'Без авто' }}</p>
          </div>
          <StatusBadge :status="driver['Статус']" />
          <Divider class="my-0 w-full" />
          <div class="grid grid-cols-2 gap-4 w-full text-center">
            <div>
              <p class="text-xs text-surface-400">Рейтинг</p>
              <p class="text-xl font-bold text-amber-500">{{ driver['Рейтинг'] ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-surface-400">Баланс</p>
              <p :class="['text-base font-bold', balanceClass(driver['Баланс'])]">
                {{ formatMoney(driver['Баланс']) }}
              </p>
            </div>
          </div>
          <Divider class="my-0 w-full" />
          <div class="grid grid-cols-2 gap-4 w-full text-center">
            <div>
              <p class="text-xs text-surface-400">Смен</p>
              <p class="text-lg font-bold">{{ shifts.length }}</p>
            </div>
            <div>
              <p class="text-xs text-surface-400">Выручка</p>
              <p class="text-base font-semibold text-green-600">{{ formatMoney(totalRevenue) }}</p>
            </div>
          </div>
        </div>

        <!-- Личные данные -->
        <div class="card lg:col-span-2">
          <h3 class="font-semibold text-surface-800 dark:text-surface-100 mb-4">Личные данные</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <template v-for="row in [
              { label: 'Телефон',       value: driver['Телефон'] },
              { label: 'Пол',           value: driver['Пол'] },
              { label: 'Дата рождения', value: driver['Дата рождения'], date: true },
              { label: 'Дата приёма',   value: driver['Дата приёма'],   date: true },
              { label: 'Паспорт',       value: driver['Паспорт'] },
              { label: 'Адрес',         value: driver['Адрес'] },
            ]" :key="row.label">
              <div class="flex flex-col gap-0.5">
                <dt class="text-xs text-surface-400">{{ row.label }}</dt>
                <dd class="text-sm font-medium">
                  {{ row.date ? formatDate(row.value) : (row.value ?? '—') }}
                </dd>
              </div>
            </template>
          </dl>

          <Divider />
          <h3 class="font-semibold text-surface-800 dark:text-surface-100 mb-4">Водительское удостоверение</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3">
            <template v-for="row in [
              { label: 'Номер ВУ',    value: driver['Водительское удостоверение'] },
              { label: 'Категория',   value: driver['Категория ВУ'] },
              { label: 'Срок ВУ',    value: driver['Срок ВУ'], date: true, expiry: true },
            ]" :key="row.label">
              <div class="flex flex-col gap-0.5">
                <dt class="text-xs text-surface-400">{{ row.label }}</dt>
                <dd :class="['text-sm font-medium', row.expiry ? expiryClass(row.value) : '']">
                  {{ row.date ? formatDate(row.value) : (row.value ?? '—') }}
                </dd>
              </div>
            </template>
          </dl>
        </div>
      </div>

      <!-- Таб: Смены -->
      <div v-else-if="activeTab === 1" class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold">Смены водителя</h3>
          <div class="text-sm text-surface-500">
            Выручка: <span class="text-green-600 font-semibold">{{ formatMoney(totalRevenue) }}</span>
            · Выплачено: <span class="font-semibold">{{ formatMoney(totalPayout) }}</span>
          </div>
        </div>
        <DataTable :value="shifts" :rows="10" paginator stripedRows>
          <template #empty><p class="text-center text-surface-400 py-6">Смен не найдено</p></template>
          <Column field="Смена"            header="Смена" />
          <Column field="Дата начала"      header="Дата начала">
            <template #body="{ data }">{{ formatDate(data['Дата начала']) }}</template>
          </Column>
          <Column field="Автомобиль"       header="Автомобиль">
            <template #body="{ data }"><span class="font-mono text-sm">{{ data['Автомобиль'] ?? '—' }}</span></template>
          </Column>
          <Column field="Выручка"          header="Выручка">
            <template #body="{ data }">{{ formatMoney(data['Выручка']) }}</template>
          </Column>
          <Column field="Выплата водителю" header="Выплата">
            <template #body="{ data }">{{ formatMoney(data['Выплата водителю']) }}</template>
          </Column>
          <Column field="Статус"           header="Статус">
            <template #body="{ data }"><StatusBadge :status="data['Статус']" /></template>
          </Column>
        </DataTable>
      </div>

      <!-- Таб: Финансы -->
      <div v-else-if="activeTab === 2" class="card">
        <h3 class="font-semibold mb-4">Финансовые операции</h3>
        <DataTable :value="finances" :rows="10" paginator stripedRows>
          <template #empty><p class="text-center text-surface-400 py-6">Операций не найдено</p></template>
          <Column field="Дата"          header="Дата">
            <template #body="{ data }">{{ formatDate(data['Дата']) }}</template>
          </Column>
          <Column field="Тип операции"  header="Тип" />
          <Column field="Категория"     header="Категория" />
          <Column field="Сумма"         header="Сумма">
            <template #body="{ data }">{{ formatMoney(data['Сумма']) }}</template>
          </Column>
          <Column field="Описание"      header="Описание" />
        </DataTable>
      </div>

    </template>

    <div v-else class="card text-center py-12 text-surface-400">
      <i class="pi pi-id-card text-4xl mb-3 block" />
      <p>Водитель не найден</p>
      <Button label="Вернуться к списку" text class="mt-3" @click="router.push('/drivers')" />
    </div>

    <DriverDialog
      v-if="driver"
      v-model:visible="dialogVisible"
      :driver="driver"
      :statuses="statuses"
      :vehicles="vehicles"
      :genders="genders"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
