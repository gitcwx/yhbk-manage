<template>
    <div class="manage manage-user-edit">
        <el-form ref="user-edit-form" :model="formData" :rules="rules" label-width="100px" @keyup.enter="submitForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="登录名">
                        <el-input v-model="formData.username" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户头像" prop="avatar">
                        <el-upload
                            :show-file-list="false"
                            :action="axiosPrefix + $api.file.upload"
                            :on-success="handleUploadSuccess"
                            :before-upload="beforeUpload"
                            :headers="{
                                Authorization: 'Bearer ' + getToken()
                            }"
                        >
                            <div class="avatar-content" title="选择图片">
                                <img v-if="formData.avatar" :src="imgPrefix + formData.avatar" />
                                <i v-else class="manage-icon icon-cloud-upload"></i>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="formData.nickname" placeholder="请输入" />
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="formData.gender" placeholder="请选择">
                            <el-option
                                v-for="(item, index) in $dictionary.gender"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="生日" prop="birth">
                        <el-date-picker
                            v-model="formData.birth"
                            type="date"
                            placeholder="请选择"
                            :disabled-date="disabledDate"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所在地区" prop="location">
                        <el-cascader
                            :options="areaList"
                            v-model="formData.locationArray"
                            placeholder="请选择"
                            clearable
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="formData.phone" placeholder="请输入" :maxlength="11" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" placeholder="请输入" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户权限" prop="permissionLevel">
                        <el-select v-model="formData.permissionLevel" placeholder="请选择">
                            <el-option
                                v-for="(item, index) in $dictionary.roles"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户状态" prop="status">
                        <el-select v-model="formData.status" placeholder="请选择">
                            <el-option
                                v-for="(item, index) in $dictionary.userStatus"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="个性签名" prop="motto">
                <el-input v-model="formData.motto" placeholder="请输入" type="textarea" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import areaList from '@/util/data/area.js'
    import { getToken } from '@/util/cookies.js'
    export default {
        name: 'manage-user-edit',
        data () {
            return {
                formData: {
                    avatar: '',
                    nickname: '',
                    gender: '',
                    birth: '',
                    location: '',
                    locationArray: [],
                    phone: '',
                    email: '',
                    permissionLevel: '',
                    status: '',
                    motto: ''
                },
                rules: {
                    nickname: [
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线', trigger: 'blur' }
                    ],
                    phone: [
                        { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
                    ],
                    email: [
                        { pattern: /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    motto: [
                        { max: 100, message: '最多输入100字符', trigger: 'blur' }
                    ]
                },
                axiosPrefix: process.env.VUE_APP_axiosDefaultsBaseURL,
                imgPrefix: process.env.VUE_APP_imgPrefix,
                areaList,
                getToken
            }
        },
        computed: {
            id () {
                return this.$route.query.id
            }
        },
        watch: {
            'formData.locationArray': {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal) {
                        this.formData.location = newVal.join('-')
                    }
                }
            }
        },
        onShow () {
            this.getUserInfo()
        },
        created () {
            this.$options.onShow.call(this)
        },
        methods: {
            disabledDate (time) {
                return time.getTime() > Date.now()
            },
            getUserInfo () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.user.info,
                    method: 'post',
                    data: {
                        id: this.id
                    }
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        this.formData = res.data.data
                        this.formData.locationArray = this.formData.location ? this.formData.location.split('-') : []
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error('未知错误，请稍后重试')
                })
            },
            // 图片上传检测
            beforeUpload (file) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.warning(this.$t('upload.fileTypeError'))
                    return false
                }
                if (file.size > 0.2 * 1024 * 1024) {
                    this.$message.warning(this.$t('upload.fileToolarge'))
                    return false
                }
                return true
            },
            // 图片上传成功
            handleUploadSuccess (res, file) {
                this.formData.avatar = res.data.file
            },
            submitForm () {
                this.$refs['user-edit-form'].validate(valid => {
                    if (valid) {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.$api.user.edit,
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === 's00') {
                                this.$message.success(res.data.msg)
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

<style lang="scss" src="./assets/css/edit.scss"></style>
