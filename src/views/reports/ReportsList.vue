<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<template>
  <div>
    <PageHeader
      title="Отчёты"
      subtitle="Аналитика и экспорт данных"
      icon="pi pi-file-excel"
    >
      <template #actions>
        <Button label="Сформировать отчёт" icon="pi pi-download" outlined />
      </template>
    </PageHeader>

    <div class="card">
      <EmptyState
        icon="pi pi-file-excel"
        title="Отчёты появятся в Спринте 7"
        message="Здесь будут: выручка по водителям, ТО-план, задолженности, сводка по парку"
      />
    </div>
  </div>
</template>
