<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
</script>

<template>
  <div>
    <PageHeader
      title="Настройки"
      subtitle="Параметры системы и таксопарка"
      icon="pi pi-cog"
    />

    <div class="card">
      <EmptyState
        icon="pi pi-cog"
        title="Настройки появятся в Спринте 8"
        message="Реквизиты компании, тарифы, интеграции с агрегаторами"
      />
    </div>
  </div>
</template>
