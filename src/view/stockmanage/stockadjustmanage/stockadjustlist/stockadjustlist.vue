<template>
  <div class="stockadjustlist">
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
          <el-form-item label="单据来源：" size="mini">
            <el-select v-model="searchParams.docSource" filterable placeholder="请选择">
              <el-option v-for="item in docSourceList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="单据状态：" size="mini">
            <el-select v-model="searchParams.docStatus" filterable placeholder="请选择">
              <el-option v-for="item in docStatusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近更新日期：" size="mini">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.upStartTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.upEndTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
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
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增库存调整单</el-button>
      </el-col>
      <el-col class='paging' align="right">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @selection-change="handleSelectionChange" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="库存调整单编号" prop="stockAdjustCode" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="仓库来源编号" prop="wmsSourceCode" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.docSource == 0">{{scope.row.wmsSourceCode}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="调整仓库" prop="adjustWarehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据来源" prop="docSourcedDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据状态" prop="docStatusDesc" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.docStatus == '1'" style='color: orange;'>{{scope.row.docStatusDesc}}</div>
          <div v-else-if="scope.row.docStatus == '4'" style='color: green;'>{{scope.row.docStatusDesc}}</div>
          <div v-else>{{scope.row.docStatusDesc}}</div>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.docStatus === 0 || scope.row.docStatus === 1" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" v-if="scope.row.docStatus === 0 || scope.row.docStatus === 1" @click="deleteBtn(scope.row)">删除</el-button>
          <div v-if="scope.row.docStatus !== 0 && scope.row.docStatus !== 1">-</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <el-tab-pane label="商品明细" name="1">
        <el-table class="price_list" :data="tableRowList" style="width: 100%;" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column v-if="businessType == 3" prop="skuCode" label="SKU编号" align="center" width="230" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span align="center">原SKU</span><span class="targatSkuCode">{{scope.row.skuCode}}</span></div>
              <div class="oringinDiv"><span align="center">目标SKU</span><span class="targatSkuCode">{{scope.row.targetSkuCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuCode" label="SKU编号" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="businessType == 3" prop="skuName" label="SKU名称" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.skuName}}</span></div>
              <div><span>{{scope.row.targetSkuName}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuName" label="SKU名称" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="businessType == 3" prop="specNatureInfo" label="规格" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.specNatureInfo}}</span></div>
              <div><span>{{scope.row.targetSpecNatureInfo}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="specNatureInfo" label="规格" align="center" :key="Math.random()"></el-table-column>

          <el-table-column  v-if="businessType == 3" prop="barCode" label="条形码" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.barCode}}</span></div>
              <div><span>{{scope.row.targetBarCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="barCode" label="条形码" align="center" :key="Math.random()"></el-table-column>
          <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center"></el-table-column>
          <el-table-column v-if="ifadjustInventoryObject" prop="adjustInventoryObjectDesc" label="调整库存对象（门店）" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="businessType == 3" prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <div style="border-bottom: 1px solid #ebeef5">
                <span>减少</span>
                <span>{{scope.row.adjustNum}}</span>
              </div>
              <div>
                <span>增加</span>
                <span>{{scope.row.targetAdjustNum}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
          </el-table-column>
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
    name: 'stockadjustlist',
    data() {
      return {
        tableRowPrintList: [], // 预览打印的数据
        detailCount: 0, // 明细分页总条数
        detailParams: { // 明细分页参数
          start: 0,
          pageNo: 1,
          pageSize: 10,
          id: ''
        },
        ifadjustInventoryObject: true, // 调整库存对象是否存在
        disabledDownLoad: false,
        disabledDownLoadExcel: false,
        isTableDisabled: false,
        loading: null, // loading
        downLoadUrl: '', // 下载路径
        fileDataList: [], // 上传文件列表
        code: '', // 保存的采购单编号
        operateParams: {
          start: 0,
          pageNo: 1,
          pageSize: 10,
          operateType: 0,
          entityType: 'StockAdjustOrder',
          entityId: ''
        }, // 日志
        tableData: [],
        activeName: '1', // 当前选中的选项卡
        arr: [], // 数组列表
        dialogTableVisible: false, // 弹窗
        tableDataList: [], // 初始化列表数据
        tableRowList: [], // 详情明细
        tableRowDetail: {}, // 详情
        logInfoList: [], // 日志信息
        logCount: 0, // 日志条数
        docStatusList: [
          {
            name: '全部',
            code: ''
          },
          {
            name: '暂存',
            code: '0'
          },
          {
            name: '提交审核',
            code: '2'
          },
          {
            name: '审核通过',
            code: '3'
          },
          {
            name: '审核驳回',
            code: '1'
          },
          {
            name: '调整完成',
            code: '4'
          }
        ], // 单据状态列表
        docSourceList: [
          {
            name: '全部',
            code: ''
          },
          {
            name: '接口',
            code: '0'
          },
          {
            name: '人工',
            code: '1'
          }
        ], // 单据来源列表
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
          stockAdjustCode: '', // 库存调整单号
          adjustWarehouseCode: '', // 库存调整仓库编码
          businessType: '', // 库存调整业务类型
          adjustInventoryType: '', // 库存调整库存类型
          docSource: '', // 单据来源
          docStatus: '', // 单据状态
          upStartTime: '', // 开始日期
          upEndTime: '', // 结束日期
          start: 0, // 开始页面
          pageSize: 10, // 默认10条
          pageNo: 1 // 默认第一页
        }, // 请求参数
        multipleSelection: [], // 多选框选中
        warehouseList: [], // 调整仓库
        businessType: 0 // 业务类型
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
      // 多选框选中
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 多选框是否可选
      checkSelectable(row, index) {
        let isSeletc = false;
        if (row.status === '2' || row.status === '8') {
          isSeletc = true;
        }
        return isSeletc;
      },
      // 获取采购单数据列表
      initDataList() {
        this.$AXIOS
          .LISTGET('/stockadjust/page', this.searchParams)
          .then(res => {
          this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        this.isTableDisabled = false;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.detailParams.id = this.tableDataList[0].id;
            this.tableRowDetail.adjustInstruction = this.tableDataList[0].adjustInstruction;
            if (this.tableDataList[0].adjustInventoryObject === 0 || this.tableDataList[0].adjustInventoryObject === 1) {
              this.ifadjustInventoryObject = true;
            } else {
              this.ifadjustInventoryObject = false;
            }
            this.businessType = this.tableDataList[0].businessType;
            this.getTableDetailList();
            this.operateParams.entityId = this.tableDataList[0].stockAdjustCode;
            this.getLogInfo();
        }, 20);
        } else {
          this.tableRowList = [];
          this.tableRowDetail = {};
          this.logInfoList = [];
          this.logCount = 0;
          this.isTableDisabled = true;
        }
      });
      },
      // 获取库存明细数据详情
      getTableDetailList() {
        this.tableRowList = [];
        this.$AXIOS.LISTGET('/stockadjust/details', this.detailParams).then(res => {
            this.tableRowList = res.result;
            this.detailCount = res.totalCount;
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
      // 删除接口
      deleteUpdateState(row) {
        this.$AXIOS
          .DELETE('/stockadjust/delete/', row.id)
          .then(res => {
            this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.initDataList();
      }, 600);
      });
      },
      // 获取日志信息
      getLogInfo() {
        this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
          this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
      },
      // 点击删除按钮
      deleteBtn(row) {
        this.$confirm(`删除后数据将不可恢复。`, `您确认要删除吗?`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
          .then(() => {
          this.deleteUpdateState(row);
      })
      .catch(() => {
        this.$utils.messagetip.infoTip('已取消');
      });
      },
      // 点击整行
      tableRowClick(row) {
        this.detailParams.id = row.id;
        this.operateParams.entityId = row.stockAdjustCode;
        this.tableRowDetail.adjustInstruction = row.adjustInstruction;
        if (row.adjustInventoryObject === 0 || row.adjustInventoryObject === 1) {
          this.ifadjustInventoryObject = true;
        } else {
          this.ifadjustInventoryObject = false;
        }
        this.businessType = row.businessType;
        this.getTableDetailList();
        this.getLogInfo();
      },
      // 跳转新增页面
      toAddOrEdit(id) {
        if (id === 'add') {
          this.$router.push({path: '/stockadjustlist/stockadjustdetail/' + id, query: {isadd: 1}});
        } else {
          this.$router.push({path: '/stockadjustlist/stockadjustdetail/' + id, query: {isadd: 1}});
        }
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
          new Date(this.searchParams.upStartTime).getTime() >
          new Date(this.searchParams.upEndTime).getTime()
        ) {
          this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
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
          stockAdjustCode: '', // 库存调整单号
            adjustWarehouseCode: '', // 库存调整仓库编码
            businessType: '', // 库存调整业务类型
            adjustInventoryType: '', // 库存调整库存类型
            docSource: '', // 单据来源
            docStatus: '', // 单据状态
            upStartTime: '', // 开始日期
            upEndTime: '', // 结束日期
            start: 0, // 开始页面
            pageSize: 10, // 默认10条
            pageNo: 1 // 默认第一页
        };
        this.initDataList();
      },
      toEditBtn() {
        this.toAddOrEdit(this.copyId);
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
      },
      // 类型翻译
      checkedType(type) {
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
      // 单据状态翻译
      checkedStatus(status) {
        let statusStr = '';
        if (status === '0') {
          statusStr = '暂存';
        } else if (status === '1') {
          statusStr = '审核驳回';
        } else if (status === '2') {
          statusStr = '审核通过';
        } else if (status === '3') {
          statusStr = '提交审核';
        } else if (status === '4') {
          statusStr = '调整完成';
        }
        return statusStr;
      },
      // 入库状态翻译
      checkedWarStatus(status) {
        let statusStr = '-';
        if (status === '0') {
          statusStr = '等待入库';
        } else if (status === '1') {
          statusStr = '全部入库';
        } else if (status === '2') {
          statusStr = '部分入库';
        } else if (status === '3') {
          statusStr = '入库异常';
        }
        return statusStr;
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .price_list
    .oringinDiv
      text-align:right;
      span
        padding:2px 10px;
      .targatSkuCode
        display:inline-block;
        border-left: 1px solid #ebeef5;
        width: 150px;
        text-align: center;
</style>
