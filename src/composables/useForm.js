import { ref, reactive, computed } from 'vue'

// useForm — composable для работы с формами (создание/редактирование записей)
// Параметры:
//   initialValues — начальные значения полей { field: defaultValue }
//   submitFn      — async функция (values) → вызывается при submit
//   options:
//     validate    — функция (values) → объект ошибок { field: 'сообщение' } или null
//     onSuccess   — callback после успешного submit
//     onError     — callback при ошибке submit

export function useForm(initialValues = {}, submitFn = null, options = {}) {
  const { validate, onSuccess, onError } = options

  const values  = reactive({ ...initialValues })
  const errors  = ref({})
  const loading = ref(false)
  const dirty   = ref(false)

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  function reset() {
    Object.assign(values, initialValues)
    errors.value = {}
    dirty.value  = false
  }

  function fill(data) {
    Object.assign(values, data)
    errors.value = {}
    dirty.value  = false
  }

  function setError(field, message) {
    errors.value = { ...errors.value, [field]: message }
  }

  function clearError(field) {
    const updated = { ...errors.value }
    delete updated[field]
    errors.value = updated
  }

  function touch() {
    dirty.value = true
  }

  function runValidation() {
    if (!validate) return true
    const result = validate(values)
    if (result && Object.keys(result).length > 0) {
      errors.value = result
      return false
    }
    errors.value = {}
    return true
  }

  async function submit() {
    touch()
    if (!runValidation()) return false
    if (!submitFn) return true

    loading.value = true
    try {
      const result = await submitFn({ ...values })
      if (onSuccess) onSuccess(result)
      return result
    } catch (e) {
      const msg = e?.message || 'Ошибка при сохранении'
      errors.value = { _global: msg }
      if (onError) onError(e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    values,
    errors,
    loading,
    dirty,
    isValid,
    reset,
    fill,
    setError,
    clearError,
    touch,
    submit,
  }
}
