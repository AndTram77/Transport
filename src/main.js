import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'

// PrimeVue компоненты
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Chart from 'primevue/chart'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import ProgressSpinner from 'primevue/progressspinner'
import Skeleton from 'primevue/skeleton'
import Divider from 'primevue/divider'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'

import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.directive('tooltip', Tooltip)

// Глобальная регистрация компонентов
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Message', Message)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Chart', Chart)
app.component('Tag', Tag)
app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.component('Select', Select)
app.component('DatePicker', DatePicker)
app.component('Textarea', Textarea)
app.component('InputNumber', InputNumber)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Skeleton', Skeleton)
app.component('Divider', Divider)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('Menu', Menu)
app.component('ConfirmDialog', ConfirmDialog)

app.mount('#app')
