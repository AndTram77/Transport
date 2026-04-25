<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import VehicleDialog from '@/components/vehicles/VehicleDialog.vue'
import { useVehicles } from '@/composables/useVehicles'
import { integram, TABLES } from '@/api/integram'

const route  = useRoute()
const router = useRouter()
const toast  = useToast()

const { loadOne, loadLookups, save, saving, brands, bodyTypes, fuelTypes, statuses } = useVehicles()

const vehicle       = ref(null)
const shifts        = ref([])
const maintenance   = ref([])
const loadingPage   = ref(true)
const dialogVisible = ref(false)
const activeTab     = ref(0)

const tabs = [
  { label: 'Информация',  icon: 'pi pi-info-circle' },
  { label: 'Смены',       icon: 'pi pi-clock' },
  { label: 'ТО',          icon: 'pi pi-wrench' },
]

function parseList(res) {
  const d = res.data
  return d?.objects ?? d ?? []
}

onMounted(async () => {
  const id = route.params.id
  await loadLookups()
  const [v, s, m] = await Promise.all([
    loadOne(id),
    integram.list(TABLES.SHIFTS),
    integram.list(TABLES.MAINTENANCE),
  ])
  vehicle.value     = v
  shifts.value      = parseList(s).filter(item => String(item['АвтомобильId'] ?? item['Автомобиль.id']) === String(id))
  maintenance.value = parseList(m).filter(item => String(item['АвтомобильId'] ?? item['Автомобиль.id']) === String(id))
  loadingPage.value = false
})

const title = computed(() => vehicle.value?.value ?? 'Автомобиль')

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function expiryClass(val) {
  if (!val) return ''
  const days = (new Date(val) - new Date()) / 86400000
  if (days < 0)  return 'text-red-600 font-semibold'
  if (days < 30) return 'text-amber-500 font-semibold'
  return 'text-green-600'
}

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    vehicle.value = await loadOne(id)
    toast.add({ severity: 'success', summary: 'Сохранено', life: 3000 })
  }
}

const infoRows = computed(() => {
  if (!vehicle.value) return []
  const v = vehicle.value
  return [
    { label: 'Гос. номер',   value: v.value },
    { label: 'Марка',        value: v['Марка'] },
    { label: 'Модель',       value: v['Модель'] },
    { label: 'Год выпуска',  value: v['Год выпуска'] },
    { label: 'Цвет',         value: v['Цвет'] },
    { label: 'Тип кузова',   value: v['Тип кузова'] },
    { label: 'Тип топлива',  value: v['Тип топлива'] },
    { label: 'VIN',          value: v['VIN'], mono: true },
    { label: 'Пробег',       value: v['Пробег'] ? Number(v['Пробег']).toLocaleString('ru-RU') + ' км' : null },
    { label: 'Статус',       value: v['Статус'], badge: true },
  ]
})

const docRows = computed(() => {
  if (!vehicle.value) return []
  const v = vehicle.value
  return [
    { label: 'Срок ОСАГО',          value: v['Срок ОСАГО'],          date: true },
    { label: 'Срок ТО',             value: v['Срок ТО'],             date: true },
    { label: 'Срок лицензии такси', value: v['Срок лицензии такси'], date: true },
  ]
})
</script>

<template>
  <div>
    <Toast />

    <div v-if="loadingPage" class="flex items-center justify-center h-64">
      <ProgressSpinner />
    </div>

    <template v-else-if="vehicle">
      <PageHeader :title="title" :subtitle="vehicle['Марка'] + ' ' + (vehicle['Модель'] ?? '')" icon="pi pi-car">
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
          <i :class="tab.icon" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Таб: Информация -->
      <div v-if="activeTab === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Основные данные -->
        <div class="card">
          <h3 class="font-semibold text-surface-800 dark:text-surface-100 mb-4">Основные данные</h3>
          <dl class="flex flex-col gap-3">
            <div v-for="row in infoRows" :key="row.label" class="flex justify-between gap-4">
              <dt class="text-sm text-surface-500 flex-shrink-0">{{ row.label }}</dt>
              <dd class="text-sm text-right">
                <StatusBadge v-if="row.badge" :status="row.value" />
                <span v-else-if="row.mono" class="font-mono text-xs">{{ row.value ?? '—' }}</span>
                <span v-else>{{ row.value ?? '—' }}</span>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Документы -->
        <div class="card">
          <h3 class="font-semibold text-surface-800 dark:text-surface-100 mb-4">Документы</h3>
          <dl class="flex flex-col gap-4">
            <div v-for="row in docRows" :key="row.label" class="flex justify-between items-center gap-4">
              <dt class="text-sm text-surface-500">{{ row.label }}</dt>
              <dd :class="['text-sm font-medium', expiryClass(row.value)]">
                {{ formatDate(row.value) }}
              </dd>
            </div>
          </dl>
          <Divider />
          <p class="text-xs text-surface-400">
            <i class="pi pi-exclamation-triangle text-amber-500 mr-1" />
            Жёлтый — менее 30 дней, красный — просрочено
          </p>
        </div>
      </div>

      <!-- Таб: Смены -->
      <div v-else-if="activeTab === 1" class="card">
        <h3 class="font-semibold mb-4">Смены автомобиля</h3>
        <DataTable :value="shifts" :rows="10" paginator stripedRows>
          <template #empty><p class="text-center text-surface-400 py-6">Смен не найдено</p></template>
          <Column field="Смена"       header="Смена" />
          <Column field="Дата начала" header="Начало">
            <template #body="{ data }"><span>{{ formatDate(data['Дата начала']) }}</span></template>
          </Column>
          <Column field="Водитель"    header="Водитель" />
          <Column field="Выручка"     header="Выручка">
            <template #body="{ data }">{{ data['Выручка'] ? '₽ ' + Number(data['Выручка']).toLocaleString('ru-RU') : '—' }}</template>
          </Column>
          <Column field="Статус"      header="Статус">
            <template #body="{ data }"><StatusBadge :status="data['Статус']" /></template>
          </Column>
        </DataTable>
      </div>

      <!-- Таб: ТО -->
      <div v-else-if="activeTab === 2" class="card">
        <h3 class="font-semibold mb-4">История ТО</h3>
        <DataTable :value="maintenance" :rows="10" paginator stripedRows>
          <template #empty><p class="text-center text-surface-400 py-6">Записей ТО не найдено</p></template>
          <Column field="Дата"      header="Дата">
            <template #body="{ data }"><span>{{ formatDate(data['Дата']) }}</span></template>
          </Column>
          <Column field="Тип работ" header="Тип работ" />
          <Column field="Стоимость" header="Стоимость">
            <template #body="{ data }">{{ data['Стоимость'] ? '₽ ' + Number(data['Стоимость']).toLocaleString('ru-RU') : '—' }}</template>
          </Column>
          <Column field="Пробег"    header="Пробег" />
        </DataTable>
      </div>

    </template>

    <div v-else class="card text-center py-12 text-surface-400">
      <i class="pi pi-car text-4xl mb-3 block" />
      <p>Автомобиль не найден</p>
      <Button label="Вернуться к списку" text class="mt-3" @click="router.push('/vehicles')" />
    </div>

    <VehicleDialog
      v-if="vehicle"
      v-model:visible="dialogVisible"
      :vehicle="vehicle"
      :brands="brands"
      :bodyTypes="bodyTypes"
      :fuelTypes="fuelTypes"
      :statuses="statuses"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
