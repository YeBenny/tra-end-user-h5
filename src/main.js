// import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import pinia from './pinia'
import router from './router'
import vuetify from './vuetify'
import i18n from './i18n'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
