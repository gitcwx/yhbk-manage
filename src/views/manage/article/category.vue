<template>
    <div class="manage manage-article-category">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="分类名">
                    <el-input v-model="searchData.keyword" placeholder="请输入分类名（中/英）" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="handleAdd">新增分类</el-button>
                    <el-button type="danger" @click="deleteSelected">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="中文名称" width="150" />
            <el-table-column prop="nameEn" label="英文名称" width="150" />
            <el-table-column label="文章数量" width="100" align="center">
                <template #default="scope">
                    <span v-if="scope.row.count>=0">{{scope.row.count}}</span>
                    <span v-else @click="getArticleCount(scope.row)">查看</span>
                </template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="更新时间" />
            <el-table-column prop="createdAt" label="创建时间" />
            <el-table-column label="操作" width="290" align="center" fixed="right">
                <template #default="scope">
                    <el-button size="small" type="success" @click="handleView(scope.row)">查看</el-button>
                    <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

        <!-- 新增/修改分类弹框 -->
        <el-dialog
            v-model="dialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="dialog-form" :model="dialogFormData" label-width="90px">
                <el-form-item
                    label="分类名称"
                    prop="name"
                    :rules="{ required: true, max: 10, message: '10个字符以内' }"
                >
                    <el-input v-model="dialogFormData.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item
                    label="英文名称"
                    prop="nameEn"
                    :rules="{ required: true, max: 10, message: '10个字符以内' }"
                >
                    <el-input v-model="dialogFormData.nameEn" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{$t('button.cancel')}}</el-button>
                    <el-button type="primary" @click="dialogSubmit">{{$t('button.ok')}}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'manage-article-category',
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
                    keyword: ''
                },
                // 表格数据
                tableData: [],
                // 选中项
                multipleSelection: [],
                // 新增/编辑弹框
                dialogType: '',
                dialogVisible: false,
                dialogFormData: {
                    name: '',
                    nameEn: ''
                },
                cloneDialogFormData: null
            }
        },
        created () {
            this.cloneDialogFormData = this.$deepClone(this.dialogFormData)
            // 获取表格数据
            this.getTableData()
        },
        methods: {
            handleView (item) {
                this.$router.push({
                    name: 'article.list',
                    query: {
                        categoryId: item.id
                    }
                })
            },
            handleAdd () {
                this.dialogType = 'add'
                this.dialogVisible = true
                this.dialogFormData = this.$deepClone(this.cloneDialogFormData)
            },
            handleEdit (item) {
                this.dialogType = 'edit'
                this.dialogVisible = true
                this.dialogFormData = this.$deepClone(item)
            },
            dialogSubmit () {
                let url
                if (this.dialogType === 'add') {
                    url = this.$api.category.add
                } else if (this.dialogType === 'edit') {
                    url = this.$api.category.edit
                }
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url,
                    method: 'post',
                    data: this.dialogFormData
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        this.$message.success(res.data.msg)
                        this.dialogVisible = false
                        this.reloadTableData()
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error(this.$t('ErrMsg'))
                })
            },
            handleDelete (item) {
                this.$confirm('确认删除？').then(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.category.del,
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
                        this.$message.error(this.$t('ErrMsg'))
                    })
                })
            },
            getTableData () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.category.list,
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
                    this.$message.error(this.$t('ErrMsg'))
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
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            deleteSelected () {
                if (this.multipleSelection.length === 0) {
                    this.$message.error(this.$t('ErrMsg'))
                    return
                }
                this.$alert(`接口开发中....当前已选${this.multipleSelection.length}项`)
            },
            getArticleCount (row) {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.article.count,
                    method: 'post',
                    data: {
                        categoryId: row.id
                    }
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        row.count = res.data.data.count
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error(this.$t('ErrMsg'))
                })
            }
        }
    }
</script>
