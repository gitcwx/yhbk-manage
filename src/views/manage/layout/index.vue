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
        <div id="manage-view" class="manage-view">
            <router-view v-slot="{ Component }">
                <transition name="body-move">
                    <keep-alive :include="aliveTags">
                        <component :is="Component" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
        <!-- 返回顶部 -->
        <el-backtop target="#manage-view">
            <div class="el-backtop-inner">UP</div>
        </el-backtop>
        <!-- 右边setting侧栏 -->
        <manage-drawer />
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import startDriver from '@/util/driver.js'
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
            return {
                loadingInstance: null
            }
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
        watch: {
            isLoading: {
                immediate: true,
                handler (newVal) {
                    if (newVal) {
                        const that = this
                        that.loadingInstance = this.$ElLoading.service({
                            target: '#manage-view',
                            text: that.loadingText,
                            spinner: that.loadingSpinner,
                            background: that.loadingBackground
                        })
                    } else if (this.loadingInstance) {
                        this.loadingInstance.close()
                    }
                }
            }
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
        mounted () {
            // 弹出导航引导
            if (!localStorage.getItem('driverReaded')) {
                startDriver()
            }
            // 键盘关闭标签事件
            document.addEventListener('keydown', this.keydownFn)
        },
        beforeUnmount () {
            document.removeEventListener('keydown', this.keydownFn)
        },
        methods: {
            keydownFn (event) {
                if (event.altKey && event.keyCode === 87) {
                    this.closeCurrentPage()
                }
            },
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

<style lang="scss" src="./assets/css/index.scss"></style>
