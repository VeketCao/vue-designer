<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.typeLabel')">
      <m-radio-group
        @on-change="textTypeChanged"
        :value="item.validators.type.type">
        <m-radio
          v-for="item in textTypes"
          :label="item.value">
          {{ item.label[lang] }}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="item.validators.type.type === 'string'"
      :label="$t('itemProperty.onlyInclude')">
      <m-checkbox-group
        v-model="item.validators.type.allowedTypes">
        <m-checkbox
          v-for="c in textValueTypes"
          :key="c.value"
          :label="c.value">
          {{c.label[lang]}}
        </m-checkbox>
      </m-checkbox-group>
    </m-form-item>
    <m-form-item
      v-if="item.validators.type.type === 'pattern'"
      :label="$t('itemProperty.patternDetail')">
      <m-input
        v-model="item.validators.type.pattern"
        :placeholder="$t('itemProperty.patternPlaceholder')">
        <span slot="prepend">/</span>
        <span slot="append">/</span>
      </m-input>
    </m-form-item>
    <m-form-item
      v-if="item.validators.type.type !== 'string' || item.validators.type.allowedTypes.length"
      :label="$t('itemProperty.typeErrorInfo')">
      <vue-dynamic-loader
        :url="$asyncComponent('multiLangEditor')"
        :supportLang="supportLang"
        :value="item.validators.type.message"
        v-model="item.validators.type.message">
      </vue-dynamic-loader>
    </m-form-item>
    <m-row>
      <m-col span="12">
        <m-form-item
          :label="$t('itemProperty.rowsLabel')">
          <m-input-number
            v-model="item.options.rows"
            :max="20"
            :min="1">
          </m-input-number>
        </m-form-item>
      </m-col>
      <m-col span="12">
        <m-form-item
          :label="$t('itemProperty.maxLengthLabel')">
          <m-input-number
            v-model="item.validators.length.max"
            :max="999"
            @on-change="handleChange2()"
            :min="1">
          </m-input-number>
        </m-form-item>
      </m-col>
    </m-row>
  </div>
</template>
<script>
  import vueDynamicLoader from 'vue-dynamic-loader';
  import cloneDeep from 'lodash.clonedeep';

  const {
    services: {
      formDesigner: {
        dataSource: {
          textTypes,
          textStringValueTypes: textValueTypes,
        },
      },
    },
    lang: {
      formDesigner: {
        FormDesignerStaticLang,
        FormDesignerDynamicLang,
      },
    },
  } = MSECORE;

  export default {
    components: {
      vueDynamicLoader,
    },
    name: "TextProperty",
    props: ['item'],
    data() {
      return {
        // 类型设置
        textTypes,
        textValueTypes,
        lang: this.$store.state.xUser.fdLangType,
      }
    },
    methods: {
      textTypeChanged(newType) {
        if (this.item.validators.type.type !== newType) {
          switch (newType) {
            case 'string':
              this.item.validators.type.message = cloneDeep(FormDesignerStaticLang.itemProperty.typeErrorInfo);
              break;
            case 'email':
              this.item.validators.type.message = cloneDeep(FormDesignerStaticLang.itemProperty.emailErrorInfo);
              break;
            case 'pattern':
              this.item.validators.type.message = cloneDeep(FormDesignerStaticLang.itemProperty.patternErrorInfo);
              break;
            default:
              this.item.validators.type.message = cloneDeep(FormDesignerStaticLang.itemProperty.typeErrorInfo);
              break;
          }
          this.item.validators.type.type = newType;
        }
      },
      handleChange2() {
        this.item.validators.length.message = FormDesignerDynamicLang.itemProperty.length(1, this.item.validators.length.max);
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
      supportLang() {
        return this.$store.state.xFormConfigure.supportLang;
      },
    },
    watch: {
      currentLang(newValue) {
        this.lang = newValue;
      }
    },
  }
</script>
<style lang="less"></style>
