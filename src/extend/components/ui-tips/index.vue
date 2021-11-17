<template>
    <div class="ui-tips" :class="'ui-tips-' + type">
        <div class="ui-tips-text">{{text}}</div>
        <div class="ui-tips-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ui-tips',
        props: {
            text: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'primary'
            }
        }
    }
</script>

<style lang="scss">
.ui-tips {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ui-tips-text {
        padding-left: 15px;
        font-size: 15px;
        font-weight: 600;
        color: #606266;
        position: relative;
        height: 20px;
        line-height: 20px;

        &::before {
            content: '';
            width: 4px;
            height: 18px;
            border-radius: 4px;
            position: absolute;
            top: 1px;
            left: 0;
        }
    }

    &.ui-tips-primary {
        .ui-tips-text::before {
            background-color: $color-primary;
        }
    }
    &.ui-tips-success {
        .ui-tips-text::before {
            background-color: $color-success;
        }
    }
    &.ui-tips-warning {
        .ui-tips-text::before {
            background-color: $color-warning;
        }
    }
    &.ui-tips-danger {
        .ui-tips-text::before {
            background-color: $color-danger;
        }
    }
    &.ui-tips-info {
        .ui-tips-text::before {
            background-color: $color-info;
        }
    }
}
</style>
