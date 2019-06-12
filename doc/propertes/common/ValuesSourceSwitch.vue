<template>
  <div>
    <m-form-item :label="$t('itemProperty.optionsValuesType')">

      <m-radio-group
        :value="item.options.valuesType"
        @on-change="changeValuesType($event)"
        type="button">
        <Radio
          :disabled="valuesLock>0"
          label="static">
          {{$t('itemProperty.optionsStaticValues')}}
        </Radio>
        <Radio
          :disabled="valuesLock>0"
          label="dynamic">
          {{$t('itemProperty.optionsDynamicValues')}}
        </Radio>
        <Radio
          :disabled="valuesLock>0"
          label="dictionary">
          {{$t('itemProperty.optionsDictionaryValues')}}
        </Radio>
      </m-radio-group>
    </m-form-item>
    <options-builder
      @on-change="valueChanged"
      @on-delete="clearValueNotExist"
      :disabled="valuesLock>0"
      v-if="item.options.valuesType === 'static'"
      :values="item.options.values">
    </options-builder>
    <dynamic-builder
      :disabled="valuesLock>0"
      v-else-if="item.options.valuesType === 'dynamic'"
      :options="item.options">
    </dynamic-builder>
    <dictionary-builder
      v-else
      :disabled="valuesLock>0"
      :options="item.options">
    </dictionary-builder>
    <Alert
      class="alert"
      type="warning"
      show-icon
      v-if="valuesLock>0">{{$t('itemProperty.optionsValuesTypeLock')}}
      <a @click="clearShowHideRules()">{{$t('itemProperty.optionsShowHideRulesDelete')}}</a>
    </Alert>
  </div>
</template>
<script>
  import OptionsBuilder from "./OptionsBuilder";
  import DynamicBuilder from "./DynamicBuilder";
  import DictionaryBuilder from "./DictionaryBuilder";
  import {mapActions} from 'vuex';

  export default {
    components: {
      DynamicBuilder,
      DictionaryBuilder,
      OptionsBuilder
    },
    name: "ValuesSourceSwitch",
    props: ['item'],
    computed: {
      valuesLock() {
        let result = 0;
        if (this.item.options.showHide &&
          this.item.options.showHide.map.length) {
          result = this.item.options.showHide.map.length;
        }

        if (this.item.options.enableEdit &&
          this.item.options.enableEdit.map.length) {
          result = this.item.options.enableEdit.map.length;
        }
        return result;
      },
    },
    methods: {
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      changeValuesType(newType) {
        if (this.item.options.valuesType === newType) {
          return;
        }
        this.item.value = (typeof this.item.value === 'string') ? '' : [];
        this.item.options.valuesType = newType;
        this.clearShowHideRules();
      },
      clearValueNotExist() {
        if (this.item.options.valuesType !== 'static') {
          return;
        }
        if (this.item.value instanceof Array) {
          this.item.value.forEach((v, vi) => {
            if (!this.item.options.values.filter(ov => ov.value === v).length) {
              this.item.value.splice(vi, 1);
            }
          });
        } else if (!this.item.options.values.filter(ov => ov.value === this.item.value).length) {
          this.item.value = '';
        }
      },
      clearShowHideRules() {
        if (this.item.options.enableEdit) {
          const result = [];
          this.item.options.enableEdit.map.forEach(m => {
            const {targets} = m;
            targets.forEach(id => {
              if (result.indexOf(id) === -1) {
                result.push(id);
              }
            });
          });
          this.item.options.enableEdit.map = [];
          // this.xEventHelper({
          //   type: 'unsetHideItems',
          //   itemId: result,
          // }).then();
        }

        if (this.item.options.showHide) {
          const result = [];
          this.item.options.showHide.map.forEach(m => {
            const {targets} = m;
            targets.forEach(id => {
              if (result.indexOf(id) === -1) {
                result.push(id);
              }
            });
          });
          this.item.options.showHide.map = [];
          this.xEventHelper({
            type: 'unsetHideItems',
            itemId: result,
          })
            .then();
        }
      },
      valueChanged() {
        if (this.item.value instanceof Array) {
          this.item.value.forEach((v, i) => {
            const valueFilter = this.item.options.values.filter(ov => ov.value === v);
            if (!valueFilter.length) {
              this.item.value.splice(i, 1);
            }
          });
        } else {
          const valueFilter = this.item.options.values.filter(ov => ov.value === this.item.value);
          if (!valueFilter.length) {
            this.item.value = '';
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .alert {
    margin-bottom: 25px;
  }
</style>
