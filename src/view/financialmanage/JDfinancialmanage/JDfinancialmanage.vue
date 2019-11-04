<template>
    <div class="JDfinancialmanage">
        <div class="title">
            <h2 class="h2">京东财务管理</h2>
            <span class="time">最近同步时间：{{ JDmoneyMsg.time }}</span>
        </div>
        <div class="JDmoney_wrap">
            <ul>
                <li>
                    <img class="img" :src="imgSrc"/>
                    <span>京东账户信息(基于京东接口的不确定性，以下信息经供参考，实际请以银行信息为准)</span>
                </li>
                <li class="margin_left">当前余额（元）：<span style="color: #FF6600; font-weight:800; font-size:16px;">{{ JDmoneyMsg.currentBalance }}</span></li>
                <li class="margin_left">
                    <span style="padding-right:40px; font-size: 14px">同步时余额（元）：{{ JDmoneyMsg.balance }}</span>
                    <span style="padding-right:40px; font-size: 14px">同步时累计收入（元）：{{ JDmoneyMsg.refundAll }}</span>
                    <span style="padding-right:40px; font-size: 14px">同步时累计支出（元）：{{ JDmoneyMsg.expendAll }}</span>
                </li>
                <li class="margin_left">
                    <span v-if="JDmoneyMsg.state == 1">同步时余额 = 同步时累计收入 - 同步时累计支出 <i style="color:#389738; padding-left:20px;">正常</i></span>
                    <span v-else>同步时余额 <i style="color:red">≠</i> 同步时累计收入 - 同步时累计支出 <i style="color:red; padding-left:20px;">异常</i> </span>
                </li>
            </ul>
        </div>
        <el-tabs style="padding-top:20px" v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="订单对比明细" name="first">
                <el-form size="mini" label-width="125px" >
                    <el-row :gutter="20" :span="24">
                        <el-col :span="6">
                            <el-form-item label="京东订单编号：">
                                <el-input v-model="orderSearchParams.orderCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="京东商品编号：">
                                <el-input v-model="orderSearchParams.itemSkuCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="京东商品名称：">
                                <el-input v-model="orderSearchParams.itemSkuName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="京东物流单号：">
                                <el-input v-model="orderSearchParams.wayBillCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                      <el-col :span="6">
                            <el-form-item label="异常说明：">
                                <el-select v-model="orderSearchParams.errMsg" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in errMsgOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="渠道平台订单号：">
                                <el-input v-model="orderSearchParams.channelPlatformOrder" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="渠道店铺订单号：">
                                <el-input v-model="orderSearchParams.shopOrderCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="渠道商品订单号：">
                                <el-input v-model="orderSearchParams.orderItemCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="6">
                            <el-form-item label="余额变动日期：">
                                <el-col :span="11">
                                    <el-form-item size="mini">
                                        <el-date-picker v-model="orderSearchParams.startUpdateTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                        </el-date-picker>
                                    </el-form-item>
                                    </el-col>
                                    <el-col style="text-align: center" :span="2">-</el-col>
                                    <el-col :span="11">
                                    <el-form-item size="mini">
                                        <el-date-picker v-model="orderSearchParams.endUpdateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务线：">
                                <el-select v-model="orderSearchParams.channelCode" filterable placeholder="请选择" @change="getSellChannels">
                                    <el-option
                                    v-for="item in channelsList"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="销售渠道：">
                                <el-select v-model="orderSearchParams.sellCode" :disabled="isChannel" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in sellChannelsList"
                                    :key="item.sellCode"
                                    :label="item.sellName"
                                    :value="item.sellCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="">
                                <el-button size="mini" type="primary" icon="search" @click="orderSearch">查询</el-button>
                                <el-button size="mini" type="primary" icon="circle-cross" @click="orderResetForm">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row :gutter="20" :span="24">
                  <el-button style="margin: 0 0 10px 10px;" size="mini" type="primary" :disabled="orderDisabled" icon="circle-cross" @click="orderImportExcel">导出</el-button>
                </el-row>
                <el-table :row-class-name="tableRowClassName"  :data="orderData" border style="width:auto">
                    <el-table-column align="center" type="index" label="序号"  width="50"> </el-table-column>
                    <el-table-column align="center" prop="errMsg" label="异常说明" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.errMsg != '正常' && scope.row.operate == '待了结'" style="color:#FF0000">{{ scope.row.errMsg }}</span>
                            <span v-else> {{ scope.row.errMsg }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="jingdongOrderCreateTime" label="京东订单生成时间"  width="150" > </el-table-column>
                    <el-table-column align="center" prop="parentOrderCode" label="京东父订单编号"  width="150" > </el-table-column>
                    <el-table-column align="center" prop="orderCode" label="京东子订单编号"  width="150"> </el-table-column>
                    <el-table-column align="center" prop="itemSkuCode" label="京东商品编号"  width="150"> </el-table-column>
                    <el-table-column align="center" prop="wayBillCode" label="京东物流单号"  width="150"> </el-table-column>
                    <el-table-column align="center" prop="itemSkuName" label="京东商品名称"  width="150" :show-overflow-tooltip="true">
                        <!-- <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" :content="scope.row.itemSkuName" placement="top">
                                <span style="width:150px" class="overflow_hidden">{{ scope.row.itemSkuName }}</span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column align="center" prop="firstClassify" label="京东商品一级分类" width="150"> </el-table-column>
                    <el-table-column align="center" prop="secondClassify" label="京东商品二级分类" width="150"> </el-table-column>
                    <el-table-column align="center" prop="thirdClassify" label="京东商品三级分类" width="150"> </el-table-column>
                    <el-table-column align="center" prop="jdItemsNum" label="京东商品发货数量" width="150"> </el-table-column>
                    <el-table-column align="center" prop="price" label="京东商品单价" width="150"> </el-table-column>
                    <el-table-column align="center" prop="totalPrice" label="京东商品总金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="freight" label="京东子订单运费" width="150"> </el-table-column>
                    <el-table-column align="center" prop="subTotalPrice" label="京东子订单总金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="parentTotalPrice" label="京东父订单总金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="actualPay" label="账户实际支付金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="refund" label="账户实际退款金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="channelName" label="业务线" width="150"> </el-table-column>
                    <el-table-column align="center" prop="sellName" label="销售渠道" width="150"> </el-table-column>
                    <el-table-column align="center" prop="channelOrderSubmitTime" label="渠道订单提交时间" width="150"> </el-table-column>
                    <el-table-column align="center" prop="channelPlatformOrder" label="渠道平台订单号" width="150"> </el-table-column>
                    <el-table-column align="center" prop="shopOrderCode" label="渠道店铺订单号" width="150"> </el-table-column>
                    <el-table-column align="center" prop="orderItemCode" label="渠道商品订单号" width="150"> </el-table-column>
                    <el-table-column align="center" prop="channelItemsNum" label="客户购买商品数量" width="150"> </el-table-column>
                    <el-table-column align="center" prop="pay" label="客户实付商品金额" width="150"> </el-table-column>
                    <el-table-column align="center" prop="balanceCreateTime" label="余额变动时间" width="150"> </el-table-column>
                    <el-table-column align="center" prop="state" label="订单状态" width="150"> </el-table-column>
                    <el-table-column align="center" prop="operate" label="了结状态" width="150"> </el-table-column>
                    <el-table-column align="center" prop="" label="操作" >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.errMsg != '正常' " @click="endOrder(scope.row)" type="text">操作</el-button>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" style="text-align:right; padding: 10px 0;">
                    <el-pagination @size-change="orderChangeSize" @current-change="orderChangeNumber" :current-page="orderSearchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="orderSearchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="orderSearchParams.totalCount<0 ? 0 :orderSearchParams.totalCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="余额变动明细" name="second">
                <el-form size="mini" label-width="120px" style="width:100%;">
                    <el-row :span="24">
                        <el-col :span="6">
                            <el-form-item label="京东订单号：">
                                <el-input v-model="balanceSearchParams.orderId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="业务类型：">
                                <el-select v-model="balanceSearchParams.tradeTypeName" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in balanceTreadTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="日期范围：">
                                <el-col :span="11">
                                    <el-form-item size="mini">
                                        <el-date-picker v-model="balanceSearchParams.startUpdateTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                        </el-date-picker>
                                    </el-form-item>
                                    </el-col>
                                    <el-col style="text-align: center" :span="2">-</el-col>
                                    <el-col :span="11">
                                    <el-form-item size="mini">
                                        <el-date-picker v-model="balanceSearchParams.endUpdateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="">
                                <el-button size="mini" type="primary" icon="search" @click="balanceSearch">查询</el-button>
                                <el-button size="mini" type="primary" icon="circle-cross" @click="balanceResetForm">重置</el-button>
                                <el-button size="mini" type="primary" :disabled="balanceDisabled" icon="circle-cross" @click="balanceImportExcel">导出</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="balance">
                    <div>统计</div>
                    <div>
                        <span>余额支出：{{ balanceTotal.totalOutCome }}元</span> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                        <span>余额收入(含退款)：{{ balanceTotal.totalIncome }}元</span>
                    </div>
                </div>
                <el-table  :data="balanceData" border style="width:100%">
                    <el-table-column align="center" prop="tradeNo" label="业务号" width="100"> </el-table-column>
                    <el-table-column align="center" prop="pin" label="京东账号" width="100"> </el-table-column>
                    <el-table-column align="center" prop="orderId" label="京东订单号" width="100"> </el-table-column>
                    <el-table-column align="center" prop="income" label="收入"  width="100"> </el-table-column>
                    <el-table-column align="center" prop="outcome" label="支出"  width="100"> </el-table-column>
                    <el-table-column align="center" prop="accountType" label="账号类型"  width="100"> </el-table-column>
                    <el-table-column align="center" prop="createdDate" label="余额变动时间"  width="120"> </el-table-column>
                    <el-table-column align="center" prop="tradeTypeName" label="业务类型" width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" prop="notePub" label="备注" :show-overflow-tooltip="true">  </el-table-column>
                </el-table>
                <div class="page" style="text-align:right; padding: 10px 0;">
                    <el-pagination @size-change="balanceChangeSize" @current-change="balanceChangeNumber" :current-page="balanceSearchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="orderSearchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="balanceSearchParams.totalCount">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 了结时的弹窗 -->
        <el-dialog
            title="操作"
            :visible.sync="dialogVisibleOrder"
            width="30%">
            <el-form size="mini" label-width="82px">
                <el-form-item required  label="是否了结：">
                    <el-radio v-model="orderEnd" label="2">是</el-radio>
                    <el-radio v-model="orderEnd" label="1">否</el-radio>
                </el-form-item>
                <div style="padding: 10px 0">备注：</div>
                <el-input v-model="orderRemark" maxlength="500" type="textarea"></el-input>
                <div style="padding: 10px 0">注: 了结时必填</div>
            </el-form>
            <span slot="footer" style="text-align:center; display:inline-block; width:100%;" class="dialog-footer">
                <el-button size="mini" type="primary" @click="confirmOrderEnd">确 定</el-button>
                <el-button size="mini" @click="dialogVisibleOrder = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import MoneyIcon from './moneyCoin.png';
export default {
    name: 'JDfinancialmanage',
    data() {
        return {
            dialogVisibleOrder: false,
            orderDisabled: false,
            activeName: 'first',
            imgSrc: MoneyIcon,
            options: [],
            JDmoneyMsg: {},
            orderEnd: '1',
            orderRemark: '',
            currentOrderData: '',
            orderSearchParams: {
                channelCode: 'YWX001', // 业务线
                sellCode: '', // 销售渠道
                wayBillCode: '', // 物流单号
                orderCode: '',
                itemSkuCode: '',
                itemSkuName: '',
                channelPlatformOrder: '',
                shopOrderCode: '',
                orderItemCode: '',
                errMsg: '',
                startUpdateTime: '',
                endUpdateTime: '',
                pageNo: 1,
                pageSize: 10,
                start: 0,
                totalCount: 0
            },
            errMsgOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '正常',
                value: '正常'
            }, {
                label: '非正常',
                value: '非正常'
            }],
            orderData: [],
            balanceSearchParams: {
                orderId: '',
                tradeTypeName: '',
                startUpdateTime: '',
                endUpdateTime: '',
                pageNo: 1,
                pageSize: 10,
                start: 0,
                totalCount: 0
            },
            balanceTotal: {
                totalOutCome: 0,
                totalIncome: 0
            },
            balanceDisabled: false,
            balanceData: [],
            balanceTreadTypeOptions: [],
            channelsList: [], // 业务线列表
            sellChannelsList: [], // 销售渠道列表
            isChannel: true, // 当前业务线绑定的布尔值
            channelCode: '' // 当前业务线
        };
    },
    mounted: function() {
        // this.channelCode = localStorage.getItem('channelCookie');
        this.currentYear();
        this.JDsearchMoney();
        this.orderInitData();
        this.balanceTreadType();
        this.getChannels(); // 获取业务线
        this.getSellChannels(this.orderSearchParams.channelCode); // 获取业务线
    },
    watch: {},
    methods: {
        getChannels() {
          this.$AXIOS.GET('/bill/channels').then(res => {
            this.channelsList = res.result;
            this.channelsList.unshift({code: '', name: '全部'});
          });
        },
        getSellChannels(channelCode) {
          this.orderSearchParams.sellCode = '';
          if (channelCode) {
            this.isChannel = false;
            this.$AXIOS.GET('/bill/sellChannels', {channelCode}).then(res => {
              this.sellChannelsList = res.result;
              this.sellChannelsList.unshift({sellCode: '', sellName: '全部'});
            });
          } else {
            this.isChannel = true;
          }
        },
        tableRowClassName({row, rowIndex}) {
            if (row.errMsg !== '正常' && row.operate !== '已了结') {
                return 'error-row';
            }
        },
        orderChangeSize(val) {
            this.orderSearchParams.pageSize = val;
            this.orderInitData();
        },
        orderChangeNumber(val) {
            this.orderSearchParams.pageNo = val;
            this.orderInitData();
        },
        handleClick(val) {
            if (val.label === '余额变动明细') {
                this.balanceDataInit();
                this.balanceLooking();
            }
        },
        orderSearch() {
            if (this.orderSearchParams.startUpdateTime && this.orderSearchParams.endUpdateTime && this.orderSearchParams.startUpdateTime > this.orderSearchParams.endUpdateTime) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            this.orderSearchParams.pageNo = 1;
            this.orderInitData();
        },
        orderResetForm() {
            for (let obj in this.orderSearchParams) {
                this.orderSearchParams[obj] = '';
            }
            this.isChannel = true;
            this.orderSearchParams.pageSize = 10;
            this.orderSearchParams.pageNo = 1;
            this.orderSearchParams.totalCount = 0;
            this.orderSearchParams.start = '0';
            this.orderInitData();
        },
        orderImportExcel() {
            if (!this.orderData.length) {
                return this.$utils.messagetip.warningTip('无数据！');
            }
            this.orderDisabled = true;
            this.$AXIOS.EXPORT({url: '/bill/exportOrderDetail', data: this.orderSearchParams, fileName: '订单比对明细'}).finally(() => {
                this.orderDisabled = false;
            });
        },
        endOrder(row) {
            this.orderRemark = row.remark;
            this.orderEnd = '1';
            this.dialogVisibleOrder = true;
            this.currentOrderData = row;
        },
        confirmOrderEnd() {
            if (this.orderEnd === '2' && !this.orderRemark) {
                return this.$utils.messagetip.warningTip('了结时必填');
            }
            this.$AXIOS.PUT('/bill/operate', {id: this.currentOrderData.id, operate: this.orderEnd, remark: this.orderRemark}).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                this.dialogVisibleOrder = false;
                this.orderSearchParams.pageNo = 1;
                this.orderRemark = '';
                this.orderInitData();
            });
        },
        // 订单对比明细
        orderInitData() {
            this.$AXIOS.LISTGET('/bill/orderDetailPage', this.orderSearchParams).then(res => {
                this.orderData = res.result;
                this.orderSearchParams.totalCount = res.totalCount;
            });
        },
        // JD账户余额查询成功
        JDsearchMoney() {
            this.$AXIOS.GET('/bill/balance').then(res => {
                this.JDmoneyMsg = res.result;
            });
        },
        // 默认查询当月信息
        currentYear() {
            let dateArr = new Date().toLocaleDateString().split('/');
            let date = new Date().toLocaleDateString().split('/').join('-');
            dateArr[dateArr.length - 1] = '01';
            dateArr = dateArr.join('-');
            this.orderSearchParams.startUpdateTime = this.balanceSearchParams.startUpdateTime = dateArr;
            this.orderSearchParams.endUpdateTime = this.balanceSearchParams.endUpdateTime = date;
        },
        balanceSearch() {
            if (this.balanceSearchParams.startUpdateTime && this.balanceSearchParams.endUpdateTime && this.balanceSearchParams.startUpdateTime > this.balanceSearchParams.endUpdateTime) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            this.balanceSearchParams.pageNo = 1;
            this.balanceLooking();
            this.balanceDataInit();
        },
        balanceResetForm() {
             for (let obj in this.balanceSearchParams) {
                this.balanceSearchParams[obj] = '';
            }
            this.balanceSearchParams.pageSize = 10;
            this.balanceSearchParams.pageNo = 1;
            this.balanceSearchParams.totalCount = 0;
            this.balanceSearchParams.start = '0';
            this.balanceLooking();
            this.balanceDataInit();
        },
        balanceImportExcel() {
            if (!this.balanceData.length) {
                return this.$utils.messagetip.warningTip('无数据！');
            }
            this.balanceDisabled = true;
            this.$AXIOS.EXPORT({url: '/bill/exportBalanceDetail', data: this.balanceSearchParams, fileName: '余额变动明细'}).finally(() => {
                this.balanceDisabled = false;
            });
        },
        balanceChangeSize(val) {
            this.balanceSearchParams.pageSize = val;
            this.balanceDataInit();
        },
        balanceChangeNumber(val) {
            this.balanceSearchParams.pageNo = val;
            this.balanceDataInit();
        },
        balanceTreadType() {
            this.$AXIOS.GET('/bill/treadType').then(res => {
                this.balanceTreadTypeOptions = res.result.map(item => {
                    return {
                        label: item.treadTypeName,
                        value: item.treadTypeName
                    };
                });
                this.balanceTreadTypeOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        balanceDataInit() {
            this.$AXIOS.LISTGET('/bill/balanceDetailPage', this.balanceSearchParams).then(res => {
                this.balanceData = res.result;
                this.balanceSearchParams.totalCount = res.totalCount;
            });
        },
        // 余额明细统计查询
        balanceLooking() {
            this.$AXIOS.GET('/bill/statisticsBalance', this.balanceSearchParams).then(res => {
                this.balanceTotal = res.result;
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
    .JDfinancialmanage
        .title
            display flex
            justify-content space-between
            border-bottom solid 1px #ccc
            padding 0 10px 10px 10px
            .h2
                font-weight  800
                font-size 15px
            .time
                color: #409EFF
        .JDmoney_wrap
            padding 10px 20px  10px 20px
            border-radius 5px
            border 1px #999 dashed
            margin-top 20px
            background-color #f2f2f2
            li
              padding 15px 0
              border-bottom 1px #999 dashed
              font-size 14px
            li:first-child, li:last-child
                border 0
            .img
                width 32px
                margin-right 8px
            .margin_left
                margin-left 40px
        .balance
            display flex
            justify-content space-between
            padding 10px
            border solid 1px #ebeef5
            border-bottom 0
            font-size 14px
</style>
<style>
    .overflow_hidden{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        width: 180px;
    }
    .el-table .error-row {
        background-color: #ffff00;
    }
    .el-table__empty-block{
        width: auto!important;
    }
</style>


