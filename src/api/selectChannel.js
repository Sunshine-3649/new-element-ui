import axios from './paxios/oldRequest';

let getuserName = () => {  // 获取用户名字
    return axios.GET('/accredit/getName');
};

let getWarehouse = () => { // 获取业务线
    return axios.GET('/api/jurisdictionUserChannel');
};

let getHtml = () => {  // 获取用户所拥有的菜单权限
    return axios.GET('/accredit/html');
};

let confirmUser = (code) => {  // 获取用户所拥有的菜单权限
    return axios.GET('/api/confirmUser', {channelCode: code});
};

export {getuserName, getWarehouse, getHtml, confirmUser};
