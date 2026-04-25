import { ref } from 'vue'
import { integram, TABLES } from '@/api/integram'

const REF = {
  VEHICLES:   19,
  WORK_TYPES: 27, // Типы работ ТО
  STATUSES:   28, // Статусы ТО
}

export function useMaintenance() {
  const records = ref([])
  const loading = ref(false)
  const saving  = ref(false)
  const error   = ref(null)

  const vehicles  = ref([])
  const workTypes = ref([])
  const statuses  = ref([])

  function parseList(res) {
    const d = res.data
    return d?.objects ?? d ?? []
  }

  async function loadLookups() {
    const [v, wt, s] = await Promise.allSettled([
      integram.list(REF.VEHICLES),
      integram.list(REF.WORK_TYPES),
      integram.list(REF.STATUSES),
    ])
    vehicles.value  = v.status  === 'fulfilled' ? parseList(v.value).map(r => ({ id: r.id, label: r.value }))  : []
    workTypes.value = wt.status === 'fulfilled' ? parseList(wt.value).map(r => ({ id: r.id, label: r.value })) : []
    statuses.value  = s.status  === 'fulfilled' ? parseList(s.value).map(r => ({ id: r.id, label: r.value }))  : []
  }

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const res = await integram.list(TABLES.MAINTENANCE)
      records.value = parseList(res)
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function save(data, id = null) {
    saving.value = true
    error.value  = null
    try {
      if (id) {
        await integram.update(TABLES.MAINTENANCE, id, data)
      } else {
        await integram.create(TABLES.MAINTENANCE, data)
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
      await integram.delete(TABLES.MAINTENANCE, id)
      records.value = records.value.filter(r => r.id !== id)
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка удаления'
      return false
    }
  }

  return {
    records, loading, saving, error,
    vehicles, workTypes, statuses,
    load, loadLookups, save, remove,
  }
}
