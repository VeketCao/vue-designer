<template>
  <div>
    <m-form-item
      v-if="item.type === 'datePicker'"
      :label="$t('itemProperty.autoFillCurrentDate')">
      <m-radio-group
        v-model="item.options.autoFillCurrentDate">
        <m-radio :label="true">
          {{$t('common.yes')}}
        </m-radio>
        <m-radio :label="false">
          {{$t('common.no')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <m-form-item
      :label="$t('itemProperty.rangeConfig')">
      <m-radio-group
        v-model="item.options.minMax.type">
        <m-radio label="none">
          {{$t('itemProperty.noLimit')}}
        </m-radio>
        <m-radio label="static">
          {{$t('itemProperty.staticRange')}}
        </m-radio>
        <m-radio label="dynamic">
          {{$t('itemProperty.dynamicRange')}}
        </m-radio>
      </m-radio-group>
    </m-form-item>
    <template v-if="item.options.minMax.type === 'static'">
      <m-form-item
        :label="$t('itemProperty.startDate')">
        <m-date-picker
          type="date"
          v-model="item.options.minMax.static.min"
          :placeholder="$t('itemProperty.startDate')">
        </m-date-picker>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.endDate')">
        <m-date-picker
          type="date"
          v-model="item.options.minMax.static.max"
          :placeholder="$t('itemProperty.endDate')">
        </m-date-picker>
      </m-form-item>
    </template>
    <template v-if="item.options.minMax.type === 'dynamic'">
      <m-form-item
        :label="$t('itemProperty.beforeCurrentDate')">
        <div class="m-row">
          <div class="m-col m-col-span-8">
            <m-checkbox
              :value="item.options.minMax.dynamic.before === 999999999"
              @on-change="$event ? item.options.minMax.dynamic.before = 999999999 : item.options.minMax.dynamic.before = 1">
              {{$t('itemProperty.noLimit')}}
            </m-checkbox>
          </div>
          <template v-if="item.options.minMax.dynamic.before !== 999999999">
            <div class="m-col m-col-span-8">
              <m-input-number
                v-model="item.options.minMax.dynamic.before"
                :step="1">
              </m-input-number>
            </div>
            <div class="m-col m-col-span-8">
              <Select
                v-model="item.options.minMax.dynamic.beforeUnit">
                <Option
                  v-for="c in unitOptions"
                  :value="c.value"
                  :disabled="c.disabled"
                  :label="c.label[$lang]"
                  :key="c.label[$lang]">
                  {{c.label[$lang]}}
                </Option>
              </Select>
            </div>
          </template>
        </div>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.afterCurrentDate')">
        <div class="m-row">
          <div class="m-col m-col-span-8">
            <m-checkbox
              :value="item.options.minMax.dynamic.after === 999999999"
              @on-change="$event ? item.options.minMax.dynamic.after = 999999999 : item.options.minMax.dynamic.after = 1">
            {{$t('itemProperty.noLimit')}}
            </m-checkbox>
          </div>
          <template v-if="item.options.minMax.dynamic.after !== 999999999">
            <div class="m-col m-col-span-8">
              <m-input-number
                v-model="item.options.minMax.dynamic.after"
                :step="1">
              </m-input-number>
            </div>
            <div class="m-col m-col-span-8">
              <Select
                v-model="item.options.minMax.dynamic.afterUnit">
                <Option
                  v-for="c in unitOptions"
                  :value="c.value"
                  :disabled="c.disabled"
                  :key="c.label[$lang]"
                  :label="c.label[$lang]">
                  {{c.label[$lang]}}
                </Option>
              </Select>
            </div>
          </template>
        </div>
      </m-form-item>
    </template>
    <m-form-item
      :label="$t('itemProperty.typeLabel')">
      <Select
        v-if="item.options.type!=='daterange'&&item.options.type!=='datetimerange'&&item.options.type!=='timerange'"
        v-model="item.options.type"
        @on-change="typeChange">
        <Option
          v-for="c in typeOptions"
          :value="c.value"
          :label="c.label[$lang]"
          :key="c.label[$lang]">
          {{c.label[$lang]}}
        </Option>
      </Select>
      <Select
        v-else
        v-model="item.options.type"
        @on-change="rangeTypeChange">
        <Option
          v-for="c in rangeTypeOptions"
          :value="c.value"
          :label="c.label[$lang]"
          :key="c.label[$lang]">
          {{c.label[$lang]}}
        </Option>
      </Select>
    </m-form-item>
  </div>
</template>
<script>
  const {
    lang: {
      formDesigner: {
        FormDesignerStaticLang,
      }
    },
  } = MSECORE;
  export default {
    name: "DatePickerProperty",
    props: ['item'],
    data() {
      return {
        unitOptions: [
          {
            value: 'day',
            label: FormDesignerStaticLang.common.day,
          },
          {
            value: 'week',
            label: FormDesignerStaticLang.common.week,
          },
          {
            value: 'month',
            label: FormDesignerStaticLang.common.month,
          },
          {
            value: 'year',
            label: FormDesignerStaticLang.common.year,
          },
        ],
        rangeTypeOptions:[
          {
            value: 'timerange',
            label: FormDesignerStaticLang.common.time,
          },
          {
            value: 'daterange',
            label: FormDesignerStaticLang.common.date,
          },
          {
            value: 'datetimerange',
            label: FormDesignerStaticLang.common.datetime,
          },
        ],
        typeOptions: [
          {
            value: 'time',
            label: FormDesignerStaticLang.common.time,
          },
          {
            value: 'date',
            label: FormDesignerStaticLang.common.date,
          },
          {
            value: 'datetime',
            label: FormDesignerStaticLang.common.datetime,
          },
          {
            value: 'year',
            label: FormDesignerStaticLang.common.year,
          },
          {
            value: 'month',
            label: FormDesignerStaticLang.common.month,
          },

        ],
      }
    },
    methods:{
      typeChange(_res){
        switch(_res){
          case "time":
            this.item.options.format="HH:mm:ss";
            break;
          case "date":
            this.item.options.format="yyyy-MM-dd";
            break;
          case "datetime":
            this.item.options.format="yyyy-MM-dd HH:mm:ss";
            break;
          case "year":
            this.item.options.format="yyyy";
            break;
          case "month":
            this.item.options.format="MM";
            break;
        }
      },
      rangeTypeChange(_res){
        switch(_res){
          case "timerange":
            this.item.options.format="HH:mm:ss";
            break;
          case "daterange":
            this.item.options.format="yyyy-MM-dd";
            break;
          case "datetimerange":
            this.item.options.format="yyyy-MM-dd HH:mm:ss";
            break;
        }
      }
    }
  }
</script>
<style lang="less"></style>
