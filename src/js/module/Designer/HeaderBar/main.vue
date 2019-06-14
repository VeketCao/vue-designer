<template>
    <header class="header">
        <span class="title">Vue组件页面设计器</span>
        <div class="tool-btn pull-right">
            <a class="btn btn-blue" id="preview_btn">预览</a>
            <a class="btn btn-white" id="save_btn">保存</a>
        </div>
    </header>
</template>

<script>
    export default {
        name: "HeaderBar"
    }
</script>

<style scoped lang="less">
    .header {
        position: fixed;
        z-index: 103;
        top: 0;
        left: 0;
        width: 100%;
        min-width: 600px;
        height: 50px;
        background-color: #0092D8;
        .title{
            color: white;
            font-size: 18px;
            line-height: 50px;
            margin-left: 20px;
        }
        .tool-btn {
            margin: 12px 20px 0 0;
            .btn {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                padding: 0 12px;
                border-radius: 2px;
                font-size: 14px;
                cursor: pointer;
            }

            .btn-blue {
                border: 1px solid transparent;
                background-color: #0090ff;
                color: #fff;
            }

            .btn-white {
                margin-left: 5px;
                border: 1px solid #bababa;
                background-color: #fff;
            }

            .btn-blue span, .btn-white span {
                height: 24px;
                line-height: 24px;
            }

            .btn-blue:hover, .btn-blue:focus, .btn-white:hover, .btn-white:focus {
                text-decoration: none;
                outline: none;
            }
        }
    }

</style>