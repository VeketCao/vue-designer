<template>
  <div>
    <m-form-item :label="$t('itemProperty.optionsSetTitle')">
      <m-row
        class="option-row"
        :gutter="8">
        <m-col span="11">
          {{$t('itemProperty.optionLabelText')}}
        </m-col>
        <m-col span="10">
          {{$t('itemProperty.optionValueText')}}
        </m-col>
      </m-row>
      <m-row
        v-for="(option, index) in values"
        class="option-row"
        :gutter="8">
        <m-col span="11">
          <vue-dynamic-loader
            :url="$asyncComponent('multiLangEditor')"
            :supportLang="supportLang"
            v-model="option.label"
            :value="option.label">
          </vue-dynamic-loader>
        </m-col>
        <m-col span="10">
          <m-input
            @on-change="$emit('on-change', $event.target.value)"
            :disabled="disabled && index <= tempOptionsLength-1"
            v-model="option.value">
          </m-input>
        </m-col>
        <m-col span="3" v-if="disabled ? (index > tempOptionsLength-1 && values.length > 1) : values.length > 1">
          <m-button
            @click="deleteOption(index)"
            shape="circle"
            size="small"
            icon="close">
          </m-button>
        </m-col>
      </m-row>
      <m-button
        @click="addOption()"
        type="success"
        icon="plus">
        {{$t('itemProperty.addOptions')}}
      </m-button>
    </m-form-item>
  </div>
</template>
<script>
  import vueDynamicLoader from "vue-dynamic-loader";
  const {
    services: {
      formDesigner: {
        dataHelper: {
          OptionConstructor,
        }
      }
    }
  } = MSECORE;

  export default {
    components: {
      vueDynamicLoader,
    },
    name: "OptionsBuilder",
    props: ['values', 'disabled'],
    data() {
      return {
        tempOptionsLength: 0,
      }
    },
    methods: {
      deleteOption(index) {
        this.values.splice(index, 1);
        this.$emit('on-delete');
      },
      addOption() {
        let i = 1;
        const values = this.values;

        function getValue() {
          values.forEach((v) => {
            if (v.value === 'value' + i) {
              i++;
              getValue();
            }
          });
          return i;
        }
        this.values.push(new OptionConstructor(getValue()));
      }
    },
    computed: {
      supportLang() {
        return this.$store.state.xFormConfigure.supportLang;
      },
    },
    mounted() {
      this.tempOptionsLength = this.values.length;
    }
  }
</script>
<style lang="less">
  .option-row {
    margin-bottom: 5px;
  }
</style>
