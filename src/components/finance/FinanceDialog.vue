<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible:    { type: Boolean, default: false },
  transaction: { type: Object, default: null },
  drivers:    { type: Array, default: () => [] },
  opTypes:    { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  saving:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.transaction?.id)
const title  = computed(() => isEdit.value ? 'Редактировать операцию' : 'Добавить операцию')

const form = ref({})

function toDateVal(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d) ? null : d
}

function resetForm() {
  const t = props.transaction ?? {}
  form.value = {
    value:          t.value ?? '',
    'Тип операции': t['Тип операцииId'] ?? t['Тип операции.id'] ?? null,
    'Категория':    t['КатегорияId']    ?? t['Категория.id']    ?? null,
    'Водитель':     t['ВодительId']     ?? t['Водитель.id']     ?? null,
    'Сумма':        t['Сумма'] ?? null,
    'Дата':         toDateVal(t['Дата']),
    'Описание':     t['Описание'] ?? '',
  }
}

watch(() => props.visible, (v) => { if (v) resetForm() })

function close()  { emit('update:visible', false) }
function submit() {
  if (!form.value['Сумма']) return
  emit('save', { ...form.value }, props.transaction?.id ?? null)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :header="title"
    :style="{ width: '480px' }"
    :draggable="false"
    modal
  >
    <div class="flex flex-col gap-4 pt-2">

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Тип операции</label>
          <Select v-model="form['Тип операции']" :options="opTypes" optionLabel="label" optionValue="id"
            placeholder="Доход / Расход" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Категория</label>
          <Select v-model="form['Категория']" :options="categories" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Сумма, ₽ <span class="text-red-500">*</span></label>
          <InputNumber v-model="form['Сумма']" :min="0" :maxFractionDigits="2" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Дата</label>
          <DatePicker v-model="form['Дата']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Водитель</label>
        <Select v-model="form['Водитель']" :options="drivers" optionLabel="label" optionValue="id"
          placeholder="Не привязан" class="w-full" showClear filter />
      </div>

      <div class="field">
        <label class="field-label">Описание</label>
        <Textarea v-model="form['Описание']" rows="3" class="w-full" autoResize />
      </div>

    </div>

    <template #footer>
      <Button label="Отмена" severity="secondary" text @click="close" />
      <Button
        :label="isEdit ? 'Сохранить' : 'Добавить'"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!form['Сумма']"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--text-color-secondary); }
</style>
