import { ref } from 'vue'
import { integram, TABLES } from '@/api/integram'

const REF = {
  DRIVERS:        20,
  OPERATION_TYPES: 30, // Типы операций
  CATEGORIES:     32,  // Категории финансов
}

export function useFinance() {
  const transactions = ref([])
  const loading  = ref(false)
  const saving   = ref(false)
  const error    = ref(null)

  const drivers    = ref([])
  const opTypes    = ref([])
  const categories = ref([])

  function parseList(res) {
    const d = res.data
    return d?.objects ?? d ?? []
  }

  async function loadLookups() {
    const [d, ot, cat] = await Promise.all([
      integram.list(REF.DRIVERS),
      integram.list(REF.OPERATION_TYPES),
      integram.list(REF.CATEGORIES),
    ])
    drivers.value    = parseList(d).map(r => ({ id: r.id, label: r.value }))
    opTypes.value    = parseList(ot).map(r => ({ id: r.id, label: r.value }))
    categories.value = parseList(cat).map(r => ({ id: r.id, label: r.value }))
  }

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const res = await integram.list(TABLES.FINANCE)
      transactions.value = parseList(res)
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
        await integram.update(TABLES.FINANCE, id, data)
      } else {
        await integram.create(TABLES.FINANCE, data)
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
      await integram.delete(TABLES.FINANCE, id)
      transactions.value = transactions.value.filter(t => t.id !== id)
      return true
    } catch (e) {
      error.value = e?.message || 'Ошибка удаления'
      return false
    }
  }

  return {
    transactions, loading, saving, error,
    drivers, opTypes, categories,
    load, loadLookups, save, remove,
  }
}
