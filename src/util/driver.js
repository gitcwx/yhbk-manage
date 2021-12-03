import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'

const driver = new Driver({
    animate: true,
    opacity: 0.75,
    padding: 0,
    allowClose: false,
    overlayClickNext: true,
    doneBtnText: '我知道啦',
    closeBtnText: '关闭提示',
    stageBackground: 'rgba(255, 255, 255, .2)',
    nextBtnText: '下一条',
    prevBtnText: '上一条',
    showButtons: true,
    keyboardControl: true,
    scrollIntoViewOptions: {},
    onHighlightStarted: (Element) => {},
    onHighlighted: (Element) => {},
    onDeselected: (Element) => {},
    onReset: (Element) => {
        localStorage.setItem('driverReaded', true)
     },
    onNext: (Element) => {},
    onPrevious: (Element) => {}
})

function startDriver () {
    driver.defineSteps([
        {
            element: '#btn-language',
            popover: {
                title: '语言切换',
                description: '点击切换语言',
                position: 'left-top'
            }
        },
        {
            element: '#btn-fullscreen',
            popover: {
                title: '全屏',
                description: '点击可全屏/退出全屏',
                position: 'left-top'
            }
        },
        {
            element: '#tags-list',
            popover: {
                title: '页签栏',
                description: '访问过的页面会在这里缓存，<br>可通过 ALT+W 快捷关闭当前页签',
                position: 'bottom-left'
            }
        },
        {
            element: '#tags-close-box',
            popover: {
                title: '页签操作按钮',
                description: '可快速关闭 其他/全部 页签',
                position: 'bottom-right'
            }
        },
        {
            element: '#setting-switch',
            popover: {
                title: '系统配置',
                description: '可配置一些系统参数',
                position: 'left-bottom'
            }
        },
        {
            element: '#collapse-btn',
            popover: {
                title: '菜单栏操作',
                description: '点击可展开/折叠菜单栏',
                position: 'right-bottom'
            }
        }
    ])

    driver.start()
}

export default startDriver
