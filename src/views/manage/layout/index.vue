<template>
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
            <el-backtop target=".container">
                <div class="el-backtop-inner">UP</div>
            </el-backtop>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import manageHeader from './header.vue'
    import manageMenu from './menu.vue'
    import manageTags from './tags.vue'

    export default {
        name: 'manage',
        components: {
            manageHeader,
            manageMenu,
            manageTags
        },
        data () {
            return {}
        },
        computed: {
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
        created () {},
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
        padding: 10px 0 10px 10px;
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

        .el-backtop-inner {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
        }
    }
}
</style>
