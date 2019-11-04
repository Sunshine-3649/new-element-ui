<template>
  <div class="goodsgroup">

    <el-form label-width="125px" size="medium">
        <el-row :span="24">
            <el-col :span="6">
                <el-form-item label="商品组名称：" prop="" size="mini">
                    <el-input v-model="searchParams.itemGroupName"  placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="状态："  size="mini">
                    <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="6">
                <el-form-item size="mini">
                    <el-button type="primary" @click="search" icon="search">搜索</el-button>
                    <el-button type="default" @click="resetSearchParams" icon="circle-cross">清空条件</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-row class="btn_group">
        <el-button @click="addShopGroup('', 'add')" size="mini" >
            <i class="el-icon-circle-plus-outline" style="padding-right:2px;"></i>
            新增商品组
        </el-button>
    </el-row>
    <div class="mainTable" style="margin:10px 0 20px 0">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="itemGroupCode" label="商品组编号" width="180">  </el-table-column>
            <el-table-column align="center" prop="itemGroupName"  label="商品组名称"  width="180">
                <template slot-scope="scope">
                    <el-button @click="addShopGroup(scope.row, 'detail')" type="text"> {{ scope.row.itemGroupName }}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="leaderName" label="组长"> </el-table-column>
            <el-table-column align="center" prop="memberName" label="组员"> </el-table-column>
            <el-table-column align="center" prop="createOperator" label="创建人"> </el-table-column>
            <el-table-column align="center" prop="address" label="状态">
                <template slot-scope="scope">
                    {{ scope.row.isValid === '1' ? '启用' : '停用' }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateTime" label="最近更新时间"> </el-table-column>
            <el-table-column align="center" prop="" label="操作">
                <template slot-scope="scope">
                    <el-button @click="addShopGroup(scope.row, 'edit')" type="text"> 编辑 </el-button>
                    <el-button @click="isValid(scope.row)" type="text">
                      {{ scope.row.isValid === '1' ? '停用' : '启用' }}
                    </el-button>
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
    name: 'goodsgroup',
    data() {
        return {
            searchParams: {
                itemGroupName: '', // 商品组名称
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0,
                isValid: '1'
            },
            options: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '启用'
            }, {
                value: '0',
                label: '停用'
            }],
            tableData: []
        };
    },
    mounted: function() {
       this.initDataTable(this.searchParams);
    },
    activated: function() {

    },
    destroyed: function() {

    },
    methods: {
        // 分页条数
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initDataTable(this.searchParams);
        },
        // 第几页
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initDataTable(this.searchParams);
        },
        // 搜索
        search() {
            this.searchParams.pageNo = 1;
            this.initDataTable(this.searchParams);
        },
        // 重置
        resetSearchParams() {
            this.searchParams.itemGroupName = '';
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.isValid = '1';
            this.initDataTable(this.searchParams);
        },
        addShopGroup(row, str) {
            if (str === 'add') {
                this.$router.push( {name: 'goodsgroupredit', params: { id: 'add' }, query: {isadd: 1}});
            } else if (str === 'edit') {
                this.$router.push( {name: 'goodsgroupredit', params: { id: `redit_${row.itemGroupCode}` }, query: {isadd: 0}});
            } else if (str === 'detail') {
                this.$router.push( {name: 'goodsgroupredit', params: {id: `detail_${row.itemGroupCode}`}, query: {isadd: 0}});
            }
        },
        // 启停用
        isValid(str) {
            let msg = str.isValid === '1' ? '停用成功' : '启用成功';
            let data = {
                itemGroupCode: str.itemGroupCode,
                isValid: str.isValid === '1' ? '0' : '1'
            };

            this.$AXIOS.PUT('/itemGroup/isValid', data).then(res => {
                this.$utils.messagetip.successTip(msg);
                this.resetSearchParams();
            });
        },
        // 表格数据初始化
        initDataTable(data) {
            this.$AXIOS.LISTGET('/itemGroup/itemGroupPage', data).then(res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result;
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>

</style>
