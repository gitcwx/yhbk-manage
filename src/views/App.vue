<template>
    <el-config-provider :locale="locale">
        <div
            class="app-layout"
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
            locale () {
                const language = this.$store.getters.language
                return language === 'en' ? en : zh
            },
            ...mapState({
                isFullLoading: state => state.common.isFullLoading,
                fullLoadingText: state => state.common.fullLoadingText,
                fullLoadingSpinner: state => state.common.fullLoadingSpinner,
                fullLoadingBackground: state => state.common.fullLoadingBackground
            })
        },
        created () {
            const language = localStorage.getItem('language')
            if (language) {
                this.$store.commit('SET_LANGUAGE', language)
            }
        }
    }
</script>
<style lang="scss">
.app-layout {
    position: relative;
    height: 100vh;
}
</style>
