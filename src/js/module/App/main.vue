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
        font-family: Avenir,Helvetica,Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
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