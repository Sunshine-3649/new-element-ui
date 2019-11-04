<template>
  <div class="specialquery" v-loading="disabledDownLoadfail || disabledDownLoad"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <p class="title">"{{$route.params.year}}年{{$route.params.month}}月"仓库 [ {{$route.params.warehouseName}} ] 库存报表</p>
    <div class="tab_group">
      <p class="tab">
        <span class="tag" style="border: none">报表类型：</span>
        <span class="tag" :class="isType === 1 ? 'btn' : 'defbtn'" @click="toggleType(1)">总库存</span>
        <span class="tag" :class="isType === 2 ? 'btn' : 'defbtn'" @click="toggleType(2)">入库明细</span>
        <span class="tag" :class="isType === 3 ? 'btn' : 'defbtn'" @click="toggleType(3)">出库明细</span>
      </p>
      <p class="tab">
        <span class="tag" style="border: none">库存类型：</span>
        <span class="tag" :class="isState === 1 ? 'btn' : 'defbtn'" @click="toggleState(1)">正品</span>
        <span class="tag" :class="isState === 2 ? 'btn' : 'defbtn'" @click="toggleState(2)">残品</span>
      </p>
    </div>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col style="line-height: '32px'">
        <!-- <el-button type="primary" size="mini" @click="downloadFullReport">下载全部报表</el-button>
        <el-button type="primary" size="mini" @click="downloadCurrReport" :disabled='tableDataList && !tableDataList.length'>下载当前报表</el-button> -->
        <el-button type="primary" size="mini" @click="moduleDownLoadfail" :disabled='disabledDownLoadfail'>下载全部报表</el-button>
        <el-button type="primary" size="mini" @click="moduleDownLoad" :disabled='disabledDownLoad'>下载当前报表</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 总库存-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 1">
      <!-- :height="currentHeight" -->
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row  class="price_list" :data="tableDataList" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="仓库名称" prop="warehouseName" width="195" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存类型" prop="stockType" width="80" align="center">
          <template slot-scope="scope">
            {{checkStockType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode"  width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU名称" prop="skuName"  width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属类目" prop="categoryName" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品类别" prop="goodsType" align="center">
          <template slot-scope="scope">
            {{checkGoodsType(scope.row.goodsType)}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="specInfo" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="期初数量" prop="initialQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售出库数量" prop="outboundQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售出库实付总金额（元）" prop="outboundTotalAmount" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="退货入库数量" prop="salesReturnQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="采购入库数量" prop="purchaseQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="含税采购总金额（元）" prop="purchaseTotalAmount"  width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="退供应商出库数量" prop="supplierReturnOutboundQuantity"  width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="退供应商出库金额（元）" prop="suppliderReturnTotalAmount"  width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="调拨入库数量" prop="allocateInQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="调拨出库数量" prop="allocateOutQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="盘盈入库数量" prop="inventoryProfitQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="盘亏出库数量" prop="inventoryLossesQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :label="isState === 1 ? '残品转正品入库数量' : '正品转残品入库数量'" prop="defectiveToNormal" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column :label="isState === 1 ? '正品转残品出库数量' : '残品转正品出库数量'" prop="normalToDefective" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="其他入库数量" prop="otherIn" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="其他出库数量" prop="otherOut" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="本期入库总数量" prop="entryTotalQuantity" align="center"  width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="本期出库总数量" prop="outboundTotalQuantity" align="center" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="期末结存数量" prop="balanceTotalQuantity" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 40px;">查询结果：暂无</div>
    </div>
    <!-- 入库明细-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 2">
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row  class="price_list" :data="tableDataList" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="入库仓库名称" prop="warehouseName" width="195" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存类型" prop="stockType" width="80" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkStockType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column label="入库时间" prop="entryTime" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库类型" prop="operationType"  width="140"  align="center">
          <template slot-scope="scope">
            {{checkOperationType(scope.row.operationType)}}
          </template>
        </el-table-column>
        <el-table-column label="入库单编号" prop="orderCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库反馈入库单编号" prop="warehouseOrderCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商编号" prop="supplierCode" align="center" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商名称" prop="supplierName" align="center" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品类别" prop="goodsType" align="center">
          <template slot-scope="scope">
            {{checkGoodsType(scope.row.goodsType)}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="specInfo" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划入库数量" prop="entryQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="含税采购单价（元）" prop="price" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="含税采购总金额（元）" prop="totalPrice" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际入库数量" prop="realQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="未入库数量" prop="residualQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="调出仓库" prop="allocateOutWarehouseName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道订单号" prop="shopOrderCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="系统备注" prop="remark" align="center">
          <template slot-scope="scope">
            <div v-html="scope.row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 40px;">查询结果：暂无</div>
    </div>
    <!-- 出库明细-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 3">
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row  class="price_list" :data="tableDataList" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="出库仓库名称" prop="warehouseName" width="195" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存类型" prop="stockType" width="80" align="center">
          <template slot-scope="scope">
            {{checkStockType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column label="出库时间" prop="outboundTime" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库类型" prop="operationType"  width="140"  align="center">
          <template slot-scope="scope">
            {{checkOperationTypeOut(scope.row.operationType)}}
          </template>
        </el-table-column>
        <el-table-column label="出库单编号" prop="outboundOrderCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库反馈出库单编号" prop="warehouseOutboundOrderCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="平台订单号" prop="platformOrderCode" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道订单号" prop="sellChannelCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品订单号" prop="goodsOrderCode" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isState === 1" label="店铺名称" prop="shopName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品类别" prop="goodsType" align="center">
          <template slot-scope="scope">
            {{checkGoodsType(scope.row.goodsType)}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="specInfo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="计划出库数量" prop="outboundQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售单价（元）" prop="salesPrice" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售总价（元）" prop="salesTotalAmount" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售出库实付总金额（元）" prop="payment" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际出库数量" prop="realQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="未出库数量" prop="residualQuantity" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="收货人" prop="receiver" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="收货人手机" prop="mobile" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="收货地址" prop="address" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="快递公司" prop="express" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="快递单号" prop="waybillNumber" align="center" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="退供应商出库金额（元）" prop="outboundSupplierAmount" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="调入仓库" prop="allocateInWarehouseName" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单备注" prop="orderRemark" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="系统备注" prop="remark" align="center">
          <template slot-scope="scope">
            <div v-html="scope.row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 40px;">查询结果：暂无</div>
    </div>
    <div style='text-align: center;margin-top: 15px'>
      <el-button type="default" size="mini" @click="back">关闭</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'specialquery',
  data() {
    return {
      disabledDownLoad: false,
      disabledDownLoadfail: false,
      totalCount: 0, // 列表总条数
      searchParams: {
        reportType: '',
        stockType: '',
        date: '',
        warehouseCode: '',
        pageNo: 1,
        pageSize: 10,
        start: 0
      }, // 列表入参
      tableDataList: [{ specNatureInfo: '123' }], // 列表数据
      isType: 1, // 报表类型 默认显示的表格
      isState: 1 // 库存类型
    };
  },
  computed: {
    // 当前表格高度
    currentHeight() {
      let height = 432;
      if (this.tableDataList && this.tableDataList.length) {
        if (this.tableDataList.length > 10) {
          height = 35 * this.tableDataList.length + 85;
        } else {
          height = 432;
        }
      }
      return height;
    }
  },
  created() {
    this.searchParams.reportType = this.isType;
    this.searchParams.stockType = this.isState;
    console.log(this.$route.params);
    this.searchParams.date = this.$route.params.year + '-' + this.$route.params.month;
    // this.searchParams.date = this.$route.query.year + '-' + '09' + '-01';
    // this.searchParams.warehouseCode = 'CK00236';
    this.searchParams.warehouseCode = this.$route.params.warehouseCode;
    this.getInitDataList();
  },
  methods: {
     moduleDownLoadfail() {
      if (this.tableDataList && !this.tableDataList.length) {
        this.$utils.messagetip.warningTip('下载的列表数据不能为空');
        return;
      }
      this.disabledDownLoadfail = true;
      let params = {
        warehouseCode: this.searchParams.warehouseCode,
        date: this.searchParams.date
      };
      let url = '/scm-web/report/downloadAllForWarehouse?' + qs.stringify(params);
      axios({
        // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // 处理返回的文件流
        console.log(res);
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = '全部报表.zip'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }).finally(() => {
        this.disabledDownLoadfail = false;
      });
    },
     moduleDownLoad() {
      if (this.tableDataList && !this.tableDataList.length) {
        this.$utils.messagetip.warningTip('下载的列表数据不能为空');
        return;
      }
      this.disabledDownLoad = true;
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      let url = '/scm-web/report/downloadCurrentForWarehouse?' + qs.stringify(params);
      axios({
        // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // 处理返回的文件流
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = '当前报表.xls'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }).finally(() => {
        this.disabledDownLoad = false;
      });
    },
    // 获取列表数据
    getInitDataList() {
      this.tableDataList = [];
      this.disabledDownLoadfail = true;
      this.$AXIOS.LISTGET('/report/reportPageList', this.searchParams).then(res => {
        this.tableDataList = res.result || [];
        this.totalCount = res.totalCount || 0;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      }).finally(() => {
        this.disabledDownLoadfail = false;
      });
    },
    // 下载全部报表
    downloadFullReport() {
      let params = {
        warehouseCode: this.searchParams.warehouseCode,
        date: this.searchParams.date
      };
      window.open('/scm-web/report/downloadAllForWarehouse?' + qs.stringify(params));
    },
    // 下载当前报表
    downloadCurrReport() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/scm-web/report/downloadCurrentForWarehouse?' + qs.stringify(params));
    },
    toggleType(type) {
      this.isType = type;
      this.searchParams.reportType = this.isType;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = 10;
      this.searchParams.start = 0;
      this.getInitDataList();
    },
    toggleState(state) {
      this.isState = state;
      this.searchParams.stockType = this.isState;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = 10;
      this.searchParams.start = 0;
      this.getInitDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.searchParams.start = 0;
      this.getInitDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.getInitDataList();
    },
    // 库存类别翻译
    checkStockType(val) {
      let typeStr = '';
      if (val === '1') {
        typeStr = '正品';
      } else if (val === '2') {
        typeStr = '残品';
      }
      return typeStr;
    },
    // 入库类型翻译
    checkOperationType(val) {
      let typeStr = '';
      if (val === '1') {
        typeStr = '采购入库';
      } else if (val === '2') {
        typeStr = '退货入库';
      } else if (val === '3') {
        typeStr = '调拨入库';
      } else if (val === '4') {
        typeStr = '盘盈入库';
      } else if (val === '5') {
        if (this.isType === 2 && this.isState === 1) {
          typeStr = '残品转正品入库';
        } else if (this.isType === 2 && this.isState === 2) {
          typeStr = '正品转残品入库';
        } else if (this.isType === 3 && this.isState === 1) {
          typeStr = '正品转残品出库';
        } else if (this.isType === 3 && this.isState === 2) {
          typeStr = '残品转正品出库';
        } else {
          typeStr = '正残品互转入库';
        }
      } else if (val === '6') {
        typeStr = '其他入库';
      } else if (val === '7') {
        typeStr = '虚拟入库';
      }
      return typeStr;
    },
    // 出库类型翻译
    checkOperationTypeOut(val) {
      let typeStr = '';
      if (val === '1') {
        typeStr = '销售出库';
      } else if (val === '2') {
        typeStr = '调拨出库';
      } else if (val === '3') {
        typeStr = '退货出库';
      } else if (val === '4') {
        typeStr = '盘亏出库';
      } else if (val === '5') {
        if (this.isType === 2 && this.isState === 1) {
          typeStr = '残品转正品入库';
        } else if (this.isType === 2 && this.isState === 2) {
          typeStr = '正品转残品入库';
        } else if (this.isType === 3 && this.isState === 1) {
          typeStr = '正品转残品出库';
        } else if (this.isType === 3 && this.isState === 2) {
          typeStr = '残品转正品出库';
        } else {
          typeStr = '正残品互转出库';
        }
      } else if (val === '6') {
        typeStr = '其他出库';
      } else if (val === '7') {
        typeStr = '虚拟出库';
      }
      return typeStr;
    },
    // 商品类别翻译
    checkGoodsType(val) {
      let typeStr = '';
      if (val === '1') {
        typeStr = '小泰良品（自销）';
      } else if (val === '2') {
        typeStr = '非小泰良品（自销）';
      } else if (val === '3') {
        typeStr = '代销商品';
      }
      return typeStr;
    },
    back() {
      this.$router.push({path: '/inventoryreport'});
    }
  }
};
</script>
<style lang="stylus" scoped>
.specialquery
  .title
    font-size: 16px
    text-align: center
    line-height: 50px
  .defbtn
    cursor: pointer
  .btn
    cursor: pointer
    color: blue
  .tab_group
    padding: 15px 20px
    margin-bottom: 15px
    border: solid 1px #cccccc
    background: rgb(242, 242, 242)
    border-radius: 10px
    .tab
      padding: 10px 0px
      border-bottom: dotted 1px #cccccc
      &:last-child
        border: none
      .tag
        width: 80px
        display: inline-block
        text-align: center
        border-right: solid 1px #000
        &:last-child
          border: none
  .paging
    text-align: right
</style>
