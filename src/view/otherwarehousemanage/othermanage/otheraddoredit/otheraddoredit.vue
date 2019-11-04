<template>
  <div class="otheraddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="150px" class="search_form" size="medium">
        <!-- 第0行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="其他出入单编号：" size="mini">
              {{searchParams.outInCode ? searchParams.outInCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="仓库名称：" prop="warehouseCode" size="mini">
              <el-select v-model="searchParams.warehouseCode" filterable placeholder="请选择" @change="warehouseCodeChange">
              <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="出入库类型：" prop="outInType" size="mini">
              <el-radio-group v-model="searchParams.outInType" @change="warehouseCodeChange">
                <el-radio label="1">其他入库</el-radio>
                <el-radio label="2">其他出库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="入库/出库原因：" prop="outInCause" size="mini">
              <el-input v-model.trim="searchParams.outInCause" :maxlength="100" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="备注：" prop="remark" size="mini">
              <el-input v-model.trim="searchParams.remark" type="textarea" :rows="2" placeholder="" :maxlength="300"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 收发件人信息 -->
    <el-card class="box-card" style="margin-top: 10px" v-if="this.searchParams.outInType !== ''">
      <div slot="header" class="clearfix">
        <span>收发件人信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="150px" class="search_form" size="medium">
        <!-- 第一行 -->
        <el-row :span="20" v-if="this.searchParams.outInType === '1'">
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
              <el-input v-model.trim="searchParams.senderAddress" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20" v-if="this.searchParams.outInType === '2'">
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
              <el-input v-model.trim="searchParams.receiverAddress" placeholder=""></el-input>
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
      <el-button type="primary" size="mini" @click="addGoods"> + 添加商品</el-button>
      <el-button type="primary" size="mini" @click="importGood">导入商品</el-button>
      <el-button type="text" size="mini">
        <a :href="downloadDefault">模板下载</a>
      </el-button>
      <div style="width: 100%;">
        <el-table class="price_list" :data="tableDataList"  border v-if="searchParams.outInType === '2'">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center"></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
          <el-table-column prop="inventoryType" label="库存类型" align="center" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.inventoryType" filterable placeholder="请选择" size="mini" @change="inventoryChange(scope.$index)">
                <el-option v-for="item in inventoryTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="inventoryNum" label="仓库实时可用库存" align="center" >
            <template slot-scope="scope">
              <div v-if="scope.row.inventoryNum || scope.row.inventoryNum === 0 || scope.row.inventoryNum === '0'">{{scope.row.inventoryNum}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="planOutInNum" label="出库数量" align="center" >
            <el-table-column  label="" align="center" >
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.planOutInNum" placeholder="" size="mini" maxlength="10"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteBtn(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table class="price_list1" :data="tableDataList"  border v-if="searchParams.outInType === '1'">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center"></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
          <el-table-column prop="inventoryType" label="库存类型" align="center" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.inventoryType" filterable placeholder="请选择" size="mini" >
                <el-option v-for="item in inventoryTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="planOutInNum" label="入库数量" align="center" >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.planOutInNum" placeholder="" size="mini" maxlength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="入库单价（元）" align="center" width="400">
            <el-table-column label="用于财务成本金额核算" align="center" width="400" class="wyy" >
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.priceFlag" @change='radioChange(scope.$index, scope.row.priceFlag)'>
                  <el-radio label="1">等于仓内成本金额</el-radio>
                  <el-radio label="0">
                    <el-input type="text" size="mini" v-model.trim="scope.row.inPrice" maxlength="13" :disabled="scope.row.priceFlag === '1'" @focus="changeRadio(scope.$index)"></el-input>
                  </el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteBtn(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 自采商品管理列表 弹窗 -->
    <el-dialog title="选择商品" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="SKU名称：" size="mini">
              <el-input v-model.trim="form.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SKU编号：" size="mini">
              <el-input v-model.trim="form.skuCodes" placeholder="输入多个请用英文,隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="条形码：" size="mini">
              <el-input v-model.trim="form.barCodes" placeholder="输入多个请用英文,隔开"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="8">&nbsp;</el-col>
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
        <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
        <el-table-column prop="skuCode" label="SKU编号" align="center"></el-table-column>
        <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
        <el-table-column prop="specNatureInfo" label="规格" align="center"></el-table-column>
        <el-table-column prop="warehouseItemStatus" label="商品状态" align="center">
          <template slot-scope="scope">
            {{checkStockType(scope.row.warehouseItemStatus)}}
          </template>
        </el-table-column>
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
    <el-dialog title="导入商品" :visible.sync="isShopGood" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='loading'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :data='goodsParams' :on-error='uploadError' drag action='/scm-web/OtherOutIn/import_item' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
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
  name: 'otheraddoredit',
  data() {
    return {
      cityOptions: [], // 城市列表
      selectedSender: [], // 发货城市列表
      selectedReceiver: [], // 收货城市列表
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
      selected: [],
      logCount: 0, // 表单列表总条数
      form: {
        skuName: '', // 商品名称
        skuCodes: '', // sku编号
        barCodes: '', // 条形码
        outInType: '', // 出入库类型，1-入库，2-出库
        warehouseCode: '', // 仓库编号
        usedSkuCodes: '', // 已添加过的skuCode
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
        warehouseCode: '', // 仓库名称
        outInType: '', // 出入库类型
        outInCause: '', // 出入库原因
        remark: '', // 备注
        sender: '', // 发件人
        senderMobile: '', // 发件人手机
        senderAddress: '', // 发件人详细地址
        receiver: '', // 收件人
        receiverMobile: '', // 收件人手机
        receiverAddress: '' // 收件人详细地址
      },
      rules: {
        warehouseCode: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        outInType: [
          { required: true, message: '请选择出入库类型', trigger: 'blur' }
        ],
        outInCause: [
          { required: true, message: '出入库原因不能为空', trigger: 'blur' }
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
        '/scm-web/OtherOutIn/Export_template'
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
    if (this.$route.params.outInCode !== 'add') {
      this.outInCode = this.$route.params.outInCode;
      this.getSearchParams();
    }
  },
  methods: {
    handleCityChange(val) {
        this.searchParams.province = val[0];
        this.searchParams.city = val[1];
        this.searchParams.area = val[2];
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
    inventoryChange(i) {
      console.log(i);
      let params = {warehouseCode: this.searchParams.warehouseCode};
      params.skuCode = this.tableDataList[i].skuCode;
      params.inventoryType = this.tableDataList[i].inventoryType;
      params.index = i;
      this.inventoryQuery(params);
    },
    inventoryQuery(params) {
      this.$AXIOS.GET('/OtherOutIn/getSkuInventory', params).then(res => {
        console.log(res);
        this.$set(this.tableDataList[params.index], 'inventoryNum', res.result);
      });
    },
    // 更改仓库
    warehouseCodeChange(val) {
      console.log(val);
      if (val) {
        this.tableDataList = [];
      }
      if (val === '2') {
        this.searchParams.sender = '';
        this.searchParams.senderMobile = '';
        this.searchParams.senderAddress = '';
        this.selectedSender = [];
      } else if (val === '1') {
        this.searchParams.receiver = '';
        this.searchParams.receiverMobile = '';
        this.searchParams.receiverAddress = '';
        this.selectedReceiver = [];
      }
    },
    // 仓库列表
    getPurchaseType() {
      this.$AXIOS.GET('/OtherOutIn/query_warehouse_name').then(res => {
        this.warehouseList = [...this.warehouseList, ...res.result];
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
      this.$AXIOS.POST('/OtherOutIn/getErrorJson', {errorJson: errorJson}).then(res => {
        // window.open('/scm-web/OtherOutIn/export_error_item?errorJsonUid=' + res.result);
        let url = '/scm-web/OtherOutIn/export_error_item?errorJsonUid=' + res.result;
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
      this.$utils.messagetip.errorTip(objErr.databuffer);
      this.isShopGood = false;
    },
    // 文件上传之前
    beforeAvatarUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel';
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        this.$utils.messagetip.errorTip('上传文件大小不能超过 10MB!');
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
        this.$utils.messagetip.warningTip(response.errorMsg);
      }
    },
    // 导入商品btn
    importGood() {
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请选择仓库！');
        return;
      }
      if (!this.searchParams.outInType) {
        this.$utils.messagetip.warningTip('请选择出入库类型！');
        return;
      }
      this.isGoodResult = 'default';
      let arr = [];
      this.uploadResult = {};
      if (this.$refs.uploadGood) {
        this.$refs.uploadGood.clearFiles();
      }
      this.tableDataList.forEach(item => {
        arr.push(item.skuCode);
      });
      let objParams = {
        warehouseCode: this.searchParams.warehouseCode,
        outInType: this.searchParams.outInType ? this.searchParams.outInType : '',
        usedSkuDetailList: arr.join()
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
        this.uploadResult.successList.forEach(item => {
          item.priceFlag = '';
        });
        this.isGoodResult = 'success';
      } else {
        this.uploadResult = response.result;
        let successNum = response.result.successList ? response.result.successList.length : 0;
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
        this.$utils.messagetip.warningTip(response.databuffer);
      }
    },
    closeGoodUpload() {
      this.isClick = true;
      if (this.uploadResult.successList && this.uploadResult.successList.length) {
        let successList = [];
        this.uploadResult.successList.forEach(item => {
          let obj = {};
          obj.skuCode = item.skuCode;
          obj.skuName = item.skuName;
          obj.specNatureInfo = item.specNatureInfo;
          obj.warehouseItemStatus = item.warehouseItemStatus;
          obj.brandName = item.brandName;
          obj.brandCode = item.brandCode;
          obj.inventoryType = item.inventoryType;
          obj.inventoryNum = item.inventoryNum;
          obj.planOutInNum = item.planOutInNum;
          obj.barCode = item.barCode;
          obj.priceFlag = '1';
          successList.push(obj);
        });
        this.tableDataList = [...this.tableDataList, ...successList];
      }
      this.tableDataList.forEach(item => {
        item.inventoryType = item.inventoryType || '1'; // 出入库类型
        item.inventoryNum = item.inventoryNum || '';
      });
      this.isShopGood = false;
    },
    // 获取出入库单信息
    getSearchParams() {
      this.$AXIOS.GET('/OtherOutIn/query_detail/' + this.outInCode).then(res => {
        this.searchParams = res.result;
        this.tableDataList = res.result.outInOrderDetailList || [];
        // 发件人地址
        if (this.searchParams.senderProvince) {
          this.selectedSender = [this.searchParams.senderProvince, this.searchParams.senderCity, this.searchParams.senderArea];
        } else {
          this.selectedSender = [];
        }
        // 收件人地址
        if (this.searchParams.receiverProvince) {
          this.selectedReceiver = [this.searchParams.receiverProvince, this.searchParams.receiverCity, this.searchParams.receiverArea];
        } else {
          this.selectedReceiver = [];
        }
        if (this.tableDataList.length) {
          this.tableDataList.forEach(item => {
            item.inventoryType = item.inventoryType || '1';
          });
        }
      });
    },
    // 提交审核
    submitAudit(params) {
      this.isSubmit = true;
      this.$AXIOS.PUT('/OtherOutIn/update/' + params.outInCode, params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/othermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 直接提交审核,没有编辑
    submitAuditNoId(params) {
      this.isSubmit = true;
      this.$AXIOS.POST('/OtherOutIn/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/othermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 弹窗商品数据列表
    getDailogTableDataList(params) {
      this.isLoading = true;
      this.$AXIOS.POST('/OtherOutIn/query_sku_page', params).then(res => {
        this.dailogTableDataList = res.result.result;
        this.logCount = res.result.totalCount;
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 保存数据接口
    savePurchaseOrder(params) {
      this.$AXIOS.POST('/OtherOutIn/save', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/othermanage'});
        }, 20);
      }).finally(() => {
        this.isSubmit = false;
      });
    },
    // 保存数据接口(有id)
    savePutPurchaseOrder(params) {
      this.$AXIOS.PUT('/OtherOutIn/update/' + params.outInCode, params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({path: '/othermanage'});
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
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择仓库！');
        return;
      }
      if (!this.searchParams.outInType) {
        this.$utils.messagetip.warningTip('请先选择出入库类型！');
        return;
      }
      this.dailogTableDataList = [];
      this.logCount = 0;
      this.isClick = false;
      this.form.outInType = this.searchParams.outInType;
      this.form.warehouseCode = this.searchParams.warehouseCode;
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
      if (this.form.warehouseCode) {
        this.warehouseCodeList.forEach(item => {
          if (item.code === this.form.warehouseCode) {
            this.form.warehouseInfoId = item.id;
          }
        });
      }
      this.getDailogTableDataList(this.form);
    },
    // 重置搜索条件
    resetForm() {
      this.form = {
        skuName: '', // 商品名称
        skuCodes: '', // sku编号
        barCodes: '', // 条形码
        outInType: '', // 出入库类型，1-入库，2-出库
        warehouseCode: '', // 仓库编号
        usedSkuCodes: '', // 已经有的skuCode
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      };
      this.form.outInType = this.searchParams.outInType;
      this.form.warehouseCode = this.searchParams.warehouseCode;
      let arr = [];
      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          arr.push(item.skuCode);
        });
      }
      this.form.usedSkuCodes = arr.join();
      this.getDailogTableDataList(this.form);
    },
    // 确认按钮
    makeSureAddGoods() {
      if (this.multipleSelection && !this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('请选择商品！');
        return;
      }
      this.isClick = true;
      this.tableDataList = [...this.tableDataList, ...this.multipleSelection];
      this.tableDataList.forEach(item => {
        item.inventoryType = item.inventoryType || '1'; // 出入库类型
        if (item.inventoryNum === 0 || item.inventoryNum === '0') {
          item.inventoryNum = 0;
        } else {
          item.inventoryNum = item.inventoryNum || '';
        }
        if (item.priceFlag === '' || item.priceFlag === null) {
          item.priceFlag = '1';
        }
      });
      this.dialogFormVisible = false;
    },
    // 保存按钮
    saveBtn() {
      // 发件人校验
      let numReg = /^[0-9]+$/;
      let typeReg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
      if (this.searchParams.outInType === '1' && this.searchParams.senderMobile && ( this.searchParams.senderMobile.length !== 11 || !numReg.test(this.searchParams.senderMobile) || !typeReg.test(this.searchParams.senderMobile))) {
        this.$message({
          message: `发件人手机格式不正确！`,
          type: 'warning'
        });
        return;
      }
      if (this.searchParams.outInType === '2' && this.searchParams.receiverMobile && ( this.searchParams.receiverMobile.length !== 11 || !numReg.test(this.searchParams.receiverMobile) || !typeReg.test(this.searchParams.receiverMobile))) {
        this.$message({
          message: `收件人手机格式不正确！`,
          type: 'warning'
        });
        return;
      }
      let params = {};
      params.otherOutInOrderDetailList = JSON.stringify(this.tableDataList);
      params.outInCode = this.searchParams.outInCode || '';
      params.outInType = this.searchParams.outInType;
      params.warehouseCode = this.searchParams.warehouseCode;
      params.outInCause = this.searchParams.outInCause;
      params.remark = this.searchParams.remark;
      // 增加的字段
      if (this.searchParams.outInType === '1') {
        params.sender = this.searchParams.sender;
        params.senderMobile = this.searchParams.senderMobile;
        params.senderAddress = this.searchParams.senderAddress;
        params.senderProvince = this.selectedSender[0];
        params.senderCity = this.selectedSender[1];
        params.senderArea = this.selectedSender[2];
      } else if (this.searchParams.outInType === '2') {
        params.receiver = this.searchParams.receiver;
        params.receiverMobile = this.searchParams.receiverMobile;
        params.receiverAddress = this.searchParams.receiverAddress;
        params.receiverProvince = this.selectedReceiver[0];
        params.receiverCity = this.selectedReceiver[1];
        params.receiverArea = this.selectedReceiver[2];
      }
      params.flag = '0';
      console.log(this.selectedSender);
      let skuCode = '';
      let isPriceNum = false; // 为数字
      let isPriceFloat = false; // 为数字精度
      let isType = false; // 格式
      let numReg1 = /^[0-9.]+$/;
      let inOrOut = this.searchParams.outInType === '1' ? '入库' : '出库';
      this.tableDataList.forEach(item => {
          if ((item.planOutInNum === 0 || item.planOutInNum === '0') && !skuCode) {
            isType = true;
            skuCode = item.skuCode;
          }
          if (item.planOutInNum && !numReg.test(item.planOutInNum) && !skuCode) {
            isType = true;
            skuCode = item.skuCode;
          }
          if (item.inPrice && !numReg1.test(item.inPrice) && !skuCode) {
            isPriceNum = true;
            skuCode = item.skuCode;
          }
          if (item.priceFlag === '0' && item.inPrice !== '' && item.inPrice !== null && item.inPrice > -1) {
            if (item.inPrice.toString().indexOf('.') > -1 && item.inPrice.toString().split('.')[1].length > 4 && !skuCode) {
              isPriceFloat = true;
              skuCode = item.skuCode;
            }
          }
        });
        if (isType) {
          this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的“${inOrOut}数量”格式只能为正整数！`);
      }
      if (isPriceNum) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价只能是大于等于0的数字！`);
      }
      if (isPriceFloat) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价最多只能保留四位小数！`);
      }

      this.warehouseList.forEach(item => {
        if (item.code === params.warehouseCode) {
          params.warehouseName = item.warehouseName;
        }
      });
      this.isSubmit = true;
      console.log(this.tableDataList);
      if (this.searchParams.outInCode) {
        this.savePutPurchaseOrder(params);
      } else {
        this.savePurchaseOrder(params);
      }
    },
    // 提交审核按钮
    submitAuditBtn() {
      // 格式校验
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择仓库');
        return;
      }
      if (!this.searchParams.outInType) {
        this.$utils.messagetip.warningTip('请先选择出入库类型');
        return;
      }
      if (!this.searchParams.outInCause) {
        this.$utils.messagetip.warningTip('出入库原因不能为空');
        return;
      }
      // 发件人校验
      let numReg = /^[0-9]+$/;
      let typeReg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
      if (this.searchParams.outInType === '1') {
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
        if (this.searchParams.senderMobile.length !== 11 || !numReg.test(this.searchParams.senderMobile) || !typeReg.test(this.searchParams.senderMobile)) {
          this.$message({
            message: `发件人手机格式不正确！`,
            type: 'warning'
          });
          return;
        }
        if (!this.selectedSender.length) {
          this.$message({
            message: '请选择发件方省市区!',
            type: 'warning'
          });
          return;
        }
        if (!this.searchParams.senderAddress) {
          this.$message({
            message: '发件人详细地址不能为空!',
            type: 'warning'
          });
          return;
        }
      }
      if (this.searchParams.outInType === '2') {
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
        if (!this.selectedReceiver.length) {
          this.$message({
            message: '请选择收件方省市区!',
            type: 'warning'
          });
          return;
        }
        if (!this.searchParams.receiverAddress) {
          this.$message({
            message: '收件人详细地址不能为空!',
            type: 'warning'
          });
          return;
        }
      }
      if (!this.tableDataList.length) {
        this.$utils.messagetip.warningTip('请先添加商品');
        return;
      }
      let numReg1 = /^[0-9.]+$/;

      let skuCode = '';
      let isNull = false; // 为空
      let isType = false; // 格式
      let isMore = false; // 大于
      let isRadioNull = false; // 为空
      let isPriceNull = false; // 为空
      let isPriceNum = false; // 为数字
      let isPriceFloat = false; // 为数字精度
      let inOrOut = this.searchParams.outInType === '1' ? '入库' : '出库';
      this.tableDataList.forEach(item => {
        if ((item.planOutInNum === 0 || item.planOutInNum === '0') && !skuCode) {
          isType = true;
          skuCode = item.skuCode;
        }
        if (item.planOutInNum === '' && !skuCode) {
          isNull = true;
          skuCode = item.skuCode;
        }
        if (item.planOutInNum && !numReg.test(item.planOutInNum) && !skuCode) {
          isType = true;
          skuCode = item.skuCode;
        }
        if (item.inventoryNum && (item.planOutInNum - item.inventoryNum > 0) && this.searchParams.outInType === '2' && !skuCode) {
          console.log(item.inventoryNum);
          console.log(item.planOutInNum);
          isMore = true;
          skuCode = item.skuCode;
        }
        if (this.searchParams.outInType === '1') {
          if ((item.priceFlag === '' || item.priceFlag === null) && !skuCode) {
            isRadioNull = true;
            skuCode = item.skuCode;
          }
        }
        if (item.priceFlag === '0') {
          if ((item.inPrice === '' || item.inPrice === null) && !skuCode) {
            isPriceNull = true;
            skuCode = item.skuCode;
          }
          if (!numReg1.test(item.inPrice) && !skuCode) {
            isPriceNum = true;
            skuCode = item.skuCode;
          }
          if (item.inPrice !== '' && item.inPrice !== null && item.inPrice.toString().indexOf('.') > -1 && item.inPrice.toString().split('.')[1].length > 4 && !skuCode) {
            isPriceFloat = true;
            skuCode = item.skuCode;
          }
        }
      });
      if (isNull) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的“${inOrOut}数量”不能为空！`);
        return;
      }
      if (isType) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的“${inOrOut}数量”格式只能为正整数！`);
        return;
      }
      if (isMore) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的“${inOrOut}数量”不能大于“仓库实时可用库存”！`);
        return;
      }
      if (isRadioNull && this.searchParams.outInType === '1') {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价必选！`);
        return;
      }
      if (isPriceNull) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价不能为空！`);
        return;
      }
      if (isPriceNum) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价只能是大于等于0的数字！`);
        return;
      }
      if (isPriceFloat) {
        this.$utils.messagetip.warningTip(`SKU编号为${skuCode}的入库单价最多只能保留四位小数！`);
        return;
      }
      let params = {};
      params.otherOutInOrderDetailList = JSON.stringify(this.tableDataList);
      params.outInCode = this.searchParams.outInCode || '';
      params.outInType = this.searchParams.outInType;
      params.warehouseCode = this.searchParams.warehouseCode;
      params.outInCause = this.searchParams.outInCause;
      params.remark = this.searchParams.remark;
      // 增加的字段
      if (this.searchParams.outInType === '1') {
        params.sender = this.searchParams.sender;
        params.senderMobile = this.searchParams.senderMobile;
        params.senderAddress = this.searchParams.senderAddress;
        params.senderProvince = this.selectedSender[0];
        params.senderCity = this.selectedSender[1];
        params.senderArea = this.selectedSender[2];
      } else if (this.searchParams.outInType === '2') {
        params.receiver = this.searchParams.receiver;
        params.receiverMobile = this.searchParams.receiverMobile;
        params.receiverAddress = this.searchParams.receiverAddress;
        params.receiverProvince = this.selectedReceiver[0];
        params.receiverCity = this.selectedReceiver[1];
        params.receiverArea = this.selectedReceiver[2];
      }
      params.flag = '1';
      this.warehouseList.forEach(item => {
        if (item.code === params.warehouseCode) {
          params.warehouseName = item.warehouseName;
        }
      });
      this.$confirm('确定要提交审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.searchParams.outInCode) {
            this.submitAudit(params);
          } else {
            this.submitAuditNoId(params);
          }
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    deleteBtn(i) {
      this.tableDataList.splice(i, 1);
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
      this.$router.push({path: '/othermanage'});
    }

  }
};
</script>
<style lang="stylus" scoped>
.otheraddoredit
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
.otheraddoredit
  .price_list
    thead
      tr
        th:nth-child(5), th:nth-child(7)
          div::before
            content: '*'
            padding-right: 5px
            color: #ff0000
      tr:nth-child(2)
        display none
  .price_list1
    .cell
      line-height 22px !important
    tr
      th:nth-child(5), th:nth-child(6), th:nth-child(7)
        div::before
          content: '*'
          padding-right: 5px
          color: #ff0000
      th:nth-child(6)
        border-bottom: none !important
    tr:nth-child(2)
      th
        border-top: none !important
        color #333 !important
        font-weight 500 !important
        line-height 20px !important
    tr:nth-child(1)
      th
        border-bottom: none !important
  .el-table
    max-width none
  .el-radio+.el-radio
    margin-left 10px
</style>

