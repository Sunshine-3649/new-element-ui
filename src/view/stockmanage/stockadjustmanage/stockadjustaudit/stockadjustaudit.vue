<template>
  <div class="stockadjustaudit">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="库存调整单编号：" size="mini">
            <el-input v-model.trim="searchParams.stockAdjustCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型：" size="mini">
            <el-select v-model="searchParams.businessType" filterable placeholder="请选择">
              <el-option v-for="item in businessTypeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调整仓库：" size="mini">
            <el-select v-model="searchParams.adjustWarehouseCode" filterable placeholder="请选择">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提交审核时间：" size="mini">
            <el-col :span="11">
              <el-form-item prop="submitStartTime" size="mini">
                <el-date-picker v-model="searchParams.submitStartTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="submitEndTime" size="mini">
                <el-date-picker v-model="searchParams.submitEndTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
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
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <div class="paging_group">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="待审核" name="0">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="库存调整单编号" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toAdjustDetail(scope.row.id, 1, scope.row.status)">{{scope.row.stockAdjustCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="调整仓库" prop="adjustWarehouseCode" align="center">
                  <template slot-scope="scope">
                    {{checkedType(scope.row.adjustWarehouseCode)}}
                  </template>
                </el-table-column>
                <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="提交人" prop="submitOperator" align="center"></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.reviewStatus === 0 ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.reviewStatus === 0" size="mini" type="text" @click="toAdjustDetail(scope.row.id, 0, scope.row.reviewStatus)">审核</el-button>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="已审核" name="1">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="库存调整单编号" align="center" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toAdjustDetail(scope.row.id, 1, scope.row.status)">{{scope.row.stockAdjustCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="调整仓库" prop="adjustWarehouseCode" align="center">
                  <template slot-scope="scope">
                    {{checkedType(scope.row.adjustWarehouseCode)}}
                  </template>
                </el-table-column>
                <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="提交人" prop="submitOperator" align="center"></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.reviewStatus === 0 ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核结果" prop="createOperator" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.docStatus === 1" class="isRed">审核驳回</div>
                    <div v-else-if="scope.row.docStatus === 3 || scope.row.docStatus === 4" class="isGreen">审核通过</div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="全部" name="2">
              <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="库存调整单编号" align="center" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="btn" @click="toAdjustDetail(scope.row.id, 1, scope.row.status)">{{scope.row.stockAdjustCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="调整仓库" prop="adjustWarehouseCode" align="center">
                  <template slot-scope="scope">
                    {{checkedType(scope.row.adjustWarehouseCode)}}
                  </template>
                </el-table-column>
                <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="提交人" prop="submitOperator" align="center"></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.reviewStatus === 0 ? '待审核' : '已审核'}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="审核结果" prop="createOperator" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.docStatus === 1" class="isRed">审核驳回</div>
                    <div v-else-if="scope.row.docStatus === 3 || scope.row.docStatus === 4" class="isGreen">审核通过</div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="提交审核时间" prop="submitTime" align="center" width='140'></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.reviewStatus === 0" size="mini" type="text" @click="toAdjustDetail(scope.row.id, 0, scope.row.reviewStatus)">审核</el-button>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row class="paging">
        <el-col align="right">
          <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'stockadjustaudit',
    data() {
      return {
        activeName2: '0', // 默认选中状态
        isShow: false, // 点击显示
        tableDataList: [], // 列表
        warehouseList: [], // 调整仓库
        searchParams: {
          stockAdjustCode: '', // 库存调整单号
          adjustWarehouseCode: '', // 库存调整仓库编码
          businessType: '', // 库存调整业务类型
          adjustInventoryType: '', // 库存调整库存类型
          docSource: '', // 单据来源
          docStatus: '', // 单据状态
          submitStartTime: '', // 开始日期
          submitEndTime: '', // 结束日期
          reviewStatus: 0, // 待审核
          start: 0, // 开始页面
          pageSize: 10, // 默认10条
          pageNo: 1 // 默认第一页
        }, // 请求参数
        totalCount: 0, // 总页码
        businessTypeList: [
          {
            name: '全部',
            value: ''
          },
          {
            name: '库存盘点',
            value: '0'
          },
          {
            name: '正品转残品',
            value: '1'
          },
          {
            name: '残品转正品',
            value: '2'
          },
          {
            name: '库存转化',
            value: '3'
          },
          {
            name: '系统原因',
            value: '4'
          }
        ], // 业务类型列表
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
      this.getWarehouseList();
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
        this.$AXIOS.LISTGET('/stockadjust/page', this.searchParams).then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            }, 20);
          }
      });
      },
      // 获取调整仓库信息
      getWarehouseList() {
        this.$AXIOS.GET('/stockadjust/warehouseList').then(res => {
          this.warehouseList = res.result;
        });
      },
      // 筛选条件
      searchFormData() {
        if (new Date(this.searchParams.submitStartTime).getTime() > new Date(this.searchParams.submitEndTime).getTime()) {
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
        if (this.activeName2 === 2) {
          this.searchParams.reviewStatus = '';
        } else {
          this.searchParams.reviewStatus = this.activeName2;
        }
        this.searchParams.start = 0;
        this.searchParams.pageNo = 1;
        this.initDataList();
      },
      // 重置搜索条件
      resetForm() {
        this.activeName2 = '0';
        this.searchParams = {
          purchaseOrderCode: '', // 采购单编号
          supplierName: '', // 供应商名称
          purchaseType: '', // 采购类型
          reviewStatus: 0, // 审核状态
          submitStartTime: '', // 开始日期
          submitEndTime: '', // 结束日期
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
      checkedType(type) {
        let typeStr = '';
        this.warehouseList.forEach( item => {
          if (type === item.code) {
            typeStr = item.warehouseName;
          }
        });
        return typeStr;
      },
      // 跳转审核页面
      toAdjustDetail(id, flag, status) {
        this.$router.push({
          name: 'stockadjustDetail',
          params: {
            id,
            flag,
            isAuditStatus: status
          }
        });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stockadjustaudit
    .btn
      cursor: pointer;
      color:blue;
    .isGreen
      color: green
    .isRed
      color: red
</style>
