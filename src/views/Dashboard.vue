<script setup>
import { onMounted } from 'vue'
import Chart from 'primevue/chart'
import PageHeader from '@/components/common/PageHeader.vue'
import KpiCard from '@/components/common/KpiCard.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useDashboard } from '@/composables/useDashboard'

const { loading, kpi, chartData, chartOptions, recentShifts, load } = useDashboard()

onMounted(load)

function formatMoney(val) {
  if (!val) return '0'
  return Number(val).toLocaleString('ru-RU')
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      title="Дашборд"
      subtitle="Обзор показателей таксопарка"
      icon="pi pi-chart-bar"
    >
      <template #actions>
        <Button
          icon="pi pi-refresh"
          text
          rounded
          :loading="loading"
          @click="load"
          v-tooltip.left="'Обновить'"
        />
      </template>
    </PageHeader>

    <!-- KPI-виджеты -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title="Активные автомобили"
        :value="kpi.activeVehicles"
        icon="pi pi-car"
        color="indigo"
        :loading="loading"
      />
      <KpiCard
        title="Водители на смене"
        :value="kpi.driversOnShift"
        icon="pi pi-id-card"
        color="green"
        :loading="loading"
      />
      <KpiCard
        title="Выручка сегодня"
        :value="formatMoney(kpi.revenueToday)"
        suffix="₽"
        icon="pi pi-wallet"
        color="amber"
        :loading="loading"
      />
      <KpiCard
        title="Рейсов сегодня"
        :value="kpi.ridesToday"
        icon="pi pi-map-marker"
        color="rose"
        :loading="loading"
      />
    </div>

    <!-- График + последние смены -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

      <!-- График выручки -->
      <div class="xl:col-span-2 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-surface-900 dark:text-surface-0">Выручка за 14 дней</h3>
            <p class="text-sm text-surface-400">По данным закрытых смен</p>
          </div>
        </div>
        <div class="h-56">
          <Chart
            v-if="!loading"
            type="line"
            :data="chartData"
            :options="chartOptions"
            class="h-full"
          />
          <div v-else class="h-full rounded-xl bg-surface-100 dark:bg-surface-700 animate-pulse" />
        </div>
      </div>

      <!-- Последние смены -->
      <div class="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 p-5 shadow-sm flex flex-col">
        <h3 class="font-semibold text-surface-900 dark:text-surface-0 mb-4">Последние смены</h3>

        <div v-if="loading" class="flex flex-col gap-3 flex-1">
          <div v-for="i in 4" :key="i" class="h-12 rounded-lg bg-surface-100 dark:bg-surface-700 animate-pulse" />
        </div>

        <div v-else-if="recentShifts.length === 0" class="flex-1 flex flex-col items-center justify-center text-surface-400 gap-2">
          <i class="pi pi-clock text-3xl" />
          <p class="text-sm">Нет данных</p>
        </div>

        <ul v-else class="flex flex-col gap-2 flex-1">
          <li
            v-for="shift in recentShifts"
            :key="shift.id ?? shift['Смена']"
            class="flex items-start justify-between gap-2 py-2 border-b border-surface-100 dark:border-surface-700 last:border-0"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">
                {{ shift['ФИО'] ?? shift['Водитель'] ?? 'Водитель' }}
              </p>
              <p class="text-xs text-surface-400">{{ formatDate(shift['Дата начала']) }}</p>
            </div>
            <div class="flex flex-col items-end flex-shrink-0 gap-1">
              <StatusBadge :status="shift['Статус']" />
              <span v-if="shift['Выручка']" class="text-xs font-semibold text-surface-700 dark:text-surface-200">
                ₽ {{ formatMoney(shift['Выручка']) }}
              </span>
            </div>
          </li>
        </ul>

        <router-link to="/shifts" class="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline text-center">
          Все смены →
        </router-link>
      </div>

    </div>
  </div>
</template>
