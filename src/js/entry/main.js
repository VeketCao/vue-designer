import '../../css/base'
import 'font-awesome/css/font-awesome.css'
import App from '../module/App/main'
import router from '../module/Route/main'

/*
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index';
Vue.use(ElementUI);*/

import '../components/main'//注册组件

window.Bus = new Vue();

new Vue({
    el:'#app',
    router,
    render: h => h(App)
})