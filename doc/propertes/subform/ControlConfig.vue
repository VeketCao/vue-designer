<template>
  <div>
    <m-form-item>
      <m-dropdown
        @on-click="addItem">
        <m-button
          type="primary">
          <i class="m-icon m-icon-plus"></i>
          <span>
          {{$t('itemProperty.subformAddControl')}}
        </span>
        </m-button>
        <m-dropdown-menu slot="list">
          <m-dropdown-item
            v-for="c in typesArray"
            :name="c.type">
            {{c.title[currentLang]}}
          </m-dropdown-item>
        </m-dropdown-menu>
      </m-dropdown>
    </m-form-item>
    <div class="margin-small-bottom organ-list">
      <draggable :list="item.options.columns" :options="{handle:'.organ-item-header',draggable:'.organ-item'}">
        <div @click.stop="openOrganBody($event, column)" v-for="(column, index) in item.options.columns" :key="column.id"
             class="organ-item as-toolbar ">
          <div class="cntr-row organ-item-header">
            <span class="pull-left organ-item-title">
              <i class="m-icon m-icon-arrow-right-b"></i>&nbsp;{{column.title[lang]}}</span>
            <a
              class="pull-right "
              @click.stop="delItem(index, column)">
              <Icon
                :size="16"
                type="trash-a"/>
            </a>
          </div>
          <div class="organ-item-body" @click.stop>
            <item-editor
              :key="tempKey"
              :offsetEnabled="item.options.rowDisplay === 'table'"
              :item="item"
              :column="column">
            </item-editor>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
  import itemEditor from './ItemEditor';
  import {allSubformTypes} from "src/module/formdesigner/services/designer/form-types";
  import cloneDeep from 'lodash.clonedeep';
  import draggable from 'vuedraggable';
  import {mapMutations} from 'vuex';

  const {
    services: {
      formDesigner: {
        formElements: {
          SubFormItemConstructor,
        },
      },
    },

    utils: {
      util: {
        uuid
      }
    }
  } = MSECORE;

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
        tempKey: 0,
        lang: this.$store.state.xUser.fdLangType,
        typesArray: allSubformTypes(),
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
      fdAppId() {
        return this.$store.state.xFormConfigure.fdAppId;
      },
    },
    mounted() {
      // console.dir(this.typesArray)
    },
    methods: {
      ...mapMutations({
        setActiveColumnId : 'fdcSetActiveSubformColumnId'
      }),
      openOrganBody($event, column) {
        const _parent = $event.target.offsetParent;
        const arrow_icon = _parent.getElementsByClassName('m-icon-arrow-right-b')[0];
        const organ_body = _parent.childNodes[2];

        if (organ_body.style.display == '' || organ_body.style.display == 'none') {
          let arrow_icons = document.getElementsByClassName('m-icon-arrow-right-b');
          arrow_icons = Array.from(arrow_icons);
          arrow_icons.forEach(value => {
            value.style.transform = "rotate(0deg)"
          });
          let item_bodies = document.getElementsByClassName('organ-item-body')
          item_bodies = Array.from(item_bodies);
          item_bodies.forEach(value => {
            value.style.display = 'none';
          });

          arrow_icon.style.transform = "rotate(90deg)";
          organ_body.style.display = 'block';
          this.setActiveColumnId({id: column.id});
        } else {
          arrow_icon.style.transform = "rotate(0deg)";
          organ_body.style.display = 'none';
          this.setActiveColumnId({id: ''});
        }
        this.tempKey++;
      },
      addItem(type) {
        const item = cloneDeep(new SubFormItemConstructor(type));
        let nField = `fd_sub_${type}_${uuid(4)}`;
        item.field = nField;
        this.item.options.columns.push(item);
        this.item.options.fields.push({
          value: nField,
          label: "",
          fdIsPrimary: 0,
          max: 255,
        });
      },
      delField(fieldValue){
        this.item.options.fields.forEach((val, key)=>{
          if(fieldValue == val.value){
            this.item.options.fields.splice(key, 1);
            return;
          }
        })
      },
      delItem(index, column) {
        //判断是否有联动赋值
        if(column.type === 'text'){
          let can_delete = true;
          this.item.options.columns.forEach((vitem, vkey)=>{
            if(vitem.type === 'personSelector' && vitem.options.dataService && vitem.options.dataService.map && vitem.options.dataService.map.length>0){
              vitem.options.dataService.map.forEach((mitem, mkey)=>{
                if(mitem.targets.includes(column.id)){
                  can_delete = false;
                  this.$Modal.confirm({
                    title:this.$t('itemProperty.description'),
                    content:this.$t('itemProperty.dataServiceDelLink'),
                    onOk:()=>{

                      vitem.options.dataService.map.splice(mkey, 1);
                      this.delField(this.item.options.columns[index].field)
                      this.item.options.columns.splice(index, 1);

                    }
                  })
                }
              })
            }
          })
          if(can_delete){
            this.delField(this.item.options.columns[index].field)
            this.item.options.columns.splice(index, 1);
          }
        }else{
          this.delField(this.item.options.columns[index].field)
          this.item.options.columns.splice(index, 1);
        }
      }
    },
    components: {
      draggable,
      itemEditor,
    },
    watch: {
      currentLang(newValue) {
        this.lang = newValue;
      },
    },
  };

</script>
<style scoped lang="less">
  .cntr-row {
    *zoom: 1;
  }

  .cntr-row:before,
  .cntr-row:after {
    display: table;
    content: " ";
  }

  .cntr-row:after {
    clear: both;
  }

  .organ-list {
    border: 1px solid #d7dde4;
  }

  .organ-item {

    color: #666;
    cursor: pointer;
    position: relative;
    border-top: 1px solid #d7dde4;
    background-color: #f7f7f7;
  }

  .organ-item:first-child {
    border-top: none;
  }

  .organ-item-header {
    padding-left: 15px;
    padding-right: 15px;
    height: 38px;
    line-height: 38px;
  }
  .organ-item-title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80%;
  }

  .organ-item-body {
    overflow: inherit;
    display: none;
    color: #657180;
    padding: 16px 16px 1px 16px;
    background-color: #fff;
  }

  .margin-small-top {
    margin-top: 10px;
  }

  .margin-small-bottom {
    margin-bottom: 10px;
  }
</style>
