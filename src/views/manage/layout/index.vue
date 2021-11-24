<template>
    <!-- 顶部 -->
    <manage-header />
    <!-- 菜单 -->
    <manage-menu />
    <!-- 主体 -->
    <div class="manage-body" :class="{ 'is-menu-collapse': collapse }">
        <!-- 面包屑 -->
        <manage-crumbs v-if="setting.showCrumbs" />
        <!-- 标签栏 -->
        <manage-tags v-if="setting.showTags"/>
        <!-- 视图 -->
        <div
            class="manage-view"
            v-loading="isLoading"
            :element-loading-text="loadingText"
            :element-loading-spinner="loadingSpinner"
            :element-loading-background="loadingBackground"
        >
            <router-view v-slot="{ Component }">
                <transition name="body-move">
                    <keep-alive :include="aliveTags">
                        <component :is="Component" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
        <!-- 返回顶部 -->
        <el-backtop target=".manage-view">
            <div class="el-backtop-inner">UP</div>
        </el-backtop>
        <!-- 右侧设置弹窗 -->
        <manage-drawer />
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import manageHeader from './header.vue'
    import manageCrumbs from './crumbs.vue'
    import manageMenu from './menu.vue'
    import manageTags from './tags.vue'
    import manageDrawer from './drawer.vue'

    export default {
        name: 'manage',
        components: {
            manageHeader,
            manageCrumbs,
            manageMenu,
            manageTags,
            manageDrawer
        },
        provide () {
            return {
                closeCurrentPage: this.closeCurrentPage
            }
        },
        data () {
            return {}
        },
        computed: {
            ...mapState({
                collapse: state => state.common.collapse,
                setting: state => state.common.setting,
                aliveTags (state) {
                    const tagsList = state.common.tagsList
                    const tagsNameArray = []
                    for (let i = 0, len = tagsList.length; i < len; i++) {
                        tagsList[i].name && tagsNameArray.push(tagsList[i].name)
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
            // 菜单栏是否折叠
            if (this.setting.collapse === 'auto') {
                this.$store.commit('SET_COLLAPSE', document.body.clientWidth < 1500)
            } else {
                this.$store.commit('SET_COLLAPSE', this.setting.collapse)
            }
            // 获取用户信息
            this.$store.dispatch('getUserInfo')
        },
        methods: {
            closeCurrentPage (nextPath) {
                const tagsList = this.$store.state.common.tagsList
                // 移除当前项
                const currentIndex = tagsList.findIndex(v => v.path === this.$route.path)
                tagsList.splice(currentIndex, 1)
                this.$store.commit('SET_TAGSLIST', tagsList)

                // 指定跳转
                if (nextPath) {
                    if (typeof nextPath === 'number') {
                        this.$router.go(nextPath)
                    } else {
                        this.$router.push(nextPath)
                    }
                    return
                }

                // 跳转相邻项
                const nextTag = tagsList[currentIndex] ? tagsList[currentIndex] : tagsList[currentIndex - 1]
                if (nextTag) {
                    this.$router.push(nextTag.fullPath)
                } else {
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style lang="scss">
.manage-body {
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom: 0;
    transition: left 0.3s ease-in-out;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
    z-index: 1;

    &.is-menu-collapse {
        left: 65px;
    }

    .manage-view {
        width: auto;
        flex: 1;
        padding: 10px 0 10px 10px;
        overflow-y: scroll;

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

        .body-move-enter-to,
        .body-move-leave-from {
            opacity: 1;
            transform: translateX(0);
            transition: all 0.5s ease-in-out;
        }

        .body-move-enter-from {
            opacity: 0;
            transform: translateX(-50px);
        }
        .body-move-leave-to {
            opacity: 0;
            transform: translateX(50px);
        }
    }

    .el-backtop-inner {
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
        text-align: center;
        line-height: 40px;
        color: $color-primary;
    }
}
</style>
