<template>
  <div class="purchreturnordeaudit">
    <el-form label-width="125px" size="medium">
        <el-row :span="20">
            <el-col :span="6">
                <el-form-item label="采购退货单编号：" prop="" size="mini">
                    <el-input v-model="searchParams.purchaseOutboundOrderCode"  placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="供应商名称："  size="mini">
                     <el-select  v-model="searchParams.supplierCode" filterable placeholder="请选择">
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
                    <el-select  v-model="searchParams.warehouseInfoId" filterable placeholder="请选择">
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
                <el-form-item label="审核状态："  size="mini">
                    <el-select v-model="searchParams.auditStatus"  filterable placeholder="请选择">
                        <el-option
                            v-for="item in auditStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="提交审核时间："  size="mini">
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker  v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
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
                <el-form-item size="mini">
                    <el-button type="primary" @click="search" icon="search">搜索</el-button>
                    <el-button type="default" @click="resetForm" icon="circle-cross">清空条件</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div class="mainTable">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="purchaseOutboundOrderCode" label="采购退货单编号" width="180">
                <template slot-scope="scope">
                    <span style="cursor:pointer;color:#409EFF" @click="toReviewPage(scope.row.id,'add')" type="text">{{ scope.row.purchaseOutboundOrderCode }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplierName"  label="供应商名称"  width="180"> </el-table-column>
            <el-table-column align="center" prop="warehouseName" label="退货仓库"> </el-table-column>
            <el-table-column align="center" prop="address" label="退货类型">
                <template slot-scope="scope">
                    {{ scope.row.returnOrderType === '1' ? '正品' : '残品' }}
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
            <el-table-column align="center" prop="address" label="审核状态">
                 <template slot-scope="scope">
                    {{ auditStatus(scope.row.auditStatus) }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="auditCreateOperator" label="提交人"> </el-table-column>
            <el-table-column align="center" prop="commitAuditTime" label="提交审核时间"> </el-table-column>
            <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.auditStatus === '1'" @click="toReviewPage(scope.row.id)" type="text"> 审核 </el-button>
                    <el-button v-else type="text"> - </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="page" style="text-align:right; padding: 10px 0;">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'purchreturnordeaudit',
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
            value: '',
            searchParams: {
                billType: 0, // 单据类型
                pageSize: 10,
                pageNo: 1,
                totalCount: 0,
                start: 0,
                startDate: '', // 开始日期
                endDate: '', // 结束日期
                purchaseOutboundOrderCode: '', // 采购退货单编号
                supplierCode: '', // 供应商code
                warehouseInfoId: '', //  仓库id
                returnOrderType: '', // 退货类型
                auditStatus: '1' // 审核状态
            },
            returnOrderTypeOptions: [{ // 退货类型
                label: '全部',
                value: ''
            }, {
                value: '1',
                label: '正品'
            }, {
                value: '2',
                label: '残品'
            }],
            auditStatusOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '待审核'
            }, {
                value: '2',
                label: '已审核'
            }],
            options: [{
                label: '全部',
                value: ''
            }, {
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            supplierOptions: [], // 供应商名称列表
            warehouseOptions: [], // 退货仓库列表
            tableData: []
        };
    },
    mounted: function() {
        this.initTableData(this.searchParams);
        this.initWarehouse();
        this.initSupplierName();
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
        auditStatus(str) {
            if (str === '1') {
                return '待审核';
            } else {
                return '已审核';
            }
        },
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
        resetForm() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.auditStatus = '1';
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
        // 前往审核
        toReviewPage(id, flag) {
            this.$router.push({name: 'returnordeauditdetail', params: {id: id, flag: flag}});
        },
        //  初始化表格数据
        initTableData(data) {
            this.$AXIOS.LISTGET('/purchaseOutboundOrder/auditPagelist', data).then(res => {
                console.log(res);
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
            });
        },
        // 获取供应商名称列表
        initSupplierName() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getSuppliers').then(res => {
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
