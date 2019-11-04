
<template>
  <div class="distributoraccred">
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
          <el-form-item label="所属分销商：" size="mini">
            <el-select v-model="searchParams.distributorCode" filterable placeholder="请选择">
              <el-option v-for="item in distriList" :key="item.distributorCode" :label="item.companyName" :value="item.distributorCode">
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
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
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
      <el-button size="mini" type="primary" @click="toAccredAddOrEdit('add')">新增授权</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" border tooltip-effect="dark" height="453" style="width: 100%;margin-top:20px;">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="用户姓名" prop="userName" width="120" align="center"></el-table-column>
      <el-table-column label="手机号" prop="mobile" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属分销商" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row.distributorCode)">{{scope.row.distributorName}}</el-button>
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
          <el-button size="mini" type="text" @click="toAccredAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="toggleStatus(scope.row.id, scope.row.isValid)" v-if="scope.row.isValid === '0' ">启用</el-button>
          <el-button size="mini" type="text" @click="toggleStatus(scope.row.id, scope.row.isValid)" v-else>停用</el-button>
          <el-button size="mini" type="text" @click="toAccredDetail(scope.row.id)">查看详情</el-button>
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
export default {
  name: 'distributoraccred',
  data() {
    return {
      distriList: [], // 供应商列表
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      searchParams: {
        userName: '', // 用户姓名
        mobile: '', // 手机号
        distributorCode: '', // 所属分销商
        isValid: '', // 所属状态
        startDate: '', // 开始时间
        endDate: '', // 截止时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      }, // 搜索框参数
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
    // console.log(this.$utils.querydiction('BusiSupplierSkusStatus', '1'));
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
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.GET(
        '/distributorAuthor/distributorAuthorPage',
        this.searchParams
      ).then(res => {
        if (res.code === '200') {
          this.tableDataList = res.body.objects;
          this.totalCount = res.body.pageTotal;
        }
      });
    },
    // 更改spu状态
    distributorAuthorState(id) {
      this.PUT(
        '/distributorAuthor/distributorAuthorState/' + id,
        this.searchParams
      ).then(res => {
        if (res.code === '200') {
          this.initDataList();
          this.$utils.messagetip.successTip('更改状态成功');
        }
      });
    },
    // 获取分销商列表
    getSupplierList() {
      this.GET('/distributorAuthor/distributor/3').then(res => {
        if (res.code === '200') {
          console.log(res.body);
          this.distriList = res.body;
        }
      });
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        userName: '', // 用户姓名
        mobile: '', // 手机号
        distributorCode: '', // 所属分销商
        isValid: '', // 所属状态
        startDate: '', // 开始时间
        endDate: '', // 截止时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 新增or编辑页
    toAccredAddOrEdit(id) {
      this.$router.push({
        path: '/distributoraccred/accredaddoredit/' + id
      });
    },
    // 详情页
    toAccredDetail(id) {
      this.$router.push({
        path: '/distributoraccred/accreddetail/' + id
      });
    },
    // 分销商管理详情页
    toDetail(id) {
      this.$router.push({path: '/distributormanage/managedetail/' + id});
    },
    // 启停用状态
    toggleStatus(id, isValid) {
      let isResult = ''; // 对应的中文
      if (isValid === '1') {
        isResult = '停用';
      } else {
        isResult = '启用';
      }
      this.$confirm(`${isResult}分销商？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.distributorAuthorState(id);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
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

.distributoraccred
  .paging
    text-align: right
    margin-top: 15px
</style>
