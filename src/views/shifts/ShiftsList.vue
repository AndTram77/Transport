<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ShiftDialog from '@/components/shifts/ShiftDialog.vue'
import { useShifts } from '@/composables/useShifts'

const confirm = useConfirm()
const toast   = useToast()

const {
  shifts, loading, saving, error,
  drivers, vehicles, statuses,
  load, loadLookups, save, remove,
} = useShifts()

const dialogVisible = ref(false)
const editShift     = ref(null)
const filterDriver  = ref(null)
const filterStatus  = ref(null)
const dateFrom      = ref(null)
const dateTo        = ref(null)

onMounted(async () => {
  await Promise.all([load(), loadLookups()])
})

const filtered = computed(() => {
  let list = shifts.value
  if (filterDriver.value)
    list = list.filter(s => String(s['ВодительId'] ?? s['Водитель.id']) === String(filterDriver.value))
  if (filterStatus.value)
    list = list.filter(s => String(s['СтатусId'] ?? s['Статус.id']) === String(filterStatus.value))
  if (dateFrom.value)
    list = list.filter(s => s['Дата начала'] && new Date(s['Дата начала']) >= dateFrom.value)
  if (dateTo.value)
    list = list.filter(s => s['Дата начала'] && new Date(s['Дата начала']) <= dateTo.value)
  return list
})

const totalRevenue = computed(() =>
  filtered.value.reduce((sum, s) => sum + (parseFloat(s['Выручка']) || 0), 0)
)
const totalPayout = computed(() =>
  filtered.value.reduce((sum, s) => sum + (parseFloat(s['Выплата водителю']) || 0), 0)
)

function openCreate() { editShift.value = null; dialogVisible.value = true }
function openEdit(s)  { editShift.value = s;    dialogVisible.value = true }

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: id ? 'Обновлено' : 'Смена открыта', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error.value, life: 4000 })
  }
}

function confirmDelete(shift) {
  confirm.require({
    message: `Удалить смену «${shift.value || shift.id}»?`,
    header:  'Подтверждение',
    icon:    'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const ok = await remove(shift.id)
      if (ok) toast.add({ severity: 'success', summary: 'Удалено', life: 3000 })
    },
  })
}

function resetFilters() {
  filterDriver.value = null
  filterStatus.value = null
  dateFrom.value     = null
  dateTo.value       = null
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function duration(start, end) {
  if (!start || !end) return '—'
  const h = Math.round((new Date(end) - new Date(start)) / 3600000)
  return h > 0 ? `${h} ч` : '—'
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog />

    <PageHeader title="Смены" subtitle="Управление сменами водителей" icon="pi pi-clock">
      <template #actions>
        <Button label="Открыть смену" icon="pi pi-plus" @click="openCreate" />
      </template>
    </PageHeader>

    <!-- Фильтры -->
    <div class="card mb-4">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Водитель</label>
          <Select v-model="filterDriver" :options="drivers" optionLabel="label" optionValue="id"
            placeholder="Все водители" class="w-48" showClear />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Статус</label>
          <Select v-model="filterStatus" :options="statuses" optionLabel="label" optionValue="id"
            placeholder="Все статусы" class="w-40" showClear />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Дата с</label>
          <DatePicker v-model="dateFrom" dateFormat="dd.mm.yy" class="w-36" showIcon />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Дата по</label>
          <DatePicker v-model="dateTo" dateFormat="dd.mm.yy" class="w-36" showIcon />
        </div>
        <Button icon="pi pi-times" text rounded @click="resetFilters" v-tooltip.top="'Сбросить фильтры'" />
        <Button icon="pi pi-refresh" text rounded :loading="loading" @click="load" v-tooltip.top="'Обновить'" />

        <!-- Итоги -->
        <div class="ml-auto flex gap-6 text-sm text-surface-500">
          <span>Смен: <strong class="text-surface-800 dark:text-surface-100">{{ filtered.length }}</strong></span>
          <span>Выручка: <strong class="text-green-600">{{ formatMoney(totalRevenue) }}</strong></span>
          <span>Выплачено: <strong class="text-surface-800 dark:text-surface-100">{{ formatMoney(totalPayout) }}</strong></span>
        </div>
      </div>
    </div>

    <div class="card">
      <DataTable
        :value="filtered"
        :loading="loading"
        stripedRows paginator
        :rows="25"
        :rowsPerPageOptions="[25, 50, 100]"
        dataKey="id"
        sortField="Дата начала"
        :sortOrder="-1"
      >
        <template #empty>
          <EmptyState icon="pi pi-clock" title="Смен не найдено" message="Откройте первую смену">
            <template #actions>
              <Button label="Открыть смену" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
          </EmptyState>
        </template>

        <!-- Название -->
        <Column field="value" header="Смена" sortable style="min-width: 160px">
          <template #body="{ data }">
            <span class="font-medium">{{ data.value || '—' }}</span>
          </template>
        </Column>

        <!-- Водитель -->
        <Column field="Водитель" header="Водитель" style="min-width: 160px">
          <template #body="{ data }">
            <span>{{ data['Водитель'] ?? '—' }}</span>
          </template>
        </Column>

        <!-- Автомобиль -->
        <Column field="Автомобиль" header="Автомобиль" style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data['Автомобиль'] ?? '—' }}</span>
          </template>
        </Column>

        <!-- Дата начала -->
        <Column field="Дата начала" header="Начало" sortable style="width: 120px">
          <template #body="{ data }">{{ formatDate(data['Дата начала']) }}</template>
        </Column>

        <!-- Дата окончания -->
        <Column field="Дата окончания" header="Конец" style="width: 120px">
          <template #body="{ data }">{{ formatDate(data['Дата окончания']) }}</template>
        </Column>

        <!-- Длительность -->
        <Column header="Длит." style="width: 80px">
          <template #body="{ data }">
            <span class="text-surface-500 text-sm">{{ duration(data['Дата начала'], data['Дата окончания']) }}</span>
          </template>
        </Column>

        <!-- Выручка -->
        <Column field="Выручка" header="Выручка" sortable style="width: 120px">
          <template #body="{ data }">
            <span class="text-green-600 font-semibold">{{ formatMoney(data['Выручка']) }}</span>
          </template>
        </Column>

        <!-- Выплата -->
        <Column field="Выплата водителю" header="Выплата" style="width: 120px">
          <template #body="{ data }">{{ formatMoney(data['Выплата водителю']) }}</template>
        </Column>

        <!-- Статус -->
        <Column field="Статус" header="Статус" style="width: 130px">
          <template #body="{ data }">
            <StatusBadge :status="data['Статус']" />
          </template>
        </Column>

        <!-- Действия -->
        <Column header="" style="width: 90px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-pencil" text rounded size="small"
                v-tooltip.top="'Редактировать'" @click="openEdit(data)" />
              <Button icon="pi pi-trash" text rounded size="small" severity="danger"
                v-tooltip.top="'Удалить'" @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <ShiftDialog
      v-model:visible="dialogVisible"
      :shift="editShift"
      :drivers="drivers"
      :vehicles="vehicles"
      :statuses="statuses"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
