<template>
  <div class="purchasesgroup">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="采购组名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：" size="mini">
            <el-select v-model="searchParams.isValid" filterable>
              <el-option v-for="item in isValidList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toAddOrEdit('add')">新增采购组</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark" height="453" style="width: 100%;margin-top:20px;">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="采购组编号" prop="code" align="center">
        <template slot-scope="scope">
          <span class="btn" @click="toDetail(scope.row.code)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购组名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="组长" prop="leaderName" align="center"></el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.isValid === '1' ? '启用' : '停用'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.isValid === '1'" size="mini" type="text" @click="toggleIsValid(scope.row.isValid, scope.row)">停用</el-button>
          <el-button v-else size="mini" type="text" @click="toggleIsValid(scope.row.isValid, scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'purchasesgroup',
  data() {
    return {
      tableDataList: [], // 列表
      totalCount: 0,
      searchParams: {
        start: 0,
        name: '', // 采购组名称
        isValid: '', // 状态
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      isValidList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '启用'
        },
        {
          id: '0',
          name: '停用'
        }
      ]
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    toAddOrEdit(id) {
        if (id === 'add') {
           this.$router.push({path: '/purchasesgroup/purchasegroupaddoredit/' + id, query: {isadd: 1}});
        } else {
           this.$router.push({path: '/purchasesgroup/purchasegroupaddoredit/' + id, query: {isadd: 0}});
        }
    },
    // 搜索，初始化数据
    initDataList() {
      this.$AXIOS.LISTGET('/purchase/purchaseGroupPage', this.searchParams).then(res => {
        console.log('res: ', res);
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
    },
    // 启停用接口
    updateState(isValid, row) {
      let isValidStr = isValid === '0' ? '启用' : '停用';
      this.$AXIOS.PUT(`/purchase/purchaseGroup/updateState/${row.id}`, row).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(`已${isValidStr}!`);
      });
    },
    // 切换启停用的状态
    toggleIsValid(isValid, row) {
      let isValidStr = isValid === '0' ? '启用' : '停用';
      let isSureStr = isValid === '0' ? '可' : '将不能';
      this.$confirm(`${isValidStr}后该采购组${isSureStr}正常使用`, `您确认要${isValidStr}吗?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.updateState(isValid, row);
          this.$utils.messagetip.successTip('删除成功');
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.initDataList();
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        start: 0,
        name: '', // 采购组名称
        isValid: '', // 状态
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 跳转详情页
    toDetail(code) {
      this.$router.push({path: '/purchasesgroup/purchasegroupdetail/' + code});
    }
  }
};
</script>
<style lang="stylus" scoped>
.purchasesgroup
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
  .paging
    text-align: right
    margin-top: 15px
  .btn
    cursor pointer
    color blue
</style>
