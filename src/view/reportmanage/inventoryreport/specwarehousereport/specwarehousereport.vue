<template>
  <div class="specwarehousereport" v-loading="disabledDownLoad"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="box">
      <!-- 必选条件 -->
      <div class="line"></div>
      <span class="title">必选条件</span>
      <div class="tab_group">
        <p class="tab">
          <span class="tag" style="border: none">
            <span class="tip_red"></span>仓库：</span>
            <span class="ware_right">
              <el-select v-model="searchParams.warehouseCode" placeholder="请选择" filterable size="mini">
                <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code"></el-option>
              </el-select>
              <!-- <el-button size="mini" style="margin-bottom: 15px" v-for="(item, i) in warehouseList" :key="i" :class="isCode === i ? 'active' : ''" @click='choseWarehouse(item.code, i)'>{{item.warehouseName}}</el-button> -->
            </span>
        </p>
        <p class="tab">
          <span class="tag" style="border: none">
            <span class="tip_red"></span>报表类型：</span>
          <el-button size="mini" :class="isType === 1 ? 'active' : ''" @click="toggleType(1)">总库存</el-button>
          <el-button size="mini" :class="isType === 2 ? 'active' : ''" @click="toggleType(2)">入库明细</el-button>
          <el-button size="mini" :class="isType === 3 ? 'active' : ''" @click="toggleType(3)">出库明细</el-button>
        </p>
        <p class="tab">
          <span class="tag" style="border: none">
            <span class="tip_red"></span>库存类型：</span>
          <el-button size="mini" :class="isState === 1 ? 'active' : ''" @click="toggleState(1)">正品</el-button>
          <el-button size="mini" :class="isState === 2 ? 'active' : ''" @click="toggleState(2)">残品</el-button>
        </p>
        <p class="tab">
          <span class="tag" style="border: none">
            <span class="tip_red"></span>时间范围：</span>
          <el-radio v-model="radio" label="1">
            按日期&nbsp;
            <el-date-picker v-model="searchParams.startDate" type="date" :picker-options="pickerOptions1" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" :disabled="radio === '2'"></el-date-picker>&nbsp;-&nbsp;
            <el-date-picker v-model="searchParams.endDate" type="date"  :picker-options="pickerOptions2" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" :disabled="radio === '2'"></el-date-picker>
            <span class="tip">&nbsp;注：日期间隔不能大于31天。</span>
          </el-radio>
          <br>
          <span class="tag" style="border: none;"></span>
          <el-radio v-model="radio" label="2">
            按年月&nbsp;
            <el-select v-model="year" placeholder="请选择" size="mini" style="margin-top: 15px;" @change='changeYear' :disabled="radio === '1'">
              <el-option v-for="item in yearList" :key="item.id" :label="item.id" :value="item.id"></el-option>
            </el-select>&nbsp;&nbsp;
            <el-select v-model="month" placeholder="请选择" size="mini" :disabled="radio === '1' || !year">
              <el-option v-for="item in monthList" :key="item.id" :label="item.id" :value="item.id"></el-option>
            </el-select>
            <span class="tip">&nbsp;注：不能选择当前年月以及当前之后的年月。</span>
          </el-radio>
        </p>
      </div>
      <!-- 必选条件 -->
      <div class="line"></div>
      <span class="title">可选条件</span>
      <div class="tab_group">
        <!-- 表单 -->
        <el-form :model="searchParams" ref="queryForm" label-width="150px" class="search_form" size="medium">
          <el-row :span="20">
            <el-col :span="6">
              <el-form-item label="SKU编号：" size="mini">
                <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="条形码：" size="mini">
                <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SKU名称：" size="mini">
                <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 3">
              <el-form-item label="出库单编号：" size="mini">
                <el-input v-model.trim="searchParams.outboundOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 3">
              <el-form-item label="仓库反馈出库单编号：" size="mini">
                <el-input v-model.trim="searchParams.warehouseOutboundOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 3">
              <el-form-item label="销售渠道订单号：" size="mini">
                <el-input v-model.trim="searchParams.sellChannelCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 3">
              <el-form-item label="出库类型：" size="mini">
                <el-select v-model="searchParams.stockOperationType" placeholder="请选择">
                  <el-option
                    v-for="item in stockOperationTypeOutList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 2">
              <el-form-item label="入库单编号：" size="mini">
                <el-input v-model.trim="searchParams.purchaseOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 2">
              <el-form-item label="仓库反馈入库单编号：" size="mini">
                <el-input v-model.trim="searchParams.warehousePurchaseOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 2">
              <el-form-item label="入库类型：" size="mini">
                <el-select v-model="searchParams.stockOperationType" placeholder="请选择">
                  <el-option
                    v-for="item in stockOperationTypeInList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isType === 2">&nbsp;</el-col>
            <el-col :span="6">
              <el-form-item size="mini">
                <el-button type="primary" icon="search" :loading="isClick" @click="searchFormData">查询</el-button>
                <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between" style="margin-top: 15px">
      <el-col style="line-height: '32px'">
        <!-- <el-button type="primary" size="mini" @click="downloadCurrReport" :disabled='tableDataList && !tableDataList.length'>下载当前报表</el-button> -->
        <el-button type="primary" size="mini" @click="moduleDownLoad" :disabled='disabledDownLoad'>下载当前报表</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 总库存-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 1" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- :height="currentHeight" -->
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row class="price_list" :data="tableDataList" border>
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
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 400px;height: 400px" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" >查询结果：暂无</div>
    </div>
    <!-- 入库明细-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 2" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row class="price_list" :data="tableDataList" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="入库仓库名称" prop="warehouseName" width="195" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存类型" prop="stockType" width="80" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkStockType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column label="入库时间" prop="entryTime" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库类型" prop="operationType" width="140"  align="center">
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
        <el-table-column label="系统备注" prop="remark" align="center" >
          <template slot-scope="scope">
            <div v-html="scope.row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 400px;height: 400px" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">查询结果：暂无</div>
    </div>
    <!-- 出库明细-正品/残品 -->
    <div style="width: 100%;" v-if="isType === 3" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table v-if="tableDataList && tableDataList.length" ref="multipleTable" highlight-current-row class="price_list" :data="tableDataList" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="出库仓库名称" prop="warehouseName" width="195" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存类型" prop="stockType" width="80" align="center">
          <template slot-scope="scope">
            {{checkStockType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column label="出库时间" prop="outboundTime" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库类型" prop="operationType" width="140"  align="center">
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
        <el-table-column label="系统备注" prop="remark" align="center" >
          <template slot-scope="scope">
            <div v-html="scope.row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="border: solid 1px #ccc;text-align: center;line-height: 40px;">查询结果：暂无</div>
    </div>
    <div v-if="isType === 0" style="border: solid 1px #ccc;text-align: center;line-height: 400px;height: 400px" v-loading="isClick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" >查询结果：暂无</div>
    <div style='text-align: center;margin-top: 15px'>
      <el-button type="default" size="mini" @click="back">关闭</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'specwarehousereport',
  data() {
    return {
      isClick: false,
      disabledDownLoad: false,
      stockOperationTypeOutList: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '销售出库',
          id: '1'
        },
        {
          name: '调拨出库',
          id: '2'
        },
        {
          name: '退货出库',
          id: '3'
        },
        {
          name: '盘亏出库',
          id: '4'
        },
        {
          name: '正残品互转出库',
          id: '5'
        },
        {
          name: '其他出库',
          id: '6'
        },
        {
          name: '虚拟出库',
          id: '7'
        }
      ],
      stockOperationTypeInList: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '采购入库',
          id: '1'
        },
        {
          name: '退货入库',
          id: '2'
        },
        {
          name: '调拨入库',
          id: '3'
        },
        {
          name: '盘盈入库',
          id: '4'
        },
        {
          name: '正残品互转入库',
          id: '5'
        },
        {
          name: '其他入库',
          id: '6'
        },
        {
          name: '虚拟入库',
          id: '7'
        }
      ],
      value13: [],
      pickerOptions1: {
        disabledDate: time => {
          if (this.searchParams.endDate) {
            return time.getTime() < new Date(this.searchParams.endDate).getTime() - 2678400000 || time.getTime() > new Date(this.searchParams.endDate).getTime() || time.getTime() > Date.now();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          if (this.searchParams.startDate) {
            return time.getTime() < (new Date(this.searchParams.startDate).getTime() - 86400000) || time.getTime() > new Date(this.searchParams.startDate).getTime() + 2592000000 || time.getTime() > Date.now();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      warehouseList: [],
      isCode: -1, // 选中的code
      starDay: '',
      endDay: '',
      radio: '1', // 时间范围
      year: '', // 下拉年
      month: '', // 下拉月
      yearList: [], // 年列表
      monthList: [], // 月列表
      tableDataList: [], // 列表数据
      isType: 0, // 报表类型 默认显示的表格
      isState: 0, // 库存类型
      totalCount: 0,
      searchParams: {
        warehouseCode: '', // 仓库code
        stockType: '', // 库存类型
        reportType: '', // 报表类型
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        skuCode: '', // skuCode
        barCode: '', // 条形码
        skuName: '', // SKU名称
        outboundOrderCode: '', // 出库单编号
        warehouseOutboundOrderCode: '', // 仓库反馈出库单编号
        sellChannelCode: '', // 销售渠道订单号
        purchaseOrderCode: '', // 入库单编号
        warehousePurchaseOrderCode: '', // 仓库反馈入库单编号
        stockOperationType: '', // 出入库类型
        pageNo: 1,
        pageSize: 10,
        start: 0
      } // 请求参数
    };
  },
  watch: {
    radio(o, n) {
      if (n === '1') {
        this.searchParams.startDate = '';
        this.searchParams.endDate = '';
      } else {
        this.year = new Date().getFullYear();
        this.month = '';
        this.searchParams.date = '';
      }
    }
  },
  computed: {
    timeline() {
      if (this.searchParams.startDate) {
        let lastDate = new Date(this.searchParams.startDate).getTime() + 1123200000;
        let lastDateYear = new Date(lastDate).getFullYear();
        let lastDateMonth = new Date(lastDate).getMonth() + 1 < 10 ? '0' + new Date(lastDate).getMonth() + 1 : new Date(lastDate).getMonth() + 1;
        let lastDateDay = new Date(lastDate).getDay();
        let lastDateStr = lastDateYear + '-' + lastDateMonth + '-' + lastDateDay;
        return [this.searchParams.startDate + '00:00:00', lastDateStr + '00:00:00'];
      }
      return ['00:00:00', '23:59:59'];
    },
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
    this.getList();
    this.getWareHourseList();
  },
  methods: {
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
      let url = '/scm-web/report/downloadOtherReport?' + qs.stringify(params);
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
    getList() {
      this.yearList = [];
      this.monthList = [];
      let curYear = new Date().getFullYear();
      let curMon = new Date().getMonth() + 1;
      for (let i = 2018; i <= curYear; i++) {
        let obj = { id: i };
        this.yearList.push(obj);
      }
      for (let i = 1; i < curMon; i++) {
        i = i < 10 ? '0' + i : i;
        let obj = { id: i };
        this.monthList.push(obj);
      }
      this.year = new Date().getFullYear();
    },
    // 获取初始化数据
    getInitDataList() {
      this.tableDataList = [];
      this.isClick = true;
      this.$AXIOS.LISTGET('/report/reportPageList', this.searchParams).then(res => {
        this.tableDataList = res.result || [];
        this.totalCount = res.totalCount || 0;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 获取仓库列表
    getWareHourseList() {
      this.$AXIOS.LISTGET('/report/warehouseList').then(res => {
        this.warehouseList = res.result || [];
      });
    },
    // 下载当前报表
    downloadCurrReport() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/scm-web/report/downloadOtherReport?' + qs.stringify(params));
    },
    choseWarehouse(code, i) {
      this.isCode = i;
      this.searchParams.warehouseCode = code;
    },
    searchFormData() {
      this.searchParams.reportType = this.isType;
      this.searchParams.stockType = this.isState;
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择仓库！');
        return;
      }
      if (!this.searchParams.reportType) {
        this.$utils.messagetip.warningTip('请先选择报表类型！');
        return;
      }
      if (!this.searchParams.stockType) {
        this.$utils.messagetip.warningTip('请先选择库存类型！');
        return;
      }
      // 判断单选
      if (this.radio === '1') {
        if (!this.searchParams.startDate || !this.searchParams.endDate) {
          this.$utils.messagetip.warningTip('请先选择日期！');
          return;
        }
      } else {
        if (!this.year) {
          this.$utils.messagetip.warningTip('请先选择年！');
          return;
        }
        if (!this.month) {
          this.$utils.messagetip.warningTip('请先选择月！');
          return;
        }
        this.searchParams.date = this.year + '-' + this.month;
      }
      // 判断报表类型
      if (this.searchParams.reportType === 1) {
        this.searchParams.outboundOrderCode = '';
        this.searchParams.warehouseOutboundOrderCode = '';
        this.searchParams.sellChannelCode = '';
        this.searchParams.purchaseOrderCode = '';
        this.searchParams.warehousePurchaseOrderCode = '';
      } else if (this.searchParams.reportType === 2) {
        this.searchParams.outboundOrderCode = '';
        this.searchParams.warehouseOutboundOrderCode = '';
        this.searchParams.sellChannelCode = '';
      } else if (this.searchParams.reportType === 3) {
        this.searchParams.purchaseOrderCode = '';
        this.searchParams.warehousePurchaseOrderCode = '';
      }
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.searchParams.pageSize = 10;
      this.getInitDataList();
    },
    resetForm() {
      this.isState = 0;
      this.isType = 0;
      this.radio = '1';
      this.month = '';
      this.tableDataList = [];
      this.totalCount = 0;
      this.searchParams = {
        warehouseCode: '', // 仓库code
        stockType: '', // 库存类型
        reportType: '', // 报表类型
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        skuCode: '', // skuCode
        barCode: '', // 条形码
        skuName: '', // SKU名称
        outboundOrderCode: '', // 出库单编号
        warehouseOutboundOrderCode: '', // 仓库反馈出库单编号
        sellChannelCode: '', // 销售渠道订单号
        purchaseOrderCode: '', // 入库单编号
        warehousePurchaseOrderCode: '', // 仓库反馈入库单编号
        stockOperationType: '', // 出入库类型
        pageNo: 1,
        pageSize: 10,
        start: 0
      }; // 请求参数
      // let isTrue = false;
      // if (this.radio === '2' && this.year && this.month) {
      //   this.searchParams.date = this.year + '-' + this.month + '-01';
      // } else if (this.radio === '1' && this.searchParams.startDate && this.searchParams.endDate && new Date(this.searchParams.endDate).getTime() - new Date(this.searchParams.startDate).getTime() <= 1123200000) {
      //   isTrue = true;
      // }
      // if (this.searchParams.warehouseCode && this.searchParams.stockType && this.searchParams.reportType && (this.searchFormData.date || isTrue)) {
      //   this.getInitDataList();
      // }
    },
    changeYear(val) {
      let currYear = new Date().getFullYear();
      if (val < currYear && val >= 2018) {
        this.monthList = [];
        for (let i = 1; i <= 12; i++) {
          i = i < 10 ? '0' + i : i;
          let obj = { id: i };
          this.monthList.push(obj);
        }
      } else {
        this.getList();
      }
    },
    toggleType(type) {
      this.isType = type;
      this.searchParams.reportType = this.isType;
      // 判断报表类型
      if (this.searchParams.reportType === 1) {
        this.searchParams.outboundOrderCode = '';
        this.searchParams.warehouseOutboundOrderCode = '';
        this.searchParams.sellChannelCode = '';
        this.searchParams.purchaseOrderCode = '';
        this.searchParams.warehousePurchaseOrderCode = '';
        this.searchParams.stockOperationType = '';
      } else if (this.searchParams.reportType === 2) {
        this.searchParams.outboundOrderCode = '';
        this.searchParams.warehouseOutboundOrderCode = '';
        this.searchParams.sellChannelCode = '';
        this.searchParams.stockOperationType = '';
      } else if (this.searchParams.reportType === 3) {
        this.searchParams.purchaseOrderCode = '';
        this.searchParams.warehousePurchaseOrderCode = '';
        this.searchParams.stockOperationType = '';
      }
      this.tableDataList = [];
      this.totalCount = 0;
    },
    toggleState(state) {
      this.isState = state;
      this.searchParams.stockType = this.isState;
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
      } else if (val === '2') {
        typeStr = '代销商品';
      }
      return typeStr;
    },
    back() {
      this.resetForm();
      this.$router.push({path: '/inventoryreport'});
    }
  }
};
</script>
<style lang="stylus" scoped>
.specwarehousereport
  .box
    padding: 20px 20px 0 20px
    border: solid 1px #cccccc
    background: rgb(242, 242, 242)
    .tip
      color: red
    .line
      width: 100%
      height: 1px
      background: #000
    .title
      width: 80px
      line-height: 30px
      text-align: center
      display: inline-block
      font-weight: 900
      position: relative
      top: -15px
      left: 30px
      background: rgb(242, 242, 242)
    .active
      color: #409EFF
      border-color: #c6e2ff
      background-color: #ecf5ff
    .tab_group
      padding: 0 20px 0 20px
      margin-top: -20px
      border-radius: 10px
      .tab
        padding: 10px 0px
        &:last-child
          border: none
        .tag
          width: 100px
          display: inline-block
          line-height: 28px
          text-align: right
          border-right: solid 1px #000
          &:last-child
            border: none
        .ware_right
          width: 40%
          display: inline-block
          vertical-align: top
  .paging
    text-align: right
</style>
