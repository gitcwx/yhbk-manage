<template>
    <div class="manage-drawer">
        <div class="setting-switch" @click="settingDrawer = !settingDrawer" :class="{'setting-switch-open': settingDrawer}">
            <div class="setting-switch-inner">
                <i class="el-icon-close" v-if="settingDrawer"></i>
                <i class="el-icon-setting" v-else></i>
            </div>
        </div>
        <el-drawer
            v-model="settingDrawer"
            :with-header="false"
            :size="340"
        >
            <div class="setting-wrap">
                <div class="setting-title">系统参数配置</div>
                <!-- <div class="setting-item">
                    <label>主题色</label>
                    <el-color-picker v-model="setting.themeColor" />
                </div> -->
                <div class="setting-item">
                    <label>面包屑导航</label>
                    <el-switch v-model="setting.showCrumbs" />
                </div>
                <div class="setting-item">
                    <label>多页签</label>
                    <el-switch v-model="setting.showTags" />
                </div>
                <div class="setting-item">
                    <label>语言</label>
                    <el-radio-group v-model="setting.language" size="mini">
                        <el-radio-button label="zh">中文</el-radio-button>
                        <el-radio-button label="en">English</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="setting-item">
                    <label>菜单默认状态</label>
                    <el-radio-group v-model="setting.collapse" size="mini">
                        <el-radio-button label="auto">自动</el-radio-button>
                        <el-radio-button :label="false">展开</el-radio-button>
                        <el-radio-button :label="true">折叠</el-radio-button>
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
            this.setting = this.deepClone(this.$store.state.common.setting)
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
        font-size: 20px;
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
        }

        &.setting-switch-open {
            transform: translateX(-300px);
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
        }
    }
}
</style>
