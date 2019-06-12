<template>
  <div class="base-text"
  :draggable="draggable"
  @dragstart="onDragStart($event)"
  @dragend="onDragEnd($event)">
    <Icon class="base-icon" :type="icon" :size="size"></Icon>
    <span class="base-msg">{{msg[lang]}}</span>
  </div>
</template>
<script>
  export default {
    props: {
      size:{
        type:String,
        default:''||'16'
      },
      icon:{
        type:String,
        default:""
      },
      msg:{
        type:Object,
      },
      dragType: {
        type: String
      },
      draggable:{
        type:Boolean,
        defalut: false
      },
      handleDragStart: {
        type: Function
      },
      handleDragEnd: {
        type: Function
      }
    },
    data() {
      return {
        lang: this.$store.state.xUser.fdLangType
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.xUser.fdLangType;
      },
    },
    watch: {
      currentLang(newValue) {
        this.lang = newValue;
      }
    },
    methods: {
      onDragStart(e) {
        this.handleDragStart(e, this.dragType);
      },
      onDragEnd(e) {
        this.handleDragEnd(e);
      }
    }
  }
</script>
<style lang="less" scoped>
  .base-text {
    /* width: 48%; */
    border: 1px solid #ddd;
    background: white;
    line-height: 40px;
    height:40px;
    margin-top: 5px;
    position:relative;
    padding-left:16px;
    .base-icon{
      line-height:39px;
    }
    .base-msg {
      font-size: 13px;
      color: #999;
      margin-left:10px;
    }
    &:hover {
      cursor: pointer;
      background-color: #d0e2f3;
      border-color: #57a5ca;
      border-style: solid;
    }
  }
</style>
