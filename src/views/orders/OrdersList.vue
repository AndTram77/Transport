<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useTable } from '@/composables/useTable'
import { integram, TABLES } from '@/api/integram'

const { items, loading, load } = useTable(
  async () => {
    const res = await integram.list(TABLES.ORDERS)
    return res.data ?? []
  }
)
load()
</script>

<template>
  <div>
    <PageHeader
      title="Заказы"
      subtitle="История и управление заказами"
      icon="pi pi-list"
    >
      <template #actions>
        <Button label="Новый заказ" icon="pi pi-plus" />
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
            icon="pi pi-list"
            title="Заказы не найдены"
            message="Здесь появятся заказы из агрегаторов"
          />
        </template>

        <Column field="Маршрут" header="Маршрут" />
        <Column field="Водитель" header="Водитель" />
        <Column field="Стоимость" header="Стоимость" />
        <Column field="Агрегатор" header="Агрегатор" />
        <Column field="Статус" header="Статус">
          <template #body="{ data }">
            <StatusBadge :status="data.Статус" />
          </template>
        </Column>
        <Column field="Дата" header="Дата" sortable />
        <Column header="" style="width: 4rem">
          <template #body>
            <Button icon="pi pi-ellipsis-v" text rounded size="small" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
