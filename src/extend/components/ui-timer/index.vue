<template>
    <div class="ui-timer" :style="{ color, fontSize: calcSize() }">
        {{ type ? format() : value }}
    </div>
</template>

<script>
    export default {
        name: 'ui-timer',
        props: {
            color: String,
            size: [String, Number],
            value: [String, Number],
            type: {
                type: String,
                required: true,
                validator: function (value) {
                    /**
                     * counter   计时器       可传value, 不传从0开始
                     * countdown 倒计时       需传value
                     * time      当前时间     不需value
                     * dateTime  当前日期时间  不需value
                     */
                    return ['counter', 'countdown', 'time', 'dateTime'].indexOf(value) !== -1
                }
            }
        },
        data () {
            return {
                // 用于显示的值
                current: '',
                // 定时器
                timer: null
            }
        },
        computed: {
            language () {
                return this.$getLanguage()
            }
        },
        created () {
            switch (this.type) {
            case 'counter': this.startCounter(); break
            case 'countdown': this.startCountdown(); break
            case 'time':
            case 'dateTime': this.startClock(); break
            }
        },
        beforeUnmount () {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        methods: {
            // 字体大小
            calcSize () {
                if (typeof (this.size - 0) === 'number') {
                    return this.size + 'px'
                } else {
                    return this.size
                }
            },
            // 检测传入参数合法性
            validatorValue () {
                // [180, 180s]
                if (/^\d+(s?)$/i.test(this.value)) {
                    return parseInt(this.value)
                }
                // [12m25s, 3h22m36s]
                if (/^(\d+h)?\d{2}m\d{2}s$/i.test(this.value)) {
                    const hms = this.value.split(/h|m|s/)
                    // 秒 + 分
                    let second = Number(hms[hms.length - 2]) + hms[hms.length - 3] * 60
                    // + 时
                    if (hms.length === 4) {
                        second += hms[hms.length - 4] * 3600
                    }
                    return second
                }
                return 0
            },
            // 开始定时器 单位 s
            startCounter () {
                this.current = this.validatorValue()
                this.timer = setInterval(() => {
                    this.current += 1
                    this.$emit('onStep', this.current)
                }, 1000)
            },
            // 开始倒计时 单位 s
            startCountdown () {
                this.current = this.validatorValue()
                this.timer = setInterval(() => {
                    this.current -= 1
                    this.$emit('onStep', this.current)
                    // 倒计时结束
                    if (this.current <= 0) {
                        this.current = 0
                        clearInterval(this.timer)
                        this.timer = null
                        this.$emit('onEnd')
                    }
                }, 1000)
            },
            // 日期 + 时钟 ms
            startClock () {
                this.current = Date.now()
                this.timer = setInterval(() => {
                    this.current = Date.now()
                    this.$emit('onStep', this.current)
                }, 1000)
            },
            // 格式化函数
            format () {
                if (this.type === 'counter' || this.type === 'countdown') {
                    return this.calcTime(this.current)
                } else if (this.type === 'time') {
                    return this.$moment(this.current).format('HH时mm分ss秒')
                } else if (this.type === 'dateTime') {
                    return this.$moment(this.current).format('YYYY年MM月DD日 HH时mm分ss秒')
                }
            },
            calcTime (time) {
                let result = ''
                const ss = this.prefixZero(time % 60)
                const mm = this.prefixZero(parseInt(time % 3600 / 60))
                const HH = this.prefixZero(parseInt(time / 3600) % 24)
                const DD = parseInt(time / 3600 / 24)
                if (DD) {
                    result += `${DD}天 `
                }
                return result + `${HH}:${mm}:${ss}`
            },
            prefixZero (x) {
                return x < 10 ? '0' + x : x
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
