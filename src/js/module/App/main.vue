<template>
    <div id="app_container">
        <router-view></router-view>
    </div></template>
<script>
    export default {
        name: "main"
    }
</script>

<style scoped lang="scss">
    body {
        margin: 0px;
        padding: 0px;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        min-width:1200px;
        height:100%;
        width: 100%;
    }
    #app_container {
        margin: 0px;
        padding: 0px;
        height: 100%;
        width: 100%;
    }
</style>