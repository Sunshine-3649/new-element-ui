<template>
  <div class="needpurchaseauditdetail">
    <div class="title">基本信息</div>
    <el-form
      label-width="150px"
      size="mini"
    >
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="要货单编号：">
            {{ searchParams.orderNo }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="要货门店：">
            {{ searchParams.sellName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="期望到货日期：">
            {{ searchParams.expectTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">要货商品明细</div>
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="exportTableData" icon="circle-cross" size="mini" :loading="disabledDownLoad" :disabled='isTableDisabled'>{{disabledDownLoad?'下载中':'导出明细'}}</el-button>
        <p style="width: 30%;display: inline-block;line-height: 28px;text-align: right">要货总sku数：{{searchParams.count}}</p>
        <p style="width: 10%;display: inline-block;line-height: 28px;text-align: center">|</p>
        <p style="width: 30%;display: inline-block;line-height: 28px;text-align: left">要货数量：{{searchParams.amount}}</p>
      </div>
      <el-table
        :data="skuDetailList"
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
          width="150"
          prop="skuCode"
          label="商品SKU编号"
        > </el-table-column>
        <el-table-column
          align="center"
          width="80"
          prop="realInventory"
          label="实时库存"
        >
          <template slot-scope="scope">
            <div class="btn" @click="showNum(scope.row.skuCode)">{{scope.row.realInventory}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
          prop="barCode"
          label="条形码"
        > </el-table-column>
        <el-table-column
          align="center"
          width="80"
          prop="barCode"
          label="销售单位"
        >
          <template slot-scope="scope">
            <div>
              {{checkedType("marketUnit",scope.row.marketUnit)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="specInfo"
          label="规格"
        > </el-table-column>
        <el-table-column
          align="center"
          width="100"
          prop="minNum"
          label="最小要货数量"
        ></el-table-column>
        <el-table-column
          align="center"
          width="80"
          prop="amount"
          label="要货数量"
        ></el-table-column>
        <el-table-column
          align="center"
          width="100"
          prop="proposedAmount"
          label="采购建议数量"
        >
        <template slot-scope="scope">
          <div>
            <el-input v-model="scope.row.proposedAmount" placeholder="" size="mini"></el-input>
          </div>
        </template>
        </el-table-column>
      </el-table>
      <div class="title radiut">审核记录：</div>
      <div>
      <el-row >
        <el-col v-if="logInfoList && logInfoList.length" :span="2" style="text-align: right;">审核记录：</el-col>
        <el-col :span="22">
          <el-table :data="logInfoList" style="width: 100%; margin-bottom: 10px" border >
            <el-table-column prop="type" label="审核节点" align="center"></el-table-column>
            <el-table-column prop="status" label="审核结果" align="center">
              <template slot-scope='scope'>
                <div v-if='scope.row.status'>{{scope.row.status}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="createOperator" label="审核人" align="center">
              <template slot-scope='scope'>
                <div v-if='scope.row.createOperator'>{{scope.row.createOperator}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="审核时间" align="center">
              <template slot-scope='scope'>
                <div v-if='scope.row.createTime'>{{scope.row.createTime}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="审核意见" align="center">
              <template slot-scope='scope'>
                <div v-if='scope.row.remark'>{{scope.row.remark}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        </el-row>
        <el-row style="width: 100%; margin: 10px 0">
          <el-col :span="2">
            <div style="text-align: right;">审核结果：</div>
          </el-col>
          <el-col :span="19">
            <el-radio-group v-model="status">
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核驳回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="width: 100%; margin: 10px 0">
          <el-col :span="2">
            <div style="text-align: right;">审核意见：</div>
          </el-col>
          <el-col :span="19">
            <el-input type="textarea" :rows="4" maxlength="100" placeholder="驳回时必填，最多不超过100个字符" v-model="remark">
            </el-input>
          </el-col>
        </el-row>
        <div style="text-align:center; margin:20px 0">
          <el-button
            v-if="searchParams.status === 0"
            size="mini"
            @click="toAudit"
            :disabled="isAudit"
            type="primary"
          >提交</el-button>
          <el-button
            :disabled="isAudit"
            @click="back()"
            size="mini"
          >返回</el-button>
        </div>
      </div>
    </el-form>
    <stockcheck v-if="isStockDetail" :isStockDetail='isStockDetail' :skuCodeStr='skuCodeStr' @closeDetail='closeStockCheck'></stockcheck>
  </div>
</template>
<script>
import stockcheck from '@/components/stockcheck.vue';
export default {
  name: 'needpurchaseauditdetail',
  data() {
    return {
      isAudit: false, // 审核按钮disabled
      status: 1, // 审核状态
      remark: '', // 备注
      totalCount: 0, // 明细总页数
      skuDetailList: [], // 明细列表
      detailParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        orderNo: this.$route.params.id
      },
      disabledDownLoad: false,
      isTableDisabled: false,
      isStockDetail: false,
      skuCodeStr: '',
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
      orderNo: this.$route.params.id,
      auditOpinion: '',
      disableBtn: false,
      disableBtn1: false
    };
  },
  components: {
    stockcheck
  },
  mounted: function() {
    this.initDetailData();
    this.getLogInfo();
  },
  methods: {
    closeStockCheck() {
      this.isStockDetail = false;
    },
    showNum(skuCode) {
      this.skuCodeStr = skuCode;
      this.isStockDetail = true;
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.GET('/yaohuo/auditList', {orderNo: this.orderNo}).then(res => {
        this.logInfoList = res.result;
      });
    },
    toAudit() {
      let skuCode = '';
      let list = [];
      let isNull = false;
      let isType = false;
      if (this.skuDetailList && this.skuDetailList.length) {
        this.skuDetailList.forEach(item => {
          if (!item.proposedAmount && !skuCode) {
            skuCode = item.skuCode;
            isNull = true;
          }
          let numReg2 = /^[0-9]+$/;
          if (item.proposedAmount && !numReg2.test(item.proposedAmount) && !skuCode) {
            skuCode = item.skuCode;
            isType = true;
          }
          let obj = {};
          obj.sku = item.skuCode;
          obj.amount = item.proposedAmount;
          list.push(obj);
        });
      }
      if (isNull && this.status === 1) {
        this.$utils.messagetip.warningTip('采购建议数量不能为空！');
        return;
      }
      if (isType && this.status === 1) {
        this.$utils.messagetip.warningTip('采购建议数量只能为正整数！');
        return;
      }
      if (this.status === 2 && !this.remark) {
        this.$utils.messagetip.warningTip('审核驳回时审核意见不能为空！');
        return;
      }
      let params = {
        auditType: 1, // 审核类型-采购
        orderNo: this.orderNo,
        status: this.status, // 审核结果
        remark: this.remark,
        skus: list
      };
      this.isAudit = true;
      this.submitAudit(params);
    },
    submitAudit(params) {
      this.$AXIOS.JSONPUT('/yaohuo/audit', params, true).then(res => {
        console.log(res);
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({
          path: '/needpurchaseaudit'
        });
      }).finally(() => {
        this.isAudit = false;
      });
    },
    back() {
      this.$router.push({
        path: '/needpurchaseaudit'
      });
    },
    checkedType(type, val) {
      if (val !== '' && val !== null) {
        return this.$utils.querydiction(type, val);
      }
    },
    initDetailData() {
      this.$AXIOS.GET('/yaohuo/detail', {orderNo: this.orderNo}).then(res => {
        this.searchParams = res.result;
      });
      this.$AXIOS.LISTGET('/yaohuo/detailPage', this.detailParams).then(res => {
        this.skuDetailList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
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
    },
    // 导出
    exportTableData() {
      let params = {
        orderNo: this.orderNo
      };
      this.disabledDownLoad = true;
      this.$AXIOS.EXPORT({url: '/yaohuo/export', data: params, fileName: '要货申请明细'}).then(res => {

      }).finally(() => {
        this.disabledDownLoad = false;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.needpurchaseauditdetail
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
  .btn
    cursor: pointer
    color: blue
</style>
