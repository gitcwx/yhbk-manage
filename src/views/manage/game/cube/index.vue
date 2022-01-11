<template>
    <div class="manage manage-game-cube">
        <div class="game-control">

        </div>
        <div class="game-panel">
            <div
                class="cube-layout"
                :style="{width, height,'--piece-font-size': size}"
                @mousedown="grabStart"
                @mousemove="grabMove"
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
                    isMoving: false
                }
            }
        },
        created () {
            this.paint()
        },
        mounted () {
            document.addEventListener('mouseup', this.grabEnd)
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
            grabStart (event) {
                this.dragInfo.isMoving = true
                this.dragInfo.timeStamp = event.timeStamp
                this.dragInfo.startX = event.screenX
                this.dragInfo.startY = event.screenY
            },
            grabMove (event) {
                if (this.dragInfo.isMoving) {
                    const moveX = event.screenX - this.dragInfo.startX
                    const moveY = event.screenY - this.dragInfo.startY
                    // const distance = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2))
                    // const duration = event.timeStamp - this.dragInfo.timeStamp
                    // const speed = distance / duration // px / ms
                    this.dragInfo.rotateX = moveX + this.dragInfo.rotateX
                    this.dragInfo.rotateY = moveY + this.dragInfo.rotateY
                    this.cubeMove(this.dragInfo.rotateX, this.dragInfo.rotateY)

                    this.dragInfo.startX = event.screenX
                    this.dragInfo.startY = event.screenY
                }
            },
            grabEnd (event) {
                this.dragInfo.isMoving = false
                this.dragInfo.timeStamp = 0
                this.dragInfo.startX = 0
                this.dragInfo.startY = 0
            },
            cubeMove (rotateX, rotateY) {
                this.$refs['cube-piece-box'].style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
