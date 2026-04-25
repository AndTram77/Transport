<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import FinanceDialog from '@/components/finance/FinanceDialog.vue'
import { useFinance } from '@/composables/useFinance'

const confirm = useConfirm()
const toast   = useToast()

const {
  transactions, loading, saving, error,
  drivers, opTypes, categories,
  load, loadLookups, save, remove,
} = useFinance()

const dialogVisible  = ref(false)
const editTransaction = ref(null)
const filterType     = ref(null)
const filterCategory = ref(null)
const filterDriver   = ref(null)
const dateFrom       = ref(null)
const dateTo         = ref(null)

onMounted(async () => {
  await Promise.all([load(), loadLookups()])
})

const filtered = computed(() => {
  let list = transactions.value
  if (filterType.value)
    list = list.filter(t => String(t['Тип операцииId'] ?? t['Тип операции.id']) === String(filterType.value))
  if (filterCategory.value)
    list = list.filter(t => String(t['КатегорияId'] ?? t['Категория.id']) === String(filterCategory.value))
  if (filterDriver.value)
    list = list.filter(t => String(t['ВодительId'] ?? t['Водитель.id']) === String(filterDriver.value))
  if (dateFrom.value)
    list = list.filter(t => t['Дата'] && new Date(t['Дата']) >= dateFrom.value)
  if (dateTo.value)
    list = list.filter(t => t['Дата'] && new Date(t['Дата']) <= dateTo.value)
  return list
})

// KPI
const income = computed(() =>
  filtered.value
    .filter(t => (t['Тип операции'] ?? '').toLowerCase().includes('доход'))
    .reduce((s, t) => s + (parseFloat(t['Сумма']) || 0), 0)
)
const expense = computed(() =>
  filtered.value
    .filter(t => !(t['Тип операции'] ?? '').toLowerCase().includes('доход'))
    .reduce((s, t) => s + (parseFloat(t['Сумма']) || 0), 0)
)
const balance = computed(() => income.value - expense.value)

function openCreate() { editTransaction.value = null; dialogVisible.value = true }
function openEdit(t)  { editTransaction.value = t;    dialogVisible.value = true }

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: id ? 'Обновлено' : 'Добавлено', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error.value, life: 4000 })
  }
}

function confirmDelete(t) {
  confirm.require({
    message: `Удалить операцию на ${formatMoney(t['Сумма'])}?`,
    header:  'Подтверждение',
    icon:    'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const ok = await remove(t.id)
      if (ok) toast.add({ severity: 'success', summary: 'Удалено', life: 3000 })
    },
  })
}

function resetFilters() {
  filterType.value     = null
  filterCategory.value = null
  filterDriver.value   = null
  dateFrom.value       = null
  dateTo.value         = null
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function amountClass(t) {
  const type = (t['Тип операции'] ?? '').toLowerCase()
  return type.includes('доход') ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog />

    <PageHeader title="Финансы" subtitle="Доходы, расходы и выплаты водителям" icon="pi pi-wallet">
      <template #actions>
        <Button label="Добавить операцию" icon="pi pi-plus" @click="openCreate" />
      </template>
    </PageHeader>

    <!-- KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 dark:bg-green-900 flex-shrink-0">
          <i class="pi pi-arrow-down text-green-600 text-xl" />
        </div>
        <div>
          <p class="text-xs text-surface-400">Доходы</p>
          <p class="text-xl font-bold text-green-600">{{ formatMoney(income) }}</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900 flex-shrink-0">
          <i class="pi pi-arrow-up text-red-600 text-xl" />
        </div>
        <div>
          <p class="text-xs text-surface-400">Расходы</p>
          <p class="text-xl font-bold text-red-600">{{ formatMoney(expense) }}</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          balance >= 0 ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-amber-100 dark:bg-amber-900']">
          <i :class="['pi text-xl', balance >= 0 ? 'pi-wallet text-indigo-600' : 'pi-exclamation-triangle text-amber-600']" />
        </div>
        <div>
          <p class="text-xs text-surface-400">Баланс</p>
          <p :class="['text-xl font-bold', balance >= 0 ? 'text-indigo-600' : 'text-amber-600']">{{ formatMoney(balance) }}</p>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="card mb-4">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Тип операции</label>
          <Select v-model="filterType" :options="opTypes" optionLabel="label" optionValue="id"
            placeholder="Все типы" class="w-44" showClear />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Категория</label>
          <Select v-model="filterCategory" :options="categories" optionLabel="label" optionValue="id"
            placeholder="Все" class="w-40" showClear />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Водитель</label>
          <Select v-model="filterDriver" :options="drivers" optionLabel="label" optionValue="id"
            placeholder="Все" class="w-44" showClear filter />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Дата с</label>
          <DatePicker v-model="dateFrom" dateFormat="dd.mm.yy" class="w-36" showIcon />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-400">Дата по</label>
          <DatePicker v-model="dateTo" dateFormat="dd.mm.yy" class="w-36" showIcon />
        </div>
        <Button icon="pi pi-times" text rounded @click="resetFilters" v-tooltip.top="'Сбросить'" />
        <Button icon="pi pi-refresh" text rounded :loading="loading" @click="load" v-tooltip.top="'Обновить'" />
        <div class="ml-auto text-sm text-surface-500">
          Записей: <strong class="text-surface-800 dark:text-surface-100">{{ filtered.length }}</strong>
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
          <EmptyState icon="pi pi-wallet" title="Нет финансовых операций" message="Добавьте первую операцию">
            <template #actions>
              <Button label="Добавить операцию" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
          </EmptyState>
        </template>

        <Column field="Дата" header="Дата" sortable style="width: 120px">
          <template #body="{ data }">{{ formatDate(data['Дата']) }}</template>
        </Column>

        <Column field="Тип операции" header="Тип" style="width: 130px">
          <template #body="{ data }">
            <span :class="amountClass(data)">{{ data['Тип операции'] ?? '—' }}</span>
          </template>
        </Column>

        <Column field="Категория" header="Категория" style="min-width: 140px">
          <template #body="{ data }">{{ data['Категория'] ?? '—' }}</template>
        </Column>

        <Column field="Водитель" header="Водитель" style="min-width: 160px">
          <template #body="{ data }">{{ data['Водитель'] ?? '—' }}</template>
        </Column>

        <Column field="Сумма" header="Сумма" sortable style="width: 140px">
          <template #body="{ data }">
            <span :class="amountClass(data)">{{ formatMoney(data['Сумма']) }}</span>
          </template>
        </Column>

        <Column field="Описание" header="Описание" style="min-width: 200px">
          <template #body="{ data }">
            <span class="text-surface-500 text-sm">{{ data['Описание'] ?? '—' }}</span>
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

    <FinanceDialog
      v-model:visible="dialogVisible"
      :transaction="editTransaction"
      :drivers="drivers"
      :op-types="opTypes"
      :categories="categories"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
