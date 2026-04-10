import { ref, computed } from 'vue'

// useTable — composable для работы с табличными данными через Integram API
// Возвращает: items, loading, error, pagination, filters, методы load/refresh/reset

export function useTable(fetchFn, options = {}) {
  const {
    pageSize = 25,
    initialFilters = {},
  } = options

  const items      = ref([])
  const loading    = ref(false)
  const error      = ref(null)
  const totalCount = ref(0)

  const filters = ref({ ...initialFilters })
  const page    = ref(1)
  const rowsPerPage = ref(pageSize)

  const totalPages = computed(() => Math.ceil(totalCount.value / rowsPerPage.value))
  const isEmpty    = computed(() => !loading.value && items.value.length === 0)

  async function load() {
    loading.value = true
    error.value   = null
    try {
      const result = await fetchFn({
        filters: filters.value,
        page: page.value,
        limit: rowsPerPage.value,
      })
      // fetchFn должна вернуть { items, total } или просто массив
      if (Array.isArray(result)) {
        items.value      = result
        totalCount.value = result.length
      } else {
        items.value      = result.items ?? []
        totalCount.value = result.total ?? result.items?.length ?? 0
      }
    } catch (e) {
      error.value = e?.message || 'Ошибка загрузки данных'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    return load()
  }

  function setFilter(key, value) {
    filters.value[key] = value
    page.value = 1
    return load()
  }

  function resetFilters() {
    filters.value = { ...initialFilters }
    page.value    = 1
    return load()
  }

  function onPageChange(event) {
    // PrimeVue DataTable возвращает { page, rows }
    page.value        = (event.page ?? 0) + 1
    rowsPerPage.value = event.rows ?? rowsPerPage.value
    return load()
  }

  return {
    items,
    loading,
    error,
    totalCount,
    filters,
    page,
    rowsPerPage,
    totalPages,
    isEmpty,
    load,
    refresh,
    setFilter,
    resetFilters,
    onPageChange,
  }
}
