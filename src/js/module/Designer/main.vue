<template>
    <div class="app-designer">
        <header-bar></header-bar>
        <section class="section">
            <left-cate></left-cate>
            <div class="mid-container">
            </div>
            <div class="right-cfg">
            </div>
        </section>
    </div>
</template>

<script>
    import HeaderBar from './HeaderBar/main';
    import LeftCate from './LeftCate/main'

    export default {
        name: "main",
        data(){
            return{

            }
        },
        methods: {

        },
        components:{
            HeaderBar,
            LeftCate,
        }
    }
</script>

<style scoped lang="less">
    .app-designer{e
        height: 100%;
        width: 100%;
        .section {
            position: absolute;
            top: 50px;
            bottom: 0px;
            width: 100%;
            .mid-container{
                position: absolute;
                margin-left: 225px;
                top:0;
                bottom:0;
                width: calc(100% - 500px);
            }
            .right-cfg{
                position: absolute;
                top:0;
                bottom:0;
                right:0;
                width: 275px;
                border-left:1px solid #eee;
            }
        }

    }


</style>