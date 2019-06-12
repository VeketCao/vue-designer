<template>
  <div>
    <!--添加字段-->
    <Modal
      v-model="fieldModal"
      :title="$t('itemProperty.field')">
      <m-form
        :rules="fieldFormRules"
        ref="fieldFormRef"
        :model="fieldForm"
        :label-width="80"
        @on-cancel="handleCancel"
        label-position="right">
        <m-form-item
          :label="$t('itemProperty.field')"
          prop="field">
          <m-input
            ref="fieldInput"
            v-model.trim="fieldForm.field"
            style="width:200px"
            @keydown.native.enter.stop.prevent="addField"/>
        </m-form-item>
      </m-form>
      <div slot="footer">
        <iMButton
          type="ghost"
          @click.stop="handleCancel">
          {{$t('itemProperty.fieldBtnCancel')}}
        </iMButton>
        <iMButton
          type="primary"
          @click.native.stop.prevent="addField">
          {{$t('itemProperty.fieldBtnSure')}}
        </iMButton>
      </div>
    </Modal>
    <m-form-item
      :label="$t('itemProperty.field')"
      prop="field"
      :rules="[{required: true, message: $t('itemProperty.fieldRequired')}]"
      v-if="typeof(item.field) === 'string'">
      <Select
        :placeholder="$t('itemProperty.fieldPleaseChoose')"
        :multiple="false"
        :disabled="realFields().length === 0"
        v-model="item.field">
        <Option
          v-for="(c,index) in fields"
          v-if="fieldShow(c.value)"
          :value="c.value"
          :label="c.value"
          :disabled="fieldSelected(c.value)"
          :key="index">
          <span>{{c.value}}</span>
          <span
            style="float:right;color:#ccc">
            {{c.label}}
          </span>
          <span
            v-if="fieldSelected(c.value)">
            {{$t('itemProperty.used')}}
          </span>
        </Option>
      </Select>
      <a @click="openDialog">
        {{$t('itemProperty.addField')}}
      </a>
    </m-form-item>
    <!-- 当 item.field 为数组对象（key-value对的时候） -->
    <ul class="fields-list" v-if="typeof(item.field) === 'object' && item.field.length>0">
      <li v-for="(fitem, fkey) in item.field">
        <m-form-item
          :label="fitem[0][lang]"
          :prop="'field[' + fkey + '][1]'"
          :rules="[{required: true, message: $t('itemProperty.fieldRequired')}]">
          <Select
            :placeholder="$t('itemProperty.fieldPleaseChoose')"
            :multiple="false"
            :disabled="realFields().length === 0"
            v-model="fitem[1]">
            <Option
              v-for="(c,index) in fields"
              v-if="fieldShow(c.value)"
              :value="c.value"
              :label="c.value"
              :disabled="fieldSelected(c.value)"
              :key="index">
              <span>{{c.value}}</span>
              <span v-if="fieldSelected(c.value)">
                {{$t('itemProperty.used')}}
              </span>
              <span style="float:right;color:#ccc">
                {{c.label}}
              </span>
            </Option>
          </Select>
        </m-form-item>
      </li>
      <li>
        <a @click="openDialog">
          {{$t('itemProperty.addField')}}
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
  import {calcFieldSelected} from "src/module/formdesigner/services/common/fields";
  import cloneDeep from 'lodash.clonedeep';

  const {
    utils: {
      util: {
        valueExistInArray
      }
    },
    lang: {
      lang: {
        SupportLang,
      },
    }
  } = MSECORE;

  export default {
    name: "FieldProperty",
    props: {
      items: {
        type: Array,
        default: undefined,
        required: false,
      },
      item: {
        type: Object,
        default: undefined,
        required: false,
      },
      sourceFields: {
        type: Array,
        default: undefined,
        required: false,
      },
      currentLang: {
        type: String,
        default: undefined,
        required: false,
      },
      disabledFieldValues: {
        type: Array,
        default: [],
      },
    },
    watch: {
      fieldModal(_nv) {
        if (_nv == false) {
          this.$refs.fieldFormRef.resetFields();
        }
      },
      currentLang(newVal) {
        this.lang = newVal;
      },
      sourceFields(newVal) {
        this.fields = this.sourceFields;
      },
    },
    data() {
      return {
        fieldModal: false,
        fieldForm: {
          field: ''
        },
        fields: [],
        lang: SupportLang[0].value,
        fieldFormRules: {
          field: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error(this.$t('itemProperty.fieldNotEmpty')));
              } else if (!/^(?![0-9_])[a-zA-Z0-9_]{2,30}$/.test(value)) {
                callback(new Error(this.$t('itemProperty.fieldNameLimit')));
              } else if (valueExistInArray(this.fields, 'value', value)) {
                callback(new Error(this.$t('itemProperty.fieldAreadyExist')));
              } else if (this.disabledFieldValues.indexOf(value.toUpperCase()) >= 0) {
                callback(new Error(this.$t('itemProperty.fieldUnCorrect')));
              } else {
                callback();
              }
            }
          }]
        },
      }
    },
    mounted() {
      this.lang = this.currentLang;
      this.fields = this.sourceFields;
    },
    methods: {
      openDialog() {
        this.fieldModal = true
      },
      addField() {
        this.$refs['fieldFormRef'].validate(valid => {
          if (valid) {
            const newField = {
              value: this.fieldForm.field,
              label: "",
              fdIsPrimary: 0,
              max: 255,
            };
            if (typeof(this.item.field) === 'string') {
              this.item.field = newField.value;
            }
            let _array = cloneDeep(this.fields);
            _array.push(newField);
            this.fields = _array;
            this.$emit('fieldsChanges', this.fields);
            this.fieldModal = false;
          }
        });
      },
      handleCancel() {
        this.fieldModal = false;
      },
      // 计算
      fieldSelected(v) {
        return calcFieldSelected(v, this.items);
      },
      fieldShow(v) {
        return this.disabledFieldValues.indexOf(v) === -1;
      },
      realFields() {
        return this.fields.filter(v => {
          return this.disabledFieldValues.indexOf(v.value) === -1;
        });
      },
    },
  }
</script>
<style lang="less">
  .fields-list {
    margin-bottom: 24px;
  }
</style>
