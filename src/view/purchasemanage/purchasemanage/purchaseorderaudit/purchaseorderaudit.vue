<template>
  <div class="purchaseorderaudit">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="采购单编号：" size="mini">
            <el-input v-model.trim="searchParams.purchaseOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称：" size="mini">
            <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购类型：" size="mini">
            <el-select v-model="searchParams.purchaseType" filterable placeholder="请选择">
              <el-option v-for="item in purchaseTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- <el-form-item label="审核状态：" size="mini">
            <el-select v-model="searchParams.purchaseOrderAuditStatus" filterable placeholder="请选择">
              <el-option v-for="item in purchaseOrderAuditStatusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="提交审核时间：" size="mini">
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
      </el-row>
      <el-row :span="20">
        <el-col :span="6">&nbsp;</el-col>
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
    <div class="paging_group">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="待审核" name="1">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="采购单编号" align="center" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toPurchaseDetail(scope.row.id, '1', scope.row.status)">{{scope.row.purchaseOrderCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="采购类型" prop="purchaseType" align="center">
                  <template slot-scope="scope">
                    {{checkedPurchaseType(scope.row.purchaseType)}}
                  </template>
                </el-table-column>
                <el-table-column label="归属采购组" prop="purchaseGroupName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="合同编号" prop="contractCode" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="收货仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="要求到货日期" prop="requriedReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="截止到货日期" prop="endReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.status === '1' ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交人" prop="createOperator" align="center"></el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status === '1'" size="mini" type="text" @click="toPurchaseDetail(scope.row.id, '2', scope.row.status)">审核</el-button>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="已审核" name="2">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="采购单编号" align="center" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toPurchaseDetail(scope.row.id, '1', scope.row.status)">{{scope.row.purchaseOrderCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="采购类型" prop="purchaseType" align="center">
                  <template slot-scope="scope">
                    {{checkedPurchaseType(scope.row.purchaseType)}}
                  </template>
                </el-table-column>
                <el-table-column label="归属采购组" prop="purchaseGroupName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="合同编号" prop="contractCode" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="收货仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="要求到货日期" prop="requriedReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="截止到货日期" prop="endReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.status === '1' ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核结果" prop="createOperator" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status === '2'" class="isGreen">审核通过</div>
                    <div v-else-if="scope.row.status === '3'" class="isRed">审核驳回</div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交人" prop="createOperator" align="center"></el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="全部" name="3">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="采购单编号" align="center" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toPurchaseDetail(scope.row.id, '1', scope.row.status)">{{scope.row.purchaseOrderCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="采购类型" prop="purchaseType" align="center">
                  <template slot-scope="scope">
                    {{checkedPurchaseType(scope.row.purchaseType)}}
                  </template>
                </el-table-column>
                <el-table-column label="归属采购组" prop="purchaseGroupName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="合同编号" prop="contractCode" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="收货仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="要求到货日期" prop="requriedReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="截止到货日期" prop="endReceiveDate" align="center" width='140'></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.status === '1' ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核结果" prop="createOperator" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status === '2'" class="isGreen">审核通过</div>
                    <div v-else-if="scope.row.status === '3'" class="isRed">审核驳回</div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交人" prop="createOperator" align="center"></el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status === '1'" size="mini" type="text" @click="toPurchaseDetail(scope.row.id, '2', scope.row.status)">审核</el-button>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </div>
    <!-- 表格tableData -->
    <!-- <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="采购单编号" align="center" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="btn" @click="toPurchaseDetail(scope.row.id, '1', scope.row.status)">{{scope.row.purchaseOrderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" prop="purchaseType" align="center">
        <template slot-scope="scope">
          {{checkedPurchaseType(scope.row.purchaseType)}}
        </template>
      </el-table-column>
      <el-table-column label="归属采购组" prop="purchaseGroupName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="合同编号" prop="contractCode" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column label="收货仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="要求到货日期" prop="requriedReceiveDate" align="center" width='140'></el-table-column>
      <el-table-column label="截止到货日期" prop="endReceiveDate" align="center" width='140'></el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.status === '1' ? '待审核' : '已审核'}}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="activeName2 !== '1'" label="审核结果" prop="createOperator" align="center">
        <template slot-scope="scope">
          <div>审核结果</div>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createOperator" align="center"></el-table-column>
      <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1'" size="mini" type="text" @click="toPurchaseDetail(scope.row.id, '2', scope.row.status)">审核</el-button>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- <div v-if="isShow">
      <purchaseauditdetail :purchId='616' status='1' @purseClose='close'></purchaseauditdetail>
    </div> -->
  </div>
</template>
<script>
// import purchaseauditdetail from './purchaseauditdetail/purchaseauditdetail';
export default {
  name: 'purchaseorderaudit',
  // components: {
  //   purchaseauditdetail
  // },
  data() {
    return {
      activeName2: '1', // 默认选中状态
      isShow: false, // 点击显示
      tableDataList: [], // 列表
      searchParams: {
        purchaseOrderCode: '', // 采购单编号
        supplierName: '', // 供应商名称
        purchaseType: '', // 采购类型
        purchaseOrderAuditStatus: '1', // 审核状态
        startDate: '', // 开始日期
        endDate: '', // 结束日期
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
      ],
      purchaseOrderAuditStatusList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '待审核'
        },
        {
          id: '2',
          name: '已审核'
        }
      ]
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    close() {
      this.isShow = false;
    },
    ceshiClick() {
      this.isShow = true;
    },
    // 获取审核列表数据
    initDataList() {
      this.$AXIOS.LISTGET('/purchase/purchaseOrderAuditPage', this.searchParams).then(res => {
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
        this.searchParams.purchaseOrderAuditStatus = '';
      } else {
        this.searchParams.purchaseOrderAuditStatus = this.activeName2;
      }
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        purchaseOrderCode: '', // 采购单编号
        supplierName: '', // 供应商名称
        purchaseType: '', // 采购类型
        purchaseOrderAuditStatus: '1', // 审核状态
        startDate: '', // 开始日期
        endDate: '', // 结束日期
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
    toPurchaseDetail(id, flag, status) {
      this.$router.push({
        path: '/purchaseorderaudit/purchaseauditdetail/' + id,
        query: {
          flag,
          isAuditStatus: status
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.purchaseorderaudit
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
  .paging_group
    position: relative
  .paging
    text-align: right
    margin-top: 15px
    position: absolute
    top: 0
    right: 0
  .btn
    cursor: pointer
    color: blue
  .isGreen
    color: green
  .isRed
    color: red
</style>
<style lang="stylus">
.purchaseorderaudit
  .el-tabs--card
    .el-tabs__header
      border none
</style>
