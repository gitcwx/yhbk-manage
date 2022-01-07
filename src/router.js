import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: { name: 'dashboard' },
        component: () => import('@/views/manage/layout/index.vue'),
        meta: { title: '首页', titleEn: 'Home' },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/manage/dashboard/index.vue'),
                meta: {
                    title: '控制台',
                    titleEn: 'Dashboard',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'dashboard' }
                    ]
                }
            },
            {
                path: 'permission',
                name: 'permission',
                component: () => import('@/views/manage/permission/list.vue'),
                meta: {
                    title: '权限控制',
                    titleEn: 'Permission Control',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'permission' }
                    ]
                }
            },
            {
                path: 'message',
                name: 'message.folder',
                redirect: { name: 'message.list' },
                meta: { title: '留言', titleEn: 'Message' }
            },
            {
                path: 'message/list',
                name: 'message.list',
                component: () => import('@/views/manage/message/list.vue'),
                meta: {
                    title: '留言管理',
                    titleEn: 'Message List',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'message.list' }
                    ]
                }
            },

            /* user start */
            {
                path: 'user',
                name: 'user.folder',
                redirect: { name: 'user.list' },
                meta: { title: '用户中心', titleEn: 'User' }
            },
            {
                path: 'user/list',
                name: 'user.list',
                component: () => import('@/views/manage/user/list.vue'),
                meta: {
                    title: '用户列表',
                    titleEn: 'User List',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'user.list' }
                    ]
                }
            },
            {
                path: 'user/password',
                name: 'user.password',
                component: () => import('@/views/manage/user/password.vue'),
                meta: {
                    title: '修改密码',
                    titleEn: 'Modify Password',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'user.password' }
                    ]
                }
            },
            {
                path: 'user/edit',
                name: 'user.edit',
                component: () => import('@/views/manage/user/edit.vue'),
                meta: {
                    title: '用户编辑',
                    titleEn: 'User Edit',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'user.list', path: '/user.list' },
                        { name: 'user.edit' }
                    ]
                }
            },
            /* user end */

            /* article start */
            {
                path: 'article',
                name: 'article.folder',
                redirect: { name: 'article.list' },
                meta: { title: '文章管理', titleEn: 'Article' }
            },
            {
                path: 'article/list',
                name: 'article.list',
                component: () => import('@/views/manage/article/list.vue'),
                meta: {
                    title: '文章列表',
                    titleEn: 'Article List',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list' }
                    ]
                }
            },
            {
                path: 'article/add',
                name: 'article.add',
                component: () => import('@/views/manage/article/add.vue'),
                meta: {
                    title: '新增文章',
                    titleEn: 'Add Article',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list', path: '/article/list' },
                        { name: 'article.add' }
                    ]
                }
            },
            {
                path: 'article/edit',
                name: 'article.edit',
                component: () => import('@/views/manage/article/edit.vue'),
                meta: {
                    title: '修改文章',
                    titleEn: 'Edit Article',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list', path: '/article/list' },
                        { name: 'article.edit' }
                    ]
                }
            },
            {
                path: 'article/category',
                name: 'article.category',
                component: () => import('@/views/manage/article/category.vue'),
                meta: {
                    title: '分类管理',
                    titleEn: 'Article Category',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list', path: '/article/list' },
                        { name: 'article.category' }
                    ]
                }
            },
            {
                path: 'article/tags',
                name: 'article.tags',
                component: () => import('@/views/manage/article/tags.vue'),
                meta: {
                    title: '标签管理',
                    titleEn: 'Article Tags',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list', path: '/article/list' },
                        { name: 'article.tags' }
                    ]
                }
            },
            {
                path: 'article/comment',
                name: 'article.comment',
                component: () => import('@/views/manage/article/comment.vue'),
                meta: {
                    title: '评论管理',
                    titleEn: 'Article Comment',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'article.list', path: '/article.list' },
                        { name: 'article.comment' }
                    ]
                }
            },
            /* article end */

            /* game start */
            {
                path: 'game',
                name: 'game.folder',
                redirect: { name: 'game.2048' },
                meta: { title: '小游戏', titleEn: 'Game' }
            },
            {
                path: 'game/2048',
                name: 'game.2048',
                component: () => import('@/views/manage/game/2048/index.vue'),
                meta: {
                    title: '2048',
                    titleEn: '2048',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'game.2048' }
                    ]
                }
            },
            {
                path: 'game/cube',
                name: 'game.cube',
                component: () => import('@/views/manage/game/cube/index.vue'),
                meta: {
                    title: '魔方',
                    titleEn: 'cube',
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: 'game.cube' }
                    ]
                }
            },
            /* game end */

            {
                path: '403',
                name: '403',
                component: () => import('@/views/manage/errors/403.vue'),
                meta: {
                    title: '访问受限',
                    titleEn: '403 Forbidden',
                    allow: true,
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: '403' }
                    ]
                }
            },
            {
                path: '404',
                name: '404',
                component: () => import('@/views/manage/errors/404.vue'),
                meta: {
                    title: '页面不存在',
                    titleEn: '404 Not Found',
                    allow: true,
                    crumbs: [
                        { name: 'home', path: '/' },
                        { name: '404' }
                    ]
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { open: true, title: '登录', titleEn: 'Login' }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: '404' }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior: (to, from, savedPosition) => {
        const $el = document.getElementById('manage-view')
        if ($el) {
            setTimeout(() => {
                $el.scrollTo(0, 0)
            }, 300)
        }
        return { top: 0, left: 0 }
    },
    routes
})

export default router
