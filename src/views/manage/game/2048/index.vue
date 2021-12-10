<template>
    <div class="manage manage-game-2048">
        <div class="tools">
            <span class="score">score: {{score}}</span>
            <button class="start-button" @click="start">restart</button>
        </div>
        <div
            class="panel"
            @mousedown="touchStart"
            @mousemove="touchMove"
            @mouseup="touchEnd"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
        >
            <!-- <template v-for="x in RN" :key="x">
                <div
                    v-for="y in CN"
                    class="cell"
                    :key="y"
                    :id="'c'+(x-1)+(y-1)"
                    :class="'cell'+map[x-1][y-1]"
                >
                    {{map[x-1][y-1] || ''}}
                </div>
            </template> -->
        </div>
    </div>
</template>
<script>
    export default {
        name: 'manage-game-2048',
        data () {
            return {
                map: {},
                RN: 4, // 总行数
                CN: 4, // 总列数
                score: 0, // 游戏得分
                isGameOver: false,
                startXY: {},
                isMoving: false, // 是否正在移动中
                directPx: 30 // 判断滑动距离
            }
        },
        onShow () {
            document.addEventListener('keydown', this.keydownFn)
        },
        onHide () {
            document.removeEventListener('keydown', this.keydownFn)
        },
        created () {
            this.start()
        },
        mounted () {
            this.$options.onShow.call(this)
        },
        beforeUnmount () {
            this.$options.onHide.call(this)
        },
        methods: {
            start () {
                this.createMap()
                this.randomNum()
                this.randomNum()
                this.score = 0
                this.isGameOver = false
            },
            createMap () {
                const map = {}
                for (let x = 0; x < this.RN; x++) {
                    map[x] = {}
                    for (let y = 0; y < this.CN; y++) {
                        map[x][y] = 0
                    }
                }
                this.map = map
            },
            touchStart (event) {
                this.startXY = event.touches ? event.touches[0] : { clientX: event.clientX, clientY: event.clientY }
                this.isMoving = true
            },
            touchMove (event) {
                if (this.isMoving) {
                    event && event.preventDefault()
                    const moveXY = event.touches ? event.touches[0] : { clientX: event.clientX, clientY: event.clientY }
                    const dx = moveXY.clientX - this.startXY.clientX
                    const dy = moveXY.clientY - this.startXY.clientY
                    if (dx > this.directPx) {
                        this.moveRight()
                    } else if (dx < -this.directPx) {
                        this.moveLeft()
                    } else if (dy > this.directPx) {
                        this.moveDown()
                    } else if (dy < -this.directPx) {
                        this.moveUp()
                    }
                }
            },
            touchEnd () {
                this.startXY = {}
                this.isMoving = false
            },
            keydownFn (event) {
                switch (event.keyCode) {
                case 37:
                case 65:
                    this.moveLeft()
                    break
                case 38:
                case 87:
                    this.moveUp()
                    break
                case 39:
                case 68:
                    this.moveRight()
                    break
                case 40:
                case 83:
                    this.moveDown()
                    break
                }
            },
            move (play) {
                if (this.isGameOver) { return }
                const before = JSON.stringify(this.map)
                play()
                const after = JSON.stringify(this.map)
                if (before !== after) {
                    this.randomNum()
                }
                this.checkGameStatus()
                this.isMoving = false
            },
            checkGameStatus () {
                let over = true
                for (let c = 0; c < this.CN; c++) {
                    for (let r = 0; r < this.RN; r++) {
                        if (this.map[r][c] === 0) {
                            // 如果当前元素是0，就返回false
                            over = false
                            break
                        } else if ((c < this.CN - 1) && (this.map[r][c] === this.map[r][c + 1])) {
                            // 如果c<CN-1且当前元素等于右侧元素时，就返回false
                            over = false
                            break
                        } else if ((r < this.RN - 1) && (this.map[r][c] === this.map[r + 1][c])) {
                            // 如果r<RN-1且当前元素等于下方元素时，就返回false
                            over = false
                            break
                        }
                    }
                }
                if (over) {
                    this.isGameOver = over
                    this.$message.warning('游戏结束')
                }
            },
            randomNum () {
                while (true) {
                    const r = Math.floor(Math.random() * this.RN)
                    const c = Math.floor(Math.random() * this.CN)
                    if (this.map[r][c] === 0) {
                        this.map[r][c] = Math.random() < 0.6 ? 2 : 4
                        break
                    }
                }
            },
            moveLeft () {
                this.move(() => {
                    for (let r = 0; r < this.RN; r++) {
                        for (let c = 0; c < this.CN - 1; c++) {
                            const nextc = this.getNextInRow(r, c)
                            if (nextc === -1) {
                                break
                            } else {
                                if (this.map[r][c] === 0) {
                                    this.map[r][c] = this.map[r][nextc]
                                    this.map[r][nextc] = 0
                                    // 移动后，再次循环当前点
                                    c--
                                } else if (this.map[r][c] === this.map[r][nextc]) {
                                    this.map[r][c] *= 2
                                    this.score += this.map[r][c]
                                    this.map[r][nextc] = 0
                                }
                            }
                        }
                    }
                })
            },
            moveRight () {
                this.move(() => {
                    for (let r = 0; r < this.RN; r++) {
                        for (let c = this.CN - 1; c > 0; c--) {
                            const prevc = this.getPrevInRow(r, c)
                            if (prevc === -1) {
                                break
                            } else {
                                if (this.map[r][c] === 0) {
                                    this.map[r][c] = this.map[r][prevc]
                                    this.map[r][prevc] = 0
                                    c++
                                } else if (this.map[r][c] === this.map[r][prevc]) {
                                    this.map[r][c] *= 2
                                    this.score += this.map[r][c]
                                    this.map[r][prevc] = 0
                                }
                            }
                        }
                    }
                })
            },
            moveUp () {
                this.move(() => {
                    for (let c = 0; c < this.CN; c++) {
                        for (let r = 0; r < this.RN - 1; r++) {
                            const nextr = this.getNextInCol(r, c)
                            if (nextr === -1) {
                                break
                            } else {
                                if (this.map[r][c] === 0) {
                                    this.map[r][c] = this.map[nextr][c]
                                    this.map[nextr][c] = 0
                                    r--
                                } else if (this.map[r][c] === this.map[nextr][c]) {
                                    this.map[r][c] *= 2
                                    this.score += this.map[r][c]
                                    this.map[nextr][c] = 0
                                }
                            }
                        }
                    }
                })
            },
            moveDown () {
                this.move(() => {
                    for (let c = 0; c < this.CN; c++) {
                        for (let r = this.RN - 1; r > 0; r--) {
                            const prevr = this.getPrevInCol(r, c)
                            if (prevr === -1) {
                                break
                            } else {
                                if (this.map[r][c] === 0) {
                                    this.map[r][c] = this.map[prevr][c]
                                    this.map[prevr][c] = 0
                                    r++
                                } else if (this.map[r][c] === this.map[prevr][c]) {
                                    this.map[r][c] *= 2
                                    this.score += this.map[r][c]
                                    this.map[prevr][c] = 0
                                }
                            }
                        }
                    }
                })
            },
            getPrevInCol (r, c) {
                r--
                for (; r >= 0; r--) {
                    if (this.map[r][c] !== 0) return r
                }
                return -1
            },
            getNextInCol (r, c) {
                r++
                for (; r < this.RN; r++) {
                    if (this.map[r][c] !== 0) {
                        return r
                    }
                }
                return -1
            },
            getPrevInRow (r, c) {
                c--
                for (; c >= 0; c--) {
                    if (this.map[r][c] !== 0) {
                        return c
                    }
                }
                return -1
            },
            getNextInRow (r, c) {
                c++
                for (; c < this.CN; c++) {
                    if (this.map[r][c] !== 0) {
                        return c
                    }
                }
                return -1
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
