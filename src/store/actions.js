import * as types from './mutationTypes';

function dispatchRootLevelAction({ dispatch }, payload) {
  dispatch(types.ROOT_LEVEL_ACTION_TYPE, payload);
}

export default {
  dispatchRootLevelAction
};
