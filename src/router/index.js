
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import JobIndex from '../components/JobIndex.vue'
import AddJob from '../components/AddJob.vue'
import TriggerIndex from '../components/TriggerIndex.vue'
import onloadtrigger from '../components/onloadtrigger.vue'

const routes = [
  {
    path: '/',
    name: 'Job',
    component: JobIndex
  },
  {
    path: '/job',
    name: 'JobDetail',
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