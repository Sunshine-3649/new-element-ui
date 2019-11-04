<template>
  <div class="needapplymanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="要货单编号：" size="mini">
            <el-input v-model.trim="searchParams.orderNo" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="外部单号：" size="mini">
            <el-input v-model.trim="searchParams.externalOrderNo" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请时间" size="mini">
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
        <el-col :span="6">
          <el-form-item label="要货门店：" size="mini">
            <el-select v-model="searchParams.sellCode" filterable placeholder="请选择">
              <el-option v-for="item in shopList" :key="item.sellCode" :label="item.sellName" :value="item.sellCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="审核状态：" size="mini">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option v-for="item in auditStatusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
            <!-- <el-button type="default" icon="circle-cross" @click="ceshiClick">测试</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <div class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="要货单编号" align="center" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="btn" @click="toPurchaseDetail(scope.row.orderNo)">{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="外部单号" prop="externalOrderNo" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="申请时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="要货门店" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="要货SKU数" prop="count" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="要货总数量" prop="amount" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="期望到货时间" prop="expectTime" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            {{scope.row.expectTime ? scope.row.expectTime.substr(0, 10) : ''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <div>{{checkedStatus(scope.row.status)}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'needapplymanage',
  data() {
    return {
      shopList: [
        {
          sellName: '全部',
          sellCode: ''
        }
      ], // 门店列表
      auditStatusList: [
        {
          name: '全部',
          code: ''
        },
        {
          name: '采购审批',
          code: 0
        },
        {
          name: '仓库审批',
          code: 1
        },
        {
          name: '审批通过',
          code: 2
        },
        {
          name: '审批驳回',
          code: 3
        }
      ], // 状态列表
      activeName2: '1', // 默认选中状态
      isShow: false, // 点击显示
      tableDataList: [], // 列表
      searchParams: {
        orderNo: '', // 要货单编号
        externalOrderNo: '', // 外部单号
        sellCode: '', // 要货门店
        status: '', // 审核状态
        startDate: '', // 申请开始日期
        endDate: '', // 申请结束日期
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0, // 总页码
      purchaseTypeList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 'purchaseSelling',
          name: '购销'
        },
        {
          id: 'agentSelling',
          name: '代销'
        },
        {
          id: 'purchaseSellingGift',
          name: '购销赠品'
        },
        {
          id: 'agentSellingGift',
          name: '代销赠品'
        }
      ]
    };
  },
  created() {
    this.initDataList();
    this.getShopList();
  },
  methods: {
    // 门店列表
    getShopList() {
      this.$AXIOS.GET('/system/storeList').then(res => {
        this.shopList = [...this.shopList, ...res.result];
      });
    },
    // 审核状态翻译
    checkedStatus(status) {
      let str = '';
      if (status !== '') {
        this.auditStatusList.forEach(item => {
          if (item.code === status) {
            str = item.name;
          }
        });
        return str;
      }
      return str;
    },
    close() {
      this.isShow = false;
    },
    ceshiClick() {
      this.isShow = true;
    },
    // 获取审核列表数据
    initDataList() {
      this.$AXIOS.LISTGET('/yaohuo/page', this.searchParams).then(res => {
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
      if (new Date(this.searchParams.startDate).getTime() > new Date(this.searchParams.endDate).getTime()) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // tab切换
    handleClick() {
      if (this.activeName2 === '3') {
        this.searchParams.auditStatus = '0';
      } else {
        this.searchParams.auditStatus = this.activeName2;
      }
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        orderNo: '', // 要货单编号
        externalOrderNo: '', // 外部单号
        sellCode: '', // 要货门店
        status: '', // 审核状态
        startDate: '', // 申请开始日期
        endDate: '', // 申请结束日期
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
    checkedPurchaseType(type) {
      let typeStr = '';
      if (type === 'purchaseSelling') {
        typeStr = '购销';
      } else if (type === 'agentSelling') {
        typeStr = '代销';
      } else if (type === 'purchaseSellingGift') {
        typeStr = '购销赠品';
      } else if (type === 'agentSellingGift') {
        typeStr = '代销赠品';
      }
      return typeStr;
    },
    // 跳转审核页面
    toPurchaseDetail(id) {
      this.$router.push({
        name: 'needapplydetail',
        params: {
          id
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.needapplymanage
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
    margin-bottom 10px
  .btn
    cursor: pointer
    color: blue
  .isGreen
    color: green
  .isRed
    color: red
</style>
<style lang="stylus">
.needapplymanage
  .el-tabs--card
    .el-tabs__header
      border none
</style>
