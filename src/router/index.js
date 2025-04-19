
// router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import JobIndex from '../views/JobIndex.vue'
import TriggerIndex from '../views/TriggerIndex.vue'
import VirtualPlatform from '../views/VirtualPlatform.vue'
import sseListener from '../views/sseListener.vue'
import uploadIP from '../views/uploadIP.vue'

const routes = [
  {
    path: '/',
    name: 'ip',
    component: uploadIP,
    // 首页
  },
  {
    path: '/uploadIP',
    name: 'uploadIP',
    component: uploadIP,
    // 上传IP页面
  },
  {
    path: '/JobIndex',
    name: 'JobIndex',
    component: JobIndex,
    // 任务索引页面
  },
  {
    path: '/TriggerIndex',
    name: 'TriggerIndex',
    component: TriggerIndex,
    // 触发器索引页面
  },
  {
    path: '/VirtualPlatform',
    name: 'VirtualPlatform',
    component: VirtualPlatform,
    // 虚拟平台页面
  },
  {
    path: '/sseListener',
    name: 'sseListener',
    component: sseListener,
    // SSE监听器页面
  },
]

const router = createRouter({
  history: createWebHashHistory('/quartz_visualization'),
  routes,
});



export default router