<template>
    <div class="left-cate">
        <ul class="nav">
            <li class="title"><span>基础组件</span></li>
            <li class="base-components-list">
                <div class="cate-item" type="HelloWorld" title="拖拽至页面中间区域"
                     :draggable="allowDrag"
                     @dragstart="leftDragStart"
                     @dragend="leftDragEnd">
                    <span>HelloWorld</span>
                </div>
                <div class="cate-item" type="TextInput" title="拖拽至页面中间区域"
                     :draggable="allowDrag"
                     @dragstart="leftDragStart"
                     @dragend="leftDragEnd">
                    <span>TextInput</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "LeftCate",
        data(){
            return{
                allowDrag: true,
            }
        },
        methods:{
            // 组件类型拖拽
            leftDragStart(ev,) {
                const {target, dataTransfer} = ev;
                console.log(target)
                console.log(dataTransfer)
                dataTransfer.setData('text', target.component);
                target.classList.add('moving');
            },
            leftDragEnd(ev) {
                const {target} = ev;
                target.classList.remove('moving')
            },
        }
    }
</script>

<style scoped lang="less">
    .left-cate{
        position: fixed;
        top: 50px;
        bottom: 0;
        left: 0;
        width: 225px;
        background: #fff;
        border: 2px solid #eee;
        .nav{
            padding:5px 10px;
            .title span{
                font-size: 14px;
                line-height: 20px;
            }
            .base-components-list{
                max-height: 600px;
                overflow-y: auto;
                .cate-item{
                    position: relative;
                    z-index: 102;
                    width: 60px;
                    margin: 5px 5px;
                    padding: 5px 10px;
                    border: 1px solid #f4f6fc;
                    border-radius: 2px;
                    background-color: #f4f6fc;
                    cursor: move;
                    -webkit-transition: background ease-in-out 0.15s;
                    -moz-transition: background ease-in-out 0.15s;
                    transition: background ease-in-out 0.15s;
                    float:left;
                }
                .cate-item:hover {
                    background-color: #fff;
                    color: #0092d8;
                    border:1px dashed #666;
                }
                .moving{
                    cursor: move;
                }
            }
        }
    }
</style>