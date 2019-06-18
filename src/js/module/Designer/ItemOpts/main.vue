<template>
    <div v-if="show">
        <span>{{JSON.stringify(this.data||'')}}</span>
    </div>
</template>

<script>
    export default {
        name: "ItemOpts",
        props:['show','data']
    }
</script>

<style scoped>

</style>