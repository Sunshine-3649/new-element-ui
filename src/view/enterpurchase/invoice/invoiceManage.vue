<template>
  <div class="invoiceManage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="发货单编号：" size="mini">
            <el-input v-model.trim="searchParams.outboundOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属订单编号：" size="mini">
            <el-input v-model.trim="searchParams.shopOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU名称：" size="mini">
            <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
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
          <el-form-item label="供应商：" size="mini">
            <el-select v-model="searchParams.supplierCode" filterable placeholder="请选择">
              <el-option v-for="item in supplierCodeList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分销商：" size="mini">
            <el-select v-model="searchParams.distributorCode" filterable placeholder="请选择">
              <el-option v-for="item in distributorCodeList" :key="item.distributorCode" :label="item.companyName" :value="item.distributorCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件人电话：" size="mini">
            <el-input v-model.trim="searchParams.receiverMobile" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件人姓名：" size="mini">
            <el-input v-model.trim="searchParams.receiverName" placeholder=""></el-input>
            <!-- <el-select v-model="searchParams.purchaseGroupCode" filterable placeholder="请选择">
              <el-option v-for="item in purchaseGroupCodeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
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
        <el-button type="primary" size="mini" @click="downloadExportOutboundOrder" :disabled="tableDataList && !tableDataList.length">导出发货单</el-button>
        <el-button type="primary" size="mini" @click="downloadExportSendRecord">导出发货记录</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="margin-top: 15px;">
      <el-tab-pane label="全部状态" name="-1"></el-tab-pane>
      <el-tab-pane label="待推送" name="0"></el-tab-pane>
      <el-tab-pane label="待发货" name="2"></el-tab-pane>
      <el-tab-pane label="部分发货" name="3"></el-tab-pane>
      <el-tab-pane label="全部发货" name="4"></el-tab-pane>
      <el-tab-pane label="推送失败" name="1"></el-tab-pane>
      <el-tab-pane label="亏损发货单" name="6"></el-tab-pane>
      <el-tab-pane label="通讯异常" name="7"></el-tab-pane>
    </el-tabs>
    <!-- 表格tableData -->
    <div class="table">
      <ul class="table_menu" style="background: rgb(242, 242, 242);">
        <li class='serial'>序号</li>
        <li>SKU名称</li>
        <li>SKU编码</li>
        <li>条形码</li>
        <li>销售属性</li>
        <li>已发/应发</li>
        <li>采购单价</li>
        <li>分销单价</li>
        <li>单件利润</li>
        <li>供应商</li>
        <li>分销商</li>
        <li>商品发货状态</li>
      </ul>
      <div v-if="tableDataList.length < 1" class="nomessage">暂无数据</div>
      <div v-else v-for="(tableItem, index) in tableDataList" :key="index">
        <ul class="table_menu" style="background: rgb(242, 242, 242);">
          <li style="padding-left: 20px;text-align: left;">
            [{{checkedStatus(tableItem.status)}}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            发货单编号：<span class="btn" @click="toDetail(tableItem.id)">{{tableItem.outboundOrderCode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            创建时间：{{tableItem.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span v-if="tableItem.isException" style="color: red;">通讯异常</span></li>
          <li style="padding-right: 20px;text-align: right;cursor: pointer;" @click="showToast(tableItem.id, tableItem.flagLevel, tableItem.memo )" v-if="(tableItem.flagLevel && tableItem.memo) || tableItem.flagLevel === '0'">
            <el-popover
              placement="top-start"
              title=""
              width="200"
              trigger="hover"
              :content="tableItem.memo">
              <span type="text" size="mini" slot="reference" style="width: 23px">
                <img v-if="tableItem.flagLevel === 1" src="./1.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.flagLevel === 2" src="./2.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.flagLevel === 3" src="./3.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.flagLevel === 4" src="./4.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.flagLevel === 5" src="./5.png" style="width: 23px" alt="">
              </span>
            </el-popover>
          </li>
          <li style="padding-right: 20px;text-align: right;cursor: pointer;" @click="showToast(tableItem.id, tableItem.flagLevel, tableItem.memo )" v-else>
            <img src="./0.png" style="width: 23px" alt="">
          </li>
        </ul>
        <el-table class="hide_list" :data="tableItem.busiOutboundOrderItemVOList " border >
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn" @click="toGoodDetail(scope.row.spuCode)">{{scope.row.skuName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="SKU编码" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="销售属性" prop="salePropertys" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="已发/应发" align="center" >
            <template slot-scope="scope">
              {{scope.row.sendNum}}/{{scope.row.num}}
            </template>
          </el-table-column>
          <el-table-column label="采购单价" prop="purchasePrice" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.purchasePrice || scope.row.purchasePrice !== '0' || scope.row.purchasePrice !== 0">{{scope.row.purchasePrice | tofixed}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="分销单价" prop="distributorPrice" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.distributorPrice || scope.row.distributorPrice !== '0' || scope.row.distributorPrice !== 0">{{scope.row.distributorPrice | tofixed}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="单件利润" prop="profit" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.profit && scope.row.profit < 0" style="color: red;">{{scope.row.profit | tofixed}}</div>
              <div v-else-if="scope.row.profit >= 0">{{scope.row.profit | tofixed}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplierName" align="center">
            <template slot-scope="scope">
              <div class="btn" @click="toSupplierDetail(scope.row.supplierCode)">{{scope.row.supplierName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="分销商" prop="distributorName" align="center">
            <template slot-scope="scope">
              <div class="btn" @click="toDistriDetail(scope.row.distributorCode)">{{scope.row.distributorName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品发货状态" prop="status" align="center">
            <template slot-scope="scope">
              {{checkedGoodStatus(scope.row.status)}}
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <el-dialog title="发货单备注" :visible.sync="isToast">
      <div>
        <el-radio v-model="isRadio" label="1">
          <img src="./1.png" style="width: 23px" alt="">
        </el-radio>
        <el-radio v-model="isRadio" label="2">
          <img src="./2.png" style="width: 23px" alt="">
        </el-radio>
        <el-radio v-model="isRadio" label="3">
          <img src="./3.png" style="width: 23px" alt="">
        </el-radio>
        <el-radio v-model="isRadio" label="4">
          <img src="./4.png" style="width: 23px" alt="">
        </el-radio>
        <el-radio v-model="isRadio" label="5">
          <img src="./5.png" style="width: 23px" alt="">
        </el-radio>
        <el-input
          style="margin-top: 15px;"
          type="textarea"
          :rows="4"
          :maxlength="100"
          placeholder="请输入备注"
          v-model="textarea">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isToast = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="makesure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
export default {
  name: 'invoiceManage',
  data() {
    return {
      id: '', // 要保存的id
      textarea: '', // 备注内容
      isRadio: '1', // 默认的备注
      isToast: false, // 弹窗
      activeName: '-1', // 默认选中tab
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      searchParams: {
        status: '', // 默认选中状态
        isException: '', // 是否异常
        isLoss: '', // 是否亏损
        outboundOrderCode: '', // 发货单编号
        shopOrderCode: '', // 所属订单编号
        skuName: '', // SKU名称
        supplierCode: '', // 供应商
        distributorCode: '', // 分销商
        receiverName: '', // 收件人电话
        receiverMobile: '', // 收件人姓名
        startDate: '', // 创建时间
        endDate: '', // 创建时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      }, // 请求参数
      supplierCodeList: [], // 供应商列表
      distributorCodeList: [] // 分销商商列表
    };
  },
  created() {
    let lastDay = new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000);
    let month = (lastDay.getMonth() * 1 + 1).toString().length > 1 ? (lastDay.getMonth() * 1 + 1) : ('0' + (lastDay.getMonth() * 1 + 1));
    let currDay = new Date();
    let currmonth = (currDay.getMonth() * 1 + 1).toString().length > 1 ? (currDay.getMonth() * 1 + 1) : ('0' + (currDay.getMonth() * 1 + 1));
    this.searchParams.startDate = lastDay.getFullYear() + '-' + month + '-' + lastDay.getDate();
    this.searchParams.endDate = currDay.getFullYear() + '-' + currmonth + '-' + currDay.getDate();
    this.initDataList();
    this.getSupplierCodeList();
    this.getDistributorCodeList();
  },
  filters: {
    tofixed(val) {
      let str = val.toString();
      if (str.indexOf('.') < 0 && str !== '0') {
        str = str + '.00';
      }
      return str;
    }
  },
  methods: {
    // 获取采购单数据列表
    initDataList() {
      this.GET('/busiOutboundOrder/queryOutboundPage', this.searchParams)
        .then(res => {
          console.log(res);
          this.tableDataList = res.body.objects || [];
          this.totalCount = res.body.pageTotal || 0;
          this.tableDataList.forEach(item => {
            if (item.busiOutboundOrderItemVOList && item.busiOutboundOrderItemVOList.length) {
              item.busiOutboundOrderItemVOList.forEach(subItem => {
                subItem.distributorName = item.distributorName;
                subItem.distributorCode = item.distributorCode;
              });
            }
          });
        });
    },
    // 获取供应商数据列表
    getSupplierCodeList() {
      this.GET('/supplierAuthor/supplierList/3').then(res => {
          this.supplierCodeList = res.body;
        });
    },
    // 获取分销商数据列表
    getDistributorCodeList() {
      this.GET('/distributorAuthor/distributor/3').then(res => {
          this.distributorCodeList = res.body;
        });
    },
    // /busiOutboundOrder/setFlagLevel
    // 提交备注
    putFlagLevel() {
      let params = {
        id: this.id,
        flagLevel: this.isRadio,
        memo: this.textarea
      };
      this.PUT('/busiOutboundOrder/setFlagLevel', params).then(res => {
        if (res.code === '200') {
          console.log(res);
          this.isToast = false;
          this.initDataList();
          this.$utils.messagetip.successTip(res.body);
        }
      });
    },
    // 切换tab
    handleClick(tab, event) {
      console.log(this.activeName);
      this.searchParams.status = '';
      this.searchParams.isException = '';
      this.searchParams.isLoss = '';
      if (this.activeName === '-1') {
        this.searchParams.status = '';
      } else if (this.activeName < 6 && this.activeName >= 0) {
        this.searchParams.status = this.activeName;
      } else if (this.activeName === '6') {
        this.searchParams.isLoss = 1;
      } else if (this.activeName === '7') {
        this.searchParams.isException = 1;
      }
      this.initDataList();
    },
    // 跳转到发货单详情页
    toDetail(id) {
      this.$router.push({path: '/invoiceManage/invoiceManageDetail/' + id});
    },
    // 跳转到商品详情页
    toGoodDetail(spuCode) {
      if (spuCode) {
        this.$router.push({
          path: '/goodmanage/gooddetail/' + spuCode
        });
      }
    },
    // 发货单导出
    downloadExportOutboundOrder() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/chain-web/busiOutboundOrder/exportOutboundOrder?' + qs.stringify(params));
    },
    // 发货单记录导出
    downloadExportSendRecord() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/chain-web/busiOutboundOrder/exportSendRecord?' + qs.stringify(params));
    },
    // 保存当前点击的id
    showToast(id, flagLevel, memo) {
      this.id = id;
      this.isRadio = (flagLevel && flagLevel.toString()) || '';
      this.textarea = memo || '';
      this.isToast = true;
    },
    // 筛选条件
    searchFormData() {
      if (
        new Date(this.searchParams.startDate).getTime() - 28800000 >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNumber = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.activeName = '-1';
      this.searchParams = {
        status: '', // 默认选中状态
        isException: '', // 是否异常
        isLoss: '', // 是否亏损
        outboundOrderCode: '', // 发货单编号
        shopOrderCode: '', // 所属订单编号
        skuName: '', // SKU名称
        supplierCode: '', // 供应商
        distributorCode: '', // 分销商
        receiverName: '', // 收件人电话
        receiverMobile: '', // 收件人姓名
        startDate: '', // 创建时间
        endDate: '', // 创建时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 跳转供应商详情
    toSupplierDetail(code) {
      let obj = {
        hideLogs: '0',
        supplierCode: code,
        flag: '1'
      };
      let config = {
        title: '供应商详情',
        href: 'supplier/supplierDetail.html?' + qs.stringify(obj)
      };
      top.window.addTab(config);
    },
    // 跳转到分销商详情
    toDistriDetail(code) {
      this.$router.push({path: '/distributormanage/managedetail/' + code});
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNumber = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      this.initDataList();
    },
    // 发货状态翻译
    checkedStatus(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '待推送';
      } else if (status === 1) {
        statusStr = '推送失败';
      } else if (status === 2) {
        statusStr = '待发货';
      } else if (status === 3) {
        statusStr = '部分发货';
      } else if (status === 4) {
        statusStr = '全部发货';
      } else if (status === 5) {
        statusStr = '已取消';
      }
      return statusStr;
    },
    // 商品发货状态翻译
    checkedGoodStatus(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '待发货';
      } else if (status === 1) {
        statusStr = '部分发货';
      } else if (status === 2) {
        statusStr = '全部发货';
      } else if (status === 3) {
        statusStr = '取消';
      }
      return statusStr;
    },
    // 备注提交
    makesure() {
       this.$confirm('确定要提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.putFlagLevel();
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消删除');
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.invoiceManage
  .paging
    margin-top: 15px
    text-align: right
  .btn
    color blue
    cursor pointer
    width 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
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
      li.serial
        width: 40px
        flex: 0 0 40px
    .nomessage
      text-align center
      line-height 40px
      color #cccccc
      border solid 1px #cccccc
      border-top none
</style>
<style lang="stylus">
.invoiceManage
  .hide_list
    border solid 1px #cccccc
    .el-table__header-wrapper
      display none
  .price_list
    border: solid 1px #ccc
    border-top: none
</style>
