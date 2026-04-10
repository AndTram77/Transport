<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useTable } from '@/composables/useTable'
import { integram, TABLES } from '@/api/integram'

const { items, loading, load } = useTable(
  async () => {
    const res = await integram.list(TABLES.FINANCE)
    return res.data ?? []
  }
)
load()
</script>

<template>
  <div>
    <PageHeader
      title="Финансы"
      subtitle="Доходы, расходы и выплаты водителям"
      icon="pi pi-wallet"
    >
      <template #actions>
        <Button label="Добавить операцию" icon="pi pi-plus" />
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
            icon="pi pi-wallet"
            title="Нет финансовых операций"
            message="Финансовые записи появятся после работы водителей"
          />
        </template>

        <Column field="Тип" header="Тип" />
        <Column field="Сумма" header="Сумма" sortable />
        <Column field="Водитель" header="Водитель" />
        <Column field="Дата" header="Дата" sortable />
        <Column field="Комментарий" header="Комментарий" />
      </DataTable>
    </div>
  </div>
</template>
