import '../../css/base'
import App from '../module/App/main'
import router from '../module/Route/main'
/*

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index';
Vue.use(ElementUI);
*/


new Vue({
    el:'#app',
    router,
    render: h => h(App)
})