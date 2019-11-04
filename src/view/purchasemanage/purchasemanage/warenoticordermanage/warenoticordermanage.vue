<template>
  <div class="warenoticordermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="入库通知单编号：" size="mini">
            <el-input v-model.trim="searchParams.warehouseNoticeCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购单编号：" size="mini">
            <el-input v-model.trim="searchParams.purchaseOrderCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称：" size="mini">
            <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购类型：" size="mini">
            <el-select v-model="searchParams.purchaseType" filterable placeholder="请选择">
              <el-option v-for="item in purchaseTypeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="入库通知单状态：" size="mini">
            <el-select v-model="searchParams.warehouseNoticeStatus" filterable placeholder="请选择">
              <el-option v-for="item in warehouseNoticeStatusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近更新日期：" size="mini">
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
          <el-form-item label="仓库反馈入库单号：" size="mini">
            <el-input v-model.trim="searchParams.entryOrderId" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库仓库：" size="mini">
            <el-select v-model="searchParams.warehouseInfoCode" filterable placeholder="请选择">
              <el-option v-for="item in warehouseInfoCodeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
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
            <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" :disabled="disabledDownLoad || tableDataList.length < 1" @click="exportTableData">导出</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" ref="multipleTable" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="入库通知单编号" prop="warehouseNoticeCode" align="center" width='150'></el-table-column>
      <el-table-column label="采购单编号" prop="purchaseOrderCode" align="center" width='150'>
        <template slot-scope="scope">
          <!-- 3.1.1去掉超链接 -->
          <!-- <el-button type="text" @click="toPurchaseDetail(scope.row.purchaseOrderCode, '1', scope.row.status)">{{scope.row.purchaseOrderCode}}</el-button> -->
          {{scope.row.purchaseOrderCode}}
        </template>
      </el-table-column>
      <el-table-column label="仓库反馈单号" prop="entryOrderId" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="采购类型" prop="purchaseType" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{checkedType(scope.row.purchaseType)}}
        </template>
      </el-table-column>
      <el-table-column label="入库仓库" prop="warehouseName" align="center" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="要求到货日期" prop="requriedReceiveDate" align="center" width='140'></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'">
            <el-tooltip class="item" effect="dark" :content="scope.row.failureCause" placement="top">
              <p :class="scope.row.status === '1' ? 'isRed' : ''">{{checkedStatusList(scope.row.status)}}</p>
            </el-tooltip>
          </div>
          <div v-else-if="scope.row.status === '4'">
            <el-tooltip class="item" effect="dark" :content="scope.row.exceptionCause" placement="top">
              <p :class="scope.row.status === '4' ? 'isPurple' : ''">{{checkedStatusList(scope.row.status)}}</p>
            </el-tooltip>
          </div>
          <div v-else>
            {{checkedStatusList(scope.row.status)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="入库单创建人" prop="createOperator" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center" width='140'></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status === '0' || scope.row.status === '1'" @click="noticGood(scope.row)" :disabled="isClick">通知收货</el-button>
          <el-button size="mini" type="text" v-else-if="scope.row.status === '2'" @click="cancleDeliver(scope.row.warehouseNoticeCode)" :disabled="isClick">取消收货</el-button>
          <el-button size="mini" type="text" v-else-if="scope.row.status === '7' && scope.row.finishStatus === '0'" @click="againDeliver(scope.row.warehouseNoticeCode)" :disabled="isClick">重新收货</el-button>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width='150' show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchNo" label="批次号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productionCode" label="生产编码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productionDate" label="生产日期" align="center" width='140'></el-table-column>
          <el-table-column prop="expiredDate" label="截止保质日期" align="center" width='140'></el-table-column>
          <el-table-column prop="expiredDay" label="理论保质期限(天)" align="center"></el-table-column>
          <!-- <el-table-column prop="purchasingQuantityReal" label="采购数量" align="center"></el-table-column> -->
          <el-table-column prop="purchasingQuantity" label="期望入库数量" align="center"></el-table-column>
          <el-table-column prop="status" label="入库状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 4 || scope.row.status === 1">
                <p :class="scope.row.status === 4 || scope.row.status === 1 ? 'isRed' : ''">{{checkedStatusDetail(scope.row.status)}}</p>
              </div>
              <div v-else>
                <p class="isBlue">{{checkedStatusDetail(scope.row.status)}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="仓库反馈入库信息" align="center">
            <el-table-column prop="storageTime" label="实际入库时间" align="center" width='140'></el-table-column>
            <el-table-column prop="actualStorageQuantity" label="实际入库总量" align="center"></el-table-column>
            <el-table-column prop="normalStorageQuantity" label="正品入库数量" align="center"></el-table-column>
            <el-table-column prop="defectiveStorageQuantity" label="残次品入库数量" align="center"></el-table-column>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNo" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="2">
        <el-table  :data="fileDataList" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="附件名称" align="center">
            <template>
              <div>装箱单</div>
            </template>
          </el-table-column>
          <el-table-column prop="skuName" label="附件内容" align="center">
            <template slot-scope="scope">
              <div class='btn' @click='uploadFile(scope.row.uploadFileName)'>{{scope.row.fileName}}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 显示信息 -->
        <!-- <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">物流公司：</div>
            <div class="content">{{boxInfoDetail.logisticsCorporationName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">装箱方式：</div>
            <div class="content">{{boxInfoDetail.packingType}}</div>
          </el-col>
        </el-row>
        <el-table v-if="boxInfoDetail.purchaseBoxInfoDetailResultVOList" :data="boxInfoDetail.purchaseBoxInfoDetailResultVOList" show-summary :summary-method="getSummaries" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品SKU名称" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="商品SKU编号" align="center"></el-table-column>
          <el-table-column prop="date" label="规格" align="center"></el-table-column>
          <el-table-column prop="specNatureInfo" label="条形码" align="center"></el-table-column>
          <el-table-column label="装箱信息" align="center">
            <el-table-column prop="amountPerBox" label="数量/箱" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.amountPerBox}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="boxNumber" label="箱号" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.boxNumber}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="boxAmount" label="箱数(CTN)" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.boxAmount}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量(PCS)" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.amount}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="grossWeight" label="毛重KG" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.grossWeight}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="cartonSize" label="外箱尺寸CM" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">
                  <div v-if="item.cartonSize && item.cartonSize.length < 10">{{item.cartonSize}}</div>
                  <div v-else>
                    <el-tooltip class="item" effect="dark" :content="item.cartonSize" placement="top">
                      <div class="text_hide" style="width: 135px">{{item.cartonSize}}</div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="volume" label="体积M3" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">{{item.volume}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center">
              <template slot-scope="scope">
                <div class="border bordernone" v-for="(item, i) in scope.row.purchaseBoxInfoList" :key="i">
                  <div v-if="item.remark && item.remark.length < 10">{{item.remark}}</div>
                  <div v-else>
                    <el-tooltip class="item" effect="dark" :content="item.remark" placement="top">
                      <div class="text_hide" style="width: 135px">{{item.remark}}</div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table> -->
      </el-tab-pane>
      <el-tab-pane label="发件方信息" name="3">
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件人：</div>
            <div class="content">{{tableRowDetail.sender}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方手机：</div>
            <div class="content">{{tableRowDetail.senderNumber}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方省份.城市</div>
            <div class="content">{{tableRowDetail.senderProvince}}.{{tableRowDetail.senderCity}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">发件方详细地址：</div>
            <div class="content">{{tableRowDetail.senderAddress}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="4">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">采购合同：</div>
            <div class="content">{{tableRowDetail.purchaseOrderCode}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">归属采购组：</div>
            <div class="content">{{tableRowDetail.purchaseGroupName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">归属采购人：</div>
            <div class="content">{{tableRowDetail.purchasePersonName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">提运单号：</div>
            <div class="content">{{tableRowDetail.takeGoodsNo}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货人：</div>
            <div class="content">{{tableRowDetail.receiver}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货人手机：</div>
            <div class="content">{{tableRowDetail.receiverNumber}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="5">
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
        <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="取消收货" :visible.sync="dialogVisible" width="30%">
      <h2 style='line-height: 30px'>您确认要取消收货吗？</h2>
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
import qs from 'qs';

export default {
  name: 'warenoticordermanage',
  data() {
    return {
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        start: 0,
        pageNo: 1,
        pageSize: 10,
        detailPageflag: true,
        warehouseNoticeCode: ''
      },
      isClick: false,
      disabledDownLoad: false, // 导出
      fileDataList: [], // 上传文件列表
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'WarehouseNotice',
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
      warehouseNoticeStatusList: [
        {
          name: '全部',
          code: ''
        }
      ], // 入库通知单状态列表
      purchaseTypeList: [
        {
          name: '全部',
          value: ''
        }
      ], // 采购类型列表
      boxInfoDetail: {}, // 装箱信息
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      warehouseNoticeCode: '', // 保存的入库通知单编号
      warehouseInfoCodeList: [], // 入库仓库列表
      searchParams: {
        warehouseInfoCode: '', // 入库仓库
        warehouseNoticeCode: '', // 入库通知单编码
        purchaseOrderCode: '', // 采购订单编码
        warehouseNoticeStatus: '', // 入库通知单状态
        purchaseType: '', // 采购类型
        supplierName: '', // 供应商名称
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, //
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      } // 请求参数
    };
  },
  created() {
    if (this.$route.query.warehouseNoticeStatus !== '') {
      this.searchParams.warehouseNoticeStatus = this.$route.query.warehouseNoticeStatus;
      // window.location.reload();
    }
    this.initDataList();
    this.getPurchaseType();
    this.getWarehouseNoticeStatus();
    this.getWarehouseInfoCodeList();
  },
  methods: {
    // 导出
    exportTableData() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      this.disabledDownLoad = true;
      this.$AXIOS.EXPORT({url: '/warehouseNotice/exportWarehouseNotice', data: params, fileName: '入库通知单'}).then(res => {

      }).finally(() => {
          this.disabledDownLoad = false;
      });
    },
    uploadFile(fileName) {
      this.$AXIOS.GET('/qinniuPrivate/fileDownload', { fileName }).then(res => {
        console.log(res.result);
        // top.window.location.href = res.result;
         window.open(res.result);
      });
    },
    // 获取上传列表数据
    getUploadDataList(code) {
      this.$AXIOS.GET('/qinniuPrivate/uploadFile', { code }).then(res => {
        this.fileDataList = res.result || [];
      });
    },
    // 获取入库仓库列表
    getWarehouseInfoCodeList() {
      this.$AXIOS.GET('/warehouseInfo/selectWarehouseName').then(res => {
        this.warehouseInfoCodeList = res.result || [];
      });
    },
    // 获取入库通知单管理数据列表
    initDataList() {
      this.tableRowList = []; // 明细列表
      this.tableRowDetail = {}; // 其他信息
      this.boxInfoDetail = {}; // 装箱信息
      this.logInfoList = []; // 日志信息
      this.logCount = 0; // 日志条数
      this.$AXIOS
        .LISTGET('/warehouseNotice/warehouseNoticePage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              this.detailParams.warehouseNoticeCode = this.tableDataList[0].warehouseNoticeCode;
              // this.getWarehouseNoticeDetail(this.tableDataList[0].id);
              this.getWarehouseNoticeInfo(this.tableDataList[0].id);
              this.getUploadDataList(this.tableDataList[0].purchaseOrderCode);
              // this.getBoxInfo(this.tableDataList[0].purchaseOrderCode);
              this.operateParams.entityId = this.tableDataList[0].id;
              this.getLogInfo();
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
    // 获取入库通知单管理数据列表
    getPurchaseType() {
      this.$AXIOS.GET('/select/purchaseType').then(res => {
        this.purchaseTypeList = [...this.purchaseTypeList, ...res.result];
      });
    },
    // 通知收货接口
    putReceiptAdviceInfo(row) {
      this.$AXIOS
        .PUT('/warehouseNotice/receiptAdviceInfo/' + row.id, row, true)
        .then(res => {
          if (res.appcode === '1') {
            // this.initDataList();
            this.$utils.messagetip.successTip(res.databuffer);
          }
        }).finally(() => {
          this.initDataList();
      });
    },
    // 取消/重新发货接口
    cancelGoods(id, flag, cancelReason) {
      let params = {
        flag,
        cancelReason
      };
      this.$AXIOS.PUT('/warehouseNotice/cancel/' + id, params).then(res => {
        if (res.appcode === '1') {
          // this.dialogVisible = false;
          this.initDataList();
          this.$utils.messagetip.successTip(res.databuffer);
        }
      }).finally(() => {
        this.dialogVisible = false;
        this.isClick = false;
      });
    },
    // 获取装箱信息
    getBoxInfo(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/' + code).then(res => {
        this.boxInfoDetail = res.result;
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
    getWarehouseNoticeInfo(id) {
      this.$AXIOS
        .GET('/warehouseNotice/warehouseNoticeInfo/' + id)
        .then(res => {
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
      this.$AXIOS.LISTGET('/warehouseNotice/warehouseNoticePage', this.detailParams).then(res => {
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
    // getWarehouseNoticeDetail(warehouseNotice) {
    //   let params = {
    //     start: 0,
    //     pageIndex: 0,
    //     warehouseNotice
    //   };
    //   console.log('object');
    //   this.$AXIOS
    //     .LISTGET('/warehouseNotice/warehouseNoticeDetail', params)
    //     .then(res => {
    //       console.log(res);
    //       this.tableRowList = res;
    //     });
    // },
    // 取消发货
    cancleDeliver(warehouseNoticeCode) {
      this.dialogVisible = true;
      this.textarea = '';
      this.warehouseNoticeCode = warehouseNoticeCode;
    },
    makeSureCancle() {
      if (!this.textarea) {
        this.$utils.messagetip.warningTip('请输入取消原因');
        return;
      }
      this.cancelGoods(this.warehouseNoticeCode, '0', this.textarea);
    },
    // 重新发货
    againDeliver(warehouseNoticeCode) {
      this.isClick = true;
      this.$confirm(`确认后将通知仓库重新收货。`, `您确认要重新发货吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.cancelGoods(warehouseNoticeCode, '1', '');
        })
        .catch(() => {
          this.isClick = false;
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击通知发货
    noticGood(row) {
      this.$confirm(`确认后将向仓库发送入库通知单。`, `您确认要通知收货吗?`, {
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
      this.detailParams.warehouseNoticeCode = row.warehouseNoticeCode;
      this.getWarehouseNoticeInfo(row.id);
      // this.getWarehouseNoticeDetail(row.id);
      this.getUploadDataList(row.purchaseOrderCode);
      // this.getBoxInfo(row.purchaseOrderCode);
      this.operateParams.entityId = row.id;
      this.getLogInfo();
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
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        warehouseInfoCode: '', // 入库仓库
        warehouseNoticeCode: '', // 入库通知单编码
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
      let statusStr = '';
      if (status === '0') {
        statusStr = '待通知收货';
      } else if (status === '1') {
        statusStr = '仓库接收失败';
      } else if (status === '2') {
        statusStr = '仓库接收成功';
      } else if (status === '3') {
        statusStr = '全部入库';
      } else if (status === '4') {
        statusStr = '入库异常';
      } else if (status === '5') {
        statusStr = '部分入库';
      } else if (status === '6') {
        statusStr = '已取消';
      } else if (status === '7') {
        statusStr = '已取消';
      } else if (status === '8') {
        statusStr = '取消中';
      }
      return statusStr;
    },
    // 状态翻译
    checkedStatusDetail(status) {
      let statusStr = '';
      if (status === 0) {
        statusStr = '待通知收货';
      } else if (status === 1) {
        statusStr = '仓库接收失败';
      } else if (status === 2) {
        statusStr = '仓库接收成功';
      } else if (status === 3) {
        statusStr = '全部入库';
      } else if (status === 4) {
        statusStr = '入库异常';
      } else if (status === 5) {
        statusStr = '部分入库';
      } else if (status === 6) {
        statusStr = '已取消';
      } else if (status === 7) {
        statusStr = '已取消';
      } else if (status === 8) {
        statusStr = '取消中';
      }
      return statusStr;
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
.warenoticordermanage
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
