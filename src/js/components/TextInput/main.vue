<template>
    <div class="text-input">
        <span>这是实例化后单文本行组件</span><br>
    </div>
</template>

<script>
    export default {
        name: "TextInput",
        props:['title'],
        data(){
            return{

            }
        }
    }
</script>

<style scoped lang="less">
.text-input{

}
</style>