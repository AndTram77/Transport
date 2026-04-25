import { ref } from 'vue'
import { integram, TABLES } from '@/api/integram'

// Справочники
const REF = {
  DRIVERS:  20,
  VEHICLES: 19,
  STATUSES: 23, // Статусы смен
}

export function useShifts() {
  const shifts  = ref([])
  const loading = ref(false)
  const saving  = ref(false)
  const error   = ref(null)

  const drivers  = ref([])
  const vehicles = ref([])
  const statuses = ref([])

  function parseList(res) {
    const d = res.data
    return d?.objects ?? d ?? []
  }

  async function loadLookups() {
    const [d, v, s] = await Promise.all([
      integram.list(REF.DRIVERS),
      integram.list(REF.VEHICLES),
      integram.list(REF.STATUSES),
    ])
    drivers.value  = parseList(d).map(r => ({ id: r.id, label: r.value }))
    vehicles.value = parseList(v).map(r => ({ id: r.id, label: r.value }))
    statuses.value = parseList(s).map(r => ({ id: r.id, label: r.value }))
  }

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const res = await integram.list(TABLES.SHIFTS)
      shifts.value = parseList(res)
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function loadOne(id) {
    const res = await integram.get(TABLES.SHIFTS, id)
    return res.data ?? null
  }

  async function save(data, id = null) {
    saving.value = true
    error.value  = null
    try {
      if (id) {
        await integram.update(TABLES.SHIFTS, id, data)
      } else {
        await integram.create(TABLES.SHIFTS, data)
      }
      await load()
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка сохранения'
      return false
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    try {
      await integram.delete(TABLES.SHIFTS, id)
      shifts.value = shifts.value.filter(s => s.id !== id)
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка удаления'
      return false
    }
  }

  return {
    shifts, loading, saving, error,
    drivers, vehicles, statuses,
    load, loadOne, loadLookups, save, remove,
  }
}
