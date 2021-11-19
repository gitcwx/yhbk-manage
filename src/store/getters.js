const getters = {
    userToken: (state) => {
        return state.user.token
    },
    userPermission: (state) => {
        return state.user.permission
    },
    userInfo: (state) => {
        return state.user.info
    },
    language: (state) => {
        return state.common.language === 'en' ? 'en' : 'zh'
    },
    isCollapse: (state) => {
        return state.common.collapse
    },
    aliveTags: (state) => {
        return state.common.aliveTags
    }
}
export default getters
