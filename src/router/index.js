import { createRouter, createWebHistory } from 'vue-router'
import { manageRouter } from './router.manage'
import { fullPageRouter } from './router.fullPage'

const routes = [
    {
        path: '/manage',
        children: manageRouter,
        component: () => import('@/views/manage/layout/index.vue'),
        redirect: { name: 'dashboard' }
    },
    ...fullPageRouter
]

// 生产环境根路径指向网站首页
if (process.env.NODE_ENV !== 'production') {
    routes.unshift({
        path: '/',
        redirect: { name: 'dashboard' }
    })
}

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
