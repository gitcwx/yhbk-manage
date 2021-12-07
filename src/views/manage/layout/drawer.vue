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
                    <el-radio-group v-model="setting.language" size="mini">
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
                    <el-radio-group v-model="setting.collapse" size="mini">
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

<style lang="scss">
.manage-drawer {
    .setting-switch {
        position: fixed;
        bottom: 90px;
        right: 40px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 9999;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 128, 255, 0.9);
        text-align: center;
        line-height: 40px;
        transition: transform .3s ease-out;

        .setting-switch-inner {
            height: 100%;
            width: 100%;
            background-color: $color-primary;
            box-shadow: 0 0 6px rgba(0, 128, 255, 0.9);
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-radius: 4px;

            .manage-icon {
                font-size: 20px;
            }
        }

        &.setting-switch-open {
            transform: translateX(-320px);
        }
    }

    .setting-wrap {
        padding: 10px 15px;

        .setting-title {
            font-weight: bold;
            margin-bottom: 30px;
        }

        .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            margin-bottom: 10px;
            position: relative;

            .el-radio-button__inner {
                padding: 7px;
            }

            .associate {
                height: 50px;
                width: 10px;
                position: absolute;
                right: 45px;
                top: 20px;
                z-index: 66;
                border: 2px solid #eee;
                border-right: 0;

                .icon-link {
                    position: absolute;
                    top: 50%;
                    left: -11px;
                    transform: translateY(-50%);
                    padding: 3px;
                    background: #fff;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    color: #eee
                }

                &.active {
                    border-color: $color-primary;

                    .icon-link {
                        color: $color-primary;
                    }
                }
            }
        }
    }
}
</style>
