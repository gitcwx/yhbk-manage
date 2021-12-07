<template>
    <div class="page-error page-error-403">
        <div class="error-code">
            <i class="manage-icon icon-lock-fill"></i>
        </div>
        <div class="error-desc">啊哦~ 权限不足</div>
        <div class="error-handle">
            <el-button type="primary" plain size="large" @click="goHome">返回首页</el-button>
            <el-button type="primary" size="large" @click="goBack" >返回上一页</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'page-error-403',
        inject: ['closeCurrentPage'],
        methods: {
            goHome () {
                this.closeCurrentPage('/')
            },
            goBack () {
                this.closeCurrentPage(-1)
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
