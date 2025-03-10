// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/globalstyle.scss'

// vue-good-table-next's required CSS
import 'vue-good-table-next/dist/vue-good-table-next.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
