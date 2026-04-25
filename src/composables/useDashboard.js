import { ref, computed } from 'vue'
import { integram, TABLES } from '@/api/integram'

// Форматирует дату в YYYY-MM-DD
function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

// Возвращает массив последних n дней (строки YYYY-MM-DD)
function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(toDateStr(d))
  }
  return days
}

export function useDashboard() {
  const loading = ref(false)
  const error   = ref(null)

  const vehicles  = ref([])
  const drivers   = ref([])
  const shifts    = ref([])
  const rides     = ref([])
  const finances  = ref([])

  // KPI — вычисляемые значения
  const kpi = computed(() => {
    const today = toDateStr(new Date())

    const activeVehicles = vehicles.value.filter(v => {
      const s = v['Статус'] ?? ''
      return s !== 'На ремонте' && s !== 'Недоступен'
    }).length

    const driversOnShift = shifts.value.filter(s => {
      const status = s['Статус'] ?? ''
      return status === 'Активна' || status === 'Активен'
    }).length

    const todayShifts = shifts.value.filter(s => {
      const d = (s['Дата начала'] ?? '').slice(0, 10)
      return d === today
    })
    const revenueToday = todayShifts.reduce((sum, s) => {
      return sum + (parseFloat(s['Выручка']) || 0)
    }, 0)

    const ridesToday = rides.value.filter(r => {
      const d = (r['Дата/время'] ?? '').slice(0, 10)
      return d === today
    }).length

    return { activeVehicles, driversOnShift, revenueToday, ridesToday }
  })

  // Данные для графика выручки — последние 14 дней
  const chartData = computed(() => {
    const days = lastNDays(14)
    const labels = days.map(d => {
      const [, m, day] = d.split('-')
      return `${day}.${m}`
    })

    const data = days.map(day => {
      return shifts.value
        .filter(s => (s['Дата начала'] ?? '').slice(0, 10) === day)
        .reduce((sum, s) => sum + (parseFloat(s['Выручка']) || 0), 0)
    })

    return {
      labels,
      datasets: [{
        label: 'Выручка, ₽',
        data,
        fill: true,
        tension: 0.4,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      }]
    }
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `₽ ${ctx.parsed.y.toLocaleString('ru-RU')}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: v => `₽ ${v.toLocaleString('ru-RU')}`
        }
      }
    }
  }

  // Последние смены (до 5)
  const recentShifts = computed(() => {
    return [...shifts.value]
      .sort((a, b) => new Date(b['Дата начала'] ?? 0) - new Date(a['Дата начала'] ?? 0))
      .slice(0, 5)
  })

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const [v, d, s, r] = await Promise.all([
        integram.list(TABLES.VEHICLES),
        integram.list(TABLES.DRIVERS),
        integram.list(TABLES.SHIFTS),
        integram.list(TABLES.RIDES),
      ])
      vehicles.value = v.data?.objects ?? v.data ?? []
      drivers.value  = d.data?.objects ?? d.data ?? []
      shifts.value   = s.data?.objects ?? s.data ?? []
      rides.value    = r.data?.objects ?? r.data ?? []
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  return {
    loading, error,
    kpi, chartData, chartOptions, recentShifts,
    load,
  }
}
