<template>
    <div class="shippenotice">
       <el-form label-width="150px" size="mini">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="发货通知单编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.outboundOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="销售渠道订单号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.shopOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="系统订单号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.scmShopOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="收货人：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.receiverName"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="状态：" prop="" size="mini">
                        <el-select v-model="searchParams.status" filterable placeholder="请选择">
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
                    <el-form-item  label="发货仓库名称：" prop="" size="mini">
                        <el-select v-model="searchParams.warehouseId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in warehouseOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="订单付款日期：" size="mini">
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.startPayDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.endPayDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发货单创建日期：" size="mini">
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.startCreateDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.endCreateDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="仓库反馈出库单号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.wmsOrderCode"  placeholder=""></el-input>
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
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="primary" @click="resetSearchParams" icon="circle-cross">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-button type="primary" @click="exportTableData" icon="circle-cross" size="mini" :loading="disabledDownLoad" :disabled='isTableDisabled'>{{disabledDownLoad?'下载中':'导出'}}</el-button>
          </el-col>
          <el-col class="page">
            <div class="page" style="text-align:right; padding: 10px 0;">
              <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount<0 ? 0 :searchParams.totalCount">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
        <el-table height="388" ref="tableMain" highlight-current-row @row-click="rowClick" :data="tableData" border style="width: 100%">
            <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
            <el-table-column label="发货通知单编号" align="center" prop="outboundOrderCode" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="系统订单号" align="center" prop="scmShopOrderCode" width="180" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="销售渠道订单号" align="center" prop="shopOrderCode" width="100" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="仓库反馈出库单号" align="center" prop="wmsOrderCode" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="销售渠道" align="center" prop="sellName" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="发货仓库" align="center" prop="warehouseName" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column label="商品总数量" align="center" prop="itemNum" width="100"> </el-table-column>
            <el-table-column label="收货人" align="center" prop="receiverName" width="100"> </el-table-column>
            <el-table-column label="收货人手机号" align="center" prop="receiverPhone" width="110"> </el-table-column>
            <el-table-column label="订单付款时间" align="center" prop="payTime"> </el-table-column>
            <el-table-column label="状态" width="120" align="center" prop="status">
                <template slot-scope="scope">
                    <el-tooltip v-show="scope.row.status == 1" class="item" effect="dark" :content="scope.row.message" placement="top">
                        <span style="color:red; cursor:pointer" > 仓库接收失败 </span>
                    </el-tooltip>
                    <span v-show="scope.row.status == 2">等待仓库发货</span>
                    <!-- <span v-show="scope.row.status == 3">客户已发货</span> -->
                    <span v-show="scope.row.status == 4">全部发货</span>
                    <span v-show="scope.row.status == 5">部分发货</span>
                    <span v-show="scope.row.status == 6">已取消</span>
                    <span v-show="scope.row.status == 7">取消中</span>
                </template>
            </el-table-column>
            <el-table-column label="发货单创建时间" align="center" prop="createTime"> </el-table-column>
            <el-table-column label="操作" align="center" prop="">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 1">
                        <el-button @click="shipClose(scope.row)"  type="text" size="mini">关闭</el-button>
                        <el-button @click="reSend(scope.row)"  type="text" size="mini">重新发货</el-button>
                    </div>
                    <el-button @click="qiutSend(scope.row)"  v-else-if="scope.row.status == 2" type="text" size="mini">取消发货</el-button>
                    <div v-else-if="scope.row.status == 6 && scope.row.isTimeOut == 0" >
                        <el-button @click="qiutClose(scope.row)" v-show="scope.row.isClose == 1"  type="text" size="mini">取消关闭</el-button>
                        <el-button @click="reSend(scope.row)" v-show="scope.row.isCancel == 1"  type="text" size="mini">重新发货</el-button>
                    </div>
                    <div v-else> - </div>
                </template>
            </el-table-column>
        </el-table>

        <el-tabs  @tab-click="handleClick"  v-model="activeName" >
            <el-tab-pane label="商品明细" name="first">
                <el-table     :data="detailData.outboundDetailList" border style="width: 100%">
                    <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                    <el-table-column label="SKU名称" align="center" prop="skuName" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column label="商品SKU编号" align="center" prop="skuCode"> </el-table-column>
                    <el-table-column label="规格" align="center" prop="specNatureInfo" :show-overflow-tooltip='true'> </el-table-column>
                    <el-table-column label="实付总金额（元）" align="center" prop="actualAmount"> </el-table-column>
                    <el-table-column label="应发商品数量" align="center" prop="shouldSentItemNum"> </el-table-column>
                    <el-table-column label="实发商品数量" align="center" prop="realSentItemNum"> </el-table-column>
                    <el-table-column label="发货状态" align="center" prop="">
                        <template slot-scope="scope">
                            <span v-show="scope.row.status == 1"> 仓库接收失败 </span>
                            <span v-show="scope.row.status == 2">等待仓库发货</span>
                            <span v-show="scope.row.status == 4">全部发货</span>
                            <span v-show="scope.row.status == 5">部分发货</span>
                            <span v-show="scope.row.status == 6">已取消</span>
                            <span v-show="scope.row.status == 7">取消中</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="物流信息" align="center" prop="outboundDetailLogisticsList">
                        <el-table-column label="物流公司" align="center" prop="">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isStoreOrder == 2 && scope.row.status == 4">已自提</div>
                                <div v-else>
                                    <div v-for="(data, index) in scope.row.outboundDetailLogisticsList" :key="index" v-if="scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length">
                                            {{ data.logisticsCorporation }}
                                    </div>
                                    <div v-else></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="运单编号" align="center" prop="">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isStoreOrder == 2 && scope.row.status == 4">已自提</div>
                                <div v-else>
                                    <div v-for="(data, index) in scope.row.outboundDetailLogisticsList" :key="index" v-if="scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length">
                                            {{ data.waybillNumber }}
                                    </div>
                                    <div v-else></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品数量" align="center" prop="">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isStoreOrder == 2 && scope.row.status == 4">已自提</div>
                                <div v-else>
                                    <div v-for="(data, index) in scope.row.outboundDetailLogisticsList" :key="index" v-if="scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length">
                                            {{ data.itemNum }}
                                    </div>
                                    <div v-else></div>
                                </div>
                                <!-- <div>{{ (scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length) ? scope.row.outboundDetailLogisticsList[0].itemNum : '' }}</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="实际发货时间" align="center" prop="">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isStoreOrder == 2 && scope.row.status == 4">已自提</div>
                                <div v-else>
                                    <div v-for="data in scope.row.outboundDetailLogisticsList" :key="data" v-if="scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length">
                                            {{ data.deliverTime }}
                                    </div>
                                    <div v-else></div>
                                </div>
                                <!-- <div>{{ (scope.row.outboundDetailLogisticsList && scope.row.outboundDetailLogisticsList.length) ? scope.row.outboundDetailLogisticsList[0].deliverTime : '' }}</div> -->
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收货信息" name="second">
                <div v-if="shipStatus == 1 || shipStatus == 6"  style="margin-bottom:10px;" >
                    <el-button @click="isChangeMsg = false" v-show="isChangeMsg" type="primary" size="mini">修改收货信息</el-button>
                    <el-button @click="changeMsgKeep" v-show="!isChangeMsg" type="primary" size="mini">保存</el-button>
                </div>
                <el-row v-if="isChangeMsg" :span="24">
                    <el-col :span="6">
                        <div></div>
                        收货人姓名：{{ detailData.receiverName }}
                    </el-col>
                    <el-col :span="6">
                        收货人手机号：{{ detailData.receiverPhone | filterPhone }}
                    </el-col>
                    <el-col :span="6">
                        收货省份.城市.区域：{{ detailData.receiverProvince }} - {{ detailData.receiverCity }} - {{ detailData.receiverDistrict}}
                    </el-col>
                    <el-col :span="6">
                        收货详细地址：{{ detailData.receiverAddress }}
                    </el-col>
                </el-row>
                <el-row v-else :span="24">
                    <el-form label-width="120px">
                        <el-col :span="6">
                            <el-form-item required label="收货人姓名：">
                                <el-input maxlength="50" size="mini" v-model="detailData.receiverName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item required label="收货人手机号：">
                                <el-input maxlength="50" size="mini" v-model="detailData.receiverPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item required label="收货省份.城市.区域：">
                                <el-cascader
                                    ref="receiverForm"
                                    separator="-"
                                    placeholder="试试搜索：北京"
                                    size="mini"
                                    :options="cityOptions"
                                    v-model="defaultCityOptions"
                                    filterable
                                ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item required label="收货详细地址：">
                                <el-input maxlength="100" size="mini" v-model="detailData.receiverAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="其他信息" name="third">
                <el-row>
                    店铺名称： {{ detailData.shopName }}
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="售后信息" name="fiveth">
                <div class="page" style="text-align:right; padding: 10px 0;">
                    <el-pagination @size-change="afterchangeSize" @current-change="afterchangeNumber" :current-page="afterParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="afterParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="afterParams.totalCount">
                    </el-pagination>
                </div>
                <el-table  ref="afterSaletableMain"  :data="afterSaleData" border style="width: 100%">
                    <el-table-column label="售后单号" align="center" prop="afterSaleCode" width="200">
                        <template slot-scope="scope">
                            <span style="color: #409EFF; cursor: pointer" @click="toAfterSaleCode(scope.row)">{{ scope.row.afterSaleCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="SKU名称" align="center" prop="skuName">
                        <template slot-scope="scope">
                            <span style="color: #409EFF; cursor: pointer" @click="toShopDetail(scope.row)">{{ scope.row.skuName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发起类型" align="center" prop="launchType">
                        <template slot-scope="scope">
                            <span v-show="scope.row.launchType === 0">系统发起</span>
                            <span v-show="scope.row.launchType === 1">手动新建</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="售后类型" align="center" prop="afterSaleType">
                        <template slot-scope="scope">
                            <span v-if="scope.row.afterSaleType == 0">取消发货</span>
                            <span v-else-if="scope.row.afterSaleType == 1">退货</span>
                            <span v-else-if="scope.row.afterSaleType == 2">换货</span>
                            <span v-else-if="scope.row.afterSaleType == 3">维修</span>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="售后单状态" align="center" prop="status">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0">待客户发货</span>
                            <span v-else-if="scope.row.status == 1">客户已发货</span>
                            <span v-else-if="scope.row.status == 2">已完成</span>
                            <span v-else-if="scope.row.status == 3">已关闭</span>
                            <span v-else-if="scope.row.status == 4">取消中</span>
                            <span v-else-if="scope.row.status == 5">申请失败</span>
                            <span v-else-if="scope.row.status == 6">通知仓库失败</span>
                            <span v-else-if="scope.row.status == 7">仓库已收货</span>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="正品入库数量" align="center" prop="inNum">
                        <template slot-scope="scope">
                            <span v-if="scope.row.inNum === null || scope.row.inNum === ''"> - </span>
                            <span v-else> {{ scope.row.inNum  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="残品入库数量" align="center" prop="defectiveInNum">
                        <template slot-scope="scope">
                            <span v-if="scope.row.defectiveInNum === null || scope.row.defectiveInNum === ''"> - </span>
                            <span v-else> {{ scope.row.defectiveInNum  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="退货仓" align="center" prop="returnWarehouseName"> </el-table-column>
                    <el-table-column label="物流公司" align="center" prop="logisticsCorporation">
                        <template slot-scope="scope">
                            <span v-if="scope.row.logisticsCorporation === null || scope.row.logisticsCorporation === ''"> - </span>
                            <span v-else> {{ scope.row.logisticsCorporation  }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="物流单号" align="center" prop="waybillNumber">
                        <template slot-scope="scope">
                            <span v-if="scope.row.waybillNumber === null || scope.row.waybillNumber === ''"> - </span>
                            <span v-else> {{ scope.row.waybillNumber  }} </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="fourth">
                <operate-table :url="'/logInfoPage'" :isRefresh="isRefresh"   v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import operateTable from '@/components/operateTable';
export default {
    name: 'shippenotice',
    data() {
        return {
            activeName: 'first',
            searchParams: {
                outboundOrderCode: '', // 发货通知单编号
                shopOrderCode: '', // 销售渠道订单号
                scmShopOrderCode: '', // 系统订单号
                receiverName: '', // 收货人
                status: '', // 状态
                warehouseId: '', // 发货仓库名称
                startPayDate: '', // 订单付款开始时间
                endPayDate: '', // 订单付款结束时间
                startCreateDate: '', // 发货单创建开始日期
                endCreateDate: '', // 发货单创建结束日期
                sellCode: '', // 销售渠道
                wmsOrderCode: '', // 仓库反馈出库单号
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            afterParams: {
                outBoundCode: '',
                pageNo: 1,
                pageSize: 10,
                start: 0,
                totalCount: 0
            },
            scmShopOrderCode: '',
            statusOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '仓库接收失败',
                value: '1'
            }, {
                label: '等待仓库发货',
                value: '2'
            }, {
                label: '全部发货',
                value: '4'
            }, {
                label: '部分发货',
                value: '5'
            }, {
                label: '已取消',
                value: '6'
            }, {
                label: '取消中',
                value: '7'
            }],
            shipStatus: '',
            entityId: '',
            isRefresh: '',
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'OutboundOrder',
                operateType: true
            },
            tableData: [],
            detailData: {
                outboundDetailList: []
            },
            afterSaleData: [],
            warehouseOptions: [],
            sellOptions: [],
            cityOptions: [],
            defaultCityOptions: [],
            isChangeMsg: true,
            disabledDownLoad: false,
            isTableDisabled: false
        };
    },
    filters: {
      filterPhone(val) {
        let str = '';
        if (val) {
          str = val.toString().substring(0, 4) + '****' + val.toString().substring(7, 12);
        }
        return str;
      }
    },
    mounted: function() {
        if (this.$route.query.status) {
          this.searchParams.status = this.$route.query.status;
        }
        if (this.$route.query.time) {
          this.searchParams.startCreateDate = this.$route.query.time;
          this.searchParams.endCreateDate = this.$route.query.time;
        }
        this.warehouseOptionsinit();
        this.initSellData();
        this.initData(this.searchParams);
         // 初始化城市列表
        let citys = window.localStorage.addressArr ? JSON.parse(window.localStorage.addressArr) : '';
        this.cityOptions = citys.map(item => {
            return {
                label: item.text,
                value: item.id,
                children: item.children
                ? item.children.map((item1, index1, now1) => {
                        return {
                            label: item1.text,
                            value: item1.id,
                            children: item1.children
                            ? item1.children.map((item2, index2, now2) => {
                                    return {
                                        label: item2.text,
                                        value: item2.id
                                    };
                                })
                            : ''
                        };
                    })
                : ''
            };
        });
    },
    components: {
        operateTable
    },
    methods: {
        toAfterSaleCode(row) {
            this.$router.push({
                name: 'afterSaleDetail',
                params: {
                    id: row.id
                },
                query: {
                    backLastRouter: true
                }
            });
        },
        toShopDetail(row) {
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
        search() {
            if (this.searchParams.startPayDate && this.searchParams.endPayDate && this.searchParams.startPayDate > this.searchParams.endPayDate) {
                return this.$utils.messagetip.warningTip('订单付款时间查询的开始时间不得大于结束时间');
            } else if (this.searchParams.startCreateDate && this.searchParams.endCreateDate && this.searchParams.startCreateDate > this.searchParams.endCreateDate) {
                return this.$utils.messagetip.warningTip('发货单创建的时间查询的开始时间不得大于结束时间');
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
            this.searchParams.start = '0';
            this.initData(this.searchParams);
        },
        rowClick(row, event, obj) {
            if (obj.label !== '操作') {
                this.isChangeMsg = true;
                this.shipStatus = row.status;
                this.scmShopOrderCode = row.scmShopOrderCode;
                this.afterParams.outBoundCode = row.outBoundCode;
                this.shopDetailData(row);
                this.operateParams.entityId = this.entityId = row.id;
            }
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData(this.searchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData(this.searchParams);
        },
        handleClick(val) {
            if (val.label === '操作日志') {
                this.isRefresh++;
            }
        },
        // 关闭
        shipClose(row) {
            this.$prompt('<p>你确定要关闭此发货通知单吗？</p><span style="color:red">*</span>请输入关闭原因', '确定关闭', {
                confirmButtonText: '确定关闭',
                cancelButtonText: '取消',
                inputType: 'textarea',
                inputValidator(value) {
                    if (!value) {
                        return '请输入关闭原因';
                    } else if (value.length > 200) {
                        return '字符长度不得大于200个字符';
                    }
                },
                dangerouslyUseHTMLString: true
            }).then(({ value }) => {
                this.$AXIOS.PUT('/outOrder/close/' + row.id, {remark: value}, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    // this.searchParams.pageNo = 1;
                    // this.initData(this.searchParams);
                }).finally(() => {
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                });
            }).catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 重新发送
        reSend(row) {
            this.$confirm('您确认重新发货吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.$AXIOS.POST('/outOrder/deliveryOrderCreate', {id: row.id}, true).then(res => {
                 this.$utils.messagetip.successTip(res.databuffer);
                    // this.searchParams.pageNo = 1;
                    // this.initData(this.searchParams);
               }).finally(() => {
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                });
            }).catch(() => {
              this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 取消关闭
        qiutClose(row) {
            this.$AXIOS.PUT('/outOrder/cancelClose/' + row.id, '', true).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                // this.searchParams.pageNo = 1;
                // this.initData(this.searchParams);
            }).finally(() => {
                this.searchParams.pageNo = 1;
                this.initData(this.searchParams);
            });
        },
        // 取消发货
        qiutSend(row) {
             this.$prompt('<p>您确认要取消发货吗?</p><span style="color:red">*</span>请输入取消原因：', '取消发货', {
                confirmButtonText: '确定关闭',
                cancelButtonText: '取消',
                inputType: 'textarea',
                inputValidator(value) {
                    if (!value) {
                        return '请输入取消原因';
                    } else if (value.length > 200) {
                        return '字符长度不得大于200个字符';
                    }
                },
                dangerouslyUseHTMLString: true
            }).then(({ value }) => {
                this.$AXIOS.PUT('/outOrder/orderCancel/' + row.id, {remark: value}, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    // this.searchParams.pageNo = 1;
                    // this.initData(this.searchParams);
                }).finally(() => {
                    this.searchParams.pageNo = 1;
                    this.initData(this.searchParams);
                });
            }).catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 保存修改信息
        changeMsgKeep() {
             let regexp = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
            if (!this.detailData.receiverName) {
                return this.$utils.messagetip.warningTip('请填写收货人姓名');
            } else if (!this.detailData.receiverPhone) {
                return this.$utils.messagetip.warningTip('请填写收货人手机号');
            } else if (this.detailData.receiverPhone && !regexp.test(this.detailData.receiverPhone)) {
                return this.$utils.messagetip.warningTip('手机号码格式错误');
            } else if (!this.detailData.receiverProvince) {
                return this.$utils.messagetip.warningTip('请填写收货人省份.城市.区域');
            } else if (!this.detailData.receiverAddress) {
                return this.$utils.messagetip.warningTip('请填写收货详细地址');
            }
            let data = {
                receiverName: this.detailData.receiverName,
                receiverPhone: this.detailData.receiverPhone,
                receiverProvince: this.$refs['receiverForm'].currentLabels[0],
                receiverCity: this.$refs['receiverForm'].currentLabels[1],
                receiverDistrict: this.$refs['receiverForm'].currentLabels[2],
                receiverAddress: this.detailData.receiverAddress
            };
            // console.log(data);
            this.$AXIOS.PUT('/outOrder/updateReceiverInfo/' + this.detailData.outboundOrderCode, data).then(res => {
                this.isChangeMsg = true;
                this.$utils.messagetip.successTip(res.databuffer);
                this.shopDetailData(this.detailData);
            });
        },
        // 初始化数据
        initData(data) {
            this.$AXIOS.LISTGET('/outOrder/outboundOrderPage', data).then(res => {
                this.isTableDisabled = false;
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
                if (res.result && res.result.length) {
                    this.shopDetailData(res.result[0]);
                    this.$nextTick(() => {
                        this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                    });
                } else {
                    this.entityId = '0';  // 随便填写
                    this.shipStatus = '';
                    this.detailData = [];
                    this.isTableDisabled = true;
                }
            });
        },
        // 商品详情
        shopDetailData(row) {
            this.operateParams.entityId = this.entityId = row.id;
            this.shipStatus = row.status;
            this.$AXIOS.GET('/outOrder/outboundOrderDetail/' + row.id).then(res => {
                this.detailData = res.result;
                this.defaultCityOptions = this.findCityId([res.result.receiverProvince, res.result.receiverCity, res.result.receiverDistrict]);
                this.scmShopOrderCode = res.result.scmShopOrderCode;
                this.afterParams.outBoundCode = res.result.outboundOrderCode;
                this.afterSaleDataInit();
            });
        },
        afterchangeSize(val) {
            this.afterParams.pageSize = val;
            this.afterSaleDataInit();
        },
        afterchangeNumber(val) {
            this.afterParams.pageNo = val;
            this.afterSaleDataInit();
        },
        // 售后信息
        afterSaleDataInit() {
            // let data = {
            //     outBoundCode: obj.outboundOrderCode,
            //     pageNo: 1,
            //     pageSize: 20,
            //     start: 0
            // };
            this.$AXIOS.LISTGET('/afterSaleOrder/afterSaleOrderTab/' + this.scmShopOrderCode, this.afterParams).then(res => {
                this.afterSaleData = res.result;
                this.afterParams.totalCount = res.totalCount;
            });
        },
        // 获取仓库名称
        warehouseOptionsinit() {
            this.$AXIOS.GET('/outOrder/warehouseListAll').then(res => {
                this.warehouseOptions = res.result.map(item => {
                    return {
                        label: item.warehouseName,
                        value: item.id
                    };
                });
                this.warehouseOptions.unshift({
                    label: '全部',
                    value: ''
                });
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
        // 找出城市ID
        findCityId(arr) {
            let defaultArr = [];
            let citys = window.localStorage.addressArr ? JSON.parse(window.localStorage.addressArr) : '';
            for (let i = 0; i < citys.length; i++) {
                if (citys[i].text === arr[0]) {
                    defaultArr.push(citys[i].id);
                    for (let j = 0; j < citys[i].children.length; j++) {
                        if (citys[i].children[j].text === arr[1]) {
                            defaultArr.push(citys[i].children[j].id);
                            if (arr[1] === arr[2]) {
                                defaultArr[2] = defaultArr[1];
                                break;
                            } else {
                                let perK = citys[i].children[j].children;
                                for (let k = 0; k < perK.length; k++) {
                                    if (perK[k].text === arr[2]) {
                                        defaultArr.push(perK[k].id);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
            return defaultArr;
        },
        // 导出
        exportTableData() {
          let params = {};
          Object.keys(this.searchParams).forEach(key => {
            if (this.searchParams[key] !== '') {
             params[key] = this.searchParams[key];
           }
          });
          this.disabledDownLoad = true;
          this.$AXIOS.EXPORT({url: '/outOrder/exportOutboundOrder', data: params, fileName: '发货通知单'}).then(res => {

          }).finally(() => {
            this.disabledDownLoad = false;
          });
        }
    }

};
</script>

<style lang="less" scoped>

</style>


