<template>
    <div class="manage manage-game-cube">
        <div class="game-control">

        </div>
        <div class="game-panel">
            <div
                class="cube-layout"
                :style="{
                    width,
                    height,
                    '--piece-font-size': size,
                    cursor: dragInfo.isMoving ? 'grabbing' : 'grab'
                }"
                @mousedown="dragStart"
                @mousemove="dragMove"
            >
                <div class="cube-piece-box" ref="cube-piece-box">
                    <cube-piece
                        v-for="(item, index) in positions"
                        :key="index"
                        :opacity="opacitys[index]"
                        :position="positions[index]"
                        :size="size"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cubePiece from './piece.vue'
    export default {
        name: 'manage-game-cube',
        components: {
            cubePiece
        },
        data () {
            return {
                width: '300px',
                height: '300px',
                // 阶数
                X: 3,
                Y: 3,
                Z: 3,
                // 每块大小
                size: '30px',
                // 原始位置
                origin: '',
                // 小方位置集合
                positions: [],
                // 小方6面显示状态集合
                opacitys: [],

                // 拖动起始状态
                dragInfo: {
                    rotateX: 0,
                    rotateY: 0,
                    startX: 0,
                    startY: 0,
                    timeStamp: 0,
                    isMoving: false,
                    speedX: 0,
                    speedY: 0
                },
                // 惯性定时器
                moveTimer: null
            }
        },
        created () {
            this.paint()
        },
        mounted () {
            document.addEventListener('mouseup', this.dragEnd)
            this.animateFun()
        },
        beforeUnmount () {
            document.removeEventListener('mouseup', this.dragEnd)
        },
        methods: {
            paint () {
                // 前 后 上 下 左 右
                const temp = [0, 0, 0, 0, 0, 0]
                // 初始化每一个小方块的颜色和位置
                for (let i = 1; i < this.Z + 1; i++) {
                    temp[0] = i === 1 ? 1 : 0
                    temp[1] = i === this.Z ? 1 : 0

                    for (let j = 1; j < this.Y + 1; j++) {
                        temp[2] = j === 1 ? 1 : 0
                        temp[3] = j === this.Y ? 1 : 0

                        for (let k = 1; k < this.X + 1; k++) {
                            temp[4] = k === 1 ? 1 : 0
                            temp[5] = k === this.X ? 1 : 0
                            // 根据中心点偏移
                            // 3*3*3 阶
                            // 左上角 [111] => [-1em, -1em, 1em]
                            // 前中心 [221] => [0, 0 , 1em]
                            // 右下角 [331] => [1em, 1em, 1em]
                            this.positions.push([k - 0.5 - this.X / 2, j - 0.5 - this.Y / 2, this.Z / 2 + 0.5 - i])
                            // 颜色配置
                            this.opacitys.push(temp.join(''))
                        }
                    }
                }
                // 存储初始位置状态
                this.origin = this.positions.flat().join('')
            },
            dragStart (event) {
                if (this.moveTimer) {
                    clearInterval(this.moveTimer)
                    this.moveTimer = null
                }
                this.dragInfo.isMoving = true
                this.dragInfo.timeStamp = event.timeStamp
                this.dragInfo.startX = event.screenX
                this.dragInfo.startY = event.screenY
                this.dragInfo.speedX = 0
                this.dragInfo.speedY = 0
            },
            dragMove (event) {
                if (this.dragInfo.isMoving) {
                    const moveX = event.screenX - this.dragInfo.startX
                    const moveY = event.screenY - this.dragInfo.startY
                    const duration = event.timeStamp - this.dragInfo.timeStamp // ms
                    // 拖动速度
                    this.dragInfo.speedX = moveX / duration * 1000 // px / s
                    this.dragInfo.speedY = moveY / duration * 1000 // px / s
                    // 旋转角度计算
                    const rotateYAbs = Math.abs(this.dragInfo.rotateY % 360)
                    if (rotateYAbs > 90 && rotateYAbs < 270) {
                        this.dragInfo.rotateX = this.dragInfo.rotateX - moveX
                    } else {
                        this.dragInfo.rotateX = this.dragInfo.rotateX + moveX
                    }
                    this.dragInfo.rotateY = this.dragInfo.rotateY + moveY
                    // 刷新起始位置
                    this.dragInfo.startX = event.screenX
                    this.dragInfo.startY = event.screenY
                }
            },
            dragEnd () {
                this.dragInfo.isMoving = false
                this.dragInfo.timeStamp = 0
                this.dragInfo.startX = 0
                this.dragInfo.startY = 0
                // 惯性移动
                this.afterDragEnd()
            },
            afterDragEnd () {
                this.moveTimer = setInterval(() => {
                    this.dragInfo.speedX *= 0.8
                    this.dragInfo.speedY *= 0.8
                    if (Math.abs(this.dragInfo.speedX) < 1 && Math.abs(this.dragInfo.speedY) < 1) {
                        this.dragInfo.speedX = 0
                        this.dragInfo.speedY = 0
                        clearInterval(this.moveTimer)
                        this.moveTimer = null
                        return
                    }

                    const moveX = Math.abs(this.dragInfo.speedX) > 1 ? this.dragInfo.speedX : 0
                    const moveY = Math.abs(this.dragInfo.speedY) > 1 ? this.dragInfo.speedY : 0

                    const rotateYAbs = Math.abs(this.dragInfo.rotateY % 360)
                    if (rotateYAbs > 90 && rotateYAbs < 270) {
                        this.dragInfo.rotateX = this.dragInfo.rotateX - moveX
                    } else {
                        this.dragInfo.rotateX = this.dragInfo.rotateX + moveX
                    }
                    this.dragInfo.rotateY = this.dragInfo.rotateY + moveY
                }, 30)
            },
            animateFun () {
                const that = this
                this.$refs['cube-piece-box'].style.transform = `rotateX(${-this.dragInfo.rotateY}deg) rotateY(${this.dragInfo.rotateX}deg)`
                window.requestAnimationFrame(that.animateFun)
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
