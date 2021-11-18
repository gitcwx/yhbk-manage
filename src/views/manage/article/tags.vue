<template>
    <div class="manage manage-article-tags">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="标签名">
                    <el-input v-model="searchData.keyword" placeholder="请输入标签名" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" >查询</el-button>
                    <el-button type="success" @click="addItem">新增标签</el-button>
                    <el-button type="success" @click="isOperating = false" v-if="isOperating" plain>完成</el-button>
                    <el-button type="warning" @click="isOperating = true" v-else>操作</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="tags-wrap">
            <ui-tips text="标签列表" type="primary" />
            <transition-group name="tags-list" tag="div" :class="{'tags-list': true, isOperating: isOperating}">
                <div
                    class="tags-item"
                    :class="{active: selectedList[item.id]}"
                    v-for="(item, index) in tagList"
                    :key="index"
                    @click="setActive(item)"
                >
                    <span class="text" :title="item.nameEn">{{item.name}}</span>
                    <span class="btn-edit" @click="editItem(item)"><i class="el-icon-edit"></i></span>
                    <el-popconfirm
                        title="确认删除?"
                        @confirm="handleDelete(item, index)"
                        icon="el-icon-info"
                        icon-color="red"
                    >
                        <template #reference>
                            <span class="btn-delete"><i class="el-icon-delete"></i></span>
                        </template>
                    </el-popconfirm>
                </div>
            </transition-group>
        </div>

        <el-dialog
            :title="formType === 'add' ? '新增页面' : '编辑页面'"
            v-model="dialogVisible"
            width="400px"
            destroy-on-close
            center
        >
            <el-form ref="dialog-form" :model="formData" :rules="rules" label-width="90px">
                <el-form-item label="中文名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="英文名称" prop="nameEn">
                    <el-input v-model="formData.nameEn" placeholder="请输入" />
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
        name: 'manage-article-tags',
        data () {
            return {
                searchData: {
                    keyword: ''
                },
                tagList: [],
                // 是否为操作状态
                isOperating: false,
                // 当前选中的ids
                selectedList: {},
                // 弹框可见性
                dialogVisible: false,
                // 表单类型 add 新增 edit 修改
                formType: '',
                formData: {
                    name: '',
                    nameEn: ''
                },
                // 弹框参数默认值缓存
                defaultFormData: {},
                // 弹框表单校验规则
                rules: {
                    name: [
                        { required: true, message: '请输入标签中文名称' },
                        { max: 10, message: '10位以内的字符' }
                    ],
                    nameEn: [
                        { required: true, message: '请输入标签英文名称' },
                        { max: 20, message: '10位以内的字符' }
                    ]
                }
            }
        },
        created () {
            // 缓存表单默认值
            this.defaultFormData = this.deepClone(this.formData)
            this.handleSearch()
        },
        methods: {
            handleSearch () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.api.tag.list,
                    method: 'post',
                    data: this.searchData
                }).then(res => {
                    if (res.data.code === 's00') {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        this.tagList = res.data.data || []
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error('未知错误，请稍后重试')
                })
            },
            setActive (item) {
                if (!this.isOperating) {
                    if (this.selectedList[item.id]) {
                        delete this.selectedList[item.id]
                    } else {
                        this.selectedList[item.id] = true
                    }
                }
            },
            // 新增标签
            addItem () {
                this.formData = this.deepClone(this.defaultFormData)
                this.dialogVisible = true
                this.formType = 'add'
            },
            // 编辑标签
            editItem (item) {
                this.formData = this.deepClone(item)
                this.dialogVisible = true
                this.formType = 'edit'
            },
            // 弹框确认按钮
            dialogSubmit () {
                this.$refs['dialog-form'].validate(valid => {
                    if (valid) {
                        let url
                        if (this.formType === 'add') {
                            url = this.api.tag.add
                        } else if (this.formType === 'edit') {
                            url = this.api.tag.edit
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
                                this.dialogVisible = false
                                this.searchData.name = ''
                                this.handleSearch()
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
            handleDelete (item, index) {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.api.tag.del,
                    method: 'post',
                    data: {
                        id: item.id
                    }
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 's00') {
                        // 移除节点
                        this.tagList.splice(index, 1)
                        // 刷新缓存中的标签list
                        this.$store.dispatch('getTagList')
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    this.$message.error('未知错误，请稍后重试')
                })
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/tags.scss"></style>
