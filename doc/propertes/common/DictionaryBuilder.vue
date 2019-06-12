<template>
  <div>
    <m-form-item
      prop="options.dictionaryConfig.model.modelName"
      :rules="[{required: true, message: $t('itemProperty.contentRequired')}]"
      :label="$t('itemProperty.dicModel')">
      <m-col span="24">
        <m-input
          :disabled="disabled"
          :value="options.dictionaryConfig.model.modelName"
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
    <dic-select-model
      v-model="showDataModel"
      :fdAppId="fdAppId"
      @handleChoose="handleChoose">
    </dic-select-model>
  </div>
</template>
<script>
  import DicSelectModel from "src/module/formdesigner/components/configure/DicSelectModel";
  import { mapGetters, mapActions } from 'vuex';

  const {
    api: {
      formDesigner: {
        findByKeyWordInFdDictCode,
      },
    },
    lang: {
      lang: {
        LangFactory,
      }
    },
  } = MSECORE;

  export default {
    components: {
      DicSelectModel
    },
    name: "DictionaryBuilder",
    props: ['options', 'disabled'],
    mounted() {
    },
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
        this.options.dictionaryConfig.model.modelId = model.fdCode;
        this.options.dictionaryConfig.model.modelName = model.fdName+' ( '+model.fdCode+' )';

        findByKeyWordInFdDictCode({
          dictCode: model.fdCode,
          keyword: '',
          page:1,
          pageSize:1000,
        }).then(data => {
          if (data.success) {
            let array = [];
            if(data.data && data.data.list && data.data.list.length>0){
              data.data.list.map(el => {
                array.push({
                  value: el.fdValue,
                  label: new LangFactory(el.fdName, el.fdName, el.fdName),
                });
              });
            }

            this.options.dictionaryConfig.values = array;

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
