<template>
    <div class="supplierorder">
        <el-form label-width="150px" size="mini">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="供应商订单编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.warehouseOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="销售渠道订单号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.shopOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="状态：" prop="" size="mini">
                        <el-select v-model="searchParams.supplierOrderStatus" filterable placeholder="请选择">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="销售渠道：" prop="" size="mini">
                        <el-select v-model="searchParams.sellCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in sellOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="系统订单号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.scmShopOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="供应商名称：" prop="" size="mini">
                        <el-select v-model="searchParams.supplierCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in supplierOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="付款日期：" size="mini">
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建时间：" size="mini">
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.startCreateTime"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.endCreateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="销售渠道平台订单号：" prop="" size="mini">
                        <el-input v-model="searchParams.platformOrderCode" clearable  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6"> &nbsp;</el-col>
                <el-col :span="6"> &nbsp;</el-col>
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="primary" @click="resetSearchParams" icon="circle-cross">重置</el-button>
                        <el-button type="primary" :disabled="disabledDownLoad" @click="importExcel" icon="circle-cross">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount<0 ? 0 :searchParams.totalCount">
            </el-pagination>
        </div>
        <el-table height="480"  ref="tableMain" highlight-current-row @row-click="rowClick" :data="tableData" border >
            <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
            <el-table-column align="center" prop="warehouseOrderCode"    label="供应商订单编号" width="180" :show-overflow-tooltip="true" > </el-table-column>
            <el-table-column align="center" prop="supplierName" width="80"   label="供应商名称"  > </el-table-column>
            <el-table-column align="center" prop="scmShopOrderCode"   label="系统订单号" :show-overflow-tooltip="true"  width="180">
                <!-- <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.scmShopOrderCode" placement="top">
                        <span class="overflow_hidden">{{ scope.row.scmShopOrderCode }}</span>
                    </el-tooltip>
                </template> -->
            </el-table-column>
            <el-table-column align="center" prop="platformOrderCode"   label="销售渠道平台订单号" :show-overflow-tooltip="true" > </el-table-column>
            <el-table-column align="center" prop="shopOrderCode"   label="销售渠道订单号"  > </el-table-column>
            <el-table-column align="center" prop="sellName"   label="销售渠道" :show-overflow-tooltip="true" > </el-table-column>
            <el-table-column align="center" prop="itemsNum"   label="商品总数量" width="80" > </el-table-column>
            <el-table-column align="center" prop="payment"   label="商品总金额(元)"  width="80"> </el-table-column>
            <el-table-column align="center" prop="payTime"   label="付款时间"  width="120"> </el-table-column>
            <el-table-column align="center" prop="createTime"   label="创建时间"  width="120"> </el-table-column>
            <el-table-column align="center" prop="specInfo"   label="状态" width="100" >
                <template slot-scope="scope">
                    <span v-show="scope.row.supplierOrderStatus == 1"> 待发送供应商 </span>
                    <el-tooltip v-show="scope.row.supplierOrderStatus == 2" class="item" effect="light" :content="scope.row.message" placement="top">
                        <span style="color:red;cursor:pointer" > 供应商下单异常 </span>
                        <div slot="content" v-html="scope.row.message"></div>
                    </el-tooltip>
                    <span v-show="scope.row.supplierOrderStatus == 3"> 等待供应商发货 </span>
                    <span v-show="scope.row.supplierOrderStatus == 4"> 全部发货 </span>
                    <el-tooltip  v-show="scope.row.supplierOrderStatus == 5" class="item" effect="light"  :content="scope.row.message" placement="top">
                        <span style="color:red;cursor:pointer"> 供应商下单失败 </span>
                        <div slot="content" v-html="scope.row.message"></div>
                    </el-tooltip>
                    <span v-show="scope.row.supplierOrderStatus == 6"> 部分发货 </span>
                    <span v-show="scope.row.supplierOrderStatus == 7"> 已取消 </span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="logisticsInfo"   label="反馈物流公司名称-反馈运单号"  >
                <template slot-scope="scope">
                    <div v-html="scope.row.logisticsInfo">

                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop=""   label="操作"  >
                <template slot-scope="scope">
                    <div v-if="scope.row.supplierOrderStatus == 1 || scope.row.supplierOrderStatus == 5">
                        <el-button @click="jdAddressMap(scope.row)" v-if="scope.row.supplierCode == 'JD'"  type="text">处理</el-button>
                        <el-button @click="closeSupplier(scope.row)"  type="text">关闭</el-button>
                    </div>
                    <div v-else-if="scope.row.supplierOrderStatus == 2 && scope.row.supplierCode == 'JD'">
                        <el-button @click="jdAddressMap(scope.row)" v-if="scope.row.supplierCode == 'JD'"  type="text">处理</el-button>
                    </div>
                    <div v-else-if="scope.row.supplierOrderStatus == 7 && scope.row.showCancel == 1"><el-button @click="qiutClose(scope.row)" type="text">取消关闭</el-button></div>
                    <div v-else> - </div>
                </template>
            </el-table-column>
        </el-table>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品明细" name="first">
                <el-table style="width:100%;" border :data="detailData.orderItemList">
                    <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                    <el-table-column prop="itemName" align="center" label="SKU名称"   :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="skuCode" align="center" label="SKU编号"  >
                        <template slot-scope="scope">
                            <span @click="toSKUdetail(scope.row)"  style="color: #409EFF; cursor:pointer">{{ scope.row.skuCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplierSkuCode" align="center" label="供应商SKU编号"    > </el-table-column>
                    <el-table-column prop="supplierOrderCode" align="center" label="供应商反馈订单号"    > </el-table-column>
                    <el-table-column prop="payment" align="center" label="实付总金额(元)"    ></el-table-column>
                    <el-table-column prop="num" align="center" label="应发商品数量"    width="80"> </el-table-column>
                    <el-table-column prop="deliverNum" align="center" label="实发商品数量"   width="80" > </el-table-column>
                    <el-table-column prop="realOutInNum" align="center" label="发货状态"    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.supplierOrderStatus == 1"> 待发送供应商 </span>
                            <span v-show="scope.row.supplierOrderStatus == 2" > 供应商下单异常 </span>
                            <span v-show="scope.row.supplierOrderStatus == 3"> 等待供应商发货 </span>
                            <span v-show="scope.row.supplierOrderStatus == 4"> 全部发货 </span>
                            <span v-show="scope.row.supplierOrderStatus == 5" > 供应商下单失败 </span>
                            <span v-show="scope.row.supplierOrderStatus == 6"> 部分发货 </span>
                            <span v-show="scope.row.supplierOrderStatus == 7"> 已取消 </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deliverPackageFormList" align="center" label="物流信息"    >
                        <el-table-column prop="deliverPackageFormList" align="center" label="物流公司"   >
                            <template slot-scope="scope">
                                <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length">
                                    <div v-for="(data, index) in scope.row.deliverPackageFormList" :key="index" >
                                      {{ data.logisticsCorporation }}
                                    </div>
                                </div>
                                <div v-else></div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deliverPackageFormList" align="center" label="运单编号"   >
                            <template slot-scope="scope">
                                <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length">
                                    <div v-for="(data, index) in scope.row.deliverPackageFormList" :key="index">
                                      {{ data.waybillNumber }}
                                    </div>
                                </div>
                                <div v-else></div>
                                <!-- {{ (scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length) ? scope.row.deliverPackageFormList[0].waybillNumber : '' }} -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="deliverPackageFormList" align="center" label="商品数量"   >
                             <template slot-scope="scope">
                                <div v-if="scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length">
                                    <div v-for="(data, index) in scope.row.deliverPackageFormList" :key="index" >
                                      {{ data.skuNum }}
                                    </div>
                                </div>
                                <div v-else></div>
                                <!-- {{ (scope.row.deliverPackageFormList && scope.row.deliverPackageFormList.length) ? scope.row.deliverPackageFormList[0].skuNum : '' }} -->
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <!-- <el-table-column prop="realOutInNum" align="center" label="售后信息"    >
                        <el-table-column prop="skuName" align="center" label="售后状态"   > - </el-table-column>
                        <el-table-column prop="skuName" align="center" label="售后数量"   > - </el-table-column>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收货信息" name="second">
                <el-row  :gutter="20" style="padding:20px 0 30px 0; line-height:28px;" :span="24">
                    <el-col :span="5">
                        收货人姓名：{{ detailData.platformOrder.receiverName }}
                    </el-col>
                    <el-col :span="5">
                        收货人手机号：{{ detailData.platformOrder.receiverMobile }}
                    </el-col>
                    <el-col :span="7">
                        收货省份.城市.区域：{{ detailData.platformOrder.receiverProvince }} - {{ detailData.platformOrder.receiverCity }} - {{ detailData.platformOrder.receiverDistrict }}
                    </el-col>
                    <el-col :span="7">
                        收货详细地址：{{ detailData.platformOrder.receiverAddress }}
                    </el-col>
                </el-row>
                <el-row  :span="24">
                    <el-col v-show="detailData.supplierCode == 'JD'">
                        京东四级地址：{{ detailData.jdAddress }}
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="售后信息" name="five">
                <div class="page" style="text-align:right; padding: 10px 0;">
                    <el-pagination @size-change="afterchangeSize" @current-change="afterchangeNumber" :current-page="afterParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="afterParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="afterParams.totalCount">
                    </el-pagination>
                </div>
                <el-table style="width:100%;" border :data="afterDataList">
                    <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                    <el-table-column prop="afterSaleCode" align="center" :show-overflow-tooltip="true" label="售后单号">
                        <template slot-scope='scope'>
                            <span class='btn' @click='toAfterSaleDetail(scope.row.id)'>{{scope.row.afterSaleCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="skuName" align="center" :show-overflow-tooltip="true" label="SKU名称">
                        <template slot-scope="scope">
                            <span class="btn" @click="toGoodDetail(scope.row)">{{scope.row.skuName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" align="center" label="发起类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.launchType == 0">系统发起</span>
                            <span v-else-if="scope.row.launchType == 1">手动新建</span>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" align="center" label="售后类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.afterSaleType == 0">取消发货</span>
                            <span v-else-if="scope.row.afterSaleType == 1">退货</span>
                            <span v-else-if="scope.row.afterSaleType == 2">换货</span>
                            <span v-else-if="scope.row.afterSaleType == 3">维修</span>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" align="center" label="售后单状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0">待客户发货</span>
                            <span v-else-if="scope.row.status == 1">客户已发货</span>
                            <span v-else-if="scope.row.status == 2">已完成</span>
                            <span v-else-if="scope.row.status == 3">已关闭</span>
                            <span v-else-if="scope.row.status == 4">申请中</span>
                            <span v-else-if="scope.row.status == 5">申请失败</span>
                            <span v-else-if="scope.row.status == 6">通知仓库失败</span>
                            <span v-else-if="scope.row.status == 7">仓库已收货</span>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inNum" align="center" label="正品入库数量">
                        <template slot-scope="scope">
                            <span v-if="scope.row.inNum === null || scope.row.inNum === ''"> - </span>
                            <span v-else> {{ scope.row.inNum  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="defectiveInNum" align="center" label="残品入库数量">
                        <template slot-scope="scope">
                            <span v-if="scope.row.defectiveInNum === null || scope.row.defectiveInNum === ''"> - </span>
                            <span v-else> {{ scope.row.defectiveInNum  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="returnWarehouseName" align="center" label="退货仓"> </el-table-column>
                    <el-table-column prop="logisticsCorporation" align="center" label="物流公司">
                        <template slot-scope="scope">
                            <span v-if="scope.row.logisticsCorporation === null || scope.row.logisticsCorporation === ''"> - </span>
                            <span v-else> {{ scope.row.logisticsCorporation  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waybillNumber" align="center" label="物流单号">
                        <template slot-scope="scope">
                            <span v-if="scope.row.waybillNumber === null || scope.row.waybillNumber === ''"> - </span>
                            <span v-else> {{ scope.row.waybillNumber  }} </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="其他信息" name="third">
                <el-form inline label-width="120px" size="mini">
                    <el-row :span="24">
                        <el-col>
                            <el-form-item  label="店铺名称：" prop="" size="mini">
                                {{ detailData.shopName }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="fourth">
                <operate-table :url="'/logInfoPage'" :isRefresh="isRefresh"    v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 映射京东地址弹窗 -->
        <el-dialog
            :title="jdtitle"
            :visible.sync="dialogVisibleAddress"
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :show-close='false'
            width="70%">
            <h3 style="font-weight: 700;line-height:40px">待处理商品：</h3>
            <el-table
              ref="multipleTable"
              :data="jdTableDataList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              max-height="600"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                align='center'
                label="处理"
                width="55">
              </el-table-column>
              <el-table-column
                label="SKU名称"
                prop="itemName"
                align='center'
                width="150"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                prop="skuCode"
                label="SKU编号"
                align='center'
                width="150">
              </el-table-column>
              <el-table-column
                prop="supplierSkuCode"
                label="供应商SKU编码"
                align='center'
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="num"
                label="应发货数量"
                align='center'
                width="75"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="supplierOrderStatus"
                label="当前状态"
                align='center'
                width="120"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-show="scope.row.supplierOrderStatus == 1"> 待发送供应商 </span>
                    <span v-show="scope.row.supplierOrderStatus == 2" > 供应商下单异常 </span>
                    <span v-show="scope.row.supplierOrderStatus == 3"> 等待供应商发货 </span>
                    <span v-show="scope.row.supplierOrderStatus == 4"> 全部发货 </span>
                    <span v-show="scope.row.supplierOrderStatus == 5" > 供应商下单失败 </span>
                    <span v-show="scope.row.supplierOrderStatus == 6"> 部分发货 </span>
                    <span v-show="scope.row.supplierOrderStatus == 7"> 已取消 </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="exceptionMessage"
                label="失败原因"
                align='center'
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="text_hide" style="color: red;" v-html="scope.row.exceptionMessage"></div>
                </template>
              </el-table-column>
            </el-table>
            <p style="color: #999999;margin-bottom: 20px;line-height: 30px;">说明：未勾选“处理”的商品不会发送京东</p>
            <el-form label-width="120px" size="mini" style="margin-top: 15px;">
                <el-form-item label="收货人省市区：">{{reciverArea}}</el-form-item>
                <el-form-item label="收货人详细地址：">{{ reciverAddress }}</el-form-item>
                <el-form-item required label="京东地址：">
                    <el-cascader ref="jdAddress"   separator="-" style="width:250px;" placeholder="试试搜索：北京" v-model="jdAddressDefault" :options="jdAddressArr" filterable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" style="text-align:center;" class="dialog-footer">
                <el-button size="mini" type="primary" @click="confirmClose('dialogVisibleAddress')">确定并发送京东</el-button>
                <el-button size="mini" @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 关闭弹窗 -->
        <el-dialog
            title="确定关闭"
            :visible.sync="dialogVisibleClose"
            center
            width="30%">
            <el-row style="padding-bottom:10px;">
                <span style="color:red;">*</span>
                <span>请输入关闭原因</span>
            </el-row>
            <el-input maxlength="200" v-model="closeRemark" type="textarea"></el-input>
            <span slot="footer" style="text-align:center;" class="dialog-footer">
                <el-button size="mini" type="primary" @click="confirmClose('dialogVisibleClose')">确 定</el-button>
                <el-button size="mini" @click="dialogVisibleClose = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import operateTable from '@/components/operateTable';
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'supplierorder',
    data() {
        return {
            jdtitle: '', // 处理弹窗title
            jdTableDataList: [], // jd待处理商品列表
            multipleSelection: [], // 保存已勾选的待处理的商品
            disabledDownLoad: false, // 导出按钮
            dialogVisibleAddress: false,
            dialogVisibleClose: false,
            closeRemark: '',
            currentWarehouseOrderCode: '',
            reciverArea: '',
            reciverAddress: '',
            jdAddressDefault: [],
            jdAddressArr: [],
            jdAddressDefaultName: [],
            activeName: 'first',
            searchParams: {
                orderType: '1', // 代发参数，不能去掉
                warehouseOrderCode: '', // 供应商订单编号
                shopOrderCode: '', // 销售渠道订单号
                supplierOrderStatus: '', // 状态
                sellCode: '', // 销售渠道
                scmShopOrderCode: '', // 系统订单号
                supplierCode: '', // 供应商名称
                platformOrderCode: '', // 销售渠道平台订单编号
                startDate: '',
                endDate: '',
                startCreateTime: '',
                endCreateTime: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            afterDataList: [], // 售后列表
            afterParams: {
                start: 0,
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                warehouseOrderCode: ''
            },  // 售后信息请求参数
            tableData: [],
            detailData: {
                platformOrder: ''
            },
            entityId: '',
            isRefresh: 0,
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'WarehouseOrder',
                operateType: true
            },
            statusOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '待发送供应商',
                value: '1'
            }, {
                label: '供应商下单异常',
                value: '2'
            }, {
                label: '等待供应商发货',
                value: '3'
            }, {
                label: '全部发货',
                value: '4'
            }, {
                label: '供应商下单失败',
                value: '5'
            }, {
                label: '部分发货',
                value: '6'
            }, {
                label: '已取消',
                value: '7'
            }],
            supplierOptions: [],
            sellOptions: [],
            scmShopOrderCode: ''
        };
    },
    components: {
        operateTable
    },
    computed: {

    },
    watch: {
        dialogVisibleAddress(val) {

        },
        dialogVisibleClose(val) {
            if (!val) {
                this.closeRemark = '';
            }
        }
    },
    mounted: function() {
        this.initSellData();
        this.supplierData();
        this.JDAddressInte();
        const start = new Date();
        const end = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.searchParams.startDate = start;
        this.searchParams.endDate = end;
        if (this.$route.query.supplierOrderStatus ) {
            this.searchParams.supplierOrderStatus = this.$route.query.supplierOrderStatus;
        }

        if (this.$route.query.time) {
            this.searchParams.startCreateTime = this.$route.query.time;
            this.searchParams.endCreateTime = this.$route.query.time;
        }
        let data = this.searchParams;
        data.startDate = this.formatDataChange(start, 'yyyy-MM-dd');
        data.endDate = this.formatDataChange(end, 'yyyy-MM-dd');
        if (this.$route.query.time || this.$route.query.supplierOrderStatus) {
          data.startDate = '';
          data.endDate = '';
        }
        this.initData(data);
    },
    methods: {
        // 跳转到售后单详情页
        toAfterSaleDetail(id) {
            // this.$router.push({ path: '/afterSaleDetail/' + id });
            this.$router.push({
                name: 'afterSaleDetail',
                params: {
                    id: id
                },
                query: {
                    backLastRouter: true
                }
            });
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
        },
        closeDialog() {
          this.dialogVisibleAddress = false;
          this.initData(this.searchParams);
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        getJdTableDataList() {
          this.$AXIOS.GET('/order/reSubmitSupplierSkus/' + this.currentWarehouseOrderCode).then(res => {
            this.jdTableDataList = res.result;
            if (this.jdTableDataList && this.jdTableDataList.length) {
              setTimeout(() => {
                this.jdTableDataList.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
              }, 600);
            }
          });
        },
        search() {
            if (this.searchParams.startDate && this.searchParams.endDate && this.searchParams.startDate > this.searchParams.endDate) {
                return this.$utils.messagetip.successTip('开始时间不得大于结束时间');
            }
            if (this.searchParams.startCreateTime && this.searchParams.endCreateTime && this.searchParams.startCreateTime > this.searchParams.endCreateTime) {
                return this.$utils.messagetip.successTip('开始时间不得大于结束时间');
            }
            this.searchParams.pageNo = 1;
            this.initData(this.searchParams);
        },
        resetSearchParams() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.totalCount = 0;
            this.searchParams.orderType = '1';
            this.searchParams.start = '0';
            this.initData(this.searchParams);
        },
        importExcel() {
            this.disabledDownLoad = true;
            this.$AXIOS.EXPORT({url: '/order/exportSupplierOrder', data: this.searchParams, fileName: '供应商订单'}).then(res => {

            }).finally(() => {
                this.disabledDownLoad = false;
            });
        },
        afterchangeSize(val) {
            this.afterParams.pageSize = val;
            this.getAfterSaleOrderTab();
        },
        afterchangeNumber(val) {
            this.afterParams.pageNo = val;
            this.getAfterSaleOrderTab();
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData(this.searchParams);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData(this.searchParams);
        },
        handleClick(row) {
            if (row.label === '操作日志') {
                this.isRefresh++;
            }
        },
        rowClick(row, event, obj) {
            if (obj.label !== '操作') {
                this.shopDetailData(row);
                this.operateParams.entityId = this.entityId = row.id;
                this.scmShopOrderCode = row.scmShopOrderCode;
                this.afterDataList.warehouseOrderCode = row.warehouseOrderCode;
                this.getAfterSaleOrderTab();
            }
        },
        jdAddressMap(row) {
            this.jdtitle = `供应商订单【${row.warehouseOrderCode}】处理`;
            this.jdAddressDefault = [];
            this.jdAddressDefaultName = [];
            this.$AXIOS.GET('/order/platformOrders', {platformOrderCode: row.platformOrderCode}).then(res => {
                let area = `${res.result[0].receiverProvince}${res.result[0].receiverCity}${res.result[0].receiverDistrict}${res.result[0].receiverAddress}`;
                this.reciverArea = `${res.result[0].receiverProvince}/${res.result[0].receiverCity}/${res.result[0].receiverDistrict}`;
                this.reciverAddress = res.result[0].receiverAddress;
                this.dialogVisibleAddress = true;
                this.$AXIOS.GET('/api/getJDAreaCode', {area: area}).then(res => {
                    this.jdAddressDefault = [res.result.provinceId, res.result.cityId, res.result.countyId, res.result.townId];
                    this.jdAddressDefaultName = [res.result.province, res.result.city, res.result.county, res.result.town];
                });
            });

            this.currentWarehouseOrderCode = row.warehouseOrderCode;
            this.getJdTableDataList(); // 获取列表信息
        },
        closeSupplier(row) {
            this.dialogVisibleClose = true;
            this.currentWarehouseOrderCode = row.warehouseOrderCode;
        },
        qiutClose(row) {
            this.$confirm('确定后数据将恢复到关闭前的状态。', '您确认取消关闭吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
            .then(() => {
                let data = {
                    isCancel: 0,
                    warehouseOrderCode: row.warehouseOrderCode
                };
                this.$AXIOS.PUT('/order/orderCancel', data, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    // this.searchParams.pageNo = 1;
                    // this.initData(this.searchParams);
                }).finally(() => {
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                });
            })
            .catch(() => {
              this.$utils.messagetip.infoTip('已取消');
            });
        },
        confirmClose(str) {
            if (str === 'dialogVisibleClose') {
                if (!this.closeRemark) {
                    return this.$utils.messagetip.warningTip('请填写关闭原因！');
                }
                let data = {
                    isCancel: 1,
                    cancelReason: this.closeRemark,
                    warehouseOrderCode: this.currentWarehouseOrderCode
                };
                this.$AXIOS.PUT('/order/orderCancel', data, true).then(res => {
                  this.$utils.messagetip.successTip(res.databuffer);
                }).finally(() => {
                    this.closeRemark = '';
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                    this.$data[str] = false;
                });
            } else if (str === 'dialogVisibleAddress') {
                let ref = this.$refs['jdAddress'].currentLabels.join('/');
                let arr = [];
                if (!this.multipleSelection.length) {
                  return this.$utils.messagetip.warningTip('至少选择一个待处理商品！');
                }
                if (this.multipleSelection && this.multipleSelection.length) {
                  this.multipleSelection.forEach(item => {
                    arr.push(item.skuCode);
                  });
                }
                let data = {
                    submitSkus: arr.join(),
                    warehouseOrderCode: this.currentWarehouseOrderCode,
                    jdAddressCode: this.jdAddressDefault.join('/'),
                    jdAddressName: ref
                };
                this.$AXIOS.POST('/order/jingDongOrder', data, true).then(res => {
                  this.$utils.messagetip.successTip(res.databuffer);
                }).finally(() => {
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                    this.$data[str] = false;
                });
            }
        },
        toSKUdetail(row) {
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
        },
        // 获取售后单列表
        getAfterSaleOrderTab() {
            // this.afterParams.scmShopOrderCode = this.scmShopOrderCode;
            this.$AXIOS.LISTGET('/afterSaleOrder/afterSaleOrderTab/' + this.scmShopOrderCode, this.afterParams).then(res => {
                this.afterDataList = res.result || [];
                this.afterParams.totalCount = res.totalCount || 0;
            });
        },
        // 获取销售渠道数据
        initSellData() {
            this.$AXIOS.GET('/system/ywxSellChannelList').then(res => {
                this.sellOptions = res.result.map(item => {
                    return {
                        label: item.sellName,
                        value: item.sellCode
                    };
                });
                this.sellOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        // 获取供应商名称数据
        supplierData() {
            this.$AXIOS.GET('/supplier/suppliers', {isValid: 1}).then(res => {
                res.result.map(item => {
                    if (item.supplierKindCode === 'oneAgentSelling') {
                        this.supplierOptions.push({
                            label: item.supplierName,
                            value: item.supplierInterfaceId
                        });
                    }
                });
                this.supplierOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        // 初始化数据
        initData(data) {
            this.$AXIOS.LISTGET('/order/warehouseOrderPage', data).then(res => {
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
                if (res.result && res.result.length) {
                    this.shopDetailData(res.result[0]);
                    this.scmShopOrderCode = res.result[0].scmShopOrderCode;
                    this.afterParams.warehouseOrderCode = res.result[0].warehouseOrderCode;
                    this.getAfterSaleOrderTab();
                    this.$nextTick(() => {
                        this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                    });
                } else {
                    this.entityId = '0';  // 随便填写
                    this.detailData = {
                        platformOrder: ''
                    };
                }
            });
        },
        // 商品详情
        shopDetailData(row) {
            this.operateParams.entityId = this.entityId = row.id;
            this.$AXIOS.GET('/order/warehouseOrder/warehouseOrderCode/' + row.warehouseOrderCode).then(res => {
                this.detailData = res.result;
            }, error => {
                if (error.appcode === '0') {
                    this.entityId = '0';  // 随便填写
                    this.detailData = {
                        platformOrder: ''
                    };
                }
            });
        },
        // 京东地址初始化
        JDAddressInte() {
            this.$AXIOS.LISTGET('/metadata/jdAddress').then(res => {
                this.jdAddressArr = res.map(item => {
                    return {
                        label: item.text,
                        value: item.id * 1,
                        children: item.children
                        ? item.children.map((item1, index1, now1) => {
                                return {
                                    label: item1.text,
                                    value: item1.id * 1,
                                    children: item1.children
                                    ? item1.children.map((item2, index2, now2) => {
                                            return {
                                                label: item2.text,
                                                value: item2.id * 1,
                                                children: item2.children
                                                ? item2.children.map((item3, index3, now3) => {
                                                        return {
                                                            label: item3.text,
                                                            value: item3.id * 1
                                                        };
                                                    })
                                                : ''
                                            };
                                        })
                                    : ''
                                };
                            })
                        : ''
                    };
                });
            });
        },
        // 转换时间格式
        formatDataChange(time, format) {
            let t = new Date(time);
            let tf = function(i) {
                 return (i < 10 ? '0' : '') + i;
            };

            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
    .overflow_hidden{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        width: 180px;
    }
    .btn{
        color: rgb(64, 158, 255);
        cursor: pointer;
    }

</style>


