// initial state
const state = {
    channels: [], // 存放用户所拥有的业务线
    permission: [], // 存放用户所拥有的权限模块
    muneTabList: [],  // 存放面包屑的数组
    keepAliveArr: [] // 缓存的组件
};

  // getters
const getters = {
    isPermission(state) {
        // console.log(window.sessionStorage.menuConfig);
        let menuConfig = JSON.parse(window.sessionStorage.menuConfig);
        let permissions = state.permission;
        let permissionsArr = menuConfig.filter((item) => {
            if (item.parentCode === 208) {
                return item;
            }
        });
        return permissionsArr.length;
    }
};

  // actions
const actions = {
    setChannels({ commit }, channels) {
        commit('set_Channels', channels);
    },
    setPermission({ commit }, permission) {
        commit('set_permission', permission);
    },
    setMuneTab({ commit }, mune) {
        commit('set_muneTab', mune);
        // commit('set_keepalive', mune);
    },
    clearMuneTab({ commit }, mune) {
        commit('clear_muneTab', mune);
    },
    setKeepalive({ commit }, bol) {
        commit('set_keepalive', bol);
    }

};

  // mutations
const mutations = {
    set_Channels(state, channels) {
        state.channels = channels;
    },
    set_permission(state, permission) {
        state.permission = permission;
    },
    set_muneTab(state, mune) {
        if (state.muneTabList.length) {
            if (!mune.remove) { // 添加面包屑
                let splitPata = `/${mune.route.split('/')[1]}`;
                let flag = -1;
                state.muneTabList.forEach((item, index) => {
                    let route = `/${item.route.split('/')[1]}`;
                    if (route === splitPata) {
                        item.route = mune.route;
                        flag = index;
                    }
                });

                if ( flag > -1 ) {

                } else {
                    state.muneTabList.push(mune);
                }
            } else { // 删除面包屑
                if (mune.backLastRouter) {
                    state.muneTabList.forEach((item, index) => {
                        if (item.name === mune.route) {
                            state.muneTabList.splice(index, 1);
                        }
                    });
                } else {
                    state.muneTabList.forEach((item, index) => {
                        if (item.route === mune.route) {
                            state.muneTabList.splice(index, 1);
                        }
                    });
                }
            }
        } else {
            state.muneTabList.push(mune);
        }
    },
    // 清空vuex里储存的面包屑
    clear_muneTab(state, mune) {
        state.muneTabList = [];
    },
    // 设置所需要的缓存组件
    set_keepalive(state, route) {
        if (!state.keepAliveArr.length) {
            state.keepAliveArr.push(route.name);
        } else {
            let sameName = state.keepAliveArr.find((item, index) => item === route.name);
            if (!sameName && !route.removeKeepAlive) {
                state.keepAliveArr.push(route.name);
            } else if (sameName && route.removeKeepAlive) {
                let index = state.keepAliveArr.indexOf(route.name);
                if (index > -1) {
                    state.keepAliveArr.splice(index, 1);
                }
            }
        }
    },
    decrementProductInventory(state, { id }) {
        const product = state.all.find(product => product.id === id);
        product.inventory--;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
