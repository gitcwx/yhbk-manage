<template>
    <div class="ui-qrcode">
        <canvas></canvas>
    </div>
</template>

<script>
    import QRCode from 'qrcode'
    export default {
        name: 'ui-qrcode',
        props: {
            text: {
                type: String,
                default: ''
            }
        },
        data () {
            return {

            }
        },
        watch: {
            text: {
                immediate: true,
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.$nextTick(() => {
                            this.createQRCode()
                        })
                    }
                }
            }
        },
        methods: {
            createQRCode () {
                if (this.$el) {
                    this.qrcodeObj = QRCode.toCanvas(
                        this.$el.children[0],
                        this.text,
                        {
                            errorCorrectionLevel: 'H',
                            width: this.$el.clientWidth || 80,
                            margin: 2
                        },
                        (err, canvas) => {
                            if (err) throw err
                        }
                    )
                } else {
                    this.$nextTick(() => {
                        this.createQRCode()
                    })
                }
            }
        }
    }
</script>
<style src="./assets/css/index.scss" lang="scss"></style>
