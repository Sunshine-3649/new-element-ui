<template>
  <div class="linemanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="部门名称：" size="mini">
            <el-input v-model.trim="searchParams.departmentName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金蝶云编号：" size="mini">
            <el-input v-model.trim="searchParams.kingDeeDepartmentCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
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
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增部门</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="部门名称" prop="departmentName" align="center"></el-table-column>
      <el-table-column label="金蝶云编号" prop="kingDeeDepartmentCode" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center" width="140"></el-table-column>
      <el-table-column label="最后更新人" prop="createOperator" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toAddOrEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="部门名称：" label-width="120px">
          <el-col :span='6'>
            <el-input size="mini" v-model="form.departmentName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="金蝶云编号：" label-width="120px">
          <el-col :span='6'>
            <el-input size="mini" v-model="form.kingDeeDepartmentCode"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'officemanage',
  data() {
    return {
      dialogTitle: '', // 弹窗标题
      dialogFormVisible: false, // 弹窗显示隐藏
      form: {
        departmentName: '',
        kingDeeDepartmentCode: ''
      },
      tableDataList: [], // 列表
      searchParams: {
        departmentName: '', // 部门名称
        kingDeeDepartmentCode: '', // 金蝶部门编码
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
    // 获取审核列表数据
    initDataList() {
      this.$AXIOS.LISTGET('/department/page', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
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
        departmentName: '', // 部门名称
        kingDeeDepartmentCode: '', // 金蝶部门编码
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
    toAddOrEdit(row) {
      this.dialogFormVisible = true;
      if (row === 'add') {
        this.dialogTitle = '新增部门信息';
        this.form.departmentName = '';
        this.form.kingDeeDepartmentCode = '';
      } else {
        this.dialogTitle = '编辑部门信息';
        this.form.id = row.id;
        this.form.departmentName = row.departmentName;
        this.form.kingDeeDepartmentCode = row.kingDeeDepartmentCode;
      }
    },
    // 新增更新确定
    makeSure() {
      if (this.form.id) {
        this.$AXIOS.JSONPUT('/department/update', this.form, true).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.searchFormData();
          this.dialogFormVisible = false;
        });
      } else {
        this.$AXIOS.JSONPOST('/department/save', this.form, true).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.searchFormData();
          this.dialogFormVisible = false;
        });
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.officemanage
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
