import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
//全局引用路由
import router from './router'
createApp(App).use(ElementPlus).use(router).mount('#app')