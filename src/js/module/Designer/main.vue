<template>
    <div class="app-designer">
        <header-bar></header-bar>
        <section class="section">
            <left-cate></left-cate>
            <div class="mid-container">
                <mid-page :data="pageConfig" :select.sync="curSelect"></mid-page>
            </div>
            <div class="right-cfg">

            </div>
        </section>
    </div>
</template>

<script>
    import HeaderBar from './HeaderBar/main'
    import LeftCate from './LeftCate/main'
    import MidPage from './MidPage/main'

    export default {
        name: "main",
        data(){
            return{
                pageConfig:{
                    list:[],
                    opts:{//页面可配置属性
                        title:''
                    }
                },
                curSelect:null
            }
        },
        methods: {

        },
        components:{
            HeaderBar,
            LeftCate,
            MidPage,
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
            }
        }

    }


</style>