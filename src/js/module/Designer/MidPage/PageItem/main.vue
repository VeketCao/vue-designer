<template>
    <div class="page-view">
        <component :is="element.type"></component>
    </div>
</template>

<script>
    export default {
        name: "PageItem",
        props:['element','select']
    }
</script>

<style scoped lang="less">

</style>