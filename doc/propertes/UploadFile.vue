<template>
  <div>
    <m-form-item :label="$t('itemProperty.uploadAttachment')" prop="referenceFile">
      <m-row>
        <m-col span="10">
          <m-input-number size="small" :max="500" :min="1" v-model="item.options.size"></m-input-number>
        </m-col>
        <m-col span="8">
          <span>MB</span>
        </m-col>
      </m-row>
    </m-form-item>
  </div>
</template>
<script>

  export default {
    name: "UploadFile",
    props: ["item"],
    data() {
      return {
        donuts: this.$store.state.xFormData
      };
    },
  };

</script>
