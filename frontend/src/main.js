import { createApp, markRaw, watch } from 'vue'

import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedState)
pinia.use(({ store }) => {
    store.$router = markRaw(router)
  });

app.use(pinia)

app.use(router)
app.mount('#app')
