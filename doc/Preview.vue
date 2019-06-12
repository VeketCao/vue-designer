<template>
  <div
    v-if="formData"
    class="page-preview">
    <m-card>
      <div class="page-preview-head">
        <m-row>
          <m-col span="20">
            <h3 class="page-preview-title">{{formTitle}}&nbsp;</h3>
          </m-col>
          <m-col
            v-if="userCanEdit"
            span="4"
            style="text-align: right">
            <m-button
              type="primary"
              @click="gotoEdit()">
              {{$t('common.edit')}}
            </m-button>
          </m-col>
        </m-row>
      </div>
      <vue-dynamic-loader
        :vueInstance="Vue"
        :url="$asyncComponent('coreFormRender')"
        v-if="formData && formData.items.length > 0"
        :formData="formData"
        :formMetaData="{
            appId: getFdAppId,
            instanceId: fdRelId,
            dataModuleId: getDataModuleId,
        }"
        :showBtn="false"
        :langType="currentLang">
      </vue-dynamic-loader>
      <div v-else>
        <p class="text-center">当前没有任何控件～</p>
      </div>
    </m-card>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import cloneDeep from 'lodash.clonedeep';
  import vueDynamicLoader from 'vue-dynamic-loader';
  import Vue from 'vue';

  export default {
    name: "Home",
    components: {
      vueDynamicLoader,
    },
    data() {
      return {
        Vue,
      }
    },
    computed: {
      ...mapGetters({
        formTitle: 'getFormTitle',
        userCanEdit: 'getUserCanEdit',
      }),
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
      getFdAppId() {
        return this.$store.state.xFormConfigure.fdAppId;
      },
      getDataModuleId() {
        return this.$store.state.xFormConfigure.fdDataModuleId;
      },
      formData() {
        const _datas = cloneDeep(this.$store.getters.getFormDataWithLang);
        return _datas
      },
      fdRelId() {
        return this.$route.params.fdRelId
      }
    },
    methods: {
      gotoEdit() {
        const formType = this.$route.params.formType;
        const formConfigure = this.$store.getters.getFormConfigure;
        this.$router.push(`/d/designer/${formType}/${formConfigure.fdRelId}`);
      }
    },
  };
</script>
<style scoped lang="less" src="./Preview.less"></style>
