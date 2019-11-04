<template>
  <div class="needapplydetail">
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
          <div>{{scope.row.proposedAmount}}</div>
        </template>
        </el-table-column>
      </el-table>
      <div class="title radiut">审核记录：</div>
      <div>
        <el-form-item
          v-if="logInfoList && logInfoList.length"
          label="审核记录："
        >
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
        </el-form-item>
        <div style="text-align:center; margin:20px 0">
          <!-- <el-button
            v-if="searchParams.auditStatus == 1"
            size="mini"
            @click="toAudit"
            type="primary"
          >审核</el-button> -->
          <el-button
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
  name: 'needapplydetail',
  data() {
    return {
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
    checkedType(type, val) {
      if (val !== '' && val !== null) {
        return this.$utils.querydiction(type, val);
      }
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.GET('/yaohuo/auditList', {orderNo: this.orderNo}).then(res => {
        this.logInfoList = res.result;
      });
    },
    toAudit() {
      this.editOrDetail = false;
      this.initDetailData();
    },
    back() {
      this.$router.push({
        path: '/needapplymanage'
      });
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
.needapplydetail
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
