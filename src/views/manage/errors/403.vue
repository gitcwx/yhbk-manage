<template>
    <div class="page-error">
        <div class="page-error-403">
            <div class="error-code">
                <i class="el-icon-lock"></i>
            </div>
            <div class="error-desc">啊哦~ 权限不足</div>
            <div class="error-handle">
                <el-button type="primary" plain size="large" @click="goHome">返回首页</el-button>
                <el-button type="primary" size="large" @click="goBack" >返回上一页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'page-error-403',
        methods: {
            goHome () {
                this.$router.push('/')
            },
            goBack () {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
