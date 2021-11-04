<template>
    <div class="ui-quill">
        <QuillEditor
            ref="quill-editor"
            :content="content"
            :contentType="contentType"
            :enable="enable"
            :readOnly="readOnly"
            :placeholder="placeholder"
            :theme="theme"
            :toolbar="toolbar"
            @textChange="onTextChange"
            @selectionChange="onSelectionChange"
            @editorChange="onEditorChange"
            @update:content="onUpdateContent"
            @focus="onFocus"
            @blur="onBlur"
            @ready="onQuillReady"
        />
    </div>
</template>

<script>
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    import { toolbar, quillHandler } from './config'
    export default {
        name: 'ui-quill',
        components: {
            QuillEditor
        },
        props: {
            content: {
                type: [Object, String],
                default: ''
            },
            // 内容形式: [delta, html, text]
            contentType: {
                type: String,
                default: 'html'
            },
            enable: {
                type: Boolean,
                default: true
            },
            readOnly: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: ''
            },
            // 主题 [snow, bubble, ""]
            theme: {
                type: String,
                default: 'snow'
            },
            // 工具栏 [essential, minimal, full, ""]
            toolbar: {
                type: [Array, Object, String],
                default () {
                    return toolbar
                }
            }
        },
        data () {
            return {
            }
        },
        computed: {
        },
        created () {
        },
        methods: {
            onTextChange (delta, oldContents, source) {
                this.$emit('textChange', delta, oldContents, source)
            },
            onSelectionChange (range, oldRange, source) {
                this.$emit('selectionChange', range, oldRange, source)
            },
            // { name: 'text-change', delta, oldContents, source}
            // { name: 'selection-change', range, oldRange, source }
            onEditorChange (a, b, c, d) {
                this.$emit('editorChange', a, b, c, d)
            },
            onUpdateContent (content) {
                this.$emit('update:content', content)
            },
            onFocus (editor) {
                this.$emit('focus', editor)
            },
            onBlur (editor) {
                this.$emit('blur', editor)
            },
            onQuillReady (quill) {
                // 新增 / 改写 功能模块
                const toolbarModule = this.$refs['quill-editor'].getQuill().getModule('toolbar')
                Object.keys(quillHandler).forEach(name => {
                    toolbarModule.addHandler(name, quillHandler[name])
                })
                this.$emit('ready', quill)
            },
            getQuillRef () {
                return this.$refs['quill-editor']
            }
        }
    }
</script>

<style lang="scss" src="./index.scss"></style>
