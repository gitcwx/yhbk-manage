const components = []

const files = require.context('./', true, /^.\/ui-[^/]+\/index.vue$/)

files.keys().forEach((key, index) => {
    components.push(files(key).default || files(key))
})

export default {
    install: (app) => {
        components.forEach((component) => {
            app.component(component.name, component)
        })
    }
}
