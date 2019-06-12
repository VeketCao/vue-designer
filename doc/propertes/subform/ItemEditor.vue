<template>
  <div>
    <m-form :model="column" class="subform-property">
      <m-form-item
        :label="$t('itemProperty.subformControlTitle')"
        :prop="'title.'+currentLang"
        :rules="[{required: true, message: $t('itemProperty.controlTitleRequired')}]">
        <vue-dynamic-loader
          :url="$asyncComponent('multiLangEditor')"
          :supportLang="supportLang"
          :value="column.title"
          v-model="column.title">
        </vue-dynamic-loader>
      </m-form-item>
      <values-source-switch
        v-if="column.type === 'select'"
        :item="column">
      </values-source-switch>
      <m-form-item
        :label="$t('itemProperty.requiredLabel')">
        <m-radio-group v-model="column.validators.required.required">
          <m-radio :label="true">
            {{$t('common.yes')}}
          </m-radio>
          <m-radio :label="false">
            {{$t('common.no')}}
          </m-radio>
        </m-radio-group>
      </m-form-item>
      <m-form-item
        v-if="column.validators.required.required"
        :label="$t('itemProperty.requiredMessageLabel')">
        <vue-dynamic-loader
          :url="$asyncComponent('multiLangEditor')"
          :supportLang="supportLang"
          :value="column.validators.required.message"
          v-model="column.validators.required.message">
        </vue-dynamic-loader>
      </m-form-item>
      <input class="advanced-filter" type="checkbox" :id="'advanced'+column.id">
      <m-form-item>
        <label
          class="m-btn m-btn-success m-btn-small"
          :for="'advanced'+column.id">
          <Icon type="arrow-down-b"></Icon>
          {{$t('itemProperty.advanceMode')}}
        </label>
      </m-form-item>
      <field-property
        :currentLang="currentLang"
        :sourceFields="item.options.fields"
        @fieldsChanges="item.options.fields = $event"
        :disabledFieldValues="disabledFieldValues(item.options)"
        :items="item.options.columns"
        :item="column">
      </field-property>
      <text-property
        v-if="column.type==='text'"
        :item="column">
      </text-property>
      <select-property
        type="subform"
        :items="item.options.columns"
        v-else-if="column.type === 'select'"
        :item="column">
      </select-property>
      <number-property
        v-else-if="column.type==='number'"
        :item="column">
      </number-property>
      <template v-else-if="column.type==='personSelector'">
        <person-selector-property :item="column">
        </person-selector-property>
        <data-service :item="column" :items="item.options.columns"></data-service>
      </template>
      <date-picker-property
        v-else-if="column.type === 'datePicker'"
        :item="column">
      </date-picker-property>
      <upload-file
        v-else-if="column.type === 'upload'"
        :item="column">
      </upload-file>
      <m-row>
        <m-col
          v-if="!offsetEnabled"
          :span="12">
          <m-form-item
            :label="$t('itemProperty.subformColumnWidth')">
            <m-input-number
              :step="1"
              :precision='0'
              v-model="column.options.layout.width"
              :min="5">
            </m-input-number>
          </m-form-item>
        </m-col>
        <template v-else>
          <m-col :span="12">
            <m-form-item
              :label="$t('itemProperty.subformColumnWidth')">
              <m-input-number
                :step="1"
                :precision='0'
                v-model="column.options.layout.span"
                :min="1"
                :max="24">
              </m-input-number>
            </m-form-item>
          </m-col>
          <m-col :span="12">
            <m-form-item
              :label="$t('itemProperty.subformColumnOffset')">
              <m-input-number
                :step="1"
                :precision='0'
                v-model="column.options.layout.offset"
                :min="0"
                :max="24">
              </m-input-number>
            </m-form-item>
          </m-col>
        </template>
      </m-row>
      <m-form-item>
        <render-config :item="column"></render-config>
      </m-form-item>
    </m-form>
  </div>
</template>
<script>
  import FieldProperty from '../common/Field.vue'
  import {commonDisabledFieldValues, disabledFieldValues} from "src/module/formdesigner/services/common/fields";
  import vueDynamicLoader from 'vue-dynamic-loader';
  import ValuesSourceSwitch from "../common/ValuesSourceSwitch";
  import DataService from '../dataService';
  import RenderConfig from '../common/RenderConfig';


  const {
    lang: {
      formDesigner: {
        FormDesignerStaticLang,
      },
    },
  } = MSECORE;

  export default {
    name: "itemEditor",
    props: {
      column: {
        type: Object,
        default: undefined,
        required: true,
      },
      item: {
        type: Object,
        default: undefined,
        required: true,
      },
      offsetEnabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        fixedList: [
          {name: FormDesignerStaticLang.itemProperty.fixedop0, value: 'none'},
          {name: FormDesignerStaticLang.itemProperty.fixedop1, value: 'left'},
          {name: FormDesignerStaticLang.itemProperty.fixedop2, value: 'right'}
        ]
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
    components: {
      vueDynamicLoader,
      FieldProperty,
      ValuesSourceSwitch,
      DataService,
      RenderConfig,
      SelectProperty: resolve => {
        require(['../Select.vue'], resolve)
      },
      UploadFile: resolve => {
        require(['../UploadFile'], resolve);
      },
      NumberProperty: resolve => {
        require(['../Number.vue'], resolve)
      },
      TextProperty: resolve => {
        require(['../Text.vue'], resolve)
      },
      PersonSelectorProperty: resolve => {
        require(['../PersonSelector.vue'], resolve)
      },
      DatePickerProperty: resolve => {
        require(['../DatePicker.vue'], resolve)
      },
    },
    methods: {
      disabledFieldValues(options) {
        let result = [];
        if (options.childModelInfo.foreignKey) {
          result.push(options.childModelInfo.foreignKey);
        }
        if (options.childModelInfo.primaryKey) {
          result.push(options.childModelInfo.primaryKey);
        }
        return [...commonDisabledFieldValues, ...disabledFieldValues, ...result];
      }
    },
  }
</script>
<style scoped>
</style>
