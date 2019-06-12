<template>
    <div class="main-container">
        <header class="header">
            <span class="title">Vue组件页面设计器</span>
            <div class="pull-right tool-btn">
                <a class="btn btn-blue" id="preview_btn">预览</a>
                <a class="btn btn-white" id="save_btn">保存</a>
            </div>
        </header>
        <section class="section">
            <div class="left-nav pull-left">
                <ul class="nav-list">
                    <li class="nav-header"><span>vue组件</span></li>
                    <li class="list-item" id="component-def-list">
                        <div class="widget-item component_js ui-draggable" type="def" title="拖拽至页面中间区域" component="MipHello"> <span>MipHello</span> </div>
                        <div class="widget-item component_js ui-draggable" type="def" title="拖拽至页面中间区域" component="MipTest"> <span>MipTest</span> </div>
                    </li>
                </ul>
            </div>
            <div class="wd-container">
                <div id="widget-control" class="widget-control ui-sortable">

                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "main"
    }
</script>

<style scoped lang="scss">

    .main-container{
        height: 100%;
        width: 100%;
    }
</style>