<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.selectMultiple')">
      <m-radio-group
        @on-change="multipleChanged($event)"
        v-model="item.options.multiple">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <enableEdit
      v-if="type==='subform'"
      :item="item"
      :items="items">
    </enableEdit>
  </div>
</template>
<script>
  import enableEdit from './enable-edit/index.vue';
  import {mapActions} from 'vuex';

  export default {
    components: {
      enableEdit,
    },
    name: "SelectProperty",
    props: ['item', 'type', 'items'],
    methods: {
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      multipleChanged(e) {
        if (e) {
          this.item.value = [];
          this.clearShowHide();
        } else {
          this.item.value = '';
        }
      },

      // 点击多选时清除显示隐藏关联
      clearShowHide() {
        if (this.item.options.showHide) {
          this.item.options.showHide.active = false;
          this.item.options.showHide.map = [];
          this.xEventHelper({
            type: 'itemDynamicSettingChanged',
            itemId: this.item.id,
          });
        }
      }
    },
    data() {
      return {}
    },
  }
</script>
<style lang="less"></style>
