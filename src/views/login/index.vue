<template>
    <div class="page-login">
        <div class="login-box">
            <div class="login-title">后台管理系统</div>
            <el-form
                :model="formData"
                :rules="rules"
                ref="login-form"
                label-width="0px"
                class="login-form"
                @keyup.enter="submitForm"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="formData.username"
                        placeholder="账号"
                    >
                        <template #prefix>
                            <i class="manage-icon icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="formData.password"
                    >
                        <template #prefix>
                            <i class="manage-icon icon-lock-fill"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <p class="login-tips">Tips : [账号: test, 密码: 123456]</p>
            </el-form>
        </div>
        <!-- 图形验证组件 -->
        <Vcode :show="vCodeShow" @success="onSuccess" @close="onClose"/>
    </div>
</template>

<script>
    import { setToken } from '@/util/cookies.js'
    import Vcode from 'vue3-puzzle-vcode'
    export default {
        name: 'login-page',
        components: {
            Vcode
        },
        data: function () {
            return {
                vCodeShow: false,
                formData: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'change' }]
                }
            }
        },
        methods: {
            submitForm () {
                this.$refs['login-form'].validate(valid => {
                    if (valid) {
                        this.vCodeShow = true
                    } else {
                        return false
                    }
                })
            },
            onSuccess () {
                this.$store.commit('SET_FULL_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.user.login,
                    method: 'post',
                    data: this.formData
                }).then(res => {
                    this.$store.commit('SET_FULL_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        setToken(res.data.token)
                        this.$router.push({ name: 'dashboard' })
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_FULL_LOADING', { isLoading: false })
                    this.$message.error(this.$t('ErrMsg'))
                })
            },
            onClose () {
                this.vCodeShow = false
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
