<template>
  <div>
    <m-form-item
      v-if="!options.modelLock && fdDataModuleId">
      <MButtonGroup>
        <MButton
          @click="changeModelType('forward')"
          :type="options.modelType === 'forward' ? 'success' : 'default'">
          {{$t('configure.forward')}}
        </MButton>
        <MButton
          @click="changeModelType('reverse')"
          :type="options.modelType === 'reverse' ? 'success' : 'default'">
          {{$t('configure.reverse')}}
        </MButton>
      </MButtonGroup>
    </m-form-item>
    <!-- 数据建模方向 -->
    <template v-if="options.modelType === 'forward'">
      <m-form-item
        :label="$t('itemProperty.subformSubmodelName')"
        prop="options.childModelInfo.childModelName"
        :rules="[{required: true, message: $t('itemProperty.subformValidateModelName'), tirgger: 'blur'}]">
        <m-input
          :disabled="options.modelLock"
          v-model="options.childModelInfo.childModelName"
          :placeholder="$t('itemProperty.subformSubmodelName')">
        </m-input>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.subformSubmodelTableName')"
        prop="options.childModelInfo.childTableName"
        :rules="[{required: true, message: $t('itemProperty.subformValidateTableName'), tirgger: 'blur'}]">
        <m-input
          :disabled="options.modelLock"
          v-model="options.childModelInfo.childTableName"
          :placeholder="$t('itemProperty.subformSubmodelTableName')">
        </m-input>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.subformSubmodelKey')"
        prop="options.childModelInfo.primaryKey"
        :rules="[{required: true, message: $t('itemProperty.subformValidateModelKey'), tirgger: 'blur'}]">
        <m-input
          :disabled="options.modelLock"
          v-model="options.childModelInfo.primaryKey"
          :placeholder="$t('itemProperty.subformSubmodelKey')">
        </m-input>
      </m-form-item>
      <m-form-item
        :label="$t('itemProperty.subformSubmodelForeignName')"
        prop="options.childModelInfo.foreignKey"
        :rules="[{required: true, message: $t('itemProperty.subformValidateForeignName'), tirgger: 'blur'}]">
        <m-input
          :disabled="options.modelLock"
          v-model="options.childModelInfo.foreignKey"
          :placeholder="$t('itemProperty.subformSubmodelForeignName')">
        </m-input>
      </m-form-item>
    </template>
    <template v-else>
      <m-form-item
        :label="$t('itemProperty.subformChooseReverseModel')">
        <Select
          :disabled="options.modelLock || options.reverseModelList.length===0"
          @on-change="subformModelChanged"
          v-model="options.reverseModelFdId">
          <Option
            v-for="item in options.reverseModelList"
            :disabled="modelValueDisabled(item.fdRequestName)"
            :value="item.fdId"
            :key="item.fdId">
            <span>{{ item.fdName }}</span>
            <span
              v-if="modelValueDisabled(item.fdRequestName)">
            {{$t('itemProperty.used')}}
          </span>
          </Option>
        </Select>
      </m-form-item>
      <!-- 接口设置 -->
      <m-form-item
        v-if="options.interfaceList.add.list.length"
        :label="$t('configure.addNew')">
        <Select
          v-model="options.interfaceList.add.code">
          <Option
            v-for="item in options.interfaceList.add.list"
            :value="item.fdInterfaceCode"
            :key="item.fdInterfaceCode">
            {{ item.fdInterfaceCode }}
          </Option>
        </Select>
      </m-form-item>
      <m-form-item
        v-if="options.interfaceList.update.list.length"
        :label="$t('configure.modify')">
        <Select
          v-model="options.interfaceList.update.code">
          <Option
            v-for="item in options.interfaceList.update.list"
            :value="item.fdInterfaceCode"
            :key="item.fdInterfaceCode">
            {{ item.fdInterfaceCode }}
          </Option>
        </Select>
      </m-form-item>
      <m-form-item
        v-if="options.interfaceList.remove.list.length"
        :label="$t('configure.delete')">
        <Select
          v-model="options.interfaceList.remove.code">
          <Option
            v-for="item in options.interfaceList.remove.list"
            :value="item.fdInterfaceCode"
            :key="item.fdInterfaceCode">
            {{ item.fdInterfaceCode }}
          </Option>
        </Select>
      </m-form-item>
      <m-form-item
        v-if="options.interfaceList.query.list.length"
        :label="$t('configure.queryList')">
        <Select
          v-model="options.interfaceList.query.code">
          <Option
            v-for="item in options.interfaceList.query.list"
            :value="item.fdInterfaceCode"
            :key="item.fdInterfaceCode">
            {{ item.fdInterfaceCode }}
          </Option>
        </Select>
      </m-form-item>
      <!-- 接口设置结束 -->
    </template>
    <m-form-item>
      <MButton
        @click="handleClickNext"
        long
        type="primary">
        {{$t('common.nextStep')}}
      </MButton>
    </m-form-item>
  </div>
</template>
<script>
  import {
    getSubformModelList,
    subFormModelChanged
  } from "src/module/formdesigner/services/designer/subform";
  import {_initSubform} from "src/module/formdesigner/services/designer/_init";
  import find from 'lodash.find';
  const {ErrorMessage} = MSECORE.handlers.error;

  export default {
    name: "ModelConfig",
    props: {
      options: {
        type: Object,
        default: undefined,
        required: true,
      },
    },
    data() {
      return {}
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
      fdAppId() {
        return this.$store.state.xFormConfigure.fdAppId;
      },
      fdDataModuleId() {
        return this.$store.state.xFormConfigure.fdDataModuleId;
      },
    },
    methods: {
      changeModelType(newType) {
        if (newType === this.options.modelType) {
          return;
        }
        this.options.modelType = newType;
        if (newType === 'reverse') {
          getSubformModelList({
            fdAppId: this.fdAppId,
            modelId: this.fdDataModuleId,
          })
            .then(data => {
              this.options.fields = [];
              this.options.reverseModelList = data;
            })
            .catch(error => {
              this.$Message.error(new ErrorMessage(error, this.currentLang));
            });
        } else if (this.options.reverseModelFdId) {
          this.options = _initSubform(this.options, {
              formConfig: this.$store.state.xFormConfigure,
            });
          this.options.fields = [];
        }
        this.$emit('options-changed', this.options);
      },
      modelValueDisabled(v) {
        const items = this.$store.state.xFormData.items;
        let result = false;
        items.forEach(item => {
          if (item.type === 'subform' && item.options.childModelInfo.childTableName === v) {
            result = true;
          }
        });
        return result;
      },
      subformModelChanged(evt) {
        const selecteModel = find(this.options.reverseModelList, function (o) {
          return o.fdId === evt;
        });
        this.options.childModelInfo.childModelId = selecteModel.fdId;
        this.options.childModelInfo.childModelName = selecteModel.fdName;
        this.options.childModelInfo.childTableName = selecteModel.fdRequestName;

        subFormModelChanged({
          fdAppId: this.fdAppId,
          modelId: evt,
        })
          .then(data => {
            const [fieldData, interfaceData] = data;
            this.options.childModelInfo.primaryKey = fieldData.primaryKey;
            this.options.childModelInfo.foreignKey = fieldData.foreignKey;
            this.options.childModelInfo.mainModelRelKey = fieldData.mainModelRelKey;
            this.options.fields = fieldData.list;
            // interfaces
            this.options.interfaceList = interfaceData;

            this.$emit('options-changed', this.options);
          })
          .catch((error) => {
            this.$Message.error(new ErrorMessage(error, this.currentLang));
          });
      },

      // 点击下一步
      handleClickNext () {
        this.$emit('clickNext');
      }
    },
    watch: {},
  };

</script>
<style scoped lang="less">
  .margin-small-top {
    margin-top: 10px;
  }
</style>
