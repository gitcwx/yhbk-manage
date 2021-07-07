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
    userMsgCount: (state) => {
        return state.user.msgCount
    },
    isCollapse: (state) => {
        return state.common.collapse
    },
    aliveTags: (state) => {
        return state.common.aliveTags
    }
}
export default getters
