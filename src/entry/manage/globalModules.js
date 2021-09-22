import uiQrcode from '@/components/ui-qrcode/index.vue'

const globalModules = [
    uiQrcode
]

const install = function (Vue, opts = {}) {
    globalModules.forEach(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install
}
