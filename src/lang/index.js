import { createI18n } from 'vue-i18n/index'
import store from '@/store'
// 本地 语言包
import zh from './zh'
import en from './en'

import router from '@/router/manage'

router.getRoutes().forEach(item => {
    if (item.name) {
        const list = item.name.split('.')
        if (list.length === 1) {
            zh.router[item.name] = item.meta.title
            en.router[item.name] = item.meta.titleEn
        } else {
            // ['a', 'b', 'c']  =>  {a: {b: c: 'xxx'}}
            let tempZh = {}
            let tempEn = {}
            for (let i = list.length; i--; i >= 0) {
                if (i === list.length - 1) {
                    tempZh[list[i]] = item.meta.title
                    tempEn[list[i]] = item.meta.titleEn
                } else if (i === 0) {
                    zh.router[list[i]] = Object.assign(zh.router[list[i]] || {}, JSON.parse(JSON.stringify(tempZh)))
                    en.router[list[i]] = Object.assign(en.router[list[i]] || {}, JSON.parse(JSON.stringify(tempEn)))
                } else {
                    // 临时保存temp值
                    const strZh = JSON.stringify(tempZh)
                    const strEn = JSON.stringify(tempEn)
                    // 情况temp值
                    tempZh = {}
                    tempEn = {}
                    // 将temp值重新赋值
                    tempZh[list[i]] = JSON.parse(strZh)
                    tempEn[list[i]] = JSON.parse(strEn)
                }
            }
        }
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
