<template>
    <div class="manage manage-article-add">
        <el-form
            :model="formData"
            :rules="rules"
            ref="editor-form"
            class="editor-form"
        >
            <el-form-item prop="title" label="标题：">
                <el-input
                    v-model="formData.title"
                    placeholder="请输入文章标题"
                />
            </el-form-item>
            <el-form-item prop="abstract" label="摘要：">
                <el-input
                    v-model="formData.abstract"
                    placeholder="请输入文章摘要"
                    type="textarea"
                />
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="categoryId" label="文章分类：">
                        <el-select v-model="formData.categoryId" placeholder="单选">
                            <el-option
                                v-for="(item, index) in categoryList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文章标签：">
                        <el-select v-model="formData.tagIdsArr" placeholder="可多选" clearable multiple>
                            <el-option
                                v-for="(item, index) in tagList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="前端展示：">
                        <el-select v-model="formData.status" placeholder="请选择">
                            <el-option
                                v-for="(item, index) in dictionary.articleStatus"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否置顶：">
                        <el-switch v-model="formData.isTop" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="封面：">
                <el-upload
                    :show-file-list="false"
                    :action="axiosPrefix + api.file.upload"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeUpload"
                    :headers="{
                        Authorization: 'Bearer ' + getToken()
                    }"
                >
                    <div class="cover-content">
                        <img v-if="formData.cover" :src="imgPrefix + formData.cover" />
                        <i v-else class="el-icon-plus"></i>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容：" prop="content">
                <ui-quill v-model:content="formData.content" ref="ui-quill" />
            </el-form-item>
            <div class="btn-wrap">
                <el-button type="default" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import { getToken } from '@/util/cookies.js'
    import { mapState } from 'vuex'

    export default {
        name: 'manage-article-add',
        data () {
            // 校验编辑器文字超出
            const checkQuillContent = (rule, value, callback) => {
                const content = this.$refs['ui-quill'].getQuillRef().getText()
                if (content && content.length > 5000) {
                    callback(new Error('文章内容不能超过5000字'))
                } else {
                    callback()
                }
            }
            return {
                formData: {
                    title: '',
                    abstract: '',
                    categoryId: '',
                    tagIdsArr: '',
                    tagIds: '',
                    status: 1,
                    isTop: false,
                    cover: '',
                    content: '',
                    authorId: ''
                },
                cloneFormData: {},
                rules: {
                    title: [
                        { required: true, message: '请输入文章标题' },
                        { max: 50, message: '文章标题已经超出50字' }
                    ],
                    abstract: [
                        { required: true, message: '请输入文章简介' },
                        { max: 200, message: '文章简介已经超出200字' }
                    ],
                    categoryId: { required: true, message: '请选择文章分类' },
                    content: [
                        { required: true, message: '请输入文章内容' },
                        { validator: checkQuillContent, trigger: 'blur' }
                    ]
                },
                axiosPrefix: process.env.VUE_APP_axiosDefaultsBaseURL,
                imgPrefix: process.env.VUE_APP_imgPrefix,
                getToken
            }
        },
        computed: {
            ...mapState({
                tagList: state => state.article.tagList || [],
                categoryList: state => state.article.categoryList || []
            })
        },
        watch: {
            'formData.tagIdsArr': {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal) {
                        this.formData.tagIds = newVal.join(',')
                    }
                }
            }
        },
        created () {
            // 获取标签下拉选
            if (this.tagList.length === 0) {
                this.$store.dispatch('getTagList')
            }
            // 获取菜单下拉选
            if (this.categoryList.length === 0) {
                this.$store.dispatch('getCategoryList')
            }
            // 存储用户id到表单
            this.formData.authorId = this.$store.getters.userInfo.id
            // 存储原始对象，用于重置
            this.cloneFormData = this.deepClone(this.formData)
        },
        mounted () {},
        methods: {
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
                this.formData.cover = res.data.file
            },
            // 重置按钮
            resetForm () {
                this.formData = this.deepClone(this.cloneFormData)
                this.$refs['ui-quill'].getQuillRef().setHTML(this.formData.content)
                this.$nextTick(() => {
                    this.$refs['editor-form'].clearValidate()
                })
            },
            // 确认提交按钮
            submitForm () {
                this.$refs['editor-form'].validate(valid => {
                    if (valid) {
                        this.$store.commit('SET_IS_LOADING', { isLoading: true })
                        this.$axios({
                            url: this.api.article.add,
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            if (res.data.code === 's00') {
                                this.$message.success(res.data.msg)
                                this.resetForm()
                                this.$router.push({
                                    name: 'article.list'
                                })
                            } else {
                                this.$message.warning(res.data.msg)
                            }
                        }).catch(() => {
                            this.$store.commit('SET_IS_LOADING', { isLoading: false })
                            this.$message.error(this.$t('ErrMsg'))
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/editor.scss"></style>
