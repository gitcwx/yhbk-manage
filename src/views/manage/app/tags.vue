<template>
    <div class="app-tags" v-if="tagsList.length">
        <ul class="tags-list">
            <li class="tags-item" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-item-title">
                    {{item.title}}
                </router-link>
                <span class="tags-item-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="medium">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app-tags',
        data () {
            return {
                tagsList: []
            }
        },
        watch: {
            $route (newValue, oldValue) {
                this.setTags(newValue)
            }
        },
        methods: {
            isActive (path) {
                return path === this.$route.fullPath
            },
            // 关闭单个标签
            closeTags (index) {
                const currentItem = this.tagsList.splice(index, 1)[0]
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
                if (item) {
                    if (currentItem.path === this.$route.fullPath) {
                        this.$router.push(item.path)
                    } else {
                        // 关闭非激活标签页时 移除对应页面的keep-alive
                        this.$store.commit('SET_ALIVETAGS', this.tagsList)
                    }
                } else {
                    this.$router.push('/')
                }
            },
            // 关闭全部标签
            closeAll () {
                this.tagsList = []
                this.$router.push('/')
            },
            // 关闭其他标签
            closeOther () {
                this.tagsList = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath
                })
                this.$store.commit('SET_ALIVETAGS', this.tagsList)
            },
            // 新增标签
            setTags (route) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath
                })
                if (!isExist) {
                    if (this.tagsList.length >= 8) {
                        this.tagsList.shift()
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[0].components.default.name
                    })
                }
                this.$store.commit('SET_ALIVETAGS', this.tagsList)
            },
            handleTags (command) {
                command === 'other' ? this.closeOther() : this.closeAll()
            }
        }
    }

</script>

<style lang="scss">
.app-tags {
    position: relative;
    height: 30px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    box-shadow: 0 5px 10px #ddd;

    .tags-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        .tags-item {
            float: left;
            margin: 3px 5px 2px 3px;
            border-radius: 3px;
            font-size: 12px;
            overflow: hidden;
            cursor: pointer;
            height: 23px;
            line-height: 23px;
            border: 1px solid #e9eaec;
            background: #fff;
            padding: 0 5px 0 12px;
            vertical-align: middle;
            color: #666;
            -webkit-transition: all .3s ease-in;
            -moz-transition: all .3s ease-in;
            transition: all .3s ease-in;

            &.active {
                color: #fff;
                border: 1px solid #409EFF;
                background-color: #409EFF;

                .tags-item-title {
                    color: #fff;
                }
            }

            &:not(.active):hover {
                background: #f8f8f8;
            }

            .tags-item-title {
                float: left;
                max-width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-right: 5px;
                color: #666;
            }
        }
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
}
</style>
