<template>
    <div class="OILreport">
        <el-form label-width="150px" size="mini">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="商品SKU编号：">
                        <el-input v-model="searchParams.skuCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="粮油商品SKU编号：">
                        <el-input v-model="searchParams.supplierSkuCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="粮油商品名称：">
                        <el-input v-model="searchParams.itemName"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="平台订单号：">
                        <el-input v-model="searchParams.platformOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="店铺订单号：">
                        <el-input v-model="searchParams.shopOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="粮油订单号：">
                        <el-input v-model="searchParams.supplierOrderCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="系统发送粮油日期：">
                        <el-col :span="11">
                            <el-form-item size="mini">
                                <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                            </el-col>
                            <el-col style="text-align: center" :span="2">-</el-col>
                            <el-col :span="11">
                            <el-form-item size="mini">
                                <el-date-picker v-model="searchParams.endDate"  type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                 <el-col :span="6">
                    <el-form-item label="">
                        <el-button size="mini" type="primary" icon="search" @click="search">查询</el-button>
                        <el-button size="mini" type="primary" icon="circle-cross" @click="resetForm">重置</el-button>
                        <el-button size="mini" type="primary" :disabled="orderDisabled" icon="circle-cross" @click="importExcel">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" border style="width:100%">
            <el-table-column align="center" prop="skuCode" label="商品SKU编号"  width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="supplierSkuCode" label="粮油商品SKU编号"  width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="itemName" label="粮油商品名称"  :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="num" label="交易数量"  width="80"> </el-table-column>
            <el-table-column align="center" prop="platformOrderCode" label="平台订单号" width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="shopOrderCode" label="店铺订单号" width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="supplierOrderCode" label="粮油订单号" width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column align="center" prop="payment" label="买家实付商品金额"  width="100"> </el-table-column>
            <el-table-column align="center" prop="createTime" label="系统发送粮油时间"  width="120"> </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OILreport',
    data() {
        return {
            orderDisabled: false,
            searchParams: {
                skuCode: '',
                supplierSkuCode: '',
                itemName: '',
                platformOrderCode: '',
                shopOrderCode: '',
                supplierOrderCode: '',
                startDate: '',
                endDate: '',
                pageNo: 1,
                pageSize: 10,
                start: 0,
                totalCount: 0
            },
            tableData: []
        };
    },
    mounted: function() {
        this.currentYear();
        this.initData();
    },
    methods: {
        // 页码条数改变
        changeSize(val) {
          this.searchParams.start = 0;
          this.searchParams.pageNo = 1;
          this.searchParams.pageSize = val;
          this.initData();
        },
        // 当前页码改变
        changeNumber(val) {
          this.searchParams.pageNo = val;
          this.searchParams.start = (val - 1) * this.searchParams.pageSize;
          this.initData();
        },
        search() {
            if (this.searchParams.startDate && this.searchParams.endDate && this.searchParams.startDate > this.searchParams.endDate) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            this.searchParams.pageNo = 1;
            this.initData();
        },
        resetForm() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.totalCount = 0;
            this.searchParams.start = '0';
            this.initData();
        },
        importExcel() {
            if (!this.tableData.length) {
                return this.$utils.messagetip.warningTip('无数据!');
            }
            this.orderDisabled = true;
            this.$AXIOS.EXPORT({url: '/LyBill/ExportOrder', data: this.searchParams, fileName: '粮油代发报表'}).finally(() => {
                this.orderDisabled = false;
            });
        },
        initData() {
            this.$AXIOS.LISTGET('/LyBill/LyOrderPage', this.searchParams).then(res => {
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
            });
        },
         // 默认查询当月信息
        currentYear() {
            let dateArr = new Date().toLocaleDateString().split('/');
            let date = new Date().toLocaleDateString().split('/').join('-');
            dateArr[dateArr.length - 1] = '01';
            dateArr = dateArr.join('-');
            this.searchParams.startDate = dateArr;
            this.searchParams.endDate = date;
        }
    }
};
</script>
<style lang="stylus" scoped>

</style>

