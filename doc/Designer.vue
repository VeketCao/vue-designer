<template src="./Designer.html">
</template>
<script>
  import {mapState, mapMutations, mapGetters, mapActions} from 'vuex';
  import {formTypes} from 'src/module/formdesigner/services/designer/form-types';
  import {fdItemActionMap} from "src/module/formdesigner/services/designer/item-actions-map";
  import ItemProperty from './ItemProperty';
  import Vue from 'vue';
  import TextBlock from './TextBlock';
  import {
    fdConfig,
    itemHandlerShowLogic,
    rowHandlerShowLogic,
    typeAllowed,
    getItemById,
    targetRowAvaliable,
    targetToggleClass,
  } from "src/module/formdesigner/services/designer/logic";

  import VueDynamicLoader from 'vue-dynamic-loader';
  import cloneDeep from 'lodash.clonedeep';
  import JsDynamicLoader from 'js-dynamic-loader';

  const {
    utils: {
      dom: {
        removeClass,
        hasClass,
        addClass,
      },
      methods: {
        transferLangToText,
      }
    },
    services: {
      formDesigner: {
        service: {
          calcComponents,
        },
        dataHelper: {
          getOptionsValuesService,
          getOptionsValuesWithGroupService,
          calcDateOptions,
          calcStartDate,
        },
      },
    }
  } = MSECORE;
  import {EStep} from "src/module/formdesigner/vuex/enums";

  export default {
    name: "Designer",
    data() {
      return {
        Vue,
        MSECORE,
        currentUser: localStorage.user ? JSON.parse(localStorage.user) : null,
        selectKey: 0,
        formConfig: {
          labelWidth: 100,
          labelPosition: 'right',
        },
        lang: this.$store.state.xUser.fdLangType,
        handlers: {
          row: ['top', 'bottom'],
          item: ['left', 'right']
        },
        formTypes: null,
        allowTypeDrag: true,
        allowDrag: true,
        deleteIcon: 'trash-a',
        tempType: '',
        dateOptions: calcDateOptions,
        calcStartDate: calcStartDate,
      };
    },
    components: {
      VueDynamicLoader,
      ItemProperty,
      'text-block': TextBlock,
      uploadFile: () => JsDynamicLoader(Vue.prototype.$asyncComponent('uploadFile'))
    },
    computed: {
      ...mapState({
        xFormCommon(state) {
          return state.xFormCommon;
        }
      }),
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
      ...mapGetters({
        formData: 'getFormData',
        activeItemId: 'getActiveItemId',
        activeItem: 'getActiveItem',
        formDataValid: 'validateFormData',
        richTextLang: 'getLangRichTextFormat',
        formTitle: 'getFormTitle',
        formDesc: 'getFormDesc',
        maxRowNumber: 'getMaxRowNumber',
      }),
      fdRelId() {
        return this.$store.state.xFormConfigure.fdRelId
      },
    },
    watch: {
      currentLang(newValue) {
        this.lang = newValue;
      },
    },
    methods: {
      // vuex
      ...mapMutations({
        xAppend: 'fdcAppendItem',
        xDelete: 'fdcDeleteItem',
        xDeleteRow: 'fdcDeleteRow',
        xAddNewRow: 'fdcAddNewRow',
        xCopyItemToRow: 'fdcCopyItemToRow',
        xItemToRow: 'fdcItemToRow',
        xVerticalRowOrder: 'fdcVerticalRowOrder',
        xAddNewItem: 'fdcAddNewItemLogic',
        xCopyExistItem: 'fdcCopyExistItem',
        xAddExistItem: 'fdcAddExistItem',
        xSetActiveItemId: 'fdcSetActiveItemId',
        xUpdateItemValue: 'fdcUpdateItemValue',
        xRemoveItemDataServieMap: 'fdcRemoveItemDataServieMap',
      }),
      ...mapActions({
        xEventHelper: 'fdaEventHelper',
      }),
      getRendererUrl(url) {
        if (url.substr(0, 4) === 'http') {
          return url;
        }
        return this.$asyncComponent(url);
      },
      personChange(res, _objs) {
        this.updateItemValue(_objs.resources.id, res)
      },
      enableDrag() {
        this.allowDrag = false;
      },
      disableDrag() {
        this.allowDrag = true;
      },
      actionCallback(msg) {
        if (!msg || !msg.type) {
          return;
        }
        switch (msg.type) {
          case 'success':
            this.$Message.success(msg.content);
            break;
          case 'error':
            this.$Message.error(msg.content);
            break;
          case 'info':
            this.$Message.info(msg.content);
            break;
        }
      },
      // 容器是否处于激活状态
      activeContainer() {
        addClass(this.$refs.formsContainer, 'active');
      },
      deActiveContainer() {
        removeClass(this.$refs.formsContainer, 'active');
      },
      // 组件类型拖拽
      typeDragStart(ev, type) {
        this.tempType = fdItemActionMap.addNewType;
        const {target, dataTransfer} = ev;
        dataTransfer.setData('text', type);
        addClass(target, 'moving');
        this.activeContainer();
      },
      typeDragEnd(ev) {
        this.tempType = '';
        const {target} = ev;
        removeClass(target, 'moving');
        this.deActiveContainer();
      },
      // 删除面板
      deletePanelActive() {
        addClass(this.$refs.deletePanel, 'active');
      },
      deletePanelDeActive() {
        removeClass(this.$refs.deletePanel, 'active');
      },
      deletePanelDragEnter() {
        addClass(this.$refs.deletePanel, 'drag-over');
        this.deleteIcon = 'trash-b';
      },
      deletePanelDragLeave() {
        removeClass(this.$refs.deletePanel, 'drag-over');
        this.deleteIcon = 'trash-a';
      },
      deletePanelDragOver(ev) {
      },
      deletePanelDrop(ev) {

        removeClass(this.$refs.deletePanel, 'drag-over');
        this.deleteIcon = 'trash-a';
        const {dataTransfer} = ev;
        const transferData = dataTransfer.getData('text');

        if (!typeAllowed(this.tempType, fdConfig.deletePanelAllowedTypes)) {
          return;
        }
        if (this.tempType === fdItemActionMap.dragItem) {
          // 删除单个项
          if (this.detectLowerRelated(this.formData, transferData)) {
            this.$Modal.confirm({
              title: this.$t('designer.deleteTitle'),
              content: this.$t('designer.deleteElContent'),
              onOk: () => {
                this.xDelete(transferData);
              },
            });
            return;
          }
          let dsRelated = this.detectDataServiceRelated(this.formData, transferData);
          if (dsRelated.flag) {
            this.$Modal.confirm({
              title: this.$t('designer.deleteTitle'),
              content: this.$t('designer.deleteElDSContent'),
              onOk: () => {
                this.xRemoveItemDataServieMap(dsRelated);
                this.xDelete(transferData);
              },
            });
            return;
          }
          this.xDelete(transferData);
        } else if (this.tempType === fdItemActionMap.dragRow) {
          // 删除整一行
          if (this.detectRowLowerRelated(this.formData, transferData)) {
            this.$Modal.confirm({
              title: this.$t('designer.deleteTitle'),
              content: this.$t('designer.deleteRowContent'),
              onOk: () => {
                this.xDeleteRow(Number(transferData));
              },
            });

            return;
          }
          let dsRowRelated = this.detectRowDataServiceRelated(this.formData, transferData);
          if (dsRowRelated.flag) {
            this.$Modal.confirm({
              title: this.$t('designer.deleteTitle'),
              content: this.$t('designer.deleteRowDSContent'),
              onOk: () => {
                this.xRemoveItemDataServieMap(dsRowRelated.dsRelated);
                this.xDeleteRow(Number(transferData));
              },
            });
            return;
          }
          this.xDeleteRow(Number(transferData));
        }
      },
      // 表单容器
      formsContainerDragEnter(ev) {
        const {target} = ev;
        if (typeAllowed(this.tempType, fdConfig.formContainerAllowedTypes)) {
          addClass(target, 'drag-enter');
          this.activeContainer();
        }
      },
      formsContainerDragLeave(ev) {
        const {target} = ev;
        if (typeAllowed(this.tempType, fdConfig.formContainerAllowedTypes)) {
          removeClass(target, 'drag-enter');
        }
      },
      formsContainerDragOver(ev) {
      },
      formsContainerDrop(ev) {
        const {target, dataTransfer} = ev;
        if (!typeAllowed(this.tempType, fdConfig.formContainerAllowedTypes) || hasClass(target, 'item-handler') || hasClass(target, 'row-handler')) {
          return;
        }
        removeClass(target, 'drag-enter');
        this.deActiveContainer();
        const newType = dataTransfer.getData('text');
        if (!newType) {
          return;
        }
        this.xAppend({
          type: newType,
          callback: this.actionCallback
        });
      },
      // 表单行拖拽
      formRowDragStart(ev, rowIndex) {
        const {dataTransfer, target} = ev;
        if (!hasClass(target, 'row-container')) {
          return;
        }
        this.tempType = fdItemActionMap.dragRow;
        dataTransfer.setData('text', String(rowIndex));
        this.deletePanelActive();
        addClass(target, 'moving');
        this.activeContainer();
      },
      formRowDragEnd(ev) {
        this.tempType = '';
        const {target} = ev;
        this.deletePanelDeActive();
        removeClass(target, 'moving');
        this.deActiveContainer();
      },
      // 表单元素拖拽
      formItemDragStart(ev, id) {
        const {dataTransfer, target} = ev;
        if (!hasClass(target, 'item-container')) {
          return;
        }
        this.tempType = fdItemActionMap.dragItem;
        this.deletePanelActive();
        dataTransfer.setData('text', id);
        addClass(target, 'moving');
        this.activeContainer();
      },
      formItemDragEnd(ev) {
        this.tempType = '';
        const {target} = ev;
        this.deletePanelDeActive();
        removeClass(target, 'moving');
        this.deActiveContainer();
      },
      // 横向感应器
      ifRowHandlerShowLogic(index, direction) {
        return rowHandlerShowLogic(this.formData.row, index, direction);
      },
      rowHandlerDragOver(ev) {
        targetToggleClass(ev, this.tempType, fdConfig.rowHandlerAllowedTypes, 'drag-over', true);
      },
      rowHandlerDragEnter(ev) {
      },
      rowHandlerDragLeave(ev) {
        targetToggleClass(ev, this.tempType, fdConfig.rowHandlerAllowedTypes, 'drag-over', false);
      },
      rowHandlerDrop(ev, rowIndex, direction) {
        const {dataTransfer} = ev;
        const transferData = dataTransfer.getData('text');
        const result = targetToggleClass(ev, this.tempType, fdConfig.rowHandlerAllowedTypes, 'drag-over', false);
        if (!result) {
          return;
        }
        if (this.tempType === fdItemActionMap.addNewType) {
          this.xAddNewRow({
            targetRowIndex: rowIndex,
            type: transferData,
            direction,
            callback: this.actionCallback
          });
        } else if (this.tempType === fdItemActionMap.dragItem) {
          if (ev.metaKey) {
            this.xCopyItemToRow({
              itemId: transferData,
              targetRowIndex: rowIndex,
              direction
            });
          } else {
            this.xItemToRow({
              itemId: transferData,
              targetRowIndex: rowIndex,
              direction
            });
          }
        } else if (this.tempType === fdItemActionMap.dragRow) {
          this.xVerticalRowOrder({
            targetRowIndex: rowIndex,
            fromRowIndex: Number(transferData),
            direction
          });
        }
      },
      // 纵向感应器
      ifItemHandlerShowLogic(id, direction) {
        return itemHandlerShowLogic(this.formData.items, id, direction);
      },
      itemHandlerDragEnter(ev) {
        targetToggleClass(ev, this.tempType, fdConfig.itemHandlerAllowedTypes, 'drag-over', true);
      },
      itemHandlerDragOver(ev) {
        targetToggleClass(ev, this.tempType, fdConfig.itemHandlerAllowedTypes, 'drag-over', true);
      },
      itemHandlerDragLeave(ev) {
        targetToggleClass(ev, this.tempType, fdConfig.itemHandlerAllowedTypes, 'drag-over', false);
      },
      itemHandlerDrop(ev, id, direction) {
        const {dataTransfer} = ev;
        const result = targetToggleClass(ev, this.tempType, fdConfig.itemHandlerAllowedTypes, 'drag-over', false);
        if (!result) {
          return;
        }
        if (this.tempType === fdItemActionMap.addNewType) {
          if (!targetRowAvaliable(this.formData, id)) {
            this.actionCallback({
              type: 'error',
              content: `每行最多只能放4个元素。`
            });
            return;
          }
          const newType = dataTransfer.getData('text');
          if (fdConfig.blockItemTypes.indexOf(newType) !== -1) {
            this.actionCallback({
              type: 'error',
              content: `类型为 ${newType} 的元素只允许独占一行`
            });
            return;
          }
          this.xAddNewItem({
            targetItemId: id,
            type: newType,
            direction,
            callback: this.actionCallback
          });
        } else if (this.tempType === fdItemActionMap.dragItem) {
          const fromItemId = dataTransfer.getData('text');
          if (fromItemId === id) {
            return;
          }
          if (!targetRowAvaliable(this.formData, id, fromItemId)) {
            this.actionCallback({
              type: 'error',
              content: `每行最多只能放4个元素。`
            });
          }
          const fromItem = getItemById(this.formData.items, fromItemId);
          if (fdConfig.blockItemTypes.indexOf(fromItem.type) !== -1) {
            this.actionCallback({
              type: 'error',
              content: `类型为 ${fromItem.type} 的元素只允许独占一行`
            });
            return;
          }
          if (ev.metaKey) {
            this.xCopyExistItem({
              fromId: fromItemId,
              targetId: id,
              direction
            });
          } else {
            this.xAddExistItem({
              fromId: fromItemId,
              targetId: id,
              direction
            });
          }
        }
      },
      getOptionsValues(options) {
        return getOptionsValuesService(options, this.formData.items);
      },
      getOptionsValuesWithGroup(options) {
        return getOptionsValuesWithGroupService(options, this.formData.items, null, this.currentLang);
      },
      // 设置激活条目
      setActiveItemId(id) {
        this.xSetActiveItemId(id);
      },
      // 更改 item value
      updateItemValue(id, value) {
        this.xEventHelper({
          type: 'valueChanged',
          itemId: id,
          value,
        }).then();
        // this.xUpdateItemValue({id, value});
      },
      // 数据格式转换
      calcItem(item) {
        const newItem = cloneDeep(transferLangToText(item, this.lang));
        newItem.disabled = true;
        return newItem;
      },
      // 检测是否存在动态关联赋值
      detectDataServiceRelated(_formData, _relatedId) {
        let flag = false;
        let relateItemId = null;
        let relateItemMapKey = null;
        let itemKey = null;

        if (_formData.items && _formData.items.length > 0) {
          for (let i = 0; i < _formData.items.length; i++) {
            if (_formData.items[i].id !== _relatedId
              && _formData.items[i].type == "personSelector"
              && _formData.items[i].options.dataService
              && _formData.items[i].options.dataService.active
              && _formData.items[i].options.dataService.map
              && _formData.items[i].options.dataService.map.length > 0) {
              _formData.items[i].options.dataService.map.map((val, key) => {
                if (val.targets.includes(_relatedId)) {
                  flag = true;
                  relateItemMapKey = key;
                  relateItemId = _formData.items[i].id;
                  itemKey = i;
                }
              })
            }
          }
        }
        let result = {flag, relateItemId, relateItemMapKey, itemKey};

        return result;
      },
      detectRowDataServiceRelated(_formData, _rowId) {
        let flag = false;
        let dsRelated = null;
        if (_formData.items && _formData.items.length > 0) {
          for (let i = 0; i < _formData.items.length; i++) {
            dsRelated = this.detectDataServiceRelated(_formData, _formData.items[i].id);
            if (_formData.items[i].layout.row == _rowId && dsRelated.flag) {
              flag = true;
              break;
            }
          }
        }
        return {flag, dsRelated};
      },
      // 检测是否有下级关联
      detectLowerRelated(_formData, _relatedId) {
        let flag = false;
        if (_formData.items && _formData.items.length > 0) {
          for (let i = 0; i < _formData.items.length; i++) {
            if (_formData.items[i].id != _relatedId) {
              if (_formData.items[i].type !== 'subform') {
                if (_formData.items[i].options.valuesType === 'dynamic' && _formData.items[i].options.dynamicConfig.relativeComponents && _formData.items[i].options.dynamicConfig.relativeComponents.value && _formData.items[i].options.dynamicConfig.relativeComponents.value == _relatedId) {
                  flag = true;
                  break;
                }
              } else {
                if (_formData.items[i].options.columns && _formData.items[i].options.columns.length > 0) {
                  let tmp_flag = false;
                  for (let j = 0; j < _formData.items[i].options.columns.length; j++) {
                    const tmp_item = _formData.items[i].options.columns[j];
                    if (tmp_item.options.valuesType === 'dynamic' && tmp_item.options.dynamicConfig.relativeComponents.value == _relatedId) {
                      tmp_flag = true;
                      break;
                    }
                  }
                  flag = tmp_flag;
                }
              }
            }
          }
        }
        return flag;
      },
      // 检测同一行内是否有下级关联
      detectRowLowerRelated(_formData, _rowId) {
        let flag = false;
        if (_formData.items && _formData.items.length > 0) {
          for (let i = 0; i < _formData.items.length; i++) {
            if (_formData.items[i].layout.row == _rowId && this.detectLowerRelated(_formData, _formData.items[i].id)) {
              flag = true;
              break;
            }
          }
        }
        return flag;
      },
      calcComponents,
    },
    mounted() {
      this.formTypes = formTypes;
      this.$store.commit('fcChangeStep', EStep.designer);
    },
    beforeRouteLeave(to, from, next) {
      if (to.path.indexOf('/d/configure') >= 0 || to.path.indexOf('/preview') >= 0 || this.formDataValid.validate) {
        next(true);
      } else {
        next(false);
        this.$Message.warning(this.$t('designer.designerDataError') + this.formDataValid.msg);
        this.setActiveItemId(this.formDataValid.ids[0]);
      }
    },
  };
</script>
<style lang="less" src="./Designer.less"></style>
