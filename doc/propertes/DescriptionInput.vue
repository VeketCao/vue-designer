<template>
  <div>
    <m-form-item
      :label="$t('itemProperty.editContent')"
      :key="supportLang.length"
      prop="value">
      <m-radio-group
        v-model="langFlag"
        type="button">
        <Radio
          v-for="lang in supportLang"
          :label="lang.value">
          {{lang.label}}
        </Radio>
      </m-radio-group>
      <div v-for="lang in supportLang"
          class="desc-editor-wrapper"
          :class="langFlag === lang.value ? 'active': ''">
        <vue-dynamic-loader
          :url="$asyncComponent('uEditor')"
          :key="richTextLang"
          :config="{
          lang: richTextLang,
          toolbars: [
            ['fullscreen', 'source', 'undo', 'redo'],
            ['fontsize', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify']
          ],
        }"
          :value="item.value[lang.value]"
          v-model.trim="item.value[lang.value]">
        </vue-dynamic-loader>
      </div>
    </m-form-item>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import VueDynamicLoader from 'vue-dynamic-loader';
  export default {
    data() {
      return {
        langFlag: null,
      }
    },
    name: 'Description',
    props: ['item'],
    computed: {
      ...mapGetters({
        richTextLang: 'getLangRichTextFormat',
        supportLang: 'getSupportLang',
        currentLang: 'getCurrentLang',
      }),
    },
    watch: {
      currentLang() {
        this.langFlag = this.currentLang;
      }
    },
    components: {
      VueDynamicLoader,
    },
    mounted() {
      this.langFlag = this.currentLang;
    }
  };
</script>
<style scoped lang="less">
  .desc-editor-wrapper {
    display: none;
    margin-top: 15px;
    &.active {
      display: block;
    }
  }
</style>
