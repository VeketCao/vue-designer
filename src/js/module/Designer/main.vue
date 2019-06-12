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
                        <div class="widget-item component_js ui-draggable"
                             type="def"
                             title="拖拽至页面中间区域"
                             :draggable="allowDrag"
                             @dragstart="leftDragStart"
                             @dragend="leftDragEnd"
                             component="Hello">
                            <span>Hello</span>
                        </div>
                        <div class="widget-item component_js ui-draggable"
                             type="def"
                             title="拖拽至页面中间区域"
                             component="Test">
                            <span>Test</span>
                        </div>
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
        name: "main",
        data(){
            return{
                allowDrag: true,
            }
        },
        methods: {
            // 组件类型拖拽
            leftDragStart(ev,) {
                const {target, dataTransfer} = ev;
                console.log(target)
                console.log(dataTransfer)
                dataTransfer.setData('text', target.component);
                target.classList.add('moving');
                //this.activeContainer();
            },
            leftDragEnd(ev) {
                const {target} = ev;
                target.classList.remove('moving')
                //this.deActiveContainer();
            },
        }
    }
</script>

<style scoped lang="scss">

    .main-container{
        height: 100%;
        width: 100%;

        .header {
            position: fixed;
            z-index: 103;
            top: 0;
            left: 0;
            width: 100%;
            min-width: 600px;
            height: 50px;
            background-color: #0092D8;
        }
        .header .title{
            color: white;
            font-size: 18px;
            line-height: 50px;
            margin-left: 20px;
        }

        .pull-right {
            float: right;
        }

        .pull-left {
            float: left;
        }

        /* 按钮 */
        .tool-btn {
            margin: 12px 20px 0 0;
        }

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

        .btn-green {
            border: 1px solid transparent;
            background-color: #8bce52;
            color: #fff;
        }

        .btn-white {
            margin-left: 5px;
            border: 1px solid #bababa;
            background-color: #fff;
        }

        .btn-blue span, .btn-green span, .btn-white span {
            height: 24px;
            line-height: 24px;
        }

        .btn-blue:hover, .btn-blue:focus, .btn-white:hover, .btn-white:focus {
            text-decoration: none;
            outline: none;
        }

        .section {
            position: absolute;
            top: 50px;
            bottom: 0px;
            width: 100%;
        }

        .left-nav {
            position: fixed;
            z-index: 101;
            top: 50px;
            bottom: 0;
            left: 0;
            width: 170px;
            padding: 20px 15px;
            background: #fff;
            border: 2px solid #eee;
        }

        .nav-header {
            display: inline-block;
            line-height: 30px;
            font-size: 14px;
            color: #2c3e50;
            text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
            cursor: pointer;
        }

        .list-item {
            max-height: 450px;
            overflow-y: auto;
        }

        .widget-item {
            position: relative;
            z-index: 102;
            width: 108px;
            margin: 5px 0;
            padding: 5px 15px;
            border: 1px solid #f4f6fc;
            border-radius: 2px;
            background-color: #f4f6fc;
            cursor: move;
            -webkit-transition: background ease-in-out 0.15s;
            -moz-transition: background ease-in-out 0.15s;
            transition: background ease-in-out 0.15s;
        }

        .widget-item:hover {
            background-color: #fff;
            color: #0092d8;
            border:1px dashed #666;
        }

        .wd-container {
            height: 100%;
            margin-left: 200px;
        }

        .widget-control {
            height: 100%;
        }

        .wd-container a {
            cursor: default;
            pointer-events: none;
        }

        .text{
            background: royalblue;
        }

    }


</style>