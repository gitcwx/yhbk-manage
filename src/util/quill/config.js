// import Quill from 'quill'
// Quill.register('formats/style', Quill.import('../style.scss'), true)

import { getToken } from '@/util/cookies.js'
import { api } from '@/api'
// import hljs from 'highlight.js'

export const toolbar = [
    [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'image',
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

export const quillHandle = {
    image: function image () {
        var self = this

        var fileInput = this.container.querySelector('input.ql-image[type=file]')
        if (fileInput === null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name)
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept)
            fileInput.classList.add('ql-image')
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                if (fileInput.files[0].size > uploadConfig.size) {
                    alert('123')
                    fileInput.value = ''
                    return
                }
                // 创建formData
                var formData = new FormData()
                formData.append(uploadConfig.name, fileInput.files[0])
                formData.append('object', 'product')
                // 图片上传
                var xhr = new XMLHttpRequest()
                xhr.open(uploadConfig.methods, uploadConfig.action, true)
                xhr.setRequestHeader('Authorization', uploadConfig.Authorization)
                // 上传数据成功，会触发
                xhr.onload = function (e) {
                    if (xhr.status === 200) {
                        var res = JSON.parse(xhr.responseText)
                        const length = self.quill.getSelection(true).index
                        if (res.code === 's00') {
                            self.quill.insertEmbed(length, 'image', uploadConfig.imgPrefix + res.data.file)
                            self.quill.setSelection(length + 1)
                        } else {
                            alert(123)
                        }
                    }
                    fileInput.value = ''
                }
                // 开始上传数据
                xhr.upload.onloadstart = function (e) {
                    fileInput.value = ''
                }
                // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
                xhr.upload.onerror = function (e) {
                    alert(231)
                }
                // 上传数据完成（成功或者失败）时会触发
                xhr.upload.onloadend = function (e) {}
                xhr.send(formData)
            })
            this.container.appendChild(fileInput)
        }
        fileInput.click()
    }
}
