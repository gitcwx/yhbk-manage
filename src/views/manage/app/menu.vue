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
                    <el-submenu :index="firstLevel.index" :key="firstLevel.index">
                        <template #title>
                            <i :class="firstLevel.icon"></i>
                            <span>{{ firstLevel.title }}</span>
                        </template>
                        <template v-for="secondLevel in firstLevel.children">
                            <el-submenu v-if="secondLevel.children" :index="secondLevel.index" :key="secondLevel.index">
                                <template #title>
                                    <i :class="secondLevel.icon"></i>
                                    {{ secondLevel.title }}
                                </template>
                            </el-submenu>
                            <el-menu-item v-else-if="secondLevel.isMenu" :index="secondLevel.index" :key="secondLevel.index">
                                <i :class="secondLevel.icon"></i>
                                {{ secondLevel.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else-if="firstLevel.isMenu">
                    <el-menu-item :index="firstLevel.index" :key="firstLevel.index">
                        <i :class="firstLevel.icon"></i>
                        <span>{{ firstLevel.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: 'app-menu',
        data () {
            return {
                menuList: []
            }
        },
        computed: {
            collapse () {
                return this.$store.getters.isCollapse
            },
            onRoutes () {
                return this.$route.path.replace('/', '')
            }
        },
        created () {
            this.menuList = this.$store.getters.userPermission
        },
        methods: {
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
