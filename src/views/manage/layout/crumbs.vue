<template>
    <div class="manage-crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item
                v-for="(item, index) in crumbsList"
                :key="index"
                :to="{ path: item.path || '' }"
            >
                {{$t('router.' + item.name)}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'manage-crumbs',
        computed: {
            crumbsList () {
                return this.$route.meta.crumbs || []
            }
        }
    }
</script>

<style lang="scss">
.manage-crumbs {
    height: 35px;
    background: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 5px 10px #ddd;
    padding: 0 20px;
}
</style>
