﻿<template>
  <section>
    <m-form-item :label="$t('itemProperty.uploadAttachment')" prop="referenceFile">
      <Upload
        style="display: inline-block"
        :data="uploadProps"
        :with-credentials="true"
        ref="upload"
        multiple
        :filesLimit="50-calc($lang)"
        @on-limit-error="onLimitError(50-calc($lang))"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handelProgress"
        :max-size="fileSize"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :action="uploadApi">
        <m-button class="white-button" type="ghost">{{$t('common.clickToUpload')}}</m-button>
      </Upload>
      <Poptip transfer width="210" placement="top" v-model="uploadContentVisible">
        <Icon type="ios-world-outline" size=18 style="cursor: pointer"></Icon>
        <upload-content
          :api="uploadApi"
          :uploadData="uploadProps"
          :sectionId="item.id"
          @on-limit-error="onLimitError"
          :fileSize="fileSize"
          :uploadSuccess="handleSuccess"
          :uploadError="handleError"
          :uploadProgress="handelProgress"
          :uploadOverSize="handleMaxSize"
          :uploadBefore="handleBeforeUpload"
          :currentFilelist="uploadFileList"
          :saveUploadList='saveUploadList'
          
          slot="content"
        >
        </upload-content>
      </Poptip>
      <template v-if="uploadStatus == 'uploading'">
        <div v-if="$refs.upload" class="demo-upload-list" v-for="item in uploadFileList">
         <Progress :stroke-width="8" v-if="item.showProgress" :percent="Math.round(item.percentage)" ></Progress>
        </div>
        <!-- <Spin fix>
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        </Spin> -->
      </template>
      <div class='m-referenceFile-upload-list' v-if="saveUploadList.length > 0">
        <dl v-if="diffLangFile('zh-CN').length > 0">
          <dt>{{$t('itemProperty.chLabel')}}</dt>
          <dd>
            <file-list
              :key="index"
              v-for="(file, index) in renderLangFile('zh-CN')"
              :item="file"
              :removeFunc="handleRemove"
            >
            </file-list>
          </dd>
        </dl>
        <dl v-if="diffLangFile('en-US').length > 0">
          <dt>{{$t('itemProperty.enLabel')}}</dt>
          <dd>
            <file-list
              :key="index"
              v-for="(file, index) in renderLangFile('en-US')"
              :item="file"
              :removeFunc="handleRemove"
            >
            </file-list>
          </dd>
        </dl>
        <dl v-if="diffLangFile('ja-JP').length > 0">
          <dt>{{$t('itemProperty.jpLabel')}}</dt>
          <dd>
            <file-list
              :key="index"
              v-for="(file, index) in renderLangFile('ja-JP')"
              :item="file"
              :removeFunc="handleRemove"
            >
            </file-list>
          </dd>
        </dl>
      </div>
      <p v-if="uploadStatus === 'uploadError'">{{errorMsg}}</p>
      <p v-if="uploadStatus === 'error'">{{$t('itemProperty.netWorkError')}}</p>
    </m-form-item>
  </section>
</template>

<style scoped>

  .m-referenceFile-upload-list {
    margin-top: 8px;
  }
  .m-referenceFile-upload-list dl {
    position: relative;
    padding-left: 50px;
    margin-bottom: 5px;
    line-height: 24px;
  }
  .m-referenceFile-upload-list dt {
    position: absolute;
    top: 0px;
    left: 0px;
    color: #999999;
  }
  .m-referenceFile-upload-list dd {
    line-height: 24px;
  }
  .m-referenceFile-upload-list dd p {
    background: #f6f6f6;
    margin-bottom: 1px;
    word-break: break-all;
  }
  .white-button {
    background: white;
  }
</style>

<script>
  import isEmpty from "lodash.isempty";
  const {
    api: {
      formDesigner: {
        fileInputSave,
      }
    },
    lang: {
      formDesigner: {
        FormDesignerDynamicLang,
      }
    },
  } = MSECORE;

  export default {
    name: "ReferenceFile",
    props: ["item"],
    data() {
      return {
        uploadFileList:[],
        // 上传参数
        uploadData: {
          instanceId: this.$store.state.xFormConfigure.fdRelId,
          moduleId: this.$store.state.xFormConfigure.fdRelId,
          moduleName: 'MFORM-FORM',
          sectionId: ''
        },
        // 当前上传文件列表
        uploadList: [],
        // 上传接口
        uploadApi: fileInputSave,
        // 上传状态参数
        uploadStatus: '',
        // 删除状态
        deleteStatus: '',
        // 出错信息
        errorMsg: '',
        uploadContentVisible: false,
        currentUploadFilesLength:0,
      };
    },
    computed: {
      uploadProps: function() {
        return Object.assign({}, this.uploadData, {
          langType: this.$store.state.xUser.fdLangType
        })
      },
      fileSize: function() {
        return this.item.options.size * 1024;
      },
      saveUploadList: {
        get() {
          return this.item.value;
        },
        set(val) {
          this.item.value = val;
        }
      }
    },
    created() {
      this.uploadData.sectionId = this.item.id;
    },
    mounted() {
      this.saveUploadList = this.item.value;
    },
    beforeUpdate() {
      // 更新时候再次复制，否则编辑模块参数不会变化
      this.uploadData.sectionId = this.item.id;
    },
    methods: {
      onLimitError($event) {
        this.$Message.warning(FormDesignerDynamicLang.configure.uploadLimitTotalFiles(50)[this.$lang]);
      },
      calc(lang) {
        const files = this.saveUploadList.filter(file => {
          return file.langType === lang;
        });
        return files.length;
      },
      /**
       * 显示或隐藏模态框
       * @param field
       */
      toggleModal(modal,field) {
        this[modal] = !this[modal];
        if(field){
          this.modalField=field;
        }
      },
      /**
       * 判断上传的文件是否有重名
       * @param {*} array 目标数组
       * @param {*} item 要对比的字段
       */
      checkIsFileNameEqual(array, name) {
        let status = false;
        array.forEach(function (element) {
          if (element.name === name) {
            status = true;
          }
        });
        return status;
      },
      /**
       * 判断上传文件是否带有扩展名
       * @param  {[string]} name [文件名]
       * @return {[boolean]}      [是否状态]
       */
      checkIsNoExtension(name) {
        return name.lastIndexOf(".") === -1 ? false : true ;
      },
      getMatchLangFileSum(_array){
        let tmp_files = _array.filter((val)=>{
          return val.langType == this.$lang;
        })
        return tmp_files.length;
      },
      /**
       * 上传之前做一些判断
       * @augments file
       */
      handleBeforeUpload(file) {
        // 判断上传中，再添加上传文件时是否存在相同文件名的
        let flag = true;
        if(this.uploadFileList && this.uploadFileList.length>0){
          this.uploadFileList.forEach(val=>{
            if(val.name === file.name){
              this.$Message.warning(this.$t('itemProperty.uploadSameName'));
              flag = false;
              return;
            }
          })
        }
        if(!flag){
          return false;
        }
        
        this.currentUploadFilesLength = this.currentUploadFilesLength+1;

        if (!!this.checkIsFileNameEqual(this.saveUploadList, file.name)) {
          this.currentUploadFilesLength = 0;
          this.$Message.warning(this.$t('itemProperty.uploadSameName'));
          return false;
        }
        if (!this.checkIsNoExtension(file.name)) {
          this.currentUploadFilesLength = 0;
          this.$Message.warning(this.$t('itemProperty.uploadExName'));
          return false;
        }

      },
      /**
       * 上传过程中的状态处理
       * @augments
       */
      handelProgress(event, file, fileList) {
        this.uploadStatus = 'uploading';
        this.uploadFileList = fileList;
        // console.dir(this.uploadFileList)
      },
      /**
       * 上传成功后做一些数据的拼接
       * @augments
       */
      handleSuccess(res, file, fileList) {
        // let files = this.uploadList;
        if (file.response && file.response.success == true && file.response.data) {
          const data = Object.assign(file.response.data, {
            uid: file.uid,
            name: file.name,
            type: 'Reference',
            url: file.response.data.downloadUrl || '',
            downloadUrl: file.response.data.downloadUrl || '',
            deleteUrl: file.response.data.deleteUrl || '',
            fdConvertFlag: file.response.data.fdConvertFlag || '' //转换状态,0:不用转换，1：未转换，2：转换中，3：已转换；99：转换异常
          });
          this.saveUploadList.push(data);
          // let newdata = Object.assign({}, this.state.editForm, { fieldValue: arr });
          // files.push(file);
          this.uploadStatus = 'done';

          // this.uploadList = files;
        } else if (file.response.success == false || !file.response.data) {
          this.uploadStatus = 'uploadError';
          // this.uploadList = files;
          this.errorMsg = file.response.msg
        }

        this.uploadContentVisible = false;

        this.uploadFileList = []
      },
      handleError(err, file, fileList) {
        this.uploadStatus = 'error';
      },
      handleRemove(file) {
        const filterList = this.saveUploadList.filter(node => {
          return node.uid !== file.uid
        });
        this.saveUploadList = this.uploadList = this.item.value = filterList;
      },
      /**
       * 上传文件超载时候的处理
       */
      handleMaxSize(file) {
        this.$Message.warning(FormDesignerDynamicLang.configure.uploadMaxSize(this.item.options.size)[this.$lang]);
      },
      /**
       * 根据不同的语言种类组装文件列表
       * @augments
       */
      diffLangFile(type) {
        let obj = '';
        if (this.saveUploadList.length > 0) {
          const list = this.saveUploadList.filter((element) => {
            // console.log(element);
            if (!isEmpty(element.response)) {
              const file = element.response.data;
              return file.langType === type;
            } else {
              return element.langType === type;
            }
          });
          obj = {
            list,
            length: list.length
          }
        } else {
          if (this.saveUploadList.hasOwnProperty(type)) {
            const list = this.saveUploadList[type];
            obj = {
              list,
              length: list.length
            }
          } else {
            obj = {
              list: null,
              length: 0
            }
          }
        }
        // console.log(obj);
        return obj;
      },
      /**
       * 渲染不同语言分类附件列表
       * @param {*} type
       */
      renderLangFile(type) {
        let PreviewFileUrl = '';
        if (typeof window !== 'undefined') {
          PreviewFileUrl = window.environment ? window.environment.gotoProcess : '';
        }
        const list = this.diffLangFile(type)['list'];
        return list;
      }
    },
    components: {
      UploadContent: resolve => {
        require(['./UploadContent.vue'], resolve)
      },
      FileList: resolve => {
        require(['./FileList.vue'], resolve)
      }
    }
  };

</script>
