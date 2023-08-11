import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import 'vue3-toastify/dist/index.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/main.css'

import DashboardLayout from './components/DashboardLayout.vue'

library.add(fas, fab, far)

const app = createApp(App)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
} as ToastContainerOptions)

app.component('DefaultLayout', DashboardLayout)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker)

app.use(router)
app.use(store)
app.use(VueSweetalert2)
app.mount('#app')
