<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader
      title="Дашборд"
      subtitle="Обзор показателей таксопарка"
      icon="pi pi-chart-bar"
    />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- KPI-виджеты — Спринт 1 -->
      <div v-for="i in 4" :key="i" class="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 animate-pulse h-24" />
    </div>
  </div>
</template>
