
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import JobIndex from '../views/JobIndex.vue'
import AddJob from '../components/AddJob.vue'
import TriggerIndex from '../views/TriggerIndex.vue'
import onloadtrigger from '../components/onloadtrigger.vue'
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
    path: '/AddJob',
    name: 'AddJob',
    component: AddJob
  },
  {
    path: '/TriggerIndex',
    name: 'TriggerIndex',
    component: TriggerIndex
  },
  {
    path: '/onloadtrigger',
    name: 'onloadtrigger',
    component: onloadtrigger
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router