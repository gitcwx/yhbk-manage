import 'highlight.js/styles/monokai-sublime.css'
import 'quill-emoji/dist/quill-emoji.css'
import Emoji from 'quill-emoji'
import hljs from 'highlight.js'
import { ElMessage } from 'element-plus/lib/components'
import { getToken } from '@/util/cookies.js'
import { api } from '@/api'
import store from '@/store'

export const toolbar = [
    [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'image',
        'emoji',
        { list: 'ordered' },
        { list: 'bullet' },
        { script: 'sub' },
        { script: 'super' },
        { indent: '-1' },
        { indent: '+1' },
        { color: [] },
        { background: [] },
        { align: [] },

        { size: ['small', false, 'large', 'huge'] },
        { header: [1, 2, 3, 4, 5, 6, false] }
    ],
    ['clean']
]

const uploadConfig = {
    action: process.env.VUE_APP_axiosDefaultsBaseURL + api.file.upload, // 上传接口
    name: 'file', // 字段名
    methods: 'POST',
    Authorization: 'Bearer ' + getToken(),
    size: 0.2 * 1024 * 1024, // 大小限制
    accept: 'image/png, image/jpeg', // 格式限制
    imgPrefix: process.env.VUE_APP_imgPrefix
}

const quillHandler = {
    image: function image () {
        const self = this

        let fileInput = this.container.querySelector('input.ql-image[type=file]')
        if (fileInput === null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            fileInput.setAttribute('name', uploadConfig.name)
            fileInput.setAttribute('accept', uploadConfig.accept)
            fileInput.classList.add('ql-image')

            fileInput.addEventListener('change', function () {
                if (fileInput.files[0].size > uploadConfig.size) {
                    // todo $t('upload.fileToolarge')
                    ElMessage.warning('仅可上传200KB以下的图片')
                    fileInput.value = ''
                    return
                }
                store.commit('SET_IS_LOADING', { isLoading: true })

                const formData = new FormData()
                formData.append(uploadConfig.name, fileInput.files[0])

                const xhr = new XMLHttpRequest()
                xhr.open(uploadConfig.methods, uploadConfig.action, true)
                xhr.setRequestHeader('Authorization', uploadConfig.Authorization)
                xhr.onload = function (e) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.responseText)
                        const length = self.quill.getSelection(true).index
                        if (res.code === 's00') {
                            self.quill.insertEmbed(length, 'image', uploadConfig.imgPrefix + res.data.file)
                            self.quill.setSelection(length + 1)
                        } else {
                            ElMessage.warning(res.msg)
                        }
                    }
                    fileInput.value = ''
                }

                xhr.upload.onloadstart = function (e) {
                    fileInput.value = ''
                }

                xhr.upload.onerror = function (e) {
                    // todo $t('ErrMsg')
                    ElMessage.error('未知错误，请稍后重试！')
                    store.commit('SET_IS_LOADING', { isLoading: false })
                }

                xhr.upload.onloadend = function (e) {
                    store.commit('SET_IS_LOADING', { isLoading: false })
                }

                xhr.send(formData)
            })
            this.container.appendChild(fileInput)
        }
        fileInput.click()
    },
    emoji: Emoji
}

export default {
    modules: {
        toolbar: {
            container: toolbar,
            handlers: quillHandler
        },
        syntax: {
            highlight: text => {
                return hljs.highlightAuto(text).value
            }
        },
        // 'emoji-textarea': true,
        'emoji-toolbar': true
        // 'emoji-shortname': true
    }
  }
