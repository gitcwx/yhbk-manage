import { createApp } from 'vue'
import App from '@/views/index/app'
import '@/registerServiceWorker'
import router from './router'
import store from '@/store'
import axios from 'axios'

// 第三方组件
import NProgress from 'nprogress'
import moment from 'moment'
// ElementPlus
import { ElementPlus } from './ElementPlus'

// 自定义公共组件/模块
import globalModules from './globalModules'

// 私有对象
import { api } from '@/config/api'

const app = createApp(App)

/* 变量挂载 */
app.config.globalProperties.api = api

/* 方法挂载 */
app.config.globalProperties.moment = moment
axios.defaults.timeout = 60000
axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
app.config.globalProperties.$axios = axios

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('../../../mock')

/* 初始化 css */
require('@/assets/css/reset.scss')
require('@/assets/fonts/iconfont.css')
/* 插件 css */
require('nprogress/nprogress.css')
/* 页面 css */
require('@/assets/css/index.scss')

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
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
  .use(ElementPlus)
  .use(globalModules)
  .mount('#app')
