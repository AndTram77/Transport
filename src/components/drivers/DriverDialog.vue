<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible:  { type: Boolean, default: false },
  driver:   { type: Object, default: null },
  statuses: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  genders:  { type: Array, default: () => [] },
  saving:   { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.driver?.id)
const title  = computed(() => isEdit.value ? 'Редактировать водителя' : 'Добавить водителя')

const form = ref({})

function toDateVal(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d) ? null : d
}

function resetForm() {
  const d = props.driver ?? {}
  form.value = {
    value:                        d.value ?? '',           // ФИО
    'Телефон':                    d['Телефон'] ?? '',
    'Дата рождения':              toDateVal(d['Дата рождения']),
    'Паспорт':                    d['Паспорт'] ?? '',
    'Адрес':                      d['Адрес'] ?? '',
    'Водительское удостоверение': d['Водительское удостоверение'] ?? '',
    'Категория ВУ':               d['Категория ВУ'] ?? '',
    'Срок ВУ':                    toDateVal(d['Срок ВУ']),
    'Дата приёма':                toDateVal(d['Дата приёма']),
    'Статус':                     d['СтатусId'] ?? d['Статус.id'] ?? null,
    'Автомобиль':                 d['АвтомобильId'] ?? d['Автомобиль.id'] ?? null,
    'Пол':                        d['ПолId'] ?? d['Пол.id'] ?? null,
  }
}

watch(() => props.visible, (v) => { if (v) resetForm() })

function close() { emit('update:visible', false) }
function submit() {
  if (!form.value.value) return
  emit('save', { ...form.value }, props.driver?.id ?? null)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :header="title"
    :style="{ width: '580px' }"
    :draggable="false"
    modal
  >
    <div class="flex flex-col gap-4 pt-2">

      <!-- ФИО -->
      <div class="field">
        <label class="field-label">ФИО <span class="text-red-500">*</span></label>
        <InputText v-model="form.value" placeholder="Иванов Иван Иванович" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Телефон</label>
          <InputText v-model="form['Телефон']" placeholder="+7 (900) 000-00-00" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Пол</label>
          <Select v-model="form['Пол']" :options="genders" optionLabel="label" optionValue="id"
            placeholder="Выберите" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Дата рождения</label>
          <DatePicker v-model="form['Дата рождения']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
        <div class="field">
          <label class="field-label">Дата приёма</label>
          <DatePicker v-model="form['Дата приёма']" dateFormat="dd.mm.yy" class="w-full" showIcon />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Паспорт (серия и номер)</label>
        <InputText v-model="form['Паспорт']" placeholder="1234 567890" class="w-full" />
      </div>

      <div class="field">
        <label class="field-label">Адрес проживания</label>
        <Textarea v-model="form['Адрес']" rows="2" class="w-full" autoResize />
      </div>

      <Divider class="my-0" />
      <p class="text-sm font-medium text-surface-600 dark:text-surface-300">Водительское удостоверение</p>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Номер ВУ</label>
          <InputText v-model="form['Водительское удостоверение']" placeholder="16АА 000000" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Категория</label>
          <InputText v-model="form['Категория ВУ']" placeholder="B, C, D..." class="w-full" />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Срок действия ВУ</label>
        <DatePicker v-model="form['Срок ВУ']" dateFormat="dd.mm.yy" class="w-full" showIcon />
      </div>

      <Divider class="my-0" />
      <p class="text-sm font-medium text-surface-600 dark:text-surface-300">Рабочие данные</p>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="field-label">Статус</label>
          <Select v-model="form['Статус']" :options="statuses" optionLabel="label" optionValue="id"
            placeholder="Активен" class="w-full" />
        </div>
        <div class="field">
          <label class="field-label">Автомобиль</label>
          <Select v-model="form['Автомобиль']" :options="vehicles" optionLabel="label" optionValue="id"
            placeholder="Выберите авто" class="w-full" filter />
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
