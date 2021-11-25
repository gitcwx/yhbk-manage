<template>
    <div class="page-error page-error-404">
        <div class="error-code">4<span>0</span>4</div>
        <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
        <div class="error-handle">
            <el-button type="primary" plain size="large" @click="goHome">返回首页</el-button>
            <el-button type="primary" size="large" @click="goBack" >返回上一页</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'page-error-404',
        inject: ['closeCurrentPage'],
        data () {
            return {
            }
        },
        created () {},
        mounted () {},
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
