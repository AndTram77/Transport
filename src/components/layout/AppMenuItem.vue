<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayout } from '@/composables/layout'

const route = useRoute()
const router = useRouter()
const { layoutState, setActiveMenuItem, toggleMenu } = useLayout()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
})

const isActiveMenu = ref(false)
const itemKey = ref(null)

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index)

  const activeItem = layoutState.activeMenuItem
  isActiveMenu.value =
    props.root ||
    (activeItem === itemKey.value ||
      (activeItem ? activeItem.startsWith(itemKey.value + '-') : false))
})

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      props.root ||
      (newVal === itemKey.value ||
        (newVal ? newVal.startsWith(itemKey.value + '-') : false))
  }
)

// Подсветка активного маршрута
const checkActiveRoute = (item) => {
  return route.path === item.to
}

const onItemClick = (event, item) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (item.to) {
    setActiveMenuItem(itemKey.value)
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      toggleMenu()
    }
  }

  if (item.items) {
    isActiveMenu.value = !isActiveMenu.value
    setActiveMenuItem(isActiveMenu.value ? itemKey.value : null)
  }
}
</script>

<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <!-- Заголовок группы (root) -->
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
      {{ item.label }}
    </div>

    <!-- Ссылка на маршрут -->
    <router-link
      v-if="item.to && item.visible !== false"
      :to="item.to"
      :class="['layout-menuitem-link', { 'active-route': checkActiveRoute(item) }]"
      :tabindex="item.disabled ? '-1' : '0'"
      @click="onItemClick($event, item)"
    >
      <i :class="['layout-menuitem-icon', item.icon]"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <span v-if="item.badge" class="p-badge p-badge-secondary">{{ item.badge }}</span>
      <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
    </router-link>

    <!-- Внешняя ссылка -->
    <a
      v-if="item.url && item.visible !== false"
      :href="item.url"
      :class="['layout-menuitem-link']"
      :target="item.target"
      :tabindex="item.disabled ? '-1' : '0'"
      @click="onItemClick($event, item)"
    >
      <i :class="['layout-menuitem-icon', item.icon]"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
    </a>

    <!-- Подменю -->
    <Transition name="layout-submenu">
      <ul v-if="item.items && item.visible !== false" v-show="root ? true : isActiveMenu" class="layout-submenu">
        <AppMenuItem
          v-for="(child, i) in item.items"
          :key="child.label"
          :index="i"
          :item="child"
          :root="false"
          :parentItemKey="itemKey"
        />
      </ul>
    </Transition>
  </li>
</template>
