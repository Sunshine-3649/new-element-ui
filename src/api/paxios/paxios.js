import axios from 'axios';
import {
  Message
} from 'element-ui';
import Qs from 'qs';
import router from '../../router';


let judge = (status, msg) => {
  if (status === '403') {
    Message({
      message: '你暂时没有权限访问',
      type: 'error'
    });
    setTimeout(() => {
      router.push({
        path: '/login'
      });
    }, 1000);
  } else if (status === '401') {
    Message({
      message: '用户无权限，请切换用户重新登录',
      type: 'error'
    });
    setTimeout(() => {
      router.push({
        path: '/login'
      });
    }, 1000);
  } else if (status >= 500) {
    Message({
      message: msg || '网络错误,请稍后重新刷新页面',
      type: 'error'
    });
  } else {
    Message({
      message: msg || '网络错误,请稍后重新刷新页面',
      type: 'error'
    });
  }
};


const instance = axios.create({
  baseURL: '/chain-web',
  timeout: 60000
});

instance.interceptors.request.use((config) => {
  return config;
}, error => {
  let status = error.response.status;
  judge(status);
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  // 请求不等于200时自动拦截
  let code = response.data.code;
  let msg = response.data.message;

  if (code === '200') {
    return response.data;
  } else {
    judge(code, msg);
    return Promise.reject(msg);
  }
}, error => {
  let status = error.response.status;
  judge(status);
  return Promise.reject(error);
});

let GET = (url, params) => instance.get(url, {
  params
});
let POST = (url, body) => instance.post(url, body);
let PUT = (url, body) => instance.put(url, body);
let PATCH = (url, body) => instance.patch(url, body);
let DELETE = (url, body) => instance.delete(url, {params: body});

// 获取字典接口
axios.get('/scm-web/metadata/dict').then(res => {
    localStorage.queryArr = JSON.stringify(res.data);
});
// 获取地址接口
axios.get('/scm-web/metadata/address').then(res => {
    localStorage.addressArr = localStorage.city = JSON.stringify(res.data);
});

export {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
};
