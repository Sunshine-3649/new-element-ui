<template>
  <div class="ordermanagedetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <section class="info">
        <!-- 第一行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">订单编号：</span>
              <span class="desc">{{sendOutDetail.shopOrderCode}}</span>
              <copy :msg="sendOutDetail.shopOrderCode"></copy>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">外部编号：</span>
              <span class="desc">-</span>
              <copy msg="-"></copy>
            </p>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">地址信息：</span>
              <span class="desc">{{sendOutDetail.receiverProvince}}&nbsp;&nbsp;{{sendOutDetail.receiverCity}}&nbsp;&nbsp;{{sendOutDetail.receiverDistrict}}&nbsp;&nbsp;{{sendOutDetail.receiverAddress}}&nbsp;&nbsp;{{sendOutDetail.receiverName}}&nbsp;&nbsp;{{sendOutDetail.receiverMobile}}</span>
              <copy :msg="sendOutDetail.receiverProvince + sendOutDetail.receiverCity + sendOutDetail.receiverDistrict + sendOutDetail.receiverAddress + sendOutDetail.receiverName + sendOutDetail.receiverMobile"></copy>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">订单状态：</span>
              <span class="desc">{{sendOutDetail.orderStatus}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">分销商：</span>
              <span class="desc btn" @click='toDistriDetail(sendOutDetail.distributorCode)'>{{sendOutDetail.companyName}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">运输方式：</span>
              <span class="desc">{{sendOutDetail.typeOfTransportation}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">创建时间：</span>
              <span class="desc">{{sendOutDetail.createTime}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">创建人：</span>
              <span class="desc">{{sendOutDetail.createOperator}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">创建方式：</span>
              <span class="desc">{{sendOutDetail.createType}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">订单备注：</span>
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
      </section>
    </el-card>
    <!-- 商品信息 -->
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div> -->
      <!-- 表格 -->
      <el-table :data="sendOutDetail.orderItemDetailDTOList" border >
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center">
          <template slot-scope="scope">
            <div class="btn" @click="toGoodDetail(scope.row.spuCode)">{{scope.row.skuName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="SKU编码" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="salePropertys" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="分销单价" prop="price" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.price || scope.row.price !== '0' || scope.row.price === 0">{{scope.row.price | tofixed}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="已发" prop="sendNum" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="应发" prop="num" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品发货状态" prop="status" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商" align="center">
          <template slot-scope="scope">
            <div class="border bordernone" v-for="(item, i) in scope.row.orderLogisticsDTOS" :key="i">
              <div class="btn" @click="toSupplierDetail(item.supplierCode)">{{item.supplierShortCall ? item.supplierShortCall : item.supplierName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" align="center" >
          <template slot-scope="scope">
            <div class="border bordernone" v-for="(item, i) in scope.row.orderLogisticsDTOS" :key="i">
              {{item.itemNum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" align="center">
          <template slot-scope="scope">
            <div class="border bordernone"  v-for="(item, i) in scope.row.orderLogisticsDTOS" :key="i">
              <div>{{item.logisticsCorporationName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <div class="border bordernone" v-for="(item, i) in scope.row.orderLogisticsDTOS" :key="i">
              {{item.waybillNumber}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="附属信息" align="center">
          <template slot-scope="scope">
            <div class="border bordernone" v-for="(item, i) in scope.row.orderLogisticsDTOS" :key="i">
              {{item.subInfo}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑 -->
    <div class="btn_group">
      <el-button @click="back" size="mini">返回</el-button>
    </div>
    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>

<script>
import copy from 'components/copy';
import operateTable from 'components/operateTable';
import qs from 'qs';
export default {
  name: 'ordermanagedetail',
  components: {
    operateTable,
    copy
  },
  data() {
    return {
      operateParams: {
        entityType: 'BusiShopOrder',
        entityId: ''
      }, // 日志
      isLogInfo: false, // 日志弹窗
      isRefresh: 0,  // 是否刷新数据
      sendOutDetail: {}, // 发货单详情
      id: '' // 列表传过来的参数
    };
  },
  filters: {
    tofixed(val) {
      let str;
      if (val !== null ) {
        str = val.toString();
        if (str.indexOf('.') < 0 && str !== '0') {
          str = str + '.00';
        }
      }
      return str;
    }
  },
  methods: {
    // 获取详情
    initDataDetail() {
      this.GET(`/busiShopOrder/queryOrderDetail/${this.id}`).then(res => {
        if (res.code === '200') {
          this.sendOutDetail = res.body.orderDetailDTO;
          this.operateParams.entityId = res.body.orderDetailDTO.id;
          if (this.sendOutDetail.orderItemDetailDTOList && this.sendOutDetail.orderItemDetailDTOList.length) {
            this.sendOutDetail.orderItemDetailDTOList.forEach(item => {
              if (item.orderLogisticsDTOS && item.orderLogisticsDTOS.length) {
                item.orderLogisticsDTOS.forEach(subItem => {
                  subItem.itemNum = item.sendNum;
                });
              }
            });
          }
        }
      });
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
    // 跳转到商品详情页
    toGoodDetail(spuCode) {
      if (spuCode) {
        this.$router.push({
          path: '/goodmanage/gooddetail/' + spuCode
        });
      }
    },
    // 跳转到分销商详情
    toDistriDetail(code) {
      this.$router.push({path: '/distributormanage/managedetail/' + code});
    },
    // 重发请求
    requesAgain(outboundOrderCode) {
      this.GET('/busiOutboundOrder/resend/' + outboundOrderCode).then(res => {
        if (res.code === '200') {
          this.$message({
            type: 'success',
            message: res.message
          });
        }
      });
    },
    back() {
      this.$router.back();
    },
    // 操作日志弹窗关闭
    closeOperate() {
      this.isLogInfo = false;
    },
    // 打开操作明细的弹窗
    openOperateDialog() {
        this.isRefresh += 1;
        this.isLogInfo = true;
    }
  },
  mounted: function() {
    this.id = this.$route.params.id;
    this.initDataDetail();
  }
};
</script>

<style lang="stylus" scoped>
.ordermanagedetail
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
  .border
    width: 100%;
    text-align: center;
    border-bottom: solid 1px #f5f7fa;
  .bordernone:last-child
    border: none;

</style>
