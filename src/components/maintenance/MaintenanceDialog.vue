<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible:   { type: Boolean, default: false },
  record:    { type: Object, default: null },
  vehicles:  { type: Array, default: () => [] },
  workTypes: { type: Array, default: () => [] },
  statuses:  { type: Array, default: () => [] },
  saving:    { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.record?.id)
const title  = computed(() => isEdit.value ? 'Редактировать ТО' : 'Добавить ТО')

const form = ref({})

function toDateVal(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d) ? null : d
}

function resetForm() {
  const r = props.record ?? {}
  form.value = {
    value:         r.value ?? '',
    'Автомобиль':  r['АвтомобильId'] ?? r['Автомобиль.id'] ?? null,
    'Тип работ':   r['Тип работId']  ?? r['Тип работ.id']  ?? null,
    'Статус':      r['СтатусId']     ?? r['Статус.id']     ?? null,
    'Дата':        toDateVal(r['Дата']),
    'Дата след.':  toDateVal(r['Дата след.']),
    'Пробег':      r['Пробег'] ?? null,
    'Стоимость':   r['Стоимость'] ?? null,
    'Сервис':      r['Сервис'] ?? '',
    'Описание':    r['Описание'] ?? '',
  }
}

watch(() => props.visible, (v) => { if (v) resetForm() })

function close()  { emit('update:visible', false) }
function submit() {
  if (!form.value['Автомобиль']) return
  emit('save', { ...form.value }, props.record?.id ?? null)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :header="title"
    :style="{ width: '560px' }"
    :draggable="false"
    modal
  >
    <div class="flex flex-col gap-4 pt-2">

      <div class="field">
        <label class="field-label">Название / Наряд</label>
        <InputText v-model="form.value" placeholder="ТО-1 — А777АА 777" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Автомобиль <span class="text-red-500">*</span></label>
          <Select v-model="form['Автомобиль']" :options="vehicles" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" filter />
        </div>
        <div class="field">
          <label class="field-label">Тип работ</label>
          <Select v-model="form['Тип работ']" :options="workTypes" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Дата ТО</label>
          <DatePicker v-model="form['Дата']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
        <div class="field">
          <label class="field-label">Следующее ТО</label>
          <DatePicker v-model="form['Дата след.']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Пробег, км</label>
          <InputNumber v-model="form['Пробег']" :min="0" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Стоимость, ₽</label>
          <InputNumber v-model="form['Стоимость']" :min="0" :maxFractionDigits="2" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Сервис / Мастерская</label>
          <InputText v-model="form['Сервис']" placeholder="СТО Мотор" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Статус</label>
          <Select v-model="form['Статус']" :options="statuses" optionLabel="label" optionValue="id"
            placeholder="Запланировано" class="w-full" />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Описание / Работы</label>
        <Textarea v-model="form['Описание']" rows="3" class="w-full" autoResize
          placeholder="Замена масла, фильтров, тормозных колодок..." />
      </div>

    </div>

    <template #footer>
      <Button label="Отмена" severity="secondary" text @click="close" />
      <Button
        :label="isEdit ? 'Сохранить' : 'Добавить'"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!form['Автомобиль']"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--text-color-secondary); }
</style>
