import '../../css/base'
import App from '../module/App/main'
import router from '../module/Route/main'

new Vue({
    el:'#app',
    router,
    render: h => h(App)
})