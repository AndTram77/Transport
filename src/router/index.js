import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('@/views/drivers/DriversList.vue'),
  },
  {
    path: '/drivers/:id',
    name: 'DriverDetail',
    component: () => import('@/views/drivers/DriverDetail.vue'),
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('@/views/vehicles/VehiclesList.vue'),
  },
  {
    path: '/vehicles/:id',
    name: 'VehicleDetail',
    component: () => import('@/views/vehicles/VehicleDetail.vue'),
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/orders/OrdersList.vue'),
  },
  {
    path: '/shifts',
    name: 'Shifts',
    component: () => import('@/views/shifts/ShiftsList.vue'),
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/finance/FinanceDashboard.vue'),
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/Dashboard.vue'), // заглушка — Спринт 6
  },
  {
    path: '/contracts',
    name: 'Contracts',
    component: () => import('@/views/Dashboard.vue'), // заглушка — Спринт 6
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsList.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/Settings.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard — закрытые маршруты требуют авторизации
router.beforeEach((to) => {
  const token = localStorage.getItem('crm_token')
  const isPublic = to.meta.public === true

  if (!isPublic && !token) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && token) {
    return { name: 'Dashboard' }
  }
})

export default router
