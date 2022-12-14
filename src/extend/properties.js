import store from '@/store'

// 数据克隆
const deepClone = function (obj) {
    const that = this
    const objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // 判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = that.$deepClone(obj[key])
                } else {
                    // 如果不是，简单复制
                    objClone[key] = obj[key]
                }
            }
        }
    }
    return objClone
}

// 跨域加载js文件
const loadScript = function (srcUrl, callback, noCache) {
    const sc = document.createElement('script')
    function orc () {
        if (/(complete)|(loaded)/.test(sc.readyState) && callback) { callback() };
    }
    if (sc.addEventListener) {
        if (callback) {
            sc.addEventListener('load', callback, false)
        }
    } else {
        sc.attachEvent('onreadystatechange', orc)
    }
    (document.head || document.getElementsByTagName('head')[0]).appendChild(sc)
    sc.src = noCache ? srcUrl + '?c=' + Math.random() : srcUrl
}

// 获取当前语言
const getLanguage = function () {
    // vuex缓存读取
    const language = store.state.common.setting.language
    if (language) {
        return language
    }
    // localStorage缓存读取
    let setting = localStorage.getItem('setting')
    if (!setting) {
        return 'zh'
    }
    try {
        setting = JSON.parse(setting)
        return setting.language || 'zh'
    } catch (err) {
        return 'zh'
    }
}
export {
    deepClone,
    loadScript,
    getLanguage
}
