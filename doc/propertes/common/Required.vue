<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.requiredLabel')">
      <m-radio-group
        v-model="item.validators.required.required">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="item.validators.required.required"
      :label="$t('itemProperty.requiredMessageLabel')">
      <vue-dynamic-loader
        :url="$asyncComponent('multiLangEditor')"
        :supportLang="supportLang"
        :value="item.validators.required.message"
        v-model="item.validators.required.message">
      </vue-dynamic-loader>
    </m-form-item>
  </div>
</template>
<script>
  import vueDynamicLoader from 'vue-dynamic-loader';
  export default {
    components: {
      vueDynamicLoader,
    },
    name: "RequiredProperty",
    props: ['item'],
    data() {
      return {
        csradio:false,
      }
    },
    computed: {
      supportLang() {
        return this.$store.state.xFormConfigure.supportLang;
      },
    }
  }
</script>
<style lang="less"></style>
