<template>
  <div v-if="item.options.dataService">
    <m-form-item
      :label="$t('itemProperty.dataServiceTitle')">
      <m-radio-group v-model="item.options.dataService.active">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="item.options.dataService.active">
      <MapEditor
        v-model="item.options.dataService.map"
        :values="item.options.values"
        :item="item"
        :items="items"
        :mainTable="mainTable">
      </MapEditor>
    </m-form-item>
  </div>
</template>
<script>
  import MapEditor from './MapEditor';

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
    name: "dataService",
    props: ['item', 'mainTable', 'items'],
    data() {
      return {}
    },
    methods: {
      getOptionsValues(options) {
        return getOptionsValuesService(options, this.$store.state.xFormData.items);
      }
    },
  }
</script>
<style lang="less"></style>
