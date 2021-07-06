import { createApp } from 'vue'
import App from '@/views/index/app'
import '@/registerServiceWorker'
import router from './router'
import store from '@/store'
import axios from 'axios'
import NProgress from 'nprogress'
import moment from 'moment'
import { api } from '@/api'

const app = createApp(App)

/* 变量挂载 */
app.config.globalProperties.api = api

/* 方法挂载 */
app.config.globalProperties.moment = moment
app.config.globalProperties.$axios = axios
axios.defaults.timeout = 60000

/* 插件install */

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
  .mount('#app')
