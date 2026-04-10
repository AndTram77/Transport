<script setup>
// PageHeader — заголовок страницы с иконкой, подзаголовком и слотом для кнопок
// Props:
//   title      — основной заголовок
//   subtitle   — подзаголовок (опционально)
//   icon       — PrimeIcons класс (например, 'pi pi-car')
// Slots:
//   actions    — кнопки справа (Button, SplitButton и т.д.)

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="page-header">
    <div class="page-header__left">
      <span v-if="icon" class="page-header__icon">
        <i :class="icon" />
      </span>
      <div>
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-header__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--primary-color);
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.page-header__title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
  line-height: 1.2;
}

.page-header__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
