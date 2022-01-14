<template>
    <div class="cube-piece" :style="{transform: `translate3d(${position[0]}em, ${position[1]}em,${position[2]}em)`}">
        <div
            class="piece-rotate-wrap"
            :style="{
                transform: rotate.transform || '',
                transformOrigin: rotate.origin || '',
                transition: rotate.transition ? 'transform 0.5s linear' : ''
            }"
        >
            <div
                :class="['face', 'face' + item, item === '0' ? 'is-bg' : '']"
                v-for="(item, index) in colors"
                :key="index"
            >
                <span class="axis-text" v-if="axisText[0] && axisText[1]" :style="{transform: axisText[2]}">
                    <b>{{axisText[0]}}</b>
                    {{axisText[1]}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'cube-piece',
        props: {
            colors: {
                type: String,
                default: '000000'
            },
            position: {
                type: Array,
                default () {
                    return [1, 1, 1]
                }
            },
            rotate: {
                type: Object,
                default () {
                    return {}
                }
            },
            axisText: {
                type: Array,
                default () {
                    return ['', '', '']
                }
            }
        },
        data () {
            return {

            }
        },
        methods: {
        }
    }
</script>
