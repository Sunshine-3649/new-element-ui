<template>
  <div class="otherwarehouseout">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="其他出库单编号：" size="mini">
            <el-input v-model.trim="searchParams.outInNoticeCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="其他出入单编号：" size="mini">
            <el-input v-model.trim="searchParams.outInCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库仓库：" size="mini">
            <el-select v-model="searchParams.warehouseCode" filterable placeholder="请选择">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库单状态：" size="mini">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="出库单创建时间：" size="mini">
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
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-col class='paging'>
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-col>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" ref="multipleTable" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="其他出库通知单编号" prop="outInNoticeCode" align="center" width='150'></el-table-column>
      <el-table-column label="其他出入单编号" prop="outInCode" align="center" width='150'></el-table-column>
      <el-table-column label="出库仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="出库原因" prop="outInCause" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="出库单联系人" prop="outInContact" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.status === 3" class="item" effect="dark" :content="scope.row.failedCause" placement="top">
            <div style="color: red">{{checkedStatusList(scope.row.status)}}</div>
          </el-tooltip>
          <el-tooltip v-else-if="scope.row.status === 5" class="item" effect="dark" :content="scope.row.failedCause" placement="top">
            <div style="color: purple">{{checkedStatusList(scope.row.status)}}</div>
          </el-tooltip>
          <div v-else>{{checkedStatusList(scope.row.status)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="出库单创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 3" @click="noticGood(scope.row)">通知出库</el-button>
          <el-button size="mini" type="text" v-else-if="scope.row.status === 2" @click="cancleDeliver(scope.row.outInNoticeCode)">取消出库</el-button>
          <el-button size="mini" type="text" v-else-if="scope.row.status === 6 && scope.row.isAllowNotice === '1'" @click="againDeliver(scope.row)">重新出库</el-button>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width='150' show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inventoryType" label="库存类型" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{checkStockType(scope.row.inventoryType)}}
            </template>
          </el-table-column>
          <el-table-column prop="planOutInNum" label="计划出库数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realOutInNum" label="实际出库数量" align="center" width='140'></el-table-column>
          <el-table-column prop="outInStatus" label="出库状态" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" :content="scope.row.failedCause" placement="top"> -->
              <div v-if="scope.row.outInStatus === 5" style="color: orange">{{checkedStatusList(scope.row.outInStatus)}}</div>
              <!-- </el-tooltip> -->
              <div v-else>{{checkedStatusDetail(scope.row.outInStatus)}}</div>
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
            <div class="title">其他出库原因：</div>
            <div class="content">{{tableRowDetail.outInCause}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">备注：</div>
            <div class="content">{{tableRowDetail.remark}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
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
        <el-table :data="logInfoList" style="width: 100%">
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
        <!-- <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col> -->
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="取消出库" :visible.sync="dialogVisible" width="30%">
      <h2 style='line-height: 30px'>您确认要取消出库吗？</h2>
      <p class="tip_red" style='line-height: 30px'>请输入取消原因：</p>
      <div>
        <el-input type="textarea" :rows="4" placeholder="" v-model="textarea" size="mini">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeSureCancle" size="mini">确定取消</el-button>
        <el-button @click="dialogVisible = false" size="mini">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'otherwarehouseout',
  data() {
    return {
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        start: 0,
        pageNo: 1,
        pageSize: 10,
        detailPageflag: true,
        outInNoticeCode: ''
      },
      fileDataList: [], // 上传文件列表
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'OtherOutInNotice',
        entityId: ''
      }, // 日志
      isRefresh: 0, // 是否刷新数据
      tableData: [],
      activeName: '1', // 当前选中的选项卡
      arr: [], // 数组列表
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
      tableRowDetail: {}, // 详情
      tableRowList: [], // 详情明细
      totalCount: 0, // 列表条数
      dialogVisible: false, // 取消弹窗
      textarea: '', // 取消弹窗输入框
      isLogInfo: false, // 日志弹窗
      warehouseList: [
        {
          warehouseName: '全部',
          code: ''
        }
      ], // 仓库列表
      warehouseNoticeStatusList: [
        {
          name: '全部',
          code: ''
        }
      ], // 入库通知单状态列表
      statusList: [
        {
          name: '全部',
          value: ''
        }
      ], // 采购类型列表
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      warehouseNoticeCode: '', // 保存的出库通知单编号
      searchParams: {
        outInNoticeCode: '', // 其他出库单编号：
        outInCode: '', // 其他出出单编号
        warehouseCode: '', // 出库仓库
        status: this.$route.query.status || '', // 出库单状态
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, //
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      } // 请求参数
    };
  },
  created() {
    this.initDataList();
    this.getPurchaseType();  // 仓库列表
    this.statusList = [...this.statusList, ...this.$utils.querydiction('otherOutNoticeStatus')];
    console.log(this.statusList);
  },
  methods: {
    // 仓库列表
    getPurchaseType() {
      this.$AXIOS.GET('/purchaseOutboundOrder/getWarehouse').then(res => {
        this.warehouseList = [...this.warehouseList, ...res.result];
      });
    },
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
    uploadFile(fileName) {
      this.$AXIOS.GET('/qinniu/fileDownload', { fileName }).then(res => {
        console.log(res.result);
        // top.window.location.href = res.result;
         window.open(res.result);
      });
    },
    // 获取上传列表数据
    getUploadDataList(code) {
      this.$AXIOS.GET('/qinniu/uploadFile', { code }).then(res => {
        this.fileDataList = res.result || [];
      });
    },
    // 获取入库通知单管理数据列表
    initDataList() {
      this.tableRowList = []; // 明细列表
      this.tableRowDetail = {}; // 其他信息
      this.logInfoList = []; // 日志信息
      this.logCount = 0; // 日志条数
      this.$AXIOS
        .LISTGET('/otherOutInNotice/otherOutNoticePage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              this.tableRowDetail = this.tableDataList[0];
              this.detailParams.outInNoticeCode = this.tableDataList[0].outInNoticeCode;
              // this.getWarehouseNoticeDetail(this.tableDataList[0].id);
              // this.getWarehouseNoticeInfo(this.tableDataList[0].outInNoticeCode);
              // this.getUploadDataList(this.tableDataList[0].purchaseOrderCode);
              this.operateParams.entityId = this.tableDataList[0].outInNoticeCode;
              this.getLogInfo();
              // 获取明细分页数据
              this.detailParams.start = 0;
              this.detailParams.pageNo = 1;
              this.getTableDetailList();
            }, 20);
          }
        });
    },
    // 获取入库通知单管理数据列表
    getWarehouseNoticeStatus() {
      this.$AXIOS.GET('/select/warehouseNoticeStatus').then(res => {
        const result = res.result;
        result.forEach(item => {
          if (item.code !== '6') {
            this.warehouseNoticeStatusList.push(item);
          }
        });
      });
    },
    // 通知收货接口
    putReceiptAdviceInfo(row) {
      this.$AXIOS
        .PUT('/otherOutInNotice/otherOutNotice/' + row.outInNoticeCode)
        .then(res => {
          if (res.appcode === '1') {
            this.initDataList();
            this.$utils.messagetip.successTip(res.databuffer);
          }
        });
    },
    // 取消/重新发货接口
    cancelGoods(params) {
      this.$AXIOS.PUT('/otherOutInNotice/otherOutNoticeCancel/' + params.outInNoticeCode, params).then(res => {
        if (res.appcode === '1') {
          this.dialogVisible = false;
          this.initDataList();
          this.$utils.messagetip.successTip(res.databuffer);
        }
      });
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    // 获取入库通知单管理数据详情
    getWarehouseNoticeInfo(outInNoticeCode) {
      this.$AXIOS
        .GET('/otherOutInNotice/otherOutNotice/' + outInNoticeCode)
        .then(res => {
          console.log(res);
          this.tableRowDetail = res.result;
          // this.tableRowList = this.tableRowDetail.outInNoticeDetailList || [];
          // 获取明细分页数据
          // this.detailParams.start = 0;
          // this.detailParams.pageNo = 1;
          // this.getTableDetailList();
        });
    },
    // 获取采购单明细数据详情
    getTableDetailList() {
      this.$AXIOS.LISTGET('/otherOutInNotice/otherOutNoticePage', this.detailParams).then(res => {
        console.log('res: ', res);
        this.tableRowList = res.result;
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
    // 获取入库通知单管理数据列表
    getWarehouseNoticeDetail(warehouseNotice) {
      let params = {
        start: 0,
        pageIndex: 0,
        warehouseNotice
      };
      console.log('object');
      this.$AXIOS
        .LISTGET('/warehouseNotice/warehouseNoticeDetail', params)
        .then(res => {
          console.log(res);
          this.tableRowList = res;
        });
    },
    // 取消发货
    cancleDeliver(outInNoticeCode) {
      this.dialogVisible = true;
      this.textarea = '';
      this.outInNoticeCode = outInNoticeCode;
    },
    makeSureCancle() {
      if (!this.textarea) {
        this.$utils.messagetip.warningTip('请输入取消原因');
        return;
      }
      let params = {
        outInNoticeCode: this.outInNoticeCode,
        remark: this.textarea
      };
      this.cancelGoods(params);
    },
    // 重新发货
    againDeliver(row) {
      this.$confirm(`确认后将通知仓库重新出库。`, `您确认要重新出库吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putReceiptAdviceInfo(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击通知发货
    noticGood(row) {
      this.$confirm(`确认后将向仓库发送出库通知单。`, `您确认要通知出库吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putReceiptAdviceInfo(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击整行
    tableRowClick(row) {
      this.tableRowDetail = row;
       // 获取明细分页入参
      this.detailParams.outInNoticeCode = row.outInNoticeCode;
      // this.getWarehouseNoticeInfo(row.outInNoticeCode);
      // this.getWarehouseNoticeDetail(row.id);
      // this.getUploadDataList(row.purchaseOrderCode);
      // this.getBoxInfo(row.purchaseOrderCode);
      this.operateParams.entityId = row.outInNoticeCode;
      this.getLogInfo();
      // 获取明细分页数据
      this.detailParams.start = 0;
      this.detailParams.pageNo = 1;
      this.getTableDetailList();
    },
    // 跳转采购单详情页面
    toPurchaseDetail(id, flag, status) {
      this.$router.push(
        {
          path: '/warenoticordermanage/warenoticorderdetail/' + id,
          query: {
            flag,
            isAuditStatus: status
          }
        }
      );
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
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        outInNoticeCode: '', // 入库通知单编码
        purchaseOrderCode: '', // 采购订单编码
        warehouseNoticeStatus: '', // 入库通知单状态
        purchaseType: '', // 采购类型
        supplierName: '', // 供应商名称
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, //
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
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
      this.searchParams.pageNo = val;
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.initDataList();
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
    // 操作日志弹窗关闭
    closeOperate() {
      this.isLogInfo = false;
    },
    // 状态翻译
    checkedStatusList(status) {
      return this.$utils.querydiction('otherOutNoticeStatus', status);
    },
    // 状态翻译
    checkedStatusDetail(status) {
      return this.$utils.querydiction('otherOutNoticeStatus', status);
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
    // 合计
    getSummaries(param) {
      console.log(param);
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
        const values = arr.map(item => Number(item[column.property]));
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

      return sums;
    }
  }
};
</script>
<style lang="stylus" scoped>
.otherwarehouseout
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
  .isPurple
    color: purple
  .isRed
    color: red
  .isBlue
    color: blue
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
</style>
