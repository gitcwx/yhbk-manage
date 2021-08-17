<template>
    <div class="app-menu">
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
                    <el-submenu :index="firstLevel.name" :key="firstLevel.id">
                        <template #title>
                            <i :class="firstLevel.icon"></i>
                            <span>{{ firstLevel.text }}</span>
                        </template>
                        <template v-for="secondLevel in firstLevel.children">
                            <el-submenu v-if="secondLevel.children" :index="secondLevel.name" :key="secondLevel.id">
                                <template #title>
                                    <i :class="secondLevel.icon"></i>
                                    {{ secondLevel.text }}
                                </template>
                            </el-submenu>
                            <el-menu-item v-else-if="secondLevel.isMenu" :index="secondLevel.name" :key="secondLevel.id">
                                <i :class="secondLevel.icon"></i>
                                {{ secondLevel.text }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else-if="firstLevel.isMenu">
                    <el-menu-item :index="firstLevel.name" :key="firstLevel.id">
                        <i :class="firstLevel.icon"></i>
                        <span>{{ firstLevel.text }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: 'app-menu',
        data () {
            return {
                menuList: []
            }
        },
        computed: {
            ...mapState({
                collapse: state => state.common.collapse,
                permission: state => state.user.permission
            }),
            onRoutes () {
                return this.$route.path.replace('/manage/', '')
            }
        },
        watch: {
            permission: {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal && newVal.length) {
                        this.menuList = this.treeByPid(JSON.parse(JSON.stringify(newVal)), null)
                    }
                }
            }
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
            }
        }
    }
</script>

<style scoped lang="scss">
.app-menu {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;

    & > .el-menu {
        height: 100%;

        &:not(.el-menu--collapse) {
            width: 250px;
        }
    }
}
.app-menu::-webkit-scrollbar {
    width: 0;
}
</style>
