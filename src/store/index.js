import { createStore } from 'vuex'
import common from './modules/common'
import user from './modules/user'
import article from './modules/article'
import getters from './getters'

export default createStore({
    modules: {
        common,
        user,
        article
    },
    getters
})
