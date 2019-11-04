
<template>
  <div class="othermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="其他出入单编号：" size="mini">
            <el-input v-model.trim="searchParams.outInCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态：" size="mini">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option v-for="item in purchaseOrderCodeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库名称：" size="mini">
            <el-select v-model="searchParams.warehouseCode" filterable placeholder="请选择">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
        <el-col :span="6">
          <el-form-item label="出入库类型：" size="mini">
            <el-select v-model="searchParams.outInType" filterable placeholder="请选择" @change='outInTypeChange'>
              <el-option v-for="item in outInTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库/出库状态：" size="mini">
            <el-select v-model="searchParams.outInStatus" filterable placeholder="请选择" :disabled="!searchParams.outInType">
              <el-option v-for="item in outInStatusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增其他出入单</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="其他出入单编号" prop="outInCode" align="center" width="125" show-overflow-tooltip></el-table-column>
      <el-table-column label="出入单类型" prop="outInType" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{checkedType(scope.row.outInType)}}
        </template>
      </el-table-column>
      <el-table-column label="仓库名称" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="入库/出库原因" prop="outInCause" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据状态" prop="status" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.status === 4" style="color: orange">{{checkedStatus(scope.row.status)}}</div>
          <div v-else>{{checkedStatus(scope.row.status)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库/出库状态" prop="outInStatus" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.outInStatus === 3" style="color: orange">{{checkedOutInStatus(scope.row.outInType, scope.row.outInStatus)}}</div>
          <div v-else>{{checkedOutInStatus(scope.row.outInType, scope.row.outInStatus)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="toAddOrEdit(scope.row.outInCode)">编辑</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="deleteBtn(scope.row)">删除</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === 3" @click="warehouseNameNotice(scope.row)">通知仓库</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === 3 || (scope.row.status === 5 && scope.row.isDiscardFlag === '1')" @click="discardBtn(scope.row)">作废</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status !== 1 &&  scope.row.status !== 3 && scope.row.status !== 4 && (scope.row.status !== 5  || scope.row.isDiscardFlag !== '1')" >-</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="outInOrderDetailList" style="width: 100%" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inventoryType" label="库存类型" align="center">
            <template slot-scope="scope">
              {{checkStockType(scope.row.inventoryType)}}
            </template>
          </el-table-column>
          <el-table-column prop="inPrice" label="入库单价（元）" v-if="outInType === '1'" align="center">
            <template slot-scope="scope" >
              <div v-if="scope.row.priceFlag === '0'">{{scope.row.inPrice}}</div>
              <div v-if="scope.row.priceFlag === '1'">等于仓内成本金额</div>
            </template>
          </el-table-column>
          <el-table-column prop="planOutInNum" :label="outInType === '1' ? '计划入库数量' : '计划出库数量'" align="center"></el-table-column>
          <el-table-column prop="realOutInNum" :label="outInType === '1' ? '实际入库数量' : '实际出库数量'" align="center"></el-table-column>
          <el-table-column prop="realTime" :label="outInType === '1' ? '实际入库时间' : '实际出库时间'" align="center"></el-table-column>
          <el-table-column prop="outInStatus" label="入库/出库状态" align="center" width='140'>
            <template slot-scope="scope">
              <div v-if="scope.row.outInStatus === 3" style="color: orange">{{checkedOutInStatus(scope.row.outInType, scope.row.outInStatus)}}</div>
              <div v-else>{{checkedOutInStatus(scope.row.outInType, scope.row.outInStatus)}}</div>
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
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">{{tableRowDetail.outInType === '1' ? '入库原因：' : '出库原因：'}}</div>
            <div class="content">{{tableRowDetail.outInCause}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">备注：</div>
            <div class="content">{{tableRowDetail.remark}}</div>
          </el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row v-if='tableRowDetail.outInType === "1"'>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件人：</div>
            <div class="content">{{tableRowDetail.sender}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方手机：</div>
            <div class="content">{{tableRowDetail.senderMobile}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方省份.城市.地区：</div>
            <div class="content">{{tableRowDetail.senderProvinceName}}.{{tableRowDetail.senderCityName}}.{{tableRowDetail.senderAreaName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方详细地址：</div>
            <div class="content">{{tableRowDetail.senderAddress}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row v-if='tableRowDetail.outInType === "2"'>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收件人：</div>
            <div class="content">{{tableRowDetail.receiver}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收件方手机：</div>
            <div class="content">{{tableRowDetail.receiverMobile}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收件方省份.城市.地区：</div>
            <div class="content">{{tableRowDetail.receiverProvinceName}}.{{tableRowDetail.receiverCityName}}.{{tableRowDetail.receiverAreaName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收件方详细地址：</div>
            <div class="content">{{tableRowDetail.receiverAddress}}</div>
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
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'othermanage',
  data() {
    return {
      outInOrderDetailList: [], // 明细列表
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        start: 0,
        pageNo: 1,
        pageSize: 10,
        detailPageflag: true,
        outInCode: ''
      },
      outInType: '1', // 默认类型为其他入库
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'OtherOutInOrder',
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
      warehouseList: [
        {
          warehouseName: '全部',
          code: ''
        }
      ], // 仓库列表
      outInTypeList: [
        {
          name: '全部',
          code: ''
        },
        {
          name: '其他入库',
          code: '1'
        },
        {
          name: '其他出库',
          code: '2'
        }
      ], // 出库类型列表
      outInStatusList: [], // 出库状态列表
      purchaseOrderCodeList: [
        {
          name: '全部',
          code: ''
        },
        {
          name: '暂存',
          value: '1'
        },
        {
          name: '提交审核',
          value: '2'
        },
        {
          name: '审核通过',
          value: '3'
        },
        {
          name: '审核驳回',
          value: '4'
        },
        {
          name: '通知仓库',
          value: '5'
        },
        {
          name: '作废',
          value: '6'
        }
      ], // 单据状态列表
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
        outInCode: '', // 其他出入单编号
        outInType: '', // 出入库类型
        warehouseCode: '', // 仓库名称
        status: '', // 单据状态
        outInStatus: '', // 入库/出库状态
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
    this.getPurchaseType();  // 仓库列表
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
    outInTypeChange(val) {
      this.outInStatusList = [];
      let arr1 = [
        {name: '全部', code: ''},
        {name: '等待入库', code: '1'},
        {name: '入库完成', code: '2'},
        {name: '入库异常', code: '3'}
      ];
      let arr2 = [
        {name: '全部', code: ''},
        {name: '等待出库', code: '1'},
        {name: '出库完成', code: '2'},
        {name: '出库异常', code: '3'}
      ];
      if (val === '1') {
        this.outInStatusList = arr1;
      } else if (val === '2') {
        this.outInStatusList = arr2;
      } else {
        this.outInStatusList = [];
      }
      this.searchParams.outInStatus = '';
    },
    // 获取采购单数据列表
    initDataList() {
      this.tableRowDetail = {};
      this.outInOrderDetailList = [];
      this.logInfoList = [];
      this.logCount = 0;
      this.$AXIOS
        .LISTGET('/OtherOutIn/page', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              // 获取明细分页数据
              this.detailParams.outInCode = this.tableDataList[0].outInCode;
              this.tableRowDetail = this.tableDataList[0];
              // 获取明细分页数据
              this.detailParams.start = 0;
              this.detailParams.pageNo = 1;
              this.getTableDetailList();
              // this.getWarehouseNoticeDetail(this.tableDataList[0].id);
              // this.getWarehouseNoticeInfo(this.tableDataList[0].outInCode);
              this.outInType = this.tableDataList[0].outInType || '1';
              // this.getUploadDataList(this.tableDataList[0].purchaseOrderCode);
              this.code = this.tableDataList[0].purchaseOrderCode;
              // this.getBoxInfo(this.tableDataList[0].purchaseOrderCode);
              this.operateParams.entityId = this.tableDataList[0].id;
              this.getLogInfo();
            }, 20);
          } else {
            this.tableRowList = [];
            this.tableRowDetail = {};
            this.boxInfoDetail = [];
            this.logInfoList = [];
            this.logCount = 0;
          }
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
    getWarehouseNoticeInfo(outInCode) {
      this.$AXIOS.GET('/OtherOutIn/query_detail/' + outInCode).then(res => {
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
      this.$AXIOS.LISTGET('/OtherOutIn/page', this.detailParams).then(res => {
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
    // 仓库列表
    getPurchaseType() {
      this.$AXIOS.GET('/purchaseOutboundOrder/getWarehouse').then(res => {
        this.warehouseList = [...this.warehouseList, ...res.result];
      });
    },
    // 删除接口
    deleteUpdateState(row) {
      this.$AXIOS
        .PUT('/OtherOutIn/delete/' + row.outInCode)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 作废接口
    discardUpdateState(row) {
      this.$AXIOS
        .PUT('/OtherOutIn/drop_order/' + row.outInCode)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 入库通知接口
    warahouseAdvice(row) {
      this.$AXIOS
        .PUT('/OtherOutIn/notice_warehouse/' + row.outInCode)
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
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 装箱信息保存接口
    finishPurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/finish', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
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
        this.$utils.messagetip.warningTip('装箱方式不能为空！');
        return;
      }
      if (skuList && skuList.length) {
        this.$utils.messagetip.warningTip(`sku编号为${skuList}的装箱信息不能为空！`);
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
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量不能为空！`);
        return;
      }
      if (isAmountPerBoxInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量只能为正整数！`);
        return;
      }
      if (isBoxNumber) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱号不能为空！`);
        return;
      }
      if (isBoxAmount) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数不能为空！`);
        return;
      }
      if (isBoxAmountInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数只能为正整数！`);
        return;
      }
      if (isGrossWeight) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重不能为空！`);
        return;
      }
      if (isGrossWeightFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重格式不正确！`);
        return;
      }
      if (isCartonSize) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸不能为空！`);
        return;
      }
      if (isCartonSizeSpec) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸只能包含*和数字！`);
        return;
      }
      if (isVolume) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积不能为空！`);
        return;
      }
      if (isVolumeFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积格式不正确！`);
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
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量必须等于采购数量！`);
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
          this.$utils.messagetip.infoTip('已取消');
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
            this.$utils.messagetip.infoTip('已取消');
          });
    },
    // 点击整行
    tableRowClick(row) {
       // 获取明细分页入参
      this.detailParams.outInCode = row.outInCode;

      this.outInType = row.outInType || '1';
      this.tableRowDetail = row;
      // this.getWarehouseNoticeInfo(row.outInCode);
      // 获取明细分页数据
      this.detailParams.start = 0;
      this.detailParams.pageNo = 1;
      this.getTableDetailList();
      // this.getWarehouseNoticeDetail(row.id);
      // this.getUploadDataList(row.purchaseOrderCode);
      // this.code = row.purchaseOrderCode;
      // this.getBoxInfo(row.purchaseOrderCode);
      this.operateParams.entityId = row.id;
      this.getLogInfo();
    },
    // 跳转新增页面
    toAddOrEdit(outInCode) {
      if (outInCode === 'add') {
        this.$router.push({path: '/othermanage/otheraddoredit/' + outInCode, query: {isadd: 1}});
      } else {
        this.$router.push({path: '/othermanage/otheraddoredit/' + outInCode, query: {isadd: 0}});
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
          this.$utils.messagetip.successTip('删除成功!');
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
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
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
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
        outInCode: '', // 其他出入单编号
        outInType: '', // 出入库类型
        warehouseCode: '', // 仓库名称
        status: '', // 单据状态
        outInStatus: '', // 入库/出库状态
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
.othermanage
  .item
    line-height: 50px
    font-size: 25px
    text-align: center
  .table_title
    width: 15%
    background: rgb(228, 228, 228)
  .table_content
    width: 35%
  .title, .content
    display: inline-block
    line-height 23px
  .title
    width: 150px
    text-align: right
    width: 30%
    text-align right
    vertical-align top
  .content
    width: 69%
    height: 47px
    overflow-y: auto
  .group_btn
    text-align: center
  .paging
    margin-top: 15px
    text-align: right
  .table
    padding: 0 20px
    background: #fff
    .table_menu
      display: flex
      justify-content: space-around
      line-height: 40px
      font-size: 12px
      border: solid 1px #cccccc
      border-bottom: none
      text-align: center
      li
        flex: 1
      li.name
        width: 270px
        flex: 0 0 270px
  .border
    width: 100%
    line-height: 33px
    height: 33px
    text-align: center
    border-bottom: solid 1px #f5f7fa
  .bordernone:last-child
    border: none
  .btn
    color: blue
    cursor: pointer
  .line
    width: 100%
    height: 1px
    background: #000
    margin-top: 50px
  .tip
    width: 200px
    line-height: 30px
    text-align: center
    display: inline-block
    font-weight: 900
    position: relative
    top: -30px
    left: 30px
    background: rgb(255, 255, 255)
</style>
<style lang='stylus'>
.purchaseordermanage
  .el-dialog
    width 400px !important
  .el-dialog__body
    padding: 10px 20px
  .price_list
    border: solid 1px #ccc;
    border-top: none;
    tr
      th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(5), th:nth-child(6), th:nth-child(7)
        div::before
          content: '*'
          padding-right: 5px
          color: #ff0000
</style>
