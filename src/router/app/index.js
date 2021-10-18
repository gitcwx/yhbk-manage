import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: { name: 'welcome' }
    },
    {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/app/welcome/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/app/login/index.vue')
    },
    {
        path: '/qrcode',
        name: 'qrcode',
        component: () => import('@/views/app/qrcode/index.vue')
    },
    {
        path: '/game/testSpeed',
        name: 'testSpeed',
        component: () => import('@/views/app/games/testSpeed/index.vue')
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/common/errors/403.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/common/errors/404.vue')
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
