<script setup>
defineProps({
  title:   { type: String, required: true },
  value:   { type: [String, Number], default: '—' },
  icon:    { type: String, default: 'pi pi-chart-bar' },
  color:   { type: String, default: 'indigo' }, // indigo | green | amber | rose
  suffix:  { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const colorMap = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950', icon: 'text-indigo-600 dark:text-indigo-400', ring: 'bg-indigo-100 dark:bg-indigo-900' },
  green:  { bg: 'bg-green-50 dark:bg-green-950',   icon: 'text-green-600 dark:text-green-400',   ring: 'bg-green-100 dark:bg-green-900'   },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-950',   icon: 'text-amber-600 dark:text-amber-400',   ring: 'bg-amber-100 dark:bg-amber-900'   },
  rose:   { bg: 'bg-rose-50 dark:bg-rose-950',     icon: 'text-rose-600 dark:text-rose-400',     ring: 'bg-rose-100 dark:bg-rose-900'     },
}
</script>

<template>
  <div class="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 p-5 flex items-center gap-4 shadow-sm">
    <!-- Иконка -->
    <div :class="['w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color]?.ring ?? colorMap.indigo.ring]">
      <i :class="[icon, 'text-2xl', colorMap[color]?.icon ?? colorMap.indigo.icon]" />
    </div>

    <!-- Значения -->
    <div class="min-w-0 flex-1">
      <p class="text-sm text-surface-500 dark:text-surface-400 truncate">{{ title }}</p>
      <div v-if="loading" class="h-8 w-24 rounded bg-surface-200 dark:bg-surface-700 animate-pulse mt-1" />
      <p v-else class="text-2xl font-bold text-surface-900 dark:text-surface-0 mt-0.5 leading-none">
        {{ value }}<span v-if="suffix" class="text-base font-normal text-surface-400 ml-1">{{ suffix }}</span>
      </p>
    </div>
  </div>
</template>
