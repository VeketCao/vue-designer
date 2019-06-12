<template>
  <div>
    <m-form-item
        :label="$t('itemProperty.wbButtonType')"
        :prop="'buttonType'">
      <MButtonGroup>
        <MButton
          @click="changeButtonType('custom')"
          :type="item.options.buttonType === 'custom' ? 'primary': 'default'">
          {{$t('itemProperty.wbButtonTypeOp0')}}
        </MButton>
        <MButton
          @click="changeButtonType('resful')"
          :type="item.options.buttonType === 'resful' ? 'primary': 'default'">
          {{$t('itemProperty.wbButtonTypeOp1')}}
        </MButton>
      </MButtonGroup>
    </m-form-item>
    <m-form-item
        v-if="item.options.buttonType === 'custom'"
        :prop="'key'">
      <m-input v-model="item.options.custom.key"></m-input>
    </m-form-item>
    <m-form-item
        v-if="item.options.buttonType === 'resful'"
        :prop="'url'">
      <m-input v-model="item.options.resful.url" placeholder="http://"></m-input>
    </m-form-item>
    <m-form-item
        :label="$t('itemProperty.wbAlign')"
        :prop="'align'">
        <Select
          v-model="item.options.align">
          <Option
            v-for="item in alignOptions"
            :value="item.value"
            :label="item.label[currentLang]"
            :key="item.label[currentLang]+item.value">
            {{ item.label[currentLang] }}
          </Option>
        </Select>
      </m-form-item>
  </div>
</template>
<script>
  const {
    lang: {
      formDesigner: {
        FormDesignerStaticLang,
      },
    },
  } = MSECORE;
  const {
    utils: {
      pattern: {
        Pattern,
      }
    }
  } = MSECORE;
  export default {
    name: "LinkProperty",
    props: ['item'],
    data() {
      return {
        alignOptions:[
          {value: 'center', label:FormDesignerStaticLang.itemProperty.wbAlignCenter},
          {value: 'left', label:FormDesignerStaticLang.itemProperty.wbAlignLeft},
          {value: 'right', label:FormDesignerStaticLang.itemProperty.wbAlignRight},
        ]
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
    },
    methods:{
      changeButtonType(_val){
        // console.log(_val)
        this.item.options.buttonType = _val
      }
    }
  }
</script>
<style lang="less"></style>
