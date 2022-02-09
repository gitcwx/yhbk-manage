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
                :class="['face', 'face' + item]"
                v-for="(item, index) in colors"
                :key="index"
            ></div>
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
