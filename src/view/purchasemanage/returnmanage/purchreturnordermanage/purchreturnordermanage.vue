<template>
  <div class="purchreturnordermanage">
    <el-form label-width="125px" size="medium">
        <el-row :span="20">
            <el-col :span="6">
                <el-form-item label="采购退货单编号：" prop="allocateOrderCode" size="mini">
                    <el-input  v-model="searchParams.purchaseOutboundOrderCode" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="供应商名称："  size="mini">
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
                <el-form-item label="退货仓库："  size="mini">
                    <el-select v-model="searchParams.warehouseInfoId" filterable placeholder="请选择">
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
                <el-form-item label="退货类型："  size="mini">
                    <el-select v-model="searchParams.returnOrderType" filterable placeholder="请选择">
                        <el-option
                            v-for="item in returnOrderTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="20">
            <el-col :span="6">
                <el-form-item label="单据状态："  size="mini">
                    <el-select v-model="searchParams.status"  filterable placeholder="请选择">
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
                <el-form-item label="出库状态："  size="mini">
                    <el-select v-model="searchParams.outboundStatus" filterable placeholder="请选择">
                        <el-option
                            v-for="item in outboundStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="单据类型："  size="mini">
                    <el-select v-model="searchParams.billType" filterable placeholder="请选择">
                        <el-option
                            v-for="item in billTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="最后更新时间："  size="mini">
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker  v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.endDate"  type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="20">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">
                <el-form-item size="mini">
                    <el-button type="primary" @click="search" icon="search">搜索</el-button>
                    <el-button type="default" @click="resetSearchParams" icon="circle-cross">清空条件</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-row class="btn_group">
        <el-button @click="addOrder" size="mini" >
            <i class="el-icon-circle-plus-outline" style="padding-right:2px;"></i>
            新增采购退货单
        </el-button>
    </el-row>
    <div class="mainTable" style="margin:10px 0 20px 0">
        <el-table ref="tableMain" highlight-current-row @cell-click="cellClick" :data="tableData" border style="width: 100%">
            <el-table-column type="index" align="center" prop="date" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="purchaseOutboundOrderCode" label="采购退货单编号" width="180">  </el-table-column>
            <el-table-column align="center" prop="supplierName"  label="供应商名称"  width="180"> </el-table-column>
            <el-table-column align="center" prop="warehouseName" label="退货仓库"> </el-table-column>
            <el-table-column align="center" prop="address" label="退货类型">
                <template slot-scope="scope">
                    <div v-if="scope.row.returnOrderType === '1'">正品</div>
                    <div v-else-if="scope.row.returnOrderType === '2'">残品</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="提货方式">
                <template slot-scope="scope">
                    {{ pickType(scope.row.pickType) }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="totalFee" label="退货总金额(元)"> </el-table-column>
            <el-table-column align="center" prop="billType" label="单据类型">
                <template slot-scope="scope">
                    {{checkedBillType(scope.row.billType)}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="单据状态">
                <template slot-scope="scope">
                    {{singleStatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="出库状态">
                <template slot-scope="scope">
                    {{ outboundStatus(scope.row.outboundStatus) }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateTime" label="最近更新时间"> </el-table-column>
            <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                    <el-button v-show="scope.row.status === '0' || scope.row.status === '2'" @click="editOrder(scope.row)" type="text"> 编辑 </el-button>
                    <el-button v-show="scope.row.status === '0' || scope.row.status === '2'" @click="deleteQuitOrder(`delete`)" type="text"> 删除 </el-button>
                    <el-button v-show="scope.row.status === '3' " @click="outboundWarn" type="text"> 出库通知 </el-button>
                    <el-button v-show="scope.row.status === '3' || (scope.row.status === '4' &&  (scope.row.noticeStatus === '0' || scope.row.noticeStatus === '2' || scope.row.noticeStatus === '5')) " @click="deleteQuitOrder(`obsolete`)" type="text"> 作废 </el-button>
                    <el-button v-show="scope.row.status === '5' || scope.row.status === '1'" type="text"> - </el-button>
                    <!-- <el-button v-show="(scope.row.status === '4' &&  scope.row.noticeStatus === '2') || (scope.row.status === '4' &&  scope.row.noticeStatus === '3') || (scope.row.status === '4' &&  scope.row.noticeStatus === '4')" type="text"> - </el-button> -->
                    <el-button v-show="(scope.row.status === '4' && scope.row.noticeStatus !== '0') && (scope.row.status === '4' && scope.row.noticeStatus !== '2') && (scope.row.status === '4' && scope.row.noticeStatus !== '5')" type="text"> - </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>
    </div>
    <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品明细" name="first">
                <el-table :data="tableDataDetail.purchaseOutboundDetailList" border style="width: 100%">
                    <el-table-column type="index" align="center" prop="date" label="序号" width="50">  </el-table-column>
                    <el-table-column align="center" prop="skuName" label="商品SKU名称" width="180">  </el-table-column>
                    <el-table-column align="center" prop="skuCode"  label="商品SKU编号"  width="180"> </el-table-column>
                    <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
                    <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
                    <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
                    <el-table-column align="center" prop="price" label="含税退货单价(元)"> </el-table-column>
                    <el-table-column align="center" prop="taxRate" label="退货税率">
                        <template slot-scope="scope">
                            {{scope.row.taxRate}}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="totalAmount" label="退货总金额(元)"> </el-table-column>
                    <el-table-column align="center" prop="address" label="库存类型">
                        <template slot-scope="scope">
                            {{ scope.row.returnOrderType === '1' ? '正品' : '残品' }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outboundQuantity" label="退货数量"> </el-table-column>
                    <el-table-column align="center" prop="actualStorageQuantity" label="实际出库数量"> </el-table-column>
                    <el-table-column align="center" prop="storageTime" label="实际出库时间"> </el-table-column>
                    <el-table-column align="center" prop="address" label="出库状态">
                        <template slot-scope="scope">
                            {{ outboundStatus(scope.row.outboundStatus) }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收货方信息" name="second">
                <el-form>
                    <el-row :span="20">
                        <el-col :span="5">
                            <el-form-item label="退货收货人："  size="mini">
                                {{tableDataDetail.receiver}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="收货人手机号："  size="mini">
                                {{tableDataDetail.receiverNumber}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="退货省份.城市.地区："  size="mini">
                              <span v-if="tableDataDetail.receiverProvinceName">{{tableDataDetail.receiverProvinceName}}</span>
                              <span v-if="tableDataDetail.receiverCityName">-{{tableDataDetail.receiverCityName}}</span>
                              <span v-if="tableDataDetail.receiverAreaName">-{{tableDataDetail.receiverAreaName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="退货详细地址："  size="mini">
                                {{tableDataDetail.receiverAddress}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                 </el-form>
            </el-tab-pane>
            <el-tab-pane label="其他信息" name="third">
                <el-row style="padding-bottom:20px;">退货说明：{{ tableDataDetail.returnPolicy}}</el-row>
                <el-row>备注：{{ tableDataDetail.remark }}</el-row>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="fourth">
                 <operate-table :url="'/logInfoPage'"  v-if="operateParams.entityId" :entityId='entityId' :params="operateParams"></operate-table>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>
import operateTable from '@/components/operateTable';
  export default {
    name: 'purchreturnordermanage',
    data() {
        return {
            billTypeList: [
              {
                label: '全部',
                value: 0
              },
              {
                label: '实退',
                value: 1
              },
              {
                label: '修正',
                value: 2
              }
            ], // 单据类型列表
            searchParams: {
                billType: 0, // 单据类型
                purchaseOutboundOrderCode: '', // 采购退货单编号
                commitAuditTime: '', // 提交审核时间
                auditStatus: '', // 审核状态：1-提交审核,2-审核驳回,3-审核通过,
                outboundStatus: '', // 出库状态:1-等待出库，2-出库完成，3-出库异常，4-其他
                status: '', // 单据状态:0-暂存,1-提交审核,2-审核驳回,3-审核通过,4-出库通知,5-作废
                returnOrderType: '', // 退货类型
                warehouseInfoId: '', // 退货仓库id
                supplierCode: '', // 供应商code
                purchaseOrderCode: '', // 采购退货单编号
                isValid: '', // 是否启用
                startDate: '', // 开始时间
                endDate: '', // 结束日期
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            activeName: 'first',
            value: '',
            tableData: [], // 采购退货单表格
            tableDataDetail: [], // 采购退货单详情表格
            supplierOptions: [], // 供应商名称列表
            warehouseOptions: [], // 退货仓库列表
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'purchaseOutboundOrder'
            },
            isRefresh: 0,
            entityId: '',
            returnOrderTypeOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '正品'
            }, {
                value: '2',
                label: '残品'
            }],
            statusOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '暂存'
            }, {
                value: '1',
                label: '提交审核'
            }, {
                value: '2',
                label: '审核驳回'
            }, {
                value: '3',
                label: '审核通过'
            }, {
                value: '4',
                label: '出库通知'
            }, {
                value: '5',
                label: '作废'
            }],
            outboundStatusOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '等待出库'
            }, {
                value: '2',
                label: '出库完成'
            }, {
                value: '3',
                label: '出库异常'
            }, {
                value: '4',
                label: '其他'
            }]
        };
    },
    mounted: function() {
        this.initTableData(this.searchParams);
        this.initSupplierName();
        this.initWarehouse();
    },
    components: {
        operateTable
    },
    methods: {
        checkedBillType(billType) {
          if (billType === 1) {
              return '实退';
          } else if (billType === 2) {
              return '修正';
          }
        },
        pickType(str) {
            if (str === '1') {
                return '到仓自提';
            } else if (str === '2') {
                return '京东配送';
            } else if (str === '3') {
                return '其他物流';
            }
        },
        singleStatus(str) {
            if (str === '0') {
                return '暂存';
            } else if (str === '1') {
                return '提交审核';
            } else if (str === '2') {
                return '审核驳回';
            } else if ( str === '3') {
                return '审核通过';
            } else if (str === '4') {
                return '出库通知';
            } else if (str === '5') {
                return '作废';
            }
        },
        outboundStatus(str) {
            if (str === '1') {
                return '等待出库';
            } else if (str === '2') {
                return '出库完成';
            } else if ( str === '3') {
                return '出库异常';
            } else if (str === '4' || str === '' || str === null) {
                return '-';
            }
        },
        handleClick(row) {
            console.log(row);
        },
        // 点击表单元格
        cellClick(row, dom, obj, obj1) {
            let str = obj1.target.innerText;
            if (str !== '编辑') {
                this.initTableDataDetail(row.id);
            }

            this.operateParams.entityId = this.entityId = row.id;
        },
        // 前往退货单新增或者编辑页
        addOrder() {
            this.$router.push({name: 'purchreturnorderaddoredit', params: {id: 'add'}, query: {isadd: 1}});
        },
        editOrder(row) {
            this.$router.push({name: 'purchreturnorderaddoredit', params: { id: row.id }, query: {isadd: 0}});
        },
        // 重置条件
        resetSearchParams() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.start = 0;
            this.searchParams.totalCount = 0;
            this.searchParams.billType = 0;
            this.initTableData(this.searchParams);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initTableData(this.searchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initTableData(this.searchParams);
        },
        // 搜索
        search() {
            if (this.searchParams.endDate && this.searchParams.startDate) {
                if (this.searchParams.endDate < this.searchParams.startDate) {
                    this.$utils.messagetip.warningTip('结束日期不能小于起始日期！');
                    return;
                }
            }
            this.searchParams.pageNo = 1;
            this.initTableData(this.searchParams);
        },
        // 删除退货单
        deleteQuitOrder(str) {
            let str1, str2;
            if (str === 'delete') {
                str1 = '您确认要删除吗？';
                str2 = '删除后数据将不可恢复';
            } else if (str === 'obsolete') {
                str1 = '您确认要作废吗？';
                str2 = '确认后采购退货单及其相关单据将一并被作废';
            }
            this.$confirm(str2, str1, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
              .then(() => {
                this.$AXIOS.JSONPUT('/purchaseOutboundOrder/updateStatus/' + this.operateParams.entityId).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout(() => {
                        this.searchParams.pageNo = 1;
                        this.initTableData(this.searchParams);
                    }, 500);
                });
            })
              .catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 出库通知单
        outboundWarn() {
            this.$confirm('确认后将产生退货出库通知单', '您确认要出库通知吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
              .then(() => {
                this.$AXIOS.JSONPUT('/purchaseOutboundOrder/warahouseAdvice/' + this.operateParams.entityId).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout(() => {
                        this.searchParams.pageNo = 1;
                        this.initTableData(this.searchParams);
                    }, 500);
                });
            })
              .catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 采购单列表数据
        initTableData(data) {
            this.$AXIOS.LISTGET('/purchaseOutboundOrder/pagelist', data).then( res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result;
                if (res.result.length) {
                    let id = res.result[0].id;
                    this.initTableDataDetail(id);
                    this.operateParams.entityId = this.entityId = id;
                    this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                } else {
                    this.tableDataDetail = [];
                    this.entityId = '';
                }
            });
        },
        // 获取采购单详情数据
        initTableDataDetail(id) {
            this.$AXIOS.GET('/purchaseOutboundOrder/getOrder/' + id).then(res => {
                for (let obj in res.result) {
                    if (obj === 'purchaseOutboundDetailList') {
                        continue;
                    } else {
                        if (res.result[obj] === '' || res.result[obj] === null) res.result[obj] = '-';
                    }
                }
                this.tableDataDetail = res.result;
            });
        },
        // 获取供应商名称列表
        initSupplierName() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getSuppliers').then(res => {
                this.supplierOptions = res.result.map((item, index) => {
                    return {
                        value: item.supplierCode,
                        label: item.supplierName
                    };
                });
                this.supplierOptions.unshift({label: '全部', value: ''});
            });
        },
        // 获取退货仓库列表
        initWarehouse() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getWarehouse').then( res => {
                this.warehouseOptions = res.result.map((item, index) => {
                    return {
                        value: item.id,
                        label: item.warehouseName
                    };
                });
                this.warehouseOptions.unshift({label: '全部', value: ''});
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>

</style>
