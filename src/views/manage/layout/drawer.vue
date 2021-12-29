<template>
    <div class="manage-drawer">
        <div
            id="setting-switch"
            class="setting-switch"
            @click="settingDrawer = !settingDrawer"
            :class="{'setting-switch-open': settingDrawer}"
        >
            <div class="setting-switch-inner">
                <i class="manage-icon icon-close" v-if="settingDrawer"></i>
                <i class="manage-icon icon-setting" v-else></i>
            </div>
        </div>
        <el-drawer
            v-model="settingDrawer"
            :with-header="false"
            :size="360"
            :close-on-click-modal="false"
        >
            <div class="setting-wrap">
                <div class="setting-title">{{$t('layout.drawer.title')}}</div>
                <!-- <div class="setting-item">
                    <label>{{$t('layout.drawer.themeColor')}}</label>
                    <el-color-picker v-model="setting.themeColor" />
                </div> -->
                <div class="setting-item">
                    <label>{{$t('layout.drawer.timer')}}</label>
                    <el-switch v-model="setting.showTimer" @change="timerChange" />
                </div>
                <div class="setting-item">
                    <label>{{$t('layout.drawer.breadCrumb')}}</label>
                    <el-switch v-model="setting.showCrumbs" @change="crumbChange"/>
                    <div class="associate" :class="{active: isLinked}">
                        <i class="manage-icon icon-link" @click="changeLinked"></i>
                    </div>
                </div>
                <div class="setting-item">
                    <label>{{$t('layout.drawer.tags')}}</label>
                    <el-switch v-model="setting.showTags" @change="tagsChange" />
                </div>
                <div class="setting-item">
                    <label>{{$t('layout.drawer.language')}}</label>
                    <el-radio-group v-model="setting.language">
                        <el-radio-button label="zh">中文</el-radio-button>
                        <el-radio-button label="en">English</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="setting-item">
                    <label>
                        {{$t('layout.drawer.defaultMenuStatus')}}
                        <el-tooltip
                            placement="bottom"
                            :content="$t('layout.drawer.menuStatusTips')"
                            trigger="hover"
                        >
                            <i class="manage-icon icon-question-circle-fill text-primary"></i>
                        </el-tooltip>
                    </label>
                    <el-radio-group v-model="setting.collapse">
                        <el-radio-button label="auto">{{$t('layout.collapse.auto')}}</el-radio-button>
                        <el-radio-button :label="false">{{$t('layout.collapse.open')}}</el-radio-button>
                        <el-radio-button :label="true">{{$t('layout.collapse.close')}}</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        name: 'manage-drawer',
        data () {
            return {
                settingDrawer: false,
                isLinked: true,
                setting: {}
            }
        },
        watch: {
            setting: {
                deep: true,
                handler (newVal) {
                    this.$store.commit('SET_SETTING', newVal)
                    this.$i18n.locale = newVal.language
                }
            }
        },
        created () {
            this.setting = this.$deepClone(this.$store.state.common.setting)
        },
        methods: {
            timerChange (value) {
                this.setting.showTimer = value
            },
            crumbChange (value) {
                if (this.isLinked && value) {
                    this.setting.showTags = false
                }
            },
            tagsChange (value) {
                if (this.isLinked && value) {
                    this.setting.showCrumbs = false
                }
            },
            changeLinked () {
                if (this.isLinked) {
                    this.isLinked = false
                    return
                }
                this.isLinked = true
                if (this.setting.showTags && this.setting.showCrumbs) {
                    this.setting.showCrumbs = false
                }
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/drawer.scss"></style>
