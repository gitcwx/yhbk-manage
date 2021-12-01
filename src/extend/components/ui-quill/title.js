const titleConfig = {
    'ql-bold': '加粗',
    'ql-italic': '斜体',
    'ql-underline': '下划线',
    'ql-strike': '删除线',
    'ql-link': '添加链接',
    'ql-blockquote': '引用',
    'ql-code-block': '代码块',
    'ql-image': '上传图片',
    'ql-emoji': '表情',
    'ql-list': '列表',
    'ql-indent': '缩进',
    'ql-color': '颜色',
    'ql-background': '背景颜色',
    'ql-align': '文本对齐',
    'ql-size': '字体大小',
    'ql-header': '标题',
    'ql-clean': '清除字体样式'
   }

export default function addQuillTitle () {
    const oToolBar = document.querySelector('.ql-toolbar')
    const aButton = oToolBar.querySelectorAll('button')
    const aSelect = oToolBar.querySelectorAll('select')
    aButton.forEach(function (item) {
        if (item.className === 'ql-script') {
            item.value === 'sub' ? item.title = '下标' : item.title = '上标'
        } else if (item.className === 'ql-indent') {
            item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进'
        } else {
            item.title = titleConfig[item.classList[0]]
        }
    })
    aSelect.forEach(function (item) {
        item.previousElementSibling.title = titleConfig[item.classList[0]]
    })
}
