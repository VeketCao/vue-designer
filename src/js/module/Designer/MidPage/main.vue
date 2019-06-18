<template>
    <div class="mid-page-container">
        <div class="page">
            <draggable class="page-list"
                       v-model="data.items"
                       v-bind="{group:'g', ghostClass: 'ghost'}"
                       @start="handleMoveStart"
                       @end="handleMoveEnd"
                       @add="handleWidgetAdd"

            >
                <template v-for="(it,index) in data.items">
                    <pageItem v-if="it" :key="it.key" :element="it" :index="index" :data="data" :select.sync="curSelect"></pageItem>
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
            handleMoveStart(e){
                console.log('start',e)
            },
            handleMoveEnd({newIndex, oldIndex}){
                console.log('index', newIndex, oldIndex)
            },
            handleWidgetAdd(e){//添加实例化后id
                console.log('add', e)
                const newIndex = e.newIndex
                const key = AppUtil.getUUID();
                this.$set(this.data.items,newIndex,{
                    ...this.data.items[newIndex],
                    key,
                })
                console.log(this.data)
                this.curSelect = this.data.items[newIndex];
            }
        },
        components:{
            Draggable,
            PageItem,
        },
        watch: {
            select (val) {
                this.curSelect = val
            },
            curSelect: {
                handler (val) {
                    this.$emit('update:select', val)
                },
                deep: true
            }
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
            border: 1px dashed #999;
            overflow-y: auto;
            .page-list{
                background: #fff;
                width: 100%;
                height: 100%;
            }

        }
    }

</style>