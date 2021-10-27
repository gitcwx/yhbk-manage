<template>
    <div
        class="app-layout"
        v-loading="isLoading"
        :element-loading-text="loadingText"
        :element-loading-spinner="loadingSpinner"
        :element-loading-background="loadingBackground"
    >
        <router-view />
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'app-layout',
        computed: {
            ...mapState({
                isLoading: state => state.common.isLoading,
                loadingText: state => state.common.loadingText,
                loadingSpinner: state => state.common.loadingSpinner,
                loadingBackground: state => state.common.loadingBackground
            })
        }
    }
</script>
<style lang="scss">
.app-layout {
    position: relative;
    height: 100vh;
}
</style>
