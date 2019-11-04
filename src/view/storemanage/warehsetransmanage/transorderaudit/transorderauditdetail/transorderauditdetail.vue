<template>
  <div class="transorderauditdetail">
    <div v-if="editOrDetail">调拨单审核详情</div>
    <div v-else>调拨单审核</div>
    <div class="title">基本信息</div>
    <el-form
      label-width="150px"
      size="mini"
    >
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="调拨单编号：">
            {{ searchParams.allocateOrderCode }}
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="editOrDetail">
          <el-form-item label="审核状态：">
            <span v-if="$route.params.isAuditStatus == '1'">待审核</span>
            <span v-else>已审核</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调出仓库：">
            {{ searchParams.outWarehouseName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调入仓库：">
            {{ searchParams.inWarehouseName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="24">
          <el-form-item label="备注：">
            {{ searchParams.memo }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">收发件人信息</div>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="发件人：">
            {{searchParams.sender}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发件人手机：">
            {{ searchParams.senderMobile }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发件方省份.城市.地区：">
            {{ searchParams.senderProvinceName }}.{{ searchParams.senderCityName }}.{{ searchParams.senderDistrictName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发件方详细地址：">
            <div class="content">{{ searchParams.senderAddress }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="收件人：">
            {{searchParams.receiver}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件人手机：">
            {{ searchParams.receiverMobile }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件方省份.城市.地区：">
            {{ searchParams.receiverProvinceName }}.{{ searchParams.receiverCityName }}.{{ searchParams.receiverDistrictName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件方详细地址：">
            <div class="content">{{ searchParams.receiverAddress }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">商品明细</div>
      <el-table
        :data="searchParams.skuDetailList"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
          prop=""
          label="序号"
          width="50"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="skuName"
          label="商品SKU名称"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="skuCode"
          label="商品SKU编号"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="specNatureInfo"
          label="规格"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="skuNo"
          label="货号"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="barCode"
          label="条形码"
        > </el-table-column>
        <el-table-column
          align="center"
          prop="brandName"
          label="品牌名称"
        > </el-table-column>
        <el-table-column
          align="center"
          prop=""
          label="调拨库存类型"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryType == '1'">正品</span>
            <span v-if="scope.row.inventoryType == '2'">残品</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="inventoryNum"
          :label="$route.params.isAuditStatus == '1' ? '调出仓库实时库存' : '调出仓库审核时库存'"
        >
          <template slot-scope="scope">
            <div v-if="$route.params.isAuditStatus == '1' && scope.row.inventoryNum !== '' &&  scope.row.inventoryNum !== null" :style="scope.row.inventoryNum*1 < scope.row.planAllocateNum ? 'background:red;color:#ffffff' : ''">{{ scope.row.inventoryNum }}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="planAllocateNum"
          label="计划调拨数量"
        > </el-table-column>
      </el-table>
      <div class="title radiut">审核信息</div>
      <div v-show="!editOrDetail">
        <el-form-item
          v-if="logInfoList && logInfoList.length"
          label="审核记录："
        >
          <el-table :data="logInfoList" style="width: 100%; margin-bottom: 10px" border >
          <el-table-column prop="operation" label="审核结果" align="center"></el-table-column>
          <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
          <el-table-column prop="operateTimeString" label="审核时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="审核意见" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
        <el-form-item label="审核意见：">
          <el-input
            v-model="auditOpinion"
            maxlength="1500"
            type="textarea"
          ></el-input>
          驳回时必填,最多不超过1500个字符
        </el-form-item>
        <div style="text-align:center;">
          <el-button
            size="mini"
            :disabled="disableBtn || disableBtn1"
            @click="confirm('0')"
            type="primary"
          >通过</el-button>
          <el-button
            size="mini"
            :disabled="disableBtn1"
            @click="confirm('1')"
            type="primary"
          >驳回</el-button>
          <el-button
            @click="back()"
            size="mini"
          >取消</el-button>
        </div>
      </div>
      <div v-show="editOrDetail">
        <ul class="audit_status">
          <li>
            <span>当前状态：</span>
            <span v-if="$route.params.isAuditStatus == '1'">待审核</span>
            <span v-else>已审核</span>
          </li>
          <li>
            <span>当前审核结果：</span>
            <span v-if="$route.params.isAuditStatus === '1'">无</span>
            <span v-if="$route.params.isAuditStatus === '2'">审核通过</span>
            <span v-if="$route.params.isAuditStatus === '3'">审核驳回</span>
          </li>
        </ul>
        <div style="padding: 10px 0">审核记录：</div>
        <el-table :data="logInfoList" style="width: 100%; margin-bottom: 10px" border >
          <el-table-column prop="operation" label="审核结果" align="center"></el-table-column>
          <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
          <el-table-column prop="operateTimeString" label="审核时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="审核意见" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center; margin:20px 0">
          <el-button
            v-if="searchParams.auditStatus == 1"
            size="mini"
            @click="toAudit"
            type="primary"
          >审核</el-button>
          <el-button
            @click="back()"
            size="mini"
          >返回</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
export default {
  name: 'transorderauditdetail',
  data() {
    return {
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        filterFlag: '1',
        // operateType: 0,
        entityType: 'AllocateOrder',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      searchParams: {},
      tableData: [],
      code: this.$route.params.id,
      editOrDetail: this.$route.params.auditResult === '1',
      auditOpinion: '',
      disableBtn: false,
      disableBtn1: false
    };
  },
  mounted: function() {
    this.operateParams.entityId = this.code;
    console.log(this.editOrDetail);
    this.initDetailData();
    this.getLogInfo();
  },
  methods: {
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    toAudit() {
      this.editOrDetail = false;
      this.initDetailData();
    },
    back() {
      this.$router.push({
        path: '/transorderaudit'
      });
    },
    initDetailData() {
      let flag = '1';
      if (this.$route.params.isAuditStatus !== '1') {
        flag = '0';
      }
      this.$AXIOS.GET('/allocateOrder/editGet/' + this.code + `?flag=${flag}`).then(res => {
        this.searchParams = res.result;
        this.searchParams.skuDetailList.map(item => {
          if (
            item.inventoryNum < item.planAllocateNum
          ) {
            this.auditOpinion = '调出仓库实时库存不足！';
            this.disableBtn = true;
          }
        });
      });
    },
    confirm(auditResult) {
      if (auditResult === '1' && !this.auditOpinion) {
        this.$utils.messagetip.warningTip('请填写审核意见');
        return;
      }
      let data = {
        id: this.code,
        auditOpinion: this.auditOpinion,
        auditResult
      };
      this.disableBtn1 = true;
      this.$AXIOS
        .PUT('/allocateOrder/audit/' + this.code, data, true)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.back();
        })
        .finally(() => {
          this.disableBtn1 = false;
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.transorderauditdetail
  .title
    background-color: #f5f7fa
    color: #909399
    padding: 10px
    font-size: 14px
    margin: 10px 0
  .title.radiut
    color: #409eff
    background-color: #ecf8ff
  .audit_status
    display: flex
    padding: 10px
    margin: 20px 0 10px 0
    border: solid 1px #999
    li
      padding-right: 50px
  .content
    width: 69%
    height: 50px
    overflow-y: auto
    display: inline-block
    line-height 28px
</style>
