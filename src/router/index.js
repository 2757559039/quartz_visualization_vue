
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import JobIndex from '../views/JobIndex.vue'
import TriggerIndex from '../views/TriggerIndex.vue'
import test from '../components/test.vue'

const routes = [
  {
    path: '/',
    name: 'Job',
    component: JobIndex
  },
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/JobIndex',
    name: 'JobIndex',
    component: JobIndex
  },
  {
    path: '/TriggerIndex',
    name: 'TriggerIndex',
    component: TriggerIndex
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router