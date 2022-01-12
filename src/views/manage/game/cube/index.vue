<template>
    <div class="manage manage-game-cube">
        <div class="game-control">
            <button @click="rotate('x1rz1')">旋转</button>
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
                        :colors="colorsList[index]"
                        :position="positions[index]"
                        :rotate="rotatePieces[index]"
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
                // 小方6面颜色显示状态集合
                colorsList: [],
                // 旋转块集合
                rotatePieces: [],

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
                moveTimer: null,
                // 旋转
                stepTimer: null
            }
        },
        created () {
            this.paint()
        },
        mounted () {
            document.addEventListener('mouseup', this.dragEnd)
            this.dragAnimate()
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
                            this.colorsList.push(temp.join(''))
                            // 初始化旋转角度
                            this.rotatePieces.push({})
                        }
                    }
                }
                // 存储初始位置状态
                this.origin = this.colorsList.join('')
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
            //
            dragAnimate () {
                const that = this
                this.$refs['cube-piece-box'].style.transform = `rotateX(${-this.dragInfo.rotateY}deg) rotateY(${this.dragInfo.rotateX}deg)`
                window.requestAnimationFrame(that.dragAnimate)
            },
            // 指令分解
            rotate (command) {
                // 按 X Y Z 轴旋转 3*3*3 为例
                // x1 左顺时针 x3r 右逆时针 y1 上顺时针
                if (!/^([xyz][1-9]r?)+$/.test(command)) {
                    this.$message.error('指令错误')
                    return
                }
                const steps = command.match(/[xyz][1-9]r?/g)
                this.stepTimer = setInterval(() => {
                    if (steps.length) {
                        this.rotateStep(steps[0])
                        steps.shift()
                    } else {
                        clearInterval(this.stepTimer)
                        this.stepTimer = null
                    }
                }, 1000)
            },
            rotateStep (step) {
                // x轴 -> position[0] y轴 -> position[1] z轴 -> position[2]
                const axis = 'xyz'.indexOf(step[0])
                // 层数
                const tier = step[1]
                // 旋转角度
                const deg = step[2] === 'r' ? 90 : -90
                this.positions.forEach((item, index) => {
                    // 前面 position[2] === 1 左边 position[0] === -1
                    const pos = [
                        tier - 0.5 - this.X / 2,
                        tier - 0.5 - this.Y / 2,
                        this.Z / 2 + 0.5 - tier
                    ]

                    if (item[axis] === pos[axis]) {
                        this.rotatePieces[index] = {
                            transform: 'rotate' + ['X(', 'Y(', 'Z('][axis] + deg + 'deg)',
                            transformOrigin: `${pos[0]}em${pos[1]}em${pos[2]}em`,
                            transition: true
                        }
                    }
                })
            }
        }
    }
    // 3*3*3
    // colorsList: [
    //     '101010', '101000', '101001',
    //     '100010', '100000', '100001',
    //     '100110', '100100', '100101',
    //     '001010', '001000', '001001',
    //     '000010', '000000', '000001',
    //     '000110', '000100', '000101',
    //     '011010', '011000', '011001',
    //     '010010', '010000', '010001',
    //     '010110', '010100', '010101'
    // ]

    // positions: [
    //     [-1, -1, 1], [0, -1, 1], [1, -1, 1],
    //     [-1, 0, 1], [0, 0, 1], [1, 0, 1],
    //     [-1, 1, 1], [0, 1, 1], [1, 1, 1],
    //     [-1, -1, 0], [0, -1, 0], [1, -1, 0],
    //     [-1, 0, 0], [0, 0, 0], [1, 0, 0],
    //     [-1, 1, 0], [0, 1, 0], [1, 1, 0],
    //     [-1, -1, -1], [0, -1, -1], [1, -1, -1],
    //     [-1, 0, -1], [0, 0, -1], [1, 0, -1],
    //     [-1, 1, -1], [0, 1, -1], [1, 1, -1]
    // ]
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
