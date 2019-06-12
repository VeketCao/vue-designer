/**
 * Created by Veket on 2018/12/10.
 */
import VueRouter from 'vue-router';

import Designer from '../Designer/main'
import Preview from '../Preview/main'
import Login from '../Login/main';

Vue.use(VueRouter);

const routesMap = [
    {
        path: '/',redirect:'/d',
    },
    {
        path:'/login',
        name:'login',
        component:Login,
    },
    {
        path:'/d',
        name:'designer',
        component:Designer,
    },
    {
        path:'/p',
        name:'preview',
        component:Preview,
    },

];

const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes: routesMap
});

export default router