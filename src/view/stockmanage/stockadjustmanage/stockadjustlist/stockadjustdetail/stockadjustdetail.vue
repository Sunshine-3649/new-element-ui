<template>
  <div class="stockadjustdetail">
    <!-- 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div v-show="isTip" style="height: 46px;line-height: 46px;border: 1px solid #ff8800;background: #ffdcb5;padding: 0 10px;margin-bottom:10px;">注：手工创建的库存调整单只支持调整SCM系统内的库存，不会同步调整WMS系统内的库存，请谨慎操作。<span style="float: right;padding: 0 10px;cursor: pointer;"  @click="isTip = false">X</span></div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="125px" class="search_form" size="medium">
        <!-- 第0行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="库存调整单编号：" size="mini">
              {{searchParams.stockAdjustCode ? searchParams.stockAdjustCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="调整仓库：" prop="adjustWarehouseCode" size="mini">
              <el-select v-model="searchParams.adjustWarehouseCode" filterable @change='resetTableDataList' placeholder="请选择">
                <el-option v-for="item in warehouseList" :key="item.code" :label="item.warehouseName" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="24">
            <el-form-item label="业务类型：" prop="businessType" size="mini">
              <el-radio-group v-model="searchParams.businessType" @change="preCheck">
                <el-radio v-for="item in businessTypeData" :key="item.code" :label="item.code">
                    <el-tooltip v-if="item.code ===3" class="item" effect="dark" :content="businessTypeTip" placement="top">
                      <span>{{item.name}}</span>
                    </el-tooltip>
                    <span v-else>{{item.name}}</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :span="20" v-if="searchParams.businessType === 0 || searchParams.businessType === 4">
          <el-col :span="24">
            <el-form-item label="调整库存类型：" prop="adjustInventoryType" size="mini">
              <el-radio-group v-model="searchParams.adjustInventoryType" @change="chooseAdjustType">
                <el-radio :label="1">正品</el-radio>
                <el-radio :label="2">残品</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row :span="20" v-if="isAdjustInventory && (([1, 2, 3].indexOf(searchParams.businessType) > -1) || (([0, 4].indexOf(searchParams.businessType) > -1) && searchParams.adjustInventoryType === 1))">
          <el-col :span="24">
            <el-form-item label="调整库存对象：" prop="adjustInventoryObject" size="mini">
              <el-radio-group v-model="searchParams.adjustInventoryObject" @change="chooseAdjustObj">
                <el-radio :label="0">渠道共享</el-radio>
                <el-radio :label="1">门店专用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row :span="20">
          <el-col :span="24">
            <el-form-item label="调整说明：" prop="adjustInstruction" size="mini">
              <el-input type="textarea" v-model.trim="searchParams.adjustInstruction" placeholder="" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <!-- 商品明细 -->
      <el-tab-pane label="商品明细" name="1">
        <el-button  type="primary" size="mini"  @click="addGoods"> + 添加商品<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button type="primary" size="mini" @click="importGood">导入商品</el-button>
        <el-button type="text" size="mini" @click="ExcelDownLoad">导入模板下载</el-button>
        <el-table v-show="tableDataList.length > 0" class="price_list" :data="tableDataList" style="width: 100%;margin-top:15px;" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column v-if="searchParams.businessType == 3" prop="skuCode" label="SKU编号" align="right" width="230" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span align="center">原SKU</span><span class="targatSkuCode">{{scope.row.skuCode}}</span></div>
              <div class="oringinDiv"><span align="center">目标SKU</span><span class="targatSkuCode">{{scope.row.targetSkuCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuCode" label="SKU编号" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="searchParams.businessType == 3" prop="skuName" label="SKU名称" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.skuName}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSkuName}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuName" label="SKU名称" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="searchParams.businessType == 3" prop="specNatureInfo" label="规格" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.specNatureInfo}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSpecNatureInfo}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="specNatureInfo" label="规格" align="center" :key="Math.random()"></el-table-column>

          <el-table-column  v-if="searchParams.businessType == 3" prop="barCode" label="条形码" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.barCode}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetBarCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="barCode" label="条形码" align="center" :key="Math.random()"></el-table-column>
          <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center"></el-table-column>
          <el-table-column v-if="searchParams.adjustInventoryObject ===0 || searchParams.adjustInventoryObject ===1" prop="adjustInventoryObjectDesc" label="调整库存对象（门店）" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="searchParams.businessType == 3" prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5">
                <span>减少</span>
                <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
              </div>
              <div class="oringinDiv">
                <span>增加</span>
                <el-input v-model.trim="scope.row.targetAdjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column :render-header="renderHeader"  v-else-if="searchParams.businessType == 0 || searchParams.businessType == 4" prop="adjustNum" label="调整数量,（减少请输入负数）"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-else prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteBtn((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加商品非库存转化-->
    <el-dialog title="选择商品" :visible.sync="isGoodsOne" width="550px" :close-on-click-modal='false' :show-close='true'>
      <el-form :model="selectGoodsParams" :rules="rules" ref="selectGoodsParams" label-width="0" class="search_form" size="medium">
        <el-row :span="20">
          <el-col>
            <div style="margin-bottom: 5px;">请输入需要调整商品的SKU编号或条形码（多个请换行）：</div>
            <el-form-item label="" size="mini">
              <el-input type="textarea"  placeholder="" v-model.trim="selectGoodsParams.skuOrBarCode" @keydown.native="listenKeyDown($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="funSetGoods">确定</el-button>
            <el-button  size="mini" type="primary" @click="isGoodsOne = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--添加商品库存转化-->
    <el-dialog title="选择商品" :visible.sync="isGoodsTwo" width="550px" :close-on-click-modal='false' :show-close='true'>
      <el-form>
        <el-row :span="24">
          <el-col :span="22">
            <el-form-item label="请输入原SKU和目标SKU的编号或条形码：" size="mini">
              <el-table
                ref="multipleTable"
                :data="addTableDataList"
                highlight-current-row
                border
                tooltip-effect="dark"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="55"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="原SKU编号或条形码"
                  prop="originalSkuOrBarCode"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model.trim="scope.row.originalSkuOrBarCode"
                      placeholder=""
                      maxlength="30"
                      @change="checkValueName(scope.row.originalSkuOrBarCode)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="目标SKU编号或条形码"
                  prop="targetSkuOrBarCode"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model.trim="scope.row.targetSkuOrBarCode"
                      placeholder=""
                      maxlength="30"
                      @change="checkValueName(scope.row.targetSkuOrBarCode)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="50"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="deleteSurplusBtn(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item
              label-width="5px"
              label=""
              size="mini"
            >
              <el-button
                class="add-more-item"
                type="primary"
                size="mini"
                @click="toAddGoodsSku"
              > + </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="funSetGoods">确定</el-button>
            <el-button  size="mini" type="primary" @click="isGoodsTwo = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 导入采购商品弹窗 -->
    <el-dialog title="导入商品" :visible.sync="isShopGood" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='loading'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :on-error='uploadError' drag :data="goodsParams" action='/scm-web/stockadjust/importItem' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
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
      <el-button type="primary" size="mini"  @click="submitAuditBtn(1)" :disabled="isSubmit">提交审核</el-button>
      <el-button size="mini"  @click="submitAuditBtn(0)">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import qs from 'qs';
  // 引入xlsx
  let XLSX = require('xlsx');
  export default {
    name: 'stockadjustdetail',
    data() {
      return {
        isAdjustInventory: false, // 是否显示调整库存对象
        id: '',
        isInit: true,
        isTip: true,
        isGoodsOne: false,
        isGoodsTwo: false,
        isTypeThree: false,
        warehouseType: 'MD', // 西安综管平台的门店仓
        code: '',
        accessBusinessType: '',
        businessTypeTip: '用于不同SKU间库存的转化，如：SKU1（一箱牛奶）1个库存转化成SKU2（一瓶牛奶）30个库存',
        businessTypeData: [
          {'code': 0, 'name': '库存盘点'},
          {'code': 1, 'name': '正品转残品'},
          {'code': 2, 'name': '残品转正品'},
          {'code': 3, 'name': '库存转化'},
          {'code': 4, 'name': '系统原因'}], // 业务类型列表
        addOrEditParams: {
          start: 0, // 默认参数
          pageSize: 10, // 默认10条
          pageNo: 1, // 默认第一页
          totalCount: 0
        },
        isChose: true, // 选择商品可点击
        activeName: '1',
        isClick: false,
        disabledDownLoad: false,
        tableData: [],
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
        logCount: 0, // 表单列表总条数
        dailogTableDataList: [], // 弹窗数据列表
        tableDataList: [], // 列表数据
        addTableDataList: [], // 添加商品列表数据
        warehouseList: [], // 调整仓库列表
        searchParams: {
          stockAdjustCode: '',
          adjustWarehouseCode: '', // 调整仓库
          businessType: '', // 库存调整业务类型
          adjustInventoryType: 1, // 库存调整库存类型
          adjustInventoryObject: '', // 库存调整对象
          docStatus: '', // 单据状态
          adjustInstruction: '' // 调整说明
        },
        selectGoodsParams: {
          adjustInventoryType: '',
          businessType: '',
          adjustWarehouseCode: '',
          existStockAdjustSkuDetails: [],
          skuOrBarCode: '', // sku或者条形码
          originalTargetSkuOrBarCodeForms: [{
            originalSkuOrBarCode: '', // 原来
            targetSkuOrBarCode: '' // 现在
          }] // 原商品目标商品sku编号或者条形码
        }, // 添加商品表单
        showAdjustInventoryType: false, // 是否要显示库存调整库存类型
        showAdjustInventoryObj: false, // 是否要显示库存调整对象
        isWarehouseTypeMd: false, // 调整仓库是否是西安综管门店
        isWarehouseTypeTRC: false,
        rules: {
          adjustWarehouseCode: [
            { required: true, message: '请选择调整仓库', trigger: 'blur' }
          ],
          businessType: [
            { required: true, message: '请选择调整业务类型', trigger: 'change' }
          ],
          adjustInventoryType: [
            { required: true, message: '请选择调整库存类型', trigger: 'change' }
          ],
          adjustInventoryObject: [
            { required: true, message: '请选择调整库存对象', trigger: 'change' }
          ]
        }
      };
    },
    watch: {
    },
    created() {
      this.getWarehouseList();
      if (this.$route.params.id === 'add') {
        this.isChose = false;
        this.addTableRow();
      }
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
      renderHeader(createElement, { column, _self }) { // 表头重置
        const label = column.label;
        const labelArr = label.split(',');
        return createElement(
          'span', [
            createElement('span', {
              attrs: { type: 'text' }
            }, [labelArr[0]]),
            createElement('p', {
              attrs: { type: 'text', style: 'color:#f00;line-height:20px;' }
            }, [labelArr[1] || ''] )
          ]
        );
      },
      // 模板的下载地址
      ExcelDownLoad() {
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$utils.messagetip.warningTip('请选择业务类型！');
          return;
        }
        window.open('/scm-web/stockadjust/exampleExport/' + this.searchParams.businessType);
      },
      changeSize(val) {
        this.addOrEditParams.start = 0;
        this.addOrEditParams.pageNo = 1;
        this.addOrEditParams.pageSize = val;
      },
      changeNumber(val) {
        this.addOrEditParams.start = (val - 1) * this.addOrEditParams.pageSize;
        this.addOrEditParams.pageNo = val;
      },
      toAddGoodsSku() {
        this.addTableDataList.unshift({
          originalSkuOrBarCode: '',
          targetSkuOrBarCode: ''
        });
      },
      downloadFail(errorJson) {
        this.disabledDownLoad = true;
        axios({
          // 用axios发送post请求
          method: 'post',
          url: '/scm-web/stockadjust/errors', // 请求地址
          data: {
            errorList: errorJson,
            businessType: this.searchParams.businessType
          },
          responseType: 'blob', // 表明返回服务器返回的数据类型
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
          const fileName = '库存调整单错误商品明细.xls'; // 下载文件名称
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          setTimeout(() => {
            this.disabledDownLoad = false;
           }, 2000);
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
      addTableRow() {
        this.fileDataList.push({});
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 导入商品btn
      importGood() {
        if (!this.searchParams.adjustWarehouseCode) {
          this.$utils.messagetip.warningTip('请选择调整仓库！');
          return;
        }
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$utils.messagetip.warningTip('请选择业务类型！');
          return;
        }
        if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
          this.$utils.messagetip.warningTip('请选择调整库存类型！');
          return;
        }
        if (this.isAdjustInventory && (([1, 2, 3].indexOf(this.searchParams.businessType) > -1) || (([0, 4].indexOf(this.searchParams.businessType) > -1) && this.searchParams.adjustInventoryType === 1)) && this.searchParams.adjustInventoryObject === '') {
          this.$utils.messagetip.warningTip('请先选择调整库存对象');
          return;
        }
        this.isGoodResult = 'default';
        this.uploadResult = {};
        if (this.$refs.uploadGood) {
          this.$refs.uploadGood.clearFiles();
        }
        let objParams = {
          adjustWarehouseCode: this.searchParams.adjustWarehouseCode,
          businessType: this.searchParams.businessType,
          inventoryType: this.searchParams.adjustInventoryType,
          skuDetail: JSON.stringify(this.tableDataList)
        };
        this.goodsParams = objParams;
        this.isShopGood = true;
        this.isClick = false;
        console.log(this.goodsParams);
      },
      // 文件上传中
      uploadProgress(event, file, fileList) {
        this.loading = true;
      },
      // 商品上传成功
      uploadGoodSuccess(response, file, fileList) {
        this.loading = false;
        if (response.appcode === '1' && response.result.errorList.length === 0 ) {
          this.uploadResult = response.result;
          this.isGoodResult = 'success';
        } else {
          this.uploadResult = response.result;
          let successNum = response.result.rightList ? response.result.rightList.length : 0;
          let errorNum = response.result.errorList.length ? response.result.errorList.length : 0;
          this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
          let errorList = response.result.errorList;
          this.errorJson = errorList;
          this.isGoodResult = 'fail';
          this.$utils.messagetip.warningTip(response.databuffer);
        }
      },
      closeGoodUpload() {
        let adjustInventoryObjectName = '';
        this.isClick = true;
        if (this.uploadResult.rightList && this.uploadResult.rightList.length) {
          this.tableDataList = [...this.tableDataList, ...this.uploadResult.rightList];
          adjustInventoryObjectName = this.searchParams.adjustInventoryObject === 0 ? '渠道共享' : '门店专用';
          this.tableDataList.forEach( item => {
            item.adjustInventoryObject = this.searchParams.adjustInventoryObject;
            item.adjustInventoryObjectDesc = adjustInventoryObjectName;
          });
        }
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.isShopGood = false;
      },
      closeGoodFile() {
        this.isShopGood = false;
      },
      // 上传成功关闭
      closeUpload() {
        // this.initDataList();
        this.isAccount = false;
        if (this.fileId) {
          this.uploadResult.id = this.fileId;
        }
        this.fileDataList.splice(this.currentIndex, 1, this.uploadResult);
      },
      // 上传失败关闭
      closeFile() {
        this.isAccount = false;
      },
      // 搜索条件改变清空数据
      resetTableDataList(val) { // warehouseType
        if (val) {
          if (this.warehouseList && this.warehouseList.length) {
            this.warehouseList.forEach(item => {
              if (item.code === val) {
                this.accessBusinessType = item.accessBusinessType;
                this.$AXIOS.GET('/stockadjust/businessTypeList', {businessCodesStr: this.accessBusinessType}).then(res => {
                  this.businessTypeData = res.result;
                });
              };
              if (item.code === this.searchParams.adjustWarehouseCode) {
                if (item.warehouseSourceType === 'MD') {
                  this.isAdjustInventory = true;
                } else {
                  this.isAdjustInventory = false;
                  this.searchParams.adjustInventoryObject = '';
                  this.tableDataList = [];
                }
              }
          });
          }
        }
        // if (val) {
        //   this.warehouseList.forEach( item => {
        //     if (item.code === val) {
        //       this.accessBusinessType = item.accessBusinessType;
        //       this.$AXIOS.GET('/stockadjust/businessTypeList', {businessCodesStr: this.accessBusinessType}).then(res => {
        //         this.businessTypeData = res.result;
        //       });
        //       if (item.warehouseSourceType === this.warehouseType) {
        //         this.isWarehouseTypeMd = true; // 是西安总管门店
        //       } else {
        //         this.isWarehouseTypeMd = false;
        //       }
        //     }
        //   });
        //   if (this.isInit) {
        //     this.isInit = false;
        //     if ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd) {
        //       this.showAdjustInventoryObj = true; // 如果业务类型为库存转化正传残 残转载
        //     } else if ([0, 4].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd && this.searchParams.adjustInventoryType === 1) {
        //       this.showAdjustInventoryObj = true;
        //     } else {
        //       this.showAdjustInventoryObj = false;
        //     }
        //   } else {
        //     this.searchParams.businessType = '';
        //     this.showAdjustInventoryType = false;
        //     this.tableDataList = [];
        //   }
        // }
      },
      // 获取信息
      getSearchParams() {
        this.$AXIOS.GET('/stockadjust/edit/' + this.id).then(res => {
          let resData = res.result;
          this.searchParams.stockAdjustCode = resData.stockAdjustCode;
          this.searchParams.adjustWarehouseCode = resData.adjustWarehouseCode;
          this.searchParams.businessType = resData.businessType;
          this.searchParams.adjustInventoryType = resData.adjustInventoryType;
//          this.searchParams.adjustInventoryObjectDesc = resData.adjustInventoryObjectDesc;
          this.searchParams.adjustInventoryObject = resData.adjustInventoryObject;
          this.searchParams.docStatus = resData.docStatus;
          this.searchParams.adjustInstruction = resData.adjustInstruction;
          this.tableDataList = resData.stockAdjustSkuDetails;
          this.showAdjustInventoryType = resData.adjustInventoryTypeDesc ? 1 : 0;
          // this.showAdjustInventoryObj = resData.adjustInventoryObjectDesc ? 1 : 0;
          if (this.warehouseList && this.warehouseList.length) {
            this.warehouseList.forEach(item => {
              if (item.code === this.searchParams.adjustWarehouseCode) {
                this.accessBusinessType = item.accessBusinessType;
                  this.$AXIOS.GET('/stockadjust/businessTypeList', {businessCodesStr: this.accessBusinessType}).then(res => {
                    this.businessTypeData = res.result;
                });
                if (item.warehouseSourceType === 'MD') {
                  this.isAdjustInventory = true;
                }
              };
            });
          }
      }).finally(() => {
          setTimeout(() => {
          this.isChose = false;
        }, 2000);
      });
      },
      // 提交审核
      submitAudit(id, params) {
        this.$confirm( `您确认要提交审核吗?`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$AXIOS.JSONPOST('/stockadjust/saveOrSubmit/' + id, params).then(res => {
              this.$utils.messagetip.successTip(res.databuffer);
              setTimeout(() => {
                this.$router.push({ path: '/stockadjustlist' });
              }, 20);
            }).finally(() => {
                this.isSubmit = false;
            });
          })
        .catch(() => {
            this.isSubmit = false;
            this.$utils.messagetip.infoTip('已取消');
        });
      },
      // 直接提交审核,没有编辑
      submitSave(id, params) {
        this.$AXIOS.JSONPOST('/stockadjust/saveOrSubmit/' + id, params).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.$router.push({ path: '/stockadjustlist' });
            this.isSubmit = false;
          }, 20);
        }).finally(() => {
            this.isSubmit = false;
        });
      },
      // 仓库下拉列表
      getWarehouseList() {
        this.$AXIOS.GET('/stockadjust/warehouseList').then(res => {
          this.warehouseList = res.result;
          // this.resetTableDataList(this.searchParams.adjustWarehouseCode);
          if (this.$route.params.id !== 'add') {
            this.id = this.$route.params.id;
            this.searchParams.id = this.$route.params.id;
            this.getSearchParams();
          }
        });
      },
      // 多选选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 添加商品
      addGoods() {
        if (!this.searchParams.adjustWarehouseCode) {
          this.$utils.messagetip.warningTip('请先选择调整仓库！');
          return;
        };
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$utils.messagetip.warningTip('请先选择业务类型！');
          return;
        };
        if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
          this.$utils.messagetip.warningTip('请先选择库存调整类型！');
          return;
        };
        if (this.isAdjustInventory && (([1, 2, 3].indexOf(this.searchParams.businessType) > -1) || (([0, 4].indexOf(this.searchParams.businessType) > -1) && this.searchParams.adjustInventoryType === 1)) && this.searchParams.adjustInventoryObject === '') {
          this.$utils.messagetip.warningTip('请先选择调整库存对象');
          return;
        };
        if (this.searchParams.businessType === 3) {
          this.isGoodsTwo = true;
          this.addTableDataList = [];
        } else {
          this.isGoodsOne = true;
        }
        this.selectGoodsParams.skuOrBarCode = '';
        this.selectGoodsParams.originalTargetSkuOrBarCodeForms = [{
          originalSkuOrBarCode: '', // 原来
          targetSkuOrBarCode: '' // 现在
        }];
      },
      // 根据sku或者条形码添加商品或者老sku替换新的sku
      funSetGoods() {
        let adjustInventoryObjectDesc = '';
        this.selectGoodsParams.adjustWarehouseCode = this.searchParams.adjustWarehouseCode;
        this.selectGoodsParams.businessType = this.searchParams.businessType;
        this.selectGoodsParams.adjustInventoryType = this.searchParams.adjustInventoryType;
        this.selectGoodsParams.originalTargetSkuOrBarCodeForms = this.addTableDataList;
        this.selectGoodsParams.existStockAdjustSkuDetails = this.tableDataList;
        this.$AXIOS.JSONPOST('/stockadjust/saveOrSubmit/checkSkuOrBarCode', this.selectGoodsParams ).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isGoodsOne = false;
          this.isGoodsTwo = false;
          this.tableDataList = [...this.tableDataList, ...res.result];
          adjustInventoryObjectDesc = this.searchParams.adjustInventoryObject === 0 ? '渠道共享' : '门店专用';
          this.tableDataList.forEach( item => {
            item.adjustInventoryObject = this.searchParams.adjustInventoryObject;
            item.adjustInventoryObjectDesc = adjustInventoryObjectDesc;
          });
        });
      },
      // 页码条数改变
      logChangeSize(val) {
        this.form.start = 0;
        this.form.pageNo = 1;
        this.form.pageSize = val;
      },
      // 当前页码改变
      logChangeNumber(val) {
        this.form.pageNo = val;
        this.form.start = (val - 1) * this.form.pageSize;
      },
      // 提交审核按钮以及保存
      submitAuditBtn(id) {
        // 格式校验
        let isAdjustNum = false;
        let isTargetAdjuestNum = false;
        let isBoxInt = false;
        let isBoxMoreInt = false;
        let isSkuCode = '';
        let isIntReg = /^[1-9]\d*$/; // 正整数
        let isIntMoreReg = /^-?[1-9]\d*$/; // 正负整数
        if (id === 1) {
          if (!this.searchParams.adjustWarehouseCode) {
            this.$utils.messagetip.warningTip('请先选择调整仓库');
            return;
          }
          if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
            this.$utils.messagetip.warningTip('请先选择业务类型');
            return;
          }
          if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
            this.$utils.messagetip.warningTip('请先选择库存类型');
            return;
          }
          if (this.isWarehouseTypeMd && this.searchParams.adjustInventoryType === 1 && [0, 1].indexOf(this.searchParams.adjustInventoryObject) === -1) {
            this.$utils.messagetip.warningTip('请先选择调整库存对象');
            return;
          }
        }
          this.tableDataList.forEach(item => {
            if (!item.adjustNum) {
              isSkuCode = item.skuCode;
              isAdjustNum = true;
            }
            if (item.adjustNum && !isIntReg.test(item.adjustNum) && ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1)) {
              isSkuCode = item.skuCode;
              isBoxInt = true;
            }
            if (item.adjustNum && !isIntMoreReg.test(item.adjustNum) && ([0, 4].indexOf(this.searchParams.businessType) !== -1)) {
              isSkuCode = item.skuCode;
              isBoxMoreInt = true;
            }
            if (item.targetAdjustNum && !isIntReg.test(item.targetAdjustNum) && this.searchParams.businessType === 3) {
              isSkuCode = item.targetSkuCode;
              isTargetAdjuestNum = true;
            }
          });
          if (isAdjustNum && id) {
            this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的调整数量不能为空！`);
            return;
          }
          if (isBoxInt) {
            this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的调整数量只能为正整数！`);
            return;
          }
          if (isBoxMoreInt) {
            this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的调整数量只能为整数！`);
            return;
          }
          if (isTargetAdjuestNum) {
            this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的调整数量只能为正整数！`);
            return;
          }
          if (this.tableDataList.length === 0 && id) {
            this.$utils.messagetip.warningTip('请至少选择一项商品！');
            return;
          }
        this.isSubmit = true;
        this.searchParams.stockAdjustSkuDetails = JSON.parse(JSON.stringify(this.tableDataList));
        if (id === 1) {
          this.submitAudit(id, this.searchParams);
        } else {
          this.submitSave(id, this.searchParams);
        }
      },
      deleteBtn(i) {
        this.tableDataList.splice(i, 1);
        this.addOrEditParams.totalCount = this.tableDataList.length;
      },
      deleteSurplusBtn(i) {
        this.addTableDataList.splice(i, 1);
      },
      // 返回按钮
      back() {
        this.$router.push({ path: '/stockadjustlist' });
      },
      listenKeyDown(e) { // 回车事件监听
        if (e.keyCode === 13) {
          e.preventDefault();
          this.selectGoodsParams.skuOrBarCode = this.selectGoodsParams.skuOrBarCode + '\n';
        }
      },
      // 检查是否选中调整仓库
      preCheck() {
        if (this.searchParams.adjustWarehouseCode === '') {
          this.$utils.messagetip.errorTip('请先选择“调整仓库”！');
          this.searchParams.businessType = '';
        } else {
          if (this.searchParams.businessType === 0 || this.searchParams.businessType === 4) {
            // this.showAdjustInventoryType = true;
            this.searchParams.adjustInventoryType = 1;
          } else {
            this.searchParams.adjustInventoryType = '';
            // this.showAdjustInventoryType = false;
          }
          this.searchParams.adjustInventoryObject = '';
          // if (this.searchParams.businessType === 3) {
          //   this.isTypeThree = true; // 如果业务类型为库存转化则显示新sku转老sku的弹窗
          // } else {
          //   this.isTypeThree = false;
          // }
          // if ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd) {
          //   this.showAdjustInventoryObj = true; // 如果业务类型为库存转化正传残 残转载
          // } else if ([0, 4].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd && this.searchParams.adjustInventoryType === 1) {
          //   this.showAdjustInventoryObj = true;
          // } else {
          //   this.showAdjustInventoryObj = false;
          // }
          this.tableDataList = [];
        }
      },
      chooseAdjustType() { // 检查是否选中正品
        if (this.searchParams.adjustInventoryType === 1 && this.isWarehouseTypeMd) {
          this.showAdjustInventoryObj = true;
        } else {
          this.showAdjustInventoryObj = false;
          this.searchParams.adjustInventoryObject = '';
        }
        this.tableDataList = [];
      },
      chooseAdjustObj() { // 切换库存调整对象的时候商品明细也清空
        this.tableDataList = [];
      },
      checkValueName() { // 检查skucode等是否正确

      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stockadjustdetail
    .oringinDiv
      span
        padding:2px 10px;
      .targatSkuCode
        display:inline-block;
        border-left: 1px solid #ebeef5;
        width: 150px;
        text-align: center;
      .el-input
        width: 50%
    .add-more-item
      margin-top:28px;
    .btn_group
      margin-top: 15px;
      text-align: center;
      margin-bottom: 15px;
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
  .stockadjustdetail
    .price_list
      div.isadjuststyle::before
        content: '*';
        padding-right: 5px;
        color: #f00;
</style>
