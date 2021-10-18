<template>
    <div class="page-games-testSpeed">
        div.
    </div>
</template>

<script>
    export default {
        name: 'page-games-testSpeed',
        data () {
            return {
                startTime: '',
                score: ''
            }
        },
        methods: {
            handleStart () {
                this.startTime = Date.now()
            },
            handleStop () {
                const time = Date.now() - this.startTime - 20
                this.score = this.calcScore(time)
            },
            calcScore (time) {
                let r = ''
                switch (time) {
                case time < 120:
                    r = '100-满分'
                    break
                case time >= 120 && time < 280:
                    r = '90-优秀'
                    break
                case time >= 280 && time < 320:
                    r = '80-尚可'
                    break
                case time >= 320 && time < 400:
                    r = '70-一般'
                    break
                case time >= 400 && time < 450:
                    r = '60-多给的一分是情分'
                    break
                case time >= 450 && time < 650:
                    r = '50-不及格'
                    break
                case time >= 650 && time < 1000:
                    r = '40-很差'
                    break
                case time >= 1000:
                    r = '0-别打盹啦！'
                    break
                }
                return r
            }
        }
    }
</script>

<style lang="scss">

</style>
