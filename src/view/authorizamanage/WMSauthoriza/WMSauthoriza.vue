
<template>
    <div class="WMSauthoriza">
        <el-form size="mini" label-width="120px">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="用户姓名：">
                        <el-input v-model="searchParams.name" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号：">
                        <el-input v-model="searchParams.phone" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属自营仓：">
                        <el-select v-model="searchParams.warehouseName" filterable  placeholder="请选择">
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
                    <el-form-item label="状态：">
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
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="6">&nbsp;</el-col>
                <el-col :span="6">
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="restForm" type="primary">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div>

        </div>
        <div class="page" style=" padding: 10px 0;display:flex;justify-content: space-between;">
            <div>
                <el-button @click="addPower" type="primary" size="mini">新增授权</el-button>
            </div>
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>
        <el-table border="" :data="tableData" style="width:100%">
            <el-table-column align="center" type="index" prop="skuCode"  label="序号" > </el-table-column>
            <el-table-column align="center" prop="name"  label="用户名称" width="150" >
                <template slot-scope="scope">
                    <span style="white-space: pre">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="phone"  label="手机号" width="120"> </el-table-column>
            <el-table-column align="center" prop="warehouseName"  label="所属自营仓" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column align="center" prop="isValid"  label="状态" width="80">
                <template slot-scope="scope">
                    <span v-show="scope.row.isValid == 0" type="text">停用</span>
                    <span v-show="scope.row.isValid == 1" type="text">启用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="resourceName"  label="用户权限" :show-overflow-tooltip="true" > </el-table-column>
            <el-table-column align="center" prop="createOperator"  label="授权人" width="100"> </el-table-column>
            <el-table-column align="center" prop="updateTime"  label="更新时间" width="120"> </el-table-column>
            <el-table-column align="center" prop="d"  label="操作" width="100">
                <template slot-scope="scope">
                    <!-- <div v-if="scope.row.name == 'admin' && userPhone == '15068839416'"> - </div> -->
                    <div >
                        <el-button @click="SCMauthorizaRedit(scope.row)" type="text">编辑</el-button>
                        <el-button @click="isValidChange(scope.row, '停用')" v-show="scope.row.isValid == 1" type="text">停用</el-button>
                        <el-button @click="isValidChange(scope.row, '启用')" v-show="scope.row.isValid == 0" type="text">启用</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'WMSauthoriza',
    data() {
        return {
            userPhone: '',
            searchParams: {
                name: '',
                phone: '',
                isValid: '',
                warehouseName: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            tableData: [],
            isValidOptions: [],
            warehouseNameOptions: []
        };
    },
    mounted: function() {
        this.userPhone = localStorage.userPhone;
        this.isValidInit();
        this.initData();
        this.warehouseNameInit();
    },
    methods: {
        SCMauthorizaRedit(row) {
            this.$router.push({path: '/WMSauthoriza/WMSauthorizaAdd', query: {id: row.id, isadd: 0}});
        },
        toRoleManage() {
            this.$router.push({
                path: '/roleManage'
            });
        },
        addPower() {
            this.$router.push({path: '/WMSauthoriza/WMSauthorizaAdd', query: {isadd: 1}});
        },
        isValidChange(row, str) {
            this.$confirm(`你确定要${str}吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$AXIOS.PUT('/aclWmsUser/aclWmsUserUpdate/state/' + row.id, row).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    this.initData();
                });
            }).catch(() => {});
        },
        search() {
            this.searchParams.pageNo = 1;
            this.initData();
        },
        restForm() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.start = 0;
            this.searchParams.totalCount = 0;
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
        initData() {
            this.$AXIOS.LISTGET('/aclWmsUser/aclWmsUserPage', this.searchParams).then(res => {
                this.tableData = res.result;
                // this.tableData = res.result.map((item, index) => {

                // });
                console.log(this.tableData);
                this.searchParams.totalCount = res.totalCount;
            });
        },
        isValidInit() {
            this.$AXIOS.GET('/select/validList').then(res => {
                this.isValidOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.code
                    };
                });
                this.isValidOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        warehouseNameInit() {
            this.$AXIOS.GET('/aclWmsUser/aclWmsUserWarehouse').then(res => {
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
