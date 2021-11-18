import { createRouter, createWebHistory } from 'vue-router'
import { manageRouter } from './router.manage'
import { fullPageRouter } from './router.fullPage'

const routes = [
    {
        path: '/',
        children: manageRouter,
        component: () => import('@/views/manage/layout/index.vue'),
        redirect: { name: 'dashboard' }
    },
    ...fullPageRouter
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
