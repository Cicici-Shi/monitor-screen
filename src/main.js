import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import vue3SeamlessScroll from 'vue3-seamless-scroll';
createApp(App).use(router).use(vue3SeamlessScroll).mount('#app')
