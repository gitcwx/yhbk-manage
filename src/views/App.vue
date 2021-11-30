<template>
    <el-config-provider :locale="locale">
        <div
            class="layout"
            :class="pageClass"
            v-loading="isFullLoading"
            :element-loading-text="fullLoadingText"
            :element-loading-spinner="fullLoadingSpinner"
            :element-loading-background="fullLoadingBackground"
        >
            <router-view />
        </div>
    </el-config-provider>
</template>

<script>
    import zh from 'element-plus/es/locale/lang/zh-cn'
    import en from 'element-plus/es/locale/lang/en'
    import { mapState } from 'vuex'
    export default {
        name: 'app-layout',
        computed: {
            ...mapState({
                isFullLoading: state => state.common.isFullLoading,
                fullLoadingText: state => state.common.fullLoadingText,
                fullLoadingSpinner: state => state.common.fullLoadingSpinner,
                fullLoadingBackground: state => state.common.fullLoadingBackground
            }),
            locale () {
                const language = this.$getLanguage()
                return language === 'en' ? en : zh
            },
            pageClass () {
                const matched = this.$route.matched || []
                if (matched.length > 1 && matched[0].path === '/') {
                    return 'layout-manage'
                } else {
                    return 'layout-page'
                }
            }
        },
        beforeCreate () {
            let setting = localStorage.getItem('setting')
            if (setting) {
                try {
                    setting = JSON.parse(setting)
                    const storeSetting = this.$store.state.common.setting
                    if (Object.keys(storeSetting).length !== Object.keys(setting).length) {
                        setting = null
                    }
                } catch (err) {
                    setting = null
                }
            }

            if (!setting) {
                setting = {
                    // 默认是否显示面包屑导航
                    showCrumbs: false,
                    // 默认是否显示标签栏
                    showTags: true,
                    // 默认显示语言
                    language: 'zh',
                    // 菜单栏默认是否折叠
                    collapse: 'auto'
                }
            }
            this.$store.commit('SET_SETTING', setting)
        }
    }
</script>
<style lang="scss">
.layout {
    position: relative;
    height: 100vh;
}
</style>
