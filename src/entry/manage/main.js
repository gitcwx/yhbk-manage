import { createApp } from 'vue'
import App from '@/views/manage/app'
import '@/registerServiceWorker'
import router from './router'
import store from '@/store'
import axios from 'axios'

// 第三方组件
import NProgress from 'nprogress'
import moment from 'moment'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// 私有对象
import { api } from '@/api'
import { getToken, setToken } from '@/util/cookies.js'

const app = createApp(App)

/* 变量挂载 */
app.config.globalProperties.api = api

/* 方法挂载 */
app.config.globalProperties.moment = moment
app.config.globalProperties.$axios = axios
axios.defaults.timeout = 60000

/* 插件install */
app.use(ElementPlus)

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('../../../mock')

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
        config.headers.token = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 将响应头的令牌更新到cookie
axios.interceptors.response.use(response => {
    const token = response.headers.token
    if (typeof token !== 'undefined') {
        setToken(token)
    }
    return response
}, error => {
    if (typeof error.response !== 'undefined' && error.response.status === 401) {
        window.location.href = '/login'
        return new Promise(() => {
        })
    }
    return Promise.reject(error)
})

// 根据name检查是否有权限
function checkAllowByName (name, permission) {
    let allow = false
    for (let i = 0; i < permission.length; i++) {
        const item = permission[i]
        if (item.children) {
            allow = checkAllowByName(name, item.children)
        } else if (item.index === name) {
            allow = true
        }
        if (allow) { break }
    }
    return allow
}

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

        if (checkAllowByName(to.name, permission)) {
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
