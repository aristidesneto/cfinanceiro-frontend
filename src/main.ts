import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/main.css'

import DashboardLayout from './components/DashboardLayout.vue'

library.add(fas, fab, far)

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(router)
app.use(store)
app.use(VueSweetalert2)
app.mount('#app')
