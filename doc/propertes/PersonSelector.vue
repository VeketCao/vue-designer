<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.staffSelectorSearchLimit')"
      prop="required">
      <m-col span="24">
        <m-radio-group :disabled="false" v-model="item.options.udType">
          <m-radio :disabled="false" :label="'3'" >
            {{$t('itemProperty.staffSelectorSearchLimitOption0')}}
          </m-radio>
          <m-radio :disabled="false" :label="'2'">
            {{$t('itemProperty.staffSelectorSearchLimitOption1')}}
          </m-radio>
          <m-radio :disabled="false" :label="'1'">
            {{$t('itemProperty.staffSelectorSearchLimitOption2')}}
          </m-radio>
        </m-radio-group>
      </m-col>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.staffSelectorIsSingle')"
      prop="required">
      <m-col span="24">
        <m-radio-group :disabled="false" v-model="item.options.single">
          <m-radio :disabled="false" :label="true">
            {{$t('itemProperty.yes')}}
          </m-radio>
          <m-radio :disabled="false" :label="false">
            {{$t('itemProperty.no')}}
          </m-radio>
        </m-radio-group>
      </m-col>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.staffSelectorOnlyFSearch')"
      prop="required">
      <m-col span="24">
        <m-radio-group :disabled="false" v-model="item.options.onlyFsearch">
          <m-radio :disabled="false" :label="true">
            {{$t('itemProperty.yes')}}
          </m-radio>
          <m-radio :disabled="false" :label="false">
            {{$t('itemProperty.no')}}
          </m-radio>
        </m-radio-group>
      </m-col>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.staffSelectorAutoFillCurrentUser')"
      prop="required">
      <m-col span="24">
        <m-radio-group :disabled="false" v-model="item.options.autoFillCurrentUser">
          <m-radio :disabled="false" :label="true">
            {{$t('itemProperty.yes')}}
          </m-radio>
          <m-radio :disabled="false" :label="false">
            {{$t('itemProperty.no')}}
          </m-radio>
        </m-radio-group>
      </m-col>
    </m-form-item>
  </div>
</template>
<script>
  export default {
    name: "PersonSelectorProperty",
    props: {
      item:{
        type:Object,
        defualt: undefined,
        required: false,
      }
    },
    data() {
      return {
      }
    },

  }
</script>
<style lang="less">
</style>
