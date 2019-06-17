<template>
    <div class="page-item-view "
         v-if="element && element.key"
         :class="{active:curSelect.key==element.key}"
         @click="handleClick(index)"

    >
        <component :is="element.type"></component>
    </div>
</template>

<script>
    export default {
        name: "PageItem",
        props:['element','select','index','data'],
        data(){
            return{
                curSelect:this.select,
            }
        },
        methods:{
            handleClick(){

                this.curSelect = this.data.items[this.index];
                console.log('select',this.curSelect)
            }
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