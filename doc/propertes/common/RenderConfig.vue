<template>
  <div v-if="item.options.render">
    <template v-if="item.options.render.hasOwnProperty('showTitle')">
      <m-form-item
        :label="$t('itemProperty.showTitle')">
        <m-radio-group v-model="item.options.render.showTitle">
          <m-radio :label="true">
            {{$t('common.yes')}}
          </m-radio>
          <m-radio :label="false">
            {{$t('common.no')}}
          </m-radio>
        </m-radio-group>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.hideTitleText')">
        <m-radio-group v-model="item.options.render.hideTitleText">
          <m-radio :label="true">
            {{$t('common.yes')}}
          </m-radio>
          <m-radio :label="false">
            {{$t('common.no')}}
          </m-radio>
        </m-radio-group>
      </m-form-item>
    </template>
    <m-form-item
      :label="$t('itemProperty.customRender')">
      <m-radio-group v-model="item.options.render.custom">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <template v-if="item.options.render.custom">
      <m-form-item
        :label="$t('itemProperty.componentName')">
        <m-input
          v-model="item.options.render.url"
          @on-change="renderUrlChanged($event.target.value)">
          <item-map-editor
            ref="mapEditor"
            slot="append"
            v-model="item.options.render.components"
            :includeActiveComponent="false"
            icon="arrow-swap">
            {{item.options.render.components.length}}
          </item-map-editor>
        </m-input>
      </m-form-item>
    </template>
    <m-form-item
      :label="$t('itemProperty.disabledWhenBeFilled')">
      <m-radio-group v-model="item.options.disabledWhenBeFilled">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
  </div>
</template>
<script>
  import itemMapEditor from '../../../custom/ItemMapEditor';
  export default {
    data() {
      return {
        itemMapEditorDisabled: true,
      }
    },
    name: "RenderConfig",
    props: ['item'],
    components: {
      itemMapEditor,
    },
    methods: {
      renderUrlChanged(componentName) {
        this.$refs.mapEditor.getData(componentName);
      }
    },
    mounted() {
      if (this.item.options.render && this.item.options.render.custom && this.item.options.render.url) {
        this.renderUrlChanged(this.item.options.render.url);
      }
    }
  }
</script>
<style lang="less"></style>
