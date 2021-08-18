<template>
    <div class="manage manage-permission">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="页面名称 :">
                    <el-input v-model="searchData.text" placeholder="请输入页面名称"></el-input>
                </el-form-item>
                <el-form-item label="权限级别 :">
                    <el-select v-model="searchData.permissionLevel" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为菜单 :">
                    <el-select v-model="searchData.isMenu" placeholder="请选择">
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe>
            <el-table-column label="图标" width="100" align="center">
                <template #default="scope">
                    <i :class="scope.row.icon" :style="{fontSize: '22px'}"></i>
                </template>
            </el-table-column>
            <el-table-column prop="text" label="页面名称" width="180" />
            <el-table-column prop="name" label="页面name" width="180" />
            <el-table-column label="权限级别" width="180">
                <template #default="scope">
                    <el-select
                        v-model="scope.row.permissionLevel"
                        size="mini"
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
                    <el-switch v-model="scope.row.isMenu" :beforeChange="handleSwitch(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="父级菜单" width="180">
                <template #default="scope">
                    <el-select
                        v-model="scope.row.parentMenuId"
                        v-if="scope.row.isMenu"
                        size="mini"
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
        </el-table>
    </div>
</template>
<script>
    export default {
        name: 'manage manage-permission',
        data () {
            return {
                roles: [
                    { label: '超级管理员', value: 0 },
                    { label: '管理员', value: 1 },
                    { label: '普通用户', value: 2 },
                    { label: '游客', value: 9 }
                ],
                searchData: {

                },
                tableData: []
            }
        },
        created () {
            this.getTableData()
        },
        methods: {
            handleSwitch (row) {
                return () => {
                    return this.setTableData({
                        id: row.id,
                        isMenu: !row.isMenu
                    })
                }
            },
            selectPermission (value, row) {
                this.setTableData({
                    id: row.id,
                    permissionLevel: value
                })
            },
            selectParent (value, row) {
                this.setTableData({
                    id: row.id,
                    parentMenuId: value
                })
            },
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
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error('未知错误，请稍后重试')
                })
            },
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
            },
            handleSearch () {
                console.log(this.searchData)
            }
        }
    }
</script>
<style lang="scss" scoped>
.manage-permission {

}
</style>
