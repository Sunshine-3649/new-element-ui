import * as types from '../mutationTypes';

// initial state
// shape: { name, identifier, idCard }
const state = {
  // 1.定义state中要操作的数据
  userInfo: {
    name: null,
    title: null,
    idCard: null
  }
};

// getters
const getters = {};

// actions
const actions = {
  // 4.定义一个action saveUserInfo()的方法去提交mutation()
  saveUserInfo({ commit }, obj) {
    console.log(12);
    console.log('obj: ', obj);
    commit(types.SAVE_USER_INFO, obj);
  }
};

// mutations
const mutations = {
  // 3.定义一个mutation 改变state中的值
  [types.SAVE_USER_INFO](state, payLoad) {
    console.log('payLoad: ', payLoad);
    state.userInfo = payLoad || {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
