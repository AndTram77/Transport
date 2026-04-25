<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible:  { type: Boolean, default: false },
  shift:    { type: Object, default: null },
  drivers:  { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
  saving:   { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.shift?.id)
const title  = computed(() => isEdit.value ? 'Редактировать смену' : 'Открыть смену')

const form = ref({})

function toDateVal(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d) ? null : d
}

function resetForm() {
  const s = props.shift ?? {}
  form.value = {
    value:              s.value ?? '',
    'Водитель':         s['ВодительId']   ?? s['Водитель.id']   ?? null,
    'Автомобиль':       s['АвтомобильId'] ?? s['Автомобиль.id'] ?? null,
    'Статус':           s['СтатусId']     ?? s['Статус.id']     ?? null,
    'Дата начала':      toDateVal(s['Дата начала']),
    'Дата окончания':   toDateVal(s['Дата окончания']),
    'Выручка':          s['Выручка'] ?? null,
    'Выплата водителю': s['Выплата водителю'] ?? null,
    'Комиссия парка':   s['Комиссия парка'] ?? null,
    'Пробег':           s['Пробег'] ?? null,
    'Топливо':          s['Топливо'] ?? null,
    'Примечание':       s['Примечание'] ?? '',
  }
}

watch(() => props.visible, (v) => { if (v) resetForm() })

function close()  { emit('update:visible', false) }
function submit() {
  if (!form.value['Водитель']) return
  emit('save', { ...form.value }, props.shift?.id ?? null)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :header="title"
    :style="{ width: '600px' }"
    :draggable="false"
    modal
  >
    <div class="flex flex-col gap-4 pt-2">

      <!-- Название -->
      <div class="field">
        <label class="field-label">Название смены</label>
        <InputText v-model="form.value" placeholder="Смена №1 — Иванов" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Водитель -->
        <div class="field">
          <label class="field-label">Водитель <span class="text-red-500">*</span></label>
          <Select v-model="form['Водитель']" :options="drivers" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" filter />
        </div>
        <!-- Автомобиль -->
        <div class="field">
          <label class="field-label">Автомобиль</label>
          <Select v-model="form['Автомобиль']" :options="vehicles" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" filter />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Дата начала -->
        <div class="field">
          <label class="field-label">Дата начала</label>
          <DatePicker v-model="form['Дата начала']" dateFormat="dd.mm.yy" class="w-full" showIcon showTime hourFormat="24" />
        </div>
        <!-- Дата окончания -->
        <div class="field">
          <label class="field-label">Дата окончания</label>
          <DatePicker v-model="form['Дата окончания']" dateFormat="dd.mm.yy" class="w-full" showIcon showTime hourFormat="24" />
        </div>
      </div>

      <Divider class="my-0" />
      <p class="text-sm font-medium text-surface-600 dark:text-surface-300">Финансы</p>

      <div class="grid grid-cols-3 gap-4">
        <div class="field">
          <label class="field-label">Выручка, ₽</label>
          <InputNumber v-model="form['Выручка']" :min="0" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Выплата вод., ₽</label>
          <InputNumber v-model="form['Выплата водителю']" :min="0" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Комиссия парка, ₽</label>
          <InputNumber v-model="form['Комиссия парка']" :min="0" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Пробег, км</label>
          <InputNumber v-model="form['Пробег']" :min="0" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Топливо, л</label>
          <InputNumber v-model="form['Топливо']" :min="0" :maxFractionDigits="1" class="w-full" />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Статус</label>
        <Select v-model="form['Статус']" :options="statuses" optionLabel="label" optionValue="id"
          placeholder="Открыта" class="w-full" />
      </div>

      <div class="field">
        <label class="field-label">Примечание</label>
        <Textarea v-model="form['Примечание']" rows="2" class="w-full" autoResize />
      </div>

    </div>

    <template #footer>
      <Button label="Отмена" severity="secondary" text @click="close" />
      <Button
        :label="isEdit ? 'Сохранить' : 'Открыть смену'"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!form['Водитель']"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--text-color-secondary); }
</style>
