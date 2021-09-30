import {
    ElConfigProvider,
    ElAvatar,
    ElBacktop,
    ElBadge,
    ElButton,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElDialog,
    ElDrawer,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInfiniteScroll,
    ElInput,
    ElLoading,
    ElMenu,
    ElMenuItem,
    ElMessage,
    ElMessageBox,
    ElOption,
    ElOptionGroup,
    ElPagination,
    ElPopconfirm,
    ElRadio,
    ElRadioGroup,
    ElScrollbar,
    ElSelect,
    ElSubMenu,
    ElSwitch,
    ElTable,
    ElTableColumn,
    ElTooltip,
    ElUpload
} from 'element-plus/lib/components'

// import 'element-plus/packages/theme-chalk/src/base.scss'
import 'element-plus/dist/index.css'

const components = [
    ElConfigProvider,
    ElAvatar,
    ElBacktop,
    ElBadge,
    ElButton,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElDialog,
    ElDrawer,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElMenu,
    ElMenuItem,
    ElOption,
    ElOptionGroup,
    ElPagination,
    ElPopconfirm,
    ElRadio,
    ElRadioGroup,
    ElScrollbar,
    ElSelect,
    ElSubMenu,
    ElSwitch,
    ElTable,
    ElTableColumn,
    ElTooltip,
    ElUpload
]

const plugins = [
    ElInfiniteScroll,
    ElLoading,
    ElMessage,
    ElMessageBox
]

export const ElementPlus = {
    install: (app) => {
        components.forEach((component) => {
            app.component(component.name, component)
        })

        plugins.forEach((plugin) => {
            app.use(plugin)
        })

        // 全局配置
        app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
    }
}
