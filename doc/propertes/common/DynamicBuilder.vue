<template>
  <div>
    <m-form-item
      prop="options.dynamicConfig.model.mdcModelName"
      :rules="[{required: true, message: $t('itemProperty.contentRequired')}]"
      :label="$t('itemProperty.dataModel')">
      <m-col span="24">
        <m-input
          :disabled="disabled"
          :value="options.dynamicConfig.model.mdcModelName"
          :readonly="true">
          <m-button
            :disabled="disabled"
            @click="chooseDataModel"
            slot="append">
            {{$t('itemProperty.choose')}}
          </m-button>
        </m-input>
      </m-col>
    </m-form-item>
    <m-form-item
      v-if="options.dynamicConfig.model.interface.list.length"
      :label="$t('common.interfaceSetting')">
      <Select
        :disabled="disabled"
        v-model="options.dynamicConfig.model.interface.fdInterfaceCode"
        @on-change="configChanged()">
        <Option
          v-for="item in options.dynamicConfig.model.interface.list"
          :key="item.fdInterfaceCode"
          :value="item.fdInterfaceCode">
          {{ item.fdName }}
        </Option>
      </Select>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.withRelativeComponents')">
      <m-radio-group
        v-model="options.dynamicConfig.relativeComponents.key">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      v-if="options.dynamicConfig.relativeComponents.key"
      :label="$t('itemProperty.relativeComponents')">
      <Select
        v-if="otherItems.length > 0"
        @on-change="configChanged()"
        v-model="options.dynamicConfig.relativeComponents.value">
        <Option
          v-for="item in otherItems"
          :value="item.id"
          :key="item.id">
          {{ item.title[currentLang] }}
        </Option>
      </Select>
      <p v-else>
        {{$t('itemProperty.noComponentsAvaliable')}}
      </p>
    </m-form-item>
    <select-model
      v-model="showDataModel"
      :fdAppId="fdAppId"
      @handleChoose="handleChoose">
    </select-model>
  </div>
</template>
<script>
  import SelectModel from "src/module/formdesigner/components/configure/SelectModel";
  import { mapGetters, mapActions } from 'vuex';

  const {
    getModelInterfaceList,
  } = MSECORE.api.formDesigner;

  export default {
    components: {SelectModel},
    name: "DynamicBuilder",
    props: ['options', 'disabled'],
    data() {
      return {
        showDataModel: false,
      }
    },
    methods: {
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      chooseDataModel() {
        this.showDataModel = true;
      },
      configChanged() {
        if (!this.options.dynamicConfig.model.mdcModelId) {
          return;
        }
        this.xEventHelper({
          type: 'itemDynamicSettingChanged',
          itemId: this.activeItem.id,
        });
      },
      handleChoose(model) {
        this.options.dynamicConfig.model.mdcModelId = model.fdId;
        this.options.dynamicConfig.model.mdcModelName = model.fdName;
        getModelInterfaceList({
          fdAppId: this.fdAppId,
          fdDataModuleId: model.fdId,
        }).then(data => {
          if (data.success) {
            let tmp_reg = /_inquery$/gi;
            let array = [];
            data.data.map(el => {
              switch (el.fdOperatorType) {
                case "query":
                  if(!el.fdInterfaceCode.match(tmp_reg)){
                    array.push({
                      fdInterfaceCode: el.fdInterfaceCode,
                      fdName: el.fdName,
                    });
                  }
                  break;
              }
            });
            this.options.dynamicConfig.model.interface.list = array;
            if (array.length >= 1 && !this.options.dynamicConfig.model.interface.fdInterfaceCode) {
              this.options.dynamicConfig.model.interface.fdInterfaceCode = array[0].fdInterfaceCode;
              this.configChanged();
            }
          } else {
            this.$Message.error(data.msg);
          }
        })
      },
    },
    computed: {
      fdAppId() {
        return this.$store.state.xFormConfigure.fdAppId;
      },
      ...mapGetters({
        otherItems: 'getOtherItemsList',
        currentLang: 'getCurrentLang',
        activeItem: 'getActiveItem',
      }),
    },
  }
</script>
<style lang="less" scoped>
  .option-row {
    margin-bottom: 5px;
  }
</style>
