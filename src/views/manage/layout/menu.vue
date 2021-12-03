<template>
    <div class="manage-menu">
        <div class="menu-wrap">
            <el-menu
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router
            >
                <template v-for="firstLevel in menuList">
                    <template v-if="firstLevel.children">
                        <el-sub-menu :index="nameToPath(firstLevel.name)" :key="firstLevel.id">
                            <template #title>
                                <i :class="firstLevel.icon"></i>
                                <span>{{ $t('router.' + firstLevel.name) }}</span>
                            </template>
                            <template v-for="secondLevel in firstLevel.children">
                                <el-sub-menu v-if="secondLevel.children" :index="nameToPath(secondLevel.name)" :key="secondLevel.id">
                                    <template #title>
                                        <i :class="secondLevel.icon"></i>
                                        {{ $t('router.' + secondLevel.name) }}
                                    </template>
                                </el-sub-menu>
                                <el-menu-item v-else-if="secondLevel.isMenu" :index="nameToPath(secondLevel.name)" :key="secondLevel.id">
                                    <i :class="secondLevel.icon"></i>
                                    {{ $t('router.' + secondLevel.name) }}
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                    <template v-else-if="firstLevel.isMenu">
                        <el-menu-item :index="nameToPath(firstLevel.name)" :key="firstLevel.id">
                            <i :class="firstLevel.icon"></i>
                            <span>{{ $t('router.' + firstLevel.name) }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>

        <!-- 折叠按钮 -->
        <div class="collapse-btn-wrap" :class="{'is-collapse': collapse}">
            <div class="run-time" v-if="!collapse">
                本次运行：
                <ui-timer type="counter" size="20" color="#20a0ff" :value="runTime" class="digital-num" @onStep="onStep"/>
            </div>
            <div id="collapse-btn" class="collapse-btn" @click="changeCollapse">
                <i v-if="!collapse" class="el-icon-s-fold"></i>
                <i v-else class="el-icon-s-unfold"></i>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: 'manage-menu',
        data () {
            return {
                runTime: 0,
                menuList: []
            }
        },
        computed: {
            ...mapState({
                collapse: state => state.common.collapse,
                permission: state => state.user.permission
            }),
            onRoutes () {
                return this.$route.path
            }
        },
        watch: {
            permission: {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal && newVal.length) {
                        this.menuList = this.treeByPid(JSON.parse(JSON.stringify(newVal)), '')
                    }
                }
            }
        },
        created () {
            this.runTime = sessionStorage.getItem('runTime') || 0
        },
        methods: {
            // 权限列表转换成树形菜单结构
            treeByPid (arr, parentMenuId) {
                const result = []
                const next = []
                arr.forEach(item => {
                    if (item.parentMenuId === parentMenuId) {
                        result.push(item)
                    } else {
                        next.push(item)
                    }
                })
                if (next.length) {
                    result.forEach(item => {
                        const children = this.treeByPid(next, item.id)
                        if (children.length) {
                            item.children = children
                        }
                    })
                }
                return result
            },
            nameToPath (name) {
                return '/' + name.replace(/\./g, '/')
            },
            // 侧边栏折叠
            changeCollapse () {
                this.$store.commit('SET_COLLAPSE', !this.collapse)
            },
            onStep (time) {
                sessionStorage.setItem('runTime', time)
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/menu.scss"></style>
