import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('@/views/vehicles/VehiclesList.vue'),
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/orders/OrdersList.vue'),
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/finance/FinanceDashboard.vue'),
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

export default router
