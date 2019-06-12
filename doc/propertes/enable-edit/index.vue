<template>
  <div v-if="item.options&&item.options.enableEdit">
    <m-form-item
      :label="$t('itemProperty.allowTitle')">
      <m-radio-group v-model="item.options.enableEdit.active">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="item.options.enableEdit.active">
      <MapEditor
        :items="items"
        :item="item"
        v-model="item.options.enableEdit.map"
        :values="getOptionsValues(item.options)"
        :valueType="singleValueOrMultipleValue()"
        @unset-items="unsetHideItems"
        @on-change="settingChanged">
      </MapEditor>
    </m-form-item>
  </div>
</template>
<script>
  import MapEditor from './MapEditor';
  import {mapActions} from 'vuex';

  const {
    services: {
      formDesigner: {
        dataHelper: {
          getOptionsValuesService,
        },
      }
    },
  } = MSECORE;

  export default {
    components: {
      MapEditor,
    },
    name: "enableEdit",
    props: ['item', 'items'],
    data() {
      return {}
    },
    methods: {
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      singleValueOrMultipleValue() {
        let result = '';
        const singleValueTypes = ['radio', 'text', 'number', 'datePicker'];
        const arrayValueTypes = ['checkbox'];
        const singleOrMultiple = ['select'];
        const type = this.item.type;
        if (singleValueTypes.indexOf(type) >= 0) {
          result = 'single';
        } else if (arrayValueTypes.indexOf(type) >= 0) {
          result = 'multiple';
        } else if (singleOrMultiple.indexOf(type) >= 0) {
          if (this.item.options.multiple) {
            result = 'multiple';
          } else {
            result = 'single';
          }
        }
        return result;
      },
      getOptionsValues(options) {
        return getOptionsValuesService(options, this.$store.state.xFormData.items);
      }
    },
  }
</script>
<style lang="less"></style>
