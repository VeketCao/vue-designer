<template>
    <div >
        <h1>Hello,{{title||'World!'}}</h1><br>
    </div>
</template>

<script>
    export default {
        name: "HelloWorld",
        props:['title'],
        data(){
            return{

            }
        }
    }
</script>

<style scoped lang="less">

</style>