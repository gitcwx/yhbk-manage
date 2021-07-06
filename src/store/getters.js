const getters = {
    userInfo: (state) => {
        return state.user.info || {}
    }
}
export default getters
