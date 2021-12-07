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

        // 当前菜单是否折叠
        collapse: false,
        tagsList: [],
        setting: {
            // 显示头部日期时间
            showTimer: false,
            // 默认是否显示面包屑导航
            showCrumbs: undefined,
            // 默认是否显示标签栏
            showTags: undefined,
            // 默认显示语言
            language: undefined,
            // 菜单栏默认是否折叠
            collapse: undefined
        }
    },

    mutations: {
        SET_IS_LOADING: (state, { isLoading, loadingText, loadingSpinner, loadingBackground }) => {
            state.isLoading = isLoading
            state.loadingText = loadingText || '加载中...'
            // state.loadingSpinner = loadingSpinner || '<i class="manage-icon icon-loading"></i>'
            state.loadingBackground = loadingBackground || 'rgba(0, 0, 0, 0.2)'
        },
        SET_FULL_LOADING: (state, { isLoading, loadingText, loadingSpinner, loadingBackground }) => {
            state.isFullLoading = isLoading
            state.fullLoadingText = loadingText || '加载中...'
            // state.fullLoadingSpinner = loadingSpinner || '<i class="manage-icon icon-loading"></i>'
            state.fullLoadingBackground = loadingBackground || 'rgba(0, 0, 0, 0.2)'
        },
        SET_COLLAPSE: (state, collapse) => {
            state.collapse = collapse
        },
        SET_TAGSLIST: (state, tagsList) => {
            state.tagsList = tagsList
        },
        SET_SETTING: (state, setting) => {
            for (const key in state.setting) {
                if (setting[key] !== undefined) {
                    state.setting[key] = setting[key]
                }
            }
            localStorage.setItem('setting', JSON.stringify(state.setting))
        }
    },

    action: {

    }
}

export default common
