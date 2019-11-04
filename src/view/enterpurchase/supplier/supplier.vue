<template>
  <div class="supplier">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="用户姓名：" size="mini">
            <el-input v-model.trim="searchParams.userName" placeholder=""></el-input>

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号：" size="mini">
            <el-input v-model.trim="searchParams.mobile" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属供应商：" size="mini">
            <el-select v-model="searchParams.supplierCode" placeholder="请选择" filterable>
              <el-option v-for="item in supplierList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号状态：" size="mini">
            <el-select v-model="searchParams.isValid" placeholder="请选择">
              <el-option v-for="item in accountList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="创建时间：" size="mini">
            <el-col :span="11">
              <el-form-item prop="startDate" size="mini">
                <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate" size="mini">
                <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="initDataList">搜索</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
            <!-- <el-button @click="ceshi">测试</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toSuppAddOrEdit('add')">新增授权</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" border tooltip-effect="dark" height="453" style="width: 100%;margin-top:20px;">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="用户姓名" prop="userName" align="center"></el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属供应商" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row)">{{scope.row.supplierName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" align="center">
        <template slot-scope="scope">
          {{checkIsValid(scope.row.isValid)}}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="toSuppAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="toggleStatus(scope.row.id)" v-if="scope.row.isValid === '0' ">启用</el-button>
          <el-button size="mini" type="text" @click="toggleStatus(scope.row.id)" v-else>停用</el-button>
          <el-button size="mini" type="text" @click="toSupplierDetail(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import qs from 'qs';
export default {
  name: 'supplier',
  data() {
    return {
      supplierList: [], // 供应商列表
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      searchParams: {
        userName: '', // 用户姓名
        mobile: '', // 手机号
        supplierCode: '', // 所属供应商
        isValid: '', // 所属状态
        startDate: '', // 开始时间
        endDate: '', // 截止时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      },
      accountList: [
        {
          value: '',
          label: '不限'
        },
        {
          value: '0',
          label: '停用'
        },
        {
          value: '1',
          label: '启用'
        }
      ]
    };
  },
  mounted() {
    this.initDataList();
    this.getSupplierList();
  },
  methods: {
    // 搜索，初始化数据
    initDataList() {
      if (
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
        return;
      }
      this.GET('/supplierAuthor/supplierAuthorPage', this.searchParams).then(
        res => {
          if (res.code === '200') {
            this.tableDataList = res.body.objects;
            this.totalCount = res.body.pageTotal;
          }
        }
      );
    },
    // 获取供应商列表
    getSupplierList() {
      this.GET('/supplierAuthor/supplierList/3').then(res => {
        if (res.code === '200') {
          console.log(res.body);
          this.supplierList = res.body;
        }
      });
    },
    // 更改spu状态
    supplierAuthorState(id) {
      this.PUT(
        '/supplierAuthor/supplierAuthorState/' + id,
        this.searchParams
      ).then(res => {
        if (res.code === '200') {
          this.initDataList();
          this.$utils.messagetip.successTip('更改状态成功');
        }
      });
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        userName: '', // 用户姓名
        mobile: '', // 手机号
        supplierCode: '', // 所属供应商
        isValid: '', // 所属状态
        startDate: '', // 开始时间
        endDate: '', // 截止时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 新增or编辑页
    toSuppAddOrEdit(id) {
      this.$router.push({
        path: '/supplier/suppaddoredit/' + id
      });
    },
    // 供应商管理详情页
    toDetail(row) {
      console.log(row);
      let obj = {
        hideLogs: '0',
        supplierCode: row.supplierCode,
        flag: '1'
      };
      let config = {
        title: '供应商详情',
        href: 'supplier/supplierDetail.html?' + qs.stringify(obj)
      };
      top.window.addTab(config);
    },
    // 详情页
    toSupplierDetail(id) {
      this.$router.push({
        path: '/supplier/supplierdetail/' + id
      });
    },
    // 起停用状态
    toggleStatus(id) {
      this.$confirm('确定要更改状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.supplierAuthorState(id);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNumber = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      this.initDataList();
    },
    checkIsValid(isValid) {
      if (isValid === '1') {
        return '启用';
      } else {
        return '停用';
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.supplier
  .paging
    text-align: right
    margin-top: 15px
</style>
