<template>
  <div class="returnorderout">
      <el-form label-width="125px" size="medium">
        <el-row :span="20">
            <el-col :span="6">
                <el-form-item label="退货出库单号：" prop="allocateOrderCode" size="mini">
                    <el-input v-model="searchParams.outboundNoticeCode"  placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="采购退货单编号：" prop="allocateOrderCode" size="mini">
                    <el-input v-model="searchParams.purchaseOrderCode"  placeholder=""></el-input>
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
                    <el-select v-model="searchParams.warehouseCode" filterable placeholder="请选择">
                        <el-option
                            v-for="item in warehouseOptions"
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
                <el-form-item label="出库单状态："  size="mini">
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
                <el-form-item label="出库单创建人：" prop="allocateOrderCode" size="mini">
                    <el-input v-model="searchParams.create_user" placeholder=""></el-input>
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
                <el-form-item label="出库单创建时间："  size="mini">
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
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
                    <el-button type="default" @click="resetFrom" icon="circle-cross">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div class="mainTable">
         <el-table ref="tableMain" highlight-current-row @cell-click="cellClick" :data="tableData" border style="width: 100%">
            <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="outboundNoticeCode" label="退货出库通知单编号" width="180">   </el-table-column>
            <el-table-column align="center" prop="purchaseOutboundOrderCode"  label="采购退货单编号"  width="180"> </el-table-column>
            <el-table-column align="center" prop="billType" label="单据类型">
                <template slot-scope="scope">
                    {{checkedBillType(scope.row.billType)}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplierName" label="供应商名称"> </el-table-column>
            <el-table-column align="center" prop="warehouseName" label="退货仓库"> </el-table-column>
            <el-table-column align="center" prop="creatorName" label="出库单创建人"> </el-table-column>
            <el-table-column align="center" prop="address" label="状态">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.status === '2'" class="item" effect="dark" :content="scope.row.failureCause" placement="top">
                        <span style="color:red" >{{ showStatus(scope.row.status) }}</span>
                    </el-tooltip>
                    <el-tooltip v-else-if="scope.row.status === '4'" class="item" effect="dark" :content="scope.row.exceptionCause" placement="top">
                        <span style="color:#CC00CC" >{{ showStatus(scope.row.status) }}</span>
                    </el-tooltip>
                        <span v-else>{{ showStatus(scope.row.status) }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="出库创建时间"> </el-table-column>
            <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                    <el-button @click="noticeOut(scope.row)"  v-if="scope.row.status === '0'"  type="text"> 通知出库 </el-button>
                    <el-button @click="quitOut(scope.row)" v-else-if="scope.row.status === '1'"  type="text"> 取消出库 </el-button>
                    <el-button @click="reOut(scope.row)" v-else-if="scope.row.status === '2' || scope.row.status === '5'"  type="text"> 重新出库 </el-button>
                    <el-button  v-else  type="text"> - </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>
    </div>
    <div class="tabs">
        <el-tabs @tab-click="TabClick" v-model="activeName">
            <el-tab-pane label="商品明细" name="first">
                 <el-table :data="skuListData.skuList" border style="width: 100%">
                    <el-table-column type="index" align="center" prop="date" label="序号" width="50">  </el-table-column>
                    <el-table-column align="center" prop="skuName" label="商品SKU名称" width="180">  </el-table-column>
                    <el-table-column align="center" prop="skuCode"  label="商品SKU编号"  width="180"> </el-table-column>
                    <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
                    <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
                    <!-- <el-table-column align="center" prop="address" label="品牌名称"> </el-table-column>
                    <el-table-column align="center" prop="address" label="含税退货单价(元)"> </el-table-column>
                    <el-table-column align="center" prop="address" label="退货税率"> </el-table-column>-->
                    <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
                    <el-table-column align="center" prop="returnOrderType" label="库存类型">
                        <template slot-scope="scope">
                            {{ scope.row.returnOrderType === '1' ? '正品' : '残品' }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outboundQuantity" label="退货数量"> </el-table-column>
                    <el-table-column align="center" prop="actualStorageQuantity" label="实际出库数量"> </el-table-column>
                    <el-table-column align="center" prop="storageTime" label="实际出库时间"> </el-table-column>
                    <el-table-column align="center" prop="address" label="出库状态">
                        <template slot-scope="scope">
                            {{ showStatus(scope.row.status) }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收货方信息" name="second">
                <el-form>
                    <el-row :span="20">
                        <el-col :span="5">
                            <el-form-item label="退货收货人："  size="mini">
                                {{ skuListData.receiver }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="收货人手机号："  size="mini">
                                {{ skuListData.receiverNumber }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="退货省份.城市.地区："  size="mini">
                              <span v-if="skuListData.receiverProvince">{{skuListData.receiverProvince}}</span>
                              <span v-if="skuListData.receiverCity">-{{skuListData.receiverCity}}</span>
                              <span v-if="skuListData.receiverArea">-{{skuListData.receiverArea}}</span>
                                <!-- {{skuListData.receiverProvince + ' ' + skuListData.receiverCity + ' ' + skuListData.receiverArea}} -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="退货详细地址："  size="mini">
                                {{ skuListData.receiverAddress }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                 </el-form>
            </el-tab-pane>
            <el-tab-pane label="其他信息" name="third">
                <el-row style="padding-bottom:20px;">退货说明：{{ skuListData.returnPolicy }}</el-row>
                <el-row>备注：{{ skuListData.remark }}</el-row>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="fourth">
                <operate-table :url="'/logInfoPage'" :isRefresh="isRefresh"  v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
            </el-tab-pane>
        </el-tabs>
    </div>
        <el-dialog
            title="取消出库"
            :visible.sync="dialogVisible"
            width="40%">
            <el-row>
                <div style="font-size:14px;">你确定取消出库吗？</div>
            </el-row>
            <el-row style="padding:15px 0; ">
                <div><span style="color:red;position:reletive; left: 10px;">*</span>请输入取消原因</div>
            </el-row>
            <el-row>
                <el-input v-model="searchParams.cancelReson" type="textarea"></el-input>
            </el-row>
            <div style="text-align:center; padding-top: 20px;" class="dialog-footer">
                <el-button size="mini" type="primary" @click="confirmQuitOut">确 定</el-button>
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import operateTable from '@/components/operateTable';
  export default {
    name: 'returnorderout',
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
            dialogVisible: false,
            searchParams: {
                billType: 0,
                startDate: '', // 开始时间
                endDate: '', // 结束日期
                supplierCode: '',
                outboundNoticeCode: '', // 退货出库通知单编号
                purchaseOrderCode: '', // 采购退货单编号
                warehouseCode: '', // 退货仓库编号
                supplierId: '', // 供应商id
                status: '', // 出库单状态
                cancelReson: '', // 取消出库备注
                create_user: '', // 出库单创建人
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'purchaseOutboundNotice'
            },
            entityId: '', // 操作日志id
            isRefresh: 0, // 是否刷新
            activeName: 'first',
            value: '',
            options: [],
            tableData: [],
            supplierOptions: [], // 供应商名称列表
            warehouseOptions: [], // 退货仓库列表
            statusOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '待通知出库',
                value: '0'
            }, {
                label: '出库仓接收成功',
                value: '1'
            }, {
                label: '出库仓接收失败',
                value: '2'
            }, {
                label: '出库完成',
                value: '3'
            }, {
                label: '出库异常',
                value: '4'
            }, {
                label: '已取消',
                value: '5'
            }, {
                label: '取消中',
                value: '7'
            }],
            skuListData: {
                receiverProvince: '',
                receiverCity: '',
                receiverArea: '',
                list: []
            },
            outboundNoticeCode: ''
        };
    },
    mounted: function() {
        this.initDataTable(this.searchParams);
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
        showStatus(str) {
            if (str === '0') {
                return '待通知出库';
            } else if (str === '1') {
                return '出库仓接收成功';
            } else if (str === '2') {
                return '出库仓接收失败';
            } else if (str === '3') {
                return '出库完成';
            } else if (str === '4') {
                return '出库异常';
            } else if (str === '5' || str === '6') {
                return '已取消';
            } else if (str === '7') {
                return '取消中';
            }
        },
        // 通知出库
        noticeOut(row) {
            this.$confirm('确认后将向仓库发送退货出库通知', '您确认要通知出库吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
              .then(() => {
                this.$AXIOS.JSONPUT('/purchaseOutboundNotice/noticeOut/' + row.outboundNoticeCode ).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout( () => {
                        this.initDataTable(this.searchParams);
                    }, 500);
                });
            })
              .catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        TabClick(name) {
            if (name.name === 'fourth') {
                this.isRefresh += 1;
            }
        },
        // 取消出库
        quitOut(row) {
            this.dialogVisible = true;
            this.searchParams.cancelReson = '';
            this.outboundNoticeCode = row.outboundNoticeCode;
        },
        confirmQuitOut() {
            if (!this.searchParams.cancelReson) {
                this.$utils.messagetip.warningTip('请输入取消原因');
            } else {
                this.$AXIOS.JSONPUT('/purchaseOutboundNotice/cancel/' + this.outboundNoticeCode + '?cancelReson=' + this.searchParams.cancelReson).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    // this.dialogVisible = false;
                    // setTimeout(() => {
                    //     this.initDataTable(this.searchParams);
                    // }, 500);
                }).finally(() => {
                  this.dialogVisible = false;
                    // setTimeout(() => {
                        this.initDataTable(this.searchParams);
                    // }, 500);
                });
            }
        },
        // 重新出库
        reOut(row) {
            this.$confirm('确定后将通知仓库重新出库。', '您确认重新出库吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
              .then(() => {
                this.$AXIOS.JSONPUT('/purchaseOutboundNotice/noticeOut/' + row.outboundNoticeCode ).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout( () => {
                        this.initDataTable(this.searchParams);
                    }, 500);
                });
            })
              .catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        // 点击表格单元格事件
        cellClick(row) {
            this.operateParams.entityId = this.entityId = row.id;
            this.returnFromDetail(row.id);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initDataTable(this.searchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initDataTable(this.searchParams);
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
            this.initDataTable(this.searchParams);
        },
        // 清空数据
        resetFrom() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.billType = 0;
            this.initDataTable(this.searchParams);
        },
        // 数据初始化
        initDataTable(data) {
            this.$AXIOS.LISTGET('/purchaseOutboundNotice/pageList', data).then( res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result;
                if (res.result.length) {
                    this.returnFromDetail(res.result[0].id);
                    this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                } else {
                    this.skuListData = {
                        receiverProvince: '',
                        receiverCity: '',
                        receiverArea: '',
                        list: []
                    };
                    this.entityId = '0';  // 随便填写
                }
            });
        },
        // 获取详情
        returnFromDetail(id) {
            this.operateParams.entityId = this.entityId = id;
            this.$AXIOS.LISTGET(`/purchaseOutboundNotice/detail/${id}`).then(res => {
                this.skuListData = res.result;
            });
        },
        // 获取供应商名称列表
        initSupplierName() {
            this.$AXIOS.GET('/purchaseOutboundNotice/getSuppliers').then(res => {
                this.supplierOptions = res.result.map((item, index) => {
                    item.label = item.supplierName;
                    item.value = item.supplierCode;
                    return item;
                });
                this.supplierOptions.unshift({label: '全部', value: ''});
            });
        },
        // 获取退货仓库列表
        initWarehouse() {
            this.$AXIOS.GET('/purchaseOutboundNotice/getWarehouse').then( res => {
                this.warehouseOptions = res.result.map((item, index) => {
                    return {
                        value: item.code,
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
