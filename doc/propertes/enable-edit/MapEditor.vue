<template>
  <div>
    <m-button
      type="primary"
      @click="edit()">
      {{value.length > 0 ? value.length + $t('itemProperty.showHideButtonRules') :
      $t('itemProperty.showHideButtonAdd')}}
    </m-button>
    <Modal
      v-model="visible"
      width="650"
      :title="$t('itemProperty.allowEditorTitle')"
      :ok-text="$t('common.confirm')"
      @on-ok="confirm"
      :cancel-text="$t('common.cancel')">
      <p v-if="mapData.items.length === 0">{{$t('itemProperty.allowNoRules')}}</p>
      <m-form
        v-else
        ref="mapData"
        class="inner-modal-container"
        :model="mapData"
        label-position="top">
        <m-row
          v-for="(rule, index) in mapData.items"
          :gutter="20">
          <m-col span="8">
            <m-form-item
              :label="$t('itemProperty.showHideCurrentValue')">
              <Select
                :transfer="true"
                :multiple="valueType === 'multiple'"
                v-model="rule.value">
                <Option
                  v-for="v in values"
                  :disabled="calcDisabled(v.value, rule.value)"
                  :value="v.value">
                  <span>{{v.label[currentLang]}}</span>
                </Option>
              </Select>
            </m-form-item>
          </m-col>
          <m-col span="12">
            <m-form-item :label="$t('itemProperty.allowDisFollowCtrls')">
              <m-checkbox-group v-model="rule.targets">
                <m-checkbox
                  v-for="x in otherItems"
                  :disabled="calcItemDisabled(x.id)"
                  :key="x.id"
                  :label="x.id">
                  {{x.label}}
                </m-checkbox>
              </m-checkbox-group>
            </m-form-item>
          </m-col>
          <m-col :span="4">
            <m-form-item :label="$t('itemProperty.showHideOperation')">
              <m-button
                type="error"
                @click="deleteItem(index)">
                {{$t('itemProperty.showHideDelete')}}
              </m-button>
            </m-form-item>
          </m-col>
        </m-row>
      </m-form>
      <div slot="footer">
        <m-row>
          <m-col
            span="12"
            class="text-left">
            <m-button
              type="success"
              :disabled="valueType !== 'multiple' && mapData.items.length >= values.length"
              icon="plus-round"
              @click="add()">
              {{$t('common.add')}}
            </m-button>
          </m-col>
          <m-col
            span="12">
            <m-button
              type="ghost"
              @click.stop="visible = false">
              {{$t('itemProperty.fieldBtnCancel')}}
            </m-button>
            <m-button
              type="primary"
              @click.native.stop.prevent="confirm">
              {{$t('itemProperty.fieldBtnSure')}}
            </m-button>
          </m-col>
        </m-row>
      </div>
    </Modal>
  </div>
</template>
<script>
  let tempItemIds = [];
  import cloneDeep from 'lodash.clonedeep';
  import {
    validateShowHideMap
  } from "src/module/formdesigner/services/designer/property";

  const {
    services: {
      formDesigner: {
        showHide: {
          itemIsSetShowHide,
        }
      }
    },
  } = MSECORE;

  export default {
    name: "MapEditor",
    props: {
      value: {
        type: Array,
        default: ()=>[],
      },
      items:{
        type:Array,
        default:()=>[]
      },
      item:{
        type:Object,
        default:null
      },
      values: {
        type: Array,
        default: ()=>[],
      },
      valueType: {
        type: String,
        default: 'single',
      },
    },
    data() {
      return {
        visible: false,
        lang: this.$store.state.xUser.fdLangType,
        mapData: {
          items: [],
        },
        otherItems: [],
      }
    },
    methods: {
      edit() {
        tempItemIds = [];
        this.mapData.items = cloneDeep(this.value);
        this.mapData.items.forEach(m => {
          const {targets} = m;
          if (targets && targets.length) {
            targets.forEach(t => {
              if (tempItemIds.indexOf(t) === -1) {
                tempItemIds.push(t);
              }
            });
          }
        });
        this.visible = true;
        this.otherItems = [];
        // console.log(this.items)
        this.items.map(val=>{
          if(val.id !== this.item.id){
            this.otherItems.push({
              id: val.id,
              label: val.title[this.currentLang],
            });
          }
        });
      },
      calcItemDisabled(id) {
        let result = false;
        const items = this.$store.state.xFormData.items;
        const activeItemId = this.$store.state.xFormData.activeItemId;
        items.forEach(item => {
          if (item.id === activeItemId) {
            return;
          }
          const itemResult = itemIsSetShowHide(item);
          if (itemResult.hasChild && itemResult.targets.indexOf(id) >= 0) {
            result = true;
          }
        });
        return result;
      },
      calcDisabled(value, currentValue) {
        let result = false;
        this.mapData.items.forEach(m => {
          if (m.value === value && currentValue !== value) {
            result = true;
          }
        });
        return result;
      },
      add() {
        this.mapData.items.push({
          value: this.valueType === 'single' ? '' : [],
          targets: [],
        });
      },
      deleteItem(index) {
        this.mapData.items.splice(index, 1);
      },
      confirm() {
        const result = validateShowHideMap(this.mapData.items);
        if (result) {
          this.$emit('input', this.mapData.items);
          this.$emit('on-change', {
            map: this.mapData.items,
          });
          this.mapData.items.forEach(m => {
            const {targets} = m;
            if (targets && targets.length) {
              targets.forEach(t => {
                const idInTempIndex = tempItemIds.indexOf(t);
                if (idInTempIndex >= 0) {
                  tempItemIds.splice(idInTempIndex, 1);
                }
              });
            }
          });
          if (tempItemIds.length) {
            this.$emit('unset-items', tempItemIds);
          }
          this.visible = false;
        } else {
          this.$Message.error(this.$t('msg.ruleDataError'));
        }
      },
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      }
    },
    watch: {
      currentLang(newLang) {
        this.lang = newLang;
      }
    },
  }
</script>
