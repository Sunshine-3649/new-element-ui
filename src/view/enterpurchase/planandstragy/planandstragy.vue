<template>
  <div class="mymarket">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="计划名称：" prop="allocateOrderCode" size="mini">
            <el-input v-model.trim="searchParams.pricePlanName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间：" size="mini">
            <el-col :span="11">
              <el-form-item prop="startDate" size="mini">
                <el-date-picker v-model="searchParams.createTimeStart" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate" size="mini">
                <el-date-picker v-model="searchParams.createTimeEnd" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人：" prop="allocateOrderCode" size="mini">
            <el-input v-model.trim="searchParams.createOperator" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划状态：" prop="allocateOrderCode" size="mini">
            <el-select v-model="searchParams.isValid" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">清空条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
     <file-upload @getFile="getFile" :uploadDialog="uploadDialog"></file-upload>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toPlanAddOrEdit">新建计划</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" highlight-current-row :data="tableData.objects" border tooltip-effect="dark" style="width: 100%;margin-top:20px;">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="计划名称" prop="pricePlanName" width="120" align="center"></el-table-column>
      <el-table-column label="关联分销商数量" prop="relateDistributorNum" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTimeStr" align="center"></el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
            {{ scope.row.isValid == 0 ? '停用' : '启用 '}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="duplicate(scope.$index, scope.row)">创建副本</el-button>
          <el-button size="mini" type="text" @click="toPlanRedit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="toPlanDetail(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="tableData.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="tableData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.recordTotal">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import qs from 'qs';
import fileUpload from 'components/fileUpload'; // 引入文件上传组件

export default {
  name: 'mymarket',
  data() {
    return {
      uploadDialog: false,
      currentRow: null,
      searchParams: { // from查询参数
        isValid: '',
        pricePlanName: '',
        createTimeStart: '',
        createTimeEnd: '',
        createOperator: '',
        pageSize: 10,
        pageNumber: 1,
        recordTotal: 0
      }, // 请求参数
      tableData: [], // 列表数据
      multipleSelection: [],
      options: [
        {
          value: '',
          label: '所有'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        }
      ]
    };
  },
  // 上传文件组件
  components: {
      fileUpload
  },
  created() {
    this.initDataList(this.searchParams);
    // this.$AXIOS.LISTGET('/purchase/purchaseOrderPage', {start: 0, pageSize: 10, pageNo: 1}, 55).then(res => {
    //     console.log(res);
    // });
  },
  methods: {
    getFile(file) {
        console.log(file, 'file');
    },
    // 搜索，初始化数据
    initDataList(data) {
      this.GET('/busiPricePlan/queryPricePlanList', data).then( res => {
          this.tableData = res.body;
          this.searchParams.pageNumber = 1;
          this.searchParams.pageSize = 10;
      });
    },
    // 搜索
    search() {
        this.searchParams.pageNumber = 1;
        if (this.searchParams.createTimeStart && this.searchParams.createTimeEnd) {
            if (this.searchParams.createTimeStart > this.searchParams.createTimeEnd) {
                this.$message.warning('结束日期不能小于起始日期！');
                return;
            } else {
                this.searchParams.createTimeStart = this.searchParams.createTimeStart + ' ' + '00:00:00';
                this.searchParams.createTimeEnd = this.searchParams.createTimeEnd + ' ' + '23:59:59';
            }
        }
        this.initDataList(this.searchParams);
    },
    // 重置搜索条件
    resetForm() {
        for (let obj in this.searchParams) {
            if (obj === 'pageSize' || obj === 'pageNumber' || obj === 'recordTotal' || obj === 'isValid') {
                continue;
            } else {
                this.searchParams[obj] = '';
            }
        }
        this.initDataList(this.searchParams);
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageSize = val;
      this.initDataList(this.searchParams);
    },
    // 跳转到新增页面
    toPlanAddOrEdit() {
      this.$router.push({
        path: '/planandstragy/planaddoredit/' + 'add'
      });
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      this.initDataList(this.searchParams);
    },
    // 创建副本
    duplicate(index, row) {
      this.GET('/busiPricePlan/copyPricePlan/' + row.id).then( res => {
          this.initDataList(this.searchParams);
      });
    },
    // 计划详情
    toPlanDetail(index, row) {
      this.$router.push({
        name: 'plandetail',
        params: {'id': row.id}
      });
    },
    // 跳转到编辑页面
    toPlanRedit(id) {
      this.$router.push({path: '/planandstragy/planaddoredit/' + id});
    }
  }
};
</script>

<style lang="stylus" scoped>
.mymarket
  .paging
    text-align: right
    margin-top: 15px
</style>
