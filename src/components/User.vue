<template>
  <div class="user">
    <button @click="back">返回</button>
    <p>{{user}}</p>
  </div>
</template>

<script>
// 7.引入mapState
import { mapState } from 'vuex';
export default {
  name: 'user',
  data() {
    return {};
  },
  // 8.利用computed获取state中的映射数据
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  },
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>

</style>
