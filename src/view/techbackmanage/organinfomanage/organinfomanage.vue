<template>
  <div class="clientinfomanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="组织名称：" size="mini">
            <el-input v-model.trim="searchParams.organizationName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织编号：" size="mini">
            <el-input v-model.trim="searchParams.organizationCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金蝶编号：" size="mini">
            <el-input v-model.trim="searchParams.kingdeeOrganizationCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" size="mini">
            <el-select v-model="searchParams.isValid" placeholder="请选择">
              <el-option
                  v-for="item in salesChannelTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">+ 新增组织</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="组织编号" prop="organizationCode" align="center" width="100"></el-table-column>
      <el-table-column label="组织名称" prop="organizationName" align="center"></el-table-column>
      <el-table-column label="金蝶编号" prop="kingdeeOrganizationCode" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="已关联渠道" prop="relationSellChannels" align="center" ></el-table-column>
      <el-table-column label="状态" prop="isValid" align="center" width="150">
        <template slot-scope="scope">
          <div style="white-space: pre">{{checkStockType(scope.row.isValid)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center" width="140"></el-table-column>
      <el-table-column label="操作" align="center" width="150" >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toAddOrEdit(scope.row.organizationCode)">编辑</el-button>
          <el-button type="text" size="mini" v-if="scope.row.isValid === '0'" @click="toggle(scope.row.id, 1)">启用</el-button>
          <el-button type="text" size="mini" v-if="scope.row.isValid === '1'" @click="toggle(scope.row.id, 0)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'clientinfomanage',
  data() {
    return {
      salesChannelTypeList: [{name: '全部', value: ''}, {name: '启用', value: '1'}, {name: '停用', value: '0'}], // 业务线销售渠道列表
      tableDataList: [], // 列表
      searchParams: {
        organizationName: '', // 组织名称
        organizationCode: '', // 组织编码
        kingdeeOrganizationCode: '', // 金蝶组织编码
        isValid: '', // 启停用
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0 // 总页码
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    toggle(id, val) {
      let str = '';
      if (val === 0) {
        str = '停用后同步金蝶单据时将包含此商品信息。';
      } else {
        str = '启用后同步金蝶单据时将过滤此商品信息。';
      }
      this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.toggleStatus(id, val);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    toggleStatus(id, val) {
      let params = {
        id,
        isValid: val
      };
      this.$AXIOS.PUT('/organization/isValid/' + id, params).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(res.databuffer);
      });
    },
    // 获取审核列表数据
    initDataList() {
      this.$AXIOS.LISTGET('/organization/page', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
    },
    // 销售渠道类型翻译
    checkStockType(val) {
      let str = '';
      if (val === '0') {
        str = '停用';
      } else if (val === '1') {
        str = '启用';
      }
      return str;
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        customerCode: '', // 客户编码
        kingdeeCustomerCode: '', // 金蝶客户编码
        relationSellChannels: '', // 关联销售渠道
        isValid: '', // 启停用
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    // 跳转到新增或编辑仓库页面
    toAddOrEdit(val) {
      this.$router.push({path: '/organinfomanage/organinfoaddoredit/' + val});
    }
  }
};
</script>
<style lang="stylus" scoped>
.clientinfomanage
  .tab_group
    margin-top: 15px
  .demo-table-expand
    font-size: 0
  .demo-table-expand label
    width: 90px
    color: #99a9bf
  .demo-table-expand .el-form-item
    padding-left: 55px
    box-sizing: border-box
    margin-right: 0
    margin-bottom: 0
    width: 50%
  .btn
    cursor pointer
    color blue
  .paging
    text-align: right
    margin-top: 15px
</style>
