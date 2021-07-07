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
        path: '/manage/message',
        name: 'message',
        component: () => import('@/views/manage/user/message/index.vue')
    },
    {
        path: '/manage/403',
        name: '403',
        component: () => import('@/views/errors/403.vue'),
        meta: { allow: true }
    },
    {
        path: '/manage/404',
        name: '404',
        component: () => import('@/views/errors/404.vue'),
        meta: { allow: true }
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
