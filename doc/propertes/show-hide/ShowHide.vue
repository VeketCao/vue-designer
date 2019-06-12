<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.shoHideTitle')">
      <m-radio-group v-model="item.options.showHide.active">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="item.options.showHide.active">
      <MapEditor
        v-model="item.options.showHide.map"
        :values="getOptionsValues(item.options)"
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
    name: "ShowHide",
    props: ['item'],
    data() {
      return {}
    },
    methods: {
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      settingChanged(evt) {
        this.xEventHelper({
          type: 'itemDynamicSettingChanged',
          itemId: this.item.id,
        });
      },
      unsetHideItems(ids) {
        this.xEventHelper({
          type: 'unsetHideItems',
          itemId: ids,
        })
          .then();
      },
      getOptionsValues(options) {
        return getOptionsValuesService(options, this.$store.state.xFormData.items);
      }
    },
  }
</script>
<style lang="less"></style>
