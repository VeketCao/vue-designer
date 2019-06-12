<template>
  <div>
    <m-row>
      <m-col span="12">
        <m-form-item
          :label="$t('itemProperty.precisionLabel')">
          <m-input-number
            v-model="item.options.precision"
            :max="10"
            :min="0">
          </m-input-number>
        </m-form-item>
      </m-col>
      <m-col span="12">
        <m-form-item
          :label="$t('itemProperty.stepLabel')">
          <m-input-number
            v-model="item.options.step">
          </m-input-number>
        </m-form-item>
      </m-col>
    </m-row>
    <m-form-item
      :label="$t('itemProperty.maxLabel')">
      <m-checkbox
        @on-change="minMaxChange('max', $event)"
        :value="item.options.max===null">
        {{$t('itemProperty.notControl')}}
      </m-checkbox>
      <m-input-number
        v-if="item.options.max!==null"
        v-model="item.options.max"
        :max="Infinity"
        :min="item.options.min">
      </m-input-number>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.minLabel')">
      <m-checkbox
        @on-change="minMaxChange('min', $event)"
        :value="item.options.min===null">
        {{$t('itemProperty.notControl')}}
      </m-checkbox>
      <m-input-number
        v-if="item.options.min!==null"
        v-model="item.options.min"
        :max="item.options.max"
        :min="-Infinity">
      </m-input-number>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.editableLabel')">
      <m-radio-group
        v-model="item.options.editable">
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
  export default {
    name: "NumberProperty",
    props: ['item', 'config'],
    mounted() {
    },
    data() {
      return {
        // 类型设置
        lang: this.$store.state.xUser.fdLangType,
      }
    },
    methods: {
      minMaxChange(minOrMax, value) {
        const defaultMin = 0;
        const defaultMax = 1000;
        if (minOrMax === 'min') {
          if (!value) {
            this.item.options.min = defaultMin;
            if (this.item.value < defaultMin) {
              this.item.value = defaultMin;
            }
          } else {
            this.item.options.min = null;
          }
        } else {
          if (!value) {
            this.item.options.max = defaultMax;
            if (this.item.value > defaultMax) {
              this.item.value = defaultMax;
            }
          } else {
            this.item.options.max = null;
          }
        }
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
    },
    watch: {
      currentLang(newValue) {
        this.lang = newValue;
      }
    },
  }
</script>
<style lang="less"></style>
