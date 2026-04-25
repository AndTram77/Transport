<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import DriverDialog from '@/components/drivers/DriverDialog.vue'
import { useDrivers } from '@/composables/useDrivers'

const router  = useRouter()
const confirm = useConfirm()
const toast   = useToast()

const {
  drivers, loading, saving, error,
  statuses, vehicles, genders,
  load, loadLookups, save, remove,
} = useDrivers()

const dialogVisible = ref(false)
const editDriver    = ref(null)
const searchQuery   = ref('')

onMounted(async () => {
  await Promise.all([load(), loadLookups()])
})

const filtered = computed(() => {
  if (!searchQuery.value) return drivers.value
  const q = searchQuery.value.toLowerCase()
  return drivers.value.filter(d =>
    (d.value ?? '').toLowerCase().includes(q) ||
    (d['Телефон'] ?? '').includes(q)
  )
})

// Должники — баланс < 0
const debtors = computed(() => drivers.value.filter(d => (d['Баланс'] ?? 0) < 0))

function openCreate() { editDriver.value = null; dialogVisible.value = true }
function openEdit(d)  { editDriver.value = d;    dialogVisible.value = true }

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: id ? 'Обновлено' : 'Добавлено', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error.value, life: 4000 })
  }
}

function confirmDelete(driver) {
  confirm.require({
    message: `Удалить водителя «${driver.value}»?`,
    header:  'Подтверждение',
    icon:    'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const ok = await remove(driver.id)
      if (ok) toast.add({ severity: 'success', summary: 'Удалено', life: 3000 })
    },
  })
}

function formatMoney(val) {
  if (val === null || val === undefined) return '—'
  return Number(val).toLocaleString('ru-RU') + ' ₽'
}

function balanceClass(val) {
  if (!val) return ''
  return val < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'
}

function ratingStars(val) {
  if (!val) return []
  return Array.from({ length: 5 }, (_, i) => i < Math.round(val))
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog />

    <PageHeader title="Водители" subtitle="Управление водителями таксопарка" icon="pi pi-id-card">
      <template #actions>
        <span v-if="debtors.length" class="text-sm text-red-600 font-medium mr-2">
          <i class="pi pi-exclamation-circle mr-1" />{{ debtors.length }} должник{{ debtors.length > 1 ? 'а' : '' }}
        </span>
        <Button label="Добавить водителя" icon="pi pi-plus" @click="openCreate" />
      </template>
    </PageHeader>

    <!-- Поиск -->
    <div class="mb-4 flex gap-3">
      <div class="relative flex-1 max-w-sm">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <InputText
          v-model="searchQuery"
          placeholder="Поиск по имени или телефону..."
          class="w-full pl-9"
        />
      </div>
      <Button icon="pi pi-refresh" text rounded :loading="loading" @click="load" v-tooltip.left="'Обновить'" />
    </div>

    <div class="card">
      <DataTable
        :value="filtered"
        :loading="loading"
        stripedRows paginator
        :rows="25"
        :rowsPerPageOptions="[25, 50, 100]"
        dataKey="id"
      >
        <template #empty>
          <EmptyState icon="pi pi-id-card" title="Водители не найдены" message="Добавьте первого водителя">
            <template #actions>
              <Button label="Добавить водителя" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
          </EmptyState>
        </template>

        <!-- ФИО -->
        <Column field="value" header="ФИО" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar :label="(data.value ?? '?')[0]" size="small" shape="circle"
                class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex-shrink-0" />
              <span
                class="font-medium cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                @click="router.push(`/drivers/${data.id}`)"
              >{{ data.value }}</span>
            </div>
          </template>
        </Column>

        <!-- Телефон -->
        <Column field="Телефон" header="Телефон" style="min-width: 150px">
          <template #body="{ data }">
            <a v-if="data['Телефон']" :href="`tel:${data['Телефон']}`"
              class="text-primary-600 dark:text-primary-400 hover:underline">
              {{ data['Телефон'] }}
            </a>
            <span v-else class="text-surface-400">—</span>
          </template>
        </Column>

        <!-- Автомобиль -->
        <Column field="Автомобиль" header="Автомобиль" style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data['Автомобиль'] ?? '—' }}</span>
          </template>
        </Column>

        <!-- Рейтинг -->
        <Column field="Рейтинг" header="Рейтинг" sortable style="width: 130px">
          <template #body="{ data }">
            <div class="flex gap-0.5">
              <i v-for="(filled, i) in ratingStars(data['Рейтинг'])" :key="i"
                :class="['pi pi-star-fill text-sm', filled ? 'text-amber-400' : 'text-surface-200 dark:text-surface-600']" />
              <span v-if="!data['Рейтинг']" class="text-surface-400 text-sm">—</span>
            </div>
          </template>
        </Column>

        <!-- Баланс -->
        <Column field="Баланс" header="Баланс" sortable style="width: 130px">
          <template #body="{ data }">
            <span :class="balanceClass(data['Баланс'])">{{ formatMoney(data['Баланс']) }}</span>
          </template>
        </Column>

        <!-- Статус -->
        <Column field="Статус" header="Статус" style="width: 140px">
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

    <DriverDialog
      v-model:visible="dialogVisible"
      :driver="editDriver"
      :statuses="statuses"
      :vehicles="vehicles"
      :genders="genders"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
