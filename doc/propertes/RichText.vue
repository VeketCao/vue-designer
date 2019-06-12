<template>
  <div>
    <Modal
      v-model="visible"
      :title="$t('common.richTextTitle')"
      width="800">
      <vue-dynamic-loader
        :url="$asyncComponent('uEditor')"
        v-if="visible"
        class="editor-reset"
        :config="item && item.options && item.options.config ? item.options.config : {lang: richTextLang}"
        @changed="item.value = $event"
        :langType="$lang"
        :value="item.value">
      </vue-dynamic-loader>
      <div slot="footer">
        <m-button
          type="success"
          @click="visible=false">
          {{$t('common.confirm')}}
        </m-button>
      </div>
    </Modal>
    <m-form-item>
      <m-button
        type="primary"
        @click="showEditor()">
        {{$t('itemProperty.editContent')}}
      </m-button>
    </m-form-item>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import VueDynamicLoader from 'vue-dynamic-loader';

  export default {
    name: "RichTextProperty",
    props: ['item'],
    data() {
      return {
        visible: false,
      }
    },
    computed: {
      ...mapGetters({
        richTextLang: 'getLangRichTextFormat',
      }),
    },
    methods: {
      showEditor() {
        this.visible = true;
      }
    },
    components: {
      VueDynamicLoader,
    }
  }
</script>
<style lang="less"></style>
