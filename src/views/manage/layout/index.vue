<template>
    <el-config-provider :locale="locale">
        <manage-header />
        <manage-menu />
        <div class="manage-body" :class="{ 'manage-collapse': collapse }">
            <manage-tags />
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
    import zh from 'element-plus/es/locale/lang/zh-cn'
    import en from 'element-plus/es/locale/lang/en'
    import { mapState } from 'vuex'
    import manageHeader from './header.vue'
    import manageMenu from './menu.vue'
    import manageTags from './tags.vue'

    export default {
        name: 'manage-layout',
        components: {
            manageHeader,
            manageMenu,
            manageTags
        },
        data () {
            return {}
        },
        computed: {
            locale () {
                const language = this.$store.getters.language
                return language === 'en' ? en : zh
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
            const language = localStorage.getItem('language')
            if (language) {
                this.$store.commit('SET_LANGUAGE', language)
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
.manage-body {
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom: 0;
    padding-bottom: 30px;
    transition: left 0.3s ease-in-out;
    background: #f0f0f0;

    &.manage-collapse {
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

            .table-search {
                .el-form-item__label {
                    min-width: 80px;
                }
                .el-input,
                .el-select {
                    width: 200px;
                }
            }
        }
    }
}
</style>
