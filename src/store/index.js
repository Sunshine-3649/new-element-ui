import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import user from './modules/user';
import selectChannel from './modules/selectChannel';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  modules: {
    user,
    selectChannel
  },
  strict: debug
});
