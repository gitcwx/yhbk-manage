import dictionary from './dictionary'

export default {
    dictionary: {
        mounted: (el, params) => {
            const dicName = params.value.dicName
            if (!dicName) {
                console.error('请输入字典名称')
                return
            }
            if (!dictionary[dicName]) {
                console.error('不存在的字典名称')
                return
            }
            const item = dictionary[dicName].find(v => v.value === params.value.value)
            el.innerHTML = item ? item.label : '-'
        }
    }
}
