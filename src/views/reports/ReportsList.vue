<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { integram, TABLES } from '@/api/integram'

const loading = ref(false)
const activeReport = ref(0)

// Данные
const drivers    = ref([])
const shifts     = ref([])
const vehicles   = ref([])
const maintenance = ref([])
const finances   = ref([])

const reports = [
  { label: 'Выручка по водителям', icon: 'pi pi-chart-bar' },
  { label: 'ТО-план',             icon: 'pi pi-wrench' },
  { label: 'Задолженности',       icon: 'pi pi-exclamation-triangle' },
  { label: 'Сводка по парку',     icon: 'pi pi-car' },
]

// Фильтры для отчёта по выручке
const revFrom = ref(null)
const revTo   = ref(null)

function parseList(res) {
  const d = res.data
  return d?.objects ?? d ?? []
}

onMounted(async () => {
  loading.value = true
  try {
    const [d, s, v, m, f] = await Promise.all([
      integram.list(TABLES.DRIVERS),
      integram.list(TABLES.SHIFTS),
      integram.list(TABLES.VEHICLES),
      integram.list(TABLES.MAINTENANCE),
      integram.list(TABLES.FINANCE),
    ])
    drivers.value     = parseList(d)
    shifts.value      = parseList(s)
    vehicles.value    = parseList(v)
    maintenance.value = parseList(m)
    finances.value    = parseList(f)
  } finally {
    loading.value = false
  }
})

// ── Отчёт 1: Выручка по водителям ──
const revenueReport = computed(() => {
  let filteredShifts = shifts.value
  if (revFrom.value)
    filteredShifts = filteredShifts.filter(s => s['Дата начала'] && new Date(s['Дата начала']) >= revFrom.value)
  if (revTo.value)
    filteredShifts = filteredShifts.filter(s => s['Дата начала'] && new Date(s['Дата начала']) <= revTo.value)

  const map = {}
  for (const shift of filteredShifts) {
    const name = shift['Водитель'] ?? 'Не указан'
    if (!map[name]) map[name] = { driver: name, shifts: 0, revenue: 0, payout: 0, park: 0 }
    map[name].shifts++
    map[name].revenue += parseFloat(shift['Выручка']) || 0
    map[name].payout  += parseFloat(shift['Выплата водителю']) || 0
    map[name].park    += parseFloat(shift['Комиссия парка']) || 0
  }
  return Object.values(map).sort((a, b) => b.revenue - a.revenue)
})

// ── Отчёт 2: ТО-план ──
const maintenancePlan = computed(() => {
  return vehicles.value.map(v => {
    const tos = maintenance.value.filter(m =>
      String(m['АвтомобильId'] ?? m['Автомобиль.id']) === String(v.id)
    )
    const lastTo = tos.sort((a, b) => new Date(b['Дата']) - new Date(a['Дата']))[0]
    const nextDate = lastTo?.['Дата след.'] ?? null
    const days = nextDate ? Math.round((new Date(nextDate) - new Date()) / 86400000) : null

    return {
      vehicle:   v.value,
      lastDate:  lastTo?.['Дата'] ?? null,
      nextDate,
      days,
      status:    days === null ? 'Нет данных' : days < 0 ? 'Просрочено' : days <= 7 ? 'Срочно' : days <= 30 ? 'Скоро' : 'В норме',
    }
  }).sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999))
})

// ── Отчёт 3: Задолженности ──
const debtsReport = computed(() => {
  return drivers.value
    .filter(d => (d['Баланс'] ?? 0) < 0)
    .map(d => ({
      driver:  d.value,
      phone:   d['Телефон'] ?? '—',
      vehicle: d['Автомобиль'] ?? '—',
      balance: d['Баланс'] ?? 0,
      status:  d['Статус'] ?? '—',
    }))
    .sort((a, b) => a.balance - b.balance)
})

// ── Отчёт 4: Сводка по парку ──
const fleetSummary = computed(() => {
  const totalVehicles  = vehicles.value.length
  const totalDrivers   = drivers.value.length
  const activeDrivers  = drivers.value.filter(d => (d['Статус'] ?? '').toLowerCase().includes('актив')).length
  const totalRevenue   = shifts.value.reduce((s, sh) => s + (parseFloat(sh['Выручка']) || 0), 0)
  const totalPayout    = shifts.value.reduce((s, sh) => s + (parseFloat(sh['Выплата водителю']) || 0), 0)
  const totalMaintCost = maintenance.value.reduce((s, m) => s + (parseFloat(m['Стоимость']) || 0), 0)
  const debtors        = drivers.value.filter(d => (d['Баланс'] ?? 0) < 0).length
  const totalDebt      = drivers.value.reduce((s, d) => s + Math.min(d['Баланс'] ?? 0, 0), 0)
  const overdueTO      = maintenancePlan.value.filter(r => r.status === 'Просрочено').length

  return [
    { label: 'Автомобилей в парке',    value: totalVehicles,             unit: 'шт' },
    { label: 'Водителей (всего)',       value: totalDrivers,              unit: 'чел' },
    { label: 'Активных водителей',      value: activeDrivers,             unit: 'чел' },
    { label: 'Смен всего',             value: shifts.value.length,       unit: 'шт' },
    { label: 'Общая выручка',          value: formatMoney(totalRevenue),  unit: '' },
    { label: 'Выплачено водителям',    value: formatMoney(totalPayout),   unit: '' },
    { label: 'Затраты на ТО',         value: formatMoney(totalMaintCost), unit: '' },
    { label: 'Должников',              value: debtors,                    unit: 'чел' },
    { label: 'Общий долг',            value: formatMoney(Math.abs(totalDebt)), unit: '' },
    { label: 'Просроченных ТО',       value: overdueTO,                   unit: 'авт' },
  ]
})

// ── Утилиты ──
function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function daysClass(days) {
  if (days === null) return 'text-surface-400'
  if (days < 0)  return 'text-red-600 font-bold'
  if (days <= 7) return 'text-red-500 font-semibold'
  if (days <= 30) return 'text-amber-500 font-semibold'
  return 'text-green-600'
}

// ── CSV экспорт ──
function exportCsv(data, filename) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const csv  = [keys.join(';')]
  for (const row of data) {
    csv.push(keys.map(k => {
      const v = row[k] ?? ''
      return typeof v === 'string' && v.includes(';') ? `"${v}"` : v
    }).join(';'))
  }
  const blob = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function exportRevenue() {
  exportCsv(revenueReport.value.map(r => ({
    'Водитель': r.driver, 'Смен': r.shifts,
    'Выручка': r.revenue, 'Выплата': r.payout, 'Комиссия парка': r.park,
  })), 'выручка-по-водителям.csv')
}

function exportMaintenance() {
  exportCsv(maintenancePlan.value.map(r => ({
    'Автомобиль': r.vehicle, 'Последнее ТО': formatDate(r.lastDate),
    'Следующее ТО': formatDate(r.nextDate), 'Дней': r.days ?? '—', 'Статус': r.status,
  })), 'то-план.csv')
}

function exportDebts() {
  exportCsv(debtsReport.value.map(r => ({
    'Водитель': r.driver, 'Телефон': r.phone, 'Автомобиль': r.vehicle,
    'Баланс': r.balance, 'Статус': r.status,
  })), 'задолженности.csv')
}

function exportFleet() {
  exportCsv(fleetSummary.value, 'сводка-по-парку.csv')
}
</script>

<template>
  <div>
    <PageHeader title="Отчёты" subtitle="Аналитика и экспорт данных" icon="pi pi-file-excel">
      <template #actions>
        <Button v-if="activeReport === 0" label="Экспорт CSV" icon="pi pi-download" outlined @click="exportRevenue" />
        <Button v-if="activeReport === 1" label="Экспорт CSV" icon="pi pi-download" outlined @click="exportMaintenance" />
        <Button v-if="activeReport === 2" label="Экспорт CSV" icon="pi pi-download" outlined @click="exportDebts" />
        <Button v-if="activeReport === 3" label="Экспорт CSV" icon="pi pi-download" outlined @click="exportFleet" />
      </template>
    </PageHeader>

    <!-- Выбор отчёта -->
    <div class="flex gap-2 border-b border-surface-200 dark:border-surface-700 mb-6">
      <button
        v-for="(r, i) in reports" :key="i"
        @click="activeReport = i"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeReport === i
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-surface-200'
        ]"
      >
        <i :class="r.icon" /><span>{{ r.label }}</span>
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-48">
      <ProgressSpinner />
    </div>

    <!-- Отчёт 1: Выручка по водителям -->
    <template v-else-if="activeReport === 0">
      <div class="card mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-400">Период с</label>
            <DatePicker v-model="revFrom" dateFormat="dd.mm.yy" class="w-36" showIcon />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-400">Период по</label>
            <DatePicker v-model="revTo" dateFormat="dd.mm.yy" class="w-36" showIcon />
          </div>
          <Button icon="pi pi-times" text rounded @click="revFrom = null; revTo = null" v-tooltip.top="'Сбросить'" />
        </div>
      </div>
      <div class="card">
        <DataTable :value="revenueReport" stripedRows sortField="revenue" :sortOrder="-1">
          <template #empty><p class="text-center text-surface-400 py-6">Нет данных</p></template>
          <Column field="driver"  header="Водитель" sortable style="min-width: 180px" />
          <Column field="shifts"  header="Смен" sortable style="width: 80px" />
          <Column field="revenue" header="Выручка" sortable style="width: 150px">
            <template #body="{ data }">
              <span class="text-green-600 font-semibold">{{ formatMoney(data.revenue) }}</span>
            </template>
          </Column>
          <Column field="payout" header="Выплата вод." sortable style="width: 150px">
            <template #body="{ data }">{{ formatMoney(data.payout) }}</template>
          </Column>
          <Column field="park" header="Комиссия парка" sortable style="width: 160px">
            <template #body="{ data }">{{ formatMoney(data.park) }}</template>
          </Column>
        </DataTable>
      </div>
    </template>

    <!-- Отчёт 2: ТО-план -->
    <template v-else-if="activeReport === 1">
      <div class="card">
        <DataTable :value="maintenancePlan" stripedRows sortField="days" :sortOrder="1">
          <template #empty><p class="text-center text-surface-400 py-6">Нет данных</p></template>
          <Column field="vehicle"  header="Автомобиль" sortable style="min-width: 150px">
            <template #body="{ data }"><span class="font-mono font-semibold">{{ data.vehicle }}</span></template>
          </Column>
          <Column field="lastDate" header="Последнее ТО" style="width: 140px">
            <template #body="{ data }">{{ formatDate(data.lastDate) }}</template>
          </Column>
          <Column field="nextDate" header="Следующее ТО" style="width: 140px">
            <template #body="{ data }">{{ formatDate(data.nextDate) }}</template>
          </Column>
          <Column field="days" header="Дней осталось" sortable style="width: 140px">
            <template #body="{ data }">
              <span :class="daysClass(data.days)">
                {{ data.days === null ? '—' : data.days < 0 ? `${Math.abs(data.days)} дн. назад` : `${data.days} дн.` }}
              </span>
            </template>
          </Column>
          <Column field="status" header="Статус" style="width: 130px">
            <template #body="{ data }">
              <span :class="['text-sm font-medium px-2 py-0.5 rounded', {
                'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':     data.status === 'Просрочено',
                'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300': data.status === 'Срочно' || data.status === 'Скоро',
                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': data.status === 'В норме',
                'bg-surface-100 text-surface-500': data.status === 'Нет данных',
              }]">{{ data.status }}</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>

    <!-- Отчёт 3: Задолженности -->
    <template v-else-if="activeReport === 2">
      <div v-if="!debtsReport.length" class="card text-center py-12">
        <i class="pi pi-check-circle text-4xl text-green-500 mb-3 block" />
        <p class="text-surface-600 dark:text-surface-300 font-medium">Задолженностей нет</p>
        <p class="text-surface-400 text-sm mt-1">Все водители в расчёте</p>
      </div>
      <div v-else class="card">
        <div class="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
          <i class="pi pi-exclamation-circle text-red-600" />
          <span class="text-sm text-red-700 dark:text-red-300 font-medium">
            {{ debtsReport.length }} водител{{ debtsReport.length === 1 ? 'ь' : 'ей' }} с задолженностью.
            Общий долг: {{ formatMoney(debtsReport.reduce((s, r) => s + r.balance, 0)) }}
          </span>
        </div>
        <DataTable :value="debtsReport" stripedRows sortField="balance" :sortOrder="1">
          <Column field="driver"  header="Водитель" sortable style="min-width: 180px">
            <template #body="{ data }"><span class="font-medium">{{ data.driver }}</span></template>
          </Column>
          <Column field="phone"   header="Телефон" style="min-width: 150px">
            <template #body="{ data }">
              <a v-if="data.phone !== '—'" :href="`tel:${data.phone}`"
                class="text-primary-600 hover:underline">{{ data.phone }}</a>
              <span v-else class="text-surface-400">—</span>
            </template>
          </Column>
          <Column field="vehicle" header="Автомобиль" style="width: 130px">
            <template #body="{ data }"><span class="font-mono text-sm">{{ data.vehicle }}</span></template>
          </Column>
          <Column field="balance" header="Баланс" sortable style="width: 150px">
            <template #body="{ data }">
              <span class="text-red-600 font-bold">{{ formatMoney(data.balance) }}</span>
            </template>
          </Column>
          <Column field="status"  header="Статус" style="width: 130px" />
        </DataTable>
      </div>
    </template>

    <!-- Отчёт 4: Сводка по парку -->
    <template v-else-if="activeReport === 3">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div v-for="item in fleetSummary" :key="item.label"
          class="card flex flex-col items-center text-center gap-2 py-5">
          <p class="text-xs text-surface-400 leading-tight">{{ item.label }}</p>
          <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ item.value }}</p>
          <p v-if="item.unit" class="text-xs text-surface-400">{{ item.unit }}</p>
        </div>
      </div>
    </template>

  </div>
</template>
