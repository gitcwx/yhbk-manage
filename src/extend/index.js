import directives from './directives'
import dictionary from './dictionary'
import { components, plugins } from './element'
const properties = require('./properties')

// 公共组件/模块
const uiFiles = require.context('./components', true, /\/ui-[^/]+\/index.vue$/)
const msFiles = require.context('./modules', true, /\/ms-[^/]+\/index.vue$/)
uiFiles.keys().forEach((key, index) => {
    components.push(uiFiles(key).default || uiFiles(key))
})
msFiles.keys().forEach((key, index) => {
    components.push(msFiles(key).default || msFiles(key))
})

export default {
    install: (app) => {
        components.forEach((component) => {
            app.component(component.name, component)
        })

        plugins.forEach((plugin) => {
            app.use(plugin)
        })

        // 全局指令
        Object.keys(directives).forEach(key => {
            app.directive(key, directives[key])
        })

        // 全局变量方法挂载
        Object.keys(properties).forEach(key => {
            app.config.globalProperties['$' + key] = properties[key]
        })

        // element 全局配置
        app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }

        // 字典
        app.config.globalProperties.$dictionary = dictionary
    }
}
