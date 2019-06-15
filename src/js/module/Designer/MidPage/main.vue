<template>
    <div class="mid-page-container">
        <div class="page">
            <draggable class="page-list"
                       v-bind="{group:'g', ghostClass: 'ghost'}"
                       @end="handleMoveEnd"
                       @add="handleWidgetAdd"
            >
                <template v-for="(it,index) in data.list">
                    <pageItem v-if="it" :key="index" :element="it" :select.sync="curSelect"></pageItem>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script>
    import Draggable from 'vuedraggable'
    import PageItem from './PageItem/main'

    export default {
        name: "MidPage",
        props:['data','select'],
        data(){
            return{
                curSelect: this.select
            }
        },
        methods:{
            handleMoveEnd({newIndex, oldIndex}){
                console.log('index', newIndex, oldIndex)
            },
            handleWidgetAdd(evt){
                console.log('add', evt)
                console.log('end', evt)
                const newIndex = evt.newIndex
                const to = evt.to
                console.log(to)
            }
        },
        components:{
            Draggable,
            PageItem,
        }
    }
</script>

<style scoped lang="less">
    .mid-page-container{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .page{
            width: 100%;
            height: 100%;
            .page-list{
                height: 100%;
            }
            .ghost{
                background: #fff;
                border: 1px dashed #409EFF;

                &::after{
                    background: #fff;
                }
            }
        }
    }
</style>