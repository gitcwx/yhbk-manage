import { createI18n } from 'vue-i18n/index'
import store from '@/store'
// 本地 语言包
import zh from './zh'
import en from './en'

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
