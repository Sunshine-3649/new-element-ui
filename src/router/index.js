import Vue from 'vue';
import Router from 'vue-router';
import manage from '@/view/manage/manage'; // 供应商详情
import Login from '@/view/login/login'; // 登录
import SelectChannel from '@/view/login/selectChannel'; // 选择业务线
import Mune from '@/view/login/mune'; // 权限控制
import modules from './modules';

Vue.use(Router);

export const RouterMap = [{
    path: '/',
    name: '',
    redirect: '/login'
//   children: [...modules]
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/SelectChannel',
    name: 'SelectChannel',
    component: SelectChannel
}, {
    path: '/manage',
    name: 'manage',
    component: manage
}, {
    path: '/Mune',
    name: 'Mune',
    component: Mune,
    // redirect: '/businesskanbanopage',
    children: [...modules]
}];

export default new Router({
  routes: RouterMap
});
