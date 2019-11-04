<template>
  <div class="otheraudit">
    <el-form label-width="125px" size="mini">
        <el-row :span="24">
            <el-col :span="6">
                <el-form-item label="其他出入库编号：">
                    <el-input v-model="searchParams.outInCode"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="出入库类型：">
                    <el-select v-model="searchParams.outInType"  filterable placeholder="请选择">
                        <el-option
                            v-for="item in outboundTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="仓库名称：">
                    <el-select v-model="searchParams.warehouseCode"  filterable placeholder="请选择">
                        <el-option
                            v-for="item in warehouseNameOptions"
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
                            <el-date-picker v-model="searchParams.startSubmitAuditTime"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.endSubmitAuditTime"   type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">
                <el-form-item size="mini">
                    <el-button type="primary" @click="search" icon="search">搜索</el-button>
                    <el-button type="default" @click="resetForm" icon="circle-cross">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-tabs v-model="searchParams.auditStatus"  @tab-click="handleClick">
        <el-tab-pane label="待审核" name="1"></el-tab-pane>
        <el-tab-pane label="已审核" name="2"></el-tab-pane>
        <el-tab-pane label="全部" name='0'></el-tab-pane>
    </el-tabs>
    <!-- 待审核 -->
    <el-table v-show="searchParams.auditStatus == 1" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="其他出入库编号" >
            <template slot-scope="scope">
                <span @click="toAuditDetail(scope.row)" style="color:#409EFF; cursor: pointer">{{ scope.row.outInCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="出入库类型" >
            <template slot-scope="scope">
                <span v-show="scope.row.outInType === '1'">其他入库</span>
                <span v-show="scope.row.outInType === '2'">其他出库</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="warehouseName" label="仓库名称" > </el-table-column>
        <el-table-column align="center" prop="" label="审核状态" >
            <template slot-scope="scope">
                <span v-if="scope.row.auditStatus === 1">待审核</span>
                <span v-else-if="scope.row.auditStatus === 2">已审核</span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <!-- <el-table-column  align="center" prop="auditResult" label="审核结果" >
             <template slot-scope="scope">
                <span v-show="scope.row.status === 1">暂存</span>
                <span v-show="scope.row.status === 2">提交审核</span>
                <span v-show="scope.row.status === 3">审核通过</span>
                <span v-show="scope.row.status === 4">审核驳回</span>
                <span v-show="scope.row.status === 5">通知仓库</span>
                <span v-show="scope.row.status === 6">作废</span>
            </template>
        </el-table-column> -->
        <el-table-column align="center" prop="submitAuditOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="submitAuditTime" label="提交审核时间" > </el-table-column>
        <el-table-column align="center" prop="" label="操作" >
            <template slot-scope="scope">
                <el-button @click="toRaudit(scope.row)" type="text">审核</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 已审核 -->
    <el-table v-show="searchParams.auditStatus == 2" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="其他出入库编号" >
            <template slot-scope="scope">
                <span @click="toAuditDetail(scope.row)" style="color:#409EFF; cursor: pointer">{{ scope.row.outInCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="出入库类型" >
            <template slot-scope="scope">
                <span v-show="scope.row.outInType === '1'">其他入库</span>
                <span v-show="scope.row.outInType === '2'">其他出库</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="warehouseName" label="仓库名称" > </el-table-column>
        <el-table-column align="center" prop="" label="审核状态" >
            <template slot-scope="scope">
                <span v-if="scope.row.auditStatus === 1">待审核</span>
                <span v-else-if="scope.row.auditStatus === 2">已审核</span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column  align="center" prop="auditResult" label="审核结果" >
            <template slot-scope="scope">
                <span style="color:#009900" v-if="scope.row.auditResult == '审核通过'">{{ scope.row.auditResult }}</span>
                <span style="color:#FF0000" v-else-if="scope.row.auditResult == '审核驳回'">{{ scope.row.auditResult }}</span>
                <span  v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="submitAuditOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="submitAuditTime" label="提交审核时间" > </el-table-column>
    </el-table>

    <!-- 全部 -->
    <el-table v-show="searchParams.auditStatus == 0 || searchParams.auditStatus == ''" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="其他出入库编号" >
            <template slot-scope="scope">
                <span @click="toAuditDetail(scope.row)" style="color:#409EFF; cursor: pointer">{{ scope.row.outInCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="出入库类型" >
            <template slot-scope="scope">
                <span v-show="scope.row.outInType === '1'">其他入库</span>
                <span v-show="scope.row.outInType === '2'">其他出库</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="warehouseName" label="仓库名称" > </el-table-column>
        <el-table-column align="center" prop="" label="审核状态" >
            <template slot-scope="scope">
                <span v-if="scope.row.auditStatus === 1">待审核</span>
                <span v-else-if="scope.row.auditStatus === 2">已审核</span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column  align="center" prop="auditResult" label="审核结果" >
            <template slot-scope="scope">
                <span style="color:#009900" v-if="scope.row.auditResult == '审核通过'">{{ scope.row.auditResult }}</span>
                <span style="color:#FF0000" v-else-if="scope.row.auditResult == '审核驳回'">{{ scope.row.auditResult }}</span>
                <span  v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="submitAuditOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="submitAuditTime" label="提交审核时间" > </el-table-column>
        <el-table-column align="center" prop="" label="操作" >
            <template slot-scope="scope">
                <el-button v-if="scope.row.auditStatus == 1" @click="toRaudit(scope.row)" type="text">审核</el-button>
                <span v-else>-</span>
            </template>
        </el-table-column>
    </el-table>
    <div class="page" style="text-align:right; padding: 10px 0;">
        <el-pagination
            @size-change="changeSize"
            @current-change="changeNumber"
            :current-page="searchParams.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchParams.totalCount < 0 ? 0 : searchParams.totalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'otheraudit',
    data() {
        return {
            activeName: '',
            searchParams: {
                outInCode: '', // 其他出入库编号
                outInType: '', // 出库类型
                startSubmitAuditTime: '', // 开始时间
                endSubmitAuditTime: '', // 结束时间
                warehouseCode: '', // 仓库编号
                auditStatus: '1', // 审核状态
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                start: 0
            },
            outboundTypeOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '其他入库',
                value: '1'
            }, {
                label: '其他出库',
                value: '2'
            }],
            warehouseNameOptions: [],
            tableData: []
        };
    },
    mounted: function() {
        this.wareHouseList();
        this.initData(this.searchParams);
    },
    methods: {
        search() {
            if (this.searchParams.startSubmitAuditTime && this.searchParams.endSubmitAuditTime && this.searchParams.startSubmitAuditTime > this.searchParams.endSubmitAuditTime) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            this.searchParams.pageNo = 1;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            if (data.auditStatus === '0') {
                data.auditStatus = '';
            }
            this.initData(data);
        },
        resetForm() {
            for (let obj in this.searchParams) {
                if (obj === 'auditStatus') {
                    continue;
                } else {
                    this.searchParams[obj] = '';
                }
            }
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.totalCount = 0;
            // this.searchParams.auditStatus = '1';
            this.searchParams.start = 0;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            if (data.auditStatus === '0') {
                data.auditStatus = '';
            }
            this.initData(data);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            if (data.auditStatus === '0') {
                data.auditStatus = '';
            }
            this.initData(data);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            if (data.auditStatus === '0') {
                data.auditStatus = '';
            }
            this.initData(data);
        },
        handleClick(current) {
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = 10;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            if (current.name === '0') {
                data.auditStatus = '';
            }
            this.initData(data);
        },
        toRaudit(row) {
            this.$router.push({path: '/otheraudit/otherdetail/' + row.outInCode});
        },
        toAuditDetail(row) {
            this.$router.push(
                {path: '/otheraudit/otherdetail/' + row.outInCode, query: {flag: 'edit'}}
            );
        },
        // 初始化数据
        initData(data) {
            this.$AXIOS.LISTGET('/OtherOutIn/audit_page', data).then(res => {
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
            });
        },
        wareHouseList() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getWarehouse').then(res => {
                this.warehouseNameOptions = res.result.map(item => {
                    return {
                        label: item.warehouseName,
                        value: item.code
                    };
                });
                this.warehouseNameOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>

</style>
