<template>
  <div class="returnreceipt">
    <div class="returnreceipt_form" v-show="!isListShow">
      <!-- 表单 -->
      <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="创建时间：" size="mini">
              <el-col :span="11">
                <el-form-item size="mini">
                  <el-date-picker v-model="searchParams.createTimeStart" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item size="mini">
                  <el-date-picker v-model="searchParams.createTimeEnd" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库单编号：" size="mini">
              <el-input v-model.trim="searchParams.warehouseNoticeCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后单编号：" size="mini">
              <el-input v-model.trim="searchParams.afterSaleCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统订单号：" size="mini">
              <el-input v-model.trim="searchParams.scmShopOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="入库仓库：" size="mini">
              <el-select v-model="searchParams.warehouseCode" filterable>
                <el-option v-for="item in warehouseCodeList" :key="item.code" :label="item.warehouseName" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人：" size="mini">
              <el-input v-model.trim="searchParams.operator" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售渠道订单号：" size="mini">
              <el-input v-model.trim="searchParams.shopOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button type="primary" icon="search" @click="searchFormData">搜索</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分页 -->
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button size="mini" type="primary" @click="printDataBtn" :disabled="!multipleSelection.length">打印</el-button>
        </el-col>
        <el-col class='paging'>
          <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="未入库" name="2"></el-tab-pane>
        <!-- <el-tab-pane label="已到货待理货" name="3"></el-tab-pane> -->
        <el-tab-pane label="入库完成" name="4"></el-tab-pane>
        <el-tab-pane label="通知仓库失败" name="7"></el-tab-pane>
        <el-tab-pane label="已关闭" name="5"></el-tab-pane>
      </el-tabs>
      <!-- 表格tableData -->
      <el-table ref="multipleTable" :data="tableDataList" @selection-change="handleSelectionChange" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark" :height="currentHeight">
        <el-table-column type="selection" width="55" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="入库单编号" prop="warehouseNoticeCode" align="center" width="160"></el-table-column>
        <el-table-column label="系统订单号" prop="scmShopOrderCode" align="center" width="180"></el-table-column>
        <el-table-column label="销售渠道订单号" prop="shopOrderCode" align="center" width="160"></el-table-column>
        <el-table-column label="入库仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品行数" prop="skuNum" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="正品入库总量" prop="inNum" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.inNum || scope.row.inNum === '0' || scope.row.inNum === 0">{{scope.row.inNum}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="残品入库总量" prop="defectiveInNum" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.defectiveInNum || scope.row.defectiveInNum === '0' || scope.row.defectiveInNum === 0">{{scope.row.defectiveInNum}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="总入库数量" prop="totalInNum" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.totalInNum || scope.row.totalInNum === '0' || scope.row.totalInNum === 0">{{scope.row.totalInNum}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" prop="logisticsCorporation" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.logisticsCorporation">{{scope.row.logisticsCorporation}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" prop="waybillNumber" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.waybillNumber">{{scope.row.waybillNumber}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status == 5" class="item" effect="dark" :content="scope.row.failureCause ? scope.row.failureCause : '暂无原因'" placement="top">
                <span style="color:red; cursor:pointer;">{{checkedStatus(scope.row.status)}}</span>
            </el-tooltip>
            <span v-else>
                <span>{{checkedStatus(scope.row.status)}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width='130'>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | filter-time}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 选项卡 -->
      <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
        <el-tab-pane label="商品明细" name="1">
          <el-table :data="tableRowDetail.warehouseNoticeDetailList" show-summary :summary-method="getSummaries" style="width: 100%" border>
            <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
            <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="btn" @click="toGoodDetail(scope.row)">{{scope.row.skuName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="SKU编号" prop="skuCode" align="center" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" prop="specNatureInfo" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="拟退货数量" prop="returnNum" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.returnNum || scope.row.returnNum === '0' || scope.row.returnNum === 0">{{scope.row.returnNum}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="正品入库数量" prop="inNum" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.inNum || scope.row.inNum === '0' || scope.row.inNum === 0">{{scope.row.inNum}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="残品入库数量" prop="defectiveInNum" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.defectiveInNum || scope.row.defectiveInNum === '0' || scope.row.defectiveInNum === 0">{{scope.row.defectiveInNum}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="合计" prop="totalInNum" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.totalInNum || scope.row.totalInNum === '0' || scope.row.totalInNum === 0">{{scope.row.totalInNum}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="单据详情" name="2">
          <!-- 第一行 -->
          <el-row>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">客户电话：</div>
              <div class="content">{{tableRowDetail.senderNumber}}</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">客户姓名：</div>
              <div class="content">{{tableRowDetail.sender}}</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">入库时间：</div>
              <div class="content">{{tableRowDetail.warehouseTime | filter-time}}</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">操作人：</div>
              <div class="content">{{tableRowDetail.operator}}</div>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">售后单备注：</div>
              <div class="content" v-if="tableRowDetail.remark">{{tableRowDetail.remark}}</div>
              <div class="content" v-else>-</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">确认到货备注：</div>
              <div class="content" v-if="tableRowDetail.confirmRemark">{{tableRowDetail.confirmRemark}}</div>
              <div class="content" v-else>-</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">
              <div class="title">理货备注：</div>
              <div class="content" v-if="tableRowDetail.recordRemark">{{tableRowDetail.recordRemark}}</div>
              <div class="content" v-else>-</div>
            </el-col>
            <el-col :span="6" style="height: auto;line-height: 30px;">&nbsp;</el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 打印显示的div -->
    <div id="printData" >
      <div class="print_screen" v-for="(data, i) in printData" :key="i" style="width: 1000px;" v-show="isListShow">
        <h3>退货入库理货单</h3>
        <section v-if="data">
          <p>
            <span class="title">入库单编号：</span>
            <span class="desc" style="font-weight: 900;">{{data.warehouseNoticeCode}}</span>
          </p>
          <p></p>
          <p></p>
        </section>
        <section v-if="data" style="border: none">
          <p>
            <span class="title">系统订单编号：</span>
            <span class="desc">{{data.scmShopOrderCode}}</span>
          </p>
          <p>
            <span class="title">联系人：</span>
            <span class="desc">{{ data.receiver}}</span>
          </p>
          <p>
            <span class="title">联系电话：</span>
            <span class="desc">{{ data.receiverNumber}}</span>
          </p>
        </section>
        <section v-if="data">
          <p>
            <span class="title">销售渠道：</span>
            <span class="desc">{{ data.sellCodeName}}</span>
          </p>
          <p>
            <span class="title">店铺名称：</span>
            <span class="desc">{{ data.shopName}}</span>
          </p>
          <p></p>
        </section>
        <section v-if="data">
          <p>
            <span class="title">入库仓库：</span>
            <span class="desc">{{ data.warehouseName}}</span>
          </p>
          <p>
            <span class="title">操作人：</span>
            <span class="desc">{{ data.operator}}</span>
          </p>
          <p>
            <span class="title">入库时间：</span>
            <span class="desc">{{ data.warehouseTime | filter-time}}</span>
          </p>
        </section>
        <p class="name">商品明细</p>
        <div class="table_list">
          <el-table id="printTableList" highlight-current-row :data="data.warehouseNoticeDetailList" style="border: solid 1px #ccc;" border>
            <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
            <el-table-column label="SKU编号" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="SKU名称" prop="skuName" align="center"></el-table-column>
            <el-table-column label="条形码" prop="barCode" align="center"></el-table-column>
            <el-table-column label="品牌" prop="specNatureInfo" align="center"></el-table-column>
            <el-table-column label="拟退货数量" prop="returnNum" align="center"></el-table-column>
            <el-table-column label="理货数量" align="center">
              <el-table-column label="正品入库数量" prop="inNum" align="center"></el-table-column>
              <el-table-column label="残品入库数量" prop="defectiveInNum" align="center"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'returnreceipt',
  data() {
    return {
      printData: [], // 打印的数据
      printId: [], // 打印的表格列表
      multipleSelection: [], // 多选选中数据
      isListShow: false, // 隐藏打印表格
      printDisabled: true, // 默认打印为不可点
      activeName: '1', // 当前选中的选项卡
      activeTab: '1', // 默认选中的tab
      boxInfoDetail: {},
      tableRowDetail: {},
      tableDataList: [{}], // 列表
      totalCount: 0,
      searchParams: {
        createTimeStart: '', // 创建时间开始
        createTimeEnd: '', // 创建时间结束
        warehouseNoticeCode: '', // 入库单编号
        afterSaleCode: '', // 售后单编号
        shopOrderCode: '', // 渠道订单号
        scmShopOrderCode: '', // 订单编号
        warehouseCode: '', // 入库仓库编码
        operator: '', // 操作人
        status: '', // 状态
        start: 0,
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      warehouseCodeList: [], // 仓库列表
      statusList: [
        {
          id: '1',
          name: '全部'
        },
        {
          id: '2',
          name: '正常'
        },
        {
          id: '3',
          name: '停止'
        }
      ]
    };
  },
  computed: {
    // 当前表格高度
    currentHeight() {
      let height = 96;
      if (this.tableDataList && this.tableDataList.length) {
        if (this.tableDataList.length > 10) {
          height = 386;
        } else if (this.tableDataList.length > 0 && this.tableDataList.length <= 10) {
          height = 35 * this.tableDataList.length + 36;
        } else {
          height = 71;
        }
      }
      return height;
    }
  },
  created() {
    let lastDay = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000);
    let month = (lastDay.getMonth() * 1 + 1).toString().length > 1 ? (lastDay.getMonth() * 1 + 1) : ('0' + (lastDay.getMonth() * 1 + 1));
    let currDay = new Date();
    let currmonth = (currDay.getMonth() * 1 + 1).toString().length > 1 ? (currDay.getMonth() * 1 + 1) : ('0' + (currDay.getMonth() * 1 + 1));
    this.searchParams.createTimeStart = lastDay.getFullYear() + '-' + month + '-' + lastDay.getDate();
    this.searchParams.createTimeEnd = currDay.getFullYear() + '-' + currmonth + '-' + currDay.getDate();
    if (this.$route.query.status !== '') {
      this.searchParams.status = this.$route.query.status;
      this.searchParams.createTimeStart = '';
      this.searchParams.createTimeEnd = '';
      if (this.searchParams.status === '5') {
        this.activeTab = '7';
      }
    }
    this.getWarehouseCodeList();
    this.initDataList();
  },
  methods: {
    checkSelectable(row, index) {
      let isSeletc = true;
      if (row.status === 2 || row.status === 3) {
        isSeletc = false;
      }
      return isSeletc;
    },
    // 跳转到商品详情
    toGoodDetail(row) {
    //   let config = {};
    //   if (row.skuCode.indexOf('SP0') > -1) {
    //     let obj = {
    //       spuCode: row.spuCode,
    //       skuCode: row.skuCode
    //     };
    //     // 自营
    //     config = {
    //       title: '商品详情',
    //       href: 'goods/goodsSkuDetail.html?' + qs.stringify(obj)
    //     };
    //   } else {
    //     let obj = {
    //       flag: 1,
    //       isClose: true,
    //       hideLogs: true,
    //       skuCode: row.skuCode
    //     };
    //     // 代发
    //     config = {
    //       title: '商品详情',
    //       href: 'goods/externalGoodsDetail.html?' + qs.stringify(obj)
    //     };
    //   }
    //   top.window.addTab(config);
        if (row.skuCode.indexOf('SP0') > -1) {
            // console.log(window.location);
            // window.open(`${window.location.origin}/supply/index.html#/goodsquery/goodsquerydetail/${row.spuCode}/${row.skuCode}?backLastRouter=true`);

            this.$router.push({
                name: 'goodsquerydetail',
                params: {
                    id: row.spuCode,
                    skuCode: row.skuCode
                },
                query: {
                    backLastRouter: true
                }
            });
            // this.$store.dispatch('selectChannel/setMuneTab', {
            //     title: '商品查询',
            //     route: '/goodsquery'
            // });
        } else {
            this.$router.push({
                name: 'undertakesgoodDetail',
                params: {
                    id: row.skuCode
                },
                query: {
                    backLastRouter: true,
                    opeId: row.id
                }
            });
            // this.$store.dispatch('selectChannel/setMuneTab', {
            //     title: '商品查询',
            //     route: '/goodsquery'
            // });
        }
    },
    toAddOrEdit() {
      this.$router.push({ path: '/purchasesgroup/purchasegroupaddoredit' });
    },
    handleClick(tab, event) {
      let status = this.activeTab - 2;
      if (status === -1) {
        this.searchParams.status = '';
      } else {
        this.searchParams.status = status;
      }
      this.initDataList();
    },
    // 获取仓库列表
    getWarehouseCodeList() {
      this.$AXIOS.GET('afterSaleWarehouseNotice/selectWarehouse').then(res => {
        this.warehouseCodeList = res.result;
      });
    },
    // 搜索，初始化数据
    initDataList() {
      this.tableRowDetail = {};
      this.$AXIOS.LISTGET('/afterSaleWarehouseNotice/warehouseNoticeList', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.getTableRowDetail(this.tableDataList[0].warehouseNoticeCode);
          }, 20);
        }
      });
    },
    // 获取详情数据
    getTableRowDetail(warehouseNoticeCode) {
      this.$AXIOS.GET('/afterSaleWarehouseNotice/warehouseNoticeInfo', { warehouseNoticeCode }).then(res => {
        this.tableRowDetail = res.result || {};
      });
    },
    // 状态翻译
    checkedStatus(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '未入库';
      } else if (status === 2) {
        statusStr = '入库完成';
      } else if (status === 3) {
        statusStr = '已关闭';
      } else if (status === 5) {
          statusStr = '通知仓库失败';
      }
      return statusStr;
    },
    // 点击整行
    tableRowClick(row) {
      this.getTableRowDetail(row.warehouseNoticeCode);
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
    // 筛选条件
    searchFormData() {
      if (
        new Date(this.searchParams.createTimeStart).getTime() - 28800000 >
        new Date(this.searchParams.createTimeEnd).getTime()
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
      this.activeTab = '1';
      this.searchParams = {
        createTimeStart: '', // 创建时间开始
        createTimeEnd: '', // 创建时间结束
        warehouseNoticeCode: '', // 入库单编号
        afterSaleCode: '', // 售后单编号
        shopOrderCode: '', // 渠道订单号
        scmShopOrderCode: '', // 订单编号
        warehouseCode: '', // 入库仓库编码
        operator: '', // 操作人
        status: '', // 状态
        start: 0,
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 合计
    getSummaries(param) {
      // console.log(param);
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
        if (index === 2) {
          sums[index] = '-';
          return;
        }
        if (index === 3) {
          sums[index] = '-';
          return;
        }
        if (index === 4) {
          sums[index] = '-';
          return;
        }
        if (index === 5) {
          sums[index] = '-';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
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
          sums[index] = '';
        }
      });

      return sums;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    printDataBtn() {
      if (!this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('请至少选择一个要打印的列表数据');
        return;
      }
      setTimeout(() => {
        this.needPrintData(this.printId);
      }, 20);
    },
    needPrintData(select) {
      this.printData = [];
      const loading = this.$loading({
        // 遮罩对象
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let promise = this.multipleSelection.map((item, index) => {
        let json = {};
        let warehouseNoticeCode = item.warehouseNoticeCode;
        return this.$AXIOS.GET('/afterSaleWarehouseNotice/warehouseNoticeInfo', { warehouseNoticeCode }).then(res => {
          json = res.result || {};
          this.printData.push(json);
        });
      });
      axios.all(promise).then(
        axios.spread((res1, res2) => {
          loading.close();
          this.isListShow = true;
          setTimeout(() => {
            window.print();
            this.isListShow = false;
          }, 20);
        })
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.returnreceipt
  .title, .content
    display: inline-block
    line-height: 23px
  .title
    width: 150px
    text-align: right
    width: 30%
    text-align: right
    vertical-align: top
  .content
    width: 69%
    height: 47px
    overflow-y: auto
  .paging
    text-align: right
  .btn
    cursor: pointer
    color: blue
  .print_screen
    margin-top: 30px
    h3
      text-align: center
      font-weight: 900
      margin-bottom: 50px
    section
      border-bottom: solid 1px #000
      display: flex
      justify-content: space-between
      p
        width 100%
        .title, .desc
          width 40%
          line-height 50px
          display: inline-block
          vertical-align top
    .name
      margin: 15px 0
</style>
