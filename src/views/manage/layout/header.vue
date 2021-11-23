<template>
    <div class="manage-header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="changeCollapse">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{ $t('layout.title') }}</div>
        <div class="manage-header-right">
            <div class="manage-header-user">
                <!-- 中英文切换 -->
                <div class="btn-language" @click="changeLanguage">
                    <el-tooltip
                        effect="dark"
                        :content="language === 'en' ? '中文' : 'English'"
                        placement="bottom"
                    >
                        <i v-if="language === 'en'" class="yhbk-icon icon-lang-zh"></i>
                        <i v-else class="yhbk-icon icon-lang-en"></i>
                    </el-tooltip>
                </div>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip
                        effect="dark"
                        :content="fullscreen ? $t('layout.fullscreen.close') : $t('layout.fullscreen.open')"
                        placement="bottom"
                    >
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avatar">
                    <img v-if="user.avatar" :src="imgPrefix + user.avatar" />
                    <img v-else :src="require('@/assets/images/default-avatar.png')">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="hover" @command="handleCommand" size="medium">
                    <span class="el-dropdown-link">
                        {{ user.nickname }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user.password">{{$t('layout.dropdown.modifyPassword')}}</el-dropdown-item>
                            <el-dropdown-item :divided="true" command="loginout">{{$t('layout.dropdown.signOut')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import { removeToken } from '@/util/cookies.js'
    export default {
        name: 'manage-header',
        data () {
            return {
                fullscreen: false,
                imgPrefix: process.env.VUE_APP_imgPrefix
            }
        },
        computed: {
            language () {
                return this.getLanguage()
            },
            collapse () {
                return this.$store.getters.isCollapse
            },
            user () {
                return this.$store.getters.userInfo
            }
        },
        created () {
            // 获取用户信息
            this.$store.dispatch('getUserInfo')
        },
        mounted () {
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand (command) {
                if (command === 'loginout') {
                    removeToken()
                    this.$router.push({ name: 'login' })
                } else {
                    this.$router.push({ name: command })
                }
            },
            // 侧边栏折叠
            changeCollapse () {
                this.$store.commit('SET_COLLAPSE', !this.collapse)
            },
            // 全屏事件
            handleFullScreen () {
                const element = document.documentElement
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen()
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen()
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen()
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen()
                    }
                }
                this.fullscreen = !this.fullscreen
            },
            // 语言切换
            changeLanguage () {
                this.$store.commit('SET_SETTING', { language: this.language === 'en' ? 'zh' : 'en' })
                this.$i18n.locale = this.language
            }
        }
    }
</script>
<style lang="scss">
.manage-header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
    background-color: #242f42;

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;

        &:hover {
            background: rgb(40, 52, 70);
        }
    }

    .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .manage-header-right {
        float: right;
        padding-right: 30px;

        .manage-header-user {
            display: flex;
            height: 70px;
            align-items: center;

            .btn-fullscreen {
                transform: rotate(45deg);
                margin-right: 5px;
                font-size: 24px;
            }
            .btn-bell,
            .btn-language,
            .btn-fullscreen {
                position: relative;
                width: 30px;
                height: 30px;
                text-align: center;
                border-radius: 15px;
                cursor: pointer;
            }
            .btn-bell-badge {
                position: absolute;
                right: 0;
                top: -2px;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                background: #f56c6c;
                color: #fff;
            }
            .btn-bell .el-icon-bell {
                color: #fff;
            }

            .user-avatar {
                margin: 0 10px 0 20px;

                img {
                    display: block;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
        }

        .el-dropdown-link {
            color: #fff;
            cursor: pointer;
            padding: 10px;
        }
        .el-dropdown-menu__item {
            text-align: center;
        }
    }
}
</style>
