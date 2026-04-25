<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<template>
  <div>
    <PageHeader title="Договора" subtitle="Договоры аренды с водителями" icon="pi pi-file-edit" />

    <div class="card text-center py-16">
      <i class="pi pi-file-edit text-5xl text-surface-200 dark:text-surface-600 mb-4 block" />
      <h3 class="text-lg font-semibold text-surface-600 dark:text-surface-300 mb-2">Модуль в разработке</h3>
      <p class="text-surface-400 max-w-md mx-auto">
        Здесь будут договоры аренды автомобилей с водителями:
        шаблоны, подписание, сроки действия, напоминания об окончании.
      </p>
      <div class="flex justify-center gap-3 mt-6">
        <div class="text-center px-6 py-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
          <i class="pi pi-file text-primary-500 text-2xl mb-2 block" />
          <p class="text-xs text-surface-400">Договоры аренды</p>
        </div>
        <div class="text-center px-6 py-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
          <i class="pi pi-calendar text-primary-500 text-2xl mb-2 block" />
          <p class="text-xs text-surface-400">Сроки и напоминания</p>
        </div>
        <div class="text-center px-6 py-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
          <i class="pi pi-print text-primary-500 text-2xl mb-2 block" />
          <p class="text-xs text-surface-400">Печать и подписание</p>
        </div>
      </div>
    </div>
  </div>
</template>
