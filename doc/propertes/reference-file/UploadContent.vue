<template>
  <m-form ref="uploadForm" label-position="right">
    <m-form-item :label="$t('itemProperty.chLabel')">
      <Upload
        :data="zhProps"
        :with-credentials="true"
        ref="uploadcn"
        @click.native="captureInputTap($event, 'zh-CN')"
        :filesLimit="50 - calc('zh-CN')"
        @on-limit-error="onLimitError(50 - calc('zh-CN'))"
        multiple
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-progress="uploadProgress"
        :max-size="fileSize"
        :on-exceeded-size="uploadOverSize"
        :before-upload="handleBeforeUpload"
        :action="api"
      >
        <m-button type="ghost" size="small">{{$t('common.clickToUpload')}}</m-button>
      </Upload>
    </m-form-item>
    <m-form-item :label="$t('itemProperty.enLabel')">
      <Upload
        :data="enProps"
        :with-credentials="true"
        ref="uploaden"
        @on-limit-error="onLimitError(50 - calc('en-US'))"
        :filesLimit="50 - calc('en-US')"
        multiple
        @click.native="captureInputTap($event, 'en-US')"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-progress="uploadProgress"
        :max-size="fileSize"
        :on-exceeded-size="uploadOverSize"
        :before-upload="handleBeforeUpload"
        :action="api"
      >
        <m-button type="ghost" size="small">{{$t('common.clickToUpload')}}</m-button>
      </Upload>
    </m-form-item>
    <m-form-item :label="$t('itemProperty.jpLabel')">
      <Upload
        :data="jpProps"
        :with-credentials="true"
        ref="uploadjp"
        @click.native="captureInputTap($event, 'ja-JP')"
        multiple
        :filesLimit="50 - calc('ja-JP')"
        @on-limit-error="onLimitError(50 - calc('ja-JP'))"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-progress="uploadProgress"
        :max-size="fileSize"
        :on-exceeded-size="uploadOverSize"
        :before-upload="uploadBefore"
        :action="api">
        <m-button type="ghost" size="small">{{$t('common.clickToUpload')}}</m-button>
      </Upload>
    </m-form-item>
  </m-form>
</template>

<script>
export default {
  name: 'UploadContent',
  props: {
    api: String,
    fileSize: Number,
    sectionId: String,
    uploadData: Object,
    uploadSuccess: Function,
    uploadError: Function,
    uploadProgress: Function,
    uploadOverSize: Function,
    uploadBefore: Function,
    saveUploadList: Array,
    currentFilelist:Array,
  },
  data() {
    return {
      currentUploadFilesLength:0,
      captureInput:'',
    };
  },
  methods:{
    onLimitError($event) {
      this.$emit('on-limit-error', $event);
    },
    calc(lang) {
      const files = this.saveUploadList.filter(file => {
        return file.langType === lang;
      });
      return files.length;
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
      returnMatchRef(_lang){
        let tmp_obj = null;
        switch(_lang){
          case 'zh-CN':
            tmp_obj = this.$refs.uploadcn;
            break;
          case 'en-US':
            tmp_obj = this.$refs.uploaden;
            break;
          case 'ja-JP':
            tmp_obj = this.$refs.uploadjp;
            break;
        }
        return tmp_obj;
      },
      getMatchLangFileSum(_array, _caplang){
        let tmp_files = [];
        _array.forEach((val)=>{
          if(val.langType == _caplang){
            tmp_files.push(val);
          }
        })
        return tmp_files.length;
      },
      captureInputTap($event, _lang){
        this.captureInput = _lang;
      },
      handleBeforeUpload(file){
        // 判断上传中，再添加上传文件时是否存在相同文件名的
        let flag = true;
        if(this.currentFilelist && this.currentFilelist.length>0){
          this.currentFilelist.forEach(val=>{
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
        // 如果存在同名文件，则提示错误
        if (!!this.checkIsFileNameEqual(this.saveUploadList, file.name)) {
          this.$Message.warning(this.$t('itemProperty.uploadSameName'));
          this.currentUploadFilesLength = 0;
          return false;
        }
        if (!this.checkIsNoExtension(file.name)) {
          this.$Message.warning(this.$t('itemProperty.uploadExName'));
          this.currentUploadFilesLength = 0;
          return false;
        }
      }
    },
  computed: {
    zhProps: function() {
      return Object.assign({}, this.uploadData, {
        langType: 'zh-CN'
      })
    },
    enProps: function() {
      return Object.assign({}, this.uploadData, {
        langType: 'en-US'
      })
    },
    jpProps: function() {
      return Object.assign({}, this.uploadData, {
        langType: 'ja-JP'
      })
    }
  },
}
</script>
