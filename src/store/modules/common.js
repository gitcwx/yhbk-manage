const common = {
    state: {
        collapse: false,
        aliveTags: []
    },

    mutations: {
        SET_COLLAPSE: (state, collapse) => {
            state.collapse = collapse
        },
        SET_ALIVETAGS: (state, aliveTags) => {
            state.aliveTags = aliveTags
        }
    },

    action: {

    }
}

export default common
