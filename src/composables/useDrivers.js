import { ref } from 'vue'
import { integram, TABLES } from '@/api/integram'

const REF = {
  STATUSES:  14,
  VEHICLES:  19,
  GENDER:    191,
}

export function useDrivers() {
  const drivers  = ref([])
  const loading  = ref(false)
  const saving   = ref(false)
  const error    = ref(null)

  const statuses  = ref([])
  const vehicles  = ref([])
  const genders   = ref([])

  function parseList(res) {
    const d = res.data
    return d?.objects ?? d ?? []
  }

  async function loadLookups() {
    const [s, v, g] = await Promise.all([
      integram.list(REF.STATUSES),
      integram.list(REF.VEHICLES),
      integram.list(REF.GENDER),
    ])
    statuses.value = parseList(s).map(r => ({ id: r.id, label: r.value }))
    vehicles.value = parseList(v).map(r => ({ id: r.id, label: r.value }))
    genders.value  = parseList(g).map(r => ({ id: r.id, label: r.value }))
  }

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const res = await integram.list(TABLES.DRIVERS)
      drivers.value = parseList(res)
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function loadOne(id) {
    const res = await integram.get(TABLES.DRIVERS, id)
    return res.data ?? null
  }

  async function save(data, id = null) {
    saving.value = true
    error.value  = null
    try {
      if (id) {
        await integram.update(TABLES.DRIVERS, id, data)
      } else {
        await integram.create(TABLES.DRIVERS, data)
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
      await integram.delete(TABLES.DRIVERS, id)
      drivers.value = drivers.value.filter(d => d.id !== id)
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка удаления'
      return false
    }
  }

  return {
    drivers, loading, saving, error,
    statuses, vehicles, genders,
    load, loadOne, loadLookups, save, remove,
  }
}
