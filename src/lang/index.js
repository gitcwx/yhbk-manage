import { createI18n } from 'vue-i18n/index'
import store from '@/store'
// 本地 语言包
import zh from './zh'
import en from './en'

import router from '@/views/entry/manage/router'

router.getRoutes().forEach(item => {
    if (item.name) {
        zh.router[item.name] = item.meta.title
        en.router[item.name] = item.meta.titleEn
    }
})

const i18n = createI18n({
    fallbackLocale: 'zh',
    globalInjection: true,
    legacy: false,
    locale: localStorage.getItem('language') || store.getters.language,
    messages: {
        zh,
        en
    }
})

export default i18n
