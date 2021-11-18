const common = {
    state: {
        // manage内局部loading
        isLoading: false,
        loadingText: '',
        loadingSpinner: '',
        loadingBackground: '',
        // 全屏loading
        isFullLoading: false,
        fullLoadingText: '',
        fullLoadingSpinner: '',
        fullLoadingBackground: '',

        language: '',
        collapse: false,
        aliveTags: []
    },

    mutations: {
        SET_IS_LOADING: (state, { isLoading, loadingText, loadingSpinner, loadingBackground }) => {
            state.isLoading = isLoading
            state.loadingText = loadingText || '加载中...'
            state.loadingSpinner = loadingSpinner || 'el-icon-loading'
            state.loadingBackground = loadingBackground || 'rgba(0, 0, 0, 0.45)'
        },
        SET_FULL_LOADING: (state, { isLoading, loadingText, loadingSpinner, loadingBackground }) => {
            state.isFullLoading = isLoading
            state.fullLoadingText = loadingText || '加载中...'
            state.fullLoadingSpinner = loadingSpinner || 'el-icon-loading'
            state.fullLoadingBackground = loadingBackground || 'rgba(0, 0, 0, 0.45)'
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language
            localStorage.setItem('language', language)
        },
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
