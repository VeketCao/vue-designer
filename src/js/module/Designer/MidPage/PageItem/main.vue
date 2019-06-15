<template>
    <div class="page-item-view">
        <component :is="element.type"></component>
    </div>
</template>

<script>
    export default {
        name: "PageItem",
        props:['element','select']
    }
</script>

<style scoped lang="less">
    .page-item-view{
        padding-bottom: 18px;
        position: relative;
        border: 1px dashed #999;
        background-color: rgba(236,245,255,.3);
        margin: 2px 2px;
        &:after{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: block;
            z-index: 1001;
        }

        &:hover{
            background: #ecf5ff;
            //border-left: 1px solid #ecf5ff;
        }

        &.active{
            //border-left: 1px solid #409EFF;
            background: #b3d8ff;
        }

    }
    .ghost{
        background-color: red;
        width: 100%;
        padding-bottom: 2px;
        height: 2px;
    }
</style>