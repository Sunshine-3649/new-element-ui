<template>
  <div class="supplierapply">
    <!-- 表单 -->
    <el-form :inline="true" :model="searchParams" label-width="125px" ref="queryForm" class="search_form" size="medium">
      <el-row>
        <el-col>
          <el-form-item label="供应商名称：" size="mini">
            <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="供应商性质：" size="mini">
            <el-select v-model="searchParams.supplierKindCode" filterable placeholder="请选择">
              <el-option v-for="item in supplierKindCodeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人：" size="mini">
            <el-input v-model.trim="searchParams.contact" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="供应商编号：" size="mini">
            <el-input v-model.trim="searchParams.supplierCode" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="申请状态：" size="mini">
            <el-select v-model="searchParams.applyStatus" filterable placeholder="请选择">
              <el-option v-for="item in applyStatusList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新日期：" size="mini">
            <el-form-item size="mini">
              <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 130px">
              </el-date-picker>
            </el-form-item>
            <el-form-item size="mini">
              <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 130px">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
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
        <el-button type="primary" size="mini" @click="toApplySupplier({id:'',supplierCode:''},true)"> + 申请供应商</el-button>
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
      <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商编号" prop="supplierCode" align="center"></el-table-column>
      <el-table-column label="供应商类型" prop="supplierKindCode" align="center">
        <template slot-scope="scope">
          {{checkedType('supplierNature', scope.row.supplierKindCode)}}
        </template>
      </el-table-column>
      <el-table-column label="供应商联系人" prop="contact" align="center"></el-table-column>
      <el-table-column label="联系人电话" prop="phone" align="center"></el-table-column>
      <el-table-column label="代理品牌" prop="brandNames" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商状态" prop="supplierStatus" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierStatus=='0'" style="color:#DB6D00" type="text">无效</span>
          <span v-else  type="text">有效</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" prop="status" align="center">
        <template slot-scope="scope">
           <span v-if="scope.row.status=='3'" style="color:#FF6600" type="text">{{checkedType('supplierApplyStatus', scope.row.status)}}</span>
          <span v-else>{{checkedType('supplierApplyStatus', scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="scope.row.updateAuth==='1'" @click="toApplySupplier(scope.row,true)">编辑</el-button>
          <el-button type="text" size="mini" v-if="scope.row.deleteAuth==='1'" @click="toggleIsValid(scope.row.id)">删除</el-button>
          <span v-if="scope.row.updateAuth!='1'&&scope.row.deleteAuth!='1'">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'supplierapply',
  data() {
    return {
      searchParams: {
        supplierName: '',
        supplierCode: '',
        contact: '',
        applyStatus: '',
        supplierKindCode: '',
        startDate: '',
        endDate: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      applyStatusList: [],
      supplierKindCodeList: [],
      tableDataList: []
    };
  },
  created() {
    this.applyStatusList = this.$utils.querydiction('supplierApplyStatus');
    this.applyStatusList.unshift({name: '全部', value: ''});
    this.supplierKindCodeList = this.$utils.querydiction('supplierNature');
    this.supplierKindCodeList.unshift({name: '全部', value: ''});
    this.initDataList();
  },
  methods: {
    initDataList() {
      this.$AXIOS.LISTGET('/supplier/supplierApplyPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.searchParams.totalCount = res.totalCount;
      });
    },
    toApplySupplier(supplierRow, canEdit) {
      this.$router.push({path: '/supplierapplydetail', query: {applyId: supplierRow.id, supplierCode: supplierRow.supplierCode, canEdit: canEdit}});
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
        contact: '',
        applyStatus: '',
        supplierKindCode: '',
        startDate: '',
        endDate: '',
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
    // 字典翻译仓库
    checkedType(type, val) {
      // if (val) {
        let valText = this.$utils.querydiction(type, val);
        if (valText === '') { valText = '-'; };
        return valText;
      // }
    },
    toggleIsValid(id) {
      this.$confirm(`您确认要删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$AXIOS.PUT('/supplier/supplierApply/state/' + id).then(res => {
            if (res.appcode === '1') {
              this.initDataList();
              this.$utils.messagetip.successTip(res.databuffer);
            }
          });
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>

