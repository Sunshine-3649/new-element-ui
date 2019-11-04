<template>
  <div class="directordermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6" class='input_def'>
          <el-form-item label="系统订单号：" size="mini">
            <el-input v-model.trim="searchParams.scmShopOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class='input_def'>
          <el-form-item label="销售渠道订单号：" size="mini">
            <el-input v-model.trim="searchParams.shopOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class='input_def'>
          <el-form-item label="收货人：" size="mini">
            <el-input v-model.trim="searchParams.receiverName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class='input_def'>
          <el-form-item label="店铺名称：" size="mini">
            <el-input v-model.trim="searchParams.shopName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6" class='input_def'>
          <el-form-item label="销售渠道：" size="mini">
            <el-select v-model="searchParams.sellCode" filterable placeholder="请选择">
              <el-option v-for="item in sellCodeList" :key="item.sellCode" :label="item.sellName" :value="item.sellCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class='input_def'>
          <el-form-item label="发货状态：" size="mini">
            <el-select v-model="searchParams.supplierOrderStatus" filterable placeholder="请选择">
              <el-option v-for="item in supplierOrderStatusList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class='input_def'>
          <el-form-item label="接收方式：" size="mini">
            <el-select v-model="searchParams.reciverType" filterable placeholder="请选择">
              <el-option v-for="item in reciverTypeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="付款日期：" size="mini">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="系统接收时间：" size="mini">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.startCreateTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.endCreateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单类型：" size="mini">
            <el-select v-model="searchParams.orderType" filterable placeholder="请选择">
              <el-option v-for="item in orderTypeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button v-if="channelCookie === 'YWX003'" size="mini" type="primary" @click="importAccount">订单导入</el-button>
        <el-dropdown v-else>
          <el-button type="primary" size="mini">
            订单导入<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding:0 5px; text-align: center;" >
              <el-button size="mini" type="text" @click="importAccount">自采商品订单导入</el-button>
            </el-dropdown-item>
            <el-dropdown-item style="padding:0 5px; text-align: center;">
              <el-button size="mini" type="text" @click="underimportAccount">代发商品订单导入</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button size="mini" type="primary" @click="exportOrder" :disabled='tableDataList && !tableDataList.length'>订单导出</el-button> -->
        <el-button type="primary" @click="moduleDownLoad" icon="circle-cross" size="mini" :loading="disabledDownLoad" :disabled='isTableDisabled'>{{disabledDownLoad?'下载中':'订单导出'}}</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" :height="currentHeight">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="系统订单号" prop="scmShopOrderCode" align="center" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售渠道订单号" prop="shopOrderCode" align="center" width='150' show-overflow-tooltip></el-table-column>
      <el-table-column label="销售渠道" prop="sellName" align="center" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="店铺名称" prop="shopName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="接收方式" prop="reciverType" align="center" width="60">
        <template slot-scope="scope">
          {{checkedReciverType(scope.row.reciverType)}}
        </template>
      </el-table-column>
      <el-table-column label="订单类型" prop="orderType" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{checkedOrderType(scope.row.orderType)}}
        </template>
      </el-table-column>
      <el-table-column label="收货人" prop="receiverName" align="center" width="80"></el-table-column>
      <el-table-column label="收货人手机号" prop="receiverMobile" align="center" width="90"></el-table-column>
      <el-table-column label="收货省.市.区" prop="requriedReceiveDate" align="center" width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.receiverProvince}}.{{scope.row.receiverCity}}.{{scope.row.receiverDistrict}}
        </template>
      </el-table-column>
      <el-table-column label="商品总数量" prop="itemNum" align="center" width="75"></el-table-column>
      <el-table-column label="实付总金额" prop="payment" align="center" width="90">
        <template slot-scope="scope">
          <div v-if="scope.row.payment || scope.row.payment === '0' || scope.row.payment === 0">￥{{scope.row.payment}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="发货状态" prop="supplierOrderStatus" align="center" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.supplierOrderStatus === '4'" style='color: green;'>{{checkedStatus(scope.row.supplierOrderStatus)}}</div>
          <div v-else-if="scope.row.supplierOrderStatus === '2'" style='color: red;'>{{checkedStatus(scope.row.supplierOrderStatus)}}</div>
          <div v-else style="color: orange;">{{checkedStatus(scope.row.supplierOrderStatus)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="付款时间" prop="payTime" width='120' align="center"></el-table-column>
      <el-table-column label="系统接收时间" prop="createTime" width='120' align="center"></el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1" style="background: #ccc;">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="btn" @click="toGoodDetail(scope.row)">{{scope.row.skuCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuCode" label="商品类型" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
              {{checkedItemType(scope.row.skuCode)}}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="交易数量" align="center"></el-table-column>
          <el-table-column prop="price" label="销售单价" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.price !=='' || scope.row.price !== null">￥{{scope.row.price}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="销售总价" align="center">
            <template slot-scope="scope">
              <div v-if="(scope.row.num !=='' || scope.row.num !== null) && (scope.row.price !=='' || scope.row.price !== null)">￥{{scope.row.num * scope.row.price | tofixed}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="payment" label="实付总金额" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.payment !=='' || scope.row.payment !== null">￥{{scope.row.payment}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="发货仓库/供应商" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="发货状态" prop="supplierOrderStatus" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{checkedOrderStatus(scope.row.supplierOrderStatus)}}
            </template>
          </el-table-column>
          <el-table-column label="物流信息" align="center">
            <el-table-column prop="logisticsCorporation" label="物流公司" align="center" >
              <template slot-scope="scope">
                <!-- <div class="border bordernone" v-for="(item, i) in scope.row.deliverPackageFormList" :key="i" >{{item.logisticsCorporation}}</div> -->
                <div v-if="scope.row.isStoreOrder === 2 && scope.row.supplierOrderStatus === '4'">-</div>
                <div v-else>
                  <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length" >
                    <div class="border bordernone"  v-for="(item, i) in scope.row.deliverPackageFormList" :key="i">
                      <div>{{item.logisticsCorporation}}</div>
                    </div>
                  </div>
                  <div v-else>-</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="batchCode" label="运单编号" align="center"  >
              <template slot-scope="scope">
                <div v-if="scope.row.isStoreOrder === 2 && scope.row.supplierOrderStatus === '4'">已自提</div>
                <div v-else>
                  <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length" >
                    <div class="border bordernone"  v-for="(item, i) in scope.row.deliverPackageFormList" :key="i">
                      <div>{{item.waybillNumber}}</div>
                    </div>
                  </div>
                  <div v-else>{{scope.row.waybillNumber ? scope.row.waybillNumber : '-'}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="produceCode" label="商品数量" align="center"  >
              <template slot-scope="scope">
                <!-- <div class="border bordernone" v-for="(item, i) in scope.row.deliverPackageFormList" :key="i">{{item.skuNum}}</div> -->
                <div v-if="scope.row.isStoreOrder === 2 && scope.row.supplierOrderStatus === '4'">-</div>
                <div v-else>
                  <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length" >
                    <div class="border bordernone"  v-for="(item, i) in scope.row.deliverPackageFormList" :key="i">
                      <div>{{item.skuNum}}</div>
                    </div>
                  </div>
                  <div v-else>-</div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column prop="produceCode" label="售后信息" align="center">
            <el-table-column prop="totalPurchaseAmount" label="售后状态" align="center"></el-table-column>
            <el-table-column prop="batchCode" label="售后数量" align="center"></el-table-column>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="收货信息" name="2">
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货人姓名：</div>
            <div class="content">{{tableRowDetail.receiverName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货人手机号：</div>
            <div class="content">{{tableRowDetail.receiverMobile}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货省份.城市.区域：</div>
            <div class="content">{{tableRowDetail.receiverProvince}}.{{tableRowDetail.receiverCity}}.{{tableRowDetail.receiverDistrict}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货详细地址：</div>
            <div class="content">{{tableRowDetail.receiverAddress}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="售后信息" name="3">
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="afterChangeSize" @current-change="afterChangeNumber" :current-page="afterParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="afterParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="afterCount">
          </el-pagination>
        </el-col>
        <el-table :data="afterDataList" style="width: 100%" border>
          <el-table-column label="售后单号" prop="afterSaleCode" align="center" show-overflow-tooltip>
            <template slot-scope='scope'>
              <span class='btn' @click='toAfterSaleDetail(scope.row.id)'>{{scope.row.afterSaleCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="btn" @click="toGoodDetail(scope.row)">{{scope.row.skuName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发起类型" prop="launchType" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{checkedLaunchType(scope.row.launchType)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="售后类型" prop="afterSaleType" align="center" >
            <template slot-scope="scope">
              <div>{{checkedAfterSaleType(scope.row.afterSaleType)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="售后单状态" prop="status" align="center">
            <template slot-scope="scope">
              <div>{{checkedAfterStatus(scope.row.status)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="正品入库数量" prop="inNum" align="center">
             <template slot-scope="scope">
              <div v-if="scope.row.inNum ||  scope.row.inNum === 0" >{{scope.row.inNum}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="残品入库数量" prop="defectiveInNum" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.defectiveInNum ||  scope.row.defectiveInNum === 0">{{scope.row.defectiveInNum}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="退货仓" prop="returnWarehouseName" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.returnWarehouseName">{{scope.row.returnWarehouseName}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="物流公司" prop="logisticsCorporation" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.logisticsCorporation">{{scope.row.logisticsCorporation}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="物流单号" prop="waybillNumber" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.waybillNumber">{{scope.row.waybillNumber}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="4">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">订单类型：</div>
            <div class="content">{{checkOrderType(tableRowDetail.type)}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">会员用户名：</div>
            <div class="content">{{tableRowDetail.userName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">实付总金额：</div>
            <div class="content">
              <div v-if="tableRowDetail.payment">￥{{tableRowDetail.payment}}&nbsp;(含运费：￥{{tableRowDetail.postageFee}}&nbsp;&nbsp;&nbsp;含税费：￥{{tableRowDetail.totalTax}})</div>
              <div v-else>-</div>
            </div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">买家留言：</div>
            <div class="content">{{tableRowDetail.buyerMessage}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">商家备注：</div>
            <div class="content">{{tableRowDetail.shopMemo}}</div>
          </el-col>
          <el-col :span="18" style="height: auto;line-height: 30px;">
            <el-col :span="8" style="margin-right: 20px">
              <div class="title">备注：</div>
              <div class="content" v-if="!isInput">{{tableRowDetail.tradeMemo}}</div>
              <el-input style="display: inline-block;width: 69%" size="mini" v-model.trim="tradeMemo" placeholder="" v-if="isInput"></el-input>
            </el-col>
            <el-button v-if="!isInput" style="display: inline-block" size="mini" type="primary" @click="edit" >修改</el-button>
            <el-button v-if="isInput" style="display: inline-block" size="mini" type="primary" @click="saveMemo">保存</el-button>
            <el-button v-if="isInput" style="display: inline-block" size="mini"  @click="isInput = false">取消</el-button>
          </el-col>
          <!-- <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title"></div>
            <div class="content"></div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title"></div>
            <div class="content"></div>
          </el-col> -->
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="5">
        <el-table :data="logInfoList" style="width: 100%" border>
          <el-table-column prop="operation" label="动作" align="center"></el-table-column>
          <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="operateTimeString" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <!-- 报价弹窗 -->
    <el-dialog title="自采商品订单导入" :visible.sync="isAccount" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='isLoading'>
       <div style="margin-bottom: 15px;" v-show="isResult === 'default'">
         <span class="tip_red"></span> 销售渠道：
         <el-select  v-model="sellCode" placeholder="请选择" size="mini" @change='sellCodeChange' filterable>
          <el-option
            v-for="item in ywxSellChannelListList" :key="item.sellCode" :label="item.sellName" :value="item.sellCode">
          </el-option>
        </el-select>
       </div>
       <div style="margin-bottom: 15px;" v-show="isResult === 'default'">
          <div style="display: inline-block;vertical-align: top;" >
            <span class="tip_red"></span> 发货仓库：
          </div>
          <div style="display: inline-block">
            <div>
              <p><el-radio v-model="isAppointStock" label="1" @change='isRadioChange'>由系统自动匹配</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;<span  style="color: #cccccc;">系统根据预先设定的匹配策略自动匹配发货仓库。</span></p>
              <p style="margin-top: 15px;line-height: 18px;"><el-radio v-model="isAppointStock" label="0" :disabled="isDisabled" @change='isRadioChange'>从指定仓库发货</el-radio>&nbsp;
                <el-select  v-model="warehouseCode" placeholder="请选择" size="mini" v-show="isShow" filterable>
                  <el-option
                    v-for="item in warehouseCodeList" :key="item.code" :label="item.warehouseName" :value="item.code">
                  </el-option>
                </el-select>&nbsp;
                <span style="color: #cccccc;">系统直接将指定的仓库作为导入订单的发货仓库，若库存不足也不会去匹配其他仓库。</span>
              </p>
            </div>
          </div>
       </div>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="upload" v-show="isResult === 'default'" :close-on-click-modal='false' class="upload-demo" :data='sellcodeObj' :before-upload="beforeAvatarUpload" drag action="/scm-web/order/orderImport" :on-success="uploadSuccess" :on-progress='uploadProgress' :on-error='uploadDefaul' :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <p style="line-height: 20px;">1、导入文件格式必须与模板完全一致；<a href='./static/download/order/orderTemplate.xls' style="color: blue;" target='_blank'>模板下载</a></p>
          <p style="line-height: 20px;">2、每次只能上传1个文件，每个文件不超过500条数据；</p>
          <p style="color: red;line-height: 20px;">3、同一个订单中只要存在一个异常商品整个订单都会导入失败，如有需要可删除异常商品后再导入；</p>
          <!-- <p style="color: red;line-height: 20px;">4、订单导入成功后就会立即通知供应商/仓库发货，请谨慎；</p> -->
          <p style="color: red;line-height: 20px;">4、已经导入成功的订单暂不支持重复导入，请检查订单内容正确无误。</p>
        </div>
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>订单导入成功</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>解析成功{{uploadResult.successCount}}条数据，解析失败{{uploadResult.failCount}}条数据。</p>
        <p>请点此
          <!-- <a :href="downloadFail" style="color: red;">下载文件</a> -->
          <el-button type="text" @click="moduleDownLoadfail" icon="circle-cross" :disabled="disabledDownLoadfail" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button @click="closeUpload" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 代发 -->
    <el-dialog title="代发商品订单导入" :visible.sync="underIsAccount" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='isUnderLoading'>
       <div style="margin-bottom: 15px;" v-show="isResult === 'default'">
         <span class="tip_red"></span> 销售渠道：
         <el-select  v-model="sellCode" placeholder="请选择" size="mini" @change='sellCodeChange' filterable>
          <el-option
            v-for="item in ywxSellChannelListList" :key="item.sellCode" :label="item.sellName" :value="item.sellCode">
          </el-option>
        </el-select>
       </div>
       <div style="margin-bottom: 15px;" v-show="isResult === 'default'">
          <div style="display: inline-block;vertical-align: top;" >
            <span class="tip_red"></span> 发货供应商：
          </div>
          <div style="display: inline-block; color: #666666;">
            京东慧采
          </div>
       </div>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadUnder" v-show="isResult === 'default'" :close-on-click-modal='false' class="upload-demo" :data='underSellcodeObj' :before-upload="underBeforeAvatarUpload" drag action="/scm-web/order/supplierOrderImport" :on-success="underUploadSuccess" :on-progress='underUploadProgress' :on-error='underUploadDefaul' :on-preview="underHandlePreview" :on-remove="underHandleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <p style="line-height: 20px;">1、导入文件格式必须与模板完全一致；<a href='./static/download/order/supplierOrderTemplate.xls' style="color: blue;" target='_blank'>模板下载</a></p>
          <p style="line-height: 20px;">2、每次只能上传1个文件，每个文件不超过500条数据；</p>
          <p style="color: red;line-height: 20px;">3、同一个订单中只要存在一个异常商品整个订单都会导入失败，如有需要可删除异常商品后再导入；</p>
          <p style="color: red;line-height: 20px;">4、已经导入成功的订单暂不支持重复导入，请检查订单内容正确无误。</p>
          <p style="line-height: 20px;">5、导入时若收货地址为直辖市，可将“收货省份”和“收货城市”填成一样。</p>
        </div>
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>订单导入成功</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
        <p>请点此
          <!-- <a :href="downloadFail" style="color: red;">下载文件</a> -->
          <!-- <el-button type="text" @click="moduleDownLoadfail" icon="circle-cross" :disabled="disabledDownLoadfail" style="color: red;">下载文件</el-button> -->
          <el-button type="text" @click="underDownloadFail(errorJson)" icon="circle-cross" :disabled="underDisabledDownLoad" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button @click="undercloseUpload" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'directordermanage',
  data() {
    return {
      platformOrderCode: '',
      shopOrderCode: '',
      isInput: false, // 显示输入框
      tradeMemo: '', // 新的备注
      isTableDisabled: false, // 订单是否可导出
      errorMsg: '', // 错误信息-代发
      errorJson: '', // 导入错误列表-代发
      loading: false, // 上传loading-代发
      isGoodResult: 'default', // 默认显示导入商品明细-代发
      channelCookie: '', // 业务线，业务线为YWX003默认为自采
      isLoading: false,
      isUnderLoading: false, // loading-代发
      isClick: false,
      underDisabledDownLoad: false, // 导出错误文件-代发
      disabledDownLoad: false,
      disabledDownLoadfail: false,
      isDisabled: true, // 单选可点击
      isShow: false, // 仓库下拉菜单默认隐藏
      isAppointStock: '1', // 导入默认是否选择仓库
      warehouseCode: '', // 导入默认选择仓库
      warehouseCodeList: [], // 仓库名称
      sellCode: '', // 上传文件下拉选择的销售渠道
      wyyang: '',
      orderCode: '', // 导出出错的参数
      ywxSellChannelListList: [], // 销售渠道(弹窗)
      uploadResult: {}, // 上传成功返回的响应数据
      isResult: 'default', // 默认显示导入文件
      isAccount: false, // 导入报价
      underIsAccount: false, // 导入报价-代发
      code: '', // 保存的采购单编号
      state1: '',
      form: {
        logiisticsInfo: '', // 物流信息
        packing: '' // 包装方式
      },
      restaurantsList: [], // 包装信息
      logiisticsInfoList: [], // 物流信息
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'ShopOrder',
        entityId: ''
      }, // 日志
      tableData: [],
      isInstallInfo: false, // 弹窗
      activeName: '1', // 当前选中的选项卡
      arr: [], // 数组列表
      purchaseGroupCodeList: [
        {
          name: '全部',
          code: ''
        }
      ], // 采购组列表
      sellCodeList: [
        {
          sellName: '全部',
          sellCode: ''
        }
      ], // 销售渠道下拉列表
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单
      isSecondLevel: true, // 关联三级菜单
      dialogTableVisible: false, // 弹窗
      currentTableIndex: [], // 当前列表对应子列表的sku项
      skuList: [], // sku列表
      spuCodeList: [], // spu更改状态列表
      skuCodeList: [], // sku更改状态列表
      tableDataList: [], // 初始化列表数据
      tableRowList: [], // 详情明细
      tableRowDetail: {}, // 详情
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      boxInfoDetail: {}, // 装箱信息
      purchaseOrderCodeList: [
        {
          name: '全部',
          code: ''
        }
      ], // 单据状态列表
      receiverNameList: [
        {
          name: '全部',
          value: ''
        }
      ], // 采购类型列表
      supplierOrderStatusList: [
        {
          value: '',
          name: '全部'
        },
        {
          value: '1',
          name: '待发货'
        },
        {
          value: '6',
          name: '部分发货'
        },
        {
          value: '4',
          name: '全部发货'
        },
        {
          value: '2',
          name: '发货异常'
        },
        {
          value: '7',
          name: '已取消'
        }
      ], // 入库状态列表
      reciverTypeList: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '接口',
          value: '0'
        },
        {
          name: '导入',
          value: '1'
        }
      ],
      orderTypeList: [
        {
          name: '正式订单',
          value: 0
        },
        {
          name: '预占订单',
          value: 1
        }
      ],
      afterDataList: [], // 售后列表
      afterCount: 0, // 售后信息总条数
      afterParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10
      },  // 售后信息请求参数
      totalCount: 0, // 列表条数
      searchParams: {
        scmShopOrderCode: '', // 系统订单号
        shopOrderCode: '', // 销售渠道订单号
        receiverName: '', // 收货人
        shopName: '', // 店铺名称
        supplierOrderStatus: '', // 发货状态
        reciverType: '', // 接收方式
        orderType: 0, // 订单类型
        sellCode: '', // 销售渠道
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        startCreateTime: '', // 开始日期
        endCreateTime: '', // 结束日期
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      multipleSelection: [] // 多选框选中
    };
  },
  created() {
    this.channelCookie = sessionStorage.getItem('currentChannel');
    if (this.$route.query.supplierOrderStatus !== '') {
      this.searchParams.supplierOrderStatus = this.$route.query.supplierOrderStatus;
    }
    if (this.$route.query.time !== '') {
      this.searchParams.startCreateTime = this.$route.query.time;
      this.searchParams.endCreateTime = this.$route.query.time;
    }
    this.initDataList();
    this.getSellCodeList();
    // this.getreceiverName();
    // this.getpurchaseGroupCodeList();
  },
  computed: {
    // 当前表格高度
    currentHeight() {
      let height = 96;
      if (this.tableDataList && this.tableDataList.length) {
        if (this.tableDataList.length > 10) {
          height = 386;
        } else if (this.tableDataList.length > 0 && this.tableDataList.length <= 10) {
          height = 35 * this.tableDataList.length + 36;
        } else {
          height = 71;
        }
      }
      return height;
    },
    // 导入失败下载的地址
    downloadFail() {
      return (
        '/scm-web/order/downloadErrorOrder/' + this.orderCode
      );
    },
    // 模板的下载地址
    downloadDefault() {
      return (
        '/scm-web/order/downloadErrorOrder/' + this.orderCode
      );
    },
    sellcodeObj() {
      let params = {};
      if (this.sellCode && this.isAppointStock === '1') {
        params = {
          sellCode: this.sellCode,
          isAppointStock: this.isAppointStock
        };
      } else if (this.sellCode && this.isAppointStock === '0') {
        params = {
          sellCode: this.sellCode,
          isAppointStock: this.isAppointStock,
          warehouseCode: this.warehouseCode
        };
      }
      return params;
    },
    // 参数-代发
    underSellcodeObj() {
      let params = {supplierCode: ''};
      if (this.sellCode) {
        params.sellCode = this.sellCode;
      }
      return params;
    }
  },
  filters: {
    tofixed(val) {
      let str = val.toString();
      if (str.indexOf('.') > -1 && str.split('.')[1].length > 3 ) {
        str = Number(str).toFixed(3);
      }
      return str;
    }
  },
  methods: {
    edit() {
      this.isInput = true;
      this.tradeMemo = this.tableRowDetail.tradeMemo;
    },
    saveMemo() {
      if (!this.tradeMemo) {
        this.$utils.messagetip.warningTip('备注不能为空！');
        return;
      }
      let params = {
        oldRemark: this.tableRowDetail.tradeMemo,
        newRemark: this.tradeMemo
      };
      this.$AXIOS.POST('/order/updateRemark/' + this.scmShopOrderCode, params).then(res => {
        this.isInput = false;
        this.$utils.messagetip.successTip(res.databuffer);
        let params = {
          platformOrderCode: this.platformOrderCode,
          shopOrderCode: this.shopOrderCode
        };
        this.getWarehouseNoticeDetail(params);
      });
    },
    moduleDownLoadfail() {
      this.disabledDownLoadfail = true;
      let url = '/scm-web/order/downloadErrorOrder/' + this.orderCode;
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
        // let day = '-' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const fileName = '导入失败列表.xls'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.disabledDownLoadfail = false;
      });
    },
    moduleDownLoad() {
      this.disabledDownLoad = true;
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      // window.open('/scm-web/order/exportOrder?' + qs.stringify(params));
      let url = '/scm-web/order/exportOrder?' + qs.stringify(params);
      axios({
        // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        console.log('res', res);
        // 处理返回的文件流
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        let day = '-' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const fileName = '订单导出' + day + '.xls'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }).catch((err) => {
        console.log(err);
        let enc = new TextDecoder('utf-8');
        let res = JSON.parse(enc.decode(new Uint8Array(err.response.data))); // 转化成json对象
        console.log(res);
        this.$message.error({
          showClose: true,
          message: res.databuffer,
          duration: 0
          });
      }).finally(() => {
        this.disabledDownLoad = false;
      });
    },
    isRadioChange(val) {
      if (val === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
        this.warehouseCode = '';
      }
    },
    sellCodeChange(val) {
      if (val) {
        this.isAppointStock = '1';
        this.isShow = false;
        this.warehouseCode = '';
        console.log(val);
        this.sellCodeList.forEach(item => {
          if (item.sellCode === val) {
            this.isDisabled = item.sellType === '2';
          }
        });
        console.log(this.isDisabled);
      }
    },
    // 发起类型翻译
    checkedLaunchType(type) {
      let typeStr = '-';
      if (type === 0) {
        typeStr = '系统发起';
      } else if (type === 1) {
        typeStr = '手动新建';
      }
      return typeStr;
    },
    // 售后类型翻译
    checkedAfterSaleType(type) {
      let typeStr = '-';
      if (type === 0) {
        typeStr = '取消发货';
      } else if (type === 1) {
        typeStr = '退货';
      } else if (type === 2) {
        typeStr = '换货';
      } else if (type === 3) {
        typeStr = '维修';
      }
      return typeStr;
    },
    // 售后单状态翻译
    checkedAfterStatus(type) {
      let typeStr = '-';
      if (type === 0) {
        typeStr = '待客户发货';
      } else if (type === 1) {
        typeStr = '客户已发货';
      } else if (type === 2) {
        typeStr = '已完成';
      } else if (type === 3) {
        typeStr = '已关闭';
      } else if (type === 4) {
        typeStr = '申请中';
      } else if (type === 5) {
        typeStr = '申请失败';
      } else if (type === 6) {
        typeStr = '通知仓库失败';
      } else if (type === 7) {
        typeStr = '仓库已收货';
      }
      return typeStr;
    },
    // 订单类型翻译
    checkOrderType(type) {
      let typeStr = '';
      if (type === '0') {
        typeStr = '普通订单';
      } else if (type === '1') {
        typeStr = '零元购';
      } else if (type === '2') {
        typeStr = '分期购';
      } else if (type === '3') {
        typeStr = '拼团';
      }
      return typeStr;
    },
    // 跳转到商品详情
    toGoodDetail(row) {
        if (row.skuCode.indexOf('SP0') > -1) {
            this.$router.push({
               name: 'goodsquerydetail',
               params: {
                   id: row.spuCode,
                   skuCode: row.skuCode
               },
               query: {
                    backLastRouter: true
               }
           });
        } else {
            this.$router.push({
                name: 'undertakesgoodDetail',
                params: {
                    id: row.skuCode
                },
                query: {
                    backLastRouter: true,
                    opeId: row.id
               }
            });
        }
    //   let config = {};
    //   if (row.skuCode.indexOf('SP0') > -1) {
    //     let obj = {
    //       spuCode: row.spuCode,
    //       skuCode: row.skuCode
    //     };
    //     // 自营
    //     config = {
    //       title: '商品详情',
    //       href: 'goods/goodsSkuDetail.html?' + qs.stringify(obj)
    //     };
    //   } else {
    //     let obj = {
    //       flag: 1,
    //       isClose: true,
    //       hideLogs: true,
    //       skuCode: row.skuCode
    //     };
    //     // 代发
    //     config = {
    //       title: '商品详情',
    //       href: 'goods/externalGoodsDetail.html?' + qs.stringify(obj)
    //     };
    //   }
    //   top.window.addTab(config);
    },
    downloadUrl() {
      window.open('./orderTemplate.xls');
    },
    beforeAvatarUpload(file) {
      console.log('file: ', file);
      if (!this.sellCode) {
        this.$utils.messagetip.warningTip('请先选择销售渠道!');
        return false;
      }
      if (this.isAppointStock === '0' && !this.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择指定仓库');
        return false;
      }

      const isExcel = file.type === 'application/vnd.ms-excel';

      if (!isExcel) {
        this.$utils.messagetip.errorTip('上传文件只能是 xls 格式!');
      }
      return isExcel;
    },
    // 上传文件-代发
    underBeforeAvatarUpload(file) {
      console.log('file: ', file);
      if (!this.sellCode) {
        this.$utils.messagetip.warningTip('请先选择销售渠道!');
        return false;
      }

      const isExcel = file.type === 'application/vnd.ms-excel';

      if (!isExcel) {
        this.$utils.messagetip.errorTip('上传文件只能是 xls 格式!');
      }
      return isExcel;
    },
    // 文件上传中
    uploadProgress(event, file, fileList) {
      console.log('上传中');
      this.isLoading = true;
    },
    // 文件上传中-代发
    underUploadProgress(event, file, fileList) {
      console.log('上传中');
      this.isUnderLoading = true;
    },
    // 导入成功之后调用
    savePrice() {
      this.GET(
        '/supplierCentre/supplierCenterGenerate/' + this.orderCode
      ).then(res => {
        if (res.code === '200') {
          this.initDataList();
          this.$utils.messagetip.successTip('报价生成成功');
          this.isAccount = false;
        }
      });
    },
    // 获取仓库下拉列表
    getWarehouseCodeList() {
      this.$AXIOS.GET('/order/warehouseList').then(res => {
        if (res.appcode === '1') {
          this.warehouseCodeList = res.result;
        }
      });
    },
    // 取消报价
    resetPrice() {
      this.$utils.messagetip.infoTip('报价取消');
      this.isAccount = false;
    },
    // 导出订单
    exportOrder() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/scm-web/order/exportOrder?' + qs.stringify(params));
    },
    // 导入模板
    importAccount() {
      this.isResult = 'default';
      this.sellCode = '';
      this.uploadResult = {};
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.isAccount = true;
      this.warehouseCode = '';
      this.getWarehouseCodeList();
      this.getYwxSellChannelList();
    },
    // 导入模板-代发
    underimportAccount() {
      this.isResult = 'default';
      this.sellCode = '';
      this.uploadResult = {};
      if (this.$refs.uploadUnder) {
        this.$refs.uploadUnder.clearFiles();
      }
      this.underIsAccount = true;
      this.getYwxSellChannelList();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess(response, file, fileList) {
      this.isLoading = false;
      if (response.appcode === '1') {
        this.uploadResult = response.result;
        if (this.uploadResult.failCount) {
          this.orderCode = this.uploadResult.orderCode || '';
          this.isResult = 'fail';
        } else {
          this.isResult = 'success';
        }
      } else {
        this.$utils.messagetip.errorTip(response.databuffer);
      }
    },
    // 上传成功-代发
    underUploadSuccess(response, file, fileList) {
      this.isUnderLoading = false;
      if (response.appcode === '1' && !response.result.importError ) {
        this.isResult = 'success';
      } else {
        // this.uploadResult = response.result;
        let successNum = response.result.importSuccess ? response.result.importSuccess.length : 0;
        let errorNum = response.result.importError.length ? response.result.importError.length : 0;
        this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
        let errorList = response.result.importError;
        this.errorJson = JSON.stringify(errorList);
        this.isResult = 'fail';
        this.$utils.messagetip.warningTip(response.databuffer);
      }
    },
    closeUpload() {
      this.initDataList();
      this.isAccount = false;
    },
    uploadDefaul(err, file, fileList) {
      this.isLoading = false;
      let obj = err.toString().substr(err.toString().indexOf('{'));
      let objErr = JSON.parse(obj);
      this.$utils.messagetip.errorTip(objErr.databuffer);
      this.isAccount = false;
    },
    underHandleRemove(file, fileList) {
      console.log(file, fileList);
    },
    underHandlePreview(file) {
      console.log(file);
    },
    undercloseUpload() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
      this.underIsAccount = false;
      this.underDisabledDownLoad = false;
    },
    // 错误列表下载-代发
    underDownloadFail(errorJson) {
      this.underDisabledDownLoad = true;
      this.$AXIOS.POST('/order/saveErrors', {errors: errorJson}).then(res => {
        // window.open('/scm-web/OtherOutIn/export_error_item?errorJsonUid=' + res.result);
        let url = '/scm-web/order/errorExport?errorKey=' + res.result;
        this.underModuleDownLoad(url);
      });
    },
    underModuleDownLoad(url) {
      axios({ // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
        'Content-Type': 'application/json'
        }
      }).then(res => { // 处理返回的文件流
        const blob = new Blob([res.data]);// new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = '异常数据.xls';// 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.underDisabledDownLoad = false;
      });
    },
    underUploadDefaul(err, file, fileList) {
      this.isUnderLoading = false;
      let obj = err.toString().substr(err.toString().indexOf('{'));
      let objErr = JSON.parse(obj);
      this.$utils.messagetip.errorTip(objErr.databuffer);
      this.underIsAccount = false;
    },
    amountChange(i, j) {
      console.log(i);
      console.log(j);
      let obj = this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i]
        .purchaseBoxInfoList[j];
      if (obj.amountPerBox && obj.boxAmount) {
        let value = obj.amountPerBox * obj.boxAmount;
        this.$set(
          this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i]
            .purchaseBoxInfoList[j],
          'amount',
          value
        );
      }
    },
    // 获取采购单数据列表
    initDataList() {
      this.tableRowDetail = [];
      this.tableRowList = [];
      this.logInfoList = [];
      this.afterDataList = [];
      this.logCount = 0;
      this.afterCount = 0;
      this.isTableDisabled = false;
      this.$AXIOS
        .LISTGET('/order/shopOrderPage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            let params = {
              platformOrderCode: this.tableDataList[0].platformOrderCode,
              shopOrderCode: this.tableDataList[0].shopOrderCode
            };
            this.platformOrderCode = this.tableDataList[0].platformOrderCode;
            this.shopOrderCode = this.tableDataList[0].shopOrderCode;
            this.scmShopOrderCode = this.tableDataList[0].scmShopOrderCode;
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              this.getWarehouseNoticeDetail(params);
              this.getAfterSaleOrderTab();
              this.operateParams.entityId = this.tableDataList[0].id;
              this.getLogInfo();
            }, 20);
          } else {
            this.isTableDisabled = true;
          }
        });
    },
    // 获取售后单列表
    getAfterSaleOrderTab() {
      this.afterParams.scmShopOrderCode = this.scmShopOrderCode;
      this.$AXIOS.LISTGET('/afterSaleOrder/afterSaleOrderTab/' + this.scmShopOrderCode, this.afterParams).then(res => {
        this.afterDataList = res.result || [];
        this.afterCount = res.totalCount || 0;
      });
    },
    // 获取采购单明细数据列表
    getWarehouseNoticeDetail(params) {
      this.$AXIOS.GET('/order/shopOrders', params).then(res => {
        console.log(res);
        const result = res.result;
        this.tableRowDetail = result[0];
        this.tableRowList = result[0].records[0].orderItemList;
        // this.tableRowList.forEach(item => {
        //   item.waybillNumber = this.tableRowDetail.waybillNumber;
        // });
      });
    },
    // 获取采购单明细数据详情
    getWarehouseNoticeInfo(id) {
      this.$AXIOS.GET('/purchase/purchaseOrder/' + id).then(res => {
        console.log(res);
        this.tableRowDetail = res.result;
      });
    },
    // 单据状态列表
    getSellCodeList() {
      this.$AXIOS.GET('/system/ywxSellChannelList').then(res => {
        this.sellCodeList = [...this.sellCodeList, ...res.result];
      });
    },
    // 采购组列表
    getpurchaseGroupCodeList() {
      this.$AXIOS.GET('/purchase/purchaseGroups').then(res => {
        this.purchaseGroupCodeList = res.result;
      });
    },
    // 上传文件-销售渠道列表
    getYwxSellChannelList() {
      this.$AXIOS.GET('/system/ywxSellChannelList?isValid=1').then(res => {
        this.ywxSellChannelListList = res.result;
      });
    },
    // 入库状态列表
    // getreceiverName() {
    //   this.$AXIOS.GET('/select/receiverName').then(res => {
    //     this.receiverNameList = res.result;
    //   });
    // },
    // 删除接口
    deleteUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/updateState/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 作废接口
    discardUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/updateState/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 冻结接口
    freezeUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/freeze/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 入库通知接口
    warahouseAdvice(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/warahouseAdvice/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 解冻接口
    disfreezeUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/freeze/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    // 获取装箱信息
    getBoxInfo(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/' + code).then(res => {
        this.boxInfoDetail = res.result;
      });
    },
    // 获取物流公司下拉列表
    getLogiisticsInfoList(code) {
      this.$AXIOS.GET('/system/enabled').then(res => {
        this.logiisticsInfoList = res.result;
        if (this.boxInfoDetail.logisticsCorporationName) {
          this.logiisticsInfoList.forEach(item => {
            if (
              item.logisticsCorporationName ===
              this.boxInfoDetail.logisticsCorporationName
            ) {
              this.form.logiisticsInfo = item.logisticsCode;
            }
          });
        }
      });
    },
    // 获取包装方式下拉列表
    getRestaurantsList(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/dict').then(res => {
        this.restaurantsList = res.result;
      });
    },
    // 装箱信息保存接口
    savePurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/save', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 装箱信息保存接口
    finishPurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/finish', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 完成按钮
    finishBtn() {
      let params = {};
      let arrList = [];
      let skuList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox; // 数量
            obj.boxNumber = suppItem.boxNumber; // 箱号
            obj.boxAmount = suppItem.boxAmount; // 箱数
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount; // 数量
            obj.grossWeight = suppItem.grossWeight; // 毛重
            obj.cartonSize = suppItem.cartonSize; // 外箱尺寸
            obj.volume = suppItem.volume; // 体积
            obj.remark = suppItem.remark; // 备注
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        } else {
          skuList.push(rowItem.skuCode);
        }
      });
      // 数据格式校验
      if (!params.packingType) {
        this.$utils.messagetip.warningTip('装箱方式不能为空！');
        return;
      }
      if (skuList && skuList.length) {
        this.$utils.messagetip.warningTip(`sku编号为${skuList}的装箱信息不能为空！`);
        return;
      }
      let isSkuCode = '';
      let isAmountPerBox = false; // 数量
      let isAmountPerBoxInt = false; // 数量
      let isBoxNumber = false; // 箱号
      let isBoxAmount = false; // 箱数
      let isBoxAmountInt = false; // 箱数
      let isGrossWeight = false; // 毛重
      let isGrossWeightFloat = false; // 毛重
      let isCartonSize = false; // 外箱尺寸
      let isCartonSizeSpec = false; // 外箱尺寸
      let isVolume = false; // 体积
      let isVolumeFloat = false; // 体积
      let isIntReg = /^[0-9]+$/; // 正整数
      let isFloatReg = /^[0-9.]+$/;
      let isSpecReg = /^[0-9*]+$/;
      arrList.forEach(item => {
        if (!item.amountPerBox) {
          isSkuCode = item.skuCode;
          isAmountPerBox = true;
        }
        if (!isIntReg.test(item.amountPerBox) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isAmountPerBoxInt = true;
        }
        if (!item.boxNumber && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxNumber = true;
        }
        if (!item.boxAmount && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmount = true;
        }
        if (!isIntReg.test(item.boxAmount) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmountInt = true;
        }
        if (!item.grossWeight && !isSkuCode) {
          isSkuCode = item.skuCode;
          isGrossWeight = true;
        }
        console.log(
          !isFloatReg.test(item.grossWeight) &&
            (item.grossWeight && item.grossWeight.indexOf('.') > -1) &&
            item.grossWeight.split('.')[1] &&
            item.grossWeight.split('.')[1].length > 2 &&
            !isSkuCode
        );
        if (
          (!isFloatReg.test(item.grossWeight) ||
            (item.grossWeight && item.grossWeight.indexOf('.') > -1) ||
            item.grossWeight.split('.')[1] ||
            item.grossWeight.split('.')[1].length > 2) &&
          !isSkuCode
        ) {
          isSkuCode = item.skuCode;
          isGrossWeightFloat = true;
        }
        if (!item.cartonSize && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSize = true;
        }
        if (!isSpecReg.test(item.cartonSize) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSizeSpec = true;
        }
        if (!item.volume && !isSkuCode) {
          isSkuCode = item.skuCode;
          isVolume = true;
        }
        if (
          (!isFloatReg.test(item.volume) ||
            (item.volume && item.volume.indexOf('.') > -1) ||
            item.volume.split('.')[1] ||
            item.volume.split('.')[1].length > 4) &&
          !isSkuCode
        ) {
          isSkuCode = item.skuCode;
          isVolumeFloat = true;
        }
      });
      if (isAmountPerBox) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量不能为空！`);
        return;
      }
      if (isAmountPerBoxInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量只能为正整数！`);
        return;
      }
      if (isBoxNumber) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱号不能为空！`);
        return;
      }
      if (isBoxAmount) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数不能为空！`);
        return;
      }
      if (isBoxAmountInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数只能为正整数！`);
        return;
      }
      if (isGrossWeight) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重不能为空！`);
        return;
      }
      if (isGrossWeightFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重格式不正确！`);
        return;
      }
      if (isCartonSize) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸不能为空！`);
        return;
      }
      if (isCartonSizeSpec) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸只能包含*和数字！`);
        return;
      }
      if (isVolume) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积不能为空！`);
        return;
      }
      if (isVolumeFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积格式不正确！`);
        return;
      }
      let isAmountResult = false;
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(item => {
        let amountResult = 0;
        item.purchaseBoxInfoList.forEach(subItem => {
          amountResult += subItem.amountPerBox * subItem.boxAmount;
        });
        if (amountResult !== item.purchasingQuantity * 1 && !isSkuCode) {
          console.log(amountResult);
          console.log(item.purchasingQuantity);
          isAmountResult = true;
          isSkuCode = item.skuCode;
        }
      });
      if (isAmountResult) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量必须等于采购数量！`);
        return;
      }
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.finishPurchaseBoxInfo(params);
    },
    // 暂存按钮
    saveBtn() {
      let params = {};
      let arrList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox;
            obj.boxNumber = suppItem.boxNumber;
            obj.boxAmount = suppItem.boxAmount;
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount;
            obj.grossWeight = suppItem.grossWeight;
            obj.cartonSize = suppItem.cartonSize;
            obj.volume = suppItem.volume;
            obj.remark = suppItem.remark;
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        }
      });
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.savePurchaseBoxInfo(params);
    },
    // 装箱信息合计
    getComputed(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '-';
          return;
        }
        if (index === 5) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        console.log(data);
        const values = data.map(item => Number(item[column.property]));
        console.log(values);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          if (index !== 0) {
            sums[index] = '-';
          }
        }
      });
      console.log(sums);
      return sums;
    },
    // 合计
    getSummaries(param) {
      // console.log(param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        data.forEach((dataItem, dataIndex) => {
          if (
            dataItem.purchaseBoxInfoList &&
            dataItem.purchaseBoxInfoList.length
          ) {
            const values = dataItem.purchaseBoxInfoList.map(item =>
              Number(item[column.property])
            );
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += '';
            } else {
              if (index !== 0) {
                sums[index] = '';
              }
            }
            sums[12] = '';
          }
        });
      });

      return sums;
    },
    // 点击删除按钮
    deleteBtn(row) {
      this.$confirm(`删除后数据将不可恢复。`, `您确认要删除吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击作废按钮
    discardBtn(row) {
      this.$confirm(
        `确认后采购单及其相关单据将一并被作废。`,
        `您确认要作废吗?`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.discardUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 入库通知
    warehouseNameNotice(row) {
      if (row.boxInfoStatus !== '1') {
        this.$confirm(``, `请先完成“装箱信息”维护！`, {
          confirmButtonText: '维护装箱信息',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.showInstallInfo();
          })
          .catch(() => {
            this.$utils.messagetip.infoTip('已取消');
          });
      } else {
        this.$confirm(`确认后将产生入库通知单。`, `您确认要入库通知吗?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.warahouseAdvice(row);
          })
          .catch(() => {
            this.$utils.messagetip.infoTip('已取消');
          });
      }
    },
    // 点击冻结按钮
    freezeBtn(row) {
      this.$confirm(`确认后采购单将被冻结。`, `您确认要冻结吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.freezeUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击解冻按钮
    disfreezeBtn(row) {
      this.$confirm(`确认后采购单将恢复到冻结前的状态。`, `您确认要解冻吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.disfreezeUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击整行
    tableRowClick(row) {
      let params = {
        platformOrderCode: row.platformOrderCode,
        shopOrderCode: row.shopOrderCode
      };
      this.platformOrderCode = row.platformOrderCode;
      this.shopOrderCode = row.shopOrderCode;
      this.scmShopOrderCode = row.scmShopOrderCode;
      this.getAfterSaleOrderTab();
      this.getWarehouseNoticeDetail(params);
      this.operateParams.entityId = row.id;
      this.getLogInfo();
    },
    // 跳转新增页面
    toAddOrEdit(id) {
      this.$router.push({
        path: '/directordermanage/purchaseorderaddoredit/' + id
      });
    },
    addInfo(i) {
      if (
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i]
          .purchaseBoxInfoList &&
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i]
          .purchaseBoxInfoList.length
      ) {
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList.push({});
        console.log('111');
      } else {
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList = [];
        this.$set(
          this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i]
            .purchaseBoxInfoList,
          0,
          {}
        );
        console.log('222');
      }
    },
    // 删除按钮
    deleteListBtn(index, i) {
      this.$confirm(``, `您确认要删除吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[index].purchaseBoxInfoList.splice(i, 1);
          this.$utils.messagetip.successTip('删除成功!');
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 页码条数改变
    logChangeSize(val) {
      this.operateParams.start = 0;
      this.operateParams.pageNo = 1;
      this.operateParams.pageSize = val;
      this.getLogInfo();
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.operateParams.pageNo = val;
      this.operateParams.start = (val - 1) * this.operateParams.pageSize;
      this.getLogInfo();
    },
    // 售后列表页码条数改变
    afterChangeSize(val) {
      this.afterParams.start = 0;
      this.afterParams.pageNo = 1;
      this.afterParams.pageSize = val;
      this.getAfterSaleOrderTab();
    },
    // 售后列表当前页码改变
    afterChangeNumber(val) {
      this.afterParams.pageNo = val;
      this.afterParams.start = (val - 1) * this.afterParams.pageSize;
      this.getAfterSaleOrderTab();
    },
    // 筛选条件
    searchFormData() {
      if (
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      if (
        new Date(this.searchParams.startCreateTime).getTime() >
        new Date(this.searchParams.endCreateTime).getTime()
      ) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        scmShopOrderCode: '', // 系统订单号
        shopOrderCode: '', // 销售渠道订单号
        receiverName: '', // 收货人
        shopName: '', // 店铺名称
        supplierOrderStatus: '', // 发货状态
        reciverType: '', // 接收方式
        sellCode: '', // 销售渠道
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        startCreateTime: '', // 开始日期
        endCreateTime: '', // 结束日期
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    // 类型翻译
    checkedType(type) {
      let typeStr = '';
      if (type === 'purchaseSelling') {
        typeStr = '采购类型';
      } else if (type === 'agentSelling') {
        typeStr = '代销';
      } else if (type === 'purchaseSellingGift') {
        typeStr = '购销赠品';
      } else if (type === 'agentSellingGift') {
        typeStr = '代销赠品';
      }
      return typeStr;
    },
    // 商品类型状态翻译
    checkedItemType(type) {
      let typeStr = '';
      if (/^SP0/.test(type)) {
        typeStr = '自采';
      } else {
        typeStr = '代发';
      }
      return typeStr;
    },
    // 发货状态翻译
    checkedStatus(supplierOrderStatus) {
      let statusStr = '-';
      this.supplierOrderStatusList.forEach(item => {
        if (item.value === supplierOrderStatus) {
          statusStr = item.name;
        }
      });
      return statusStr;
    },
    // 商品明细发货状态翻译
    checkedOrderStatus(supplierOrderStatus) {
      return this.$utils.querydiction('supplierOrderStatus', supplierOrderStatus);
    },
    // 接收方式翻译
    checkedReciverType(reciverType) {
      let statusStr = '';
      this.reciverTypeList.forEach(item => {
        if (item.value === reciverType) {
          statusStr = item.name;
        }
      });
      return statusStr;
    },
    // 订单类型方式翻译
    checkedOrderType(orderType) {
      let orderStr = '';
      this.orderTypeList.forEach(item => {
        if (item.value === orderType) {
        orderStr = item.name;
      }
    });
      return orderStr;
    },
    // 入库状态翻译
    checkedWarStatus(status) {
      let statusStr = '-';
      if (status === '0') {
        statusStr = '等待入库';
      } else if (status === '1') {
        statusStr = '全部入库';
      } else if (status === '2') {
        statusStr = '部分入库';
      } else if (status === '3') {
        statusStr = '入库异常';
      }
      return statusStr;
    },
    // 跳转到售后单详情页
    toAfterSaleDetail(id) {
        this.$router.push({ path: '/afterSale/afterSaleDetail/' + id, query: { backLastRouter: true } });
    },
    // 显示装箱信息弹窗
    showInstallInfo() {
      this.getLogiisticsInfoList();
      this.getRestaurantsList();
      this.getBoxInfo(this.code);
      if (this.boxInfoDetail.packingType) {
        this.state1 = this.boxInfoDetail.packingType;
      } else {
        this.state1 = '';
      }
      this.isInstallInfo = true;
    },
    // 自动搜索
    querySearch(queryString, cb) {
      let restaurantsList = this.restaurantsList;
      let results = queryString
        ? restaurantsList.filter(this.createFilter(queryString))
        : restaurantsList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>
<style lang="stylus" scoped>
.directordermanage
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
  .paging
    margin-top: 15px
    text-align: right
  .btn
    color: blue
    cursor: pointer
  .table
    padding: 0 20px
    background: #fff
    .table_menu
      display: flex
      justify-content: space-around
      line-height: 40px
      font-size: 12px
      border: solid 1px #cccccc
      border-bottom: none
      text-align: center
      li
        flex: 1
      li.name
        width: 270px
        flex: 0 0 270px
</style>
<style lang='stylus'>
.directordermanage
  .el-dialog
    width 1000px !important
  .group_btn
    text-align: center
  .paging
    margin-top: 15px
    text-align: right
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
  .table
    padding: 0 20px
    background: #fff
    .table_menu
      display: flex
      justify-content: space-around
      line-height: 40px
      font-size: 12px
      border: solid 1px #cccccc
      border-bottom: none
      text-align: center
      li
        flex: 1
      li.name
        width: 270px
        flex: 0 0 270px
</style>
