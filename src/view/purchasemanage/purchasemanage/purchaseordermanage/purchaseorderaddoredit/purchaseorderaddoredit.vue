<template>
  <div class="purchaseorderaddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="125px" class="search_form" size="medium">
        <!-- 第0行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="采购单编号：" size="mini">
              {{searchParams.purchaseOrderCode ? searchParams.purchaseOrderCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="供应商名称：" prop="supplierCode" size="mini">
              <el-select v-model="searchParams.supplierCode" filterable @change='resetTableDataList' placeholder="请选择">
                <el-option v-for="item in supplierCodeList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购合同：" prop="contractCode" size="mini">
              <el-input v-model.trim="searchParams.contractCode" :maxlength="32" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属采购组：" prop="purchaseGroupCode" size="mini">
              <el-select v-model="searchParams.purchaseGroupCode" @change='purchaseGroupCodeChange' filterable placeholder="请选择">
                <el-option v-for="item in purchaseGroupCodeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属采购人：" prop="purchasePersonId" size="mini">
              <el-select v-model="searchParams.purchasePersonId" filterable placeholder="请选择">
                <el-option v-for="item in purchasePersonIdList" :key="item.userId" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="采购类型：" prop="purchaseType" size="mini">
              <el-select v-model="searchParams.purchaseType" filterable placeholder="请选择">
                <el-option v-for="item in purchaseTypeList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="币制：" prop="currencyType" size="mini">
              <el-select v-model="searchParams.currencyType" filterable placeholder="请选择">
                <el-option v-for="item in currencyTypeList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式：" prop="payType" size="mini">
              <el-input v-model.trim="searchParams.payType" :maxlength="100" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="收货仓库：" prop="warehouseCode" size="mini">
              <el-select v-model="searchParams.warehouseCode" filterable @change="warehouseChange" placeholder="请选择">
                <el-option v-for="item in warehouseCodeList" :key="item.code" :label="item.warehouseName" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="收货地址：" prop="receiveAddress" size="mini">
              <el-input v-model.trim="searchParams.receiveAddress" :maxlength="200" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提运单号：" prop="takeGoodsNo" size="mini">
              <el-input v-model.trim="searchParams.takeGoodsNo" :maxlength="32" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="收货人：" prop="receiver" size="mini">
              <el-input v-model.trim="searchParams.receiver" :maxlength="50" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货人手机：" prop="receiverNumber" size="mini">
              <el-input v-model.trim="searchParams.receiverNumber" :maxlength="11" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发件人：" prop="sender" size="mini">
              <el-input v-model.trim="searchParams.sender" :maxlength="50" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发件方手机：" prop="senderNumber" size="mini">
              <el-input v-model.trim="searchParams.senderNumber" :maxlength="11" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item prop="senderProvince" label="发件方省份.城市" size="mini">
              <!-- senderProvince, senderCity -->
              <area-select v-model="selected" :data="pca"></area-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发件方详细地址：" prop="senderAddress" size="mini">
              <el-input v-model.trim="searchParams.senderAddress" :maxlength="100" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运输费用承担方：" prop="transportFeeDestId" size="mini">
              <el-select v-model="searchParams.transportFeeDestId" filterable @change="transportFeeChange" placeholder="请选择">
                <el-option v-for="item in transportFeeDestIdList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="要求到货日期：" prop="requriedReceiveDate" size="mini">
              <el-date-picker v-model="searchParams.requriedReceiveDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="截止到货日期：" prop="endReceiveDate" size="mini">
              <el-date-picker v-model="searchParams.endReceiveDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处理优先级：" prop="handlerPriority" size="mini">
              <el-select v-model="searchParams.handlerPriority" filterable placeholder="请选择">
                <el-option v-for="item in handlerPriorityList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <!-- 商品明细 -->
      <el-tab-pane label="商品明细" name="1">
        <el-button type="primary" size="mini" :disabled="isChose" @click="addGoods"> + 选择采购商品</el-button>
        <el-button type="primary" size="mini" :disabled="isChose" @click="importGood">导入商品</el-button>
        <el-button type="text" size="mini">
          <a :href="downloadDefault">模板下载</a>
        </el-button>
        <div style="width: 100%; overflow-x: scroll;margin-top:15px;">
          <div style="text-align: center;margin: 15px 0;"><span>采购总金额：{{totalFeeD}} 元</span> <em style="display: inline-block;margin:0 20px;height: 20px;border-left: 1px solid;width: 1px;vertical-align: middle;"></em> <span>采购总数量：{{purchaseCount}}</span></div>
          <el-table class="price_list" :data="tableDataList.slice((addOrEditParams.pageNo-1)*addOrEditParams.pageSize,addOrEditParams.pageNo*addOrEditParams.pageSize)" style="width: 1900px"  border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="skuName" label="商品SKU名称" align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if='errorList.indexOf(scope.row.skuCode) > -1'>
                     <el-tooltip class="item" effect="dark" content="此商品未配置价格，请完成配置后重新提交" placement="top">
                        <i class="el-icon-warning" style='color: red'></i>
                      </el-tooltip>
                  </span>
                  <span>{{scope.row.skuName}}</span>
                </div>
                </template>
            </el-table-column>
            <el-table-column prop="skuCode" label="商品SKU编号" align="center"></el-table-column>
            <el-table-column prop="specNatureInfo" label="规格" align="center"></el-table-column>
            <el-table-column prop="itemNo" label="货号" align="center"></el-table-column>
            <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
            <el-table-column prop="purchasePriceD" label="含税单价" align="center">
              <template slot-scope="scope">
                <el-input type='number' disabled v-model.trim="scope.row.purchasePriceD" :maxlength='15'  @change="getPurchasePriceDChange((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index)" placeholder="" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="采购税率" align="center">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.taxRate" disabled placeholder="" size="mini">
                  <template slot="append" >%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="purchasingQuantity" label="采购数量"  align="center">
              <template slot-scope="scope">
                <el-input type='number' v-model.trim="scope.row.purchasingQuantity" :maxlength='10' @change="getPurchasePriceDChange2((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index)" placeholder="" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="totalPurchaseAmountD" label="采购总金额(元)" align="center">
              <template slot-scope="scope">
                <!-- <el-input type='number' v-model.trim="scope.row.totalPurchaseAmountD" @change="getTotalPurchaseAmountDChange((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index)" placeholder="" size="mini"></el-input> -->
                <div v-if="scope.row.purchasePriceD * scope.row.purchasingQuantity >= 0">{{scope.row.purchasePriceD * 10000000 * scope.row.purchasingQuantity / 10000000}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="batchCode" label="批次号" align="center">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.batchCode" :maxlength="20" placeholder="" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="produceCode" label="生产编号" align="center">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.produceCode" placeholder="" :maxlength="20" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteBtn((addOrEditParams.pageNo-1)*addOrEditParams.pageSize + scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="paging">
                <el-pagination
                  @size-change="changeSize"
                  @current-change="changeNumber"
                  :current-page="addOrEditParams.pageNo"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500, 1000]"
                  :page-size="addOrEditParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="addOrEditParams.totalCount"
                >
                </el-pagination>
              </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="2">
        <!-- 附件信息 -->
          <p style="color: orange; line-height: 25px;">注：以下内容上传仅支持xls、xlsx、doc、docx、jpg、jpeg、png、bmp、rar格式，附件内容最多只能上传一个，大小不超过10M。</p>
          <!-- <el-button type="primary" size="mini" @click="addTableRow" v-show="!fileDataList.length">添加一行附件信息</el-button> -->
          <el-table :data="fileDataList" border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="附件名称（带*的必传）" align="center">
              <template>
                <span class='tip_red'>装箱单</span>
              </template>
            </el-table-column>
            <el-table-column prop="skuName" label="附件内容" align="center">
              <template slot-scope="scope">
                <div class='btn' v-if="scope.row.key" @click='uploadFile(scope.row.key)'>{{scope.row.fileName}}</div>
                <div class='btn' v-else @click='uploadFile(scope.row.uploadFileName)'>{{scope.row.fileName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="importAccount(scope.$index)">上传</el-button>
                <el-button type="text" @click="deleteUpload(scope.row.id, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他" name="3">
        <el-form :model="searchParams" ref="searchParams" label-width="100px" class="search_form" size="medium" align="center">
          <el-row :span="20">
            <el-col :span="12">
              <el-form-item label="退换货地址：" size="mini">
                <el-input v-model.trim="searchParams.goodsReturnAddress" placeholder="" :maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="质保期：" size="mini">
                <el-input v-model.trim="searchParams.guaranteePeriod" placeholder="" :maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="20">
            <el-col :span="12">
              <el-form-item label="纸箱唛头：" size="mini">
                <el-col :span="12">
                  <div class="paper-box-mark" style="margin-right: 10px;">
                    <span>正唛</span>
                    <ul>
                      <li>
                        <el-form-item label="箱唛：" size="mini">
                          <el-select v-model="searchParams.mainMarkBox" filterable placeholder="请选择">
                            <el-option v-for="item in markBoxOption" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="品名：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkName" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="规格：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkSpec" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="颜色：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkColor" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="数量：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkNum" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="条形码：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkBarcode" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="箱号：" size="mini">
                          <el-input v-model.trim="searchParams.mainMarkCn" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                    </ul>
                  </div>
                </el-col>
                <el-col :span="12" align="right">
                  <div class="paper-box-mark">
                    <span>侧唛</span>
                    <ul>
                      <li>
                        <el-form-item label="箱唛：" size="mini">
                          <el-select v-model="searchParams.sideMarkBox" filterable placeholder="请选择">
                            <el-option v-for="item in markBoxOption" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="品名：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkName" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="条形码：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkBarcode" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="数量：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkNum" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="毛重：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkWeight" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="外箱规格：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkSpec" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                      <li>
                        <el-form-item label="箱号：" size="mini">
                          <el-input v-model.trim="searchParams.sideMarkCn" placeholder="" :maxlength="50"></el-input>
                        </el-form-item>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验货标准：" size="mini">
                <el-input type="textarea" v-model.trim="searchParams.acceptanceStandard" placeholder="" :maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="20">
            <el-col :span="24">
              <el-form-item label="备注：" size="mini">
                <quill-editor
                  :options="editorOption"
                  v-model="searchParams.remark">
                </quill-editor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 自采商品管理列表 弹窗 -->
    <el-dialog title="选择采购商品" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="125px" class="search_form" size="medium">
        <!-- 第一行 -->
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="SKU名称" size="mini">
              <el-input v-model.trim="form.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品货号：" size="mini">
              <el-input v-model.trim="form.itemNo" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称：" size="mini">
              <el-select v-model="form.brandId" filterable placeholder="请选择">
                <el-option v-for="item in brandNameList" :key="item.brandId" :label="item.brandName" :value="item.brandId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="8">
            <el-form-item label="商品SKU编号：" size="mini">
              <el-input v-model.trim="form.skuCode" placeholder="输入多个请用英文,隔开"></el-input>
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
      <div class="tip" style="text-align: left;width: 100%;padding-left: 15px">
        同时满足下列条件的商品才显示：①商品状态为启用 ②商品未被添加过
      </div>
      <el-table ref="dialogTable" :data="dailogTableDataList" border tooltip-effect="dark" height="454" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品SKU名称" align="center"></el-table-column>
        <el-table-column prop="skuCode" label="商品SKU编号" align="center"></el-table-column>
        <el-table-column prop="specNatureInfo" label="规格" align="center"></el-table-column>
        <el-table-column prop="itemNo" label="货号" align="center"></el-table-column>
        <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌名称" align="center"></el-table-column>
        <el-table-column prop="allCategoryName" label="一级分类.二级分类.三级分类" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="form.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
        </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="makeSureAddGoods" size="mini" :disabled="isClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 报价弹窗 -->
    <el-dialog title="导入附件" :visible.sync="isAccount" width="60%" :close-on-click-modal='false' :show-close='false' >
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="upload" v-show="isResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" drag action="/scm-web/qinniuPrivate/uploadFile" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>附件导入成功</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="isResult === 'default' || isResult === 'fail'">
        <div style="text-align: center;">
          <el-button @click="closeFile" size="mini">关闭</el-button>
        </div>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <div style="text-align: center;">
          <el-button @click="closeUpload" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 导入采购商品弹窗 -->
    <el-dialog title="导入采购商品" :visible.sync="isShopGood" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='loading'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :on-error='uploadError' drag :data="goodsParams" action='/scm-web/purchase/purchaseSkuImport' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
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
      <!-- <span slot="footer" class="dialog-footer" v-if="isGoodResult === 'default' || isGoodResult === 'fail'">
        <div style="text-align: center;">
          <el-button @click="closeGoodFile" size="mini">关闭</el-button>
        </div>
      </span> -->
      <span slot="footer" class="dialog-footer" >
        <div style="text-align: center;">
          <el-button @click="closeGoodUpload" size="mini" :disabled="isClick">关闭</el-button>
        </div>
      </span>
    </el-dialog>

    <div class="btn_group">
      <el-button type="primary" size="mini"  @click="submitAuditBtn" :disabled="isSubmit">提交审核</el-button>
      <el-button size="mini"  @click="saveBtn">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
    <!-- 预览信息 -->
    <div class="preview-info" @click="isOpenPreviewDia"><i class="el-icon-view"></i>预览</div>
    <el-dialog :visible.sync="isPreviewInfo" width="820px">
      <div class="print" id="pdfDom" style="width: 800px">
        <div class="print_order" :data="searchParams">
          <div>
            <h2 style="font-size: 20px; font-weight: 700; text-align: center;margin: 10px 0 25px 0">采购订单</h2>
            <el-row type="flex" class="row-bg" :gutter="20" justify="center" style="font-size: 14px">
              <el-col :span="6" ><div style='text-align: center'>制单人：{{searchParams.createOperatorName}}</div></el-col>
              <el-col :span="6" ><div style='text-align: center'>联系方式：{{searchParams.createOperatorPhone}}</div></el-col>
              <el-col :span="6" ><div style='text-align: center'>制单日期：{{searchParams.createTime ? searchParams.createTime.substr(0,10) : ''}}</div></el-col>
            </el-row>
            <div class="line"></div>
            <span class="tip" style="font-size: 16px;margin: 1px 0 0">基本信息</span>
            <div style="padding: 10px;margin: 0 15px;font-size: 12px">
              <table border="1" cellspacing="0" style="width: 100%;">
                <tr>
                  <td class="item table_title">采购单编号</td>
                  <td class="item table_content">{{searchParams.purchaseOrderCode}}</td>
                  <td class="item table_title">采购方</td>
                  <td class="item table_content">{{searchParams.purchaseCompany}}</td>
                </tr>
                <tr>
                  <td class="item table_title">供应商</td>
                  <td class="item table_content">{{searchParams.supplierName}}</td>
                  <td class="item table_title">供应商联系人</td>
                  <td class="item table_content">{{searchParams.supplierPhone}}</td>
                </tr>
                <tr>
                  <td class="item table_title">付款方式</td>
                  <td class="item table_content">{{searchParams.payType}}</td>
                  <td class="item table_title">运输费用承担方</td>
                  <td class="item table_content">{{searchParams.transportFeeDestIdName}}</td>
                </tr>
                <tr>
                  <td class="item table_title">要求到货日期</td>
                  <td class="item table_content">{{searchParams.requriedReceiveDate ? searchParams.requriedReceiveDate.substr(0,10) : ''}}</td>
                  <td class="item table_title">截止到货日期</td>
                  <td class="item table_content">{{searchParams.endReceiveDate ? searchParams.endReceiveDate.substr(0,10) : ''}}</td>
                </tr>
                <tr>
                  <td class="item table_title">收货仓库</td>
                  <td colspan="3" class="item table_content" style="text-align: left;padding-left: 10px;">{{searchParams.warehouseName}}</td>
                </tr>
              </table>
            </div>
            <div class="line"></div>
            <span class="tip" style="font-size: 16px;margin: 1px 0 0">商品明细</span>
            <el-row style="margin-bottom: 15px">
              <el-col :span="12">
                <div style="font-size: 14px;text-align: right; padding-right: 20px;line-height: 30px;margin-bottom: 10px;">
                  采购总金额：<span style="font-weight: 700;font-size: 15px">{{totalFeeD}}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="font-size: 14px;border-left: solid 1px #ccc; padding-left: 20px;line-height: 30px;margin-bottom: 10px;">
                  采购总数量：<span style="font-weight: 700;font-size: 15px">{{purchaseCount}}</span>
                </div>
              </el-col>
            </el-row>
            <el-table :data="tableDataList" style="width: 780px;font-size: 14px" border>
              <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
              <el-table-column prop="skuName" label="SKU名称" align="center" width="150"></el-table-column>
              <el-table-column prop="barCode" label="条形码" align="center" width='100'></el-table-column>
              <el-table-column prop="purchasePriceD" label="含税单价（元）" align="center" width="130"></el-table-column>
              <el-table-column prop="taxRate" label="采购税率"  align="center" width="100">
                <template slot-scope="scope">
                  <div>{{scope.row.taxRate}}%</div>
                </template>
              </el-table-column>
              <el-table-column prop="purchasingQuantity" label="采购数量"  align="center" width="100"></el-table-column>
              <el-table-column prop="totalPurchaseAmount" label="采购总金额（元）"  align="center">
                <template slot-scope="scope">
                  <!-- <div v-if="scope.row.purchasePriceD * scope.row.purchasingQuantity >= 0">{{scope.row.purchasePriceD * 10000000 * scope.row.purchasingQuantity / 10000000 }}</div> -->
                  <div v-if="scope.row.totalPurchaseAmountD >= 0">{{scope.row.totalPurchaseAmountD}}</div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="line"></div>
            <span class="tip" style="font-size: 16px;margin: 1px 0 0">其他信息</span>
            <div class="other_info">
              <el-row style="font-size: 14px">
                <el-col><div class="other_info_span"><span>收货地址</span>：{{searchParams.receiveAddress}}</div></el-col>
              </el-row>
              <el-row style="font-size: 14px">
                <el-col><div class="other_info_span"><span>退换货地址</span>：{{searchParams.goodsReturnAddress}}</div></el-col>
              </el-row>
              <el-row style="font-size: 14px">
                <el-col><div class="other_info_span"><span>质保期</span>：{{searchParams.guaranteePeriod}}</div></el-col>
              </el-row>
              <el-row style="font-size: 14px;height: 300px;">
                <el-col>
                  <div class="other_info_span"><span>纸箱唛头</span>：
                  <span class="box_info box_info_left">
                    <el-row style="font-size: 14px;font-weight:700">
                      <el-col>正唛：</el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>{{searchParams.mainMarkBox}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>品名：{{searchParams.mainMarkName}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>规格：{{searchParams.mainMarkSpec}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>颜色：{{searchParams.mainMarkColor}}</div></el-col>
                    </el-row>
                     <el-row style="font-size: 14px">
                       <el-col><div>数量：{{searchParams.mainMarkNum}}</div></el-col>
                     </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>条形码：{{searchParams.mainMarkBarcode}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>箱号：{{searchParams.mainMarkCn}}</div></el-col>
                    </el-row>
                  </span>
                  <span class="box_info box_info_right">
                    <el-row style="font-size: 14px;font-weight:700">
                      <el-col>侧唛：</el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>{{searchParams.sideMarkBox}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>品名：{{searchParams.sideMarkName}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>条形码：{{searchParams.sideMarkBarcode}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>数量：{{searchParams.sideMarkNum}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>毛重：{{searchParams.sideMarkWeight}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>外箱规格：{{searchParams.sideMarkSpec}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>箱号：{{searchParams.sideMarkCn}}</div></el-col>
                    </el-row>
                  </span>
                  </div>
                </el-col>
              </el-row>
              <el-row style="font-size: 14px">
                <el-col><div class="other_info_span"><span>验货标准</span>：{{searchParams.acceptanceStandard}}</div></el-col>
              </el-row>
              <el-row style="font-size: 14px">
                <el-col><div class="ql-snow"><span style="display: inline-block;line-height: 30px;font-weight: 700">备注</span>：<div class="ql-editor" v-html="searchParams.remark" style="border:1px solid #ccc;padding: 10px;width:780px">{{searchParams.remark}}</div></div></el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <a id="downlink"></a>
  </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor'; // 调用编辑器
import { pca, pcaa } from 'area-data'; // v5 or higher
const Font = Quill.import('formats/font');
let fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
Font.whitelist = fonts;
Quill.register(Font, true);
// 引入xlsx
let XLSX = require('xlsx');
// 工具栏配置
const toolbarOptions = [ // 富文本编辑器工具栏配置
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: fonts }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'] // 清除文本格式
];
export default {
  name: 'purchaseorderaddoredit',
  data() {
    return {
      errorList: [], // 没有定价的数组
      fixedNum: 0,
      addOrEditParams: {
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      isChose: true, // 选择采购商品可点击
      userName: window.sessionStorage.userName,
      userId: window.localStorage.userID,
      isPreviewInfo: false,
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
      totalFeeD: 0,
      purchaseCount: 0, // 采购数量
      selected: [],
      logCount: 0, // 表单列表总条数
      isOnlyOnePer: [], // 制单人是否归属于一个采购组
      form: {
        isValid: 1,
        supplierCode: '', // 供应商名称
        warehouseCode: '', // 仓库id
        skuName: '', // 商品名称
        itemNo: '', // 商品货号
        brandId: '', // 品牌
        skuCode: '', // 商品SKU编号
        barCode: '', // 条形码
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
      supplierCodeDetail: {}, // 供应商具体信息
      purchaseTypeList: [], // 采购类型下拉列表
      payTypeList: [], // 付款方式下拉列表
      purchaseGroupCodeList: [], // 归属采购组下拉列表
      purchasePersonIdList: [], // 归属采购人下拉列表
      warehouseCodeList: [], // 收货仓库下拉列表
      currencyTypeList: [], // 币制下拉列表
      handlerPriorityList: [], // 处理优先级下拉列表
      transportFeeDestIdList: [], // 运输费用承担方下拉列表
      tableDataList: [], // 列表数据
      otherParams: {
        standard: '以产前确认样为准，行业标准， 特殊要求。凡是经检验不合格的产品应在3个工作日内补回。注意： 1 如果没有打样，必须做大货产前样拍照供我司确认，确认可以了方可进行大货生产；出货前拍实物图给我司确认再出货。2 买方提供一次免费质检。如因为供货商原因无法按期验货或者验货不通过，需二次验货或多次验货，供货方需支付人工费1000元/人/天+差旅费。验收标准：完成80%以上的成品包装才能提前5天申请验货。'
      }, // 其他
      searchParams: {
        supplierCode: '', // 供应商名称
        contractCode: '', // 采购合同
        purchaseType: 'purchaseSelling', // 采购类型
        payType: '', // 付款方式
        paymentProportion: '', // 付款比例
        purchaseGroupCode: '', // 归属采购组
        purchasePersonId: '', // 归属采购人
        warehouseCode: '', // 收货仓库
        currencyType: 'rmb', // 币制
        receiver: '', // 收货人
        receiverNumber: '', // 收货人手机
        takeGoodsNo: '', // 提运单号
        transportFeeDestId: '', // 运输费用承担方
        requriedReceiveDate: '', // 要求到货日期
        endReceiveDate: '', // 截止到货日期
        handlerPriority: '1', // 处理优先级
        remark: '<p>1、材质：</p><p><br></p><p>2、包装：</p><p><br></p><p>3、装箱要求：</p><p><br></p><p>4、交货期：</p>', // 备注
        totalFeeD: '', // 采购总金额
        purchaseCount: '', // 采购总数量
        sender: '', // 发件人
        senderProvince: '', // 发件方省份.城市
        senderCity: '', // 发件方省份.城市
        senderNumber: '', // 发件方手机
        senderAddress: '', // 发件方详细地址
        goodsReturnAddress: '', // 退换货地址
        receiveAddress: '', // 收货地址
        acceptanceStandard: '以产前确认样为准，行业标准， 特殊要求。凡是经检验不合格的产品应在3个工作日内补回。注意： 1 如果没有打样，必须做大货产前样拍照供我司确认，确认可以了方可进行大货生产；出货前拍实物图给我司确认再出货。2 买方提供一次免费质检。如因为供货商原因无法按期验货或者验货不通过，需二次验货或多次验货，供货方需支付人工费1000元/人/天+差旅费。验收标准：完成80%以上的成品包装才能提前5天申请验货。', // 验货标准
        guaranteePeriod: '', // 质保期
        mainMarkBox: '', // 箱唛
        mainMarkName: '', // 品名
        mainMarkSpec: '', // 规格
        mainMarkColor: '', // 颜色
        mainMarkNum: '', // 数量
        mainMarkCn: '', // 箱号
        mainMarkBarcode: '', // 条形码
        sideMarkName: '', // 品名
        sideMarkBarcode: '', // 条形码
        sideMarkNum: '', // 数量
        sideMarkWeight: '', // 毛重
        sideMarkSpec: '', // 外箱规格
        sideMarkCn: '', // 箱号
        purchaseCompany: '西安泰然城电子商务有限公司', // 采购方
        createOperatorName: window.sessionStorage.userName,  // 制单人
        createOperatorPhone: window.localStorage.userPhone  // sessionStorage 登录之后就会被清除掉
      },
      markBoxOption: ['小泰良品', '其他'],
      rules: {
        supplierCode: [
          { required: true, message: '请选择供应商名称', trigger: 'blur' }
        ],
        purchaseType: [
          { required: true, message: '请选择采购类型', trigger: 'blur' }
        ],
        purchaseGroupCode: [
          { required: true, message: '请选择归属采购组', trigger: 'blur' }
        ],
        purchasePersonId: [
          { required: true, message: '请选择归属采购人', trigger: 'blur' }
        ],
        currencyType: [
          { required: true, message: '请选择币制', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: true, message: '请选择收货仓库', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        receiverNumber: [
          { required: true, message: '请输入收货人手机号', trigger: 'blur' }
        ],
        transportFeeDestId: [
          { required: true, message: '请选择运输费用承担方', trigger: 'blur' }
        ],
        requriedReceiveDate: [
          { required: true, message: '请选择要求到货日期', trigger: 'blur' }
        ],
        endReceiveDate: [
          { required: true, message: '请选择截止到货日期', trigger: 'blur' }
        ],
        handlerPriority: [
          { required: true, message: '请选择处理优先级', trigger: 'blur' }
        ],
        totalFeeD: [
          { required: true, message: '请输入采购总金额', trigger: 'blur' }
        ],
        purchaseCount: [
          { required: true, message: '请输入采购总数量', trigger: 'blur' }
        ],
        sender: [{ required: true, message: '请输入发件人', trigger: 'blur' }],
        senderProvince: [
          { required: true, message: '请选择发件方省份', trigger: 'blur' }
        ],
        senderCity: [
          { required: true, message: '请选择发件方城市', trigger: 'blur' }
        ],
        senderNumber: [
          { required: true, message: '请输入发件方手机号', trigger: 'blur' }
        ],
        senderAddress: [
          { required: true, message: '请输入发件方详细地址', trigger: 'blur' }
        ],
        payType: [
          { required: true, message: '请输入付款方式', trigger: 'blur' }
        ],
        receiveAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ]
      },
      editorOption: {
        placeholder: '',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions  // 工具栏,
          }
        }
      }
    };
  },
  components: {
    quillEditor
  },
  watch: {
    totalFeeD(n, o) {
      this.searchFormData.totalFeeD = n;
    },
    purchaseCount(n, o) {
      this.searchFormData.purchaseCount = n;
    },
    searchParams: {
      deep: true,
      handler: function(n, o) {
        this.searchParams = n;
      }
    }
  },
  computed: {
    // // 导入失败下载的地址
    // downloadFail() {
    //   return (
    //     '/scm-web/purchase/purchaseExportError?errorJson=' + this.errorJson
    //   );
    // },
    // 模板的下载地址
    downloadDefault() {
      return (
        '/scm-web/purchase/purchaseExportTemplate'
      );
    }
  },
  mounted() {
    this.outFile = document.getElementById('downlink');
  },
  created() {
    this.getPurchasePriceBit();
    console.log(this.pca);
    this.getSupplierCodeList();
    this.getPurchaseTypeList();
    this.getPayTypeList();
    this.getPurchaseGroupCodeList();
    this.getCurrencyTypeList();
    this.getTransportFeeDestIdList();
    this.getHandlerPriorityList();
    this.getwarehouseCodeList();
    if (this.$route.params.id !== 'add') {
      this.id = this.$route.params.id;
      this.getSearchParams();
      this.getTableDataList();
    } else {
      this.isChose = false;
      this.addTableRow();
    }
  },
  filters: {
    tofixed(val) {
      let num = val.toString();
      if (num.indexOf('.') > -1 && num.split('.')[1].length > 7) {
        num = Number(num).toFixed(7);
        return num;
      }
      return num;
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (this.errorList.indexOf(row.skuCode) > -1) {
        return 'warning-row';
      }
      return '';
    },
    getPurchasePriceBit() {
      this.$AXIOS.GET('/purchase/selectPurchasePriceBit/purchasePriceBit').then(res => {
        this.fixedNum = res.result;
      });
    },
    getPurchasePriceDChange(i) {
      let numReg = /^[0-9.]+$/;
      if (this.tableDataList[i].purchasePriceD && !numReg.test(this.tableDataList[i].purchasePriceD)) {
        this.$utils.messagetip.warningTip('采购单价只能为数字！');
          return;
      }
      if (!this.tableDataList[i].purchasingQuantity && this.tableDataList[i].purchasingQuantity !== '0' && this.tableDataList[i].totalPurchaseAmountD) {
          this.$utils.messagetip.warningTip('请先填写采购数量！');
          return;
      }
      let price = this.tableDataList[i].purchasePriceD || 0;
      let count = this.tableDataList[i].purchasingQuantity || 0;
      let total = this.tableDataList[i].totalPurchaseAmountD || 0;
      if (price && count) {
        let result = price * 10000000 * count;
        result = (result / 10000000).toString();
        if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
          result = Number(result).toFixed(this.fixedNum);
        }
        this.$set(this.tableDataList[i], 'totalPurchaseAmountD', result);
        this.getTotalFeeD();
      } else {
        if (count && total && !price) {
          let result = (total / count).toString();
          if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
            result = Number(result).toFixed(this.fixedNum);
          }
          this.$set(this.tableDataList[i], 'purchasePriceD', result);
          this.getTotalFeeD();
        } else {
          this.$set(this.tableDataList[i], 'totalPurchaseAmountD', 0);
          this.getTotalFeeD();
        }
      }
    },
    getPurchasePriceDChange2(i) {
      let numReg2 = /^[0-9]+$/;
      if (this.tableDataList[i].purchasingQuantity && !numReg2.test(this.tableDataList[i].purchasingQuantity)) {
        this.$utils.messagetip.warningTip('采购数量只能为整数！');
          return;
      }
      // if (!this.tableDataList[i].purchasingQuantity && this.tableDataList[i].purchasingQuantity !== '0' && this.tableDataList[i].totalPurchaseAmountD) {
      //     this.$utils.messagetip.warningTip('请先填写采购数量！');
      //     return;
      // }
      let price = this.tableDataList[i].purchasePriceD || 0;
      let count = this.tableDataList[i].purchasingQuantity || 0;
      let total = this.tableDataList[i].totalPurchaseAmountD || 0;
      if (price && count) {
        let result = price * 10000000 * count;
        result = (result / 10000000).toString();
        if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
          result = Number(result).toFixed(this.fixedNum);
        }
        this.$set(this.tableDataList[i], 'totalPurchaseAmountD', result);
        this.getTotalFeeD();
      } else {
        if (count && total && !price) {
          let result = (total / count).toString();
          if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
            result = Number(result).toFixed(this.fixedNum);
          }
          this.$set(this.tableDataList[i], 'purchasePriceD', result);
          this.getTotalFeeD();
        } else {
          this.$set(this.tableDataList[i], 'totalPurchaseAmountD', 0);
          this.getTotalFeeD();
        }
      }
    },
    getTotalPurchaseAmountDChange(i) {
      let numReg = /^[0-9.]+$/;
      if (this.tableDataList[i].totalPurchaseAmountD && !numReg.test(this.tableDataList[i].totalPurchaseAmountD)) {
        this.$utils.messagetip.warningTip('采购总金额只能为数字！');
          return;
      }
      if (!this.tableDataList[i].purchasingQuantity && this.tableDataList[i].purchasingQuantity !== '0' && this.tableDataList[i].purchasePriceD) {
          this.$utils.messagetip.warningTip('请先填写采购数量！');
          return;
      }
      let price = this.tableDataList[i].purchasePriceD || 0;
      let count = this.tableDataList[i].purchasingQuantity || 0;
      let total = this.tableDataList[i].totalPurchaseAmountD || 0;
      if (count && total) {
        let result = (total / count).toString();
        if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
          result = Number(result).toFixed(this.fixedNum);
        }
        this.$set(this.tableDataList[i], 'purchasePriceD', result);
        this.getTotalFeeD();
      } else if (price && count && !total) {
        let result = price * 10000000 * count;
        result = (result / 10000000).toString();
        if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
          result = Number(result).toFixed(this.fixedNum);
        }
        this.$set(this.tableDataList[i], 'totalPurchaseAmountD', result);
        this.getTotalFeeD();
      }
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
    fromCodeToName(proCode, cityCode, areaCode) {
      let addArr = JSON.parse(window.localStorage.addressArr);
      let nameStr = '';
      addArr.forEach(item => {
        if (item.id === proCode) {
          nameStr += item.text;
          item.children.forEach(it => {
            if (it.id === cityCode) {
              nameStr += it.text;
              it.children.forEach(i => {
                if (i.id === areaCode) {
                  nameStr += i.text;
                }
              });
            }
          });
        }
      });
      return nameStr;
    },
    isOpenPreviewDia() {
        this.isPreviewInfo = true;
        this.getTotalFeeD();
    },
    payTypeChange(val) {
      if (val) {
        this.searchParams.paymentProportion = '';
        console.log(this.searchParams);
        console.log(12333333333);
      }
    },
    moduleDownLoad(url) {
      axios({
        // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // 处理返回的文件流
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = '采购单错误商品明细.xls'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        // this.disabledDownLoad = false;
        setTimeout(() => {
          this.disabledDownLoad = false;
        }, 2000);
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
      this.$AXIOS.POST('/purchase/getErrorJson', {errorJson: errorJson}).then(res => {
        // window.open('/scm-web/purchase/purchaseExportError?errorJsonUid=' + res.result);
        let url = '/scm-web/purchase/purchaseExportError?errorJsonUid=' + res.result;
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
        if (!this.fileDataList.length) {
          this.addTableRow();
        }
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
      if (!this.searchParams.supplierCode) {
        this.$utils.messagetip.warningTip('请选择供应商名称！');
        return;
      }
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请选择收货仓库！');
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
        purchaseOrderCode: this.searchParams.purchaseOrderCode ? this.searchParams.purchaseOrderCode : '',
        supplierCode: this.searchParams.supplierCode,
        isExistSku: arr.join()
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
      console.log('上传成功');
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.loading = false;
      if (response.appcode === '1' && !response.result.errorImportList ) {
        this.uploadResult = response.result;
        this.isGoodResult = 'success';
      } else {
        this.uploadResult = response.result;
        let successNum = response.result.successImportList ? response.result.successImportList.length : 0;
        let errorNum = response.result.errorImportList.length ? response.result.errorImportList.length : 0;
        this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
        let errorImportList = response.result.errorImportList;
        // errorImportList.forEach(item => {
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
        this.errorJson = JSON.stringify(errorImportList);
        this.isGoodResult = 'fail';
        // this.errorJson = errorImportList;
        this.$utils.messagetip.warningTip(response.databuffer);
      }
    },
    closeGoodUpload() {
      let params = {};
      let arr = [];
      let priceArr = [];
      this.uploadResult.successImportList.forEach(item => {
        arr.push(item.skuCode);
      });
      params.skuCode = arr.join();
      // 增加价格查询商品中心接口
      this.$AXIOS.POST('/purchase/purchasePrice', params, true).then(res => {
        let result = res.result;
        if (result && result.length) {
          result.forEach(item => {
            priceArr.push(item.sku);
            this.uploadResult.successImportList.forEach(subItem => {
              if (item.sku === subItem.skuCode) {
                subItem.purchasePriceD = item.purchasePrice;
                subItem.taxRate = item.taxRate;
              }
            });
          });
        }
      }).finally(() => {
        // 校验添加的sku在商品中心是否有价格，没价格弹出提示信息
        let list = [];
        if (priceArr && priceArr.length) {
          arr.forEach(subItem => {
            if (priceArr.indexOf(subItem) < 0) {
              list.push(subItem);
            }
          });
          this.errorList = list;
          console.log('1');
        } else {
          this.errorList = arr;
          console.log('2');
        }
        console.log(this.errorList);
        if (this.errorList && this.errorList.length) {
          this.tipModal();
        }
      });

      this.isClick = true;
      if (this.uploadResult.successImportList && this.uploadResult.successImportList.length) {
        this.tableDataList = [...this.tableDataList, ...this.uploadResult.successImportList];
        this.tableDataList.forEach(item => {
           let result = item.purchasePriceD * 10000000 * item.purchasingQuantity;
           result = (result / 10000000).toString();
          if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
            result = Number(result).toFixed(this.fixedNum);
          }
           item.totalPurchaseAmountD = result;
        });
      }
      this.addOrEditParams.totalCount = this.tableDataList.length;
      this.changeNumber(1);
      this.isShopGood = false;
      setTimeout(() => {
        this.getTotalFeeD();
      }, 600);
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
    warehouseChange(val) {
      if (val) {
        this.warehouseCodeList.forEach(item => {
          if (item.code === val) {
            this.searchParams.receiver = item.warehouseContact;
            this.searchParams.receiverNumber = item.warehouseContactNumber;
            this.searchParams.warehouseName = item.warehouseName;
            this.searchParams.receiveAddress = item.provinceName + item.cityName + (item.city !== item.area ? item.areaName : '') + item.address;
          }
        });
        this.tableDataList = [];
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.getTotalFeeD();
      }
    },
    transportFeeChange(val) {
      if (val) {
        this.transportFeeDestIdList.forEach(item => {
          if (item.value === val) {
            this.searchParams.transportFeeDestIdName = item.name;
          }
        });
      }
    },
    // 搜索条件改变清空数据
    resetTableDataList(val) {
      if (val) {
        this.tableDataList = [];
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.getTotalFeeD();
        this.supplierCodeList.forEach(item => {
          if (item.supplierCode === val) {
            this.searchParams.supplierName = item.supplierName;
            this.searchParams.supplierPhone = item.contact + '(' + item.phone + ')';
            this.getSupplierCodeDetail( item.supplierCode );
          }
        });
      }
    },
    // 获取总金额
    getTotalFeeD() {
      let result = 0;
      let resultCount = 0;
      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          if (item.purchasePriceD && item.purchasingQuantity) {
            result += item.purchasePriceD * 10000000 * item.purchasingQuantity;
          }
          if (item.purchasingQuantity) {
            resultCount += item.purchasingQuantity * 1;
          }
        });
      }
      result = (result / 10000000).toString();
      if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
        result = Number(result).toFixed(this.fixedNum);
      }
      this.totalFeeD = result;
      this.purchaseCount = resultCount;
    },
    // 获取采购单信息
    getSearchParams() {
      this.$AXIOS.GET('/purchase/purchaseOrder/' + this.id).then(res => {
        this.searchParams = res.result;
        if (this.searchParams.purchaseGroupCode) {
          this.getPurchasePersonIdList(this.searchParams.purchaseGroupCode);
        }
        if (this.searchParams.purchaseOrderCode) {
          this.getUploadDataList(this.searchParams.purchaseOrderCode);
        }
        if (this.searchParams.senderCity) {
          this.selected = [this.searchParams.senderProvince, this.searchParams.senderCity];
          console.log('城市列表：', this.selected);
        }
      }).finally(() => {
        setTimeout(() => {
          this.isChose = false;
        }, 2000);
      });
    },
    // 获取采购单信息明细
    getTableDataList() {
      this.$AXIOS.LISTGET('/purchase/purchaseDetail', { purchaseId: this.id, isAudit: true }).then(res => {
        this.tableDataList = res;
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.getTotalFeeD();
      });
    },
    tipModal() {
      this.$confirm('采购单中存在未配置价格的商品！请完成价格配置后重新提交。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
        });
    },
    // 提交审核
    submitAudit(params) {
      this.errorList = [];
      this.$AXIOS.PUT('/purchase/purchaseOrderAudit/' + this.id, params, true).then(res => {
        console.log(res);
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({ path: '/purchaseordermanage' });
        }, 20);
      }).catch(err => {
        this.errorList = err.result;
        if (this.errorList && this.errorList.length) {
          this.tipModal();
        }
      });
    },
    // 直接提交审核,没有编辑
    submitAuditNoId(params) {
      this.errorList = [];
      this.$AXIOS.POST('/purchase/purchaseOrderAudit', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({ path: '/purchaseordermanage' });
        }, 20);
      }).catch(err => {
        this.errorList = err.result;
        if (this.errorList && this.errorList.length) {
          this.tipModal();
        }
      });
    },
    // 供应商名称下拉列表
    getSupplierCodeList() {
      this.$AXIOS.GET('/purchase/suppliers').then(res => {
        this.supplierCodeList = res.result;
      });
    },
    // 某一供应商的具体信息
    getSupplierCodeDetail(codeId) {
      this.$AXIOS.GET('/supplier/supplier/' + codeId).then(res => {
        this.supplierCodeDetail = res.result.supplierAfterSaleInfo;
        this.searchParams.goodsReturnAddress = this.fromCodeToName(this.supplierCodeDetail.saleProvince, this.supplierCodeDetail.saleCity, this.supplierCodeDetail.saleArea) + this.supplierCodeDetail.goodsReturnAddress;
      });
    },
    // 采购类型下拉列表
    getPurchaseTypeList() {
      this.$AXIOS.GET('/select/purchaseType').then(res => {
        this.purchaseTypeList = res.result;
      });
    },
    // 付款方式下拉列表
    getPayTypeList() {
      this.$AXIOS.GET('/select/payType').then(res => {
        this.payTypeList = res.result;
      });
    },
    // 归属采购组下拉列表
    getPurchaseGroupCodeList() {
      this.isOnlyOnePer = [];
      this.$AXIOS.GET('/purchase/purchaseGroups').then(res => {
        this.purchaseGroupCodeList = res.result;
        this.purchaseGroupCodeList.forEach(item => {
          if (item.belondFlag === '1') {
            this.isOnlyOnePer.push(item);
          }
        });
        if ( this.isOnlyOnePer.length === 1 ) {
          this.searchParams.purchaseGroupCode = this.isOnlyOnePer[0].code;
          this.getPurchasePersonIdList(this.isOnlyOnePer[0].code);
        }
      });
    },
    // 币制下拉列表
    getCurrencyTypeList() {
      this.$AXIOS.GET('/select/currencyType').then(res => {
        this.currencyTypeList = res.result;
      });
    },
    // 运输费用承担方下拉列表
    getTransportFeeDestIdList() {
      this.$AXIOS.GET('/select/transportCostsTake').then(res => {
        this.transportFeeDestIdList = res.result;
      });
    },
    // 处理优先级下拉列表
    getHandlerPriorityList() {
      this.$AXIOS.GET('/select/handlerPriority').then(res => {
        this.handlerPriorityList = res.result;
      });
    },
    // 收货仓库下拉列表
    getwarehouseCodeList() {
      this.$AXIOS.GET('/purchase/warehouse').then(res => {
        this.warehouseCodeList = res.result;
      });
    },
    // 归属采购人下拉列表
    getPurchasePersonIdList(purchaseGroupCode) {
      let isAddOrEdit = this.$route.params.id;
      let loginUserId = this.userId;
      let isUserId = 0;
      this.$AXIOS
        .GET('/purchase/purchasePerson', { purchaseGroupCode })
        .then(res => {
          this.purchasePersonIdList = res.result;
          if (isAddOrEdit === 'add') {
            this.purchasePersonIdList.forEach(item => {
              if (item.userLoginId === loginUserId) {
                isUserId = 1;
                this.searchParams.purchasePersonId = item.userId;
              }
            });
            if (isUserId === 0) {
              this.searchParams.purchasePersonId = '';
            }
          }
        });
    },
    // 品牌下拉列表
    getbrandNameList(supplierCode) {
      this.$AXIOS.GET('/purchase/supplierBrand/' + supplierCode).then(res => {
        this.brandNameList = res.result;
      });
    },
    // 弹窗商品数据列表
    getDailogTableDataList(params) {
      this.$AXIOS.POST('/purchase/purchaseOrderItem', params).then(res => {
        this.dailogTableDataList = res.result.result;
        this.logCount = res.result.totalCount;
      });
    },
    // 保存数据接口
    savePurchaseOrder(params) {
      this.$AXIOS.POST('/purchase/purchaseOrder/', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({ path: '/purchaseordermanage' });
        }, 20);
      });
    },
    // 保存数据接口(有id)
    savePutPurchaseOrder(params) {
      this.$AXIOS.PUT('/purchase/purchaseOrder/' + params.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.$router.push({ path: '/purchaseordermanage' });
        }, 20);
      });
    },
    // 选择归属采购组
    purchaseGroupCodeChange(val) {
      if (val) {
        this.searchParams.purchasePersonId = '';
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
      if (!this.searchParams.supplierCode) {
        this.$utils.messagetip.warningTip('请先选择供应商！');
        return;
      }
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择收货仓库！');
        return;
      }
      if (!this.searchParams.currencyType) {
        this.$utils.messagetip.warningTip('请先选择币制！');
        return;
      }
      this.dailogTableDataList = [];
      this.logCount = 0;
      this.form.supplierCode = this.searchParams.supplierCode;
      this.form.warehouseCode = this.searchParams.warehouseCode;
      if (this.form.warehouseCode) {
        this.warehouseCodeList.forEach(item => {
          if (item.code === this.form.warehouseCode) {
            this.form.warehouseInfoId = item.id;
          }
        });
      }
      // this.form.skus = this.searchParams.currencyType;
      // this.getDailogTableDataList(this.form);
      this.resetForm();
      this.getbrandNameList(this.searchParams.supplierCode);
      this.dialogFormVisible = true;
      this.isClick = false;
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
        isValid: 1,
        supplierCode: '', // 供应商名称
        warehouseCode: '', // 仓库id
        warehouseInfoId: '', // 仓库id
        skuName: '', // 商品名称
        itemNo: '', // 商品货号
        brandId: '', // 品牌
        skuCode: '', // 商品SKU编号
        barCode: '', // 条形码
        start: 0, // 开始页码
        pageSize: 10, // 页数
        pageNo: 1 // 页码
      };
      this.form.supplierCode = this.searchParams.supplierCode;
      this.form.warehouseCode = this.searchParams.warehouseCode;
      if (this.form.warehouseCode) {
        this.warehouseCodeList.forEach(item => {
          if (item.code === this.form.warehouseCode) {
            this.form.warehouseInfoId = item.id;
          }
        });
      }
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
      if (!this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('请选择商品！');
        return;
      }
      let params = {};
      let arr = [];
      let priceArr = [];
      this.multipleSelection.forEach(item => {
        arr.push(item.skuCode);
      });
      params.skuCode = arr.join();
      // 增加价格查询商品中心接口
      this.$AXIOS.POST('/purchase/purchasePrice', params, true).then(res => {
        let result = res.result;
        if (result && result.length) {
          result.forEach(item => {
            priceArr.push(item.sku);
            this.multipleSelection.forEach(subItem => {
              if (item.sku === subItem.skuCode) {
                subItem.purchasePriceD = item.purchasePrice;
                subItem.taxRate = item.taxRate;
              }
            });
          });
        }
      }).finally(() => {
        // 校验添加的sku在商品中心是否有价格，没价格弹出提示信息
        let list = [];
        if (priceArr && priceArr.length) {
          arr.forEach(subItem => {
            if (priceArr.indexOf(subItem) < 0) {
              list.push(subItem);
            }
          });
          this.errorList = list;
          console.log('1');
        } else {
          this.errorList = arr;
          console.log('2');
        }
        console.log(this.errorList);
        if (this.errorList && this.errorList.length) {
          this.tipModal();
        }
      });

      this.isClick = true;
      // console.log(this.multipleSelection);
      this.tableDataList = [...this.tableDataList, ...this.multipleSelection];
      this.addOrEditParams.totalCount = this.tableDataList.length;
      this.changeNumber(1);
      // this.tableDataList = this.multipleSelection;
      this.tableDataList.forEach(item => {
        item.purchasePriceD = item.purchasePriceD || ''; // 含税单价
        item.taxRate = item.taxRate; // 采购税率
        // item.taxRate = item.taxRate || '16'; // 采购税率
        item.purchasingQuantity = item.purchasingQuantity || ''; // 采购数量
        item.totalPurchaseAmountD = item.totalPurchaseAmountD || ''; // 采购总金额
        item.batchCode = item.batchCode || ''; // 批次号
        item.produceCode = item.produceCode || ''; // 生产编号
        item.productDate = item.productDate || ''; // 生产日期
        item.expireDate = item.expireDate || ''; // 截止保质期日期
        if (item.purchasePriceD === 0 || item.purchasePriceD === '0') {
          item.purchasePriceD = item.purchasePriceD;
        }
        if (item.taxRate === 0 || item.taxRate === '0') {
          item.taxRate = item.taxRate;
        }
        if (item.purchasingQuantity === 0 || item.purchasingQuantity === '0') {
          item.purchasingQuantity = item.purchasingQuantity;
        }
        if (item.totalPurchaseAmountD === 0 || item.totalPurchaseAmountD === '0') {
          item.totalPurchaseAmountD = item.totalPurchaseAmountD;
        }
        // item.shelfLifeDays = item.shelfLifeDays || ''; // 理论报纸期限
        // if (item.isQuality === '1') {
        //   item.shelfLifeDays = item.qualityDay || '';
        // }
      });
      // let list = [];
      // let arr = [];
      // this.tableDataList.forEach(item => {
      //   if (list.indexOf(item.skuCode) < 0) {
      //     list.push(item.skuCode);
      //   }
      // });
      // list.forEach((item, i) => {
      //   this.tableDataList.forEach(subItem => {
      //     if (item === subItem.skuCode) {
      //       arr[i] = subItem;
      //     }
      //   });
      // });
      // this.tableDataList = arr;
      this.dialogFormVisible = false;
    },
    // 保存按钮
    saveBtn() {
      this.searchParams.senderProvince = this.selected[0]; // 发件方省份.城市
      this.searchParams.senderCity = this.selected[1]; // 发件方省份.城市
      this.searchParams.totalFeeD = this.totalFeeD; // 总金额
      this.searchParams.purchaseCount = this.purchaseCount; // 总数量
      let isSkuCode = '';
      let numReg = /^[0-9.]+$/;
      let numReg1 = /^[0-9]+$/;
      let isPurchasePriceDFloat3 = false; // 单价保留三位小数 (校验)

      let isPurchasePriceDNum = false;
      let isTaxRateNum = false;
      let isPurchasingQuantityNum = false;

      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          if (item.purchasePriceD && item.purchasePriceD.toString().indexOf('.') > -1 && item.purchasePriceD.toString().split('.')[1].length > 7 && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasePriceDFloat3 = true;
          }
          if (item.purchasePriceD || item.purchasePriceD === 0 || item.purchasePriceD === '0') {
            if (!numReg.test(item.purchasePriceD) && !isSkuCode) {
              isSkuCode = item.skuCode;
              isPurchasePriceDNum = true;
            }
          }
          if (item.taxRate || item.taxRate === 0 || item.taxRate === '0') {
            if (!numReg.test(item.taxRate) && !isSkuCode) {
              isSkuCode = item.skuCode;
              isTaxRateNum = true;
            }
          }

          if (item.purchasingQuantity || item.purchasingQuantity === 0 || item.purchasingQuantity === '0') {
            if (!numReg1.test(item.purchasingQuantity) && !isSkuCode) {
              isSkuCode = item.skuCode;
              isPurchasingQuantityNum = true;
            }
          }
          if ((item.purchasingQuantity === '0' || item.purchasingQuantity === 0) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasingQuantityNum = true;
          }
          if (item.purchasePriceD >= 0 && item.purchasingQuantity >= 0) {
            let result = item.purchasePriceD * 10000000 * item.purchasingQuantity;
            result = (result / 10000000).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            item.totalPurchaseAmountD = result;
          }
        });
      }
      if (isPurchasePriceDFloat3) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的含税单价最多七位小数！`);
        return;
      }
      if (isPurchasePriceDNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的含税单价格式只能为数字！`);
        return;
      }
      if (isTaxRateNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购税率格式只能为数字！`);
        return;
      }
      if (isPurchasingQuantityNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购数量格式只能为正整数！`);
        return;
      }
      if (this.searchFormData.totalFeeD && this.searchFormData.totalFeeD.toString().indexOf('.') > -1 && this.searchFormData.totalFeeD.toString().split('.')[0].length > 10) {
        this.$utils.messagetip.warningTip('采购总金额不能超过10位');
        return;
      }
      if (this.searchFormData.totalFeeD && this.searchFormData.totalFeeD.toString().indexOf('.') < 0 && this.searchFormData.totalFeeD.toString().length > 10) {
        this.$utils.messagetip.warningTip('采购总金额不能超过10位');
        return;
      }
      console.log('fileDataList: ', this.fileDataList);
      let fileList = [];
      this.fileDataList.forEach(item => {
        let obj = {};
        if (item.id) {
          obj.id = item.id;
        }
        obj.uploadFileName = item.key || item.uploadFileName;
        obj.fileName = item.fileName;
        fileList.push(obj);
      });
      this.searchParams.gridValue = JSON.stringify(this.tableDataList);
      this.searchParams.qiNiuValue = JSON.stringify(fileList);
      console.log(this.searchParams);
      console.log('********* ');
      if (this.searchParams.id) {
        this.savePutPurchaseOrder(this.searchParams);
      } else {
        this.savePurchaseOrder(this.searchParams);
      }
    },
    // 提交审核按钮
    submitAuditBtn() {
      this.searchParams.senderProvince = this.selected[0]; // 发件方省份.城市
      this.searchParams.senderCity = this.selected[1]; // 发件方省份.城市
      this.searchParams.totalFeeD = this.totalFeeD; // 总金额
      this.searchParams.purchaseCount = this.purchaseCount; // 总数量
      let isSkuCode = '';
      let isEmpty = false;
      let isPurchasePriceD = false;
      let isPurchasePriceDNum = false;
      let isPurchasePriceDFloat3 = false; // 单价保留三位小数
      let isTaxRate = false;
      let isTaxRateNum = false;
      let isPurchasingQuantity = false;
      let isPurchasingQuantityNum = false;
      let isBatchCode = false;
      let isQuality = false;
      let isProductDate = false;
      let isExpireDate = false;
      let isShelfLifeDays = false;
      let isShelfLifeDaysType = false;
      let numReg = /^[0-9.]+$/;
      let numReg1 = /^[0-9]+$/;
      let typeReg = /^1[0-9][0-9]\d{4,8}$/;

      if (this.tableDataList && this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          if (item.purchasePriceD >= 0 && item.purchasingQuantity >= 0) {
            let result = item.purchasePriceD * 10000000 * item.purchasingQuantity;
            result = (result / 10000000).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            item.totalPurchaseAmountD = result;
          }
          if ((item.purchasePriceD === '' || item.purchasePriceD === null) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasePriceD = true;
          }
          if (!numReg.test(item.purchasePriceD) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasePriceDNum = true;
          }
          if (item.purchasePriceD && item.purchasePriceD.toString().indexOf('.') > -1 && item.purchasePriceD.toString().split('.')[1].length > 7 && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasePriceDFloat3 = true;
          }
          if ((item.taxRate === '' || item.taxRate === null) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isTaxRate = true;
          }
          if (!numReg.test(item.taxRate) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isTaxRateNum = true;
          }
          if (!item.purchasingQuantity && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasingQuantity = true;
          }
          if (!numReg1.test(item.purchasingQuantity) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasingQuantityNum = true;
          }
          if ((item.purchasingQuantity === '0' || item.purchasingQuantity === 0) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isPurchasingQuantityNum = true;
          }
          if (!item.batchCode && !isSkuCode) {
            isSkuCode = item.skuCode;
            isBatchCode = true;
          }
        });
      } else {
        isEmpty = true;
      }
      // 格式校验
      if (!this.searchParams.supplierCode) {
        this.$utils.messagetip.warningTip('请先选择供应商名称');
        return;
      }
      if (!this.searchParams.purchaseGroupCode) {
        this.$utils.messagetip.warningTip('请先选择归属采购组');
        return;
      }
      if (!this.searchParams.purchasePersonId) {
        this.$utils.messagetip.warningTip('请先选择归属采购人');
        return;
      }
      if (!this.searchParams.purchaseType) {
        this.$utils.messagetip.warningTip('请先选择采购类型');
        return;
      }
      if (!this.searchParams.currencyType) {
        this.$utils.messagetip.warningTip('请先选择币制');
        return;
      }
      if (!this.searchParams.payType) {
        this.$utils.messagetip.warningTip('请先输入付款方式');
        return;
      }
      if (!this.searchParams.warehouseCode) {
        this.$utils.messagetip.warningTip('请先选择收货仓库');
        return;
      }
      if (!this.searchParams.receiveAddress) {
        this.$utils.messagetip.warningTip('请先输入收货地址');
        return;
      }
      if (!this.searchParams.receiver) {
        this.$utils.messagetip.warningTip('收货人不能为空');
        return;
      }
      if (!this.searchParams.receiverNumber) {
        this.$utils.messagetip.warningTip('收货人手机不能为空');
        return;
      }
      if (this.searchParams.receiverNumber.length !== 11 || !numReg.test(this.searchParams.receiverNumber) || !typeReg.test(this.searchParams.receiverNumber)) {
        this.$utils.messagetip.warningTip('收货人手机号格式不正确！');
        return;
      }
      if (!this.searchParams.sender) {
        this.$utils.messagetip.warningTip('发件人不能为空');
        return;
      }
      if (!this.searchParams.senderNumber) {
        this.$utils.messagetip.warningTip('发件方手机不能为空');
        return;
      }
      if (this.searchParams.senderNumber.length !== 11 || !numReg.test(this.searchParams.senderNumber) || !typeReg.test(this.searchParams.senderNumber)) {
        this.$utils.messagetip.warningTip('发件方手机号格式不正确！');
        return;
      }
      if (!this.searchParams.senderProvince) {
        this.$utils.messagetip.warningTip('请先选择发件方省份');
        return;
      }
      if (!this.searchParams.senderAddress) {
        this.$utils.messagetip.warningTip('发件方详细地址不能为空');
        return;
      }
      if (!this.searchParams.transportFeeDestId) {
        this.$utils.messagetip.warningTip('请先选择运输费用承担方');
        return;
      }
      if (!this.searchParams.requriedReceiveDate) {
        this.$utils.messagetip.warningTip('请先选择要求到货日期');
        return;
      }
      if (!this.searchParams.endReceiveDate) {
        this.$utils.messagetip.warningTip('请先选择截止到货日期');
        return;
      }
      if (new Date(this.searchParams.requriedReceiveDate).getTime() > new Date(this.searchParams.endReceiveDate).getTime()) {
        this.$utils.messagetip.warningTip('要求到货日期不得大于截止到货日期');
        return;
      }
      if (!this.searchParams.handlerPriority) {
        this.$utils.messagetip.warningTip('请先选择处理优先级');
        return;
      }
      let fileList = [];
      let isFile = false;
      this.fileDataList.forEach(item => {
        let obj = {};
        if (item.id) {
          obj.id = item.id;
        }
        if (!item.fileName) {
          isFile = true;
        }
        obj.uploadFileName = item.key || item.uploadFileName;
        obj.fileName = item.fileName;
        fileList.push(obj);
      });
      if (isFile) {
        this.$utils.messagetip.warningTip('附件信息不能为空');
        return;
      }
      if (isEmpty) {
        this.$utils.messagetip.warningTip('请至少选择一项商品');
        return;
      }
      if (this.searchFormData.totalFeeD && this.searchFormData.totalFeeD.toString().indexOf('.') > -1 && this.searchFormData.totalFeeD.toString().split('.')[0].length > 10) {
        this.$utils.messagetip.warningTip('采购总金额不能超过10位');
        return;
      }
      if (this.searchFormData.totalFeeD && this.searchFormData.totalFeeD.toString().indexOf('.') < 0 && this.searchFormData.totalFeeD.toString().length > 10) {
        this.$utils.messagetip.warningTip('采购总金额不能超过10位');
        return;
      }
      // if (isPurchasePriceD) {
      //   this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的含税单价不能为空！`);
      //   return;
      // }
      if (isPurchasePriceDNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的含税单价格式只能为数字！`);
        return;
      }
      if (isPurchasePriceDFloat3) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的含税单价最多七位小数！`);
        return;
      }
      if (isTaxRate) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购税率不能为空！`);
        return;
      }
      if (isTaxRateNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购税率格式只能为数字！`);
        return;
      }
      if (isPurchasingQuantity) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购数量不能为空！`);
        return;
      }
      if (isPurchasingQuantityNum) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的采购数量格式只能为正整数！`);
        return;
      }
      if (isBatchCode) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的批次号不能为空！`);
        return;
      }
      this.searchParams.qiNiuValue = JSON.stringify(fileList);
      this.searchParams.gridValue = JSON.stringify(this.tableDataList);
      if (this.searchParams.warehouseCode) {
        this.warehouseCodeList.forEach(item => {
          if (item.code === this.searchParams.warehouseCode) {
            this.searchParams.warehouseInfoId = item.id;
          }
        });
      }
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      if (this.searchParams.id) {
        this.submitAudit(this.searchParams);
      } else {
        this.submitAuditNoId(this.searchParams);
      }
    },
    deleteBtn(i) {
      this.tableDataList.splice(i, 1);
      this.addOrEditParams.totalCount = this.tableDataList.length;
      let pageNumber = Math.ceil(this.addOrEditParams.totalCount / this.addOrEditParams.pageSize);
      if (this.addOrEditParams.totalCount % this.addOrEditParams.pageSize === 0 && (this.addOrEditParams.pageNo !== pageNumber)) {
        console.log('0000000');
        this.changeNumber(this.addOrEditParams.pageNo - 1);
      }
      this.getTotalFeeD();
    },
    deleteUpload(id, index) {
      if (id) {
        this.$AXIOS.DELETE('/qinniuPrivate/uploadFile/', id).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          if (this.searchParams.purchaseOrderCode) {
            this.getUploadDataList(this.searchParams.purchaseOrderCode);
          }
        });
      } else {
        this.fileDataList.splice(index, 1);
        this.addTableRow();
      }
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/purchaseordermanage' });
    }

  }
};
</script>
<style lang="stylus" scoped>
.purchaseorderaddoredit
  position: relative
  .print_order
    .el-col-6
      height: auto !important
    .item
      line-height: 30px
      font-size: 12px
      text-align: center
    .table_title
      width: 15%
      background: rgb(228, 228, 228)
    .table_content
      width: 35%
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
    .line
      width: 780px
      height: 1px
      background: #000
      margin-top: 25px
    .tip
      width: 110px
      line-height: 30px
      text-align: center
      display: inline-block
      font-weight: 900
      position: relative
      top: -18px
      left: 30px
      background: rgb(255, 255, 255)
      color:#333
    .other_info
      .other_info_span
        line-height: 30px;
        word-break: break-all;
        width: 780px;
      span{
        font-weight: 700
      }
      span.box_info{
        display: inline-block;
        border:1px solid #060606;
        padding: 20px;
        vertical-align: top;
        background: #d9d9d9;
        color: #3f3ff7;
      }
      span.box_info.box_info_left{
        width: 300px;
      }
      span.box_info.box_info_right{
        width: 200px;
      }
  .preview-info
    position: fixed
    width:80px;
    height:80px;
    line-height:80px;
    border-radius: 50%;
    background-color:rgba(255,255,0,.8);
    top:65px;
    right:50px;
    font-size:20px;
    text-align:center;
    font-weight:700;
    cursor:pointer;
  .btn_group
    margin-top: 15px
    text-align: center
    margin-bottom: 15px
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: #ffbc00
    color: red
    text-align: center
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
.purchaseorderaddoredit
  .el-table .warning-row
    background: oldlace;
  .ql-toolbar.ql-snow
    text-align: left;
  .price_list
    tr
      th:nth-child(7),th:nth-child(9), th:nth-child(10), th:nth-child(11), th:nth-child(13)
        div::before
          content: '*'
          padding-right: 5px
          color: #ff0000
  .el-table
    max-width none
  .el-textarea__inner
    height: 360px;
  .paper-box-mark
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    text-align: center;
    span
      height: 45px;
      line-height: 45px;
    li
      border-top: 1px solid #dcdfe6;
      height: 45px;
      .el-form-item
        .el-form-item__label
          height: 45px;
          line-height: 45px;
          text-align: center;
          border-right: 1px solid #dcdfe6;
        .el-form-item__content
          line-height: 45px;
          .el-input
            width: 90%;
          .el-select
            width: 100%;
            .el-input
              margin: 0 auto;
</style>
<style>
  .ql-editor{
    min-height: 200px;
  }
  .ql-snow .ql-picker.ql-header,.ql-snow .ql-picker.ql-font {
    width:auto;
    line-height: 24px;
  }
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    right:-15px;
    margin-top: -8px;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimSun]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimSun]::before {
    content: "宋体";
    font-family: "SimSun";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before {
    content: "黑体";
    font-family: "SimHei";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before {
    content: "微软雅黑";
    font-family: "Microsoft YaHei";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=KaiTi]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=KaiTi]::before {
    content: "楷体";
    font-family: "KaiTi";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=FangSong]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=FangSong]::before {
    content: "仿宋";
    font-family: "FangSong";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before {
    content: "Arial";
    font-family: "Arial";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Times-New-Roman]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Times-New-Roman]::before {
    content: "Times New Roman";
    font-family: "Times New Roman";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before {
    content: "sans-serif";
    font-family: "sans-serif";
  }
  .ql-snow .ql-picker.ql-expanded .ql-picker-label{
    outline: none;
  }
  .ql-snow .ql-picker.ql-expanded .ql-picker-options{
    max-height:200px;
    overflow-y: scroll;
  }
  .ql-font-SimSun {
    font-family: "SimSun";
  }
  .ql-font-SimHei {
    font-family: "SimHei";
  }
  .ql-font-Microsoft-YaHei {
    font-family: "Microsoft YaHei";
  }
  .ql-font-KaiTi {
    font-family: "KaiTi";
  }
  .ql-font-FangSong {
    font-family: "FangSong";
  }
  .ql-font-Arial {
    font-family: "Arial";
  }
  .ql-font-Times-New-Roman {
    font-family: "Times New Roman";
  }
  .ql-font-sans-serif {
    font-family: "sans-serif";
  }
</style>
