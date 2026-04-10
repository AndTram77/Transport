<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useTable } from '@/composables/useTable'
import { integram, TABLES } from '@/api/integram'

const { items, loading, load } = useTable(
  async () => {
    const res = await integram.list(TABLES.DRIVERS)
    return res.data ?? []
  }
)
load()
</script>

<template>
  <div>
    <PageHeader
      title="Водители"
      subtitle="Управление водителями таксопарка"
      icon="pi pi-id-card"
    >
      <template #actions>
        <Button label="Добавить водителя" icon="pi pi-plus" />
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
            icon="pi pi-id-card"
            title="Водители не найдены"
            message="Добавьте первого водителя, чтобы начать работу"
          >
            <template #actions>
              <Button label="Добавить водителя" icon="pi pi-plus" size="small" />
            </template>
          </EmptyState>
        </template>

        <Column field="ФИО" header="ФИО" sortable />
        <Column field="Телефон" header="Телефон" />
        <Column field="Статус" header="Статус">
          <template #body="{ data }">
            <StatusBadge :status="data.Статус" />
          </template>
        </Column>
        <Column field="Баланс" header="Баланс" />
        <Column field="Рейтинг" header="Рейтинг" />
        <Column header="" style="width: 4rem">
          <template #body>
            <Button icon="pi pi-ellipsis-v" text rounded size="small" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
