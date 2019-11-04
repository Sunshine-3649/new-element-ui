<template>
  <div class="transorderaddoredit">
    <!-- 表单 -->
    <div style="line-height: 40px;">{{$route.params.id !== 'add1' ? '编辑调拨单' : '新增调拨单'}}</div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="150px" class="search_form" size="medium">
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="调拨单编号"  size="mini">
              {{searchParams.allocateOrderCode ? searchParams.allocateOrderCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="调出仓库：" prop="outWarehouseCode" size="mini">
              <el-select v-model="searchParams.outWarehouseCode" filterable placeholder="请选择" @change="warehouseCodeChangeOut">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调入仓库：" prop="inWarehouseCode" size="mini">
              <el-select v-model="searchParams.inWarehouseCode" filterable placeholder="请选择" @change="warehouseCodeChangeIn">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="备注：" prop="memo" size="mini">
              <el-input v-model.trim="searchParams.memo" type="textarea" :rows="2" placeholder="不超过500个字符" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>收发件人信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="150px" class="search_form" size="medium">
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="发件人：" prop="sender" size="mini">
              <el-input v-model.trim="searchParams.sender" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发件人手机：" prop="senderMobile" size="mini">
              <el-input v-model.trim="searchParams.senderMobile" placeholder="" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发件方省份.城市.区域" prop="senderAddress" size="mini">
              <el-cascader
                disabled
                :options="cityOptions"
                v-model="selectedSender"
                filterable
                separator="-"
                placeholder="请选择省,市,区"
                @change="handleCityChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发件方详细地址：" prop="senderAddress" size="mini">
              <el-input v-model.trim="searchParams.senderAddress" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="收件人：" prop="receiver" size="mini">
              <el-input v-model.trim="searchParams.receiver" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收件人手机：" prop="receiverMobile" size="mini">
              <el-input v-model.trim="searchParams.receiverMobile" placeholder="" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收件方省份.城市.区域" prop="receiverAddress" size="mini">
              <el-cascader
                disabled
                :options="cityOptions"
                v-model="selectedReceiver"
                filterable
                separator="-"
                placeholder="请选择省,市,区"
                @change="handleCityChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收件方详细地址：" prop="receiverAddress" size="mini">
              <el-input v-model.trim="searchParams.receiverAddress" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 商品明细 -->
    <el-card class="box-card" style="margin-top: 15px;">
      <div slot="header" class="clearfix">
        <span>商品明细</span>
      </div>
      <el-button type="primary" size="mini" @click="addGoods"> + 选择调拨商品</el-button>
      <el-button type="primary" size="mini" @click="importGood">导入商品</el-button>
      <el-button type="text" size="mini">
        <a :href="downloadDefault">模板下载</a>
      </el-button>
      <div style="width: 100%;">
        <el-table class="price_list" :data="tableDataList.slice((addOrEditParams.pageNo-1)*addOrEditParams.pageSize,addOrEditParams.pageNo*addOrEditParams.pageSize)"  border >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品SKU名称" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140"></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuNo" label="货号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inventoryType" label="库存类型" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- :disabled="isDisableIn || isDisableOut" 去掉京东仓校验 -->
              <el-select v-model="scope.row.inventoryType" filterable placeholder="请选择" size="mini" @change="inventoryChange" >
                <el-option v-for="item in inventoryTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="inventoryNum" label="调出仓库实时库存" align="center" >
            <template slot-scope="scope">
              <div v-if="scope.row.inventoryNum || scope.row.inventoryNum === 0 || scope.row.inventoryNum === '0'">{{scope.row.inventoryNum}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="planAllocateNum" label="调拨数量" align="center" >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.planAllocateNum" placeholder="" size="mini" maxlength="6"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteBtn((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="paging">
          <el-pagination
            @size-change="changeSize"
            @current-change="changeNumber"
            :current-page="addOrEditParams.pageNo"
            :page-sizes="[10, 100, 200, 500, 1000, 2000]"
            :page-size="addOrEditParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="addOrEditParams.totalCount"
          >
          </el-pagination>
        </el-row>
      </div>
    </el-card>
    <!-- 自采商品管理列表 弹窗 -->
    <el-dialog title="选择调拨商品" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="SKU名称：" size="mini">
              <el-input v-model.trim="form.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SKU编号：" size="mini">
              <el-input v-model.trim="form.skuCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称：" size="mini">
              <el-select v-model="form.brandId" filterable placeholder="请选择">
                <el-option v-for="item in brandNameList" :key="item.brandCode" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="商品货号：" size="mini">
              <el-input v-model.trim="form.itemNo" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="条形码：" size="mini">
              <el-input v-model.trim="form.barCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" size="mini">
              <el-button type="primary" size="mini" @click="searchFormData">查询</el-button>
              <el-button size="mini" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tip" v-show="isTip">
        满足下列条件的商品才显示：商品未被添加过 <span style="float: right;padding: 0 10px;cursor: pointer;"  @click="isTip = false">X</span>
      </div>
      <el-table ref="dialogTable" v-loading='isLoading' :data="dailogTableDataList" border tooltip-effect="dark" height="454" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品SKU名称" align="center"></el-table-column>
        <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140"></el-table-column>
        <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skuNo" label="货号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="allCategoryName" label="一级分类/二级分类/三级分类" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="form.pageNo" :page-sizes="[1, 10, 20, 50, 100]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
        </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeSureAddGoods" size="mini" :disabled="isClick">确 定</el-button>
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入采购商品弹窗 -->
    <el-dialog title="导入商品" :visible.sync="isShopGood" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='loading' @close='closeDialog'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :data='goodsParams' :on-error='uploadError' drag action='/scm-web/allocateOrder/importSkus' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div v-show="isGoodResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>导入成功</p>
      </div>
      <div v-show="isGoodResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
        <p>请点此
          <!-- <span @click="downloadFail(errorJson)" style="color: red;cursor: pointer;">下载文件</span> -->
          <el-button type="text" @click="downloadFail(errorJson)" icon="circle-cross" :disabled="disabledDownLoad" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer" >
        <div style="text-align: center;">
          <el-button @click="closeGoodUpload" size="mini" :disabled="isClick">关闭</el-button>
        </div>
      </span>
    </el-dialog>

    <div class="btn_group">
      <el-button type="primary" size="mini"  @click="submitAuditBtn" :disabled="isSubmit">提交审核</el-button>
      <el-button size="mini"  @click="saveBtn" :disabled="isSubmit">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
    <a id="downlink"></a>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
import { pca, pcaa } from 'area-data'; // v5 or higher
// 引入xlsx
let XLSX = require('xlsx');
export default {
  name: 'transorderaddoredit',
  data() {
    return {
      addOrEditParams: {
        start: 0, // 默认参数
        pageSize: 500, // 默认500条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      isQuery: false, // 请求数据只请求一次
      deleteIdList: [], // 删除的列表
      isDisableIn: false, // 是否是京东仓
      isDisableOut: false, // 是否是京东仓
      cityOptions: [], // 城市列表
      disabledDownLoad: false,
      isClick: false, // 关闭按钮可点
      isLoading: false, // loading
      inventoryTypeList: [
        {
          id: '1',
          name: '正品'
        },
        {
          id: '2',
          name: '残品'
        }
      ],
      warehouseList: [], // 仓库列表
      tableData: [],
      isTip: true, //
      loading: false, // 上传loading
      outFile: '', // 导出文件el
      errorJson: [], // 错误的列表数据
      goodsParams: {}, // 导入商品时额外的参数
      fileId: '', // 要删除的文件id
      isSubmit: false, // 防止多次点击
      currentIndex: '', // 要删除的index
      fileDataList: [], // 上传文件列表
      uploadResult: {}, // 上传成功返回的响应数据
      errorMsg: '', // 错误信息
      isResult: 'default', // 默认显示导入文件
      isGoodResult: 'default', // 默认显示导入商品明细
      isAccount: false, // 导入报价
      isShopGood: false, // 导入商品明细
      totalFeeD: 0,
      purchaseCount: 0, // 采购数量
      selectedReceiver: [], // 收货选中地址
      selectedSender: [], // 发货城市列表
      logCount: 0, // 表单列表总条数
      form: {
        skuName: '', // 商品名称
        skuCode: '', // sku编号
        barCode: '', // 条形码
        brandId: '', // 品牌名称
        itemNo: '', // 货号
        isValid: '1', // 默认值
        warehouseInfoInId: '', // 调入仓库
        warehouseInfoOutId: '', // 调出仓库
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      }, // 弹窗表单
      id: '', // 主键
      dialogFormVisible: false, // 表单弹窗
      dailogTableDataList: [], // 弹窗数据列表
      multipleSelection: [], // 多选框选中的数据
      brandNameList: [], // 品牌下拉列表
      supplierCodeList: [], // 供应商名称下拉列表
      purchaseTypeList: [], // 采购类型下拉列表
      payTypeList: [], // 付款方式下拉列表
      purchaseGroupCodeList: [], // 归属采购组下拉列表
      purchasePersonIdList: [], // 归属采购人下拉列表
      warehouseCodeList: [], // 收货仓库下拉列表
      currencyTypeList: [], // 币制下拉列表
      handlerPriorityList: [], // 处理优先级下拉列表
      transportFeeDestIdList: [], // 运输费用承担方下拉列表
      tableDataList: [], // 列表数据
      searchParams: {
        outWarehouseCode: '', // 出库仓库
        inWarehouseCode: '', // 入库仓库
        memo: '', // 备注
        sender: '', // 发件人
        senderMobile: '', // 发件人手机
        senderAddress: '', // 发件人详细地址
        receiver: '', // 收件人
        receiverMobile: '', // 收件人手机
        receiverAddress: '' // 收件人详细地址
      },
      rules: {
        outWarehouseCode: [
          { required: true, message: '请选择调出仓库！', trigger: 'blur' }
        ],
        inWarehouseCode: [
          { required: true, message: '请选择调入仓库!', trigger: 'blur' }
        ],
        sender: [
          { required: true, message: '发件人不能为空!', trigger: 'blur' }
        ],
        senderMobile: [
          { required: true, message: '发件人手机不能为空!', trigger: 'blur' }
        ],
        senderAddress: [
          { required: true, message: '发件方详细地址不能为空!', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '收件人不能为空!', trigger: 'blur' }
        ],
        receiverMobile: [
          { required: true, message: '收件人手机不能为空!', trigger: 'blur' }
        ],
        receiverAddress: [
          { required: true, message: '收件方详细地址不能为空!', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    totalFeeD(n, o) {
      this.searchFormData.totalFeeD = n;
    },
    purchaseCount(n, o) {
      this.searchFormData.purchaseCount = n;
    }
  },
  computed: {
    // 模板的下载地址
    downloadDefault() {
      return (
        '/scm-web/allocateOrder/exampleExport'
      );
    }
  },
  mounted() {
    this.outFile = document.getElementById('downlink');
  },
  created() {
    // 初始化城市列表
    let citys = window.localStorage.city ? JSON.parse(window.localStorage.city) : '';
    this.cityOptions = citys.map(item => {
        return {
            label: item.text,
            value: item.id,
            children: item.children
            ? item.children.map((item1, index1, now1) => {
                    return {
                        label: item1.text,
                        value: item1.id,
                        children: item1.children
                        ? item1.children.map((item2, index2, now2) => {
                                return {
                                    label: item2.text,
                                    value: item2.id
                                };
                            })
                        : ''
                    };
                })
            : ''
        };
    });
    console.log(this.$route.params);
    this.getPurchaseType();  // 仓库列表
    if (this.$route.params.id !== 'add1') {
      this.allocateOrderCode = this.$route.params.id;
    }
    this.getbrandNameList();
  },
  filters: {
    tofixed(val) {
      let num = val.toString();
      if (num.indexOf('.') > -1 && num.split('.')[1].length > 3) {
        num = Number(num).toFixed(3);
        return num;
      }
      return num;
    }
  },
  methods: {
    changeSize(val) {
      this.addOrEditParams.start = 0;
      this.addOrEditParams.pageNo = 1;
      this.addOrEditParams.pageSize = val;
    },
    changeNumber(val) {
      this.addOrEditParams.start = (val - 1) * this.addOrEditParams.pageSize;
      this.addOrEditParams.pageNo = val;
    },
    handleCityChange(val) {
        this.searchParams.province = val[0];
        this.searchParams.city = val[1];
        this.searchParams.area = val[2];
    },
    // 品牌下拉列表
    getbrandNameList() {
      this.$AXIOS.GET('/productCenter/brand/all_list').then(res => {
        this.brandNameList = res.result;
      });
    },
    // 切换单选按钮
    radioChange(i, radio) {
      if (radio === '1') {
        this.$set(this.tableDataList[i], 'inPrice', '');
      }
    },
    // input 聚焦
    changeRadio(i) {
      console.log(i);
      this.$set(this.tableDataList[i], 'priceFlag', '0');
    },
    moduleDownLoad(url) {
      axios({ // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
        'Content-Type': 'application/json'
        }
      }).then(res => { // 处理返回的文件流
        const blob = new Blob([res.data]);// new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = '异常数据.xls';// 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.disabledDownLoad = false;
      });
    },
    // 库存类别翻译
    checkStockType(val) {
      let typeStr = '';
      if (val === 1) {
        typeStr = '启用';
      } else if (val === 0) {
        typeStr = '停用';
      }
      return typeStr;
    },
    inventoryChange() {
      // let params = {warehouseCode: this.searchParams.warehouseCode};
      // params.skuCode = this.tableDataList[i].skuCode;
      // params.inventoryType = this.tableDataList[i].inventoryType;
      // params.index = i;

      let params = {warehouseCode: this.searchParams.outWarehouseCode};
      let arr = [];
      if (this.tableDataList && !this.tableDataList.length) {
        return;
      }
      this.tableDataList.forEach(item => {
          let obj = {};
          obj.skuCode = item.skuCode;
          obj.inventoryType = item.inventoryType;
          arr.push(obj);
        });
      params.queryStr = JSON.stringify(arr);
      this.inventoryQuery(params);
    },
    inventoryQuery(params) {
      // this.$AXIOS.GET('/OtherOutIn/getSkuInventory', params).then(res => {
      //   console.log(res);
      //   this.$set(this.tableDataList[params.index], 'inventoryNum', res.result);
      // });
      this.$AXIOS.POST('/allocateOrder/inventoryQuery/' + params.warehouseCode, params, true).then(res => {
        for (const key in res.result) {
          console.log(key);
          console.log(res.result[key]);
          this.tableDataList.forEach((item, i) => {
            if (key === item.skuCode) {
              // this.$nextTick(() => {
                this.$set(this.tableDataList[i], 'inventoryNum', res.result[key]);
              // });
            }
          });
        }
        this.$set(this.tableDataList, 0, this.tableDataList[0]);
        console.log('this.tableDataList', this.tableDataList);
      });
    },
    // 更改仓库
    warehouseCodeChangeOut(val) {
      console.log(val);
      if (val) {
        if (val === this.searchParams.inWarehouseCode) {
          this.$message({
            type: 'warning',
            message: '调入仓库和调出仓库不能相同！'
          });
        }
        if (this.tableDataList && this.tableDataList.length) {
          this.tableDataList.forEach(item => {
            if (item.id) {
              this.deleteIdList.push(item.id);
            }
          });
        }
        this.tableDataList = [];
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.warehouseList.forEach(item => {
          if (this.searchParams.outWarehouseCode === item.code) {
            this.selectedSender = [item.province, item.city, item.area];
            this.searchParams.senderAddress = item.address;
            this.isDisableOut = item.operationalNature === '0';
          }
        });
        // if (this.isDisableOut) {
        //   this.inventoryTypeList = [{
        //     id: '1',
        //     name: '正品'
        //   }];
        // } else {
        //   this.inventoryTypeList = [
        //     {
        //       id: '1',
        //       name: '正品'
        //     },
        //     {
        //       id: '2',
        //       name: '残品'
        //     }
        //   ];
        // }
      }
    },
    warehouseCodeChangeIn(val) {
      console.log(val);
      if (val) {
        if (val === this.searchParams.outWarehouseCode) {
          this.$message({
            type: 'warning',
            message: '调入仓库和调出仓库不能相同！'
          });
        }
        if (this.tableDataList && this.tableDataList.length) {
          this.tableDataList.forEach(item => {
            if (item.id) {
              this.deleteIdList.push(item.id);
            }
          });
        }
        this.tableDataList = [];
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.warehouseList.forEach(item => {
          if (this.searchParams.inWarehouseCode === item.code) {
            this.selectedReceiver = [item.province, item.city, item.area];
            this.searchParams.receiverAddress = item.address;
            this.isDisableIn = item.operationalNature === '0';
          }
        });
        // if (this.isDisableIn) {
        //   this.inventoryTypeList = [{
        //     id: '1',
        //     name: '正品'
        //   }];
        // } else {
        //   this.inventoryTypeList = [
        //     {
        //       id: '1',
        //       name: '正品'
        //     },
        //     {
        //       id: '2',
        //       name: '残品'
        //     }
        //   ];
        // }
      }
    },
    // 仓库列表
    getPurchaseType() {
      this.$AXIOS.GET('/purchase/warehouse').then(res => {
        this.warehouseList = [...this.warehouseList, ...res.result];
        if (this.$route.params.id !== 'add1' && !this.isQuery) {
          this.getSearchParams();
        }
      });
    },
    downloadExl: function(json, downName, type) {
      // 导出到excel
      let keyMap = []; // 获取键
      for (let k in json[0]) {
        keyMap.push(k);
      }
      console.info('keyMap', keyMap, json);
      let tmpdata = []; // 用来保存转换好的json
      json
        .map((v, i) =>
          keyMap.map((k, j) =>
            Object.assign(
              {},
              {
                v: v[k],
                position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
              }
            )
          )
        )
        .reduce((prev, next) => prev.concat(next))
        .forEach(function(v) {
          tmpdata[v.position] = {
            v: v.v
          };
        });
      let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
      let tmpWB = {
        SheetNames: ['mySheet'], // 保存的表标题
        Sheets: {
          mySheet: Object.assign(
            {},
            tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            }
          )
        }
      };
      let tmpDown = new Blob(
        [
          this.s2ab(
            XLSX.write(
              tmpWB,
              { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
            )
          )
        ],
        {
          type: ''
        }
      ); // 创建二进制对象写入转换好的字节流
      let href = URL.createObjectURL(tmpDown); // 创建对象超链接
      this.outFile.download = downName + '.xlsx'; // 下载名称
      this.outFile.href = href; // 绑定a标签
      this.outFile.click(); // 模拟点击实现下载
      setTimeout(function() {
        // 延时释放
        URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
      }, 100);
    },
    s2ab: function(s) {
      // 字符串转字符流
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    downloadFail(errorJson) {
      this.disabledDownLoad = true;
      this.$AXIOS.POST('/allocateOrder/errors', {errors: errorJson}).then(res => {
        let url = '/scm-web/allocateOrder/errorExport?errorsKey=' + res.result;
        this.moduleDownLoad(url);
      });
    },
    // downloadFail(rs) {
    //   // 点击导出按钮
    //   let data = [{}];
    //   for (let k in rs[0]) {
    //     data[0][k] = k;
    //   }
    //   data = data.concat(rs);
    //   this.downloadExl(data, '采购单错误商品明细');
    // },
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
    uploadError(err, file, fileList) {
      this.loading = false;
      console.log(err);
      let obj = err.toString().substr(err.toString().indexOf('{'));
      let objErr = JSON.parse(obj);
      this.$message({
        message: objErr.databuffer,
        type: 'error'
      });
      this.isShopGood = false;
    },
    // 文件上传之前
    beforeAvatarUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel';
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return isLt10M;
    },
    // 导入模板
    importAccount(index) {
      this.isResult = 'default';
      this.uploadResult = {};
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.isAccount = true;
      this.currentIndex = index;
      console.log(this.fileDataList[index].id);
      if (this.fileDataList[index].id) {
        this.fileId = this.fileDataList[index].id;
      }
      this.getbrandNameList();
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
      if (response.success) {
        this.uploadResult = response;
        this.isResult = 'success';
      } else {
        this.isResult = 'fail';
        this.errorMsg = response.errorMsg;
        this.$message({
          type: 'warning',
          message: response.errorMsg
        });
      }
    },
    // 导入商品btn
    importGood() {
      if (!this.searchParams.outWarehouseCode) {
        this.$message({
          type: 'warning',
          message: '请选择调出仓库！'
        });
        return;
      }
      if (!this.searchParams.inWarehouseCode) {
        this.$message({
          type: 'warning',
          message: '请选择调入仓库！'
        });
        return;
      }
      this.isGoodResult = 'default';
      let arr = [];
      this.uploadResult = {};
      if (this.$refs.uploadGood) {
        this.$refs.uploadGood.clearFiles();
      }
      this.tableDataList.forEach(item => {
        arr.push({skuCode: item.skuCode});
      });
      let objParams = {
        outWhCode: this.searchParams.outWarehouseCode,
        inWhCode: this.searchParams.inWarehouseCode,
        skuDetailList: JSON.stringify(arr)
      };
      this.goodsParams = objParams;
      this.isClick = false;
      this.isShopGood = true;
      console.log(this.goodsParams);
    },
    // 文件上传中
    uploadProgress(event, file, fileList) {
      this.loading = true;
    },
    // 商品上传成功
    uploadGoodSuccess(response, file, fileList) {
      console.log('上传成功');
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.loading = false;
      if (response.appcode === '1' && response.result.errorList && !response.result.errorList.length ) {
        this.uploadResult = response.result;
        this.isGoodResult = 'success';
      } else {
        this.uploadResult = response.result;
        let successNum = response.result.rightList ? response.result.rightList.length : 0;
        let errorNum = response.result.errorList.length ? response.result.errorList.length : 0;
        this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
        let errorList = response.result.errorList;
        // errorList.forEach(item => {
        //   let obj = {
        //     'SKU编号': item.skuCode,
        //     '含税单价(元)': item.purchasePrice,
        //     '采购税率%': item.taxRate,
        //     '采购数量': item.purchasingQuantity,
        //     '批次号': item.batchCode,
        //     '生产编号': item.produceCode,
        //     '错误提示信息': item.errorMsg
        //   };
        //   this.errorJson.push(obj);
        // });
        this.errorJson = JSON.stringify(errorList);
        this.isGoodResult = 'fail';
        // this.errorJson = errorList;
        this.$message({
          type: 'warning',
          message: response.databuffer
        });
      }
    },
    closeGoodUpload() {
      this.isClick = true;
      if (this.uploadResult.rightList && this.uploadResult.rightList.length) {
        this.uploadResult.rightList.forEach(item => {
          item.id = '';
        });
        this.tableDataList = [...this.tableDataList, ...this.uploadResult.rightList];
      }
      this.addOrEditParams.totalCount = this.tableDataList.length;
      this.changeNumber(1);
      this.tableDataList.forEach(item => {
        item.inventoryType = item.inventoryType || '1'; // 出入库类型
        if (item.inventoryNum === 0 || item.inventoryNum === '0') {
          item.inventoryNum = 0;
        } else {
          item.inventoryNum = item.inventoryNum || '';
        }
      });
      this.isShopGood = false;
      setTimeout(() => {
        this.inventoryChange(); // 实时查询
      }, 500);
    },
    // 模态框关闭
    closeDialog() {
      console.log(132);
    },
    // 获取出入库单信息
    getSearchParams() {
      this.$AXIOS.GET('/allocateOrder/editGet/' + this.allocateOrderCode + '?flag=1').then(res => {
        this.isQuery = true;
        this.searchParams = res.result;
        this.tableDataList = res.result.skuDetailList || [];
        this.addOrEditParams.totalCount = this.tableDataList.length;
        // if (this.searchParams.receiverProvince && this.searchParams.receiverCity && this.searchParams.receiverArea) {
          this.selectedReceiver = [this.searchParams.receiverProvince, this.searchParams.receiverCity, this.searchParams.receiverArea];
        // }
        // if (this.searchParams.senderProvince && this.searchParams.senderCity && this.searchParams.senderArea) {
          this.selectedSender = [this.searchParams.senderProvince, this.searchParams.senderCity, this.searchParams.senderArea];
        // }
        let isInCode = true; // 调入仓库
        let isOutCode = true;  // 调出仓库
        this.warehouseList.forEach(item => {
          if (this.searchParams.outWarehouseCode === item.code) {
            this.isDisableOut = item.operationalNature === '0';
            isOutCode = false;
          }
          if (this.searchParams.inWarehouseCode === item.code) {
            this.isDisableIn = item.operationalNature === '0';
            isInCode = false;
          }
        });
        // if (this.isDisableOut || this.isDisableIn) {
        //   this.inventoryTypeList = [{
        //     id: '1',
        //     name: '正品'
        //   }];
        // } else {
        //   this.inventoryTypeList = [
        //     {
        //       id: '1',
        //       name: '正品'
        //     },
        //     {
        //       id: '2',
        //       name: '残品'
        //     }
        //   ];
        // }
        if (isOutCode) {
          this.searchParams.outWarehouseCode = '';
        }
        if (isInCode) {
          this.searchParams.inWarehouseCode = '';
        }
        if (isOutCode) {
          this.$message({
            type: 'warning',
            message: '调出仓库已被停用，请重新选择'
          });
          return;
        }
        if (isInCode) {
          this.$message({
            type: 'warning',
            message: '调入仓库已被停用，请重新选择'
          });
          return;
        }
        setTimeout(() => {
          this.inventoryChange(); // 实时查询
        }, 1000);
      });
    },
    // 提交审核
    submitAudit(params) {
      this.isSubmit = true;
      this.$AXIOS.POST('/allocateOrder/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/transordermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 直接提交审核,没有编辑
    submitAuditNoId(params) {
      this.isSubmit = true;
      this.$AXIOS.POST('/allocateOrder/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/transordermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 弹窗商品数据列表
    getDailogTableDataList(params) {
      this.isLoading = true;
      // this.$AXIOS.POST('/allocateOrder/skuPage', params).then(res => {
      axios.post('/scm-web/allocateOrder/skuPage', qs.stringify(params)).then(res => {
        console.log(res);
        this.dailogTableDataList = res.data.result;
        this.logCount = res.data.totalCount;
      }).catch(error => {
        this.$message.error(error.response.data.databuffer);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 保存数据接口
    savePurchaseOrder(params) {
      this.$AXIOS.POST('/allocateOrder/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/transordermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 保存数据接口(有id)
    savePutPurchaseOrder(params) {
      this.$AXIOS.POST('/allocateOrder/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/transordermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 选择归属采购组
    purchaseGroupCodeChange(val) {
      if (val) {
        this.getPurchasePersonIdList(val);
      } else {
        this.purchasePersonIdList = [];
      }
    },
    // 多选选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加商品
    addGoods() {
      if (!this.searchParams.outWarehouseCode) {
        this.$message({
          type: 'warning',
          message: '请先选择调出仓库！'
        });
        return;
      }
      if (!this.searchParams.inWarehouseCode) {
        this.$message({
          type: 'warning',
          message: '请先选择调入仓库！'
        });
        return;
      }
      if (this.searchParams.inWarehouseCode && this.searchParams.inWarehouseCode && this.searchParams.inWarehouseCode === this.searchParams.outWarehouseCode) {
        this.$message({
          type: 'warning',
          message: '调入仓库和调出仓库不能相同！'
        });
        return;
      }
      this.dailogTableDataList = [];
      this.logCount = 0;
      this.isClick = false;
      this.form.warehouseInfoInId = this.searchParams.inWarehouseCode;
      this.form.warehouseInfoOutId = this.searchParams.outWarehouseCode;
      console.log(this.form);
      this.getbrandNameList();
      this.resetForm();
      this.dialogFormVisible = true;
      this.isTip = true;
    },
    // 页码条数改变
    logChangeSize(val) {
      this.form.start = 0;
      this.form.pageNo = 1;
      this.form.pageSize = val;
      this.getDailogTableDataList(this.form);
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.form.pageNo = val;
      this.form.start = (val - 1) * this.form.pageSize;
      this.getDailogTableDataList(this.form);
    },
    // 筛选条件
    searchFormData() {
      this.form.pageSize = 10;
      this.form.pageNo = 1;
      this.form.start = 0;
      // if (this.form.warehouseCode) {
      //   this.warehouseCodeList.forEach(item => {
      //     if (item.code === this.form.warehouseCode) {
      //       this.form.warehouseInfoId = item.id;
      //     }
      //   });
      // }
      this.getDailogTableDataList(this.form);
    },
    // 重置搜索条件
    resetForm() {
      this.form = {
        skus: '', // 已存在的skuCode
        skuName: '', // 商品名称
        skuCode: '', // sku编号
        barCode: '', // 条形码
        brandId: '', // 品牌名称
        itemNo: '', // 货号
        isValid: '1', // 默认值
        warehouseInfoInId: '', // 调入仓库
        warehouseInfoOutId: '', // 调出仓库
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      };
      this.form.warehouseInfoInId = this.searchParams.inWarehouseCode;
      this.form.warehouseInfoOutId = this.searchParams.outWarehouseCode;
      let arr = [];
      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          arr.push(item.skuCode);
        });
      }
      this.form.skus = arr.join();
      this.getDailogTableDataList(this.form);
    },
    // 确认按钮
    makeSureAddGoods() {
      if (this.multipleSelection && !this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请选择商品！'
        });
        return;
      }
      this.isClick = true;
      this.tableDataList = [...this.tableDataList, ...this.multipleSelection];
      this.addOrEditParams.totalCount = this.tableDataList.length;
      this.changeNumber(1);
      this.tableDataList.forEach(item => {
        item.inventoryType = item.inventoryType || '1'; // 出入库类型
        if (item.inventoryNum === 0 || item.inventoryNum === '0') {
          item.inventoryNum = 0;
        } else {
          item.inventoryNum = item.inventoryNum || '';
        }
      });
      this.dialogFormVisible = false;
      setTimeout(() => {
        this.inventoryChange(); // 实时查询
      }, 1000);
    },
    // 保存按钮
    saveBtn() {
      if (!this.searchParams.outWarehouseCode) {
        this.$message({
          message: '请先选择调出仓库!',
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.inWarehouseCode) {
        this.$message({
          message: '请先选择调入仓库!',
          type: 'warning'
        });
        return;
      }
      let params = {};
      params.skuDetailList = JSON.stringify(this.tableDataList);
      params.outWarehouseCode = this.searchParams.outWarehouseCode;
      if (this.searchParams.allocateOrderCode) {
        params.allocateOrderCode = this.searchParams.allocateOrderCode;
      }
      let numReg = /^[0-9]+$/;
      let skuCode = '';
      let isNull = false; // 为空
      let isType = false; // 格式
      let isMore = false; // 大于
      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          if (item.planAllocateNum && !numReg.test(item.planAllocateNum) && !skuCode) {
            isType = true;
            skuCode = item.skuCode;
          }
          // if (item.planAllocateNum === 0 || item.planAllocateNum === '0') {
          //   isType = true;
          //   skuCode = item.skuCode;
          // }
        });
      }
      if (isType) {
        this.$message({
          message: `skuCode为${skuCode}的调拨数量格式只能为正整数！`,
          type: 'warning'
        });
        return;
      }
      params.inWarehouseCode = this.searchParams.inWarehouseCode;
      params.memo = this.searchParams.memo;
      params.sender = this.searchParams.sender;
      params.senderMobile = this.searchParams.senderMobile;
      params.receiver = this.searchParams.receiver;
      params.receiverMobile = this.searchParams.receiverMobile;
      let arr = [];
      this.deleteIdList.forEach(item => {
        if (arr.indexOf(item) < 0) {
          arr.push(item);
        }
      });
      params.delsIds = arr.join();

      this.isSubmit = true;
      console.log(this.tableDataList);
      if (this.searchParams.allocateOrderCode) {
        this.savePutPurchaseOrder(params);
      } else {
        this.savePurchaseOrder(params);
      }
    },
    // 提交审核按钮
    submitAuditBtn() {
      // 格式校验
      if (!this.searchParams.outWarehouseCode) {
        this.$message({
          message: '请先选择调出仓库!',
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.inWarehouseCode) {
        this.$message({
          message: '请先选择调入仓库!',
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.sender) {
        this.$message({
          message: '发件人不能为空!',
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.senderMobile) {
        this.$message({
          message: '发件人手机不能为空!',
          type: 'warning'
        });
        return;
      }
      let numReg = /^[0-9]+$/;
      let typeReg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
      if (this.searchParams.senderMobile.length !== 11 || !numReg.test(this.searchParams.senderMobile) || !typeReg.test(this.searchParams.senderMobile)) {
        this.$message({
          message: `发件人手机格式不正确！`,
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.receiver) {
        this.$message({
          message: '收件人不能为空!',
          type: 'warning'
        });
        return;
      }
      if (!this.searchParams.receiverMobile) {
        this.$message({
          message: '收件人手机不能为空!',
          type: 'warning'
        });
        return;
      }
      if (this.searchParams.receiverMobile.length !== 11 || !numReg.test(this.searchParams.receiverMobile) || !typeReg.test(this.searchParams.receiverMobile)) {
        this.$message({
          message: `收件人手机格式不正确！`,
          type: 'warning'
        });
        return;
      }
      if (this.tableDataList && !this.tableDataList.length) {
        this.$message({
          message: '请先选择调拨商品!',
          type: 'warning'
        });
        return;
      }
      let numReg1 = /^[0-9.]+$/;
      let skuCode = '';
      let isNull = false; // 为空
      let isType = false; // 格式
      let isMore = false; // 大于
      this.tableDataList.forEach(item => {
        if ((item.planAllocateNum === 0 || item.planAllocateNum === '0') && !skuCode) {
          isType = true;
          skuCode = item.skuCode;
        }
        if (!item.planAllocateNum && !skuCode) {
          isNull = true;
          skuCode = item.skuCode;
        }
        if (item.planAllocateNum && !numReg.test(item.planAllocateNum) && !skuCode) {
          isType = true;
          skuCode = item.skuCode;
        }
        if (item.planAllocateNum !== '' && item.planAllocateNum !== null && (item.inventoryNum - item.planAllocateNum < 0) && !skuCode) {
          isMore = true;
          skuCode = item.skuCode;
        }
      });
      if (isNull) {
        this.$message({
          message: `skuCode为${skuCode}的调拨数量不能为空！`,
          type: 'warning'
        });
        return;
      }
      if (isType) {
        this.$message({
          message: `skuCode为${skuCode}的调拨数量格式只能为正整数！`,
          type: 'warning'
        });
        return;
      }
      if (isMore) {
        this.$message({
          message: `skuCode为${skuCode}的调拨数量不能大于“调出仓库实时库存”！`,
          type: 'warning'
        });
        return;
      }
      let params = {};
      params.skuDetailList = JSON.stringify(this.tableDataList);
      params.outWarehouseCode = this.searchParams.outWarehouseCode;
      if (this.searchParams.allocateOrderCode) {
        params.allocateOrderCode = this.searchParams.allocateOrderCode;
      }
      params.inWarehouseCode = this.searchParams.inWarehouseCode;
      params.memo = this.searchParams.memo;
      params.sender = this.searchParams.sender;
      params.senderMobile = this.searchParams.senderMobile;
      params.receiver = this.searchParams.receiver;
      params.receiverMobile = this.searchParams.receiverMobile;
      params.inventoryType = '1';
      params.isReview = '1';
      this.warehouseList.forEach(item => {
        if (item.code === params.warehouseCode) {
          params.warehouseName = item.warehouseName;
        }
      });
      let arr = [];
      this.deleteIdList.forEach(item => {
        if (arr.indexOf(item) < 0) {
          arr.push(item);
        }
      });
      params.delsIds = arr.join();
      this.$confirm('确认后调拨单将流转至审核模块。', '您确认要提交吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.searchParams.allocateOrderCode) {
            this.submitAudit(params);
          } else {
            this.submitAuditNoId(params);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    deleteBtn(i, row) {
      this.tableDataList.splice(i, 1);
      this.addOrEditParams.totalCount = this.tableDataList.length;
      let pageNumber = Math.ceil(this.addOrEditParams.totalCount / this.addOrEditParams.pageSize);
      if (this.addOrEditParams.totalCount % this.addOrEditParams.pageSize === 0 && (this.addOrEditParams.pageNo !== pageNumber)) {
        console.log('0000000');
        this.changeNumber(this.addOrEditParams.pageNo - 1);
      }
      if (row.id) {
        this.deleteIdList.push(row.id);
      }
    },
    deleteUpload(id, index) {
      if (id) {
        this.$AXIOS.DELETE('/qinniu/uploadFile/', id).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          if (this.searchParams.purchaseOrderCode) {
            this.getUploadDataList(this.searchParams.purchaseOrderCode);
          }
        });
      } else {
        this.fileDataList.splice(index, 1);
      }
    },
    // 返回按钮
    back() {
      this.$router.push({path: '/transordermanage'});
    }

  }
};
</script>
<style lang="stylus" scoped>
.transorderaddoredit
  .btn_group
    margin-top: 15px
    text-align: center
  .tip
    width: 100%
    line-height: 30px
    margin: 10px 0
    padding-left: 15px
    background-color: #ffbc00
    color: red
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
  .upload-demo
    text-align: center
  .btn
    color: blue
    cursor: pointer
</style>
<style lang='stylus'>
.transorderaddoredit
  .price_list
    tr
      th:nth-child(8), th:nth-child(10)
        div::before
          content: '*'
          padding-right: 5px
          color: #ff0000
  .el-table
    max-width none
  .el-radio+.el-radio
    margin-left 10px
</style>

