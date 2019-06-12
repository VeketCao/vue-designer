<template>
  <div>
    <m-form-item
      :rules="[
        {required: true, message: $t('itemProperty.urlRequired'),},
        {pattern: urlPattern, message: $t('itemProperty.urlError'),}
        ]"
      :label="$t('itemProperty.hyperLink')"
      prop="value">
      <m-input
        v-model="item.value"
        :placeholder="$t('itemProperty.link') +':http://'"/>
    </m-form-item>
  </div>
</template>
<script>
  const {Pattern} = MSECORE.utils.pattern;
  export default {
    name: "LinkProperty",
    props: ['item'],
    data() {
      return {
        urlPattern: Pattern.url,
      }
    },
  }
</script>
<style lang="less"></style>
