<template>
  <div class="salechannelmanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="销售渠道名称：" size="mini">
            <el-input v-model.trim="searchParams.sellName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售渠道编号：" size="mini">
            <el-input v-model.trim="searchParams.sellCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售渠道类型：" size="mini">
            <el-select v-model="searchParams.sellType" placeholder="请选择">
              <el-option
                  v-for="item in salesChannelTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增销售渠道</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="销售渠道编号" prop="sellCode" align="center" width="100"></el-table-column>
      <el-table-column label="销售渠道名称" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="渠道关联客户" prop="customerName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="渠道关联组织" prop="organizationName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="渠道关联部门" prop="departmentName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售渠道类型" prop="sellType" align="center" width="150">
        <template slot-scope="scope">
          <div style="white-space: pre">{{checkStockType(scope.row.sellType)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isValid" align="center" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.isValid === '0'">停用</span>
          <span v-if="scope.row.isValid === '1'">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center" width="140"></el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" v-if="scope.row.isValid === '0'" @click="toggle(scope.row.id, 1)">启用</el-button>
          <el-button type="text" size="mini" v-if="scope.row.isValid === '1'" @click="toggle(scope.row.id, 0)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'salechannelmanage',
  data() {
    return {
      salesChannelTypeList: [{name: '全部', value: ''}], // 业务线销售渠道列表
      tableDataList: [], // 列表
      searchParams: {
        sellName: '', // 销售渠道名称
        sellCode: '', // 销售渠道编号
        sellType: '', // 销售渠道类型
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0 // 总页码
    };
  },
  created() {
    this.initDataList();
    this.getSalesChannelType(); // 获取业务线渠道类型
  },
  methods: {
    toggle(id, val) {
      let str = '';
      if (val === 0) {
        str = '确认停用该销售渠道？';
      } else {
        str = '确认启用该销售渠道？';
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
      this.$AXIOS.PUT('/system/isValid/sellChannel/' + id, params).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(res.databuffer);
      });
    },
    // 获取审核列表数据
    initDataList() {
      if (this.searchParams.operationalNature === '0') {
        this.searchParams.operationalType = '';
      }
      this.$AXIOS.LISTGET('/system/sellChannelPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
    },
    // 销售渠道
    getSalesChannelType() {
      this.$AXIOS.GET('/select/selectByTypeCode/salesChannelType').then(res => {
        this.salesChannelTypeList = [...this.salesChannelTypeList, ...res.result];
      });
    },
    // 销售渠道类型翻译
    checkStockType(val) {
      return this.$utils.querydiction('salesChannelType', val);
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
        sellName: '', // 销售渠道名称
        sellCode: '', // 销售渠道编号
        sellType: '', // 销售渠道类型
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
      this.$router.push({path: '/salechannelmanage/salechanneladdoredit/' + val, query: {isAdd: 0}});
    }
  }
};
</script>
<style lang="stylus" scoped>
.salechannelmanage
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
