<template>
  <!-- Страница логина без Layout -->
  <router-view v-if="route.meta.public" />
  <!-- Остальные страницы внутри AppLayout -->
  <AppLayout v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
</script>

<style>
@import "tailwindcss";
</style>
