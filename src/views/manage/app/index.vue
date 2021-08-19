<template>
    <el-config-provider :locale="locale">
        <app-header />
        <app-menu />
        <div class="app-body" :class="{ 'app-collapse': collapse }">
            <app-tags />
            <div
                class="container"
                v-loading="isLoading"
                :element-loading-text="loadingText"
                :element-loading-spinner="loadingSpinner"
                :element-loading-background="loadingBackground"
            >
                <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
                <el-backtop target=".container" />
            </div>
        </div>
    </el-config-provider>
</template>
<script>
    import { ElConfigProvider } from 'element-plus'
    import { localeSetting } from '@/util/localeSetting'
    import { mapState } from 'vuex'
    import appHeader from './header.vue'
    import appMenu from './menu.vue'
    import appTags from './tags.vue'

    export default {
        name: 'app',
        components: {
            ElConfigProvider,
            appHeader,
            appMenu,
            appTags
        },
        data () {
            return {}
        },
        computed: {
            locale () {
                const language = this.$store.getters.language
                return localeSetting[language]
            },
            ...mapState({
                collapse: state => state.common.collapse,
                tagsList (state) {
                    const aliveTags = state.common.aliveTags
                    const tagsNameArray = []
                    for (let i = 0, len = aliveTags.length; i < len; i++) {
                        aliveTags[i].name && tagsNameArray.push(aliveTags[i].name)
                    }
                    return tagsNameArray
                },

                isLoading: state => state.common.isLoading,
                loadingText: state => state.common.loadingText,
                loadingSpinner: state => state.common.loadingSpinner,
                loadingBackground: state => state.common.loadingBackground
            })
        },
        created () {
            this.$store.commit('SET_LANGUAGE', localStorage.getItem('language'))
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
.app-body {
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom: 0;
    padding-bottom: 30px;
    transition: left 0.3s ease-in-out;
    background: #f0f0f0;

    &.app-collapse {
        left: 65px;
    }

    .container {
        width: auto;
        height: 100%;
        padding: 10px;
        overflow-y: scroll;
        box-sizing: border-box;

        .manage {
            background: #fff;
            min-height: 100%;
            padding: 20px;
        }
    }
}
</style>
