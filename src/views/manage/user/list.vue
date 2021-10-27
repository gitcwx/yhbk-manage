<template>
    <div class="manage manage-user-list">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="登录名">
                    <el-input v-model="searchData.username" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="searchData.nickname" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="权限级别">
                    <el-select v-model="searchData.permissionLevel" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="searchData.gender" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.gender"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchData.status" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.userStatus"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户来源">
                    <el-select v-model="searchData.from" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.from"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="addItem">新增用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe>
            <el-table-column prop="username" label="登录名" width="150" />
            <el-table-column prop="nickname" label="昵称" width="150" />
            <el-table-column label="权限级别" width="120">
                <template #default="scope">
                    <span v-dictionary="{
                        dicName: 'roles',
                        value: scope.row.permissionLevel
                    }"></span>
                </template>
            </el-table-column>
            <el-table-column label="账户状态" width="120">
                <template #default="scope">
                    <span v-dictionary="{
                        dicName: 'userStatus',
                        value: scope.row.status
                    }"></span>
                </template>
            </el-table-column>
            <el-table-column label="账号来源" width="120">
                <template #default="scope">
                    <span v-dictionary="{
                        dicName: 'from',
                        value: scope.row.from
                    }"></span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" width="120" />
            <el-table-column prop="email" label="邮箱" width="150" />
            <el-table-column label="性别" width="80">
                <template #default="scope">
                    <span v-dictionary="{
                        dicName: 'gender',
                        value: scope.row.gender
                    }"></span>
                </template>
            </el-table-column>
            <el-table-column prop="location" label="地区" width="150" />
            <el-table-column prop="lastLoginAt" label="上次登录时间" min-width="180"/>
            <el-table-column label="操作" width="220" align="center" fixed="right">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
                    <el-button type="warning" size="mini" @click="editPassword(scope.row)">改密</el-button>
                    <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="total, sizes, pager, jumper"
            v-model:currentPage="searchData.page"
            v-model:page-size="searchData.limit"
            v-model:total="paginationData.total"
            @size-change="sizeChange"
            @current-change="getTableData"
        />
        <!-- 用户信息弹框 -->
        <el-dialog
            :title="formType === 'add' ? '新增用户' : '编辑用户'"
            v-model="infoDialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="user-info-form" :model="formData" :rules="rules" label-width="90px">
                <el-form-item
                    label="登录名"
                    prop="username"
                    v-if="formType === 'add'"
                    :rules="{ required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' }"
                >
                    <el-input v-model="formData.username" placeholder="请输入登录账号名"/>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称"/>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select
                        v-model="formData.gender"
                        placeholder="请选择"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in dictionary.gender"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="账户密码"
                    prop="password"
                    :rules="{ required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' }"
                    v-if="formType === 'add'"
                >
                    <el-input v-model="formData.password" placeholder="请输入账户密码" />
                </el-form-item>
                <el-form-item label="用户级别" prop="permissionLevel">
                    <el-select
                        v-model="formData.permissionLevel"
                        placeholder="请选择"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in dictionary.roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="infoDialogVisible = false">{{$t('button.cancel')}}</el-button>
                    <el-button type="primary" @click="submitUserInfo">{{$t('button.ok')}}</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改密码弹框 -->
        <el-dialog
            v-model="passwordDialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="password-form" :model="passwordFormData" label-width="90px">
                <el-form-item
                    label="新密码"
                    prop="newPassword"
                    :rules="{ required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' }"
                >
                    <el-input v-model="passwordFormData.newPassword" placeholder="请输入新密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="passwordDialogVisible = false">{{$t('button.cancel')}}</el-button>
                    <el-button type="primary" @click="submitPassword">{{$t('button.ok')}}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'manage-user-list',
        data () {
            return {
                // 分页数据
                paginationData: {
                    total: 0
                },
                // 表格渲染条件
                searchData: {
                    page: 1,
                    limit: 10,
                    username: '',
                    nickname: '',
                    permissionLevel: '',
                    gender: '',
                    status: '',
                    from: ''
                },
                // 表格数据
                tableData: [],
                // 用户信息弹框类型
                formType: '',
                // 用户信息弹框可见性
                infoDialogVisible: false,
                // 用户信息弹框参数默认值缓存
                defaultFormData: {},
                // 用户信息弹框参数
                formData: {
                    username: '',
                    nickname: '',
                    password: '',
                    gender: 0,
                    permissionLevel: ''
                },
                // 用户信息弹框表单校验规则
                rules: {
                    nickname: { required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' },
                    permissionLevel: { required: true, message: '请选择用户级别' }
                },
                // 修改密码弹框可见性
                passwordDialogVisible: false,
                // 修改密码弹框参数
                passwordFormData: {
                    id: '',
                    newPassword: ''
                }
            }
        },
        created () {
            // 缓存表单默认值
            this.defaultFormData = this.deepClone(this.formData)
            // 获取表格数据
            this.getTableData()
        },
        methods: {
            // 新增用户
            addItem () {
                this.formData = this.deepClone(this.defaultFormData)
                this.infoDialogVisible = true
                this.formType = 'add'
            },
            // 编辑用户
            editItem (item) {
                this.formData = this.deepClone(item)
                this.infoDialogVisible = true
                this.formType = 'edit'
            },
            // 修改密码
            editPassword (item) {
                this.passwordFormData.id = item.id
                this.passwordFormData.newPassword = ''
                this.passwordDialogVisible = true
            },
            // 删除用户
            deleteItem (item) {
                this.$confirm('确认删除？').then(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.api.user.del,
                        method: 'post',
                        data: {
                            id: item.id
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 's00') {
                            this.$message.success(res.data.msg)
                            this.getTableData()
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    }).catch(() => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        this.$message.error('未知错误，请稍后重试')
                    })
                })
            },
            // 获取用户列表
            getTableData () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.api.user.list,
                    method: 'post',
                    data: this.searchData
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        this.tableData = res.data.data
                        this.paginationData.total = res.data.total
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error('未知错误，请稍后重试')
                })
            },
            reloadTableData () {
                this.searchData.page = 1
                this.getTableData()
            },
            // 切换每页显示条数
            sizeChange () {
                if (this.searchData.page === 1) {
                    this.getTableData()
                }
                // else
                // sizeChange 会联动 currentChange
            },
            submitUserInfo () {
                this.$refs['user-info-form'].validate(valid => {
                    if (valid) {
                        let url
                        if (this.formType === 'add') {
                            url = this.api.user.add
                        } else if (this.formType === 'edit') {
                            url = this.api.user.edit
                        }
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url,
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === 's00') {
                                this.$message.success(res.data.msg)
                                // this.$refs['user-info-form'].resetFields()
                                this.infoDialogVisible = false
                                this.getTableData()
                            } else {
                                this.$message.warning(res.data.msg)
                            }
                        }).catch(() => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            this.$message.error(this.$t('ErrMsg'))
                        })
                    } else {
                        return false
                    }
                })
            },
            submitPassword () {
                this.$refs['password-form'].validate(valid => {
                    if (valid) {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.api.user.password,
                            method: 'post',
                            data: this.passwordFormData
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === 's00') {
                                this.$message.success(res.data.msg)
                                // this.$refs['user-info-form'].resetFields()
                                this.passwordDialogVisible = false
                            } else {
                                this.$message.warning(res.data.msg)
                            }
                        }).catch(() => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            this.$message.error(this.$t('ErrMsg'))
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
<style lang="scss"></style>
