<template>
    <div v-if="show">
        <span>{{JSON.stringify(this.data)}}</span>
    </div>
</template>

<script>
    export default {
        name: "PageOpts",
        props:['show','data']
    }
</script>

<style scoped>

</style>