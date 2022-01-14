<template>
    <div class="manage manage-game-cube">
        <div class="game-control">
            <button @click="rotate('z1z2rz3')">旋转</button>
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
                        :axisText="calcAxis(index)"
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
                    temp[1] = i === this.Z ? 2 : 0

                    for (let j = 1; j < this.Y + 1; j++) {
                        temp[2] = j === 1 ? 3 : 0
                        temp[3] = j === this.Y ? 4 : 0

                        for (let k = 1; k < this.X + 1; k++) {
                            temp[4] = k === 1 ? 5 : 0
                            temp[5] = k === this.X ? 6 : 0
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
                // 定时器立即执行一次
                this.stepTimer = ((fun) => {
                    fun()
                    return setInterval(fun, 800)
                })(() => {
                    if (steps.length) {
                        this.rotateStep(steps[0])
                        steps.shift()
                    } else {
                        clearInterval(this.stepTimer)
                        this.stepTimer = null
                    }
                })
            },
            rotateStep (step) {
                // x轴 -> position[0] y轴 -> position[1] z轴 -> position[2]
                const axis = 'xyz'.indexOf(step[0])
                // 层数
                const tier = step[1]
                // 旋转角度 r: 反转
                const direction = step[2] === 'r' ? -1 : 1
                this.positions.forEach((item, index) => {
                    // 前面 position[2] === 1 左边 position[0] === -1
                    const pos = [
                        tier - 0.5 - this.X / 2,
                        tier - 0.5 - this.Y / 2,
                        this.Z / 2 + 0.5 - tier
                    ]

                    if (item[axis] === pos[axis]) {
                        this.rotatePieces[index] = {
                            transform: 'rotate' + ['X(', 'Y(', 'Z('][axis] + (direction * 90) + 'deg)',
                            // 原始位置是基于中心点偏移，所以旋转原点回归中心点
                            origin: `${-item[0]}em ${-item[1]}em ${-item[2]}em`,
                            transition: true,
                            pos: item
                        }
                    }
                })
                // 旋转完成之后，旋转位置回归，颜色重绘
                setTimeout(() => {
                    const cloneColor = this.$deepClone(this.colorsList)
                    this.rotatePieces.forEach((item, index) => {
                        if (item.pos) {
                            // 颜色重绘
                            const newIndex = this.getNewIndex(item.pos, index, step)
                            if (newIndex !== undefined) {
                                cloneColor[index] = this.rotatePieceColor(this.colorsList[newIndex], axis, direction)
                            }
                        }
                    })
                    this.colorsList = this.$deepClone(cloneColor)
                    // 旋转位置回归
                    this.rotatePieces = []
                    for (let i = 0; i < this.X * this.Y * this.Z; i++) {
                        this.rotatePieces.push({})
                    }
                }, 550)
            },
            getNewIndex (pos, index, step) {
                let newIndex
                // const x = pos[0]
                const y = pos[1]
                const z = pos[2]
                if (step[0] === 'z') {
                    if (step[2] === 'r') {
                        newIndex = 3 * (index - (1 - z) * 6) - (10 * y + 8)
                    } else if (!step[2]) {
                        newIndex = (10 * y + 16) - 3 * (index - (1 - z) * 12)
                    }
                }
                return newIndex
            },
            rotatePieceColor (color, axis, direction) {
                //  前面正转 第一块 '103050' => '105003'
                //          第二块 '103000' => '100003'
                //  前面反转 第一块 '103050' => '100530'
                //          第二块 '103000' => '100030'
                const newColor = color.split('')
                if (axis === 2 && direction === 1) {
                    newColor[2] = color[4]
                    newColor[3] = color[5]
                    newColor[4] = color[3]
                    newColor[5] = color[2]
                } else if (axis === 2 && direction === -1) {
                    newColor[2] = color[5]
                    newColor[3] = color[4]
                    newColor[4] = color[2]
                    newColor[5] = color[3]
                }
                return newColor.join('')
            },
            replaceColor (arr, oldArr, indexs, oldIndexs) {
                for (let i = 0; i < indexs.length; i++) {
                    arr[indexs[i]] = oldArr[oldIndexs[i]]
                }
                return arr
            },
            calcAxis (index) {
                const x = this.positions[index][0]
                const y = this.positions[index][1]
                const z = this.positions[index][2]
                // 轴标
                let axisText = ''
                // 层数
                let tier = ''
                // 翻转
                let action = ''
                if (x && y === 0 && z === 0) {
                    axisText = 'X'
                    if (x === this.X / 2 - 0.5) {
                        tier = this.X
                    } else if (-x === this.X / 2 - 0.5) {
                        tier = 1
                        action = 'rotateY(180deg)'
                    }
                } else if (x === 0 && y && z === 0) {
                    axisText = 'Y'
                    if (y === this.Y / 2 - 0.5) {
                        action = 'rotateY(180deg)'
                        tier = this.Y
                    } else if (-y === this.Y / 2 - 0.5) {
                        tier = 1
                    }
                } else if (x === 0 && y === 0 && z) {
                    axisText = 'Z'
                    if (z === this.Z / 2 - 0.5) {
                        tier = 1
                    } else if (-z === this.Z / 2 - 0.5) {
                        action = 'rotateY(180deg)'
                        tier = this.Z
                    }
                }
                return [axisText, tier, action]
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
