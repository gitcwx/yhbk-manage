<template>
    <div class="manage manage-permission">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="页面名称">
                    <el-input v-model="searchData.text" placeholder="请输入" />
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
                <el-form-item label="是否为菜单">
                    <el-select v-model="searchData.isMenu" placeholder="请选择" clearable>
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="展现形式">
                    <el-select v-model="showStyle" placeholder="请选择">
                        <el-option label="表格" :value="0"></el-option>
                        <el-option label="树形图" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTableData">{{$t('button.search')}}</el-button>
                    <el-button type="success" @click="addItem">{{$t('button.add')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
            :data="tableData"
            border
            :default-sort="{prop: 'createdAt', order: 'ascending'}"
            :row-class-name="tableRowClassName"
            :row-key="'id'"
            :highlight-current-row="false"
            @click.stop
        >
            <el-table-column label="图标" width="80" align="center" fixed="left">
                <template #default="scope">
                    <i :class="scope.row.icon" :style="{fontSize: '22px'}"></i>
                </template>
            </el-table-column>
            <el-table-column prop="text" label="页面名称" width="150" sortable :sort-method="sortZh"/>
            <el-table-column prop="name" label="页面路由" width="150" sortable />
            <el-table-column label="权限级别" width="180" sortable :sort-by="['permissionLevel']">
                <template #default="scope">
                    <el-select
                        v-model="scope.row.permissionLevel"
                        @change="selectPermission($event, scope.row)"
                    >
                        <el-option
                            v-for="(item, index) in dictionary.roles"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="菜单栏显示" width="120" align="center" sortable :sort-by="['isMenu']">
                <template #default="scope">
                    <el-switch v-model="scope.row.isMenu" :beforeChange="switchIsMenu(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="父级菜单" width="180" sortable :sort-by="['parentMenuId', 'isMenu']">
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
                            v-for="(item, index) in tableDataAll"
                            v-show="item.isMenu && item.id !== scope.row.id && !item.parentMenuId"
                            :key="index"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
                    <span v-else>不展示在菜单栏</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" min-width="180" sortable />
            <el-table-column prop="updatedAt" label="修改时间" min-width="180" sortable />
            <el-table-column label="操作" width="180" align="center" fixed="right">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="editItem(scope.row)">{{$t('button.edit')}}</el-button>
                    <el-button type="danger" size="mini" @click="deleteItem(scope.row)">{{$t('button.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增页面弹框 -->
        <el-dialog
            :title="formType === 'add' ? '新增页面' : '编辑页面'"
            v-model="dialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="dialog-form" :model="formData" :rules="rules" label-width="90px">
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="formData.icon" placeholder="请输入图标class" :prefix-icon="formData.icon"/>
                </el-form-item>
                <el-form-item label="页面名称" prop="text">
                    <el-input v-model="formData.text" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="英文名称" prop="textEn">
                    <el-input v-model="formData.textEn" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="页面标识" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="页面权限" prop="permissionLevel">
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
                            v-for="(item, index) in tableDataAll"
                            v-show="item.isMenu && !item.parentMenuId"
                            :key="index"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
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
        name: 'manage-permission',
        data () {
            return {
                // 数据展现形式
                showStyle: 1,
                // 表格渲染条件
                searchData: {
                    page: 1,
                    limit: 999,
                    text: '',
                    permissionLevel: '',
                    isMenu: '',
                    orderName: 'createdAt',
                    orderby: 'asc'
                },
                // 表格数据
                tableData: [],
                // 所有表格数据
                tableDataAll: [],
                // 弹框可见性
                dialogVisible: false,
                // 表单类型 add 新增 edit 修改
                formType: '',
                // 弹框表单参数
                formData: {
                    icon: '',
                    text: '',
                    textEn: '',
                    name: '',
                    permissionLevel: 0,
                    isMenu: true,
                    parentMenuId: ''
                },
                // 弹框参数默认值缓存
                defaultFormData: {},
                // 弹框表单校验规则
                rules: {
                    text: [
                        { required: true, message: '请输入页面名称' },
                        { pattern: /^[\u4e00-\u9fa50-9]{1,10}$/, max: 10, message: '10位以内的汉字或数字' }
                    ],
                    textEn: [
                        { required: true, message: '请输入页面英文名称' },
                        { pattern: /^[a-zA-Z0-9\s]{1,20}$/, max: 20, message: '20位以内的字母或数字' }
                    ],
                    name: [
                        { required: true, message: '请输入页面标识' },
                        { pattern: /^[a-zA-z0-9.]{1,30}$/, max: 20, message: '30位以内字母数字或小数点' }
                    ],
                    permissionLevel: { required: true, message: '请选择页面权限' }
                }
            }
        },
        created () {
            // 缓存表单默认值
            this.defaultFormData = this.deepClone(this.formData)
            // 获取表格数据
            this.getTableData((data) => {
                // 缓存所有全部表格数据供下拉选
                this.tableDataAll = this.deepClone(data)
            })
        },
        methods: {
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
            // 弹框确认按钮
            dialogSubmit () {
                this.$refs['dialog-form'].validate(valid => {
                    if (valid) {
                        let url
                        if (this.formType === 'add') {
                            url = this.api.permission.add
                        } else if (this.formType === 'edit') {
                            url = this.api.permission.edit
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
                                // this.$refs['dialog-form'].resetFields()
                                this.dialogVisible = false
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
            // 新增页面
            addItem () {
                this.formData = this.deepClone(this.defaultFormData)
                this.dialogVisible = true
                this.formType = 'add'
            },
            // 编辑页面
            editItem (item) {
                this.formData = this.deepClone(item)
                this.dialogVisible = true
                this.formType = 'edit'
            },
            // 删除页面
            deleteItem (item) {
                this.$confirm(this.$t('confirm.delete'))
                    .then(() => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.api.permission.del,
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
                    }).catch(() => {})
            },
            // 获取页面列表
            getTableData (callback) {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.api.permission.list,
                    method: 'post',
                    data: this.searchData
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        this.tableData = this.showStyle ? this.treeByPid(res.data.data, '') : res.data.data
                        !!callback && typeof callback === 'function' && callback(res.data.data)
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error(this.$t('ErrMsg'))
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
                        if (res.data.code === 's00') {
                            return resolve(true)
                        } else {
                            this.$message.warning(res.data.msg)
                            return reject(new Error('error'))
                        }
                    }).catch(() => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        this.$message.error(this.$t('ErrMsg'))
                        return reject(new Error('error'))
                    })
                })
            },
            // 中文排序
            sortZh (a, b) {
                return a.text.localeCompare(b.text, 'zh')
            },
            // table 行颜色
            tableRowClassName ({ row, rowIndex }) {
                return row.parentMenuId ? 'row-info-bg' : ''
            },
            treeByPid (arr, parentMenuId) {
                const result = []
                const next = []
                arr.forEach(item => {
                    if (item.parentMenuId === parentMenuId) {
                        result.push(item)
                    } else {
                        next.push(item)
                    }
                })
                if (next.length) {
                    result.forEach(item => {
                        const children = this.treeByPid(next, item.id)
                        if (children.length) {
                            item.children = children
                        }
                    })
                }
                return result
            }
        }
    }
</script>
<style lang="scss"></style>
