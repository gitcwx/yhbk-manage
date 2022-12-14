import { createApp } from 'vue'
import App from '@/views/App'
import '@/registerServiceWorker'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import extend from '@/extend'

import NProgress from 'nprogress'
import moment from 'moment'
import { api } from '@/api'
import { getToken, setToken } from '@/util/cookies.js'
import i18n from '@/lang'

/* elplus */
import {
    ElLoading,
    ElMessage,
    ElMessageBox
 } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

const app = createApp(App)

/* 属性挂载 */
axios.defaults.timeout = 60000
axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
app.config.globalProperties.$axios = axios
app.config.globalProperties.$moment = moment
app.config.globalProperties.$api = api

/* elplus 服务式调用 */
app.config.globalProperties.$ElLoading = ElLoading
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.config.globalProperties.$alert = ElMessageBox.alert

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('@/mock')

app.use(i18n)
app.use(extend)

/* 初始化 css */
require('@/assets/css/reset.scss')
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
    config.headers.language = app.config.globalProperties.$getLanguage()
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
    if (error.response) {
        store.commit('SET_IS_LOADING', { isLoading: false })
        if (error.response.data && error.response.data.msg) {
            ElMessage.warning(error.response.data.msg)
        } else {
            ElMessage.warning(error.response.statusText)
        }
        if (error.response.status === 401 || error.response.status === 405) {
            router.push({ name: 'login' })
        }
        return new Promise(() => {
        })
    }
    return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
    const language = app.config.globalProperties.$getLanguage()
    // 设置页面title
    if (language === 'zh') {
        to.meta.title && (document.title = to.meta.title)
    } else if (language === 'en') {
        to.meta.titleEn && (document.title = to.meta.titleEn)
    }
    // 公开页面 /login
    if (to.meta.open) {
        next(); return
    }
    // 检查token
    const token = getToken()
    if (!token) {
        router.push({ name: 'login' })
        return
    }
    // 页面加载进度条
    NProgress.start()
    // 需要权限的页面
    ;(async () => {
        // 获取权限集
        if (store.state.user.permission.length === 0) {
            await store.dispatch('getPermission')
        }
        // 需要登录 不需要权限页面 /404
        if (to.meta.allow) {
            next(); return
        }
        const permission = store.state.user.permission
        if (permission.some(v => v.name === to.name)) {
            next(); return
        }
        next({ name: '403' })
    })()
})

router.afterEach(() => {
    NProgress.done()
})

app
  .use(store)
  .use(router)
  .mount('#app')
