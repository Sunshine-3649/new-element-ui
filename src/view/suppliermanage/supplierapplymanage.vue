<template>
    <div class="supplierManage">
        <el-form :inline="true"  label-width="125px" ref="queryForm" size="medium">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="供应商名称：" size="mini">
                        <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商编号：" size="mini">
                        <el-input v-model.trim="searchParams.supplierCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联系人：" size="mini">
                        <el-input v-model.trim="searchParams.contact" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态：" size="mini">
                        <el-select v-model="searchParams.isValid" placeholder="请选择">
                            <el-option
                                v-for="item in isValidOptions"
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
                    <el-form-item  label="供应商性质：" size="mini">
                        <el-select v-model="searchParams.supplierKindCode" placeholder="请选择">
                            <el-option
                                v-for="item in supplierKindCodeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="更新时间：" size="mini">
                        <el-col :span="9">
                            <el-form-item  size="mini">
                                <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="9">
                            <el-form-item  size="mini">
                                <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="5">&nbsp;</el-col>
                <el-col :span="4">
                    <el-form-item size="mini">
                        <el-button type="primary" icon="search" @click="searchData()">搜索</el-button>
                        <el-button type="default" icon="circle-cross" @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button @click="addSupplier" style="margin-bottom:10px;" type="primary" size="mini">新增供应商</el-button>
        <el-button type="primary" @click="exportTableData" icon="circle-cross" size="mini" :loading="disabledDownLoad" :disabled='isTableDisabled'>{{disabledDownLoad?'下载中':'导出'}}</el-button>
        <el-table  :data="tableData" border >
            <el-table-column label="序号"  type="index" width="55" align="center"></el-table-column>
            <el-table-column label="供应商编号" prop="supplierCode" align="center">
                <template slot-scope="scope">
                    <span @click="toSupplierDetail(scope.row)" style="color: #409EFF; cursor:pointer"> {{ scope.row.supplierCode }} </span>
                </template>
            </el-table-column>
            <el-table-column label="供应商名称" prop="supplierName" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.supplierName" placement="top">
                       <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.supplierName }}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="供应商性质" prop="supplierKindCode" align="center">
                <template slot-scope="scope">
                    {{ scope.row.supplierKindCode === 'purchase' ? '采购' : '代发' }}
                </template>
            </el-table-column>
            <el-table-column label="供应商联系人" prop="contact" align="center"></el-table-column>
            <el-table-column label="联系人电话" prop="phone" align="center"></el-table-column>
            <el-table-column label="代理品牌" prop="brandName" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.brandName" placement="top">
                       <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.brandName }}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="供货对象" prop="channelName" align="center"></el-table-column>
            <el-table-column label="状态" prop="" align="center">
                <template slot-scope="scope">
                    {{ scope.row.isValid == 1 ?'启用' : '停用' }}
                </template>
            </el-table-column>
            <el-table-column label="最新更新时间" prop="updateTime" align="center"></el-table-column>
            <el-table-column label="操作" prop="" align="center">
                <template slot-scope="scope">
                    <el-button @click="toSupplierRedit(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button type="text" @click="isValid(scope.row)" size="mini">{{ scope.row.isValid == 1 ? '停用' : '启用' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align:right; padding:20px 0;" @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'supplierManage',
    data() {
        return {
            searchParams: {
                supplierName: '', // 供应商名称
                supplierCode: '', // 供应商编号
                contact: '', // 联系人
                isValid: '', // 状态
                supplierKindCode: '', // 供应商性质
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                pageSize: 10,
                pageNo: 1,
                recordTotal: 0,
                start: 0
            },
            isValidOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '启用',
                value: '1'
            }, {
                label: '停用',
                value: '0'
            }],
            supplierKindCodeOptions: [],
            tableData: [],
            disabledDownLoad: false,
            isTableDisabled: false
        };
    },
    created: function() {
        this.initSupplierKindCode();
        this.initData();
    },
    methods: {
        // 去往编辑
        toSupplierRedit(row) {
            this.$router.push({
                name: 'supplierapplyRedit',
                params: {
                    id: row.supplierCode
                },
                query: {isadd: 0}
            });
        },
        // 去往详情
        toSupplierDetail(row) {
            this.$router.push({
                name: 'supplierapplyDetail',
                params: {
                    id: row.supplierCode
                }
            });
        },
        initData() {
            this.$AXIOS.LISTGET('/supplier/supplierPage', this.searchParams).then(res => {
                this.tableData = res.result;
                this.searchParams.recordTotal = res.totalCount;
                if (this.tableData && this.tableData.length) {
                  this.isTableDisabled = false;
                } else {
                  this.isTableDisabled = true;
                }
            });
        },
        // 供应商性质初始化
        initSupplierKindCode() {
            this.$AXIOS.GET('/select/supplierNature').then( res => {
                this.supplierKindCodeOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.value
                    };
                });
                this.supplierKindCodeOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        // 新增供应商
        addSupplier() {
            this.$router.push({
                name: 'supplierAdd',
                query: {isadd: 1}
            });
        },
        isValid(row) {
            let str = row.isValid === '1' ? '停用' : '启用';
            this.$confirm(`确定${str}？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$AXIOS.PUT('/supplier/isValid/' + row.id, row).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    this.resetForm();
                });
            }).catch(() => {
              this.$utils.messagetip.infoTip('已取消' + str);
            });
        },
        searchData() {
            if (this.searchParams.endDate && this.searchParams.startDate) {
                if (this.searchParams.endDate < this.searchParams.startDate) {
                    this.$utils.messagetip.warningTip('结束日期不能小于起始日期！');
                    return;
                }
            }
          this.searchParams.pageSize = 10;
          this.searchParams.pageNo = 1;
          this.searchParams.start = 0;
          this.initData();
        },
        resetForm() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.recordTotal = 0;
            this.initData();
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData();
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData();
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
          this.$AXIOS.EXPORT({url: '/supplier/exportSupplier', data: params, fileName: '供应商列表单'}).then(res => {

          }).finally(() => {
            this.disabledDownLoad = false;
          });
        }
    }
};
</script>

<style scoped>

</style>


