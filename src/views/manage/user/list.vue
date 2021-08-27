<template>
    <div class="manage manage-user-list">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="登录名 :">
                    <el-input v-model="searchData.username" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="昵称 :">
                    <el-input v-model="searchData.nickname" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="权限级别 :">
                    <el-select v-model="searchData.permissionLevel" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="性别 :">
                    <el-select v-model="searchData.gender" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.gender"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态 :">
                    <el-select v-model="searchData.status" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.userStatus"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户来源 :">
                    <el-select v-model="searchData.loginFrom" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in dictionary.loginFrom"
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
            <el-table-column prop="createdAt" label="创建时间" min-width="180"/>
            <el-table-column prop="updatedAt" label="修改时间" min-width="180"/>
            <el-table-column label="操作" width="150" align="center" fixed="right">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
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
    </div>
</template>
<script>
    export default {
        name: 'manage manage-user-list',
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
                    loginFrom: ''
                },
                // 表格数据
                tableData: []
            }
        },
        created () {
            // 获取表格数据
            this.getTableData()
        },
        methods: {
            // 新增用户
            addItem () {

            },
            // 编辑用户
            editItem (item) {

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
            }
        }
    }
</script>
<style lang="scss"></style>
