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
        class="inner-modal-container"
        v-else
        ref="mapData"
        :model="mapData"
        label-position="top">
        <m-row
          v-for="(rule, index) in mapData.items"
          :gutter="20">
          <m-col span="8">
            <m-form-item
              :label="$t('itemProperty.dataServiceValue')">
              <Select
                :transfer="true"
                v-model="rule.value">
                <Option
                  v-for="v in optionsList"
                  :key="v.label[currentLang]"
                  :value="v.key">
                  <span>{{v.label[currentLang]}}</span>
                </Option>
              </Select>
            </m-form-item>
          </m-col>
          <m-col span="8">
            <m-form-item :label="$t('itemProperty.dataServiceCtrls')">
              <m-checkbox-group v-model="rule.targets">
                <m-checkbox
                  v-for="x in otherItems"
                  :disabled="calcItemDisabled(x.id, index)"
                  :key="x.id"
                  :label="x.id">
                  {{x.label}}
                </m-checkbox>
              </m-checkbox-group>
            </m-form-item>
          </m-col>
          <m-col :span="4">
            <m-form-item :label="$t('itemProperty.dataServiceLocked')">
              <Checkbox v-model="rule.locked">{{$t('common.yes')}}</Checkbox>
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
  const {
    services: {
      formDesigner: {
        config: {
          staffSelectorMapConfig,
        }
      }
    }
  } = MSECORE;

  export default {
    name: "MapEditor",
    props: {
      value: {
        type: Array,
        default: ()=>[],
      },
      values: {
        type: Array,
        default: ()=>[],
      },
      item:{
        type:Object,
        default:()=>{}
      },
      items:{
        type:Array,
        defualt:()=>[]
      },
      mainTable:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {
        visible: false,
        lang: this.$store.state.xUser.fdLangType,
        mapData: {
          items: [],
        },
        otherItems: [],
        optionsList: staffSelectorMapConfig,
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

        if(this.mainTable){
          this.$store.state.xFormData.items.forEach(item => {
            if (item.id !== this.$store.state.xFormData.activeItemId && item.title && item.title[this.currentLang] && item.id && item.type==="text") {
              this.otherItems.push({
                id: item.id,
                label: item.title[this.currentLang],
              });
            }
          });
        }else{

          this.items.forEach((val)=>{
            if(val.id !== this.item.id && val.type==='text'){
              this.otherItems.push({
                id: val.id,
                label: val.title[this.currentLang],
              });
            }
          })
        }

      },
      calcItemDisabled(id, index) {
        let result = false;
        if(!this.mapData.items[index].value ||this.mapData.items[index].value==''){
          return true;
        }
        this.mapData.items.forEach((val, ikey)=>{
          if(val.targets&&val.targets.length>0 && index!==ikey){
            let tmp_targets = []
            val.targets.forEach(tval=>{
              tmp_targets.push(tval);
            })
            if(tmp_targets.includes(id)){
              result = true;
            }
          }
        })
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
          match: '===',
          targets: [],
          locked: false,
        });
      },
      deleteItem(index) {
        this.mapData.items.splice(index, 1);
      },
      confirm() {
        let flag = true;
        if(this.mapData.items.length>0){
          for(let i=0;i<this.mapData.items.length;i++){
            if(typeof(this.mapData.items[i].value)!=='string' || this.mapData.items[i].targets.length<=0){
              this.$Message.error(this.$t('msg.ruleDataError'));
              flag = false;
              break;
            }
          }
        }
        if(flag === true){
          this.$emit('input', this.mapData.items);
          this.visible = false;
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
