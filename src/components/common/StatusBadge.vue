<script setup>
// StatusBadge — бейдж статуса с цветовой кодировкой
// Props:
//   status  — строка статуса (например, 'active', 'blocked', 'free')
//   map     — объект { статус: { label, severity } } (опционально, переопределяет дефолтный маппинг)

import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
  map: {
    type: Object,
    default: null,
  },
})

// Дефолтный маппинг для транспортной CRM
const DEFAULT_MAP = {
  // Водители
  active:    { label: 'Активен',     severity: 'success'  },
  blocked:   { label: 'Заблокирован', severity: 'danger'  },
  vacation:  { label: 'Отпуск',      severity: 'info'     },
  // Автомобили
  free:      { label: 'Свободен',    severity: 'success'  },
  busy:      { label: 'На смене',    severity: 'warning'  },
  repair:    { label: 'В ремонте',   severity: 'danger'   },
  // Заказы
  new:       { label: 'Новый',       severity: 'info'     },
  inprogress:{ label: 'В работе',    severity: 'warning'  },
  done:      { label: 'Выполнен',    severity: 'success'  },
  cancelled: { label: 'Отменён',     severity: 'danger'   },
  // ТО
  planned:   { label: 'Плановое',    severity: 'info'     },
  overdue:   { label: 'Просрочено',  severity: 'danger'   },
  completed: { label: 'Выполнено',   severity: 'success'  },
}

const resolvedMap = computed(() => props.map || DEFAULT_MAP)

const entry = computed(() => {
  const key = (props.status || '').toLowerCase()
  return resolvedMap.value[key] || { label: props.status, severity: 'secondary' }
})
</script>

<template>
  <Tag :value="entry.label" :severity="entry.severity" />
</template>
