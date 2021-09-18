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

// i18n国际化翻译
import i18n from '../../lang'

// 私有对象
import { api } from '@/config/api'
import { dictionary } from '@/config/dictionary'
import { getToken, setToken } from '@/util/cookies.js'
import { deepClone } from '@/util/globalExtend.js'

const app = createApp(App)

/* 变量挂载 */
app.config.globalProperties.api = api
app.config.globalProperties.dictionary = dictionary

/* 方法挂载 */
axios.defaults.timeout = 60000
app.config.globalProperties.$axios = axios
app.config.globalProperties.moment = moment

/* 自定义方法挂载 */
app.config.globalProperties.deepClone = deepClone

/* 插件install */
app.use(ElementPlus, { size: 'small' })

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('../../../mock')

/* 初始化 css */
require('@/assets/css/reset.scss')
require('@/assets/fonts/iconfont.css')
/* 插件 css */
require('nprogress/nprogress.css')
/* 页面 css */
require('@/assets/css/index.scss')

// 注册全局指令
app.directive('dictionary', {
    mounted: (el, params) => {
        const dicName = params.value.dicName
        if (!dicName) {
            console.error('请输入字典名称')
            return
        }
        if (!dictionary[dicName]) {
            console.error('不存在的字典名称')
            return
        }
        const item = dictionary[dicName].find(v => v.value === params.value.value)
        el.innerHTML = item ? item.label : '-'
    }
})

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
  .use(i18n)
  .mount('#app')
