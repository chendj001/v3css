import '@/scss/app.scss'
import scss from '@/scss/alias.module.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import App2 from './App2.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
