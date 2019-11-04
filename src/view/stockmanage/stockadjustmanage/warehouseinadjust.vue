<template>
  <div class="warehouseinadjust">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="入库调整单编号：" size="mini">
            <el-input v-model.trim="searchParams.stockAdjustInCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存调整单编号：" size="mini">
            <el-input v-model.trim="searchParams.stockAdjustCode" placeholder=""></el-input>
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
          <el-form-item label="业务类型：" size="mini">
            <el-select v-model="searchParams.businessType" filterable placeholder="请选择">
              <el-option v-for="item in businessTypeList" :key="item.value" :label="item.name" :value="item.value">
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
    <el-row type="flex" justify="space-between">
      <el-col>

      </el-col>
      <el-col class='paging' align="right">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList"  @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="入库调整单编号" prop="stockAdjustInCode" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="库存调整单编号" prop="stockAdjustCode" align="center"show-overflow-tooltip></el-table-column>
      <el-table-column label="调整仓库" prop="adjustWarehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据状态" prop="stockAdjustInStatus" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.stockAdjustInStatus === 0" >入库完成</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inOutInventoryTypeDesc" label="入库库存类型" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="ifadjustInventoryObject" prop="adjustInventoryObjectDesc" label="入库库存对象（门店）" align="center"></el-table-column>
          <el-table-column prop="inOutNum" label="入库数量" align="center"></el-table-column>
          <el-table-column prop="finishTime" label="入库时间" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging' align="right">
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNo" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="2">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">调整说明：</div>
            <div class="content">{{tableRowDetail.adjustInstruction}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="3">
        <el-table :data="logInfoList" style="width: 100%" border>
          <el-table-column prop="operation" label="动作" align="center"></el-table-column>
          <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="operateTimeString" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging' align="right">
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'warehouseinadjust',
    data() {
      return {
        id: '', // 调整单id
        warehouseList: [], // 调整仓库
        detailCount: 0, // 明细分页总条数
        detailParams: { // 明细分页参数
          start: 0,
          pageNo: 1,
          pageSize: 10
        },
        ifadjustInventoryObject: false, // 是否显示库存调整对象
        isTableDisabled: false,
        loading: null, // loading
        printData: [], // 打印的数据
        operateParams: {
          start: 0,
          pageNo: 1,
          pageSize: 10,
          operateType: 0,
          entityType: 'StockAdjustInOrder',
          entityId: ''
        }, // 日志
        tableData: [],
        activeName: '1', // 当前选中的选项卡
        arr: [], // 数组列表
        tableDataList: [], // 初始化列表数据
        tableRowList: [], // 详情明细
        tableRowDetail: {}, // 详情
        logInfoList: [], // 日志信息
        logCount: 0, // 日志条数
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
        totalCount: 0, // 列表条数
        searchParams: {
          stockAdjustInCode: '', // 入库调整单编号
          stockAdjustCode: '', // 库存调整单编号
          adjustWarehouseCode: '', // 调整仓库
          businessType: '', // 业务类型
          startDate: '', // 起始创建时间
          endDate: '', // 结束创建时间
          start: 0, // 开始页面
          pageSize: 10, // 默认10条
          pageNo: 1 // 默认第一页
        }, // 请求参数
        multipleSelection: [] // 多选框选中
      };
    },
    created() {
      this.initDataList();
      this.getWarehouseList();
    },
    computed: {
      divHeight() {
        let height = 600;
        if (this.printData[0].remark && this.printData[0].remark.length) {
          height = 650 - (Math.ceil(this.printData[0].remark.length / 62) * 50);
        }
        return height + 'px';
      }
    },
    methods: {
      // 获取采购单数据列表
      initDataList() {
        this.$AXIOS.LISTGET('/stockAdjustIn/page', this.searchParams).then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          this.isTableDisabled = false;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.id = this.tableDataList[0].id;
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.operateParams.entityId = this.tableDataList[0].stockAdjustInCode;
            this.tableRowDetail.adjustInstruction = this.tableDataList[0].adjustInstruction;
            this.getTableDetailList();
            this.getLogInfo();
        }, 20);
        } else {
          this.tableRowList = [];
          this.logInfoList = [];
          this.logCount = 0;
          this.tableRowDetail = {};
          this.isTableDisabled = true;
        }
      });
      },
      // 获取采购单明细数据详情
      getTableDetailList() {
        this.$AXIOS.LISTGET('/stockAdjustIn/details/' + this.id, this.detailParams).then(res => {
          this.tableRowList = res.result;
          this.detailCount = res.totalCount;
          if (this.tableRowList && this.tableRowList.length && (this.tableRowList[0].adjustInventoryObject === 0 || this.tableRowList[0].adjustInventoryObject === 1)) {
            this.ifadjustInventoryObject = true;
          } else {
            this.ifadjustInventoryObject = false;
          }
        });
      },
      // 获取调整仓库信息
      getWarehouseList() {
        this.$AXIOS.GET('/stockadjust/warehouseList').then(res => {
          this.warehouseList = res.result;
        });
      },
      // 页码条数改变
      detailChangeSize(val) {
        this.detailParams.start = 0;
        this.detailParams.pageNo = 1;
        this.detailParams.pageSize = val;
        this.getTableDetailList();
      },
      // 当前页码改变
      detailChangeNumber(val) {
        this.detailParams.pageNo = val;
        this.detailParams.start = (val - 1) * this.detailParams.pageSize;
        this.getTableDetailList();
      },
      // 获取日志信息
      getLogInfo() {
        this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
          this.logInfoList = res.result;
          this.logCount = res.totalCount;
      });
      },
      // 点击整行
      tableRowClick(row) {
        this.id = row.id;
        this.getTableDetailList();
        this.operateParams.entityId = row.stockAdjustInCode;
        this.tableRowDetail.adjustInstruction = row.adjustInstruction;
        this.getLogInfo();
      },
      // 页码条数改变
      logChangeSize(val) {
        this.operateParams.start = 0;
        this.operateParams.pageNo = 1;
        this.operateParams.pageSize = val;
        this.getLogInfo();
      },
      // 当前页码改变
      logChangeNumber(val) {
        this.operateParams.pageNo = val;
        this.operateParams.start = (val - 1) * this.operateParams.pageSize;
        this.getLogInfo();
      },
      // 筛选条件
      searchFormData() {
        if (
          new Date(this.searchParams.startDate).getTime() >
          new Date(this.searchParams.endDate).getTime()
        ) {
          this.$utils.messagetip.warningTip('开始创建日期不得大于结束创建日期');
          return;
        }
        this.searchParams.pageSize = 10;
        this.searchParams.pageNo = 1;
        this.searchParams.start = 0;
        this.initDataList();
      },
      // 重置搜索条件
      resetForm() {
        this.searchParams = {
          stockAdjustInCode: '', // 入库调整单编号
          stockAdjustCode: '', // 库存调整单编号
          adjustWarehouseCode: '', // 调整仓库code
          businessType: '', // 业务类型
          startDate: '', // 开始日期
          endDate: '', // 结束日期
          start: 0, // 开始页面
          pageSize: 10, // 默认10条
          pageNo: 1 // 默认第一页
        };
        this.initDataList();
      },
      // 页码条数改变
      changeSize(val) {
        this.searchParams.pageNo = 1;
        this.searchParams.pageSize = val;
        this.initDataList();
      },
      // 当前页码改变
      changeNumber(val) {
        this.searchParams.pageNo = val;
        this.initDataList();
      }
    }
  };
</script>
