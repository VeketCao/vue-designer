<template>
    <div class="left-cate">
        <div class="cate-list">
            <div class="title">基础组件</div>
            <draggable tag='ul'
                       :list="basicComponents"
                       v-bind="{group:{ name:'g', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                       @start="handledragStart"
                       @end="handledragEnd"
                       :move="allowMove"
            >
                <li class="cate-item" v-for="(item,index) in basicComponents" :key="index" :type="item.type">
                    <a><span>{{item.name}}</span></a>
                </li>
            </draggable>
        </div>
    </div>
</template>

<script>
    import Draggable from 'vuedraggable'
    import api from '@/api/main'

    export default {
        name: "LeftCate",
        data(){
            return{
                basicComponents:api.getBasicComponents()
            }
        },
        methods:{
            // 组件类型拖拽
            handledragStart({oldIndex}) {
                console.log('start', oldIndex)
                //const {target, dataTransfer} = ev;
               //dataTransfer.setData('text', target.component);
                //target.classList.add('moving');
            },
            handledragEnd(e) {
                console.log('end', e)
                //const {target} = ev;
                //target.classList.remove('moving')
            },
            allowMove(){
                return true
            }
        },
        components:{
            Draggable,
        }
    }
</script>

<style scoped lang="less">
    .left-cate{
        position: fixed;
        top: 50px;
        bottom: 0;
        left: 0;
        width: 250px;
        box-sizing: border-box;
        background-color: #fff;
        .cate-list{
            padding: 8px 0;
            width: 100%;
            height: 100%;
            .title{
                font-size: 14px;
                line-height: 20px;
            }
            ul{
                position: relative;
                overflow: hidden;
                padding: 5px 10px ;
                margin: 0;
            }
            .cate-item{
                position: relative;
                width: 70px;
                margin: 5px 10px;
                padding: 5px 10px;
                border: 1px solid #f4f6fc;
                border-radius: 2px;
                background-color: #f4f6fc;
                cursor: move;
                -webkit-transition: background ease-in-out 0.15s;
                -moz-transition: background ease-in-out 0.15s;
                transition: background ease-in-out 0.15s;
                float:left;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                &:hover{
                    color: #409EFF;
                    border: 1px dashed #409EFF;
                }

                &>a{
                    display: block;
                    cursor: move;
                    background: #F4F6FC;
                    border: 1px solid #F4F6FC;

                    span{
                        display: inline-block;
                        vertical-align: middle;
                        margin-left: 7px;
                    }
                }

            }
        }
    }
</style>