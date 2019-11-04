<template>
    <div class="afterSale">
        <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="创建时间：" size="mini">
                        <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.startDate" clearable type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.endDate" type="date" clearable placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="系统订单号：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.scmShopOrderCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="售后订单号：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.afterSaleCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="退货仓库：" prop="" size="mini">
                        <el-select filterable  v-model="searchParams.returnWarehouseCode" placeholder="请选择">
                            <el-option
                            v-for="item in optionsHouse"
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
                    <el-form-item label="物流单号：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.waybillNumber" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户姓名：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.sender" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户电话：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.senderNumber" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="SKU名称：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="SKU编号：" prop="" size="mini">
                        <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="售后类型：" prop="" size="mini">
                        <el-select v-model="searchParams.afterSaleType" placeholder="请选择">
                            <el-option
                            v-for="item in afterSaleTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="default" @click="resetForm" icon="circle-cross">清空条件</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row :span="24">
            <el-button size="mini" @click="addAfterSale" type="primary">新建售后单</el-button>
            <!-- <el-button size="mini" @click="importExcel" >导出</el-button> -->
            <el-button type="primary" @click="moduleDownLoad" icon="circle-cross" size="mini" :disabled="disabledDownLoad">导出</el-button>
        </el-row>
            <!-- 选项卡 -->
        <el-tabs v-model="searchParams.status" @tab-click="handleClick" type="card" style="margin-top: 15px;">
            <el-tab-pane label="全部" name="-1"></el-tab-pane>
            <el-tab-pane label="待客户发货" name="0"></el-tab-pane>
            <el-tab-pane label="客户已发货" name="1"></el-tab-pane>
            <el-tab-pane label="申请中" name="4"></el-tab-pane>
            <el-tab-pane label="仓库已收货" name="7"></el-tab-pane>
            <el-tab-pane label="申请失败" name="5"></el-tab-pane>
            <el-tab-pane label="已完成" name="2"></el-tab-pane>
            <el-tab-pane label="已关闭" name="3"></el-tab-pane>
            <el-tab-pane label="通知仓库失败" name="6"></el-tab-pane>
        </el-tabs>
        <div class="order">
            <div class="orderTable">
                <ul class="title">
                    <li :key="title" v-for="title in orderTitle">{{ title }}</li>
                </ul>
                <div v-show="tableData.length > 0" :key="index" v-for="(data, index) in tableData" class="main">
                    <div class="head">
                        <!-- <span v-show="data.status == 0">[待客户发货]</span>
                        <span v-show="data.status == 1">[客户已发货]</span>
                        <span v-show="data.status == 2">[已完成]</span>
                        <span v-show="data.status == 3">[已取消]</span>
                        <span v-show="data.status == 4">[申请中]</span>
                        <span v-show="data.status == 5">[申请失败]</span>
                        <span v-show="data.status == 6">[通知仓库失败]</span> -->
                        <span>创建时间：{{ data.createTime | formatDate }}</span>
                        <span>系统订单号：{{ data.scmShopOrderCode }}</span>
                        <span>售后单编号：<label @click="toAfterSaleDetail(data)">{{ data.afterSaleCode }}</label></span>
                        <span>销售渠道：{{ data.sellCodeName }}</span>
                        <span>店铺名称：{{ data.shopName }}</span>
                    </div>
                    <el-table   :span-method="objectSpanMethod" :data="data.afterSaleOrderDetailVOList" border style="width: 100%">
                        <el-table-column align="center" width="68" type="index"  prop="date" label="序号">
                        </el-table-column>
                        <el-table-column align="left" prop="date" label="商品信息">
                            <template slot-scope="scope">
                                <div style="height:80px; padding:10px 0 10px 10px; display:flex">
                                    <img  style="width:60px;height:60px;" :src="scope.row.picture"/>&nbsp;&nbsp;<span @click="toGoodDetail(scope.row)" style="cursor:pointer; color: #409eff">{{ scope.row.skuName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop=""  label="售后类型">
                            <template slot-scope="scope">
                                <span v-show="data.afterSaleType == 1"> 退货</span>
                                <span v-show="data.afterSaleType == 0"> 取消发货</span>
                                <span v-show="data.afterSaleType == 2"> 换货</span>
                                <span v-show="data.afterSaleType == 3"> 维修</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="skuCode"  label="SKU编号"></el-table-column>
                        <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
                        <el-table-column align="center" prop="returnNum"  label="拟退货数量"> </el-table-column>
                        <el-table-column align="center"  label="实际入库数量">
                          <template slot-scope="scope">
                            <p v-if="(scope.row.inNum+scope.row.defectiveInNum)!=0">{{ scope.row.inNum+scope.row.defectiveInNum }}</p>
                                    <p v-else></p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="" label="退货仓">
                            <template slot-scope="scope">
                                    {{ data.returnWarehouseName }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="address"  label="物流信息">
                            <template slot-scope="scope">
                                <div style="line-height:20px; padding:10px 0">
                                    <p>{{ data.logisticsCorporation}}</p>
                                    <p>{{ data.waybillNumber }}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop=""  label="状态">
                            <template slot-scope="scope">
                                <span v-show="data.status == 0">待客户发货</span>
                                <span v-show="data.status == 1">客户已发货</span>
                                <span v-show="data.status == 2">已完成</span>
                                <span v-show="data.status == 3">已关闭</span>
                                <span v-show="data.status == 4">申请中</span>
                                <span v-show="data.status == 5">申请失败</span>
                                <el-tooltip class="item" effect="dark" :content="data.failureCause ? data.failureCause : '暂无原因'" placement="top">
                                   <span style="color:red; cursor:pointer;" v-show="data.status == 6">通知仓库失败</span>
                                </el-tooltip>
                                <span v-show="data.status == 7">仓库已收货</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="returnNum"  label="操作">
                            <template slot-scope="scope">
                                <div v-if="data.status == 6">
                                    <el-button @click="reSend(data)"  type="text">重发</el-button>
                                    <el-button @click="dealWith(scope.row)" v-if="data.afterSalePlatform == 1 && data.pickwareType == 4" type="text">处理</el-button>
                                </div>
                                <span v-else>-</span>
                                <!-- <el-button @click="dealWith(scope.row)"  type="text">处理</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-show="!tableData.length" style="text-align:center; padding: 50px 0;">
                    暂无数据
                </div>
            </div>
            <div style="margin:20px 0; text-align:right" class="">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchParams.pageNo"
                    :page-sizes="[10, 20, 50, 400]"
                    :page-size="searchParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchParams.totalCount < 0 ? 0 : searchParams.totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 新增售货单弹窗 -->
        <el-dialog
            title="新增售货单"
            :visible.sync="dialogVisible"
            width="50%">
            <div style="width:50%; margin: 0 auto;display:flex;line-height:40px;">
                <div style="width:100px; ">系统订单号：</div>
                <el-input v-model.trim="shopOrderCode"  placeholder="请输入销售订单中的系统订单号" size="mini" type="text"></el-input>
            </div>
            <div style="text-align:center" slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click='confirmAdd'>查 找</el-button>
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 映射京东地址弹窗 -->
        <el-dialog width="50%"  title="映射地址"  :visible.sync="dialogVisibleDealWith">
            <el-form label-width="120px" size="mini">
                <div v-show="jdAddressDetail.pickwareType == 4">
                    <div style="width:120px;text-align:right; padding:0 12px 10px 0; font-weight: 800;">取件地址：</div>
                    <el-form-item label="原地址：">
                        {{ jdAddressDetail.pickwareProvince }}{{ jdAddressDetail.pickwareCity }}{{ jdAddressDetail.pickwareCounty }}{{ jdAddressDetail.pickwareVillage }}{{ jdAddressDetail.pickwareAddress }}
                    </el-form-item>
                    <el-form-item required label="输入新地址：">
                        <el-cascader
                            ref="jdAddressPick"
                            separator="-"
                            style="width:250px;"
                            placeholder="试试搜索：北京"
                            v-model="jdAddresspickDefault"
                            :options="jdAddressArr" filterable>
                        </el-cascader>
                        <el-input v-model="jdpickAddress" maxlength="500" style="padding-top:10px;" placeholder="详细地址（无需再输入省市区及街道信息）" type="textarea"></el-input>
                    </el-form-item>
                </div>
                <div v-show="jdAddressDetail.afterSaleType == 2 || jdAddressDetail.afterSaleType == 3">
                    <div style="width:120px;text-align:right; padding:0 12px 10px 0; font-weight: 800;">返件地址：</div>
                    <el-form-item label="原地址：">
                        {{ jdAddressDetail.returnwareProvince }}{{ jdAddressDetail.returnwareCity }}{{ jdAddressDetail.returnwareCounty }}{{ jdAddressDetail.returnwareVillage }}{{ jdAddressDetail.returnwareAddress }}
                    </el-form-item>
                    <el-form-item required label="输入新地址：">
                        <el-cascader
                            ref="jdAddressReturn"
                            separator="-"
                            style="width:250px;"
                            placeholder="试试搜索：北京"
                            v-model="jdAddressreturnDefault"
                            :options="jdAddressArr" filterable>
                        </el-cascader>
                        <el-input v-model="jdreturnAddress" style="padding-top:10px;" maxlength="500" placeholder="详细地址（无需再输入省市区及街道信息）" type="textarea"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align:center" slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click='confirmJDaddress'>提交</el-button>
                <el-button size="mini" @click="dialogVisibleDealWith = false">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios';
import { formatDate } from '@/components/data';
import qs from 'qs';
export default {
    name: 'afterSale',
    data() {
        return {
            disabledDownLoad: false,
            dialogVisibleDealWith: false,
            width: '5%',
            searchParams: {
                afterSaleType: '',
                startDate: '',  // 开始时间
                endDate: '',  // 结束时间
                scmShopOrderCode: '', // 系统订单号
                afterSaleCode: '', // 售后订单号
                waybillNumber: '', // 物流单号
                sender: '', // 客户姓名
                senderNumber: '', // 客户电话
                skuName: '', // SKU名称
                skuCode: '', // sku编号
                status: '-1', // 发货单状态
                returnWarehouseCode: '', // 退货仓库code
                start: 0,
                pageSize: 10,
                pageNo: 1,
                totalCount: 0
            },
            shopOrderCode: '', // 售后单号
            reSendDisabled: true,
            dialogVisible: false,
            value: '',
            activeName: '0',
            optionsHouse: [],
            orderTitle: ['序号', '商品信息', '售后类型', 'SKU编号', '规格', '拟退货数量', '实际入库数量', '退货仓', '物流信息', '状态', '操作'],
            options: [{
                label: '全部',
                value: ''
            }, {
                label: '自采商品',
                value: '1'
            }, {
                label: '代发商品',
                value: '2'
            }],
            tableData: [],
            jdAddresspickDefault: [],
            jdAddressreturnDefault: [],
            jdAddressDetail: '',
            jdpickAddress: '',
            jdreturnAddress: '',
            jdAddressArr: [],
            jdAddressDefault: [],
            afterSaleTypeOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '取消发货',
                value: '0'
            }, {
                label: '退货',
                value: '1'
            }, {
                label: '换货',
                value: '2'
            }, {
                label: '维修',
                value: '3'
            }]
        };
    },
    mounted: function() {
        const start = new Date();
        const end = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
        this.searchParams.startDate = start;
        this.searchParams.endDate = end;
        if (this.$route.query.status) {
          this.searchParams.status = this.$route.query.status;
        }
        let data = this.searchParams;
        data.startDate = this.formatDataChange(start, 'yyyy-MM-dd');
        data.endDate = this.formatDataChange(end, 'yyyy-MM-dd');
        console.log(data);
        if (this.$route.query.status !== '') {
          data.startDate = '';
          data.endDate = '';
        }
        this.initDataTable(data);
        this.quitWarehouse();
        this.JDAddressInte();
    },
    filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    methods: {
      moduleDownLoad() {
        this.disabledDownLoad = true;
        let url = '/scm-web/afterSaleOrder/exportAfterSaleOrder?';
        for (let obj in this.searchParams) {
            url += obj + '=' + this.searchParams[obj] + '&';
        }
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
          const fileName = '售后单数据.xls'; // 下载文件名称
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          this.disabledDownLoad = false;
        });
      },
        // 表格控制
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 5 || columnIndex === 6) {
                if (rowIndex % this.tableData.length === 0) {
                    return {
                        rowspan: this.tableData.length,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        dealWith(row) {
            this.jdAddressDetail = '';
            this.jdpickAddress = '';
            this.jdreturnAddress = '';
            this.jdAddresspickDefault = [];
            this.jdAddressreturnDefault = [];
            this.$AXIOS.GET('/afterSaleOrder/queryPickReturnAddress', {afterSaleCode: row.afterSaleCode}).then(res => {
                this.jdAddressDetail = res.result;
                this.dialogVisibleDealWith = true;
            });
        },
        confirmJDaddress() {
            let jdpick = this.$refs['jdAddressPick'].currentLabels;
            let jdreturn = this.$refs['jdAddressReturn'].currentLabels;
            let data = {
                afterSaleCode: this.jdAddressDetail.afterSaleCode
            };
            if (this.jdAddressDetail.pickwareType === 4) {
                if (!jdpick.length || !this.jdpickAddress) {
                    return this.$utils.messagetip.warningTip('请完善取件地址再提交');
                } else {
                    data.pickwareProvince = jdpick[0];
                    data.pickwareCity = jdpick[1];
                    data.pickwareCounty = jdpick[2];
                    data.pickwareVillage = jdpick[3] || '';
                    data.pickwareAddress = this.jdpickAddress;
                }
            }
            if (this.jdAddressDetail.afterSaleType === 2 || this.jdAddressDetail.afterSaleType === 3) {
                if (!jdreturn.length || !this.jdreturnAddress) {
                    return this.$utils.messagetip.warningTip('请完善返件地址再提交');
                } else {
                    data.returnwareProvince = jdreturn[0];
                    data.returnwareCity = jdreturn[1];
                    data.returnwareCounty = jdreturn[2];
                    data.returnwareVillage = jdreturn[3] || '';
                    data.returnwareAddress = this.jdreturnAddress;
                }
            }

            this.$AXIOS.JSONPOST('/afterSaleOrder/updatePickReturnAddress', data, true).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                this.dialogVisibleDealWith = false;
                this.initDataTable(this.searchParams);
            });
        },
        // 导出列表
        importExcel() {
            let url = '/scm-web/afterSaleOrder/exportAfterSaleOrder?';
            for (let obj in this.searchParams) {
                url += obj + '=' + this.searchParams[obj] + '&';
            }
            window.open(url);
        },
        // 搜索
        search() {
            if (this.searchParams.startDate && this.searchParams.endDate && this.searchParams.startDate > this.searchParams.endDate) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            this.searchParams.pageNo = 1;
            this.initDataTable(this.searchParams);
        },
        // 重置
        resetForm() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.totalCount = 0;
            this.searchParams.start = 0;
            this.searchParams.status = '-1';
            this.initDataTable(this.searchParams);
        },
        // 重发
        reSend(row) {
            if (this.reSendDisabled) {
                this.$confirm('是否重发?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.reSendDisabled = false;
                    this.$AXIOS.GET('/afterSaleOrder/retry', {afterSaleCode: row.afterSaleCode}).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        setTimeout(() => {
                            this.initDataTable(this.searchParams);
                        }, 500);
                    }).finally(res => {
                        setTimeout(() => {
                            this.reSendDisabled = true;
                        }, 500);
                    });
                }).catch(() => {
                  this.$utils.messagetip.infoTip('已取消重发');
                });
            }
        },
        toGoodDetail(row) {
            let config = {};
            if (row.skuCode.indexOf('SP0') > -1) {
                // let obj = {
                //     spuCode: row.spuCode,
                //     skuCode: row.skuCode
                // };
                // // 自营
                // config = {
                //     title: '商品详情',
                //     href: 'goods/goodsSkuDetail.html?' + qs.stringify(obj)
                // };
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
                // this.$store.dispatch('selectChannel/setMuneTab', {
                //     title: '商品查询',
                //     route: '/goodsquery'
                // });
            } else {
                // let obj = {
                //     flag: 1,
                //     isClose: true,
                //     hideLogs: true,
                //     skuCode: row.skuCode
                // };
                // // 代发
                // config = {
                //     title: '商品详情',
                //     href: 'goods/externalGoodsDetail.html?' + qs.stringify(obj)
                // };
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
                // this.$store.dispatch('selectChannel/setMuneTab', {
                //     title: '商品查询',
                //     route: '/goodsquery'
                // });
            }
            // top.window.addTab(config);
        },
        toAfterSaleDetail(data) {
            this.$router.push({name: 'afterSaleDetail', params: {id: data.id}});
        },
        handleClick(val) {
            this.searchParams.pageNo = 1;
            this.initDataTable(this.searchParams);
        },
        /**
         * @param val 每页显示多少条数据
         */
        handleSizeChange(val) {
            this.searchParams.pageSize = val;
            this.initDataTable(this.searchParams);
        },
        /**
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.searchParams.pageNo = val;
            this.initDataTable(this.searchParams);
        },
        addAfterSale() {
            this.shopOrderCode = '';
            this.dialogVisible = true;
        },
        confirmAdd() {
            //  this.$router.push({path: '/afterSaleAdd', query: { code: '1709071742343460345' }});
            if (this.shopOrderCode) {
                this.$AXIOS.GET('/afterSaleOrder/checkOrder/' + this.shopOrderCode).then(res => {
                   this.$utils.messagetip.successTip('查询成功');
                   setTimeout(() => {
                       this.$router.push({name: 'afterSaleAdd', params: {code: this.shopOrderCode}});
                   }, 500);
                });
            } else {
                this.$utils.messagetip.warningTip('请输入系统订单号');
            }
        },
        /**
         * @param data 为过滤搜索的参数
         */
        initDataTable(data) {
            this.$AXIOS.LISTGET('/afterSaleOrder/queryAfterSaleOrderPage', data).then(res => {
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
                if (!res.result.length) {
                    this.disabledDownLoad = true;
                } else {
                    this.disabledDownLoad = false;
                }
            });
        },
        // 获取退货仓库列表
        quitWarehouse() {
            this.$AXIOS.GET('/warehouseInfo/selectReturnWarehouseName').then(res => {
                this.optionsHouse = res.result.map((item, index) => {
                    return {
                        value: item.code,
                        label: item.name
                    };
                });
            });
        },
        // 京东地址初始化
        JDAddressInte() {
            this.$AXIOS.LISTGET('/metadata/jdAddress').then(res => {
                this.jdAddressArr = res.map(item => {
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
                                                value: item2.id,
                                                children: item2.children
                                                ? item2.children.map((item3, index3, now3) => {
                                                        return {
                                                            label: item3.text,
                                                            value: item3.id
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
<style lang="stylus" scoped>
  .clickColour
    color #409EFF
    cursor pointer
  .model
    span{
      font-size:14px;
      padding-left 10px;
      cursor pointer
    }
  .order
    .page
        width 100%
        text-align right

</style>
<style lang="stylus">
.orderTable
    font-size 12px
    .title
        overflow hidden
        text-align center
        background-color #f5f7fa
        border 1px #c2c2c2 solid
        li{
          width 9.63%
          float left
          text-align center
          padding 10px 0
          border-right 1px #c2c2c2 solid
        }
        li:first-child {
           width 3.62%
        }
        li:last-child
            border-right none
    .main
      .table
          li
            display flex
            text-align center
            border solid 1px #c2c2c2
            border-top none
            div
              width 17%
              height 80px
              display flex
              justify-content center
              align-items center

          li
            div:first-child {
              width 5%
            }
          li
            div
                border-right 1px #c2c2c2 solid
            div:nth-child(2) {
              width 27%
            }
            div:last-child
                border-right none
            div.shopText
               display flex
               justify-content flex-start
            div.shopText .text
                width 100%
                display block
                text-align left
                padding 18px 0
            div.shopText .text p
                padding-bottom 5px
            div.shopText  p:last-child
                padding 0
            div.shopText .img
                width 100px
                border-right 0

      .head
          padding 10px 20px
          background-color #f5f7fa
          margin-top 5px
          border 1px #c2c2c2 solid
          span
            padding-right 20px
            label
              color #409EFF
              cursor pointer
      .bottom
           padding 10px 20px
           text-align right
    .el-table thead
        display none
</style>


