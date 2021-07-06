import { createStore } from 'vuex'
import common from './modules/common'
import user from './modules/user'
import getters from './getters'

export default createStore({
    modules: {
        common,
        user
    },
    getters
})
