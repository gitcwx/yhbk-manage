import { createApp } from 'vue'
import App from '@/views/manage/layout'
import '@/registerServiceWorker'
import router from '@/router/manage'
import store from '@/store'
import axios from 'axios'
import global from '@/global'

import NProgress from 'nprogress'
import moment from 'moment'
import { api } from '@/api'
import { getToken, setToken } from '@/util/cookies.js'
import i18n from '@/lang'

const app = createApp(App)

/* 属性挂载 */
axios.defaults.timeout = 60000
axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
app.config.globalProperties.$axios = axios
app.config.globalProperties.moment = moment
app.config.globalProperties.api = api

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('@/mock')

app.use(i18n)
app.use(global)

/* 初始化 css */
require('@/assets/css/reset.scss')
require('@/assets/fonts/iconfont.css')
/* 插件 css */
require('nprogress/nprogress.css')
/* 页面 css */
require('@/assets/css/index.scss')

// 将cookie的令牌添加到请求头
axios.interceptors.request.use(config => {
    const token = getToken()
    if (typeof token !== 'undefined') {
        config.headers.Authorization = 'Bearer ' + token
    }
    config.headers.language = localStorage.getItem('language') || store.getters.language
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    const Authorization = response.headers.Authorization
    if (Authorization) {
        const token = Authorization.split(' ')[1]
        token && setToken(token)
    }
    return response
}, error => {
    if (error.response && error.response.status === 405) {
        window.location.href = '/login'
        return new Promise(() => {
        })
    }
    return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
    // 检查token
    const token = getToken()
    if (!token) {
        window.location.href = '/login'
    }
    // 不需要权限页面
    if (to.meta.allow) {
        next(); return
    }
    // 设置页面title
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // 页面加载进度条
    NProgress.start()

    // 需要权限的页面
    ;(async () => {
        // 获取权限集
        if (store.getters.userPermission.length === 0) {
            await store.dispatch('getPermission')
        }
        const permission = store.getters.userPermission

        if (permission.some(v => v.name === to.name)) {
            next(); return
        }
        next({ name: '403' })
    })()
})

router.afterEach(() => {
    window.scrollTo({
        top: 0,
        // behavior: ['smooth', 'instant'] 平滑滚动 瞬间滚动
        behavior: 'instant'
    })
  NProgress.done()
})

app
  .use(store)
  .use(router)
  .mount('#app')
