import * as mutationTypes from './mutationTypes';

function commitRootLevelMutation(state, payload) {
  console.debug('触发了根级别的 Mutation, state =>', state, 'payload => ', payload);
}

export default {
  commitRootLevelMutation
};
