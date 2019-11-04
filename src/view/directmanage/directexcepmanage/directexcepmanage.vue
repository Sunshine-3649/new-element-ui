<template>
  <div class="directexcepmanage" v-loading.fullscreen='isClick' element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="拆单异常单编号：" size="mini">
            <el-input v-model.trim="searchParams.exceptionOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统订单号：" size="mini">
            <el-input v-model.trim="searchParams.scmShopOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售渠道订单号：" size="mini">
            <el-input v-model.trim="searchParams.shopOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人：" size="mini">
            <el-input v-model.trim="searchParams.receiverName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="异常类型：" size="mini">
            <el-select v-model="searchParams.exceptionType" filterable placeholder="请选择">
              <el-option v-for="item in exceptionList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：" size="mini">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生成日期：" size="mini">
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
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
            <!-- <el-button type="default" icon="circle-cross" @click="ceshiClick">测试</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button size="mini" type="primary" :disabled="multipleSelection && multipleSelection.length < 1" @click="disposeAll">批量处理</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="checkSelectable"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="拆单异常单编号" prop="exceptionOrderCode" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="系统订单号" prop="scmShopOrderCode" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售渠道订单号" prop="shopOrderCode" align="center" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售渠道" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="店铺名称" prop="shopName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="异常类型" prop="exceptionType" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.exceptionType === 1">缺货退回</div>
          <div v-if="scope.row.exceptionType === 2">缺货等待</div>
        </template>
      </el-table-column>
      <el-table-column label="异常商品总数量" prop="itemNum" align="center" width='120' show-overflow-tooltip></el-table-column>
      <el-table-column label="收货人" prop="receiverName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="收货人联系方式" prop="receiverMobile" align="center" width='120'></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 10">待了结</div>
          <div v-if="scope.row.status === 11">已了结</div>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" prop="createTime" align="center" width='140'></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 10" size="mini" type="text" @click="dispose(scope.row)">处理</el-button>
          <el-button v-else size="mini" type="text" >-</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="异常商品" name="1" style="background: #ccc;">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn" @click="searchTableDetail(scope.row)">{{scope.row.skuCode}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemType" label="商品类型" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.itemType === 1">自采</div>
              <div v-if="scope.row.itemType === 2">代发</div>
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="发货仓库/供应商" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.supplierName">{{scope.row.supplierName}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="exceptionReason" label="异常原因" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemNum" label="应发货数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="exceptionNum" label="异常数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.status === 10">待了结</div>
              <div v-if="scope.row.status === 11">已了结</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="2">
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
        <!-- <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col> -->
      </el-tab-pane>
    </el-tabs>
    <!-- 处理弹窗 -->
    <el-dialog title=" 拆单异常处理" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
      已选异常单：
      <el-table :data="exceptTableList" ref="multipleTable2" highlight-current-row border tooltip-effect="dark" :height='386' >
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="拆单异常单编号" prop="exceptionOrderCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道订单号" prop="shopOrderCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售渠道" prop="sellName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="异常商品总数量" prop="itemNum" align="center" width='120' show-overflow-tooltip></el-table-column>
        <el-table-column label="收货人" prop="receiverName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="description" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if='exceptTableList && exceptTableList.length > 1' class="btn" @click="deleteList(scope.$index)">删除</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 100px">
        <el-button size="mini" type="primary" :disabled="isClick" @click='finish'>了结</el-button>
        <el-button size="mini" type="primary" :disabled="isClick" @click='refresh'>重试</el-button>
        <el-button size="mini" @click="cancelModel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleDetail" :visible.sync="isTitleDetail">
      <el-row>
        <el-col :span="24" style="line-height: 40px; ">
          <span>SKU名称：</span><span style="color: #999">{{titleTableRowDetail.itemName}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="line-height: 40px; ">
           <span>异常数量/应发货数量：</span><span style="color: #999">{{titleTableRowDetail.exceptionNum}}/{{titleTableRowDetail.itemNum}}</span>
        </el-col>
      </el-row>
      <el-table :data="titleTableDetail" border highlight-current-row tooltip-effect="dark" style="margin-top: 20px;">
        <el-table-column property="warehouseName" label="仓库名称" align="center"></el-table-column>
        <el-table-column property="availableInventory" label="正品可用库存" align="center"></el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="mini" @click="isTitleDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'directexcepmanage',
  data() {
    return {
      titleDetail: '', // 标题
      isTitleDetail: false, // 库存详情弹窗
      titleTableDetail: [], // 库存表格
      titleTableRowDetail: {}, // 点击行的对象
      isClick: false, // 点击事件
      dialogTableVisible: false, // 弹窗
      activeName: '1', // 默认选中的tab
      isShow: false, // 点击显示
      tableDataList: [], // 列表
      tableRowList: [], // 列表详情
      multipleSelection: [], // 多选框选中的列表
      exceptTableList: [], // 弹窗异常订单
      searchParams: {
        exceptionOrderCode: '', // 拆单异常编号
        scmShopOrderCode: '', // 系统订单号
        shopOrderCode: '', // 销售渠道订单号
        exceptionType: '', // 异常类型
        status: '10', // 状态
        receiverName: '', // 收货人
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0, // 总页码
      logInfoList: [],
      logCount: 0,
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'ExceptionOrder',
        entityId: ''
      }, // 日志
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
      exceptionList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '缺货退回'
        },
        {
          id: '2',
          name: '缺货等待'
        }
      ],
      statusList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '10',
          name: '待了结'
        },
        {
          id: '11',
          name: '已了结'
        }
      ]
    };
  },
  created() {
    // v3.5.2去掉默认时间条件
    // let lastDay = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000);
    // let month = (lastDay.getMonth() * 1 + 1).toString().length > 1 ? (lastDay.getMonth() * 1 + 1) : ('0' + (lastDay.getMonth() * 1 + 1));
    // let currDay = new Date();
    // let currmonth = (currDay.getMonth() * 1 + 1).toString().length > 1 ? (currDay.getMonth() * 1 + 1) : ('0' + (currDay.getMonth() * 1 + 1));
    // this.searchParams.startDate = lastDay.getFullYear() + '-' + month + '-' + lastDay.getDate();
    // this.searchParams.endDate = currDay.getFullYear() + '-' + currmonth + '-' + currDay.getDate();
    this.initDataList();
  },
  methods: {
    searchTableDetail(row) {
      this.titleTableRowDetail = row;
      this.titleDetail = `商品【${row.skuCode}】库存情况`;
      this.isTitleDetail = true;
      this.getTableDetail(row.skuCode);
    },
    getTableDetail(skuCode) {
      this.$AXIOS.GET('goods/getRequestSkuStocks', {skuCode}).then(res => {
        this.titleTableDetail = res.result;
      });
    },
    checkSelectable(row, index) {
      let isSeletc = true;
      if (row.status === 11) {
        isSeletc = false;
      }
      return isSeletc;
    },
    // 了结按钮
    finish() {
      let params = {};
      let arr = [];
      console.log(this.exceptTableList);
      this.exceptTableList.forEach(item => {
        arr.push(item.exceptionOrderCode);
      });
      params.exceptionOrderCodes = arr.join();
      this.$confirm('确认后将已选异常单中的所有SKU状态置为“已了结”。', '您确定了结吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.isClick = true;
          this.putExceptionOrder(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 重试按钮
    refresh() {
      let params = {};
      let arr = [];
      console.log(this.exceptTableList);
      this.exceptTableList.forEach(item => {
        arr.push(item.exceptionOrderCode);
      });
      params.exceptionOrderCodes = arr.join();
      this.$confirm('', '您确定要重试吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.isClick = true;
          this.postExceptionOrder(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 删除
    deleteList(i) {
      console.log(this.multipleSelection);
      let result = this.exceptTableList;
      result.splice(i, 1);
      this.exceptTableList = result;
    },
    cancelModel() {
      this.dialogTableVisible = false;
      this.initDataList();
    },
    // 处理
    dispose(row) {
      this.exceptTableList = [];
      this.exceptTableList.push(row);
      this.dialogTableVisible = true;
    },
    // 批量处理
    disposeAll() {
      let multipleSelection = this.multipleSelection;
      this.exceptTableList = [];
      this.exceptTableList = multipleSelection;
      this.dialogTableVisible = true;
    },
    // 点击整行
    tableRowClick(row) {
      let exceptionOrderCode = row.exceptionOrderCode;
      this.getWarehouseNoticeDetail(exceptionOrderCode);
      this.operateParams.entityId = row.id;
      this.getLogInfo();
    }, // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
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
    // 了结接口
    putExceptionOrder(params) {
      this.$AXIOS.PUT('/order/exceptionOrder', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        // this.initDataList();
      }).finally(() => {
        this.dialogTableVisible = false;
        this.isClick = false;
        this.initDataList();
      });
    },
    // 重试接口
    postExceptionOrder(params) {
      this.$AXIOS.POST('/order/exceptionOrder', params).then(res => {
        setTimeout(() => {
          this.getExceptionOrderStatus(params.exceptionOrderCodes);
        }, 3000);
      });
    },
    // 判断重试返回状态
    getExceptionOrderStatus(exceptionOrderCodes) {
      this.$AXIOS.GET('/order/exceptionOrder/' + exceptionOrderCodes).then(res => {
        console.log(res);
        if (res.result === '0') {
          this.$utils.messagetip.successTip('操作成功！');
          this.dialogTableVisible = false;
          this.isClick = false;
        } else {
          setTimeout(() => {
            this.getExceptionOrderStatus2(exceptionOrderCodes);
          }, 3000);
        }
        // this.initDataList();
      }).finally(() => {
        // this.dialogTableVisible = false;
        // this.isClick = false;
        this.initDataList();
      });
    },
    // 第二次查询状态
    getExceptionOrderStatus2(exceptionOrderCodes) {
      this.$AXIOS.GET('/order/exceptionOrder/' + exceptionOrderCodes).then(res => {
        if (res.result === '0') {
          this.$utils.messagetip.successTip('操作成功！');
        } else {
          this.$utils.messagetip.successTip('数据重试处理中，请稍后刷新查询！');
        }
      }).finally(() => {
        this.dialogTableVisible = false;
        this.isClick = false;
        this.initDataList();
      });
},
    // 获明细数据列表
    getWarehouseNoticeDetail(exceptionOrderCode) {
      this.$AXIOS.LISTGET('/order/exceptionOrder/exceptionOrderCode/' + exceptionOrderCode).then(res => {
        this.tableRowList = res.result.exceptionOrderItemList;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    close() {
      this.isShow = false;
    },
    ceshiClick() {
      this.isShow = true;
    },
    // 获取审核列表数据
    initDataList() {
      this.$AXIOS.LISTGET('/order/exceptionOrderPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.tableRowClick(this.tableDataList[0]);
          }, 20);
        } else {
          this.tableRowList = [];
          this.logInfoList = [];
        }
      });
    },
    // 筛选条件
    searchFormData() {
      if (new Date(this.searchParams.startDate).getTime() - 28800000 > new Date(this.searchParams.endDate).getTime()) {
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
        exceptionOrderCode: '', // 拆单异常编号
        scmShopOrderCode: '', // 系统订单号
        shopOrderCode: '', // 销售渠道订单号
        exceptionType: '', // 异常类型
        status: '', // 状态
        receiverName: '', // 收货人
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
.directexcepmanage
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
  .btn
    cursor: pointer
    color: blue
</style>
<style lang="stylus">
.directexcepmanage
  .el-dialog__body
    padding 0px 20px 30px 20px !important
</style>
