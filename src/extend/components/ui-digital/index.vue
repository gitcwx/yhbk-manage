<template>
    <div class="ui-digital" :style="{'--digital-color': color, '--digital-font': type === 'bold' ? 'DS-DIGIB' : 'digital-7'}">
        <i
            v-for="(item, index) in String(value)"
            :key="index"
            :data-text="isCode(item) ? item : null"
        >{{isCode(item) ? 0 : item}}</i>
    </div>
</template>

<script>
    export default {
        name: 'ui-digital',
        props: {
            value: [String, Number],
            type: {
                type: String,
                default: 'digital-7'
            },
            color: {
                type: String,
                default: '#333'
            }
        },
        methods: {
            isCode (item) {
                return /[a-zA-Z0-9]/.test(item)
            }
        }
    }
</script>

<style lang="scss" src="./assets/css/index.scss"></style>
