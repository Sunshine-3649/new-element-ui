<template>
  <div class="warenoticorderdetail">
    <!-- 基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="info">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">采购单编号：</div>
            <div class="content">{{itemDetail.purchaseOrderCode}}</div>
          </el-col>
          <el-col :span="6" v-if="isFlag">
            <div class="title">单据状态：</div>
            <div class="content" style="color: blue;">{{checkedTableStatus(itemDetail.status)}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">入库状态：</div>
            <div class="content" style="color: blue;">{{checkedWareStatus(itemDetail.warehouseNoticeStatus)}}</div>
          </el-col>
          <el-col :span="6">
            <div class=""></div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6">
            <div class="title tip_red">供应商名称：</div>
            <div class="content">{{itemDetail.supplierName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">采购合同：</div>
            <div class="content">{{itemDetail.contractCode}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">采购类型：</div>
            <div class="content">{{itemDetail.purchaseTypeName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">付款方式：</div>
            <div class="content" v-if="itemDetail.payType === 'deliveryAfterPayment'">{{itemDetail.payTypeName}} &nbsp;&nbsp;&nbsp;预付款比例： {{itemDetail.paymentProportion}}%</div>
            <div class="content" v-else>{{itemDetail.payTypeName}}</div>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="6">
            <div class="title tip_red">归属采购组：</div>
            <div class="content">{{itemDetail.purchaseGroupName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">归属采购人：</div>
            <div class="content">{{itemDetail.purchasePerson}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">币制：</div>
            <div class="content">{{itemDetail.currencyTypeName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">收货仓库：</div>
            <div class="content">{{itemDetail.warehouseName}}</div>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="6">
            <div class="title tip_red">收货人：</div>
            <div class="content">{{itemDetail.receiver}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">收货人手机：</div>
            <div class="content">{{itemDetail.receiverNumber}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">运输费用承担方：</div>
            <div class="content">{{itemDetail.transportFeeDestIdName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">提运单号：</div>
            <div class="content">{{itemDetail.takeGoodsNo}}</div>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row>
          <el-col :span="6">
            <div class="title tip_red">要求到货日期：</div>
            <div class="content">{{itemDetail.requriedReceiveDate}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">截至到货日期：</div>
            <div class="content">{{itemDetail.endReceiveDate}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">处理优先级：</div>
            <div class="content">{{itemDetail.handlerPriorityName}}级</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">采购总金额：</div>
            <div class="content">{{itemDetail.totalFee}}元</div>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">备注：</div>
            <div class="content">{{itemDetail.remark}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title"></div>
            <div class="content"></div>
          </el-col>
          <el-col :span="6">
            <div class="title"></div>
            <div class="content"></div>
          </el-col>
          <el-col :span="6">
            <div class="title"></div>
            <div class="content"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--  -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>发件方信息</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="6">
            <div class="title tip_red">发件人：</div>
            <div class="content">{{itemDetail.sender}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">发件方手机：</div>
            <div class="content">{{itemDetail.senderNumber}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">发件方省份.城市：</div>
            <div class="content">{{itemDetail.senderProvinceName}}.{{itemDetail.senderCityName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title tip_red">发件方详细地址：</div>
            <div class="content">{{itemDetail.senderAddress}}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 商品明细 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品明细</span>
      </div>
      <el-table ref="multipleTable" :data="itemDetailList" highlight-current-row border tooltip-effect="dark">
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="商品SKU名称" prop="skuName" align="center"></el-table-column>
        <el-table-column label="商品SKU编号" prop="spuCode" align="center"></el-table-column>
        <el-table-column label="规格" prop="specNatureInfo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="brandName" align="center"></el-table-column>
        <el-table-column label="含税单价(元)" prop="purchasePrice" align="center"></el-table-column>
        <el-table-column label="采购税率" prop="taxRate" align="center"></el-table-column>
        <el-table-column label="采购总金额(元)" prop="totalPurchaseAmount" align="center"></el-table-column>
        <el-table-column label="批次号" prop="batchCode" align="center"></el-table-column>
        <el-table-column label="生产编码" prop="produceCode" align="center"></el-table-column>
        <el-table-column label="生产日期" prop="productDate" align="center"></el-table-column>
        <el-table-column label="截止保质日期" prop="expireDate" align="center"></el-table-column>
        <el-table-column label="理论保质期限(天)" prop="shelfLifeDays" align="center"></el-table-column>
        <el-table-column label="采购数量" prop="purchasingQuantity" align="center"></el-table-column>
        <el-table-column label="入库状态" prop="status" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.receiveStatus || scope.row.receiveStatus === '0'">{{checkedWareStatus(scope.row.receiveStatus)}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="仓库反馈入库信息" prop="shelfLifeDays" align="center">
          <el-table-column label="实际入库时间" prop="storageTime" align="center"></el-table-column>
          <el-table-column label="实际入库总量" prop="actualStorageQuantity" align="center"></el-table-column>
          <el-table-column label="正品入库数量" prop="normalStorageQuantity" align="center"></el-table-column>
          <el-table-column label="残次品入库数量" prop="defectiveStorageQuantity" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 审核意见 -->
    <el-card class="info" v-show="false">
      <div slot="header" class="clearfix">
        <span>审核信息</span>
      </div>
      <!-- 查看详情时显示： -->
      <el-row v-if="isFlag" style="line-height: 47px;">
        <el-col :span="20" >
          <div class="title">审核结果：</div>
          <div class="content">{{checkedStatus(isAuditStatus)}}</div>
        </el-col>
      </el-row>
      <el-row style="line-height: 47px;">
        <el-col :span="20" >
          <div class="title">审核意见：</div>
          <div class="content">{{itemDetail.auditOpinion}}</div>
        </el-col>
      </el-row>
      <!-- 审核时显示： -->
      <el-row v-if="!isFlag">
        <el-col :span="3">
          <div class="title">审核结果：</div>
        </el-col>
        <el-col :span="18">
          <el-input type="textarea" :rows="4" maxlength="1500" placeholder="驳回时必填，最多不超过1500个字符" v-model="textarea">
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <div class="group_btn">
      <el-button size="mini" v-if="isFlag" @click="toBack">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'warenoticorderdetail',
  data() {
    return {
      id: '', // 主键
      isAuditStatus: '', // 审核结果
      isFlag: false, // 显示详情
      itemDetail: {}, // 详情数据
      itemDetailList: [], // 详情数据商品明细
      textarea: '' // 审核意见
    };
  },
  created() {
    this.id = this.$route.params.id;
    if (this.$route.query.isAuditStatus) {
      this.isAuditStatus = this.$route.query.isAuditStatus;
    }
    console.log(this.$route);
    if (this.$route.query.flag === '1') {
      this.isFlag = true;
    }
    this.initDetail();
    this.getDetailList();
  },
  methods: {
    // 详情信息
    initDetail() {
      this.$AXIOS.GET('/purchase/purchaseOrderByCode/' + this.id).then(res => {
        if (res.appcode === '1') {
          this.itemDetail = res.result;
        }
      });
    },
    // 详情内商品明细
    getDetailList() {
      let params = {
        purchaseOrderCode: this.id,
        start: 0,
        pageIndex: 0
      };
      this.$AXIOS.LISTGET('/purchase/purchaseDetailByCode', params).then(res => {
        this.itemDetailList = res;
        if (this.itemDetailList && this.itemDetailList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.itemDetailList[0]);
          }, 20);
        }
      });
    },
    // 通过/驳回 接口
    putPurchaseOrderAudit(params) {
      this.$AXIOS.PUT('purchase/purchaseOrderAudit', params).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip('审核已通过');
          setTimeout(() => {
            this.$router.push({path: '/purchaseorderaudit'});
          }, 600);
        }
      });
    },
    // 页面翻译字段
    checkedStatus(status) {
      let statusStr = '';
      if (status === '1') {
        statusStr = '待审核';
      } else if (status === '2') {
        statusStr = '审核通过';
      } else if (status === '3') {
        statusStr = '审核驳回';
      }
      return statusStr;
    },
    // 单据状态翻译
    checkedTableStatus(status) {
      let statusStr = '';
      if (status === '0') {
        statusStr = '暂存';
      } else if (status === '1') {
        statusStr = '审核驳回';
      } else if (status === '2') {
        statusStr = '审核通过';
      } else if (status === '3') {
        statusStr = '提交审核';
      } else if (status === '6') {
        statusStr = '冻结';
      } else if (status === '7') {
        statusStr = '作废';
      } else if (status === '8') {
        statusStr = '入库通知';
      }
      return statusStr;
    },
    checkedWareStatus(warehouseNoticeStatus) {
      let wareStatusStr = '';
      if (warehouseNoticeStatus === '0') {
        wareStatusStr = '等待入库';
      } else if (warehouseNoticeStatus === '1') {
        wareStatusStr = '全部入库';
      } else if (warehouseNoticeStatus === '2') {
        wareStatusStr = '部分入库';
      } else if (warehouseNoticeStatus === '3') {
        wareStatusStr = '入库异常';
      } else if (warehouseNoticeStatus === '4') {
        wareStatusStr = '全部收货';
      }
      return wareStatusStr;
    },
    // 通过btn
    passPurchaseAudit() {
      let params = {
        purchaseOrderCode: this.itemDetail.purchaseOrderCode,
        payType: this.itemDetail.payType,
        status: '2'
      };
      this.$confirm('', '确认要通过吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putPurchaseOrderAudit(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 驳回btn
    returnPurchaseAudit() {
      let params = {
        purchaseOrderCode: this.itemDetail.purchaseOrderCode,
        payType: this.itemDetail.payType,
        auditOpinion: this.textarea,
        status: '3'
      };
      if (!params.auditOpinion) {
        this.$utils.messagetip.warningTip('审核意见不能为空');
        return;
      }
      this.$confirm('', '确认要驳回吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putPurchaseOrderAudit(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 跳转审核页面
    toPurchaseDetail() {
      this.isFlag = false;
    },
    // 取消返回
    toBack() {
      this.$router.push({path: '/warenoticordermanage'});
    }
  }
};
</script>
<style lang="stylus" scoped>
.warenoticorderdetail
  .el-card
    margin-bottom: 15px
  .info
    .title, .content
      display: inline-block
      line-height 23px
    .title
      width: 150px
      text-align: right
      width: 30%
      text-align right
      vertical-align top
    .content
      width: 69%
      height: 47px
      overflow-y: auto
  .group_btn
    text-align: center
</style>
