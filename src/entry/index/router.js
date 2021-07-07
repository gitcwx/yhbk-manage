import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: { name: 'welcome' }
    },
    {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/index/welcome/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/index/login/index.vue')
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/errors/403.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errors/404.vue')
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
