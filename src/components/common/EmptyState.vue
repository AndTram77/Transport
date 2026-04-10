<script setup>
// EmptyState — заглушка "нет данных" для таблиц и списков
// Props:
//   icon     — PrimeIcons класс (по умолчанию pi pi-inbox)
//   title    — заголовок (по умолчанию "Нет данных")
//   message  — пояснение (опционально)
// Slots:
//   actions  — кнопка действия (например "Добавить первый")

defineProps({
  icon: {
    type: String,
    default: 'pi pi-inbox',
  },
  title: {
    type: String,
    default: 'Нет данных',
  },
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <i :class="icon" />
    </div>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="message" class="empty-state__message">{{ message }}</p>
    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.4;
}

.empty-state__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
  color: var(--text-color);
}

.empty-state__message {
  font-size: 0.875rem;
  margin: 0 0 1.25rem;
  max-width: 28rem;
}

.empty-state__actions {
  margin-top: 0.5rem;
}
</style>
