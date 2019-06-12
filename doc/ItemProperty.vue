<template src="./ItemProperty.html">
</template>
<script>
  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex';
  import Vue from 'vue'
  import vueDynamicLoader from 'vue-dynamic-loader';
  import JsDynamicLoader from 'js-dynamic-loader';
  import ValuesSourceSwitch from "./propertes/common/ValuesSourceSwitch";
  import RenderConfig from './propertes/common/RenderConfig';

  import ShowHide from './propertes/show-hide/ShowHide';
  import DataService from './propertes/dataService';
  import {commonDisabledFieldValues, disabledFieldValues} from "src/module/formdesigner/services/common/fields";

  const {
    api: {
      formDesigner: {
        getModelInterfaceList,
      },
    },
    services: {
      formDesigner: {
        validators: {
          designerDataValidators,
        },
        config: {
          element: formElementConfig,
        }
      }
    }
  } = MSECORE;

  export default {
    name: 'ItemProperty',
    computed: {
      ...mapState({
        xFormConfigure(state) {
          return state.xFormConfigure;
        }
      }),
      ...mapGetters({
        item: 'getActiveItem',
        activeItemId: 'getActiveItemId',
        optionDisabled: 'optionDisabled'
      }),
      supportLang() {
        return this.$store.state.xFormConfigure.supportLang;
      },
      items() {
        return this.$store.state.xFormData.items;
      },
      fields() {
        return this.$store.state.xFormConfigure.fields;
      },
    },
    components: {
      vueDynamicLoader,
      ShowHide,
      DataService,
      ValuesSourceSwitch,
      RenderConfig,
      TextProperty: resolve => {
        require(['./propertes/Text.vue'], resolve)
      },
      RadioProperty: resolve => {
        require(['./propertes/Radio.vue'], resolve)
      },
      CheckboxProperty: resolve => {
        require(['./propertes/Checkbox.vue'], resolve)
      },
      SelectProperty: resolve => {
        require(['./propertes/Select.vue'], resolve)
      },
      DescriptionInputProperty: resolve => {
        require(['./propertes/DescriptionInput.vue'], resolve)
      },
      DividerProperty: resolve => {
        require(['./propertes/Divider.vue'], resolve)
      },
      DatePickerProperty: resolve => {
        require(['./propertes/DatePicker.vue'], resolve)
      },
      NumberProperty: resolve => {
        require(['./propertes/Number.vue'], resolve)
      },
      PersonSelectorProperty: resolve => {
        require(['./propertes/PersonSelector.vue'], resolve)
      },
      LinkProperty: resolve => {
        require(['./propertes/Link.vue'], resolve)
      },
      RichTextProperty: resolve => {
        require(['./propertes/RichText.vue'], resolve)
      },
      FieldProperty: resolve => {
        require(['./propertes/common/Field.vue'], resolve)
      },
      RequiredProperty: resolve => {
        require(['./propertes/common/Required.vue'], resolve)
      },
      ReferenceFile: () => JsDynamicLoader(Vue.prototype.$asyncComponent('uploadFile')),
      UploadFile: resolve => {
        require(['./propertes/UploadFile'], resolve);
      },
      SelectModel: resolve => {
        require(['../../configure/SelectModel.vue'], resolve);
      },
      Subform: resolve => {
        require(['./propertes/subform/index'], resolve);
      },
      layoutProperty: resolve => {
        require(['./propertes/layoutProperty/index.vue'], resolve);
      },
      widgetButtonProperty: resolve => {
        require(['./propertes/widgetButton.vue'], resolve);
      },
      SubformOtherConfig: resolve => {
        require(['./propertes/subform/OtherConfig'], resolve);
      }
    },
    data() {
      return {
        // 配置信息
        config: formElementConfig,
        temKey: 0,
        disabledFieldValues: [...disabledFieldValues, ...commonDisabledFieldValues],
        // 多语言
        showDataModel: false,
        lang: this.$store.state.xUser.fdLangType,
      }
    },
    methods: {
      ...mapMutations({
        xUpdateFields: 'fccSetModelFields',
        xUpdateItemProd: 'fdcUpdateItemProp',
      }),
      chooseDataModel() {
        this.showDataModel = true;
      },
      handleChoose(model) {
        this.item.mdcModelId = model.fdId;
        this.item.mdcModelName = model.fdName;

        if (this.item.interfaceCode != "") {
          this.item.interfaceCode = "";
        }

        getModelInterfaceList({
          fdAppId: this.xFormConfigure.fdAppId,
          fdDataModuleId: model.fdId,
        }).then(data => {
          if (data.success) {
            let array = []
            data.data.map(el => {
              switch (el.fdOperatorType) {
                case "query":
                  array.push(el);
                  break;
              }
            });
            this.item.interfaceList = array;
          } else {
            this.$Message.error(data.msg);
          }
        })
      },
    },
    watch: {
      item: {
        handler() {
          designerDataValidators(this.$store.state.xFormData.items, this.$store.state.xUser.fdLangType);
        },
        deep: true
      },
    },
  }
</script>
<style lang="less" scoped src="./ItemProperty.less"></style>
