<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.enableId')">
      <m-radio-group
        v-model="item.options.showId">
        <m-radio
          :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio
          :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.enablePagination')">
      <m-radio-group
        v-model="enablePageSize">
        <m-radio
          :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio
          :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="enablePageSize"
      :label="$t('itemProperty.paginationSize')">
      <m-input-number
        :step="1"
        :precision='0'
        v-model="item.options.pagination.pageSize"
        :max="10000"
        :min="1">
      </m-input-number>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.rowDisplay')">
      <Select
        :transfer="true"
        :key="$lang"
        placement="top"
        v-model="item.options.rowDisplay">
        <Option
          v-for="v in rowDisplayConfig"
          :value="v.value">
          <span>{{v.label[$lang]}}</span>
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
      }
    },
  } = MSECORE;
  export default {
    name: "SubformOtherConfig",
    props: ['item'],
    data() {
      return {
        rowDisplayConfig: [
          {
            value: 'default',
            label: FormDesignerStaticLang.itemProperty.default,
          },
          {
            value: 'table',
            label: FormDesignerStaticLang.itemProperty.table,
          }
        ],
      }
    },
    computed: {
      enablePageSize: {
        get() {
          return !(this.item.options.pagination.pageSize === 999999999);
        },
        set(val) {
          if (val) {
            this.item.options.pagination.pageSize = 20;
          } else {
            this.item.options.pagination.pageSize = 999999999;
          }
        }
      }
    }
  }
</script>
<style lang="less"></style>
