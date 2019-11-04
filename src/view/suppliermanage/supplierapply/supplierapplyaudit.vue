<template>
  <div class="supplierapplyaudit">
    <!-- 表单 -->
    <el-form :inline="true" :model="searchParams" label-width="125px" ref="queryForm" class="search_form" size="medium">
      <el-row>
        <el-col>
          <el-form-item label="供应商名称：" size="mini">
            <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="供应商编号：" size="mini">
            <el-input v-model.trim="searchParams.supplierCode" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="申请方：" size="mini">
            <el-select v-model="searchParams.channelId" filterable placeholder="请选择">
              <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="提交时间：" size="mini">
            <el-form-item size="mini">
              <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 130px">
              </el-date-picker>
            </el-form-item>
            <el-form-item size="mini">
              <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 130px">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <!-- 选项卡 -->
        <el-tabs v-model="searchParams.tabstatus" @tab-click="handleClick" type="card">
          <el-tab-pane label="待审批" name="0"></el-tab-pane>
          <el-tab-pane label="已审批" name="1"></el-tab-pane>
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="申请单编号" prop="applyCode" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer;color:#409EFF" @click="toApplySupplier(scope.row,false)" type="text">{{ scope.row.applyCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请方" prop="channelName" align="center"></el-table-column>
      <el-table-column label="供应商编号" prop="supplierCode" align="center">
        <template slot-scope="scope">
           <span style="cursor:pointer;color:#2894D1" @click="toShowSupplier(scope.row.supplierCode)" type="text">{{ scope.row.supplierCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商性质" prop="supplierKindCode" align="center">
        <template slot-scope="scope">
          {{checkedType('supplierNature', scope.row.supplierKindCode)}}
        </template>
      </el-table-column>
      <el-table-column label="供应商代理品牌" prop="brandNames" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">待审批</span>
          <span v-if="scope.row.status===2||scope.row.status===3">已审批</span>
        </template>
      </el-table-column>
      <el-table-column v-if="searchParams.tabstatus=='1'||searchParams.tabstatus=='-1'" label="审批结果" prop="status" align="center">
        <template slot-scope="scope">
            <span style="color:#FF0000" v-if="scope.row.status===3">审批驳回</span>
            <span style="color:#009933" v-else-if="scope.row.status===2">审批通过</span>
            <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="提交审批时间" prop="createTime" align="center"></el-table-column>
      <el-table-column  :label="searchParams.tabstatus!=1?'操作':''" :width="searchParams.tabstatus!=1?100:1" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" v-show="scope.row.status===1" size="mini" @click="toApplySupplier(scope.row,true)">审批</el-button>
          <span v-show="scope.row.status!=1">-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="供应商详情" :visible.sync="dialogFormVisible">
      <supplier-detail :supplierCode="showSupplierCode"></supplier-detail>
    <div style="text-align:center;margin-top:10px;">
            <el-button @click="dialogFormVisible=false"  size="mini" type="primary"> 关闭 </el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import supplierDetail from 'components/supplierDetail';
export default {
  name: 'supplierapplyaudit',
  data() {
    return {
      dialogFormVisible: false,
      showSupplierCode: '',
      searchParams: {
        supplierName: '',
        supplierCode: '',
        startDate: '',
        endDate: '',
        channelId: '',
        status: '0',
        tabstatus: '0',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      channelList: [],
      tableDataList: []
    };
  },
  created() {
    this.initChannelList();
    this.initDataList();
  },
  components: {
    supplierDetail
  },
  methods: {
    initDataList() {
      this.$AXIOS.LISTGET('/supplier/supplierApplyAuditPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.searchParams.totalCount = res.totalCount;
      });
    },
    initChannelList() {
      this.$AXIOS.LISTGET('/system/channels').then(res => {
        this.channelList = res.result;
        this.channelList.unshift({ id: '', name: '全部' });
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
        supplierName: '',
        supplierCode: '',
        startDate: '',
        endDate: '',
        channelId: '',
        status: '0',
        tabstatus: '0',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
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
    handleClick(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.status = this.searchParams.tabstatus === '-1' ? '' : this.searchParams.tabstatus;
      this.initDataList();
    },
    toApplySupplier(supplierRow, canEdit) {
      this.$router.push({path: '/supplierapplyaudit/supplierapplyauditdetail', query: {channelName: supplierRow.channelName, applyId: supplierRow.id, supplierCode: supplierRow.supplierCode, canEdit: canEdit}});
    },
    toShowSupplier(val) {
      this.dialogFormVisible = true;
      this.showSupplierCode = val;
    },
    checkedType(type, val) {
      // 字典翻译仓库
      if (val) {
        return this.$utils.querydiction(type, val);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
