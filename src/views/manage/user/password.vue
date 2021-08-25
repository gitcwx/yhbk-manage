<template>
    <div class="manage manage-user-password">
        <el-form ref="password-form" :model="formData" :rules="rules" label-width="80px" @keyup.enter="submitForm">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="formData.password" type="password" placeholder="请输入原始密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="repeatPassword">
                <el-input v-model="formData.repeatPassword" type="password" placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'manage-user-password',
        data () {
            const checkEqual1 = (rule, value, callback) => {
                if (this.formData.repeatPassword) {
                    this.$refs['password-form'].validateField('repeatPassword')
                }
                callback()
            }
            const checkEqual2 = (rule, value, callback) => {
                if (value !== this.formData.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                formData: {
                    password: '',
                    newPassword: '',
                    repeatPassword: ''
                },
                rules: {
                    password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{4,16}$/, message: '密码格式不正确', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{4,16}$/, message: '密码格式不正确', trigger: 'blur' },
                        { validator: checkEqual1 }
                    ],
                    repeatPassword: [
                        { required: true, message: '请重复输入新密码', trigger: 'blur' },
                        { validator: checkEqual2 }
                    ]
                }
            }
        },
        computed: {
            userInfo () {
                return this.$store.getters.userInfo
            }
        },
        methods: {
            submitForm () {
                this.$refs['password-form'].validate(valid => {
                    if (valid) {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.api.user.password,
                            method: 'post',
                            data: {
                                id: this.userInfo.id,
                                password: this.formData.password,
                                newPassword: this.formData.newPassword
                            }
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === '00') {
                                this.$message.success(res.data.msg)
                                this.$refs['password-form'].resetFields()
                            } else {
                                this.$message.warning(res.data.msg)
                            }
                        }).catch(() => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
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

<style lang="scss">
.manage-user-password {
    .el-form {
        width: 600px;
        padding: 20px;
    }
}
</style>
