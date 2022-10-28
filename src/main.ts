import { routes } from './config/routes';
import { createApp } from 'vue'
import { App } from './App'
import { history } from './shared/history';
import { router } from './router'
import '@svgstore';

const app = createApp(App)
app.use(router)
app.mount('#app')
