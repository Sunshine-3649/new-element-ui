import axios from 'axios';
import {
    Message,
    Loading
} from 'element-ui';
import Qs from 'qs';
import router from '../../router';

const $AXIOS = {};
// 业务看板防止没有数据权限跳到登录页
const filterApi = ['/scm-web/statisticManager/auditData', '/scm-web/statisticManager/baseBuiData', '/scm-web/statisticManager/getStatisticNumByStatus', '/scm-web/statisticManager/dataCount'];
let currentApi = '';
let loadingInstance = false;
let loadFunc = (loadFlag) => {
    if (loadFlag) {
        loadingInstance = Loading.service({
            text: '请稍后...',
            background: 'rgba(0, 0, 0, 0.8)',
            spinner: 'el-icon-loading'
        });
    }
};


let judge = (status, msg) => {
  if (status === '403' && filterApi.indexOf(currentApi) === -1) {
    Message({
      message: msg || '你暂时没有权限访问',
      type: 'error'
    });
    setTimeout(() => {
      router.push({
        path: '/login'
      });
    }, 1000);
  } else if (status === '401' && filterApi.indexOf(currentApi) === -1) {
    Message({
      message: msg || '用户无权限，请切换用户重新登录',
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
    baseURL: '/scm-web',
    timeout: 0
});
const instanceList = axios.create({
    baseURL: '/scm-web',
    timeout: 0
});

// 请求的拦截
instance.interceptors.request.use(config => {
    // Do something before request is sent
    currentApi = config.url;
    return config;
}, error => {
// Do something with request error
    return Promise.reject(error);
});


instance.interceptors.response.use((response) => {
    // 请求不等于200时自动拦截
    if (loadingInstance) loadingInstance.close();
    let code = response.data.appcode || '';
    let msg = response.data.databuffer;
    if (code === '1') {
        return response.data;
    } else {
        judge(code, msg);
        return Promise.reject(response.data);
    }
}, error => {
    if (loadingInstance) loadingInstance.close();
    let status = error.response.status;
    let msg = error.response.data.databuffer;
    judge(status + '', msg);
    return Promise.reject(error.response.data);
});


instanceList.interceptors.response.use(response => {
    if (loadingInstance) loadingInstance.close();
    return response.data;
}, error => {
    if (loadingInstance) loadingInstance.close();
    let status = error.response.status;
    let msg = error.response.data.databuffer;
    judge(status + '', msg);
    return Promise.reject(error.response.data);
});


$AXIOS.GET = (url, params, flag) => {
    loadFunc(flag);
   return instance.get(url, { params });
};
$AXIOS.POST = (url, body, flag) => {
    loadFunc(flag);
    return instance.post(url, Qs.stringify(body));
};
$AXIOS.PUT = (url, body, flag) => {
    loadFunc(flag);
    return instance.put(url, Qs.stringify(body));
};
$AXIOS.JSONPOST = (url, body, flag) => {
    loadFunc(flag);
    return instance.post(url, body);
};
$AXIOS.JSONPUT = (url, body, flag) => {
    loadFunc(flag);
    return instance.put(url, body);
 };
$AXIOS.DELETE = (url, id, flag) => {
    loadFunc(flag);
    return instance.delete(url + id);
};
$AXIOS.LISTGET = (url, params, flag) => {
    loadFunc(flag);
    return instanceList.get(url, { params });
};
/**
 *
 * @param {JSON} obj
 * 1.methos 导出的方法 默认是get
 * 2.url 导出的路径
 * 3.data 导出所需的参数
 * 4.fileName 文件名字
 */
$AXIOS.EXPORT = (obj) => {
    let data = {
        method: obj.method || 'get',
        url: '/scm-web' + obj.url,
        responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
        timeout: 0,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data.method === 'get' || data.method === 'GET') {
        data.params = obj.data;
    } else {
        data.data = obj.data;
    }

    return axios(data).then(res => {
        // 处理返回的文件流
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        let day = '-' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const fileName = obj.fileName ? obj.fileName + '.xls' : '文件导出' + day + '.xls'; // 下载文件名称

        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    }).catch((err) => {
      let enc = new TextDecoder('utf-8');
      let res = JSON.parse(enc.decode(new Uint8Array(err.response.data))); // 转化成json对象
      Message({
            type: 'error',
            showClose: true,
            message: res.databuffer,
            duration: 0
        });
    });
};


export default $AXIOS;
