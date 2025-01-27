import { createApp } from 'vue'
// import './style.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Vue3CronPlusPicker from 'vue3-cron-plus-picker' // 引入组件
import 'vue3-cron-plus-picker/style.css' //引入组件相关样式
//全局引用路由
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(ElementPlus).use(Vue3CronPlusPicker).use(router).mount('#app')