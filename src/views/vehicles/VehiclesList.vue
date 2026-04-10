<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useTable } from '@/composables/useTable'
import { integram, TABLES } from '@/api/integram'

const { items, loading, load } = useTable(
  async () => {
    const res = await integram.list(TABLES.VEHICLES)
    return res.data ?? []
  }
)
load()
</script>

<template>
  <div>
    <PageHeader
      title="Автопарк"
      subtitle="Управление автомобилями"
      icon="pi pi-car"
    >
      <template #actions>
        <Button label="Добавить авто" icon="pi pi-plus" />
      </template>
    </PageHeader>

    <div class="card">
      <DataTable
        :value="items"
        :loading="loading"
        stripedRows
        paginator
        :rows="25"
        :rowsPerPageOptions="[25, 50, 100]"
      >
        <template #empty>
          <EmptyState
            icon="pi pi-car"
            title="Автомобили не найдены"
            message="Добавьте первый автомобиль в парк"
          >
            <template #actions>
              <Button label="Добавить авто" icon="pi pi-plus" size="small" />
            </template>
          </EmptyState>
        </template>

        <Column field="Номер" header="Гос. номер" sortable />
        <Column field="Марка" header="Марка / Модель" />
        <Column field="VIN" header="VIN" />
        <Column field="Статус" header="Статус">
          <template #body="{ data }">
            <StatusBadge :status="data.Статус" />
          </template>
        </Column>
        <Column field="ТО_дата" header="Следующее ТО" />
        <Column header="" style="width: 4rem">
          <template #body>
            <Button icon="pi pi-ellipsis-v" text rounded size="small" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
