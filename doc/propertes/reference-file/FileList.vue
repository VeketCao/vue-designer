<template>
  <p>
    <Icon class="base-icon" type="android-attach" :size="12" style="margin: 0 3px"></Icon><span style="margin-right: '5px">{{item.name}}</span>
    <a href="javascript:void(0)" style="margin: 0 3px" @click="removeFunc(item)">{{$t('itemProperty.showHideDelete')}}</a>
  </p>
</template>

<script>
export default {
  props: {
    item: Object,
    removeFunc: Function
  },
  data() {
    return {
      
    };
  }
} 
</script>
  
