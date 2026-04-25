<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import VehicleDialog from '@/components/vehicles/VehicleDialog.vue'
import { useVehicles } from '@/composables/useVehicles'

const router  = useRouter()
const confirm = useConfirm()
const toast   = useToast()

const {
  vehicles, loading, saving, error,
  brands, bodyTypes, fuelTypes, statuses,
  load, loadLookups, save, remove,
} = useVehicles()

const dialogVisible = ref(false)
const editVehicle   = ref(null)

onMounted(async () => {
  await Promise.all([load(), loadLookups()])
})

function openCreate() {
  editVehicle.value  = null
  dialogVisible.value = true
}

function openEdit(vehicle) {
  editVehicle.value  = vehicle
  dialogVisible.value = true
}

async function onSave(data, id) {
  const ok = await save(data, id)
  if (ok) {
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: id ? 'Обновлено' : 'Добавлено', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error.value, life: 4000 })
  }
}

function confirmDelete(vehicle) {
  confirm.require({
    message: `Удалить автомобиль «${vehicle.value}»?`,
    header:  'Подтверждение',
    icon:    'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const ok = await remove(vehicle.id)
      if (ok) toast.add({ severity: 'success', summary: 'Удалено', life: 3000 })
    },
  })
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('ru-RU')
}

function expiryClass(val) {
  if (!val) return ''
  const days = (new Date(val) - new Date()) / 86400000
  if (days < 0)  return 'text-red-600 font-semibold'
  if (days < 30) return 'text-amber-600 font-semibold'
  return ''
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog />

    <PageHeader
      title="Автопарк"
      subtitle="Управление автомобилями таксопарка"
      icon="pi pi-car"
    >
      <template #actions>
        <Button label="Добавить авто" icon="pi pi-plus" @click="openCreate" />
      </template>
    </PageHeader>

    <div class="card">
      <DataTable
        :value="vehicles"
        :loading="loading"
        stripedRows
        paginator
        :rows="25"
        :rowsPerPageOptions="[25, 50, 100]"
        dataKey="id"
        filterDisplay="row"
      >
        <template #empty>
          <EmptyState
            icon="pi pi-car"
            title="Автомобили не найдены"
            message="Добавьте первый автомобиль в парк"
          >
            <template #actions>
              <Button label="Добавить авто" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
          </EmptyState>
        </template>

        <!-- Госномер -->
        <Column field="value" header="Гос. номер" sortable style="min-width: 130px">
          <template #body="{ data }">
            <span
              class="font-mono font-semibold text-primary-600 dark:text-primary-400 cursor-pointer hover:underline"
              @click="router.push(`/vehicles/${data.id}`)"
            >{{ data.value }}</span>
          </template>
        </Column>

        <!-- Марка / Модель -->
        <Column header="Марка / Модель" style="min-width: 160px">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-medium">{{ data['Марка'] ?? '—' }}</span>
              <span class="text-sm text-surface-400">{{ data['Модель'] ?? '' }}</span>
            </div>
          </template>
        </Column>

        <Column field="Год выпуска" header="Год" sortable style="width: 80px" />

        <Column field="VIN" header="VIN" style="min-width: 160px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data['VIN'] ?? '—' }}</span>
          </template>
        </Column>

        <Column field="Пробег" header="Пробег" sortable style="width: 110px">
          <template #body="{ data }">
            {{ data['Пробег'] ? Number(data['Пробег']).toLocaleString('ru-RU') + ' км' : '—' }}
          </template>
        </Column>

        <!-- Срок ТО -->
        <Column header="Срок ТО" style="width: 110px">
          <template #body="{ data }">
            <span :class="expiryClass(data['Срок ТО'])">
              {{ formatDate(data['Срок ТО']) }}
            </span>
          </template>
        </Column>

        <!-- Срок ОСАГО -->
        <Column header="ОСАГО до" style="width: 110px">
          <template #body="{ data }">
            <span :class="expiryClass(data['Срок ОСАГО'])">
              {{ formatDate(data['Срок ОСАГО']) }}
            </span>
          </template>
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
              <Button
                icon="pi pi-pencil"
                text rounded size="small"
                v-tooltip.top="'Редактировать'"
                @click="openEdit(data)"
              />
              <Button
                icon="pi pi-trash"
                text rounded size="small"
                severity="danger"
                v-tooltip.top="'Удалить'"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <VehicleDialog
      v-model:visible="dialogVisible"
      :vehicle="editVehicle"
      :brands="brands"
      :bodyTypes="bodyTypes"
      :fuelTypes="fuelTypes"
      :statuses="statuses"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>
