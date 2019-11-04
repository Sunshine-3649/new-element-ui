

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import elementUi from 'element-ui';
import './style/reset.css';
import './style/normalize.min.css';
import './style/minireset.min.css';
import './style/theme-chalk/index.css';
import {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE
} from './api/paxios/paxios.js';
import $AXIOS from './api/paxios/oldRequest.js';
import filters from './filters'; // 全局vue filter
import VueClipboard from 'vue-clipboard2';
import utils from './utils/index.js';
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
import { pca, pcaa } from 'area-data'; // v5 or higher
import htmlToPdf from '@/utils/htmlToPdf';

// 进入加载进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ parent: '#NProgres' });


Vue.use(VueAreaLinkage);
Vue.use(VueClipboard);
Vue.use(htmlToPdf);
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.filter('filter-time', time => {
  if (time) {
    let currentMon = (new Date(time).getMonth() + 1) < 10 ? '0' + (new Date(time).getMonth() + 1) : (new Date(time).getMonth() + 1);
    let currentDate = new Date(time).getDate() < 10 ? '0' + new Date(time).getDate() : new Date(time).getDate();
    let currentHour = new Date(time).getHours() < 10 ? '0' + new Date(time).getHours() : new Date(time).getHours();
    let currentMin = new Date(time).getMinutes() < 10 ? '0' + new Date(time).getMinutes() : new Date(time).getMinutes();
    let currentSec = new Date(time).getSeconds() < 10 ? '0' + new Date(time).getSeconds() : new Date(time).getSeconds();
    return new Date(time).getFullYear() + '-' + currentMon + '-' + currentDate + ' ' + currentHour + ':' + currentMin + ':' + currentSec;
  }
  return '';
});

// 常用的原型挂载
Vue.prototype.pca = pca;
Vue.prototype.pcaa = pcaa;
Vue.prototype.GET = GET;
Vue.prototype.POST = POST;
Vue.prototype.PATCH = PATCH;
Vue.prototype.PUT = PUT;
Vue.prototype.DELETE = DELETE;

Vue.prototype.$AXIOS = $AXIOS;

Vue.use(elementUi);
Vue.config.productionTip = false;
Vue.prototype.$utils = utils;


router.beforeEach((to, from, next) => {
    let channels = store.state.selectChannel.channels;
    let meta = to.meta;
    NProgress.start();
    if (to.fullPath === '/login' || to.fullPath === '/SelectChannel') {
        store.dispatch('selectChannel/clearMuneTab'); // 清掉储存的面包屑数组
        window.sessionStorage.clear();
        NProgress.done();
    } else {
        let name = to.name ? to.name : to.path.split('/')[1];
        let fromName = from.name ? from.name : from.path.split('/')[1];
        let ispermission = store.getters['selectChannel/isPermission']; // 判断是否有业务看板权限
        if (ispermission) {  // 判断是否有业务看板权限 有的话第一个tab为业务看板模块
            store.dispatch('selectChannel/setMuneTab', {
                title: '业务看板',
                route: '/businesskanbanopage',
                name: 'businesskanbanopage'
            });
            store.dispatch('selectChannel/setMuneTab', {
                title: meta.title,
                route: to.path,
                name: name
            });
        } else {
            if (to.path !== '/businesskanbanopage') {
                store.dispatch('selectChannel/setMuneTab', {
                    title: meta.title,
                    route: to.path,
                    name: name
                });
            }
        }

        if (to.meta.code) { // 把所有列表页添加到缓存
            store.dispatch('selectChannel/setKeepalive', {
                title: meta.title,
                route: to.path,
                name: name
            });
        }
        if (to.query.isadd === 1) { // 把所有新增页面添加到缓存
            store.dispatch('selectChannel/setKeepalive', {
                title: meta.title,
                route: to.path,
                name: name
            });
        } else if (to.query.isadd === 0) {
            store.dispatch('selectChannel/setKeepalive', { // 把所有编辑页面移除缓存
                name: name,
                removeKeepAlive: true
            });
        }
        if (from.query.backLastRouter) {
            store.dispatch('selectChannel/setMuneTab', {route: fromName, remove: true, backLastRouter: true});
        }
    }
    if (!channels.length && to.fullPath !== '/login') {
        $AXIOS.GET('/api/jurisdictionUserChannel').then(res => {
            store.dispatch('selectChannel/setChannels', res.result);
            next();
        });
    } else {
        next();
    }
});


router.afterEach((to, from) => {
    // 这里是处理业务看板入口进来的页面 去掉缓存
    let name = to.name ? to.name : to.path.split('/')[1];
    if (to.query.reload) {
        store.dispatch('selectChannel/setKeepalive', {
            name: name,
            removeKeepAlive: true
        });
    }
    console.log(from, 'from');
    if (to.meta.title === from.meta.title) {
        store.dispatch('selectChannel/setKeepalive', {
            name: from.name,
            removeKeepAlive: true
        });
    }
    NProgress.done();
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
});
