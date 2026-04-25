import { ref } from 'vue'
import { integram, TABLES } from '@/api/integram'

// ID справочников
const REF = {
  BRANDS:   15,
  BODY:     16,
  FUEL:     17,
  STATUSES: 18,
}

export function useVehicles() {
  const vehicles  = ref([])
  const loading   = ref(false)
  const saving    = ref(false)
  const error     = ref(null)

  // Справочники для форм
  const brands   = ref([])
  const bodyTypes = ref([])
  const fuelTypes = ref([])
  const statuses  = ref([])

  function parseList(res) {
    const d = res.data
    if (!d) return []
    return d.objects ?? d ?? []
  }

  async function loadLookups() {
    const [b, body, f, s] = await Promise.all([
      integram.list(REF.BRANDS),
      integram.list(REF.BODY),
      integram.list(REF.FUEL),
      integram.list(REF.STATUSES),
    ])
    brands.value    = parseList(b).map(r => ({ id: r.id, label: r.value }))
    bodyTypes.value = parseList(body).map(r => ({ id: r.id, label: r.value }))
    fuelTypes.value = parseList(f).map(r => ({ id: r.id, label: r.value }))
    statuses.value  = parseList(s).map(r => ({ id: r.id, label: r.value }))
  }

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const res = await integram.list(TABLES.VEHICLES)
      vehicles.value = parseList(res)
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function loadOne(id) {
    const res = await integram.get(TABLES.VEHICLES, id)
    return res.data ?? null
  }

  async function save(data, id = null) {
    saving.value = true
    error.value  = null
    try {
      if (id) {
        await integram.update(TABLES.VEHICLES, id, data)
      } else {
        await integram.create(TABLES.VEHICLES, data)
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
      await integram.delete(TABLES.VEHICLES, id)
      vehicles.value = vehicles.value.filter(v => v.id !== id)
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка удаления'
      return false
    }
  }

  return {
    vehicles, loading, saving, error,
    brands, bodyTypes, fuelTypes, statuses,
    load, loadOne, loadLookups, save, remove,
  }
}
