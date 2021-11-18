export const fullPageRouter = [
    {
        path: '/manage/login',
        name: 'login',
        component: () => import('@/views/fullScreen/login/index.vue'),
        meta: { open: true, title: '登录', titleEn: 'Login' }
    }
]
