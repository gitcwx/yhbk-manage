<template>
    <div class="manage manage-permission">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="页面名称 :">
                    <el-input v-model="searchData.text" placeholder="请输入页面名称" />
                </el-form-item>
                <el-form-item label="权限级别 :">
                    <el-select v-model="searchData.permissionLevel" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为菜单 :">
                    <el-select v-model="searchData.isMenu" placeholder="请选择" clearable>
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="dialogVisible = true">新增页面</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe>
            <el-table-column label="图标" width="80" align="center" fixed="left">
                <template #default="scope">
                    <i :class="scope.row.icon" :style="{fontSize: '22px'}"></i>
                </template>
            </el-table-column>
            <el-table-column prop="text" label="页面名称" width="150" />
            <el-table-column prop="name" label="页面路由" width="150" />
            <el-table-column label="权限级别" width="180">
                <template #default="scope">
                    <el-select
                        v-model="scope.row.permissionLevel"
                        @change="selectPermission($event, scope.row)"
                    >
                        <el-option
                            v-for="(item, index) in roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="菜单栏显示" width="100" align="center">
                <template #default="scope">
                    <el-switch v-model="scope.row.isMenu" :beforeChange="switchIsMenu(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="父级菜单" width="180">
                <template #default="scope">
                    <el-select
                        v-model="scope.row.parentMenuId"
                        v-if="scope.row.isMenu"
                        clearable
                        @change="selectParent($event, scope.row)"
                        placeholder="一级菜单"
                    >
                        <!-- 只显示除自己以外的菜单项 -->
                        <el-option
                            v-for="(item, index) in tableData"
                            v-show="item.isMenu && item.id !== scope.row.id"
                            :key="index"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
                    <span v-else>不展示在菜单栏</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" min-width="180"/>
            <el-table-column prop="updatedAt" label="修改时间" min-width="180"/>
            <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="scope">
                    <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
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
        <!-- 新增页面弹框 -->
        <el-dialog
            title="新增页面"
            v-model="dialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="add-form" :model="formData" :rules="rules" label-width="90px">
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="formData.icon" placeholder="请输入图标class" :prefix-icon="formData.icon"/>
                </el-form-item>
                <el-form-item label="页面名称" prop="text">
                    <el-input v-model="formData.text" placeholder="请输入页面名称" />
                </el-form-item>
                <el-form-item label="页面路由" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入页面路由" />
                </el-form-item>
                <el-form-item label="页面权限" prop="permissionLevel">
                    <el-select
                        v-model="formData.permissionLevel"
                        placeholder="请选择"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单栏显示" prop="isMenu">
                    <el-switch v-model="formData.isMenu" />
                </el-form-item>
                <el-form-item label="父级菜单" prop="isMenu">
                    <el-select
                        v-model="formData.parentMenuId"
                        clearable
                        placeholder="一级菜单"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in tableData"
                            :key="index"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogCancel">取 消</el-button>
                    <el-button type="primary" @click="dialogSubmit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'manage manage-permission',
        data () {
            return {
                // 角色下拉选
                roles: [
                    { label: '超级管理员', value: 0 },
                    { label: '管理员', value: 1 },
                    { label: '普通用户', value: 2 },
                    { label: '游客', value: 9 }
                ],
                // 分页数据
                paginationData: {
                    total: 0
                },
                // 表格渲染条件
                searchData: {
                    page: 1,
                    limit: 10,
                    text: '',
                    permissionLevel: '',
                    isMenu: ''
                },
                // 表格数据
                tableData: [],
                // 新增页面弹框可见性
                dialogVisible: false,
                // 新增页面表单参数
                formData: {
                    text: '',
                    name: ''
                },
                // 新增页面表单校验规则
                rules: {
                    text: { required: true, message: '请输入页面名称' },
                    permissionLevel: { required: true, message: '请选择页面权限' }
                }
            }
        },
        created () {
            this.getTableData()
        },
        methods: {
            sizeChange () {
                if (this.searchData.page === 1) {
                    this.getTableData()
                }
                // else
                // sizeChange 会联动 currentChange
            },
            // 设置是否在菜单栏中显示
            switchIsMenu (row) {
                return () => {
                    return this.setTableData({
                        id: row.id,
                        isMenu: !row.isMenu
                    })
                }
            },
            // 选择权限级别
            selectPermission (value, row) {
                this.setTableData({
                    id: row.id,
                    permissionLevel: value
                })
            },
            // 设置父级菜单栏
            selectParent (value, row) {
                this.setTableData({
                    id: row.id,
                    parentMenuId: value
                })
            },
            // 新增弹框关闭
            dialogCancel () {
                this.$refs['add-form'].resetFields()
                this.dialogVisible = false
            },
            // 新增弹框确认按钮
            dialogSubmit () {
                this.$refs['add-form'].validate(valid => {
                    if (valid) {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.api.permission.add,
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === '00') {
                                this.$message.success(res.data.msg)
                                this.$refs['add-form'].resetFields()
                                this.dialogVisible = false
                                this.reloadTableData()
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
            },
            // 删除页面
            deleteItem (item) {
                this.$confirm('确认删除？').then(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.api.permission.del,
                        method: 'post',
                        data: {
                            id: item.id
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === '00') {
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
            reloadTableData () {
                this.searchData.page = 1
                this.getTableData()
            },
            // 获取页面列表
            getTableData () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.api.permission.list,
                    method: 'post',
                    data: this.searchData
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === '00') {
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
            // 设置
            setTableData (params) {
                return new Promise((resolve, reject) => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.api.permission.edit,
                        method: 'post',
                        data: params
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === '00') {
                            return resolve(true)
                        } else {
                            this.$message.warning(res.data.msg)
                            return reject(new Error('error'))
                        }
                    }).catch(() => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        this.$message.error('未知错误，请稍后重试')
                        return reject(new Error('error'))
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped></style>
