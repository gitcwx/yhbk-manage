<template>
    <div class="manage manage-article-list">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="关键字">
                    <el-input v-model="searchData.keyword" placeholder="可搜标题/摘要" />
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select v-model="searchData.categoryId" placeholder="单选" clearable>
                        <el-option
                            v-for="(item, index) in categoryList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章标签">
                    <el-select v-model="searchData.tagIdsArr" placeholder="可多选" clearable multiple>
                        <el-option
                            v-for="(item, index) in tagList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="addItem">新增文章</el-button>
                    <el-button type="danger" @click="deleteSelected">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="作者" width="100" :formatter="(row) => {return row.author.nickname}" />
            <el-table-column prop="title" label="标题" min-width="250" />
            <el-table-column prop="categoryName" label="文章分类" width="120" />
            <el-table-column label="文章标签" width="150" :formatter="(row) => {return row.tags.map(v=> v.name).join(',')}" />
            <el-table-column label="前端展示" width="80" align="center">
                <template #default="scope">
                    <span class="ui-table-icon">
                        <i v-if="scope.row.status === 1" class="el-icon-success text-success"></i>
                        <i v-else-if="scope.row.status === 2" class="el-icon-error text-danger"></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="viewCount" label="阅读量" width="80"/>
            <el-table-column prop="likeCount" label="点赞量" width="80"/>
            <el-table-column prop="updatedAt" label="更新时间" width="180"/>
            <el-table-column prop="createdAt" label="创建时间" width="180"/>
            <el-table-column label="操作" width="160" align="center" fixed="right">
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
        name: 'manage-article-list',
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
                    keyword: '',
                    categoryId: '',
                    tagIdsArr: [],
                    tagIds: ''
                },
                // 表格数据
                tableData: [],
                // 选中项
                multipleSelection: [],
                // 文章分类下拉选
                categoryList: [],
                // 标签下拉选
                tagList: []
            }
        },
        watch: {
            'searchData.tagIdsArr': {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal) {
                        this.searchData.tagIds = newVal.join(',')
                    }
                }
            }
        },
        created () {
            // 获取表格数据
            this.getTableData()
            this.getCategoryList()
            this.getTagList()
        },
        methods: {
            getCategoryList () {
                this.$axios({
                    url: this.api.category.list,
                    method: 'post',
                    data: {
                    }
                }).then(res => {
                    if (res.data.code === 's00') {
                        this.categoryList = res.data.data
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$message.error('未知错误，请稍后重试')
                })
            },
            getTagList () {
                this.$axios({
                    url: this.api.tag.list,
                    method: 'post',
                    data: {
                    }
                }).then(res => {
                    if (res.data.code === 's00') {
                        this.tagList = res.data.data
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$message.error('未知错误，请稍后重试')
                })
            },
            // 新增文章
            addItem () {
                this.$router.push({
                    path: '/manage/article/add'
                })
            },
            // 编辑用户
            editItem (item) {
                this.formData = this.deepClone(item)
                this.infoDialogVisible = true
                this.formType = 'edit'
            },
            // 删除用户
            deleteItem (item) {
                this.$confirm('确认删除？').then(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.api.article.del,
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
                    url: this.api.article.list,
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
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            deleteSelected () {
                if (this.multipleSelection.length === 0) {
                    this.$message.warning('请选择要删除的文章')
                    return
                }
                this.$alert(`接口开发中....当前已选${this.multipleSelection.length}项`)
            }
        }
    }
</script>
<style lang="scss"></style>
