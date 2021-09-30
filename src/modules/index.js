const modules = []

const files = require.context('./', true, /^.\/ms-[^/]+\/index.vue$/)

files.keys().forEach((key, index) => {
    modules.push(files(key).default || files(key))
})

export default {
    install: (app) => {
        modules.forEach((ms) => {
            app.component(ms.name, ms)
        })
    }
}
