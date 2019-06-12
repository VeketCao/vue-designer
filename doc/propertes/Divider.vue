<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.lineWidth')">
      <Select v-model="item.options.lineWidth">
        <Option
          v-for="(c,index) in [1,2,3,4,5]"
          :value="c"
          :key="index">
        </Option>
      </Select>
    </m-form-item>
    <m-form-item :label="$t('itemProperty.style')">
      <Select v-model="item.options.lineType">
        <Option
          v-for="(c,index) in ['solid', 'dotted' , 'dashed' ]"
          :value="c"
          :label="c"
          :key="index">
          <div
            :style="{ borderTopWidth: '1px', borderTopColor: '#cccccc', borderTopStyle: c }">
          </div>
        </Option>
      </Select>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.color')">
      <ColorPicker
        v-model="item.options.lineColor"
        :placeholder="$t('itemProperty.example') +': #ff0000'"/>
    </m-form-item>
  </div>
</template>
<script>
  export default {
    name: "DividerProperty",
    props: ['item'],
    data() {
      return {}
    },
  }
</script>
<style lang="less"></style>
