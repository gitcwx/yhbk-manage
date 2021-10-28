import { createApp } from 'vue'
import App from '@/views/app/layout'
import '@/registerServiceWorker'
import router from '@/router/app'
import store from '@/store'
import axios from 'axios'
import global from '@/global'

import NProgress from 'nprogress'
import moment from 'moment'
import { api } from '@/api'

const app = createApp(App)

/* 属性挂载 */
axios.defaults.timeout = 60000
axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
app.config.globalProperties.$axios = axios
app.config.globalProperties.moment = moment
app.config.globalProperties.api = api

/* 加载devmock环境 */
process.env.NODE_ENV === 'devmock' && require('@/mock')

app.use(global)

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
