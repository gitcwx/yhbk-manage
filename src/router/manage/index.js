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
        component: () => import('@/views/manage/dashboard/index.vue'),
        meta: { title: '控制台', titleEn: 'Dashboard' }
    },
    {
        path: '/manage/permission',
        name: 'permission',
        component: () => import('@/views/manage/permission/list.vue'),
        meta: { title: '权限控制', titleEn: 'Permission Control' }
    },
    {
        path: '/manage/message/list',
        name: 'message.list',
        component: () => import('@/views/manage/message/list.vue'),
        meta: { title: '留言板', titleEn: 'Message List' }
    },

    /* user start */
    {
        path: '/manage/user',
        name: 'user.folder',
        redirect: { name: 'user.list' },
        meta: { title: '用户中心', titleEn: 'User' }
    },
    {
        path: '/manage/user/list',
        name: 'user.list',
        component: () => import('@/views/manage/user/list.vue'),
        meta: { title: '用户列表', titleEn: 'User List' }
    },
    {
        path: '/manage/user/info',
        name: 'user.info',
        component: () => import('@/views/manage/user/info.vue'),
        meta: { title: '用户资料', titleEn: 'User Info' }
    },
    {
        path: '/manage/user/password',
        name: 'user.password',
        component: () => import('@/views/manage/user/password.vue'),
        meta: { title: '修改密码', titleEn: 'Modify Password' }
    },
    /* user end */

    /* article start */
    {
        path: '/manage/article',
        name: 'article.folder',
        redirect: { name: 'article.list' },
        meta: { title: '文章管理', titleEn: 'Article' }
    },
    {
        path: '/manage/article/list',
        name: 'article.list',
        component: () => import('@/views/manage/article/list.vue'),
        meta: { title: '文章列表', titleEn: 'Article List' }
    },
    {
        path: '/manage/article/add',
        name: 'article.add',
        component: () => import('@/views/manage/article/add.vue'),
        meta: { title: '新增文章', titleEn: 'Add Article' }
    },
    {
        path: '/manage/article/edit',
        name: 'article.edit',
        component: () => import('@/views/manage/article/edit.vue'),
        meta: { title: '修改文章', titleEn: 'Edit Article' }
    },
    {
        path: '/manage/article/category',
        name: 'article.category',
        component: () => import('@/views/manage/article/category.vue'),
        meta: { title: '文章分类', titleEn: 'Article Category' }
    },
    {
        path: '/manage/article/tags',
        name: 'article.tags',
        component: () => import('@/views/manage/article/tags.vue'),
        meta: { title: '文章分类', titleEn: 'Article Tags' }
    },
    /* article end */

    {
        path: '/manage/403',
        name: '403',
        component: () => import('@/views/common/errors/403.vue'),
        meta: { title: '403', titleEn: '403', allow: true }
    },
    {
        path: '/manage/404',
        name: '404',
        component: () => import('@/views/common/errors/404.vue'),
        meta: { title: '404', titleEn: '404', allow: true }
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
