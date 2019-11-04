<template>
  <div class="mymarket">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="商品类目：" size="mini">
            <el-col :span="8">
              <el-select v-model="searchParams.firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                <el-option v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="searchParams.secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="searchParams.thirdCategoryId" :disabled="isSecondLevel" filterable placeholder="请选择">
                <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品条码：" size="mini">
            <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU编码：" size="mini">
            <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌：" size="mini">
            <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
              <el-option v-for="item in brandNameList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="SPU编号：" size="mini">
            <el-input v-model.trim="searchParams.spuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称：" size="mini">
            <el-input v-model.trim="searchParams.itemsName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="initDataList">搜索</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
            <!-- <el-button @click="ceshi">测试</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="importAccount">导入报价</el-button>
      <el-button size="mini" type="primary">
        <a :href="exportPlatPrice">导出平台报价</a>
      </el-button>
      <el-button size="mini" type="primary">
        <a :href="exportSuppPrice">导出供应商报价</a>
      </el-button>
      <el-button size="mini">
        <a :href="exportdefPrice">报价模板下载</a>
      </el-button>
    </el-row>
    <!-- tab切换 -->
    <el-tabs class="tab_group" v-model="activeName2" type="card" @tab-click="toggleTab">
      <el-tab-pane label="全部商品" name="first"></el-tab-pane>
    </el-tabs>
    <!-- 表格tableData -->
    <div class="table">
      <ul class="table_menu" style="background: rgb(242, 242, 242);">
        <li>一级类目</li>
        <li>二级类目</li>
        <li>三级类目</li>
        <li>品牌</li>
        <li class="name text_hide">商品名称</li>
        <li>SPU编号</li>
        <li>操作</li>
      </ul>
      <div v-for="(tableItem, index) in tableDataList" :key="index">
        <ul class="table_menu" style="background: rgb(242, 242, 242);">
          <li>{{tableItem.firstCategoryName}}</li>
          <li>{{tableItem.secondCategoryName}}</li>
          <li>{{tableItem.thirdCategoryName}}</li>
          <li>{{tableItem.brandName}}</li>
          <li class="name">
            <el-tooltip class="item text_hide" effect="dark" :content="tableItem.name" placement="top">
              <p>{{tableItem.name}}</p>
            </el-tooltip>
          </li>
          <li>{{tableItem.spuCode}}</li>
          <li>
            <el-button size="mini" type="text" @click="changePrice(tableItem.supplierSkusList)">报价</el-button>
            <el-button size="mini" type="text" @click="toMarketDetail(tableItem.spuCode)">查看详情</el-button>
          </li>
        </ul>
        <el-table class="price_list" :data="tableItem.supplierSkusList" border >
          <el-table-column label="序号" type="index" width="40" align="center"></el-table-column>
          <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="销售属性" prop="specInfo" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="SKU编码" prop="skuCode" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="商品条码" prop="barCode" align="center"></el-table-column>
          <el-table-column label="平台价格" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.price === null || scope.row.price === ''">-</p>
              <p v-else>{{scope.row.price}}</p>
            </template>
          </el-table-column>
          <el-table-column label="平台库存" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.stock === null || scope.row.stock === ''">-</p>
              <p v-else>{{scope.row.stock}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!-- <el-table ref="multipleTable" :data="tableDataList" height="453" border tooltip-effect="dark" style="width: 100%;margin-top:20px;" @selection-change="handleSelectionChange">
      <el-table-column label="一级类目" prop="firstCategoryName" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="二级类目" prop="secondCategoryName" align="center"></el-table-column>
      <el-table-column label="三级类目" prop="thirdCategoryName" align="center"></el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="SPU编号" prop="spuCode" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="checkRowDetail(scope.row.supplierSkusList)">价格明细</el-button>
          <el-button size="mini" type="text" @click="changePrice(scope.row.supplierSkusList)">报价</el-button>
          <el-button size="mini" type="text" @click="toMarketDetail(scope.row.spuCode)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-row>

    <!-- 列表详情内表格展示 价格明细 -->
    <el-dialog title="价格明细" :visible.sync="isPriceDetail">
      <el-table :data="supplierSkusList" border v-show="isShowPrice">
        <el-table-column label="序号" type="index" width="40" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU编码" prop="skuCode" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品条码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="平台价格" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.price === null || scope.row.price === ''">-</p>
            <p v-else>{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="平台库存" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.stock === null || scope.row.stock === ''">-</p>
            <p v-else>{{scope.row.stock}}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-show="!isShowPrice" v-for="(item, i) in supplierSkusList" :span-method="objectSpanMethod" :key="i" :data="item.supplierSkus" border>
        <el-table-column label="序号" type="index" width="40" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" align="center"></el-table-column>
        <el-table-column label="报价时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商" prop="supplierName" align="center"></el-table-column>
        <el-table-column label="供应商价格" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.price === null || scope.row.price === ''">-</p>
            <p v-else>{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="供应商库存" prop="stock" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.stock === null || scope.row.stock === ''">-</p>
            <p v-else>{{scope.row.stock}}</p>
          </template>
        </el-table-column>
        <el-table-column label="平台价格（元）" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="填0或为留空为停止供应" placement="top">
               <el-input size="mini" v-model="arrSku[i].newPrice" placeholder="填0或为留空为停止供应" maxlength="8"></el-input>
            </el-tooltip>
            <el-button type="text" size="mini" @click="nearestPrice(i, scope.row.basePrice)">最近报价：{{scope.row.basePrice}}</el-button>
            <p>{{scope.row.baseUpdateTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="平台库存" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="填0或为留空为停止供应" placement="top">
               <el-input size="mini" v-model="arrSku[i].newStock" placeholder="填0或为留空为停止供应" maxlength="6"></el-input>
            </el-tooltip>
            <el-button type="text" size="mini" @click="nearestStock(i, scope.row.baseStock)">最近库存：{{scope.row.baseStock}}</el-button>
            <p>{{scope.row.baseUpdateTime}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePricebtn" v-show="isShowPrice" size="mini">报价</el-button>
        <el-button @click="resetData" v-show="!isShowPrice" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveData" v-show="!isShowPrice" size="mini">提交报价</el-button>
      </div>
    </el-dialog>

    <!-- 更改报价弹窗 -->
    <el-dialog title="明细" :visible.sync="isChangePrice" >
      <el-table v-for="(item, i) in supplierSkusList" :span-method="objectSpanMethod" :key="i" :data="item.supplierSkus" border>
        <el-table-column label="序号" type="index" width="40" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" align="center"></el-table-column>
        <el-table-column label="报价时间" prop="updateTime" align="center" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="供应商" prop="supplierName" align="center"></el-table-column>
        <el-table-column label="供应商价格" align="center" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.price === null || scope.row.price === ''">-</p>
            <p v-else>{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="供应商库存" align="center" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.stock === null || scope.row.stock === ''">-</p>
            <p v-else>{{scope.row.stock}}</p>
          </template>
        </el-table-column>
        <el-table-column label="平台价格（元）" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="填0或为留空为停止供应" placement="top">
               <el-input size="mini" v-model="arrSku[i].newPrice" placeholder="填0或为留空为停止供应" maxlength="8"></el-input>
            </el-tooltip>
            <el-button type="text" size="mini" @click="nearestPrice(i, scope.row.basePrice)">最近报价：{{scope.row.basePrice}}</el-button>
            <p>{{scope.row.baseUpdateTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="平台库存" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="填0或为留空为停止供应" placement="top">
               <el-input size="mini" v-model="arrSku[i].newStock" placeholder="填0或为留空为停止供应" maxlength="6"></el-input>
            </el-tooltip>
            <el-button type="text" size="mini" @click="nearestStock(i, scope.row.baseStock)">最近库存：{{scope.row.baseStock}}</el-button>
            <p>{{scope.row.baseUpdateTime}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveData"  size="mini">提交报价</el-button>
      </div>
    </el-dialog>

    <!-- 报价弹窗 -->
    <el-dialog title="导入报价" :visible.sync="isAccount" width="40%">
      <el-upload ref="upload" v-show="isResult === 'default'" class="upload-demo" :before-upload="beforeAvatarUpload" drag action="/chain-web/supplierCentre/supplierCenterImport" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
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
          <el-button type="primary" @click="savePrice" size="mini">提交报价</el-button>
          <el-button @click="resetPrice" size="mini">取消报价</el-button>
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
import Vue from 'vue';
export default {
  name: 'mymarket',
  data() {
    return {
      arrSku: [],
      brandNameList: [], // 品牌列表
      isShowPrice: true, // 明细切报价显示隐藏
      importCode: '', // 导出出错的参数
      uploadResult: {}, // 上传成功返回的响应数据
      isResult: 'default', // 默认显示导入文件
      isAccount: false, // 导入报价
      isChangePrice: false, // 报价弹窗
      supplierSkusList: [], // 价格明细列表
      isPriceDetail: false, // 报价明细弹窗
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单
      isSecondLevel: true, // 关联三级菜单
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      searchParams: {
        firstCategoryId: '', // 搜索条件一级id
        secondCategoryId: '', // 搜索条件二级id
        thirdCategoryId: '', // 搜索条件三级id
        brandId: '', // 品牌
        skuCode: '', // sku编号
        barCode: '', // 条形码
        spuCode: '', // spu编号
        itemsName: '', // 商品名称
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      }, // 请求参数
      activeName2: 'first', // tab切换name
      multipleSelection: []
    };
  },
  mounted() {
    this.initDataList();
    this.getBrandName();
    this.getSelectItmesPage({ level: '1' });
  },
  computed: {
    // 导出平台报价模板
    exportPlatPrice() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      return (
        '/chain-web/supplierCentre/supplierCentreExport?' + qs.stringify(params)
      );
    },
    // 导入失败下载的地址
    downloadFail() {
      return (
        '/chain-web/supplierCentre/supplierCenterExceptDownload/' +
        this.importCode
      );
    },
    // 导出供应商报价模板
    exportSuppPrice() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      return (
        '/chain-web/supplierCentre/supplierQuotationExport?' +
        qs.stringify(params)
      );
    },
    // 报价模板下载
    exportdefPrice() {
      return '/chain-web/supplierCentre/centreExampleExport';
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      console.log(file);

      const isExcel = file.type === 'application/vnd.ms-excel';

      if (!isExcel) {
        this.$message.error('上传文件只能是 xls 格式!');
      }
      return isExcel;
    },
    // 商品品牌
    getBrandName() {
      this.GET('/brandManage/queryBrandList').then(res => {
        if (res.code === '200') {
          this.brandNameList = res.body;
        }
      });
    },
    // 搜索，初始化数据
    initDataList() {
      this.GET('/supplierCentre/selectAllItems', this.searchParams).then(
        res => {
          if (res.code === '200') {
            this.tableDataList = res.body.objects;
            this.totalCount = res.body.pageTotal;
          }
        }
      );
    },
    // 提交报价
    getOffer(params) {
      this.PUT('/supplierCentre/offer', params).then(res => {
        if (res.code === '200') {
          this.resetData();
          this.initDataList();
          this.$message({
            message: '报价成功',
            type: 'success'
          });
        }
      });
    },
    // 获取类目信息
    getSelectItmesPage(params) {
      this.GET('/category/queryCategory', params).then(res => {
        if (res.code === '200') {
          if (params.level === '1') {
            this.firstCateList = res.body;
          } else if (params.level === '2') {
            this.secondCateList = res.body;
            // this.searchParams.secondCategoryId = this.secondCateList[0].id;
            // if (this.secondCateList.length) {
            //   this.getSelectItmesPage({level: '3', parentId: this.secondCateList[0].id});
            //   this.isSecondLevel = false;
            // }
          } else if (params.level === '3') {
            this.thirdCateList = res.body;
            // this.searchParams.thirdCategoryId = this.thirdCateList[0].id;
          }
        }
      });
    },
    // 一级分类改变
    firstCateChange(val) {
      if (val) {
        this.isFirstLevel = false;
        this.searchParams.secondCategoryId = '';
        this.getSelectItmesPage({ level: '2', parentId: val });
      } else {
        this.isFirstLevel = true;
      }
    },
    // 二级分类改变
    secondCateChange(val) {
      if (val) {
        this.isSecondLevel = false;
        this.searchParams.thirdCategoryId = '';
        this.getSelectItmesPage({ level: '3', parentId: val });
      } else {
        this.isSecondLevel = true;
      }
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 7 || columnIndex === 8) {
        if (rowIndex === 0) {
          console.log(row.len);
          return {
            rowspan: row.len,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 点击最近报价
    nearestPrice(i, basePrice) {
      this.arrSku[i].newPrice = basePrice;
    },
    // 点击最近库存
    nearestStock(i, baseStock) {
      this.arrSku[i].newStock = baseStock;
    },
    // 报价按钮
    changePricebtn() {
      this.arrSku = [];
      this.supplierSkusList.forEach(item => {
        if (item.supplierSkus && item.supplierSkus.length) {
          let len = item.supplierSkus.length;
          item.supplierSkus[0].len = len;
        }
        let obj = {
          newPrice: '',
          newStock: ''
        };
        this.arrSku.push(obj); // 保存的sku报价和库存值
      });
      this.isShowPrice = !this.isShowPrice;
    },
    resetData() {
      this.isChangePrice = false;
      this.isPriceDetail = false;
    },
    // 保存数据
    saveData() {
      // this.isChangePrice = false;
      let params = [];
      this.supplierSkusList.forEach((item, i) => {
        let obj = { skuCode: item.skuCode };
        if (item.supplierSkus && item.supplierSkus.length) {
          obj.basePrice = this.arrSku[i].newPrice.toString();
          obj.stock = this.arrSku[i].newStock.toString();
          params.push(obj);
        }
      });
      let isFormat = false; // 价格格式
      let isPoint = false; // 价格两位小数
      let isInt = false; // 库存整数
      let isZero = false; // 存在0或者空
      params.forEach(item => {
        let priceReg = /^[0-9.]+$/;
        let stockReg = /^[0-9]+$/;
        if (item.basePrice && !priceReg.test(item.basePrice)) {
          isFormat = true;
        } else if (
          item.basePrice &&
          item.basePrice.indexOf('.') > -1 &&
          item.basePrice.split('.')[1].length > 2
        ) {
          isPoint = true;
          return;
        } else if (item.basePrice && item.basePrice.indexOf('.') < 0) {
          item.basePrice = parseFloat(item.basePrice).toFixed(2);
        } else if (
          item.basePrice &&
          item.basePrice.indexOf('.') > 0 &&
          item.basePrice.split('.')[1].length > 0
        ) {
          item.basePrice =
            item.basePrice + '00'.substr(item.basePrice.split('.')[1].length);
        }
        if ((item.stock && !stockReg.test(item.stock)) || item.stock < 0) {
          isInt = true;
          return;
        }
        if (item.basePrice === '' || item.stock === '' || item.basePrice === '0' || item.stock === '0' || item.basePrice === 0 || item.stock === 0) {
          isZero = true;
        }
      });
      if (isFormat) {
        this.$message({
          message: '价格格式不正确',
          type: 'warning'
        });
        return;
      }
      if (isPoint) {
        this.$message({
          message: '价格小数点后最多两位小数',
          type: 'warning'
        });
        return;
      }
      if (isInt) {
        this.$message({
          message: '库存只能为整数',
          type: 'warning'
        });
        return;
      }
      let result = '确定提交库存及报价？';
      if (isZero) {
        result = '存在未填写或者填写为0的SKU，将停止供应该SKU，是否确定提交？';
      }
      console.log(params);
      this.$confirm(result, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getOffer(params);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交报价'
          });
        });
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
    // 导入成功之后调用
    savePrice() {
      this.GET(
        '/supplierCentre/supplierCenterGenerate/' + this.importCode
      ).then(res => {
        if (res.code === '200') {
          this.initDataList();
          this.$message({
            message: '报价生成成功',
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
        message: '报价取消'
      });
      this.isAccount = false;
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
          message: response.message,
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
    // 重置搜索条件
    resetForm() {
      this.isFirstLevel = this.isSecondLevel = true;
      this.searchParams = {
        firstCategoryId: '', // 搜索条件一级id
        secondCategoryId: '', // 搜索条件二级id
        thirdCategoryId: '', // 搜索条件三级id
        brandId: '', // 品牌
        skuCode: '', // sku编号
        barCode: '', // 条形码
        spuCode: '', // spu编号
        itemsName: '', // 商品名称
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 三级联动触发事件
    choseLevelMenu(value) {
      console.log(value);
    },
    // 切换tab
    toggleTab(tab, event) {
      console.log(tab, event);
    },
    // 多选框选中的每一项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看报价明细
    checkRowDetail(supplierSkusList) {
      this.isPriceDetail = true;
      this.isShowPrice = true;
      this.supplierSkusList = supplierSkusList;
    },
    // 报价
    changePrice(supplierSkusList) {
      this.arrSku = [];
      this.isChangePrice = true;
      supplierSkusList.forEach(item => {
        if (item.supplierSkus && item.supplierSkus.length) {
          let len = item.supplierSkus.length;
          item.supplierSkus[0].len = len;
        }
        let obj = {
          newPrice: '',
          newStock: ''
        };
        this.arrSku.push(obj); // 保存的sku报价和库存值
      });
      this.supplierSkusList = supplierSkusList;
      console.log(this.supplierSkusList);
      console.log(this.arrSku);
    },
    // 跳转到详情页
    toMarketDetail(spuCode) {
      this.$router.push({
        path: '/mymarket/marketdetail/' + spuCode
      });
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
    // 改变供应状态
    toggleSupplyStatus() {}
  }
};
</script>

<style lang="stylus" scoped>
.mymarket
  .tab_group
    margin-top: 15px
  .table
    padding: 0 20px
    background: #fff
    .table_menu
      display: flex
      justify-content: space-around
      line-height: 40px
      font-size: 12px
      border: solid 1px #cccccc
      border-bottom none
      text-align: center
      li
        flex: 1
      li.name
        width: 270px
        flex: 0 0 270px
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
    margin-top: 15px
  .upload-demo
    text-align: center
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
</style>
<style lang="stylus">
.mymarket
  .table
    .el-table--border, .el-table--group
      border: 1px solid #cccccc
    .el-table th .cell
        background #ffffff
</style>
