import { createApp } from 'vue'
import '@/assets/css/animation.css'
import pinia from '@/stores/index.js'
import '@/assets/css/Gobal.css'
import App from './App.vue'
import router from '@/router/index.js'
import '@/assets/css/good_css.css'
import '@/assets/css/Light-Dark.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
