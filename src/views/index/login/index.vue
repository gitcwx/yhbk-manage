<template>
    <div class="page-login">
        <div class="login-box">
            <div class="login-title">后台管理系统</div>
            <el-form
                :model="formData"
                :rules="rules"
                ref="login"
                label-width="0px"
                class="login-form"
                @keyup.enter="submitForm()"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="formData.username"
                        placeholder="username"
                        prefix-icon="el-icon-user"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="formData.password"
                        prefix-icon="el-icon-lock"
                    />
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { setToken } from '@/util/cookies.js'
    export default {
        name: 'login-page',
        data: function () {
            return {
                formData: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                }
            }
        },
        methods: {
            submitForm () {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        this.$axios({
                            url: this.api.user.login,
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            if (res.data.code === '00') {
                                setToken(res.data.token)
                                window.location.href = '/manage'
                            } else {
                                this.$message.warning(res.data.msg)
                            }
                        }).catch(() => {
                            this.$message.error('未知错误，请稍后重试')
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.page-login {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url(./assets/images/login-bg.jpg);
    background-size: 100% 100%;

    .login-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;

        .login-title {
            width: 100%;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            color: #0066d0;
            border-bottom: 1px solid #ddd;
        }

        .login-form {
            padding: 30px 30px;

            .el-form-item {
                margin-bottom: 18px;

                .el-button {
                    margin-left: -8px;
                }
            }

            .login-btn {
                text-align: center;

                button {
                    width: 100%;
                    height: 36px;
                    margin-bottom: 10px;
                }
            }

            .login-tips {
                font-size: 12px;
                line-height: 30px;
                color: #555;
            }
        }
    }
}
</style>
