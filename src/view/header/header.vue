<template>
  <div class="header-view">
    <h2 class="title">泰然SCM管理系统</h2>
    <ul class="logout">
      <li>
        {{title}}
      </li>
      <li v-if="title!=='登录'" style="cursor: pointer" >
        <span v-if="!loading">退出</span>
        <i v-else class="el-icon-loading"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
        return {
            loading: false
        };
    },
    computed: {
        title: function() {
            let path = this.$route.path;
            switch (path) {
            case '/login':
                return '登录';
            case '/channels':
                return '业务线';
            default:
                return '业务模块';
            }
        }
    },
    methods: {}
  };
</script>
<style scoped="" lang="less">
  .header-view {
    background-color: rgb(50, 64, 87);
    color: #fff;
    padding-left: 40px;
    padding-right: 40px;
    height: 60px;
    line-height: 60px;
    .title {
      float: left;
      font-size: 16px;
      letter-spacing: 2px;
    }
    .side-nav {
      float: left;
      margin-left: 20px;
      border: none;
    }
    .logout {
      float: right;
      li {
        position: relative;
        display: inline-block;
        min-width: 80px;
        text-align: center;
      }
      li:first-child {
        font-weight: bold;
      }
      li:first-child:before {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: #99d2fc;
      }
    }
    .login-out {
      cursor: pointer;
    }
  }
</style>
