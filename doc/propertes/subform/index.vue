<template>
  <div>
    <m-form-item>
      <Steps
        size="small"
        :current="item.options.step">
        <Step :title="$t('itemProperty.subformModelConfig')"></Step>
        <Step :title="$t('itemProperty.subformControlConfig')"></Step>
      </Steps>
    </m-form-item>
    <model-config
      ref="modelConfig"
      v-if="item.options.step === 0"
      @options-changed="item.options = $event"
      :options="item.options"
      @clickNext="handleClickNext">
    </model-config>
    <template v-else>
      <control-config
        :item="item">
      </control-config>
      <m-form-item>
        <MButton
          @click="item.options.step = 0"
          long
          type="warning">
          {{$t('common.previousStep')}}
        </MButton>
      </m-form-item>
    </template>
  </div>
</template>
<script>
  import ModelConfig from './ModelConfig';
  import ControlConfig from './ControlConfig';

  export default {
    name: "Subform",
    props: {
      item: {
        type: Object,
        default: undefined,
        required: true,
      },
    },
    data() {
      return {
        openedItem: '',
      }
    },
    computed: {},
    mounted() {},
    methods: {
      // 点击下一步
      handleClickNext () {
        let valideForm = this.$refs['modelConfig'].$parent.$parent;
        valideForm.validate((valid) => {
          if (valid) {
            this.item.options.step = 1;
          }
        })
      },
    },
    components: {
      ModelConfig,
      ControlConfig,
    },
  };

</script>
<style scoped lang="less">
  .margin-small-top {
    margin-top: 10px;
  }
</style>
