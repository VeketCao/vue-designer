<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.showVertical')">
      <m-radio-group
        v-model="item.options.vertical">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
  </div>
</template>
<script>
  export default {
    name: "RadioProperty",
    props: ['item'],
  }
</script>
<style lang="less"></style>
