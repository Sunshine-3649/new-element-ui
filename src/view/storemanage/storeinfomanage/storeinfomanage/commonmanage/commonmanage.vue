<template>
  <div class="commonmanage">
    <div class="title">[ {{warehouseName}} ] 商品管理</div>
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
        <!-- <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="openOperateDialog"
        >操作日志</el-button> -->
      </div>
      <el-form
        :model="searchParams"
        ref="queryForm"
        label-width="125px"
        class="search_form"
        size="medium"
      >
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item
              label="商品SKU编号："
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.skuCode"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="商品名称："
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.itemName"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="条形码："
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.barCode"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="通知仓库状态："
              size="mini"
            >
              <el-select
                v-model="searchParams.noticeStatus"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in storeTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="18">
            <el-button
              type="primary"
              size="mini"
              @click="addGoods"
            >添加商品</el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="tableDataList && !tableDataList.length"
              @click="exportTable"
            >导出</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="isShow"
              @click="informWarehouseBtn"
              :loading="isNoticeDisabled"
              :disabled='isNoticeDisabled'
            >{{isNoticeDisabled?'通知仓库中':'通知仓库'}}</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="importAccount"
            >导入商品</el-button>
            <el-dropdown v-if="operationalNature !== '1'">
              <span class="el-dropdown-link">
                模板下载<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="padding: 0">
                  <a
                    style="width: 100%; height: 100%; display: block;padding: 0 20px;"
                    href='./static/download/WarehouseItemInfoNoticTemplate/templateForOnlySkuCode.xls'
                    target='_blank'
                  >仅导入商品</a>
                </el-dropdown-item>
                <el-dropdown-item  style="padding: 0">
                  <a
                    style="width: 100%; height: 100%; display: block;padding: 0 20px;"
                    href='./static/download/WarehouseItemInfoNoticTemplate/template.xls'
                    target='_blank'
                  >导入商品及其仓库ID</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
              type="text"
              size="mini"
            >
            <a
              href='./static/download/WarehouseItemInfoNoticTemplate/templateForOnlySkuCode.xls'
              target='_blank'
            >模板下载</a>
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button
                type="primary"
                icon="search"
                @click="tableSearchFormData"
              >查询</el-button>
              <el-button
                type="default"
                icon="circle-cross"
                @click="tableResetForm"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tip" v-if="operationalNature !== '1'">！注意：已对接“商品信息接口通知”的仓库，直接点击“通知仓库”即可进行通知‘反之，需线下通知完成后再到系统内手工“导入通知状态”；创建采购单只能添加收货仓库中“通知仓库状态”为“通知成功”的商品。</div>
      <div class="tip" v-else>！注意：创建采购单只能添加收货仓库中“通知仓库状态”为“通知成功”的商品。</div>
      <el-table
        ref="multipleTable"
        :data="tableDataList"
        highlight-current-row
        border
        tooltip-effect="dark"
        @selection-change="handleSelectionChangeTable"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column
          label="商品SKU编号"
          prop="skuCode"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="商品SKU名称"
          prop="itemName"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="white-space: pre">{{scope.row.itemName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="规格"
          prop="specNatureInfo"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="条形码"
          prop="barCode"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="white-space: pre">{{scope.row.barCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品状态"
          prop="isValid"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{checkIsValid(scope.row.isValid)}}
          </template>
        </el-table-column>
        <el-table-column
          label="仓库商品ID"
          prop="warehouseItemId"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="通知仓库状态"
          prop="noticeStatus"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.noticeStatus === 1" style="color: red">{{checkNoticeStatus(scope.row.noticeStatus)}}</div>
            <div v-else>{{checkNoticeStatus(scope.row.noticeStatus)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="最近更新时间"
          prop="updateTime"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="deleteRow(scope.row.id)"
              v-if="scope.row.noticeStatus === 0 || scope.row.noticeStatus === 1 || scope.row.noticeStatus === 2"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="openOperateDialog(scope.row.id)"
            >查看日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row class="paging">
        <el-pagination
          @size-change="changeSize"
          @current-change="changeNumber"
          :current-page="searchParams.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <div class="btn_group">
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
    </div>
    <!-- 添加商品弹窗 -->
    <el-dialog
      title="添加新商品"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        label-width="125px"
        class="search_form"
        size="medium"
      >
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item
              label="SKU名称："
              size="mini"
            >
              <el-input
                v-model.trim="form.skuName"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="商品SPU编号："
              size="mini"
            >
              <el-input
                v-model.trim="form.spuCode"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌：" size="mini">
              <el-select v-model="form.brandId" filterable placeholder="请选择">
                <el-option v-for="item in brandNameList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item
              label="条形码："
              size="mini"
            >
              <el-input
                v-model.trim="form.barCode"
                placeholder="输入多个请用英文,隔开"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="商品SKU编号："
              size="mini"
            >
              <el-input
                v-model.trim="form.skuCode"
                placeholder="输入多个请用英文,隔开"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label=""
              size="mini"
            >
              <el-button
                type="primary"
                size="mini"
                @click="searchFormData"
              >查询</el-button>
              <el-button
                size="mini"
                @click="resetForm"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tip" >！注意：已添加商品不能重复添加。</div>
      <el-table
        ref="dialogTable"
        v-loading='isLoading'
        :data="dailogTableDataList"
        border
        tooltip-effect="dark"
        height="454"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="checkSkus"
        ></el-table-column>
        <el-table-column
          prop="skuName"
          label="商品SKU名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="white-space: pre">{{scope.row.skuName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="skuCode"
          label="商品SKU编号"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="spuCode"
          label="商品SPU编号"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="specInfo"
          label="规格"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="barCode"
          label="条形码"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="white-space: pre">{{scope.row.barCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="categoryName"
          label="一级分类-二级分类-三级分类"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination
          @size-change="dialogChangeSize"
          @current-change="dialogChangeNumber"
          :current-page="form.pageNo"
          :page-sizes="[1, 10, 20, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dailogLogCount"
        >
        </el-pagination>
      </el-col>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center; margin-top: 15px;"
      >
        <el-button
          type="primary"
          size="mini"
          :disabled="isClick"
          @click="save"
        >确 定</el-button>
        <el-button
          :disabled="isClick"
          @click="dialogFormVisible = false"
          size="mini"
        >取 消</el-button>
      </div>
    </el-dialog>
    <!-- 操作日志弹窗 -->
    <el-dialog
      title="操作日志"
      :visible.sync="isLogInfo"
      width="80%"
    >
      <el-table
        :data="logInfoList"
        style="width: 100%"
        border
        height="400"
      >
        <el-table-column
          prop="operation"
          label="动作"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operateTimeString"
          label="操作时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        >
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination
          @size-change="logChangeSize"
          @current-change="logChangeNumber"
          :current-page="operateParams.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="operateParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logCount"
        >
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button
          type="primary"
          size="mini"
          @click="isLogInfo = false"
        >关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加商品弹窗 -->
    <el-dialog title="导入商品" :visible.sync="isAccount" width="60%" :close-on-click-modal='false' :show-close='false' v-loading="isImportLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="upload" v-show="isResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :data="paramsObj" drag action="/scm-web/warehouseInfo/noticeStatus" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :on-error='handleOnError'>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>导入商品成功</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>导入成功<span style="color: green">{{errorMsg.successCount}}</span>条，导入失败<span style="color: red">{{errorMsg.failCount}}</span>条!</p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="isResult === 'default' || isResult === 'fail'">
        <div style="text-align: center;">
          <el-button type="primary" @click="deloadError" size="mini" v-if="errorMsg.failCount > 0">下载失败说明</el-button>
          <el-button @click="closeFile" size="mini">关闭</el-button>
        </div>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <div style="text-align: center;">
          <el-button @click="closeFile" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'commonmanage',
  data() {
    return {
      skus: [], // 页面显示的sku
      isClick: false, // 重复点击事件
      isShow: true, // 是否显示通知仓库按钮
      paramsObj: {}, // 上传文件参数
      errorMsg: {}, // 错误信息
      isAccount: false, // 导入报价
      isResult: 'default', // 默认显示导入文件
      isTip: false,
      isLoading: false,
      isImportLoading: false,
      brandNameList: [], // 品牌列表
      dialogFormVisible: false, // 表单弹窗
      dailogTableDataList: [], // 弹窗数据列表
      multipleSelection: [], // 多选框选中的数据
      multipleSelectionTable: [], // 多选框选中的数据
      tableDataList: [], // 列表
      totalCount: 0, // 总条数
      storeTypeList: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '待通知',
          id: '0'
        },
        {
          name: '通知中',
          id: '3'
        },
        {
          name: '通知成功',
          id: '4'
        },
        {
          name: '通知失败',
          id: '1'
        },
        {
          name: '取消通知',
          id: '2'
        }
      ], // 通知仓库状态列表
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'WarehouseItemInfo',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      dailogLogCount: 0, // 弹窗总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      searchParams: {
        skuCode: '',
        itemName: '',
        barCode: '',
        noticeStatus: '',
        start: 0, //
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      form: {
        skuName: '', // 商品名称
        spuCode: '', // 条形码
        brandId: '', // 品牌名称
        barCode: '', // 条形码
        skuCode: '', // sku编号
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      }, // 弹窗表单
      id: '', // 主键
      isNoticeWarehouseItems: '', // 判断通知仓库按钮是否显示
      operationalNature: '', // 自营仓处理
      code: '', // 仓库code
      warehouseName: '', // 仓库name
      isNoticeDisabled: false // 通知仓库按钮是否置灰
    };
  },
  computed: {
    // 导入失败下载的地址
    downloadFail() {
      return './static/download/WarehouseItemInfoNoticTemplate/templateForOnlySkuCode.xls';
    }
  },
  created() {
    console.log(this.$route.query);
    let commonData = JSON.parse(window.sessionStorage.common_data);
    // this.id = this.$route.query.id;
    // this.code = this.$route.query.code;
    // this.warehouseName = this.$route.query.warehouseName;
    // this.isNoticeWarehouseItems = this.$route.query.isNoticeWarehouseItems; // 判断通知仓库按钮是否显示
    // this.operationalNature = this.$route.query.operationalNature; // 自营仓处理
    // this.paramsObj.warehouseInfoId = this.id;
    // if (this.isNoticeWarehouseItems !== '1') {
    //   this.isShow = false;
    // }
    // if (this.operationalNature === '1') {
    //   this.isShow = false;
    // }
    // this.initDataList();
    this.id = commonData.id;
    this.code = commonData.code;
    this.warehouseName = commonData.warehouseName;
    this.isNoticeWarehouseItems = commonData.isNoticeWarehouseItems; // 判断通知仓库按钮是否显示
    this.operationalNature = commonData.operationalNature; // 自营仓处理
    this.paramsObj.warehouseInfoId = this.id;
    if (this.isNoticeWarehouseItems !== '1') {
      this.isShow = false;
    }
    if (this.operationalNature === '1') {
      this.isShow = false;
    }
    this.initDataList();
  },
  methods: {
    // 导入模板
    importAccount() {
      this.isResult = 'default';
      this.errorMsg = {};
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.isAccount = true;
    },
    // 文件上传之前
    beforeAvatarUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel';
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        this.$utils.messagetip.errorTip('上传文件大小不能超过 10MB!');
      } else {
        this.isImportLoading = true;
      }
      return isLt10M;
    },
    handleOnError(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
      this.isImportLoading = false;
      let responseText = err.toString().substring(7);
      console.log(responseText);
      let result = JSON.parse(responseText);
      console.log(result);
      if (!result.result) {
        this.$utils.messagetip.warningTip(result.databuffer);
        this.isAccount = false;
        return;
      }
      this.isResult = 'fail';
      this.errorMsg = result.result;
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
      this.isImportLoading = false;
      if (response.appcode === '1') {
        this.isResult = 'success';
      } else {
        this.isResult = 'fail';
        this.$utils.messagetip.warningTip(response.databuffer);
      }
    },
    deloadError() {
      window.open('/scm-web/warehouseInfo/exceptionExcel/' + this.errorMsg.url, '_self');
    },
    // 上传关闭
    closeFile() {
      this.isAccount = false;
      this.initDataList();
    },
    checkSelectable(row, index) {
      let isSeletc = false;
      if (row.noticeStatus === 0 || row.noticeStatus === 1) {
        isSeletc = true;
      }
      console.log(row.noticeStatus);
      return isSeletc;
    },
    checkSkus(row, index) {
      console.log(row.skuCode);
      return this.skus.indexOf(row.skuCode) < 0;
    },
    addGoods() {
      this.skus = [];
      this.dialogFormVisible = true;
      this.getSkus();
    },
    // 获取页面上所有的sku
    getSkus() {
      this.$AXIOS.GET('/warehouseInfo/warehouseAllSkuCode/' + this.code).then(res => {
        this.skus = res.result;
        this.getBrandName();
        this.resetForm();
      });
    },
    exportTable() {
      window.open(
        '/scm-web/warehouseInfo/itemsExport/' +
          this.id +
          '?' +
          qs.stringify(this.searchParams)
      );
    },
    // 商品品牌
    getBrandName() {
      this.$AXIOS.GET('/productCenter/brand/all_list').then(res => {
        this.brandNameList = res.result;
      });
    },
    // 多选选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 多选选择
    handleSelectionChangeTable(val) {
      this.multipleSelectionTable = val;
    },
    // 筛选条件
    searchFormData() {
      this.form.pageSize = 10;
      this.form.pageNo = 1;
      this.form.start = 0;
      this.getDailogTableDataList(this.id);
    },
    // 重置搜索条件
    resetForm() {
      this.form = {
        skuName: '', // 商品名称
        spuCode: '', // 条形码
        brandId: '', // 品牌名称
        barCode: '', // 条形码
        skuCode: '', // sku编号
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      };
      this.getDailogTableDataList(this.id);
    },
    save() {
      if (this.multipleSelection && !this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('请先选择商品！');
        return;
      }
      let params = {};
      params.itemsList = JSON.stringify(this.multipleSelection);
      this.isClick = true;
      this.$AXIOS.POST('/warehouseInfo/saveItems/' + this.id, params).then(res => {
        this.dialogFormVisible = false;
        this.initDataList();
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 弹窗商品数据列表
    getDailogTableDataList(id) {
      this.isLoading = true;
      console.log(this.id);
      console.log(this.form);

      axios.get('/scm-web/warehouseInfo/itemsPage/' + this.id, {params: this.form}).then(res => {
        console.log('res');
        this.dailogTableDataList = res.data.result;
        this.dailogLogCount = res.data.totalCount;
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 页码条数改变
    dialogChangeSize(val) {
      this.form.start = 0;
      this.form.pageNo = 1;
      this.form.pageSize = val;
      this.getDailogTableDataList(this.id);
    },
    // 当前页码改变
    dialogChangeNumber(val) {
      this.form.pageNo = val;
      this.form.start = (val - 1) * this.form.pageSize;
      this.getDailogTableDataList(this.id);
    },
    // 获取入库通知单管理数据列表
    initDataList() {
      this.$AXIOS
        .LISTGET(
          '/warehouseInfo/warehouseItemInfoPage/' + this.code,
          this.searchParams
        )
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            }, 20);
          }
        });
    },
    // 通知仓库btn
    informWarehouseBtn(id) {
      if (this.multipleSelectionTable && !this.multipleSelectionTable.length) {
        this.$utils.messagetip.warningTip('请选择商品！');
        return;
      }
      let params = {};
      let arr = [];
      this.multipleSelectionTable.forEach(item => {
        arr.push(item.id);
      });
      params.itemIds = arr.join();
      this.$confirm('', `确认执行此操作？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.isNoticeDisabled = true;
          this.warehouseItemNoticeQimen(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 删除
    deleteRow(id) {
      this.$confirm('', `确认执行此操作？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteWarehouseItemInfo(id);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 通知仓库
    warehouseItemNoticeQimen(params) {
      this.$AXIOS.POST('/warehouseInfo/warehouseItemNoticeQimen', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
      }).finally(() => {
        this.initDataList();
        this.isNoticeDisabled = false;
      });
    },
    deleteWarehouseItemInfo(id) {
      this.$AXIOS.DELETE('/warehouseInfo/warehouseItemInfo/', id).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(res.databuffer);
      });
    },
    // 筛选条件
    tableSearchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    tableResetForm() {
      this.searchParams = {
        skuCode: '',
        itemName: '',
        barCode: '',
        noticeStatus: '',
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
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    openOperateDialog(id) {
      this.operateParams.entityId = id;
      this.getLogInfo();
      this.isLogInfo = true;
    },
    // 获取日志信息
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
    checkIsValid(isValid) {
      return this.$utils.querydiction('isValid', isValid);
    },
    checkNoticeStatus(noticeStatus) {
      return this.$utils.querydiction('noticeStatus', noticeStatus);
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/storeinfomanage' });
    }
  }
};
</script>
<style lang="stylus" scoped>
.commonmanage
  .title
    line-height: 40px
    margin-bottom: 15px
    padding-left: 15px
    background-color: #f5f5f5
    color: #333333
    border: 0
  .paging
    text-align: right
    margin-top: 15px
  .btn_group
    width: 100%
    text-align: center
    margin-top: 15px
  .tip
    line-height: 28px
    color: #cc6600
    margin-bottom: 15px
    padding-left: 15px
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
  .upload-demo
    text-align: center
</style>
<style lang="stylus">
.commonmanage
  .el-dialog
    width 1200px !important
</style>
