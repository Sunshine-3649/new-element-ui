<template>
  <div class="ordermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="订单编号：" size="mini">
            <el-input v-model.trim="searchParams.orderCode" placeholder=""></el-input>
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
        <el-col :span="6">
          <el-form-item label="SKU名称：" size="mini">
            <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU编码：" size="mini">
            <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="商品条码：" size="mini">
            <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="附属信息：" size="mini">
            <el-input v-model.trim="searchParams.SN" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人电话：" size="mini">
            <el-input v-model.trim="searchParams.receiverMobile" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人姓名：" size="mini">
            <el-input v-model.trim="searchParams.receiverName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <!-- <el-col :span="6">
          <el-form-item label="供应商：" size="mini">
            <el-select v-model="searchParams.supplierCode" filterable placeholder="请选择">
              <el-option v-for="item in supplierCodeList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="收货地址：" size="mini">
            <el-input v-model.trim="searchParams.receiverAddress" placeholder=""></el-input>
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
          <el-form-item label="" size="mini">&nbsp;
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
        <el-button type="primary" size="mini" @click="downloadOrderExport" :disabled="tableDataList && !tableDataList.length">导出订单</el-button>
        <el-button type="primary" size="mini" @click="importAccount">导入订单</el-button>
        <el-button type="text" size="mini" @click="downloadTem">订单模板下载</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="margin-top: 15px;">
      <el-tab-pane label="所有订单" name="-1"></el-tab-pane>
      <el-tab-pane label="等待发货" name="0"></el-tab-pane>
      <el-tab-pane label="全部发货" name="2"></el-tab-pane>
    </el-tabs>
    <!-- 表格tableData -->
    <div class="table">
      <ul class="table_menu" style="background: rgb(242, 242, 242);">
        <li class='serial'>序号</li>
        <li>SKU名称</li>
        <li>SKU编码</li>
        <li>条形码</li>
        <li>销售属性</li>
        <li class='price'>分销价</li>
        <li class='price'>已发/应发</li>
        <li>商品发货状态</li>
        <li>分销商</li>
      </ul>
      <div v-if="tableDataList.length < 1" class="nomessage">暂无数据</div>
      <div v-else v-for="(tableItem, index) in tableDataList" :key="index">
        <ul class="table_menu" style="background: rgb(242, 242, 242);">
          <li style="padding-left: 20px;text-align: left;">
            [{{tableItem.orderDetailDTO.orderStatus}}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{tableItem.orderDetailDTO.createTime}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            订单编号：<span class="btn" @click="toDetail(tableItem.orderDetailDTO.id)">{{tableItem.orderDetailDTO.shopOrderCode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </li>
          <li style="padding-right: 20px;text-align: right;cursor: pointer;" @click="showToast(tableItem.orderDetailDTO.id, tableItem.orderDetailDTO.flagLevel, tableItem.orderDetailDTO.memo )" v-if="(tableItem.orderDetailDTO.flagLevel && tableItem.orderDetailDTO.memo) || tableItem.orderDetailDTO.flagLevel === '0'">
            <el-popover
              placement="top-start"
              title=""
              width="200"
              trigger="hover"
              :content="tableItem.orderDetailDTO.memo">
              <span slot="reference" style="width: 23px">
                <img v-if="tableItem.orderDetailDTO.flagLevel === 1" src="./1.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.orderDetailDTO.flagLevel === 2" src="./2.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.orderDetailDTO.flagLevel === 3" src="./3.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.orderDetailDTO.flagLevel === 4" src="./4.png" style="width: 23px" alt="">
                <img v-else-if="tableItem.orderDetailDTO.flagLevel === 5" src="./5.png" style="width: 23px" alt="">
              </span>
            </el-popover>
          </li>
          <li style="padding-right: 20px;text-align: right;cursor: pointer;" @click="showToast(tableItem.orderDetailDTO.id, tableItem.orderDetailDTO.flagLevel, tableItem.orderDetailDTO.memo )" v-else>
            <img src="./0.png" style="width: 23px" alt="">
          </li>
        </ul>
        <el-table class="hide_list" :data="tableItem.orderItemDetailDTOList" border >
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn" @click="toGoodDetail(scope.row.spuCode)">{{scope.row.skuName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="SKU编码" prop="skuCode" align="center"></el-table-column>
          <el-table-column label="条形码" prop="barCode" align="center"></el-table-column>
          <el-table-column label="销售属性" prop="salePropertys" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="分销价" prop="price" width="100" align="center" >
            <template slot-scope="scope">
              <div v-if="scope.row.price || scope.row.price !== '0' || scope.row.price !== 0">{{scope.row.price | tofixed}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="已发/应发" prop="skuCode" width="100" align="center" >
            <template slot-scope="scope">
              {{scope.row.sendNum}}/{{scope.row.num}}
            </template>
          </el-table-column>
          <el-table-column label="商品发货状态" prop="status" align="center">
            <template slot-scope="scope">
              {{scope.row.status}}
            </template>
          </el-table-column>
          <el-table-column label="分销商" prop="distributorName" align="center">
            <template slot-scope="scope">
              <div class='btn' @click="toDistriDetail(scope.row.distributorCode)">{{scope.row.companyAbbreviation ? scope.row.companyAbbreviation + ' (' + scope.row.distributorCode + ')' : scope.row.companyName}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="total">
          订单商品数量：{{tableItem.orderDetailDTO.itemNum}}件
          订单总金额：{{tableItem.orderDetailDTO.totalFee | tofixed}}元
        </div>
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
    <!-- 报价弹窗 -->
    <el-dialog title="导入订单" :visible.sync="isAccount" width="40%">
      <el-upload ref="upload" v-show="isResult === 'default'" class="upload-demo" :before-upload="beforeAvatarUpload" drag action="/chain-web/busiOrderItems/orderImport" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>全部解析成功</p>
        <p>共{{uploadResult.successCount}}条数据</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>解析成功{{uploadResult.successCount}}条数据，解析失败{{uploadResult.failCount}}条数据。</p>
        <p>请点此
          <a :href="downloadFail" style="color: red;">下载文件</a>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div v-show="isResult === 'success'" style="text-align: center;">
          <el-button type="primary" @click="savePrice" size="mini">提交订单</el-button>
          <el-button @click="resetPrice" size="mini">取消提交</el-button>
        </div>
        <div v-show="isResult === 'fail'" style="text-align: center;">
          <el-button @click="isAccount = false" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
export default {
  name: 'ordermanage',
  data() {
    return {
      importCode: '', // 导出出错的参数
      uploadResult: {}, // 上传成功返回的响应数据
      isResult: 'default', // 默认显示导入文件
      isAccount: false, // 导入报价
      isChangePrice: false, // 报价弹窗
      id: '', // 要保存的id
      textarea: '', // 备注内容
      isRadio: '1', // 默认的备注
      isToast: false, // 弹窗
      activeName: '-1', // 默认选中tab
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      searchParams: {
        orderStatus: '', // tab状态
        orderCode: '', // 订单编号
        receiverAddress: '', // 收货地址
        SN: '', // SN
        barCode: '', // 商品条码
        skuCode: '', // SKU编码
        skuName: '', // 商品名称
        distributorCode: '', // 分销商
        receiverName: '', // 收货人姓名
        receiverMobile: '', // 收货人电话
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
    // this.getSupplierCodeList();
    this.getDistributorCodeList();
  },
  computed: {
    // 导入失败下载的地址
    downloadFail() {
      return (
        '/chain-web/busiOrderItems/exceptionOrderDownload/' +
        this.importCode
      );
    }
  },
  filters: {
    tofixed(val) {
      let str;
      if (val !== null ) {
        str = val.toString();
        if (str.indexOf('.') < 0 && str !== '0') {
          str = str + '.00';
        }
      }
      return str;
    }
  },
  methods: {
    // 获取采购单数据列表
    initDataList() {
      this.GET('/busiShopOrder/queryOrderList', this.searchParams)
        .then(res => {
          console.log(res);
          this.tableDataList = res.body.objects || [];
          this.totalCount = res.body.pageTotal || 0;
          this.tableDataList.forEach(item => {
            item.orderItemDetailDTOList.forEach(subItem => {
              subItem.companyName = item.orderDetailDTO.companyName;
              subItem.companyAbbreviation = item.orderDetailDTO.companyAbbreviation;
              subItem.distributorCode = item.orderDetailDTO.distributorCode;
            });
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
    // 跳转到分销商详情
    toDistriDetail(code) {
      this.$router.push({path: '/distributormanage/managedetail/' + code});
    },
    // 提交备注
    putFlagLevel() {
      let params = {
        id: this.id,
        flagLevel: this.isRadio,
        memo: this.textarea
      };
      this.PUT('/busiShopOrder/modifyMemo', params).then(res => {
        if (res.code === '200') {
          console.log(res);
          this.isToast = false;
          this.initDataList();
          this.$message({
            type: 'success',
            message: res.body
          });
        }
      });
    },
    // 切换tab
    handleClick(tab, event) {
      console.log(this.activeName);
      this.searchParams.orderStatus = '';
      if (this.activeName === '-1') {
        this.searchParams.orderStatus = '';
      } else if (this.activeName === '0') {
        this.searchParams.orderStatus = '0';
      } else if (this.activeName === '2') {
        this.searchParams.orderStatus = '2';
      }
      this.initDataList();
    },
    // 跳转到发货单详情页
    toDetail(id) {
      this.$router.push({path: '/ordermanage/ordermanageDetail/' + id});
    },
    // 跳转到商品详情页
    toGoodDetail(spuCode) {
      if (spuCode) {
        this.$router.push({
          path: '/goodmanage/gooddetail/' + spuCode
        });
      }
    },
    // 订单导出
    downloadOrderExport() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/chain-web/busiShopOrder/orderExport?' + qs.stringify(params));
    },
    // 导入模板
    importAccount() {
      this.isResult = 'default';
      this.uploadResult = {};
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.isAccount = true;
    },
    // 模板下载
    downloadTem() {
      window.open('/chain-web/busiOrderItems/exportOrderTemplate');
    },
    beforeAvatarUpload(file) {
      console.log(file);

      const isExcel = file.type === 'application/vnd.ms-excel';

      if (!isExcel) {
        this.$message.error('上传文件只能是 xls 格式!');
      }
      return isExcel;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      if (response.code === '200') {
        this.$message({
          message: '订单解析成功！',
          type: 'success'
        });
        this.uploadResult = response.body;
        this.importCode = this.uploadResult.importCode || '';
        if (this.uploadResult.failCount === '0') {
          this.isResult = 'success';
        } else {
          this.isResult = 'fail';
        }
      } else {
        this.isAccount = false;
        this.$message({
          message: response.message,
          type: 'warning'
        });
      }
    },
    // 导入成功之后调用
    savePrice() {
      this.GET(
        '/busiOrderItems/generateOrder/' + this.importCode
      ).then(res => {
        if (res.code === '200') {
          this.initDataList();
          this.$message({
            message: res.body,
            type: 'success'
          });
          this.isAccount = false;
        }
      });
    },
    // 取消报价
    resetPrice() {
      this.$message({
        type: 'info',
        message: '取消提交'
      });
      this.isAccount = false;
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
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
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
        orderStatus: '', // tab状态
        orderCode: '', // 订单编号
        receiverAddress: '', // 收货地址
        SN: '', // SN
        barCode: '', // 商品条码
        skuCode: '', // SKU编码
        skuName: '', // 商品名称
        distributorCode: '', // 分销商
        receiverName: '', // 收货人姓名
        receiverMobile: '', // 收货人电话
        startDate: '', // 创建时间
        endDate: '', // 创建时间
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
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
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.ordermanage
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
  .total
    text-align: right
    font-weight: 900
    font-size: 14px
    line-height: 30px
    border solid 1px #cccccc
    border-top none
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
      li.price
        width: 100px
        flex: 0 0 100px
    .nomessage
      text-align center
      line-height 40px
      color #cccccc
      border solid 1px #cccccc
      border-top none
</style>
<style lang="stylus">
.ordermanage
  .hide_list
    border solid 1px #cccccc
    .el-table__header-wrapper
      display none
  .price_list
    border: solid 1px #ccc
    border-top: none
  .upload-demo
    text-align: center
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
</style>
