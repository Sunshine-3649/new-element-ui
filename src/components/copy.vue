<template>
  <div class="copy">
    [
    <el-button size="mini" type="text" v-clipboard:copy="msg" v-clipboard:success="onCopy" 　　v-clipboard:error="onError" icon="el-icon-edit">复制</el-button>]
  </div>
</template>
<script>
export default {
  name: 'copy',
  props: {
    msg: [String, Number]
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onCopy() {
      this.$utils.messagetip.successTip('已复制');
    },
    onError() {
      this.$utils.messagetip.warningTip('复制失败');
    }
  }
};
</script>
<style lang="stylus" scoped>
.copy
  display inline-block
  color: rgb(64, 158, 255)
</style>
