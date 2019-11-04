<template>
    <div class="roleManage">
        <el-form size="mini" label-width="140px">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="角色名称：">
                        <el-input  placeholder="" v-model="searchParams.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="角色类型：">
                        <el-select v-model="searchParams.roleType" placeholder="请选择">
                            <el-option
                                v-for="item in roleTypeOptions"
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
                <el-col :span="6">
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="restForm" type="primary">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="page" style=" padding: 10px 0;display:flex;justify-content: space-between;">
            <div><el-button @click="addRole"  type="primary" size="mini">新增角色</el-button></div>
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>
        <el-table border="" :data="tableData" style="width:100%">
            <el-table-column align="center" type="index"  label="序号" > </el-table-column>
            <el-table-column align="center"  prop="name"  label="角色名称"  >
                <template slot-scope="scope">
                   <span style="white-space: pre">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  prop="roleType"  label="角色类型" width="120">
                <template slot-scope="scope">
                    <span v-show="scope.row.roleType == 'wholeJurisdiction'">全局角色</span>
                    <span v-show="scope.row.roleType == 'channelJurisdiction'">业务线角色</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  prop="isValid" width="80"  label="状态" >
                <template slot-scope="scope">
                    <span v-show="scope.row.isValid == '0'">停用</span>
                    <span v-show="scope.row.isValid == '1'">启用</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  prop="createOperator"  label="创建人" > </el-table-column>
            <el-table-column align="center"  prop="updateTime" width="180"  label="更新时间" > </el-table-column>
            <el-table-column align="center" width="100"  prop=""  label="操作" >
                <template slot-scope="scope">
                    <el-button @click="toRoleRedit(scope.row)" type="text">编辑</el-button>
                    <el-button @click="isValidChange(scope.row, '启用')" v-if="scope.row.isValid == '0'" type="text">启用</el-button>
                    <el-button @click="isValidChange(scope.row, '停用')" v-if="scope.row.isValid == '1'" type="text">停用</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'roleManage',
    data() {
        return {
            searchParams: {
                name: '',
                roleType: '',
                isValid: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            tableData: [],
            roleTypeOptions: [],
            isValidOptions: []
        };
    },
    mounted: function() {
        this.roleTypeInit();
        this.isValidInit();
        this.initData();
    },
    methods: {
        isValidChange(row, str) {
            this.$AXIOS.GET('/accredit/roleAccreditInfo', {roleId: row.id}).then(res => {
                const h = this.$createElement;
                const t = (res.result > 0 && str === '停用') ? h('div', { style: 'color: red' }, `当前有${res.result}个用户正在使用该角色，停用后这些用户对应的权限也将失效！`) : '';
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: h('p', null, [
                        h('span', null, `您确定要${str}吗？`),
                        t
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(action => {
                    this.$AXIOS.PUT('/accredit/role/updateState/' + row.id, row).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        setTimeout(() => {
                            this.initData();
                        }, 1000);
                    });
                });
            });
        },
        toRoleRedit(row) {
            this.$router.push({
                path: '/roleManage/roleManageAdd',
                query: {
                    id: row.id
                }
            });
        },
        addRole() {
            this.$router.push({
                path: '/roleManage/roleManageAdd'
            });
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
            this.$AXIOS.LISTGET('/accredit/rolePage', this.searchParams).then(res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result;
            });
        },
        roleTypeInit() {
            this.$AXIOS.GET('/select/roleType').then(res => {
                this.roleTypeOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.value
                    };
                });
                this.roleTypeOptions.unshift({
                    label: '全部',
                    value: ''
                });
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
        }
    }
};
</script>

<style lang="stylus" scoped>

</style>
