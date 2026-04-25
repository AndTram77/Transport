<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import MaintenanceDialog from '@/components/maintenance/MaintenanceDialog.vue'
import { useMaintenance } from '@/composables/useMaintenance'

const confirm = useConfirm()
const toast   = useToast()

const {
  records, loading, saving, error,
  vehicles, workTypes, statuses,
  load, loadLookups, save, remove,
} = useMaintenance()

const dialogVisible = ref(false)
const editRecord    = ref(null)
const filterVehicle = ref(null)
const filterStatus  = ref(null)
const filterType    = ref(null)

onMounted(async () => {
  await Promise.all([load(), loadLookups()])
})

const filtered = computed(() => {
  let list = records.value
  if (filterVehicle.value)
    list = list.filter(r => String(r['АвтомобильId'] ?? r['Автомобиль.id']) === String(filterVehicle.value))
  if (filterStatus.value)
    list = list.filter(r => String(r['СтатусId'] ?? r['Статус.id']) === String(filterStatus.value))
  if (filterType.value)
    list = list.filter(r => String(r['Тип работId'] ?? r['Тип работ.id']) === String(filterType.value))
  return list
})

// Плановое ТО — просроченное или ближайшие 30 дней
const overdue = computed(() =>
  records.value.filter(r => {
    if (!r['Дата след.']) return false
    const days = (new Date(r['Дата след.']) - new Date()) / 86400000
    return days < 0
  })
)
const upcoming = computed(() =>
  records.value.filter(r => {
    if (!r['Дата след.']) return false
    const days = (new Date(r['Дата след.']) - new Date()) / 86400000
    return days >= 0 && days <= 30
  })
)

const totalCost = computed(() =>
  filtered.value.reduce((s, r) => s + (parseFloat(r['Стоимость']) || 0), 0)
)

function openCreate() { editRecord.value = null; dialogVisible.value = true }
function openEdit(r)  { editRecord.value = r;    dialogVisible.value = true }

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: id ? 'Обновлено' : 'Добавлено', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error.value, life: 4000 })
  }
}

function confirmDelete(rec) {
  confirm.require({
    message: `Удалить запись ТО «${rec.value || rec.id}»?`,
    header:  'Подтверждение',
    icon:    'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const ok = await remove(rec.id)
      if (ok) toast.add({ severity: 'success', summary: 'Удалено', life: 3000 })
    },
  })
}

function resetFilters() {
  filterVehicle.value = null
  filterStatus.value  = null
  filterType.value    = null
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function nextToClass(val) {
  if (!val) return ''
  const days = (new Date(val) - new Date()) / 86400000
  if (days < 0)  return 'text-red-600 font-semibold'
  if (days < 30) return 'text-amber-500 font-semibold'
  return 'text-green-600'
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog />

    <PageHeader title="Техническое обслуживание" subtitle="Плановое и внеплановое ТО автопарка" icon="pi pi-wrench">
      <template #actions>
        <!-- Предупреждения -->
        <span v-if="overdue.length" class="text-sm text-red-600 font-medium mr-2">
          <i class="pi pi-exclamation-circle mr-1" />{{ overdue.length }} просроченных
        </span>
        <span v-if="upcoming.length" class="text-sm text-amber-500 font-medium mr-2">
          <i class="pi pi-clock mr-1" />{{ upcoming.length }} на этой неделе
        </span>
        <Button label="Добавить ТО" icon="pi pi-plus" @click="openCreate" />
      </template>
    </PageHeader>

    <!-- Фильтры -->
    <div class="card mb-4">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Автомобиль</label>
          <Select v-model="filterVehicle" :options="vehicles" optionLabel="label" optionValue="id"
            placeholder="Все авто" class="w-48" showClear filter />
        </div>
        <div class="flex flex-col gap-1" v-if="workTypes.length">
          <label class="text-xs text-surface-400">Тип работ</label>
          <Select v-model="filterType" :options="workTypes" optionLabel="label" optionValue="id"
            placeholder="Все типы" class="w-44" showClear />
        </div>
        <div class="flex flex-col gap-1" v-if="statuses.length">
          <label class="text-xs text-surface-400">Статус</label>
          <Select v-model="filterStatus" :options="statuses" optionLabel="label" optionValue="id"
            placeholder="Все" class="w-40" showClear />
        </div>
        <Button icon="pi pi-times" text rounded @click="resetFilters" v-tooltip.top="'Сбросить'" />
        <Button icon="pi pi-refresh" text rounded :loading="loading" @click="load" v-tooltip.top="'Обновить'" />
        <div class="ml-auto flex gap-6 text-sm text-surface-500">
          <span>Записей: <strong class="text-surface-800 dark:text-surface-100">{{ filtered.length }}</strong></span>
          <span>Затрат: <strong class="text-surface-800 dark:text-surface-100">{{ formatMoney(totalCost) }}</strong></span>
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
        sortField="Дата"
        :sortOrder="-1"
      >
        <template #empty>
          <EmptyState icon="pi pi-wrench" title="Записей ТО не найдено" message="Добавьте первую запись ТО">
            <template #actions>
              <Button label="Добавить ТО" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
          </EmptyState>
        </template>

        <Column field="value" header="Наряд" style="min-width: 160px">
          <template #body="{ data }">
            <span class="font-medium">{{ data.value || '—' }}</span>
          </template>
        </Column>

        <Column field="Автомобиль" header="Автомобиль" style="min-width: 130px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data['Автомобиль'] ?? '—' }}</span>
          </template>
        </Column>

        <Column field="Тип работ" header="Тип работ" style="min-width: 140px">
          <template #body="{ data }">{{ data['Тип работ'] ?? '—' }}</template>
        </Column>

        <Column field="Дата" header="Дата ТО" sortable style="width: 120px">
          <template #body="{ data }">{{ formatDate(data['Дата']) }}</template>
        </Column>

        <Column field="Дата след." header="Следующее" sortable style="width: 130px">
          <template #body="{ data }">
            <span :class="nextToClass(data['Дата след.'])">{{ formatDate(data['Дата след.']) }}</span>
          </template>
        </Column>

        <Column field="Пробег" header="Пробег" style="width: 110px">
          <template #body="{ data }">
            <span class="text-sm">{{ data['Пробег'] ? data['Пробег'].toLocaleString('ru-RU') + ' км' : '—' }}</span>
          </template>
        </Column>

        <Column field="Стоимость" header="Стоимость" sortable style="width: 130px">
          <template #body="{ data }">{{ formatMoney(data['Стоимость']) }}</template>
        </Column>

        <Column field="Сервис" header="Сервис" style="min-width: 140px">
          <template #body="{ data }">
            <span class="text-surface-500 text-sm">{{ data['Сервис'] ?? '—' }}</span>
          </template>
        </Column>

        <Column field="Статус" header="Статус" style="width: 130px">
          <template #body="{ data }">
            <StatusBadge :status="data['Статус']" />
          </template>
        </Column>

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

    <MaintenanceDialog
      v-model:visible="dialogVisible"
      :record="editRecord"
      :vehicles="vehicles"
      :work-types="workTypes"
      :statuses="statuses"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
