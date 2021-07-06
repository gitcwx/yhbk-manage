<template>
    <app-header />
    <div class="app-content">
        <router-view />
    </div>
    <app-footer />
</template>
<script>
    import appHeader from './header.vue'
    import appFooter from './footer.vue'
    export default {
        name: 'app',
        components: {
            appHeader,
            appFooter
        },
        data () {
            return {}
        }
    }
</script>

<style scoped lang="scss" src="./assets/css/index.scss"></style>
