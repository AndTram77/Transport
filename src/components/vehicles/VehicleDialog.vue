<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible:    { type: Boolean, default: false },
  vehicle:    { type: Object, default: null },   // null = создание
  brands:     { type: Array, default: () => [] },
  bodyTypes:  { type: Array, default: () => [] },
  fuelTypes:  { type: Array, default: () => [] },
  statuses:   { type: Array, default: () => [] },
  saving:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.vehicle?.id)
const title  = computed(() => isEdit.value ? 'Редактировать автомобиль' : 'Добавить автомобиль')

const form = ref({})

function resetForm() {
  form.value = {
    value:                props.vehicle?.value ?? '',                    // Госномер
    'Модель':             props.vehicle?.['Модель'] ?? '',
    'Год выпуска':        props.vehicle?.['Год выпуска'] ?? null,
    'VIN':                props.vehicle?.['VIN'] ?? '',
    'Цвет':               props.vehicle?.['Цвет'] ?? '',
    'Пробег':             props.vehicle?.['Пробег'] ?? null,
    'Срок ОСАГО':         props.vehicle?.['Срок ОСАГО'] ?? null,
    'Срок ТО':            props.vehicle?.['Срок ТО'] ?? null,
    'Срок лицензии такси': props.vehicle?.['Срок лицензии такси'] ?? null,
    'Марка':              props.vehicle?.['МаркаId'] ?? props.vehicle?.['Марка.id'] ?? null,
    'Тип кузова':         props.vehicle?.['Тип кузоваId'] ?? props.vehicle?.['Тип кузова.id'] ?? null,
    'Тип топлива':        props.vehicle?.['Тип топливаId'] ?? props.vehicle?.['Тип топлива.id'] ?? null,
    'Статус':             props.vehicle?.['СтатусId'] ?? props.vehicle?.['Статус.id'] ?? null,
  }
}

watch(() => props.visible, (v) => { if (v) resetForm() })

function close() { emit('update:visible', false) }

function submit() {
  if (!form.value.value) return
  emit('save', { ...form.value }, props.vehicle?.id ?? null)
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

      <!-- Госномер -->
      <div class="field">
        <label class="field-label">Гос. номер <span class="text-red-500">*</span></label>
        <InputText v-model="form.value" placeholder="А123ВГ 116" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Марка -->
        <div class="field">
          <label class="field-label">Марка</label>
          <Select
            v-model="form['Марка']"
            :options="brands"
            optionLabel="label"
            optionValue="id"
            placeholder="Выберите марку"
            class="w-full"
          />
        </div>
        <!-- Модель -->
        <div class="field">
          <label class="field-label">Модель</label>
          <InputText v-model="form['Модель']" placeholder="Camry" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Год выпуска -->
        <div class="field">
          <label class="field-label">Год выпуска</label>
          <InputNumber v-model="form['Год выпуска']" :useGrouping="false" placeholder="2020" class="w-full" />
        </div>
        <!-- Цвет -->
        <div class="field">
          <label class="field-label">Цвет</label>
          <InputText v-model="form['Цвет']" placeholder="Белый" class="w-full" />
        </div>
      </div>

      <!-- VIN -->
      <div class="field">
        <label class="field-label">VIN</label>
        <InputText v-model="form['VIN']" placeholder="XTA21099054637891" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Тип кузова -->
        <div class="field">
          <label class="field-label">Тип кузова</label>
          <Select
            v-model="form['Тип кузова']"
            :options="bodyTypes"
            optionLabel="label"
            optionValue="id"
            placeholder="Седан"
            class="w-full"
          />
        </div>
        <!-- Тип топлива -->
        <div class="field">
          <label class="field-label">Тип топлива</label>
          <Select
            v-model="form['Тип топлива']"
            :options="fuelTypes"
            optionLabel="label"
            optionValue="id"
            placeholder="Бензин"
            class="w-full"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Пробег -->
        <div class="field">
          <label class="field-label">Пробег (км)</label>
          <InputNumber v-model="form['Пробег']" :useGrouping="true" placeholder="50 000" class="w-full" />
        </div>
        <!-- Статус -->
        <div class="field">
          <label class="field-label">Статус</label>
          <Select
            v-model="form['Статус']"
            :options="statuses"
            optionLabel="label"
            optionValue="id"
            placeholder="Доступен"
            class="w-full"
          />
        </div>
      </div>

      <Divider class="my-0" />
      <p class="text-sm font-medium text-surface-600 dark:text-surface-300">Документы</p>

      <div class="grid grid-cols-3 gap-4">
        <div class="field">
          <label class="field-label">Срок ОСАГО</label>
          <DatePicker v-model="form['Срок ОСАГО']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
        <div class="field">
          <label class="field-label">Срок ТО</label>
          <DatePicker v-model="form['Срок ТО']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
        <div class="field">
          <label class="field-label">Срок лицензии</label>
          <DatePicker v-model="form['Срок лицензии такси']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
      </div>

    </div>

    <template #footer>
      <Button label="Отмена" severity="secondary" text @click="close" />
      <Button
        :label="isEdit ? 'Сохранить' : 'Добавить'"
        icon="pi pi-check"
        :loading="saving"
        :disabled="!form.value"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--text-color-secondary); }
</style>
