<template>
  <div>
    <m-row>
      <m-col span="24">
        <m-form-item
          :label="$t('itemProperty.spanLabel')">
          <m-input-number
            :step="1"
            :precision='0'
            v-model="item.layout.span"
            :max="calMaxSpan"
            @on-change="handleSpan()"
            :min="0">
          </m-input-number>
        </m-form-item>
      </m-col>
      <m-col span="24">
        <m-form-item
          :label="$t('itemProperty.offsetLabel')">
          <m-input-number
            :step="1"
            :precision='0'
            v-model="item.layout.offset"
            :max="calMaxOffset"
            @on-change="handleOffset()"
            :min="0">
          </m-input-number>
        </m-form-item>
      </m-col>
    </m-row>
  </div>
</template>
<script>
  export default {
    props:{
      item:{
        type:Object,
        default:null,
      }
    },
    computed:{
      calMaxSpan(){
        return 24-this.item.layout.offset;
      },
      calMaxOffset(){
        return 24-this.item.layout.span;
      }
    },
    data(){
      return {

      }
    },
    methods:{
      handleSpan(_val){
        
        let tmp_max = 24-this.item.layout.offset;
        if(this.item.layout.span>tmp_max){
          this.item.layout.span = tmp_max;
        }
      },
      handleOffset(_val){
        let tmp_max = 24-this.item.layout.span;
        if(this.item.layout.offset>tmp_max){
          this.item.layout.offset = tmp_max;
        }
      },
    }
  }
</script>