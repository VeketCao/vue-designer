<template>
    <div class="mid-page-container">
        <div class="page">
            <draggable class="page-list"
                       v-model="data.items"
                       v-bind="{group:'g', ghostClass: 'ghost'}"
                       @start="handleMoveStart"
                       @end="handleMoveEnd"
                       @add="handleWidgetAdd">
                <template v-for="(it,index) in data.items">
                    <template v-if="it.type==='ColumnLayout' && it.key">
                        <div class="column-layout-row"
                             :class="{active:curSelect.key==it.key}"
                             @click="selectRowHandle(index)">
                            <div v-for="(col,colIndex) in it.cols" class="column-layout-cell"
                                :class="{width3:it.cols.length==3,width4:it.cols.length==4}">
                                <draggable class="cell-list"
                                           v-model="col.items"
                                           v-bind="{group:'g',ghostClass:'ghost'}"
                                           @end="handleMoveEnd"
                                           @add="dragCellAdd($event,it,colIndex)">
                                    <template v-for="(v,vIndex) in col.items">
                                        <pageItem v-if="v" :key="v.key" :element="v" :index="vIndex" :data="col" :select.sync="curSelect"></pageItem>
                                    </template>
                                </draggable>
                            </div>
                            <div class="tool-bar">
                                <div class="right-btn">
                                    <a @click.stop="delHandle(index)"><i class="fa fa-trash-o"></i></a>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <pageItem v-if="it" :key="it.key" :element="it" :index="index" :data="data" :select.sync="curSelect"></pageItem>
                    </template>
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
        created(){
            Bus.$on('dragCateEnd',(e)=>{
                this.clearDeepLayout(e)
            })
        },
        methods:{
            dragCellAdd($event,it,colIndex){
                console.log('drag cell add')
                const newIndex = $event.newIndex;
                const key = AppUtil.getUUID()
                this.$set(it.cols[colIndex].items,newIndex,{
                    ...it.cols[colIndex].items[newIndex],
                    key
                })
                this.curSelect = it.cols[colIndex].items[newIndex]

            },
            delHandle(index){
                if (this.data.items.length - 1 === index) {
                    if (index === 0) {
                        this.curSelect = {}
                    } else {
                        this.curSelect = this.data.items[index - 1]
                    }
                } else {
                    this.curSelect = this.data.items[index + 1]
                }

                this.$nextTick(() => {
                    this.data.items.splice(index, 1)
                })
            },
            clearDeepLayout(e){
                _.each(this.data.items,(it)=>{
                    if(it.type=='ColumnLayout'){
                        _.each(it.cols,(col)=>{
                            _.each(col.items,(cel,index)=>{
                                if(cel.type=='ColumnLayout'){
                                    cel.items.splice(index,1)
                                    this.curSelect={}
                                }
                            })
                        })
                    }
                })
            },
            selectRowHandle(index){
                this.curSelect=this.data.items[index]
            },
            handleMoveStart(e){
                console.log('start',e)
            },
            handleMoveEnd({newIndex, oldIndex}){
                console.log('index', newIndex, oldIndex)
            },
            handleWidgetAdd(e){//添加实例化后id
                const newIndex = e.newIndex
                const key = AppUtil.getUUID();
                this.$set(this.data.items,newIndex,{
                    ...this.data.items[newIndex],
                    key,
                })

                if(this.data.items[newIndex].type==='ColumnLayout'){
                    this.$set(this.data.items,newIndex,{
                        ...this.data.items[newIndex],
                        cols:this.data.items[newIndex].cols.map(item=>({...item}))
                    })
                }

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
        height: 100%;
        .page{
            width: 100%;
            height: 100%;
            border: 1px dashed #999;
            overflow-y: auto;
            .page-list{
                width: 100%;
                height: 100%;
                .column-layout-row{
                    position: relative;
                    width: 100%;
                    min-height: 60px;
                    padding: 5px;
                    border: 1px dashed goldenrod;
                    overflow: hidden;
                    .tool-bar{
                        display: none;
                    }
                    &.active{
                        border: 2px solid goldenrod;
                        .tool-bar{
                            display: block;
                            position: absolute;
                            width: 20px;
                            right: 0;
                            bottom: 0;
                            .right-btn{
                                position: relative;
                                float: right;
                                background-color: goldenrod;
                                a{
                                    padding: 0px 5px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                    &.ghost{
                        &:after{
                            background: #fff;
                            position: absolute;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            display: block;
                            z-index: 10;
                        }
                    }

                    .column-layout-cell{
                        position: relative;
                        display: inline;
                        border: 1px dashed #999;
                        width: 50%;
                        float: left;
                        &.width3{
                            width: 33.33%!important;
                        }
                        &.width4{
                            width: 25%!important;
                        }
                        .cell-list{
                            z-index: 100001;
                            width: 100%;
                            min-height: 50px;
                        }
                    }

                }
            }

        }
    }

</style>