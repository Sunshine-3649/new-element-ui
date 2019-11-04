<template>
  <div class="accreddetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <section class="info">
        <p>
          <span class="title">用户编号：</span>
          <span class="desc">{{accredDetail.userCode}}</span>
        </p>
        <p>
          <span class="title">用户姓名：</span>
          <span class="desc">{{accredDetail.userName}}</span>
        </p>
        <p>
          <span class="title">手机号：</span>
          <span class="desc">{{accredDetail.mobile}}</span>
        </p>
        <p>
          <span class="title">所属分销商：</span>
          <span class="desc" style="cursor: pointer;color: #409EFF"  @click="toDetail(accredDetail.distributorCode)">
            {{accredDetail.distributorName}}
          </span>
        </p>
        <p>
          <span class="title">状态：</span>
          <span class="desc">{{checkStatu(accredDetail.isValid)}}</span>
        </p>
        <p>
          <span class="title">备注：</span>
          <span class="desc">{{accredDetail.memo}}</span>
        </p>
        <p>
          <span class="title">创建人：</span>
          <span class="desc">{{accredDetail.createOperator}}</span>
        </p>
        <p>
          <span class="title">创建时间：</span>
          <span class="desc">{{accredDetail.createTime}}</span>
        </p>
      </section>
    </el-card>
    <!-- 编辑 -->
    <div class="btn">
      <el-button type="primary" @click="toAccredAddOrEdit(accredDetail.id)" size="mini">编辑</el-button>
      <el-button @click="back" size="mini">返回列表</el-button>
    </div>

    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>

<script>
import operateTable from 'components/operateTable';
export default {
  name: 'accreddetail',
  data() {
    return {
      operateParams: {
        entityType: 'BusiDistributorAuthorization',
        entityId: ''
      }, // 日志
      isLogInfo: false, // 日志弹窗
      accredDetail: {}, // 详情
      id: '', // 请求参数
      isRefresh: 0  // 是否刷新数据
    };
  },
  components: {
    operateTable
  },
  mounted() {
    this.id = this.$route.params.id;
    this.operateParams.entityId = this.id;
    this.distributorAuthorDetail();
  },
  methods: {
      // 打开操作明细的弹窗
    openOperateDialog() {
        this.isRefresh += 1;
        this.isLogInfo = true;
    },
    checkStatu(value) {
      let name = '';
      if (value === '0') {
        name = '停用';
      } else {
        name = '启用';
      }
      return name;
    },
    // 操作日志弹窗关闭
    closeOperate() {
      this.isLogInfo = false;
    },
    // 获取数据详情
    distributorAuthorDetail() {
      this.GET(
        '/distributorAuthor/distributorAuthorDetail/' + this.id,
        this.searchParams
      ).then(res => {
        if (res.code === '200') {
          this.accredDetail = res.body;
        }
      });
    },
    toAccredAddOrEdit(id) {
      this.$router.push({
        path: '/distributoraccred/accredaddoredit/' + id
      });
    },
    // 分销商管理详情页
    toDetail(id) {
      this.$router.push({path: '/distributormanage/managedetail/' + id});
    },
    back() {
      this.$router.push({
        name: 'distributoraccred'
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.box-card
  margin-bottom: 15px
.info
  p
    font-size 14px
    line-height: 26px
.btn
  text-align: center
  line-height: 60px
  background-color: rgb(242, 242, 242)
</style>
