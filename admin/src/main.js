import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App)
    .use(router)
    .use(naive)
    .mount('#app')
