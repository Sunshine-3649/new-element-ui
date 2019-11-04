<template>
  <div class="purchasegroupdetail">
    <el-row>
      <el-col :span="2" class="title">采购组编号：</el-col>
      <el-col :span="6" class="content">{{itemDetail.code}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="2" class="title">采购组名称：</el-col>
      <el-col :span="6" class="content">{{itemDetail.name}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="2" class="title">采购组组长：</el-col>
      <el-col :span="6" class="content">{{itemDetail.leaderName}}</el-col>
    </el-row>
    <el-row v-if="itemDetail.memberNameList.length > 1" v-for="(item, i) in itemDetail.memberNameList" :key="i">
      <el-col :span="2" class="title">采购组组员：</el-col>
      <el-col :span="6" class="content">{{item}}</el-col>
    </el-row>
    <el-row v-if="itemDetail.memberName && !itemDetail.memberNameList" >
      <el-col :span="2" class="title">采购组组员：</el-col>
      <el-col :span="6" class="content">{{itemDetail.memberName}}</el-col>
    </el-row>
    <!-- <el-row >
      <el-col :span="2" class="title">备注：</el-col>
      <el-col :span="12" class="content" style="height: auto;">
        {{itemDetail.remark}}
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="2" class="title">状态：</el-col>
      <el-col :span="6" class="content">
        <el-radio v-model="itemDetail.isValid" label="1" :disabled='!isDisabled'>启用</el-radio>
        <el-radio v-model="itemDetail.isValid" label="0" :disabled='isDisabled'>停用</el-radio>
      </el-col>
    </el-row>
    <div style="text-align: center;">
      <el-button size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'purchasegroupdetail',
    data() {
      return {
        status: '1',
        isDisabled: false,
        itemDetail: {} // 详情
      };
    },
    created() {
      this.id = this.$route.params.id;
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.$AXIOS.GET('/purchase/purchaseGroupCode/' + this.id).then(res => {
        if (res.appcode === '1') {
          this.itemDetail = res.result;
          if (this.itemDetail.isValid === '1') {
            this.isDisabled = true;
          }
          if (this.itemDetail.memberName.indexOf(',') > -1) {
            this.itemDetail.memberNameList = this.itemDetail.memberName.split(',');
          }
        }
      });
      },
      back() {
        this.$router.push({path: '/purchasesgroup'});
      }
    }
  };
</script>
<style lang="stylus" scoped>
.purchasegroupdetail
  .title, .content
    display: inline-block
    line-height 23px
  .title
    width: 150px
    text-align: right
    text-align right
    vertical-align top
  .content
    height: 47px
    overflow-y: auto
</style>


