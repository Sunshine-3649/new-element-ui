<template>
  <div class="purchreturnorderaddoredit">
      <div v-if="!purchId">
        <div class="title">基本信息</div>
        <el-form label-width="125px" size="medium">
            <el-row v-if="id !== 'add'" :span="20">
                <el-form-item label="采购退货单编号："  size="mini">
                        {{ searchParams.purchaseOutboundOrderCode }}
                </el-form-item>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <span class="requiredItem">*</span>
                    <el-form-item label="供应商名称："  size="mini">
                        <el-select  v-model="searchParams.supplierCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in supplierOptions"
                                @click.native="supplierChange(item)"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a1">*</span>
                    <el-form-item label="退货仓库："  size="mini">
                        <el-select v-model="searchParams.warehouseInfoId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in warehouseOptions"
                                @click.native="warehouseChange(item)"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a2">*</span>
                    <el-form-item label-width="140px" label="退货类型："  size="mini">
                        <el-select v-model="searchParams.returnOrderType" filterable placeholder="请选择">
                            <el-option
                                v-for="item in returnOrderTypeOptions"
                                @click.native="returnOrder(item)"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a3">*</span>
                    <el-form-item label="提货方式："  size="mini">
                        <el-select  v-model="searchParams.pickType" filterable placeholder="请选择">
                            <el-option
                                v-for="item in pickTypeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <span class="requiredItem a4">*</span>
                    <el-form-item label="退货收货人："  size="mini">
                        <el-input :disabled="!searchParams.supplierCode" maxlength="20" v-model="searchParams.receiver" :placeholder="searchParams.supplierCode ? '退货收货人' : '请选择供应商'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a5">*</span>
                    <el-form-item label="收货人手机号码："  size="mini">
                        <el-input :disabled="!searchParams.supplierCode" :separator="'-'" v-model="searchParams.receiverNumber" :placeholder="searchParams.supplierCode ? '收货人手机号码' : '请选择供应商'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a5"> &nbsp; </span>
                    <el-form-item label-width="140px" label="退货省份.城市.地区："  size="mini">
                        <!-- <el-input  placeholder="退货省份.城市.地区"></el-input> -->
                        <el-cascader :disabled="!searchParams.supplierCode"  v-model="citySelect" :placeholder="searchParams.supplierCode ? '试试搜索：北京' : '请选择供应商'" :options="cityListData" filterable separator="-"></el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <span class="requiredItem a5"> &nbsp; </span>
                    <el-form-item label="退货详细地址："  size="mini">
                        <el-input :disabled="!searchParams.supplierCode" maxlength="150" v-model="searchParams.receiverAddress" :placeholder="searchParams.supplierCode ? '退货详细地址' : '请选择供应商'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
              <el-col :span="6">
                <span class="requiredItem a3">*</span>
                <el-form-item label="单据类型："  size="mini">
                 <el-select  v-model="searchParams.billType" filterable placeholder="请选择">
                      <el-option
                          v-for="item in billTypeList"
                          @click.native="billTypeChange(item)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="20">
                <el-col>
                    <span class="requiredItem a6">*</span>
                    <el-form-item label="退货说明："  size="mini">
                        <el-input maxlength="1500" v-model="searchParams.returnPolicy" type="textarea" placeholder="退货说明(不超过1500个字符)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col>
                    <el-form-item label="备注："  size="mini">
                        <el-input maxlength="1500" v-model="searchParams.remark" type="textarea" placeholder="备注(不超过1500个字符)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 退货商品明细 -->
        <div class="title">退货商品明细</div>
        <div class="selectShop">
            <el-row style="margin: 10px 0;">
                <el-button @click="qiutShopDialog"  size="mini"><i class="el-icon-circle-plus-outline" style="padding-right:2px;"></i>选择退货商品</el-button>
            </el-row>
            <el-table id="shopTable" class="group_table" :data="selectedQuitTable" border style="width: 99.5%">
                <el-table-column type="index" align="center" prop="" label="序号" >  </el-table-column>
                <el-table-column align="center" prop="skuName" label="商品SKU名称" >  </el-table-column>
                <el-table-column align="center" prop="skuCode"  label="商品SKU编号"  > </el-table-column>
                <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
                <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
                <el-table-column align="center" prop="address" label="库存类型">
                    <template slot-scope="scope">
                        {{ scope.row.returnOrderType === '1' ? '正品' : '残品' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="canBackQuantity" label="当前可退数量"> </el-table-column>
                <el-table-column align="center" prop="outboundQuantity" label="退货数量">
                    <template slot-scope="scope">
                        <el-input type="number" size="mini" maxlength="10"  @change="getPurchasePriceDChange(scope.$index)"  v-model.number="scope.row.outboundQuantity"> </el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="含税退货单价(元)">
                    <template slot-scope="scope">
                        <el-input type="number"  maxlength="15"  @change="getPurchasePriceDChange2(scope.$index)" size="mini" v-model="scope.row.price" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="退货税率">
                    <template slot-scope="scope">
                        <el-input style="width:80%;" width="80%" size="mini" v-model="scope.row.taxRate" type="text"></el-input>%
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="totalAmount" label="退货总金额(元)">
                    <template slot-scope="scope">
                        <el-input type="number"  maxlength="15" @change="getTotalPurchaseAmountDChange(scope.$index)" size="mini" v-model="scope.row.totalAmount" ></el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="历史采购情况">
                    <template slot-scope="scope">
                        <el-button @click="openDetailDialog(scope.row)" type="text"> 查看详情 </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteSelectedQuitTable(scope.$index)" type="text"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 选择退货商品弹窗 -->
        <el-dialog class="dialog" title="选择退货商品" :visible.sync="dialogShopVisible" width="80%">
            <el-form label-width="100px">
                <el-row :span="20">
                    <el-col :span="6">
                        <el-form-item label="退货供应商："  size="mini">
                            <el-input v-model="qiutShopParams.supplierName" type="text" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退货仓库："  size="mini">
                            <el-input v-model="qiutShopParams.warehouseName" type="text" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退货类型："  size="mini">
                            <el-input v-model="qiutShopParams.returnOrderTypeName" type="text" :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="20">
                    <el-col :span="6">
                        <el-form-item label="SKU名称："  size="mini">
                            <el-input v-model="qiutShopParams.skuName" type="text" placeholder="SKU名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌名称："  size="mini">
                            <el-select  v-model="qiutShopParams.brandId" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in brandNameOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="商品SKU编号："  size="mini">
                            <el-input v-model="qiutShopParams.skuCode" type="textarea" placeholder="输入多个请用英文,隔开"></el-input>
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="条形码："  size="mini">
                            <el-input v-model="qiutShopParams.barCode" type="textarea" placeholder="输入多个请用英文,隔开"></el-input>
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col :span="6"></el-col>
                    <el-col style="text-align:right" :span="6">
                        <el-button size="mini" @click="qiutShopSearch" type="primary">查询</el-button>
                        <el-button @click="qiutResetForm" size="mini">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <div v-if="qiutShopParams.billType === 2" style="background-color:#ffffb3;color:#FF3300; padding:0 10px; height:40px; line-height:40px;" class="warnMain">
                <i style="color:#48c5ff;" class="el-icon-info"></i>
                同时满足下列条件的商品才显示：1.商品在已选择的退货仓库中的"通知仓库状态"为"通知成功"2.已添加过的商品不能重复添加
            </div>
            <div v-else style="background-color:#ffffb3;color:#FF3300; padding:0 10px; height:40px; line-height:40px;" class="warnMain">
                <i style="color:#48c5ff;" class="el-icon-info"></i>
                同时满足下列条件的商品才显示：1.曾经采购入库过已选择的退货供应商的商品2.商品在已选择的退货仓库中的"通知仓库状态"为"通知成功"3.已添加过的商品不能重复添加
            </div>
            <el-table class="dialogTable" @selection-change="handleSelectionChange" height="300" :data="qiutShopTableData" border style="width: 100%" v-loading="isLoading">
                    <el-table-column type="selection" align="center" :selectable="checkSelectable" width="50">  </el-table-column>
                    <el-table-column align="center" prop="skuName" label="商品SKU名称" >  </el-table-column>
                    <el-table-column align="center" prop="skuCode"  label="商品SKU编号"  > </el-table-column>
                    <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
                    <el-table-column align="center" prop="itemNo" label="货号"> </el-table-column>
                    <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
                    <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
                    <el-table-column align="center" prop="address" label="库存类型">
                        <template slot-scope="scope" >
                            {{ scope.row.returnOrderType == 1 ? '正品' : '残品' }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="canBackQuantity" label="可退库存"> </el-table-column>
            </el-table>
            <div class="page" style="text-align:right; padding: 10px 0;">
                <el-pagination @size-change="qiutShopChangeSize" @current-change="qiutShopChangePageNo" :current-page="qiutShopParams.pageNo" :page-sizes="[5, 20, 50, 100, 500, 1000, 2000]" :page-size="qiutShopParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="qiutShopParams.totalCount">
                </el-pagination>
            </div>
            <div class="dialogFooter" style="text-align:center">
                <el-button @click="selectQuitShop" size="mini" type="primary">确定</el-button>
                <el-button @click="qiutSelect" size="mini">取消</el-button>
            </div>
        </el-dialog>

        <!-- 历史采购情况详情 -->
        <el-dialog class="dialog" :title="'商品【'+quitShopHistoryData.skuName+'】的历史采购情况'" :visible.sync="dialogShopDetailVisible" width="70%">
            <el-form>
                    <el-row :span="20">
                        <el-col :span="6">
                            <el-form-item label="供应商：" prop="" size="mini">
                                {{ qiutShopParams.supplierName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="仓库：" prop="" size="mini">
                                {{ qiutShopParams.warehouseName }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="6">
                        <el-form-item label="实际入库时间："  size="mini">
                            <el-col :span="4">
                                <el-form-item prop="" size="mini">
                                    <el-date-picker :default-value="quitShopHistoryData.startDate" v-model="quitShopHistoryData.startDate"  :clearable='false' type="date" placeholder="开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col style="text-align: center" :span="1">-</el-col>
                            <el-col :span="4">
                                <el-form-item prop="" size="mini">
                                    <el-date-picker v-model="quitShopHistoryData.endDate"   type="date" :clearable='false' placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="searchHistorData" size="mini" type="primary"> GO </el-button>
                            </el-col>
                        </el-form-item>
                    </el-row>
            </el-form>
            <el-table class="dialogTable"  height="300" :data="quitShopHistoryData.list" border style="width: 100%; max-height:500px;">
                    <el-table-column type="index" label="序号" align="center"   width="50">  </el-table-column>
                    <el-table-column align="center" prop="purchaseOrderCode" label="采购单号" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="toPurchaseDetail(scope.row)">{{ scope.row.purchaseOrderCode }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="warehouseNoticeCode"  label="采购入库单号"  width="180"> </el-table-column>
                    <el-table-column align="center" prop="purchasePrice" label="采购含税单价（元）"> </el-table-column>
                    <el-table-column align="center" prop="taxRate" label="采购税率">
                        <template slot-scope="scope">
                            {{ scope.row.taxRate }}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="purchasingQuantity" label="实际入库数量 / 采购数量">
                        <template slot-scope="scope">
                            <!-- {{ qiutShopParams.returnOrderType === '1' ? '正品'+ scope.row.normalStorageQuantity + '/' + scope.row.purchasingQuantity : '残品' + scope.row.defectiveStorageQuantity + '/' + scope.row.purchasingQuantity }} -->
                            <div v-if="returnOrderType == 1">
                            正品&nbsp;<span style="font-weight: bold; font-size:16px;">{{ scope.row.normalStorageQuantity }}</span>&nbsp;/&nbsp;{{scope.row.purchasingQuantity }}
                            </div>
                            <div v-else>
                            残品&nbsp;<span style="font-weight: bold;font-size:16px;">{{ scope.row.defectiveStorageQuantity }}</span>&nbsp;/&nbsp;{{scope.row.purchasingQuantity }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="storageTime" label="实际入库时间"> </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination @size-change="historyChangeSize" @current-change="historyChangeNumber" :current-page="quitShopHistoryData.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="quitShopHistoryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="quitShopHistoryData.totalCount">
                </el-pagination>
            </div>
            <div class="close" style="padding: 20px 0; text-align:center;">
                    <el-button size="mini" @click="dialogShopDetailVisible = false" type="primary">关闭</el-button>
            </div>
        </el-dialog>

        <div class="bottonGroup">
            <el-button type="primary" @click="confirmReview" size="mini">提交审核</el-button>
            <el-button @click="keepQuitData"  size="mini">保存</el-button>
            <el-button @click="goBack" size="mini">返回</el-button>
        </div>
      </div>
      <purchaseauditdetail v-if="purchId"  :purchId='purchId' :status='purchStatus' @purseClose='close'></purchaseauditdetail>
  </div>
</template>
<script>
import purchaseauditdetail from '@/view/purchasemanage/purchasemanage/purchaseorderaudit/purchaseauditdetail/purchaseauditdetail';  // 前往采购详情
  export default {
    name: 'purchreturnorderaddoredit',
    data() {
        return {
          fixedNum: 0,
          isLoading: false, // 弹窗loading
          billTypeList: [
              {
                label: '实退',
                value: 1
              }
            ], // 单据类型列表
            purchId: '',  // 采购id
            purchStatus: '',
            searchParams: {
                billType: 1, // 单据类型
                purchaseOutboundOrderCode: '', // 采购退货单编号
                supplierCode: '', // 供应商名称
                warehouseInfoId: '', // 退货仓库
                returnOrderType: '', // 退货类型
                pickType: '', // 提货方式
                receiver: '', // 退货收货人
                receiverNumber: '', // 退货人手机号
                receiverProvince: '', // 省份
                receiverCity: '', // 城市
                receiverArea: '', // 地区
                receiverAddress: '', // 退货人详细地址
                returnPolicy: '', // 退货说明
                remark: '', // 备注
                pageSize: 10,
                pageNo: 1,
                totalCount: 0,
                start: 0
            },
            qiutShopParams: {  // 获取商品详情列表搜索参数
                billType: '', // 单据类型
                supplierCode: '', // 供应商code
                warehouseInfoId: '', // 退货仓库
                returnOrderType: '', // 退货类型
                returnOrderTypeName: '',
                supplierName: '', // 供应商名称
                warehouseName: '', // 退货商名称
                skuCode: '', // 商品sku编号
                skuName: '', // 商品sku名称
                brandId: '', // 品牌名称
                barCode: '', // 条形码
                skus: '',
                pageSize: 5,
                pageNo: 1,
                totalCount: 0,
                start: 0
            },
            dialogShopVisible: false,  // 选择商品弹窗
            dialogShopDetailVisible: false, // 历史采购详情弹窗
            supplierOptions: [], // 供应商名称列表
            warehouseOptions: [], // 退货仓库列表
            brandNameOptions: [], // 品牌名称列表
            returnOrderTypeOptions: [{ // 退货类型
                value: '1',
                label: '正品'
            }, {
                value: '2',
                label: '残品'
            }],
            pickTypeOption: [{
                value: '1',
                label: '到仓自提'
            }, {
                value: '2',
                label: '京东配送'
            }, {
                value: '3',
                label: '其他物流配送'
            }],
            options: [],
            qiutShopTableData: [],  // 选择退货商品列表
            quitShopHistoryData: {
                startDate: '',
                endDate: '',
                skuCode: '',
                supplierCode: '',
                warehouseInfoId: '',
                returnOrderType: '',
                skuName: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0,
                list: []
            }, // 历史详情列表
            selectedQuitTable: [], // 已选择退货商品列表
            tableRowData: [], // 选择
            cityListData: [],  // 城市列表数据
            citySelect: [], // 所选城市列表
            id: this.$route.params.id,
            currentSupplierCode: '', // 供应商code
            returnOrderType: '' // 残次品
        };
    },
    created: function() {
        this.getPurchasePriceBit();
        this.initSupplierName();
        this.initWarehouse();
        this.cityList();
        if (this.id !== 'add') {
            setTimeout(() => {
                this.initQuitShopDetail(this.id);
            }, 500);
        }
    },
    components: {
        purchaseauditdetail
    },
    filters: {
        toFixed(input, num) {
           return Number(input).toFixed(num);
        }
    },
    methods: {
        getPurchasePriceBit() {
          this.$AXIOS.GET('/purchase/selectPurchasePriceBit/purchaseOutBoundPirceBit').then(res => {
            this.fixedNum = res.result;
          });
        },
        getPurchasePriceDChange(i) {
          // let countReg = /^[0-9]+$/;
          // let regPrice = new RegExp(/^\d+(\.(?!.*0$)\d{1,7})?$/); // 退货单价正则
          // if (!regPrice.test(this.selectedQuitTable[i].price)) {
          //    this.$utils.messagetip.warningTip('退货单价只能为数字或者小数点位数最多为7位！');
          //    return;
          // }
          // if (!countReg.test(this.selectedQuitTable[i].count)) {
          //    this.$utils.messagetip.warningTip('退货数量只能为正整数和0！');
          //    return;
          // }
          let numReg2 = /^[0-9]+$/;
          if (this.selectedQuitTable[i].outboundQuantity && !numReg2.test(this.selectedQuitTable[i].outboundQuantity)) {
            this.$utils.messagetip.warningTip('退货数量只能为整数！');
             return;
          }
          // if (!this.selectedQuitTable[i].outboundQuantity && this.selectedQuitTable[i].outboundQuantity !== '0' && this.selectedQuitTable[i].totalAmount) {
          //    this.$utils.messagetip.warningTip('请先填写退货数量！');
          //    return;
          // }
          let price = this.selectedQuitTable[i].price || 0;
          let count = this.selectedQuitTable[i].outboundQuantity || 0;
          let total = this.selectedQuitTable[i].totalAmount || 0;
          if (price && count) {
            let result = price * 10000000 * count;
            result = (result / 10000000).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            this.$set(this.selectedQuitTable[i], 'totalAmount', result);
          } else {
            if (count && total && !price) {
              let result = (total / count).toString();
              if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
                result = Number(result).toFixed(this.fixedNum);
              }
              this.$set(this.selectedQuitTable[i], 'price', result);
            } else {
              this.$set(this.selectedQuitTable[i], 'totalAmount', 0);
            }
          }
        },
        getPurchasePriceDChange2(i) {
          // let countReg = /^[0-9]+$/;
          // let regPrice = new RegExp(/^\d+(\.(?!.*0$)\d{1,7})?$/); // 退货单价正则
          // if (!regPrice.test(this.selectedQuitTable[i].price)) {
          //    this.$utils.messagetip.warningTip('退货单价只能为数字或者小数点位数最多为7位！');
          //    return;
          // }
          // if (!countReg.test(this.selectedQuitTable[i].count)) {
          //    this.$utils.messagetip.warningTip('退货数量只能为正整数和0！');
          //    return;
          // }
          let numReg = /^[0-9.]+$/;
          if (this.selectedQuitTable[i].price && !numReg.test(this.selectedQuitTable[i].price)) {
            this.$utils.messagetip.warningTip('退货单价只能为数字！');
             return;
          }
          if (!this.selectedQuitTable[i].outboundQuantity && this.selectedQuitTable[i].outboundQuantity !== '0' && this.selectedQuitTable[i].totalAmount) {
             this.$utils.messagetip.warningTip('请先填写退货数量！');
             return;
          }
          let price = this.selectedQuitTable[i].price || 0;
          let count = this.selectedQuitTable[i].outboundQuantity || 0;
          let total = this.selectedQuitTable[i].totalAmount || 0;
          if (price && count) {
            let result = price * 10000000 * count;
            result = (result / 10000000).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            this.$set(this.selectedQuitTable[i], 'totalAmount', result);
          } else {
            if (count && total && !price) {
              let result = (total / count).toString();
              if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
                result = Number(result).toFixed(this.fixedNum);
              }
              this.$set(this.selectedQuitTable[i], 'price', result);
            } else {
              this.$set(this.selectedQuitTable[i], 'totalAmount', 0);
            }
          }
        },
        getTotalPurchaseAmountDChange(i) {
          let numReg = /^[0-9.]+$/;
          if (this.selectedQuitTable[i].totalAmount && !numReg.test(this.selectedQuitTable[i].totalAmount)) {
            this.$utils.messagetip.warningTip('退货总金额只能为数字！');
             return;
          }
          if (!this.selectedQuitTable[i].outboundQuantity && this.selectedQuitTable[i].outboundQuantity !== '0' && this.selectedQuitTable[i].price) {
             this.$utils.messagetip.warningTip('请先填写退货数量！');
             return;
          }
          let price = this.selectedQuitTable[i].price || 0;
          let count = this.selectedQuitTable[i].outboundQuantity || 0;
          let total = this.selectedQuitTable[i].totalAmount || 0;
          if (count && total) {
            let result = (total / count).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            this.$set(this.selectedQuitTable[i], 'price', result);
          } else if (price && count && !total) {
            let result = price * 10000000 * count;
            result = (result / 10000000).toString();
            if (result && result.indexOf('.') > -1 && (result.split('.')[1].length > this.fixedNum) && this.fixedNum > 0) {
              result = Number(result).toFixed(this.fixedNum);
            }
            this.$set(this.selectedQuitTable[i], 'totalAmount', result / 10000000);
          }
        },
        // 切换单据类型
        billTypeChange(row) {
          this.qiutShopParams.billType = row.label;
          this.qiutShopParams.skus = '';
          this.selectedQuitTable = [];
        },
        close() {
            this.purchId = '';
        },
        changeSize(val) {

        },
        changeNumber(val) {
        },
        // 跳转审核页面
        toPurchaseDetail(row) {
            this.purchId = row.purchaseOrderId;
            this.purchStatus = row.status;
            this.dialogShopDetailVisible = false;
        },
        // 退货表格是否可以选择
        checkSelectable(row) {
            // console.log(row.skuCode);
            console.log(this.qiutShopParams.skus.indexOf(row.skuCode));
            return row.canBackQuantity && (this.qiutShopParams.skus.indexOf(row.skuCode) === -1);
        },
        // 历史详情采购分页
        historyChangeSize(val) {
            this.quitShopHistoryData.pageSize = val;
            this.historyData(this.quitShopHistoryData);
        },
        // 历史详情采购分页
        historyChangeNumber(val) {
            this.quitShopHistoryData.pageNo = val;
            this.historyData(this.quitShopHistoryData);
        },
        // 退货商品分页
        qiutShopChangeSize(val) {
            this.qiutShopParams.pageSize = val;
            this.qiutShopList(this.qiutShopParams);
        },
        // 退货商品分页
        qiutShopChangePageNo(val) {
            this.qiutShopParams.pageNo = val;
            this.qiutShopList(this.qiutShopParams);
        },
        // 选择退货商品
        selectQuitShop() {
            if (this.tableRowData.length) {
                this.dialogShopVisible = false;
                this.tableRowData.map((item, index) => {
                    this.selectedQuitTable.push(item);
                });

                this.qiutShopParams.skus = this.selectedQuitTable.map((item, index) => {
                    return item.skuCode;
                });
               this.qiutShopParams.skus = this.qiutShopParams.skus.join(',');
            } else {
                this.$utils.messagetip.warningTip('请选择商品!');
            }
        },
        // 删除选中的退货商品列表
        deleteSelectedQuitTable(index) {
            this.selectedQuitTable.splice(index, 1);
            this.qiutShopParams.skus = this.selectedQuitTable.map((item, index) => {
                return item.skuCode;
            });
            this.qiutShopParams.skus = this.qiutShopParams.skus.join(',');
        },
        handleSelectionChange(row) {
            this.tableRowData = row;
        },
        // 编辑时购商品初始化
        initQuitShopDetail(id) {
            this.$AXIOS.GET('/purchaseOutboundOrder/getOrder/' + id, {tag: '1'}).then( res => {
                this.qiutShopParams.returnOrderTypeName = res.result.returnOrderTypeName;
                this.qiutShopParams.supplierName = res.result.supplierName;
                this.qiutShopParams.warehouseName = res.result.warehouseName;
                for (let obj1 in res.result) {
                    for (let obj2 in this.searchParams) {
                        if (obj1 === obj2) {
                            this.searchParams[obj2] = res.result[obj1];
                        }
                    }
                }
                this.citySelect = [res.result.receiverProvince, res.result.receiverCity, res.result.receiverArea];
                this.selectedQuitTable = res.result.purchaseOutboundDetailList ? res.result.purchaseOutboundDetailList : [];
                this.qiutShopParams.skus = this.selectedQuitTable ? this.selectedQuitTable.map((item, index) => {
                    return item.skuCode;
                }) : '';
                this.qiutShopParams.skus = this.selectedQuitTable ? this.qiutShopParams.skus.join(',') : '';

                this.currentSupplierCode = res.result.supplierCode;
                this.returnOrderType = res.result.returnOrderType;
            });
        },
        // 退货商品重置搜索
        qiutResetForm() {
            this.qiutShopParams.skuCode = '';
            this.qiutShopParams.skuName = '';
            this.qiutShopParams.brandId = '';
            this.qiutShopParams.barCode = '';
            this.qiutShopParams.billType = this.searchParams.billType;
            this.qiutShopParams.pageSize = 5;
            this.qiutShopParams.pageNo = 1;
            this.qiutShopParams.start = this.qiutShopParams.totalCount = 0;
            this.qiutShopList(this.qiutShopParams);
        },
        // 获取供应商名称
        supplierChange(row) {
            this.qiutShopParams.supplierName = row.label;
            this.searchParams.receiver = row.contact;
            this.searchParams.receiverNumber = row.phone;
            this.searchParams.receiverProvince = row.province;
            this.searchParams.receiverCity = row.city;
            this.searchParams.receiverArea = row.area;
            this.searchParams.receiverAddress = row.address;
            this.citySelect = [row.province, row.city, row.area];

            if (this.currentSupplierCode !== row.value) {
                this.selectedQuitTable = [];
                this.qiutShopParams.skus = '';
            }
        },
        // 获取退货仓库名称
        warehouseChange(row) {
            this.qiutShopParams.warehouseName = row.label;
            this.selectedQuitTable = [];
        },
        // 退货类型change事件
        returnOrder(row) {
            // console.log(row, this.returnOrderType);
            this.qiutShopParams.returnOrderTypeName = row.label;
            if (row.value !== this.returnOrderType) {
                this.returnOrderType = row.value;
                this.selectedQuitTable = [];
                this.qiutShopParams.skus = [];
            }
        },
        // 打开历史记录弹窗
        openDetailDialog(row) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 181);
            this.quitShopHistoryData.startDate = start;
            this.quitShopHistoryData.endDate = end;
            this.quitShopHistoryData.skuCode = row.skuCode;
            this.quitShopHistoryData.supplierCode = this.searchParams.supplierCode;
            this.quitShopHistoryData.warehouseInfoId = this.searchParams.warehouseInfoId;
            this.quitShopHistoryData.returnOrderType = this.searchParams.returnOrderType;
            this.quitShopHistoryData.skuName = row.skuName;
            let data = {
                skuCode: row.skuCode,
                supplierCode: this.searchParams.supplierCode,
                warehouseInfoId: this.searchParams.warehouseInfoId,
                returnOrderType: this.searchParams.returnOrderType,
                startDate: this.formatData(start, 'yyyy-MM-dd'),
                endDate: this.formatData(end, 'yyyy-MM-dd'),
                pageSize: 5,
                pageNo: 1,
                start: 0
            };
            this.historyData(data);
        },
        // 搜索历史详情数据
        searchHistorData() {
            if (typeof this.quitShopHistoryData.startDate !== 'string' || typeof this.quitShopHistoryData.endDate !== 'string' ) {
                 this.quitShopHistoryData.startDate = this.formatData(this.quitShopHistoryData.startDate, 'yyyy-MM-dd');
                 this.quitShopHistoryData.endDate = this.formatData(this.quitShopHistoryData.endDate, 'yyyy-MM-dd');
            }
            this.historyData(this.quitShopHistoryData);
        },
        // 获取历史详情数据
        historyData(data) {
            this.$AXIOS.LISTGET('/purchaseOutboundOrder/getPurchaseHistory', data).then(res => {
                this.quitShopHistoryData.list = res.result;
                this.quitShopHistoryData.totalCount = res.totalCount;
            });
            this.dialogShopDetailVisible = true;
        },
        // 打开选择退货弹窗
        qiutShopDialog() {
            if (!this.searchParams.supplierCode) {
                this.$utils.messagetip.warningTip('请先选择供应商');
            } else if (!this.searchParams.warehouseInfoId) {
                this.$utils.messagetip.warningTip('请先选择退货仓库');
            } else if (!this.searchParams.returnOrderType) {
                this.$utils.messagetip.warningTip('请先选择退货类型');
            } else if (!this.searchParams.billType) {
                this.$utils.messagetip.warningTip('请先选择单据类型');
            } else {
                this.qiutShopParams.supplierCode = this.searchParams.supplierCode;
                this.qiutShopParams.warehouseInfoId = this.searchParams.warehouseInfoId;
                this.qiutShopParams.returnOrderType = this.searchParams.returnOrderType;
                this.qiutShopParams.billType = this.searchParams.billType;
                this.dialogShopVisible = true;
                this.qiutShopParams.pageNo = 1;
                this.qiutShopParams.pageSize = 5;
                this.qiutShopParams.totalCount = 0;
                this.initBrandName(this.qiutShopParams.supplierCode);
                this.qiutShopList(this.qiutShopParams);
            }
        },
        // 退货商品详情列表搜索
        qiutShopSearch() {
            this.qiutShopParams.pageNo = 1;
            this.qiutShopParams.start = 0;
            this.qiutShopParams.totalCount = 0;
            this.qiutShopList(this.qiutShopParams);
        },
        qiutSelect() {
            this.dialogShopVisible = false;
        },
        goBack() {
            this.$router.push({path: '/purchreturnordermanage'});
            // this.isShow = true;
        },
         // 获取供应商名称列表
        initSupplierName() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getSuppliers').then(res => {
                this.supplierOptions = res.result.map((item, index) => {
                    item.label = item.supplierName;
                    item.value = item.supplierCode;
                    return item;
                });
            });
        },
        // 获取退货仓库列表
        initWarehouse() {
            this.$AXIOS.GET('/purchaseOutboundOrder/getWarehouse').then( res => {
                this.warehouseOptions = res.result.map((item, index) => {
                    return {
                        value: item.id,
                        label: item.warehouseName
                    };
                });
            });
        },
        // 获取退货商品列表
        qiutShopList(data) {
            this.tableRowData = [];
            this.qiutShopTableData = [];
            this.isLoading = true;
            this.$AXIOS.POST('/purchaseOutboundOrder/getDetail', data).then(res => {
                this.tableRowData = [];
                this.qiutShopTableData = res.result.result;
                this.qiutShopParams.totalCount = res.result.totalCount;
            }).finally(() => {
              this.isLoading = false;
            });
            // this.$AXIOS.LISTGET('/purchaseOutboundOrder/getDetail', data).then(res => {
            //     this.tableRowData = [];
            //     this.qiutShopTableData = res.result;
            //     this.qiutShopParams.totalCount = res.totalCount;
            // }, () => {
            //     this.qiutShopTableData = [];
            //     this.qiutShopParams.totalCount = 0;
            // }).finally(() => {
            //   this.isLoading = false;
            // });
        },
        // 获取品牌名称
        initBrandName(id) {
            this.$AXIOS.GET('/purchaseOutboundOrder/getBrands/' + id).then(res => {
               this.brandNameOptions = res.result.map((item, index) => {
                    return {
                        value: item.brandId,
                        label: item.brandName
                    };
                });
            });
        },
        // 获取城市列表
        cityList() {
            this.$AXIOS.LISTGET('/metadata/address').then(res => {
                this.cityListData = res.map((item, index) => {
                    return {
                        label: item.text,
                        value: item.id,
                        children: item.children ? item.children.map((item1, index) => {
                            return {
                                label: item1.text,
                                value: item1.id,
                                children: item1.children ? item1.children.map((item2, index) => {
                                    return {
                                        label: item2.text,
                                        value: item2.id
                                    };
                                }) : ''
                            };
                        }) : ''
                    };
                });
            });
        },
        // 保存
        keepQuitData() {
            if (this.searchParams.supplierCode) {
                // let arr = this.keepVerificationRule();  // 校验
                let parent = document.getElementById('shopTable');
                // if (arr.num !== -1) {
                //     if (typeof arr.num === 'number') {
                //         let item = parent.getElementsByClassName('el-table__row')[arr.num];
                //         let input = item.getElementsByTagName('input')[arr.index];
                //         input.focus();
                //     }
                //     return;
                // }

                if (this.id === 'add') {
                    this.initConfirmData('/purchaseOutboundOrder/save', 0);
                } else {
                    this.initConfirmData('/purchaseOutboundOrder/update', 0);
                }
            } else {
                this.$utils.messagetip.warningTip('请选择供应商');
            }
        },
        // 保存时的数据校验
        keepVerificationRule() {
            let flag = false;
            let outRes = /^[1-9]\d*$/;
            let regNumber = /^[0-9]*$/; // 验证数字
            let regPrice = new RegExp(/^\d+(\.(?!.*0$)\d{1,7})?$/); // 退货单价正则
            let regRate = new RegExp(/^\d+(\.(?!.*0$)\d{1,2})?$/); // 退货税率正则
            let numArr = {
                num: -1,
                index: ''
            };

            for (let i = 0; i < this.selectedQuitTable.length; i++) {
                if (outRes.test(this.selectedQuitTable[i].outboundQuantity)) {
                    if (this.selectedQuitTable[i].outboundQuantity > this.selectedQuitTable[i].canBackQuantity) {
                        numArr.num = i;
                        numArr.index = 0;
                        this.$utils.messagetip.warningTip('退货数量需小于可退货数量');
                        break;
                    }
                } else {
                    if (!this.selectedQuitTable[i].outboundQuantity) {

                    } else {
                        numArr.num = i;
                        numArr.index = 0;
                        this.$utils.messagetip.warningTip('退货数量输入不正确，需输入大于0的正整数');
                        break;
                    }
                }
                if (!this.selectedQuitTable[i].price) {

                } else {
                    if (!regPrice.test(this.selectedQuitTable[i].price)) {
                        numArr.num = i;
                        numArr.index = 1;
                        this.$utils.messagetip.warningTip('退货单价输入有误，需输入大于或等于0最多保留七位小数的数字');
                        break;
                    }
                }

                if (!regRate.test(this.selectedQuitTable[i].taxRate)) {
                    numArr.num = i;
                    numArr.index = 2;
                    this.$utils.messagetip.warningTip('退货税率输入有误，需输入大于或等于0最多保留二位小数的数字');
                    break;
                }

                if (this.selectedQuitTable[i].outboundQuantity * this.selectedQuitTable[i].price > 1000000000) {  // 退货金额不能超过10亿
                    // this.$utils.messagetip.warningTip(`商品SKU名称为${this.selectedQuitTable[i].skuCode}的退货总金额不能超过1000000000元`);
                    this.$utils.messagetip.warningTip(`商品的退货总金额不能超过1000000000元`);
                    numArr.num = 'false';
                    break;
                }
            }
            return numArr;
        },
        // 提交审核
        confirmReview() {
            let parent = document.getElementById('shopTable');
            let regexp = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);

            if (!this.searchParams.supplierCode) {
                this.$utils.messagetip.warningTip('请选择供应商');
                return;
            } else if (!this.searchParams.warehouseInfoId) {
                this.$utils.messagetip.warningTip('请选择退货仓库');
                return;
            } else if (!this.searchParams.returnOrderType) {
                this.$utils.messagetip.warningTip('请选择退货类型');
                return;
            } else if (!this.searchParams.pickType) {
                this.$utils.messagetip.warningTip('请选择提货方式');
                return;
            } else if (!this.searchParams.receiver) {
                this.$utils.messagetip.warningTip('请输入退货收货人');
                return;
            } else if (!this.searchParams.receiverNumber) {
                this.$utils.messagetip.warningTip('请输入退货收货人手机号');
                return;
            } else if (!regexp.test(this.searchParams.receiverNumber)) {
                this.$utils.messagetip.warningTip('收货人手机号格式不正确');
                return;
            } else if (!this.searchParams.billType) {
                this.$utils.messagetip.warningTip('请选择单据类型');
                return;
            } else if (!this.searchParams.returnPolicy) {
                this.$utils.messagetip.warningTip('请输入退货说明');
                return;
            } else if (!this.selectedQuitTable.length) {
                this.$utils.messagetip.warningTip('请选择至少一项商品');
                return;
            } else if (this.searchParams.pickType === '2' || this.searchParams.pickType === '3') {
                if ( !this.citySelect[0]) {
                    this.$utils.messagetip.warningTip('请选择退货省份，城市，地区');
                    return;
                } else if (!this.searchParams.receiverAddress) {
                    this.$utils.messagetip.warningTip('请填写退货的详细地址');
                    return;
                }
            }
            let arr = this.verificationRule();
            if (arr.num !== -1) {
                if (typeof arr.num === 'number') {
                    let item = parent.getElementsByClassName('el-table__row')[arr.num];
                    let input = item.getElementsByTagName('input')[arr.index];
                    input.focus();
                }
                return;
            }
            if (this.id === 'add') {
                this.initConfirmData('/purchaseOutboundOrder/save', 1);
            } else {
                this.initConfirmData('/purchaseOutboundOrder/update', 1);
            }
        },
        // 校验规则
        verificationRule(arr) {
            let flag = false;
            let outRes = /^[1-9]\d*$/;
            let regPrice = new RegExp(/^\d+(\.(?!.*0$)\d{1,7})?$/); // 退货单价正则
            let regRate = new RegExp(/^\d+(\.(?!.*0$)\d{1,2})?$/); // 退货税率正则
            let numArr = {
                num: -1,
                index: ''
            };

            for (let i = 0; i < this.selectedQuitTable.length; i++) {
                if (outRes.test(this.selectedQuitTable[i].outboundQuantity)) {
                    if (this.selectedQuitTable[i].outboundQuantity > this.selectedQuitTable[i].canBackQuantity) {
                        numArr.num = i;
                        numArr.index = 0;
                        this.$utils.messagetip.warningTip('退货数量需小于可退货数量');
                        break;
                    }
                } else {
                    numArr.num = i;
                    numArr.index = 0;
                    if (!this.selectedQuitTable[i].outboundQuantity) {
                        this.$utils.messagetip.warningTip('退货数量不能为空');
                    } else {
                        this.$utils.messagetip.warningTip('退货数量格式输入不正确,需输入大于0的正整数');
                    }
                    break;
                }

                if (!regPrice.test(this.selectedQuitTable[i].price)) {
                    numArr.num = i;
                    numArr.index = 1;
                    this.$utils.messagetip.warningTip('退货单价输入有误，需输入大于或等于0最多保留七位小数的数字');
                    break;
                }
                if (!regRate.test(this.selectedQuitTable[i].taxRate)) {
                    numArr.num = i;
                    numArr.index = 2;
                    this.$utils.messagetip.warningTip('退货税率输入有误，需输入大于或等于0最多保留二位小数的数字');
                    break;
                }
                if (this.selectedQuitTable[i].outboundQuantity * this.selectedQuitTable[i].price > 1000000000) {  // 退货金额不能超过10亿
                    // this.$utils.messagetip.warningTip(`商品SKU名称为${this.selectedQuitTable[i].skuCode}的退货总金额不能超过1000000000元`);
                    this.$utils.messagetip.warningTip(`商品的退货总金额不能超过1000000000元`);
                    numArr.num = 'false';
                    break;
                }
            }
            return numArr;
        },
        /**
         * 保存和审核的ajax
         */
        initConfirmData(url, status) {
            let data = {};
            for (let obj in this.searchParams) {
                if (obj === 'pageSize' || obj === 'pageNo' || obj === 'totalCount' || obj === 'start') {
                    continue;
                } else {
                    data[obj] = this.searchParams[obj];
                }
            }

            data.purchaseOutboundDetailList = this.selectedQuitTable.map((item, index) => {
                let arr = {};
                for (let obj in item) {
                    if (obj === 'createTime' || obj === 'updateTime') {

                    } else {
                        arr[obj] = item[obj];
                    }
                }
                return arr;
            });
            data.receiverProvince = this.citySelect[0];
            data.receiverCity = this.citySelect[1];
            data.receiverArea = this.citySelect[2];
            data.status = status;
            if (this.id === 'add') {
                this.$AXIOS.JSONPOST(url, data, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout(() => {
                        this.$router.push({path: '/purchreturnordermanage'});
                    }, 1000);
                });
            } else {
                data.id = this.id;
                this.$AXIOS.JSONPUT(url, data, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    setTimeout(() => {
                        this.$router.push({path: '/purchreturnordermanage'});
                    }, 1000);
                });
            }
        },
        // 转换时间格式
        formatData(time, format) {
            let t = new Date(time);
            let tf = function(i) {
                 return (i < 10 ? '0' : '') + i;
            };

            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
                }
            });
        }

    }
  };
</script>
<style lang="stylus" scoped>
    .purchreturnorderaddoredit
        .title
            padding 10px
            background-color #f5f7fa
        .bottonGroup
            text-align center
            padding-top 50px
        .page
            text-align right
            padding 10px 0
        .requiredItem
            color red
            position: relative;
            top: 21px;
            left: 33px;
        .requiredItem.a1
            left: 45px;
        .requiredItem.a2
            left: 61px;
        .requiredItem.a3
            left: 46px;
        .requiredItem.a5
            left: 10px;
        .requiredItem.a6
            left: 45px;
</style>
<style lang="stylus" >
    .purchreturnorderaddoredit
        .group_table
            tr
                th:nth-child(8), th:nth-child(9),th:nth-child(10),th:nth-child(11)
                    div::before
                        content: '*'
                        padding-right: 5px
                        color: #ff0000
</style>
