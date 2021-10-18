<template>
    <div class="page-qrcode">
        <div class="btn-wrap">
            <el-button
                :type="activeType === item.value ? 'primary' : 'default'"
                v-for="(item, index) in types"
                :key="index"
                @click="changeCodeType(item)"
            >{{item.name}}</el-button>
        </div>
        <el-input v-model="bikeCode" />
        <ui-qrcode v-show="bikeCode" :text="qrcodeText" />
    </div>
</template>

<script>
    export default {
        name: 'page-qrcode',
        data () {
            return {
                qrcodeText: '',
                bikeCode: '',
                activeType: '0',
                types: [
                    { name: '青桔', value: '0' },
                    { name: '美团', value: '1' },
                    { name: '哈罗', value: '2' }
                ]
            }
        },
        watch: {
            bikeCode: {
                immediata: true,
                deep: true,
                handler (newVal) {
                    if (newVal) {
                        switch (this.activeType) {
                        case '0': this.qrcodeText = `https://dc.tt/htw?id=${newVal.toString(16).toUpperCase()}&p=1`; break
                        case '1': this.qrcodeText = `http://www.mobike.com/download/app.html?b=${newVal}_1`; break
                        case '2': this.qrcodeText = `http://c3x.me/?n=${newVal}`; break
                        default: this.qrcodeText = ''
                        }
                    }
                }
            }
        },
        methods: {
            changeCodeType (item) {
                this.activeType = item.value
                this.bikeCode = ''
            }
        }
    }
</script>

<style lang="scss">
    .page-qrcode {
        padding: 20px;
        max-width: 300px;

        .btn-wrap {
            margin-bottom: 10px;
        }

        .ui-qrcode {
            width: 200px;
            height: 200px;
        }
    }
</style>
