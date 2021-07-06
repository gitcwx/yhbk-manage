import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/manage',
        name: 'manage',
        redirect: { name: 'dashboard' }
    },
    {
        path: '/manage/dashboard',
        name: 'dashboard',
        component: () => import('@/views/manage/dashboard/index.vue')
    },
    {
        path: '/manage/404',
        name: '404',
        component: () => import('@/views/errors/404/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: '404' }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
