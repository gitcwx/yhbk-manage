import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: { name: 'dashboard' }
    },
    {
        path: '/manage',
        redirect: { name: 'dashboard' }
    },
    {
        path: '/manage/dashboard',
        name: 'dashboard',
        component: () => import('@/views/manage/dashboard.vue'),
        meta: { title: '控制台' }
    },
    {
        path: '/manage/permission',
        name: 'permission',
        component: () => import('@/views/manage/permission.vue'),
        meta: { title: '权限控制' }
    },
    {
        path: '/manage/message',
        name: 'message',
        component: () => import('@/views/manage/user/message.vue'),
        meta: { title: '系统消息' }
    },
    {
        path: '/manage/userInfo',
        name: 'userInfo',
        component: () => import('@/views/manage/user/info.vue'),
        meta: { title: '用户资料' }
    },
    {
        path: '/manage/password',
        name: 'password',
        component: () => import('@/views/manage/user/password.vue'),
        meta: { title: '修改密码' }
    },
    {
        path: '/manage/403',
        name: '403',
        component: () => import('@/views/errors/403.vue'),
        meta: { title: '403', allow: true }
    },
    {
        path: '/manage/404',
        name: '404',
        component: () => import('@/views/errors/404.vue'),
        meta: { title: '404', allow: true }
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
