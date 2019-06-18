<template>
    <div class="app-designer">
        <header-bar :data="pageConfig"></header-bar>
        <section class="section">
            <left-cate></left-cate>
            <div class="mid-container">
                <mid-page :data="pageConfig" :select.sync="curSelect"></mid-page>
            </div>
            <div class="right-cfg">
                <div class="tab-header">
                    <div class="cfg-tab" :class="{active:tabName==='item'}" @click="tabClick('item')">字段属性配置</div>
                    <div class="cfg-tab" :class="{active:tabName==='page'}" @click="tabClick('page')">页面属性配置</div>
                </div>
                <div class="tab-content">
                    <item-opts :show="tabName==='item'" :data="curSelect"></item-opts>
                    <page-opts :show="tabName==='page'" :data="pageConfig.opts"></page-opts>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import HeaderBar from './HeaderBar/main'
    import LeftCate from './LeftCate/main'
    import MidPage from './MidPage/main'
    import ItemOpts from './ItemOpts/main'
    import PageOpts from './PageOpts/main'

    export default {
        name: "main",
        data(){
            return{
                pageConfig:{
                    items:[],
                    opts:{//页面可配置属性
                        title:'标题'
                    }
                },
                curSelect:null,
                tabName:'item'
            }
        },
        methods: {
            tabClick(name){
                this.tabName = name
            }
        },
        components:{
            HeaderBar,
            LeftCate,
            MidPage,
            ItemOpts,
            PageOpts
        }
    }
</script>

<style scoped lang="less">
    .app-designer{
        height: 100%;
        width: 100%;
        .section {
            position: absolute;
            top: 50px;
            bottom: 0px;
            width: 100%;
            min-width: 900px;
            .mid-container{
                position: absolute;
                margin-left: 250px;
                top:0;
                bottom:0;
                width: calc(100% - 550px);
                border-left: 1px solid #e0e0e0;
                border-right: 1px solid #e0e0e0;
            }
            .right-cfg{
                position: absolute;
                top:0;
                bottom:0;
                right:0;
                width: 300px;
                .tab-header{
                    position: absolute;
                    border-bottom: solid 2px #e4e7ed;
                    padding: 0 5px;
                    width: 100%;
                    .cfg-tab{
                        float: left;
                        cursor: pointer;
                        height: 44px;
                        line-height: 44px;
                        display: inline-block;
                        width: 145px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 500;
                        position: relative;
                        &.active{
                            border-bottom: solid 3px #409EFF;
                        }
                    }


                }
                .tab-content{
                    position: absolute;
                    top:45px;
                }

            }
        }

    }


</style>