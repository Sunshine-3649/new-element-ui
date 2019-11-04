<template>
  <div class="invoiceManageDetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button> -->
      </div>
      <section class="info">
        <!-- 第一行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">发货单编号：</span>
              <span class="desc">{{ sendOutDetail.outboundOrderCode}}</span>
              <copy :msg="sendOutDetail.outboundOrderCode"></copy>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">所属订单编号：</span>
              <span class="desc">{{sendOutDetail.shopOrderCode}}</span>
              <copy :msg="sendOutDetail.shopOrderCode"></copy>
            </p>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">发货单状态：</span>
              <span class="desc">{{checkedStatus(sendOutDetail.status)}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">地址信息：</span>
              <span class="desc">{{sendOutDetail.receiverProvince}}&nbsp;&nbsp;{{sendOutDetail.receiverCity}}&nbsp;&nbsp;{{sendOutDetail.receiverDistrict}}&nbsp;&nbsp;{{sendOutDetail.receiverAddress}}&nbsp;&nbsp;{{sendOutDetail.receiverName}}&nbsp;&nbsp;{{sendOutDetail.receiverMobile}}</span>
              <!-- <copy :msg="sendOutDetail.receiverProvince + sendOutDetail.receiverCity + sendOutDetail.receiverDistrict + sendOutDetail.receiverAddress + sendOutDetail.receiverName + sendOutDetail.receiverMobile"></copy> -->
            </p>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">运输方式：</span>
              <span class="desc">{{checkedType(sendOutDetail.typeOfTransportation)}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">供应商：</span>
              <span class="desc btn" @click='toSupplierDetail(sendOutDetail.supplierCode)'>{{sendOutDetail.supplierName}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">分销商：</span>
              <span class="desc btn" @click='toDistriDetail(sendOutDetail.distributorCode)'>{{sendOutDetail.distributorName}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">发货单备注：</span>
              <span class="desc">
                <span style="width: 23px">
                  <img v-if="sendOutDetail.flagLevel === 1" src="../1.png" style="width: 23px" alt="">
                  <img v-else-if="sendOutDetail.flagLevel === 2" src="../2.png" style="width: 23px" alt="">
                  <img v-else-if="sendOutDetail.flagLevel === 3" src="../3.png" style="width: 23px" alt="">
                  <img v-else-if="sendOutDetail.flagLevel === 4" src="../4.png" style="width: 23px" alt="">
                  <img v-else-if="sendOutDetail.flagLevel === 5" src="../5.png" style="width: 23px" alt="">
                </span>
                {{sendOutDetail.memo}}
              </span>
            </p>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">创建时间：</span>
              <span class="desc">{{sendOutDetail.createTime}}</span>
            </p>
          </el-col>
        </el-row>
      </section>
    </el-card>
    <!-- 商品信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <!-- 表格 -->
      <el-table :data="sendOutDetail.busiOutboundOrderItemVOList " border >
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center">
          <template slot-scope="scope">
            {{scope.row.skuName}}
          </template>
        </el-table-column>
        <el-table-column label="SKU编码" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="映射SKU编码" prop="supplierSkuCode" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.supplierSkuCode">{{scope.row.supplierSkuCode}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="销售属性" prop="salePropertys" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="已发/应发" prop="skuCode" align="center" >
          <template slot-scope="scope">
            {{scope.row.sendNum}}/{{scope.row.num}}
          </template>
        </el-table-column>
        <el-table-column label="采购单价" prop="purchasePrice" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.purchasePrice || scope.row.purchasePrice !== '0' || scope.row.purchasePrice !== 0">{{scope.row.purchasePrice | tofixed}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="分销单价" prop="distributorPrice" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.distributorPrice || scope.row.distributorPrice !== '0' || scope.row.distributorPrice !== 0">{{scope.row.distributorPrice | tofixed}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="单件利润" prop="profit" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.profit && scope.row.profit < 0" style="color: red;">{{scope.row.profit | tofixed}}</div>
            <div v-else-if="scope.row.profit >= 0">{{scope.row.profit | tofixed}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="商品发货状态" prop="status" align="center">
          <template slot-scope="scope">
            {{checkedGoodStatus(scope.row.status)}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 发货记录 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发货记录</span>
      </div>
      <!-- 表格 -->
      <el-table ref="detaiTable" :data="sendOutDetail.orderLogisticsVOList" border style="width: 100%" align="center">
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
        <el-table-column prop="salePropertysName" label="销售属性" align="center"></el-table-column>
        <el-table-column prop="sellNum" label="发货数量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logisticsCorporationName" label="物流公司" align="center"></el-table-column>
        <el-table-column prop="waybillNumber" label="物流单号" align="center"></el-table-column>
        <el-table-column prop="skus" label="附加信息" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="发货时间" align="center"></el-table-column>
      </el-table>
    </el-card>
    <!-- 通讯日志 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>通讯日志</span>
      </div>
      <!-- 表格 -->
      <el-table :data="sendOutDetail.logInformationList" border style="width: 100%" align="center">
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="operation" label="发起方式" align="center"></el-table-column>
        <el-table-column prop="operator" label="发起人" align="center"></el-table-column>
        <el-table-column prop="operateTime" label="通讯时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑 -->
    <div class="btn_group">
      <el-button v-if="sendOutDetail.status !== 4" @click="requesAgain(sendOutDetail.id)" type="primary" size="mini">重发请求</el-button>
      <!-- <el-button v-else-if="" @click="requesAgain(sendOutDetail.id)" type="primary" size="mini">重发请求</el-button> -->
      <el-button @click="back" size="mini">返回</el-button>
    </div>
  </div>
</template>

<script>
import copy from 'components/copy';
import qs from 'qs';
export default {
  name: 'invoic eManageDetail',
  components: {
    copy
  },
  data() {
    return {
      sendOutDetail: {}, // 发货单详情
      id: '' // 列表传过来的参数
    };
  },
  filters: {
    tofixed(val) {
      let str = val.toString();
      if (str.indexOf('.') < 0 && str !== '0') {
        str = str + '.00';
      }
      return str;
    }
  },
  methods: {
    // 获取详情
    initDataDetail() {
      this.GET(`/busiOutboundOrder/queryOutboundOrderDetail/${this.id}`).then(res => {
        if (res.code === '200') {
          this.sendOutDetail = res.body;
        }
      });
    },
    // 发货状态翻译
    checkedStatus(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '待推送';
      } else if (status === 1) {
        statusStr = '推送失败';
      } else if (status === 2) {
        statusStr = '待发货';
      } else if (status === 3) {
        statusStr = '部分发货';
      } else if (status === 4) {
        statusStr = '全部发货';
      } else if (status === 5) {
        statusStr = '已取消';
      }
      return statusStr;
    },
    // 商品发货状态翻译
    checkedGoodStatus(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '待发货';
      } else if (status === 1) {
        statusStr = '部分发货';
      } else if (status === 2) {
        statusStr = '全部发货';
      } else if (status === 3) {
        statusStr = '取消';
      }
      return statusStr;
    },
    // 运输状态翻译
    checkedType(status) {
      let statusStr = '';
      if (status === '0') {
        statusStr = '快递';
      }
      return statusStr;
    },
    // 跳转供应商详情
    toSupplierDetail(code) {
      let obj = {
        hideLogs: '0',
        supplierCode: code,
        flag: '1'
      };
      let config = {
        title: '供应商详情',
        href: 'supplier/supplierDetail.html?' + qs.stringify(obj)
      };
      top.window.addTab(config);
    },
    // 跳转到分销商详情
    toDistriDetail(code) {
      this.$router.push({path: '/distributormanage/managedetail/' + code});
    },
    // 重发请求
    requesAgain(id) {
      this.GET('/busiOutboundOrder/resend/' + id).then(res => {
        if (res.code === '200') {
          this.initDataDetail();
          this.$utils.messagetip.successTip(res.body);
        }
      });
    },
    back() {
      this.$router.back();
    }
  },
  mounted: function() {
    this.id = this.$route.params.id;
    this.initDataDetail();
  }
};
</script>

<style lang="stylus" scoped>
.invoiceManageDetail
  font-size: 12px
  .btn
    color blue
    cursor pointer
    width 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .box-card
    margin-bottom: 15px
  .info
    p
      line-height: 26px
      .title
        font-weight: 700
  .btn_group
    text-align: center
    line-height: 60px
    background-color: rgb(242, 242, 242)
</style>
