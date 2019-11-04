<template>
  <div class="activityfreeze">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="活动编号：" size="mini">
            <el-input v-model.trim="searchParams.eventCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动名称：" size="mini">
            <el-input v-model.trim="searchParams.eventName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU编号：" size="mini">
            <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码：" size="mini">
            <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="状态：" size="mini">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间-结束时间" size="mini">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.startTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.endTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期：" size="mini">
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
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增活动</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @row-click="tableRowClick" ref="singleTable" @current-change="handleCurrentChange" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="活动编号" prop="eventCode" align="center" width="125" show-overflow-tooltip></el-table-column>
      <el-table-column label="活动名称" prop="eventName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="活动渠道" prop="eventChannelName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="开始时间" prop="startTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="结束时间" prop="endTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="来源" prop="eventSource"  width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if='scope.row.eventSource == "0"'>接口</span>
            <span v-if='scope.row.eventSource == "1"'>人工</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="120" align="center">
         <template slot-scope="scope">
          <div>
            <span v-if='scope.row.status == "0"'>未开始</span>
            <span v-if='scope.row.status == "1"'>进行中</span>
            <span v-if='scope.row.status == "2"'>已失效</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" v-if='scope.row.status == "0"' @click="toAddOrEdit(scope.row.eventCode)">编辑</el-button>
            <el-button size="mini" type="text" v-if='scope.row.status == "0" || scope.row.status == "1"' @click="deleteBtn(scope.row)">关闭</el-button>
            <span v-if='scope.row.status == "2"'>-</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="outInOrderDetailList" style="width: 100%" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="frozenNumOfFinished" label="设置冻结数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="frozenNumOfRemaining" label="剩余冻结数量" align="center">
            <template slot-scope="scope">
              <div class='btn' v-if='scope.row.frozenNumOfRemaining > 0' @click='getQueryEventFrozenNum(scope.row.skuCode)'>{{scope.row.frozenNumOfRemaining}}</div>
              <div v-else>{{scope.row.frozenNumOfRemaining}}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNo" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="2">
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">备注：</div>
            <div class="content">{{tableRowDetail.remark}}</div>
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
        <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="numTitle"
      :visible.sync="dialogVisible"
      width="60%"
      >
      <el-table
          :data="tableRowData"
          border
          style="width: 100%">
          <el-table-column
            align='center'
            prop="warehouseName"
            label="仓库名称"
            >
          </el-table-column>
          <el-table-column
            align='center'
            prop="frozenNumOfRemaining"
            label="剩余冻结数量"
            >
          </el-table-column>
        </el-table>
      <div style='text-align: center;margin-top: 15px'>
        <el-button size='mini' type="primary" @click="closeTableRowData">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'activityfreeze',
  data() {
    return {
      tableRowData: [],
      currentRow: null,
      dialogVisible: false,
      numTitle: '', // 活动库存明细详情
      outInOrderDetailList: [], // 明细列表
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        start: 0,
        pageNo: 1,
        pageSize: 10,
        detailPageflag: true,
        eventCode: ''
      },
      outInType: '1', // 默认类型为其他入库
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'EventFrozen',
        entityId: ''
      }, // 日志
      tableData: [],
      activeName: '1', // 当前选中的选项卡
      arr: [], // 数组列表
      purchaseGroupCodeList: [
        {
          name: '全部',
          code: ''
        }
      ], // 采购组列表
      brandNameList: [], // 品牌列表
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单
      isSecondLevel: true, // 关联三级菜单
      dialogTableVisible: false, // 弹窗
      currentTableIndex: [], // 当前列表对应子列表的sku项
      skuList: [], // sku列表
      spuCodeList: [], // spu更改状态列表
      skuCodeList: [], // sku更改状态列表
      tableDataList: [], // 初始化列表数据
      tableRowList: [], // 详情明细
      tableRowDetail: {}, // 详情
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      boxInfoDetail: {}, // 装箱信息
      statusList: [
        {
          name: '全部',
          code: ''
        },
        {
          name: '未开始',
          code: '0'
        },
        {
          name: '进行中',
          code: '1'
        },
        {
          name: '已失效',
          code: '2'
        }
      ], // 状态
      outInStatusList: [], // 出库状态列表
      purchaseTypeList: [
        {
          name: '全部',
          value: ''
        }
      ], // 采购类型列表
      warehouseNoticeStatusList: [
        {
          value: '',
          name: '全部'
        },
        {
          value: '0',
          name: '等待入库'
        },
        {
          value: '1',
          name: '全部入库'
        },
        {
          value: '2',
          name: '部分入库'
        },
        {
          value: '3',
          name: '入库异常'
        },
        {
          value: '4',
          name: '其他'
        }
      ], // 入库状态列表
      totalCount: 0, // 列表条数
      searchParams: {
        eventCode: '', // 活动编号
        eventName: '', // 活动名称
        skuCode: '', // sku编号
        barCode: '', // 条形码
        status: '', // 状态
        startTime: '', // 活动开始日期
        endTime: '', // 活动结束日期
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      multipleSelection: [] // 多选框选中
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    // 库存类别翻译
    checkStockType(val) {
      let typeStr = '';
      if (val === '1') {
        typeStr = '正品';
      } else if (val === '2') {
        typeStr = '残品';
      }
      return typeStr;
    },
     handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 获取采购单数据列表
    initDataList() {
      this.tableRowDetail = {};
      this.outInOrderDetailList = [];
      this.logInfoList = [];
      this.logCount = 0;
      this.$AXIOS
        .LISTGET('/eventFrozen/eventFrozenPage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.singleTable.setCurrentRow(this.tableDataList[0]);
              // 获取明细分页数据
              this.detailParams.eventCode = this.tableDataList[0].eventCode;
              this.tableRowDetail.remark = this.tableDataList[0].remark;
              // 获取明细分页数据
              this.detailParams.start = 0;
              this.detailParams.pageNo = 1;
              this.getTableDetailList();
              this.operateParams.entityId = this.tableDataList[0].eventCode;
              this.getLogInfo();
            }, 500);
          } else {
            this.tableRowList = [];
            this.tableRowDetail = [];
            this.boxInfoDetail = [];
            this.logInfoList = [];
            this.logCount = 0;
          }
        });
    },
    closeTableRowData() {
      this.dialogVisible = false;
      this.tableRowData = [];
    },
    getQueryEventFrozenNum(skuCode) {
      this.numTitle = `商品【${skuCode}】冻结明细`;
      this.dialogVisible = true;
      this.$AXIOS.LISTGET('/eventFrozen/queryEventFrozenNum/' + this.detailParams.eventCode, {skuCode}).then(res => {
        this.tableRowData = res.result;
      });
    },
    // 获取采购单明细数据列表
    getWarehouseNoticeDetail(purchaseId) {
      let params = {
        start: 0,
        pageIndex: 0,
        purchaseId
      };
      console.log('object');
      this.$AXIOS.LISTGET('/purchase/purchaseDetail', params).then(res => {
        console.log(res);
        this.tableRowList = res;
      });
    },
    // 获取采购单明细数据详情
    getWarehouseNoticeInfo(eventCode) {
      this.$AXIOS.GET('/OtherOutIn/query_detail/' + eventCode).then(res => {
        console.log(res);
        this.tableRowDetail = res.result;
        // 获取明细分页数据
        this.detailParams.start = 0;
        this.detailParams.pageNo = 1;
        this.getTableDetailList();
      });
    },
    // 获取采购单明细数据详情
    getTableDetailList() {
      this.$AXIOS.LISTGET('/eventFrozen/eventFrozenDetailPage/' + this.detailParams.eventCode, this.detailParams).then(res => {
        console.log('res: ', res);
        this.outInOrderDetailList = res.result;
        this.detailCount = res.totalCount;
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
        .POST('/eventFrozen/closeEvent/' + row.eventCode)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.databuffer
          });
          setTimeout(() => {
            this.initDataList();
          }, 20);
        });
    },
    // 作废接口
    discardUpdateState(row) {
      this.$AXIOS
        .PUT('/OtherOutIn/drop_order/' + row.eventCode)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.databuffer
          });
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 入库通知接口
    warahouseAdvice(row) {
      this.$AXIOS
        .PUT('/OtherOutIn/notice_warehouse/' + row.eventCode)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.databuffer
          });
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
    // 获取装箱信息
    getBoxInfo(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/' + code).then(res => {
        this.boxInfoDetail = res.result;
      });
    },
    // 获取物流公司下拉列表
    getLogiisticsInfoList(code) {
      this.$AXIOS.GET('/system/enabled').then(res => {
        this.logiisticsInfoList = res.result;
        if (this.boxInfoDetail.logisticsCorporationName) {
          this.logiisticsInfoList.forEach(item => {
            if (item.logisticsCorporationName === this.boxInfoDetail.logisticsCorporationName) {
              this.form.logiisticsInfo = item.logisticsCode;
            }
          });
        }
      });
    },
    // 获取包装方式下拉列表
    getRestaurantsList(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/dict').then(res => {
        this.restaurantsList = res.result;
      });
    },
    // 装箱信息保存接口
    savePurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/save', params).then(res => {
        this.$message({
          type: 'success',
          message: res.databuffer
        });
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 装箱信息保存接口
    finishPurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/finish', params).then(res => {
        this.$message({
          type: 'success',
          message: res.databuffer
        });
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 完成按钮
    finishBtn() {
      let params = {};
      let arrList = [];
      let skuList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox; // 数量
            obj.boxNumber = suppItem.boxNumber; // 箱号
            obj.boxAmount = suppItem.boxAmount; // 箱数
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount; // 数量
            obj.grossWeight = suppItem.grossWeight; // 毛重
            obj.cartonSize = suppItem.cartonSize; // 外箱尺寸
            obj.volume = suppItem.volume; // 体积
            obj.remark = suppItem.remark; // 备注
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        } else {
          skuList.push(rowItem.skuCode);
        }
      });
      // 数据格式校验
      if (!params.packingType) {
        this.$message({
          message: '装箱方式不能为空！',
          type: 'warning'
        });
        return;
      }
      if (skuList && skuList.length) {
        this.$message({
          message: `sku编号为${skuList}的装箱信息不能为空！`,
          type: 'warning'
        });
        return;
      }
      let isSkuCode = '';
      let isAmountPerBox = false; // 数量
      let isAmountPerBoxInt = false; // 数量
      let isBoxNumber = false; // 箱号
      let isBoxAmount = false; // 箱数
      let isBoxAmountInt = false; // 箱数
      let isGrossWeight = false; // 毛重
      let isGrossWeightFloat = false; // 毛重
      let isCartonSize = false; // 外箱尺寸
      let isCartonSizeSpec = false; // 外箱尺寸
      let isVolume = false; // 体积
      let isVolumeFloat = false; // 体积
      let isIntReg = /^[0-9]+$/; // 正整数
      let isFloatReg = /^[0-9.]+$/;
      let isSpecReg = /^[0-9*]+$/;
      arrList.forEach(item => {
        if (!item.amountPerBox) {
          isSkuCode = item.skuCode;
          isAmountPerBox = true;
        }
        if (!isIntReg.test(item.amountPerBox) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isAmountPerBoxInt = true;
        }
        if (!item.boxNumber && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxNumber = true;
        }
        if (!item.boxAmount && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmount = true;
        }
        if (!isIntReg.test(item.boxAmount) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmountInt = true;
        }
        if (!item.grossWeight && !isSkuCode) {
          isSkuCode = item.skuCode;
          isGrossWeight = true;
        }
        console.log(!isFloatReg.test(item.grossWeight) && (item.grossWeight && item.grossWeight.indexOf('.') > -1) && item.grossWeight.split('.')[1] && item.grossWeight.split('.')[1].length > 2 && !isSkuCode);
        if ((!isFloatReg.test(item.grossWeight) || (item.grossWeight && item.grossWeight.indexOf('.') > -1 && item.grossWeight.split('.')[1] && item.grossWeight.split('.')[1].length > 2)) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isGrossWeightFloat = true;
        }
        if (!item.cartonSize && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSize = true;
        }
        if (!isSpecReg.test(item.cartonSize) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSizeSpec = true;
        }
        if (!item.volume && !isSkuCode) {
          isSkuCode = item.skuCode;
          isVolume = true;
        }
        if ((!isFloatReg.test(item.volume) || (item.volume && item.volume.indexOf('.') > -1 && item.volume.split('.')[1] && item.volume.split('.')[1].length > 4)) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isVolumeFloat = true;
        }
      });
      if (isAmountPerBox) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中数量不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isAmountPerBoxInt) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中数量只能为正整数！`,
          type: 'warning'
        });
        return;
      }
      if (isBoxNumber) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中箱号不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isBoxAmount) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中箱数不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isBoxAmountInt) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中箱数只能为正整数！`,
          type: 'warning'
        });
        return;
      }
      if (isGrossWeight) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中毛重不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isGrossWeightFloat) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中毛重格式不正确！`,
          type: 'warning'
        });
        return;
      }
      if (isCartonSize) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中外箱尺寸不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isCartonSizeSpec) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中外箱尺寸只能包含*和数字！`,
          type: 'warning'
        });
        return;
      }
      if (isVolume) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中体积不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isVolumeFloat) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中体积格式不正确！`,
          type: 'warning'
        });
        return;
      }
      let isAmountResult = false;
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(item => {
        let amountResult = 0;
        item.purchaseBoxInfoList.forEach(subItem => {
          amountResult += subItem.amountPerBox * subItem.boxAmount;
        });
        if (amountResult !== item.purchasingQuantity * 1 && !isSkuCode) {
          console.log(amountResult);
          console.log(item.purchasingQuantity);
          isAmountResult = true;
          isSkuCode = item.skuCode;
        }
      });
      if (isAmountResult) {
        this.$message({
          message: `sku编号为${isSkuCode}的装箱信息中数量必须等于采购数量！`,
          type: 'warning'
        });
        return;
      }
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.finishPurchaseBoxInfo(params);
    },
    // 暂存按钮
    saveBtn() {
      let params = {};
      let arrList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox;
            obj.boxNumber = suppItem.boxNumber;
            obj.boxAmount = suppItem.boxAmount;
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount;
            obj.grossWeight = suppItem.grossWeight;
            obj.cartonSize = suppItem.cartonSize;
            obj.volume = suppItem.volume;
            obj.remark = suppItem.remark;
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        }
      });
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.savePurchaseBoxInfo(params);
    },
    // 装箱信息合计
    getComputed(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '-';
          return;
        }
        if (index === 5) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        data.forEach(item => {
          item.amount = item.amountPerBox * item.boxAmount || 0;
        });
        const values = data.map(item =>
          Number(item[column.property])
        );
        console.log(values);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          if (index !== 0) {
            sums[index] = '-';
          }
        }
      });
      sums.forEach((item, i) => {
        if (item >= 0) {
          sums[i] = Math.round(item * 1000) / 1000;
        }
      });
      console.log(sums);
      return sums;
    },
    // 合计
    getSummaries(param) {
      // console.log(param);
      const { columns, data } = param;
      const sums = [];
      let arr = [];
      data.forEach(item => {
        if (item.purchaseBoxInfoList && item.purchaseBoxInfoList.length) {
          item.purchaseBoxInfoList.forEach(item => {
            arr.push(item);
          });
        }
      });
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 5) {
          sums[index] = '';
          return;
        }
        if (index === 6) {
          sums[index] = '';
          return;
        }
        if (index === 10) {
          sums[index] = '';
          return;
        }
        const values = arr.map(item =>
          Number(item[column.property])
        );

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += '';
        } else {
          if (index !== 0) {
            sums[index] = '';
          }
        }
        sums[12] = '';
      });
      sums.forEach((item, i) => {
        if (item >= 0) {
          sums[i] = Math.round(item * 1000) / 1000;
        }
      });
      console.log('sums', sums);
      return sums;
    },
    // 点击删除按钮
    deleteBtn(row) {
      this.$confirm(`关闭后活动将失效！`, `您确认要关闭吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteUpdateState(row);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消!`
          });
        });
    },
    // 点击作废按钮
    discardBtn(row) {
      this.$confirm(
        `确认后相关数据将一并被作废。`,
        `您确认要作废吗?`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.discardUpdateState(row);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消!`
          });
        });
    },
    // 入库通知
    warehouseNameNotice(row) {
      this.$confirm(`确认后将通知仓库。`, `您确认要通知仓库吗?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.warahouseAdvice(row);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: `已取消!`
            });
          });
    },
    // 点击整行
    tableRowClick(row) {
       // 获取明细分页入参
      this.detailParams.eventCode = row.eventCode;
      this.tableRowDetail.remark = row.remark;
      // 获取明细分页数据
      this.detailParams.start = 0;
      this.detailParams.pageNo = 1;
      this.getTableDetailList();
      this.operateParams.entityId = row.eventCode;
      this.getLogInfo();
    },
    // 跳转新增页面
    toAddOrEdit(eventCode) {
      if (eventCode === 'add') {
        this.$router.push({path: '/stocksetting/freezeaddoreidt/' + eventCode, query: {isadd: 1}});
      } else {
        this.$router.push({path: '/stocksetting/freezeaddoreidt/' + eventCode, query: {isadd: 0}});
      }
    },
    // 删除按钮
    deleteListBtn(index, i) {
      this.$confirm(``, `您确认要删除吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
          this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[index].purchaseBoxInfoList.splice(i, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消!`
          });
        });
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
        new Date(this.searchParams.startTime).getTime() >
        new Date(this.searchParams.endTime).getTime()
      ) {
        this.$message({
          message: '开始时间不得大于结束时间',
          type: 'warning'
        });
        return;
      }
      if (
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$message({
          message: '创建开始日期不得大于创建结束日期',
          type: 'warning'
        });
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
        eventCode: '', // 活动编号
        eventName: '', // 活动名称
        skuCode: '', // sku编号
        barCode: '', // 条形码
        status: '', // 状态
        startTime: '', // 活动开始日期
        endTime: '', // 活动结束日期
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
    },
    // 类型翻译
    checkedType(type) {
      let typeStr = '';
      if (type === '1') {
        typeStr = '其他入库';
      } else if (type === '2') {
        typeStr = '其他出库';
      }
      return typeStr;
    },
    // 单据状态翻译
    checkedStatus(status) {
      let statusStr = '';
      if (status === 1) {
        statusStr = '暂存';
      } else if (status === 2) {
        statusStr = '提交审核';
      } else if (status === 3) {
        statusStr = '审核通过';
      } else if (status === 4) {
        statusStr = '审核驳回';
      } else if (status === 5) {
        statusStr = '通知仓库';
      } else if (status === 6) {
        statusStr = '作废';
      }
      return statusStr;
    },
    // 出库状态翻译
    checkedOutInStatus(outInType, status) {
      let statusStr = '-';
      if (outInType === '1') {
        if (status === 1) {
          statusStr = '等待入库';
        } else if (status === 2) {
          statusStr = '入库完成';
        } else if (status === 3) {
          statusStr = '入库异常';
        }
      } else if (outInType === '2') {
        if (status === 1) {
          statusStr = '等待出库';
        } else if (status === 2) {
          statusStr = '出库完成';
        } else if (status === 3) {
          statusStr = '出库异常';
        }
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
  .paging
    margin-top: 15px
    text-align: right
  .title
    width: 150px
    text-align: right
    width: 30%
    text-align right
    vertical-align top
    display: inline-block
  .content
    width: 69%
    height: 47px
    display: inline-block
    overflow-y: auto
  .btn
    color: blue
    cursor: pointer
</style>
