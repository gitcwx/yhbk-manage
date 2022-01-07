<template>
    <div class="cube-piece" :style="{transform: `translate3d(${position[0]}em, ${position[1]}em,${position[2]}em)`}">
        <template v-for="(item, index) in opacity">
            <div
                v-if="item === '1'"
                :key="index"
                :class="['face', 'face' + index]"
            ></div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'cube-piece',
        props: {
            size: String,
            opacity: {
                type: String,
                default: '000000'
            },
            position: {
                type: Array,
                default () {
                    return [1, 1, 1]
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
