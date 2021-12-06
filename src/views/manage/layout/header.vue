<template>
    <div class="manage-header">
        <div class="logo">{{ $t('layout.title') }}</div>

        <div class="manage-header-center" v-if="setting.showTimer">
            <ui-timer type="dateTime" color="#20a0ff" size="20" />
        </div>

        <div class="manage-header-right">
                <!-- 中英文切换 -->
            <el-tooltip
                effect="dark"
                :content="language === 'en' ? '中文' : 'English'"
                placement="bottom"
            >
                <div class="btn-language" @click="changeLanguage" id="btn-language">
                    <i v-if="language === 'en'" class="yhbk-icon icon-lang-zh"></i>
                    <i v-else class="yhbk-icon icon-lang-en"></i>
                </div>
            </el-tooltip>
            <!-- 全屏显示 -->
            <el-tooltip
                effect="dark"
                :content="fullscreen ? $t('layout.fullscreen.close') : $t('layout.fullscreen.open')"
                placement="bottom"
            >
                <div class="btn-fullscreen" @click="handleFullScreen" id="btn-fullscreen">
                    <i class="el-icon-rank"></i>
                </div>
            </el-tooltip>
            <!-- 用户名下拉菜单 -->
            <el-dropdown trigger="hover" @command="handleCommand" size="medium">
                <!-- 用户头像 -->
                <div class="user-avatar">
                    <img v-if="user.avatar" :src="imgPrefix + user.avatar" />
                    <img v-else :src="require('@/assets/images/default-avatar.png')">
                    {{user.nickname}}
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="user.password">{{$t('layout.dropdown.modifyPassword')}}</el-dropdown-item>
                        <el-dropdown-item :divided="true" command="signOut">{{$t('layout.dropdown.signOut')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
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
            ...mapState({
                setting: state => state.common.setting,
                user: state => state.user.info
            }),
            language () {
                return this.$getLanguage()
            }
        },
        created () {},
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand (command) {
                if (command === 'signOut') {
                    removeToken()
                    sessionStorage.removeItem('runTime')
                    this.$router.push({ name: 'login' })
                } else {
                    this.$router.push({ name: command })
                }
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
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen()
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen()
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen()
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
<style lang="scss" src="./assets/css/header.scss"></style>
