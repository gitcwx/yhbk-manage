<template>
    <div class="page-error">
        <div class="tencent-404" v-if="childrenList && childrenList.length > 0">
            <h1 class="title">
                <span>404，您访问的页面找不回来了，但我们可以一起帮他们回家！</span>
            </h1>
            <div class="children-wrap">
                <div class="detail">
                    <div class="main">
                        <div class="avatar">
                            <img :src="currentChildren.child_pic" >
                        </div>
                        <div class="info">
                            <div class="info-title">
                                <h2>
                                    <span class="info-name">{{currentChildren.name}}</span>
                                    <span class="info-sex">({{currentChildren.sex}})</span>
                                </h2>
                                <!-- <a :href="currentChildren.url" target="_blank">查看详情</a> -->
                            </div>
                            <div class="info-item">
                                出生日期：{{currentChildren.birth_time}}
                            </div>
                            <div class="info-item">
                                失踪时间：{{currentChildren.lost_time}}
                            </div>
                            <div class="info-item">
                                失踪地点：{{currentChildren.lost_place}}
                            </div>
                            <div class="info-item">
                                失踪人特征描述：{{currentChildren.child_feature}}
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <a href="http://e.t.qq.com/Tencent-Volunteers" title="腾讯志愿者" target="_blank">
                            <img src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/style/image/logo_tencentvolunteers.png">
                        </a>
                        <a href="http://bbs.baobeihuijia.com/forum.php" title="宝贝回家" target="_blank">
                            <img src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/style/image/logo_baobeihuijia.png">
                        </a>
                        <div class="btn">
                            <a :href="currentChildren.url" target="_blank">查看详情</a>
                        </div>
                    </div>
                </div>
                <div class="indicator"></div>
                <div class="list">
                    <div
                        class="item"
                        v-for="(item, index) in childrenList"
                        :key="index"
                        :title="item.name"
                        @click="selectChildren(index)"
                        :class="{active: currentChildren.id === item.id}"
                    >
                        <img :src="item.child_pic">
                    </div>
                </div>
            </div>
        </div>
        <div class="page-error-404" v-else>
            <div class="error-code">4<span>0</span>4</div>
            <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
            <div class="error-handle">
                <el-button type="primary" plain size="large" @click="goHome">返回首页</el-button>
                <el-button type="primary" size="large" @click="goBack" >返回上一页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'page-error-404',
        data () {
            return {
                currentChildren: {},
                childrenList: [],
                tencent404Url: 'http://qzonestyle.gtimg.cn/qzone/v6/portal/gy/404/data.js'
            }
        },
        created () {
            this.loadScript(this.tencent404Url, () => {
                // jsondata script中定义的全局变量
                this.childrenList = window.jsondata.data.filter(v => !v.expire)
                    .sort(() => { return Math.random() - 0.5 })
                    .slice(0, 6)
                this.selectChildren(0)
            }, true)
        },
        mounted () {

        },
        methods: {
            selectChildren (index) {
                this.currentChildren = this.childrenList[index]
            },
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
