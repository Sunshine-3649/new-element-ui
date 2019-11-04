<template>
  <div class="purchaseordermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
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
        <el-col :span="6">
          <el-form-item label="采购人：" size="mini">
            <el-input v-model.trim="searchParams.purchaseName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="单据状态：" size="mini">
            <el-select v-model="searchParams.purchaseStatus" filterable placeholder="请选择">
              <el-option v-for="item in purchaseOrderCodeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库状态：" size="mini">
            <el-select v-model="searchParams.warehouseNoticeStatus" filterable placeholder="请选择">
              <el-option v-for="item in warehouseNoticeStatusList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近更新日期：" size="mini" style="margin-bottom: 0px">
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
          <el-form-item label="采购组：" size="mini">
            <el-select v-model="searchParams.purchaseGroupCode" filterable placeholder="请选择">
              <el-option v-for="item in purchaseGroupCodeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="SKU编号：" size="mini">
            <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码：" size="mini">
            <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增采购单</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="multipleSelection && !multipleSelection.length" @click="downloadPdf">导出PDF</el-button> -->
        <el-button type="primary" size="mini" :disabled="disabledDownLoad" @click="moduleDownLoad">导出PDF</el-button>
        <el-button type="primary" @click="exportTableData" icon="circle-cross" size="mini" :loading="disabledDownLoadExcel" :disabled='isTableDisabled'>{{disabledDownLoadExcel?'下载中':'导出Excel'}}</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @selection-change="handleSelectionChange" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column type="selection" width="55" align="center" :selectable="checkSelectable"></el-table-column>
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="采购单编号" prop="purchaseOrderCode" align="center" width="125" show-overflow-tooltip>
          <template slot-scope="scope">
            <span @click="toPreview(scope.row.id)" style="color:#409EFF; cursor:pointer">
                {{ scope.row.purchaseOrderCode }}
            </span>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" prop="purchaseType" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{checkedType(scope.row.purchaseType)}}
        </template>
      </el-table-column>
      <el-table-column label="归属采购组" prop="purchaseGroupName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="归属采购人" prop="purchasePerson" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="收货仓库" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="采购总金额(元)" prop="totalFee" width="90" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="采购总数量" prop="purchaseCount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.purchaseCount">{{scope.row.purchaseCount}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="要求到货日期" prop="requriedReceiveDate" width="120" align="center"></el-table-column>
      <el-table-column label="截止到货日期" prop="endReceiveDate" width="120" align="center"></el-table-column>
      <el-table-column label="单据状态" prop="status" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'" style='color: orange;'>{{checkedStatus(scope.row.status)}}</div>
          <div v-else>{{checkedStatus(scope.row.status)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="入库状态" prop="warehouseNoticeStatus" align="center">
        <template slot-scope="scope">
          {{checkedWarStatus(scope.row.warehouseNoticeStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="完结状态" prop="finishStatus" align="center">
        <template slot-scope="scope">
          {{checkedfinishStatus(scope.row.finishStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status === '0' || scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '9'" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === '0' || scope.row.status === '1'" @click="deleteBtn(scope.row)">删除</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === '2'" @click="warehouseNameNotice(scope.row)">入库通知</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === '2'" @click="freezeBtn(scope.row)">冻结</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === '2' || scope.row.status === '9' || (scope.row.status === '8' && (scope.row.noticeStatus === '0' || scope.row.noticeStatus === '1' || scope.row.noticeStatus === '7'))" @click="discardBtn(scope.row)">作废</el-button>
          <el-button size="mini" type="text" v-if="scope.row.status === '6'" @click="disfreezeBtn(scope.row)">解冻</el-button>
          <el-button size="mini" type="text" @click="copy(scope.row)">复制</el-button>
          <el-button size="mini" type="text" v-if="scope.row.finishStatus === '0' && (scope.row.warehouseNoticeStatus === '2' || scope.row.warehouseNoticeStatus === '3')" @click="excepHanding(scope.row)">异常处理</el-button>
          <!-- <div v-if="scope.row.status === '3' || scope.row.status === '7'  || (scope.row.status === '8' && (scope.row.noticeStatus !== '0' && scope.row.noticeStatus !== '1' && scope.row.noticeStatus !== '7'))">-</div> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="purchasePrice" label="含税单价(元)" align="center"></el-table-column>
          <el-table-column prop="taxRate" label="采购税率" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.taxRate}}<span v-if='scope.row.taxRate'>%</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="totalPurchaseAmount" label="采购总金额(元)" align="center"></el-table-column>
          <el-table-column prop="batchCode" label="批次号" align="center"></el-table-column>
          <el-table-column prop="produceCode" label="生产编码" align="center"></el-table-column>
          <el-table-column prop="productDate" label="生产日期" align="center" width='140'></el-table-column>
          <el-table-column prop="expireDate" label="截止保质日期" align="center" width="140"></el-table-column>
          <el-table-column prop="shelfLifeDays" label="理论保质期限(天)" align="center" ></el-table-column>
          <el-table-column prop="purchasingQuantity" label="采购数量" align="center"></el-table-column>
          <el-table-column prop="receiveStatus" label="入库状态" align="center">
            <template slot-scope='scope'>
              <div v-if="scope.row.receiveStatus === '3'" style='color: orange;'>{{checkedWarStatus(scope.row.receiveStatus)}}</div>
              <div v-else>{{checkedWarStatus(scope.row.receiveStatus)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="仓库反馈入库信息" align="center">
            <el-table-column prop="storageTime" label="实际入库时间" align="center" width='140'></el-table-column>
            <el-table-column prop="actualStorageQuantity" label="实际入库总量" align="center"></el-table-column>
            <el-table-column prop="normalStorageQuantity" label="正品入库数量" align="center"></el-table-column>
            <el-table-column prop="defectiveStorageQuantity" label="残次品入库数量" align="center" width="90"></el-table-column>
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
              <!-- <a class='btn' :href="downLoadUrl" download="1.jpg">{{scope.row.fileName}}</a> -->
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
          <el-col :span="6" style="height: auto;line-height: 30px;">&nbsp;</el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <el-button type="primary" size="mini" @click="showInstallInfo" v-if="tableRowDetail.status === '0' || tableRowDetail.status === '1' || tableRowDetail.status === '2' || tableRowDetail.status === '3'">维护装箱信息</el-button>
          </el-col>
        </el-row>
        <el-table v-if="boxInfoDetail.purchaseBoxInfoDetailResultVOList" :data="boxInfoDetail.purchaseBoxInfoDetailResultVOList" show-summary :summary-method="getSummaries" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
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
            <el-table-column prop="cartonSize" label="外箱尺寸CM" align="center" width="135">
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
            <el-table-column prop="remark" label="备注" align="center" width="135">
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
            <div class="title" style="display: inline-block;">发件人：</div>
            <div class="content" style="display: inline-block;">{{tableRowDetail.sender}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title" style="display: inline-block;">发件方手机：</div>
            <div class="content" style="display: inline-block;">{{tableRowDetail.senderNumber}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title" style="display: inline-block;">发件方省份.城市：</div>
            <div class="content" style="display: inline-block;">{{tableRowDetail.senderProvinceName}}.{{tableRowDetail.senderCityName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title" style="display: inline-block;">发件方详细地址：</div>
            <div class="content" style="display: inline-block;">{{tableRowDetail.senderAddress}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="4">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">采购合同：</div>
            <div class="content">{{tableRowDetail.contractCode}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">付款方式：</div>
            <div class="content">{{tableRowDetail.payType}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">币制：</div>
            <div class="content">{{tableRowDetail.currencyTypeName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">运输费用承担方：</div>
            <div class="content">{{tableRowDetail.transportFeeDestIdName}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">提运单号：</div>
            <div class="content">{{tableRowDetail.takeGoodsNo}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">处理优先级：</div>
            <div class="content">{{tableRowDetail.handlerPriorityName}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">收货人：</div>
            <div class="content">{{tableRowDetail.receiver}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title"> 收货人手机：</div>
            <div class="content">{{tableRowDetail.receiverNumber}}</div>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">要求到货日期：</div>
            <div class="content">{{tableRowDetail.requriedReceiveDate}}</div>
          </el-col>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">截止到货日期：</div>
            <div class="content">{{tableRowDetail.endReceiveDate}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="5">
        <el-table :data="logInfoList" style="width: 100%" border>
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
    <!-- 弹窗-安装信息维护 -->
    <el-dialog title="收货地址" :visible.sync="isInstallInfo">
      <!-- 基本信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <!-- 第一行 -->
        <el-row>
          <el-col :span="8" style="height: auto;line-height: 30px;">
            <div class="title">采购单编号：</div>
            <div class="content">{{tableRowDetail.purchaseOrderCode}}</div>
          </el-col>
          <el-col :span="8" style="height: auto;line-height: 30px;">
            <div class="title">供应商名称：</div>
            <div class="content">{{tableRowDetail.supplierName}}</div>
          </el-col>
          <el-col :span="8" style="height: auto;line-height: 30px;">
            <div class="title">要求到货日期：</div>
            <div class="content">{{tableRowDetail.requriedReceiveDate}}</div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="8" style="height: auto;line-height: 30px;">
            <div class="title">物流公司：</div>
            <div class="content">
              <el-select v-model="form.logiisticsInfo" clearable filterable placeholder="请选择" size="mini">
                <el-option v-for="item in logiisticsInfoList" :key="item.logisticsCode" :label="item.logisticsCorporationName" :value="item.logisticsCode">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8" style="height: auto;line-height: 30px;">
            <div class="title tip_red">包装方式：</div>
            <div class="content">
              <el-autocomplete size='mini' class="inline-input" v-model="state1" :maxlength='50' :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <!-- 装箱信息 -->
      <el-card class="box-card" style="margin-top: 15px;">
        <div slot="header" class="clearfix">
          <span>装箱信息</span>
        </div>
        <!-- 表格tableData -->
        <div class="table">
          <ul class="table_menu" style="background: rgb(242, 242, 242);">
            <li>序号</li>
            <li>商品SKU名称</li>
            <li>商品SKU编号</li>
            <li>规格</li>
            <li class="name text_hide">条形码</li>
            <li>采购数量</li>
            <li>操作</li>
          </ul>
          <div v-for="(tableItem, index) in boxInfoDetail.purchaseBoxInfoDetailResultVOList" :key="index">
            <ul class="table_menu" style="background: rgb(242, 242, 242);">
              <li>{{index + 1}}</li>
              <li>{{tableItem.skuName}}</li>
              <li>{{tableItem.skuCode}}</li>
              <li>{{tableItem.specNatureInfo}}</li>
              <li>{{tableItem.barCode}}</li>
              <li class="name">{{tableItem.purchasingQuantity}}</li>
              <li>
                <el-button size="mini" type="text" @click="addInfo(index)">新增装箱信息</el-button>
              </li>
            </ul>
            <el-table class="price_list" :data="tableItem.purchaseBoxInfoList" border show-summary :summary-method="getComputed">
              <!-- <el-table-column label="序号" type="index" width="40" align="center"></el-table-column> -->
              <el-table-column label="数量/箱" prop="amountPerBox" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amountPerBox" @change="amountChange(index, scope.$index)" :maxlength='10' placeholder="" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="箱号" prop="boxNumber" width="200"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.boxNumber" placeholder="" :maxlength='15' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="箱数CTN" prop="boxAmount" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.boxAmount" @change="amountChange(index, scope.$index)" placeholder="" :maxlength='10' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="数量PCS" prop="amount" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.amountPerBox > -1 && scope.row.boxAmount > -1">{{scope.row.amountPerBox * scope.row.boxAmount}}</div>
                  <div v-else>0</div>
                </template>
              </el-table-column>
              <el-table-column label="毛重KG" prop="grossWeight" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.grossWeight" placeholder="" :maxlength='10' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="外箱尺寸CM" prop="cartonSize"  align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cartonSize" placeholder="" :maxlength='20' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="体积M3" prop="volume" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.volume" placeholder="" :maxlength='10' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder="" :maxlength='100' size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteListBtn(index, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <ul class="table_menu" style="background: rgb(242, 242, 242);">
              <li>合计</li>
              <li></li>
              <li>{{boxAmountCount}}</li>
              <li>{{tableItem.specNatureInfo}}</li>
              <li>{{tableItem.barCode}}</li>
              <li class="name">{{tableItem.purchasingQuantity}}</li>
              <li>
                <el-button size="mini" type="text" @click="addInfo(index)">新增装箱信息</el-button>
              </li>
            </ul> -->
          </div>

        </div>
      </el-card>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="finishBtn" size="mini">完成</el-button>
        <el-button @click="saveBtn" size="mini" v-if="tableRowDetail.boxInfoStatus !== '1'">暂存</el-button>
        <el-button @click="hideMode" size="mini">取消</el-button>
      </div>
    </el-dialog>
    <!-- 导出pdf -->
    <el-dialog :visible.sync="isPreviewInfo" width="820px">
      <div class="print" id="pdfDom" style="width: 800px">
      <div class="print_order" v-for="(data, i) in printData" :key="i" >
        <div>
          <h2 style="font-size: 20px; font-weight: 700; text-align: center;margin: 10px 0 25px 0">采购订单</h2>
          <el-row type="flex" class="row-bg" :gutter="20" justify="center" style="font-size: 14px">
            <el-col :span="6" ><div style='text-align: center'>制单人：{{data.createOperatorName}}</div></el-col>
            <el-col :span="6" ><div style='text-align: center'>联系方式：{{data.createOperatorPhone}}</div></el-col>
            <el-col :span="6" ><div style='text-align: center'>制单日期：{{data.createTime ? data.createTime.substr(0,10) : ''}}</div></el-col>
          </el-row>
          <div class="line"></div>
          <span class="tip" style="font-size: 16px;margin: 1px 0 0">基本信息</span>
          <div style="padding: 10px;margin: 0 15px;font-size: 12px">
            <table border="1" cellspacing="0" style="width: 100%;">
              <tr>
                <td class="item table_title">采购单编号</td>
                <td class="item table_content">{{data.purchaseOrderCode}}</td>
                <td class="item table_title">采购方</td>
                <td class="item table_content">{{data.purchaseCompany}}</td>
              </tr>
              <tr>
                <td class="item table_title">供应商</td>
                <td class="item table_content">{{data.supplierName}}</td>
                <td class="item table_title">供应商联系人</td>
                <td class="item table_content">{{data.supplierPhone}}</td>
              </tr>
              <tr>
                <td class="item table_title">付款方式</td>
                <td class="item table_content">{{data.payType}}</td>
                <td class="item table_title">运输费用承担方</td>
                <td class="item table_content">{{data.transportFeeDestIdName}}</td>
              </tr>
              <tr>
                <td class="item table_title">要求到货日期</td>
                <td class="item table_content">{{data.requriedReceiveDate ? data.requriedReceiveDate.substr(0,10) : ''}}</td>
                <td class="item table_title">截止到货日期</td>
                <td class="item table_content">{{data.endReceiveDate ? data.endReceiveDate.substr(0,10) : ''}}</td>
              </tr>
              <tr>
                <td class="item table_title">收货仓库</td>
                <td colspan="3" class="item table_content" style="text-align: left;padding-left: 10px;">{{data.warehouseName}}</td>
              </tr>
            </table>
          </div>
          <div class="line"></div>
          <span class="tip" style="font-size: 16px;margin: 1px 0 0">商品明细</span>
          <el-row style="margin-bottom: 15px">
            <el-col :span="12">
              <div style="font-size: 14px;text-align: right; padding-right: 20px;line-height: 30px;margin-bottom: 10px;">
                采购总金额：<span style="font-weight: 700;font-size: 15px">{{data.totalFee}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;border-left: solid 1px #ccc; padding-left: 20px;line-height: 30px;margin-bottom: 10px;">
                采购总数量：<span style="font-weight: 700;font-size: 15px">{{purchaseCount}}</span>
              </div>
            </el-col>
          </el-row>
          <el-table :data="tableRowPrintList" style="width: 780px;font-size: 14px" border>
            <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
            <el-table-column prop="skuName" label="SKU名称" align="center" width="150"></el-table-column>
            <el-table-column prop="barCode" label="条形码" align="center" width='100'></el-table-column>
            <el-table-column prop="purchasePrice" label="含税单价（元）" align="center" width="130"></el-table-column>
            <el-table-column prop="taxRate" label="采购税率"  align="center" width="100">
              <template slot-scope='scope'>
                <p>{{scope.row.taxRate}}%</p>
              </template>
            </el-table-column>
            <el-table-column prop="purchasingQuantity" label="采购数量"  align="center" width="100"></el-table-column>
            <el-table-column prop="totalPurchaseAmount" label="采购总金额（元）"  align="center"></el-table-column>
          </el-table>
          <div class="line"></div>
          <span class="tip" style="font-size: 16px;margin: 1px 0 0">其他信息</span>
          <div class="other_info">
            <el-row style="font-size: 14px">
              <el-col><div class="other_info_span"><span>收货地址</span>：{{data.receiveAddress}}</div></el-col>
            </el-row>
            <el-row style="font-size: 14px">
              <el-col><div class="other_info_span"><span>退换货地址</span>：{{data.goodsReturnAddress}}</div></el-col>
            </el-row>
            <el-row style="font-size: 14px">
              <el-col><div class="other_info_span"><span>质保期</span>：{{data.guaranteePeriod}}</div></el-col>
            </el-row>
            <el-row style="font-size: 14px;height: 300px;">
              <el-col>
                <div class="other_info_span"><span>纸箱唛头</span>：
                  <span class="box_info box_info_left">
                    <el-row style="font-size: 14px;font-weight:700">
                      <el-col>正唛：</el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>{{data.mainMarkBox}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>品名：{{data.mainMarkName}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>规格：{{data.mainMarkSpec}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>颜色：{{data.mainMarkColor}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>数量：{{data.mainMarkNum}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>条形码：{{data.mainMarkBarcode}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>箱号：{{data.mainMarkCn}}</div></el-col>
                    </el-row>
                  </span>
                  <span class="box_info box_info_right">
                    <el-row style="font-size: 14px;font-weight:700">
                      <el-col>侧唛：</el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>{{data.sideMarkBox}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>品名：{{data.sideMarkName}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>条形码：{{data.sideMarkBarcode}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>数量：{{data.sideMarkNum}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>毛重：{{data.sideMarkWeight}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>外箱规格：{{data.sideMarkSpec}}</div></el-col>
                    </el-row>
                    <el-row style="font-size: 14px">
                      <el-col><div>箱号：{{data.sideMarkCn}}</div></el-col>
                    </el-row>
                  </span>
                </div>
              </el-col>
            </el-row>
            <el-row style="font-size: 14px">
              <el-col><div class="other_info_span"><span>验货标准</span>：{{data.acceptanceStandard}}</div></el-col>
            </el-row>
            <el-row style="font-size: 14px">
              <el-col><div class="ql-snow"><span style="display: inline-block;line-height: 30px;font-weight: 700">备注</span>：<div class="ql-editor" v-html="data.remark" style="border:1px solid #ccc;padding: 10px;">{{data.remark}}</div></div></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="copyDialogVisible" width="20%" :close-on-click-modal='false'>
      <div style="margin: 0 auto; width: 200px;">
        <i style="font-size: 25px; color: green;" class="el-icon-success"></i>&nbsp;<span style="line-height: 40px;font-size: 16px;">复制成功</span>
      </div>
      <p style="text-align: center; line-height: 30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已产生一条内容一样的新采购单。</p>
      <div style="text-align: center; margin:20px 0px">
        <el-button type="primary" size="mini"  @click="toEditBtn">去编辑</el-button>
        <span>{{time}}秒后将自动关闭窗口</span>
      </div>
    </el-dialog>
    <!-- 异常处理 -->
    <el-dialog
      title="采购异常处理"
      :visible.sync="isExceptShow"
      width="70%"
      >
      <div>
        <el-row class='excep_tip'>
          <el-col :span="2" class='excep_title'>
            处理结果：
          </el-col>
          <el-col :span="6"  class='excep_content'>
             <el-radio v-model="exceptResult" label="1" @change='radioChange'>完结采购单</el-radio>
          </el-col>
          <el-col :span="6">
             <el-radio v-model="exceptResult" label="2">继续入库</el-radio>
          </el-col>
        </el-row>
        <el-row class='excep_tip' style='text-align: left'>
          <el-col :offset="2" :span="12"  class='excep_content' style='color: red'>
            <p v-if='exceptResult == "1"' >选择完结采购单将会把本笔采购单直接完结。</p>
            <p v-if='exceptResult == "2"' >选择继续入库将会以异常的sku按正品入库数量差值生成一条新的入库通知单。</p>
          </el-col>
        </el-row>
        <el-row class='excep_tip'>
          <el-col :span="2" class='excep_title'>
            异常情况：
          </el-col>
          <el-col :span="6"  class='excep_content'>
            入库异常sku数：{{skuLength}}
          </el-col>
          <el-col :span="6"  >
            正品采购入库数量总差值：{{diffValueNum}}
          </el-col>
        </el-row>
        <el-row class='excep_tip'>
          <el-col :span="2" class='excep_title'>
            异常商品明细：
          </el-col>
          <el-col :span="21" class='excep_content'>
            <el-table :data="exceptTableData" ref="singleTable" highlight-current-row border style="width: 100%">
              <el-table-column align='center' type="index" width="70" label="序号"></el-table-column>
              <el-table-column align='center' prop="skuName" label="商品SKU名称"></el-table-column>
              <el-table-column align='center' prop="skuCode" label="商品SKU编号"></el-table-column>
              <el-table-column align='center' prop="purchasingQuantity" label="采购数量"></el-table-column>
              <el-table-column align='center' prop="receiveStatus" label="入库状态">
                <template slot-scope='scope'>
                  <div v-if="scope.row.receiveStatus === '2'" style='color: blue;'>{{checkedWarStatus(scope.row.receiveStatus)}}</div>
                  <div v-else-if="scope.row.receiveStatus === '3'" style='color: orange;'>{{checkedWarStatus(scope.row.receiveStatus)}}</div>
                  <div v-else>{{checkedWarStatus(scope.row.receiveStatus)}}</div>
                </template>
              </el-table-column>
              <el-table-column align='center' prop="zpDiff" label="正品入库差值"></el-table-column>
              <el-table-column align='center' prop="actualStorageQuantity" label="实际入库总数量"></el-table-column>
              <el-table-column align='center' prop="normalStorageQuantity" label="正品入库总数量"></el-table-column>
              <el-table-column align='center' prop="defectiveStorageQuantity" label="残次品入库总数量"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class='paging'>
          <el-pagination @size-change="exceptChangeSize" @current-change="exceptChangeNumber" :current-page="exceptParams.pageNo" :page-sizes="[1, 10, 20, 50, 100]" :page-size="exceptParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="exceptTotal">
          </el-pagination>
        </el-row>
        <el-row class='excep_tip' style='margin-top: 15px' v-if='exceptResult === "1"'>
          <el-col :span="2" class='excep_title tip_red'>
            处理意见：
          </el-col>
          <el-col :span="21" class='excep_content'>
            <el-input type="textarea" :rows="2" placeholder="" maxlength='50' v-model="excepRemark"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style='text-align: center;margin: 15px 0'>
        <el-button size='mini' @click="isExceptShow = false">取 消</el-button>
        <el-button size='mini' type="primary" :disabled='isClick' @click="markSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'purchaseordermanage',
  data() {
    return {
      isClick: false, // 重复点击
      exceptTotal: 0, // 异常分页数量
      exceptParams: {
        purchaseOrderCode: '',
        start: 0,
        pageNo: 1,
        pageSize: 10
      },
      excepRemark: '', // 异常原因
      exceptTableData: [], // 异常明细列表
      skuLength: 0, // sku数量
      diffValueNum: 0, // 差值
      exceptPurchaseOrderCode: '', // exceptPurchaseOrderCode
      exceptId: '', // id
      exceptResult: '1', // 处理结果
      isExceptShow: false, // 异常处理弹窗
      tableRowPrintList: [], // 预览打印的数据
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        start: 0,
        pageNo: 1,
        pageSize: 10,
        detailPageflag: true,
        purchaseStatus: '', // 单据状态
        purchaseOrderCode: ''
      },
      purchaseCount: 0,
      userName: window.sessionStorage.userName,
      isPreviewInfo: false,
      disabledDownLoad: false,
      disabledDownLoadExcel: false,
      isTableDisabled: false,
      codeArr: [], // 打印参数
      isPrint: false, // 打印的pdf
      loading: null, // loading
      isShow: false, // 下载pdf控制的隐藏
      copyId: '', // 复制成功之后要跳转到id
      timer: null, // 倒计时
      time: 5, // 倒计时时间
      copyDialogVisible: false, // 弹窗
      printData: [], // 打印的数据
      htmlTitle: '采购订单',
      tableData222: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      downLoadUrl: '', // 下载路径
      fileDataList: [], // 上传文件列表
      code: '', // 保存的采购单编号
      state1: '',
      form: {
        logiisticsInfo: '', // 物流信息
        packing: '' // 包装方式
      },
      restaurantsList: [], // 包装信息
      logiisticsInfoList: [], // 物流信息
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'PurchaseOrder',
        entityId: ''
      }, // 日志
      tableData: [],
      isInstallInfo: false, // 弹窗
      activeName: '1', // 当前选中的选项卡
      arr: [], // 数组列表
      purchaseGroupCodeList: [
        {
          name: '全部',
          code: ''
        }
      ], // 采购组列表
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
      tableRowList: [], // 详情明细
      tableRowDetail: {}, // 详情
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      boxInfoDetail: {}, // 装箱信息
      purchaseOrderCodeList: [
        {
          name: '全部',
          code: ''
        }
      ], // 单据状态列表
      purchaseTypeList: [
        {
          name: '全部',
          value: ''
        }
      ], // 采购类型列表
      warehouseNoticeStatusList: [
        {
          value: '',
          name: '全部'
        },
        {
          value: '0',
          name: '等待入库'
        },
        {
          value: '1',
          name: '全部入库'
        },
        {
          value: '2',
          name: '部分入库'
        },
        {
          value: '3',
          name: '入库异常'
        },
        {
          value: '4',
          name: '其他'
        }
      ], // 入库状态列表
      totalCount: 0, // 列表条数
      searchParams: {
        skuCode: '', // sku编号
        barCode: '', // sku编号
        purchaseGroupCode: '', // 采购组列表
        purchaseOrderCode: '', // 采购单编号
        supplierName: '', // 供应商名称
        purchaseType: '', // 采购类型
        purchaseName: '', // 采购人
        purchaseStatus: '', // 单据状态
        warehouseNoticeStatus: '', // 入库状态
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      multipleSelection: [] // 多选框选中
    };
  },
  created() {
    this.initDataList();
    this.getPurchaseOrderStatus();
    this.getPurchaseType();
    this.getpurchaseGroupCodeList();
  },
  computed: {
    divHeight() {
      let height = 600;
      if (this.printData[0].remark && this.printData[0].remark.length) {
        height = 650 - (Math.ceil(this.printData[0].remark.length / 62) * 50);
      }
      return height + 'px';
    }
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
      this.disabledDownLoadExcel = true;
      this.$AXIOS.EXPORT({url: '/purchase/exportPurchase', data: params, fileName: '采购列表单'}).then(res => {

      }).finally(() => {
        this.disabledDownLoadExcel = false;
      });
    },
    moduleDownLoad() {
      if (this.multipleSelection && !this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('至少选中一条采购单');
        return;
      }
      this.disabledDownLoad = true;
      let codeArr = [];
      this.multipleSelection.forEach(item => {
        codeArr.push(item.purchaseOrderCode);
      });
      let params = {codes: codeArr.join()};
      let url = '/scm-web/purchase/purchaseDownloadPDF?codes=' + params.codes;
      axios({
        // 用axios发送post请求
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        console.log(res);
        // 处理返回的文件流
        if (res.data.appcode === '0') {
          this.$utils.messagetip.errorTip(res.data.databuffer);
        }
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        // let day = '-' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        const fileName = '采购单.zip'; // 下载文件名称
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }).finally(() => {
        this.disabledDownLoad = false;
        this.getLogInfo();
      });
    },
    currentHeight1(i) {
      this.$nextTick(() => {
        console.log('11313');
        console.log(this.$refs['item_height' + i]);
      });
      return 600;
    },
    // 多选框选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 多选框是否可选
    checkSelectable(row, index) {
      let isSeletc = false;
      if (row.status === '2' || row.status === '8') {
        isSeletc = true;
      }
      return isSeletc;
    },
    uploadFile(fileName) {
      this.$AXIOS.GET('/qinniuPrivate/fileDownload', { fileName }).then(res => {
        console.log(res.result);
        // this.downLoadUrl = res.result;
        // top.window.location.href = res.result;
         window.open(res.result);
      });
    },
    // 获取上传列表数据
    getUploadDataList(code) {
      this.$AXIOS.GET('/qinniuPrivate/uploadFile', { code }).then(res => {
        this.fileDataList = res.result || [];
        // if (this.fileDataList.length) {
        //   this.uploadFile(this.fileDataList[0].uploadFileName);
        // }
      });
    },
    // 点击取消装箱信息
    hideMode() {
      this.isInstallInfo = false;
      this.getBoxInfo(this.code);
    },
    amountChange(i, j) {
      console.log(i);
      console.log(j);
      let obj = this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList[j];
      if (obj.amountPerBox && obj.boxAmount) {
        let value = obj.amountPerBox * obj.boxAmount;
        this.$set(this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList[j], 'amount', value);
      }
    },
    // 获取采购单数据列表
    initDataList() {
      this.$AXIOS
        .LISTGET('/purchase/purchaseOrderPage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result;
          this.totalCount = res.totalCount;
          this.isTableDisabled = false;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              this.detailParams.purchaseOrderCode = this.tableDataList[0].purchaseOrderCode;
              this.detailParams.purchaseStatus = this.tableDataList[0].status;
              // this.getWarehouseNoticeDetail(this.tableDataList[0].id);
              this.getWarehouseNoticeInfo(this.tableDataList[0].id);
              this.getUploadDataList(this.tableDataList[0].purchaseOrderCode);
              this.code = this.tableDataList[0].purchaseOrderCode;
              // this.getBoxInfo(this.tableDataList[0].purchaseOrderCode);
              this.operateParams.entityId = this.tableDataList[0].id;
              this.getLogInfo();
            }, 20);
          } else {
            this.tableRowList = [];
            this.tableRowDetail = [];
            this.boxInfoDetail = [];
            this.logInfoList = [];
            this.fileDataList = [];
            this.logCount = 0;
            this.isTableDisabled = true;
          }
        });
    },
    // 获取采购单明细数据列表
    getWarehouseNoticeDetail(purchaseId) {
      let params = {
        start: 0,
        pageIndex: 0,
        purchaseId
      };
      console.log('object');
      this.$AXIOS.LISTGET('/purchase/purchaseDetail', params).then(res => {
        this.tableRowPrintList = res;
        this.purchaseCount = 0;
        this.tableRowPrintList.forEach(item => {
          this.purchaseCount += item.purchasingQuantity;
        });
      });
    },
    // 获取采购单明细数据详情
    getWarehouseNoticeInfo(id) {
      this.$AXIOS.GET('/purchase/purchaseOrder/' + id).then(res => {
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
      this.$AXIOS.LISTGET('/purchase/purchaseOrderPage', this.detailParams).then(res => {
        console.log('res: ', res);
        this.tableRowList = res.result;
        this.detailCount = res.totalCount;
        // this.purchaseCount = 0;
        // this.tableRowList.forEach(item => {
        //   this.purchaseCount += item.purchasingQuantity;
        // });
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
    // 单据状态列表
    getPurchaseOrderStatus() {
      this.$AXIOS.GET('/select/purchaseOrderStatus').then(res => {
        this.purchaseOrderCodeList = [...this.purchaseOrderCodeList, ...res.result];
      });
    },
    // 采购组列表
    getpurchaseGroupCodeList() {
      this.$AXIOS.GET('/purchase/purchaseGroups', {isAll: '1'}).then(res => {
        this.purchaseGroupCodeList = [...this.purchaseGroupCodeList, ...res.result];
      });
    },
    // 入库状态列表
    getPurchaseType() {
      this.$AXIOS.GET('/select/purchaseType').then(res => {
        this.purchaseTypeList = [...this.purchaseTypeList, ...res.result];
      });
    },
    // 删除接口
    deleteUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/updateState/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 作废接口
    discardUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/updateState/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 冻结接口
    freezeUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/freeze/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 入库通知接口
    warahouseAdvice(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/warahouseAdvice/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 复制接口
    purchaseOrderCopy(row) {
      this.$AXIOS
        .POST('/purchase/purchaseOrderCopy/' + row.purchaseOrderCode)
        .then(res => {
          console.log(res);
          if (res.appcode === '1') {
            this.copyDialogVisible = true;
            this.copyId = res.result;
            this.time = 5;
            let timer2 = null;
            clearInterval(this.timer);
            clearTimeout(timer2);
            this.timer = setInterval(() => {
              this.time = this.time - 1;
            }, 1000);
            timer2 = setTimeout(() => {
              this.copyDialogVisible = false;
            }, 4600);
            this.initDataList();
          } else {
            this.$utils.messagetip.errorTip(res.databuffer);
          }
        });
    },
    // 解冻接口
    disfreezeUpdateState(row) {
      this.$AXIOS
        .PUT('/purchase/purchaseOrder/freeze/' + row.id, row)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.initDataList();
          }, 600);
        });
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    // 获取装箱信息
    getBoxInfo(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/' + code).then(res => {
        this.boxInfoDetail = res.result;
      });
    },
    // 获取物流公司下拉列表
    getLogiisticsInfoList(code) {
      this.$AXIOS.GET('/system/enabled').then(res => {
        this.logiisticsInfoList = res.result;
        if (this.boxInfoDetail.logisticsCorporationName) {
          this.logiisticsInfoList.forEach(item => {
            if (item.logisticsCorporationName === this.boxInfoDetail.logisticsCorporationName) {
              this.form.logiisticsInfo = item.logisticsCode;
            }
          });
        }
      });
    },
    // 获取包装方式下拉列表
    getRestaurantsList(code) {
      this.$AXIOS.GET('/purchaseBoxInfo/dict').then(res => {
        this.restaurantsList = res.result;
      });
    },
    // 装箱信息保存接口
    savePurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/save', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 装箱信息保存接口
    finishPurchaseBoxInfo(params) {
      this.$AXIOS.POST('/purchaseBoxInfo/finish', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        setTimeout(() => {
          this.isInstallInfo = false;
          this.initDataList();
        }, 600);
      });
    },
    // 完成按钮
    finishBtn() {
      let params = {};
      let arrList = [];
      let skuList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox; // 数量
            obj.boxNumber = suppItem.boxNumber; // 箱号
            obj.boxAmount = suppItem.boxAmount; // 箱数
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount; // 数量
            obj.grossWeight = suppItem.grossWeight; // 毛重
            obj.cartonSize = suppItem.cartonSize; // 外箱尺寸
            obj.volume = suppItem.volume; // 体积
            obj.remark = suppItem.remark; // 备注
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        } else {
          skuList.push(rowItem.skuCode);
        }
      });
      // 数据格式校验
      if (!params.packingType) {
        this.$utils.messagetip.warningTip('装箱方式不能为空！');
        return;
      }
      if (skuList && skuList.length) {
        this.$utils.messagetip.warningTip(`sku编号为${skuList}的装箱信息不能为空！`);
        return;
      }
      let isSkuCode = '';
      let isAmountPerBox = false; // 数量
      let isAmountPerBoxInt = false; // 数量
      let isBoxNumber = false; // 箱号
      let isBoxAmount = false; // 箱数
      let isBoxAmountInt = false; // 箱数
      let isGrossWeight = false; // 毛重
      let isGrossWeightFloat = false; // 毛重
      let isCartonSize = false; // 外箱尺寸
      let isCartonSizeSpec = false; // 外箱尺寸
      let isVolume = false; // 体积
      let isVolumeFloat = false; // 体积
      let isIntReg = /^[0-9]+$/; // 正整数
      let isFloatReg = /^[0-9.]+$/;
      let isSpecReg = /^[0-9*]+$/;
      arrList.forEach(item => {
        if (!item.amountPerBox) {
          isSkuCode = item.skuCode;
          isAmountPerBox = true;
        }
        if (!isIntReg.test(item.amountPerBox) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isAmountPerBoxInt = true;
        }
        if (!item.boxNumber && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxNumber = true;
        }
        if (!item.boxAmount && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmount = true;
        }
        if (!isIntReg.test(item.boxAmount) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isBoxAmountInt = true;
        }
        if (!item.grossWeight && !isSkuCode) {
          isSkuCode = item.skuCode;
          isGrossWeight = true;
        }
        console.log(!isFloatReg.test(item.grossWeight) && (item.grossWeight && item.grossWeight.indexOf('.') > -1) && item.grossWeight.split('.')[1] && item.grossWeight.split('.')[1].length > 2 && !isSkuCode);
        if ((!isFloatReg.test(item.grossWeight) || (item.grossWeight && item.grossWeight.indexOf('.') > -1 && item.grossWeight.split('.')[1] && item.grossWeight.split('.')[1].length > 2)) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isGrossWeightFloat = true;
        }
        if (!item.cartonSize && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSize = true;
        }
        if (!isSpecReg.test(item.cartonSize) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isCartonSizeSpec = true;
        }
        if (!item.volume && !isSkuCode) {
          isSkuCode = item.skuCode;
          isVolume = true;
        }
        if ((!isFloatReg.test(item.volume) || (item.volume && item.volume.indexOf('.') > -1 && item.volume.split('.')[1] && item.volume.split('.')[1].length > 4)) && !isSkuCode) {
          isSkuCode = item.skuCode;
          isVolumeFloat = true;
        }
      });
      if (isAmountPerBox) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量不能为空！`);
        return;
      }
      if (isAmountPerBoxInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量只能为正整数！`);
        return;
      }
      if (isBoxNumber) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱号不能为空！`);
        return;
      }
      if (isBoxAmount) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数不能为空！`);
        return;
      }
      if (isBoxAmountInt) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中箱数只能为正整数！`);
        return;
      }
      if (isGrossWeight) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重不能为空！`);
        return;
      }
      if (isGrossWeightFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中毛重格式不正确！`);
        return;
      }
      if (isCartonSize) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸不能为空！`);
        return;
      }
      if (isCartonSizeSpec) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中外箱尺寸只能包含*和数字！`);
        return;
      }
      if (isVolume) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积不能为空！`);
        return;
      }
      if (isVolumeFloat) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中体积格式不正确！`);
        return;
      }
      let isAmountResult = false;
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(item => {
        let amountResult = 0;
        item.purchaseBoxInfoList.forEach(subItem => {
          amountResult += subItem.amountPerBox * subItem.boxAmount;
        });
        if (amountResult !== item.purchasingQuantity * 1 && !isSkuCode) {
          console.log(amountResult);
          console.log(item.purchasingQuantity);
          isAmountResult = true;
          isSkuCode = item.skuCode;
        }
      });
      if (isAmountResult) {
        this.$utils.messagetip.warningTip(`sku编号为${isSkuCode}的装箱信息中数量必须等于采购数量！`);
        return;
      }
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.finishPurchaseBoxInfo(params);
    },
    // 暂存按钮
    saveBtn() {
      let params = {};
      let arrList = [];
      params.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
      params.logisticsCorporationName = '';
      params.logisticsCode = this.form.logiisticsInfo;
      params.packingType = this.state1;
      if (this.form.logiisticsInfo) {
        this.logiisticsInfoList.forEach(item => {
          if (item.logisticsCode === params.logisticsCode) {
            params.logisticsCorporationName = item.logisticsCorporationName;
          }
        });
      }
      // 获取装货信息
      this.boxInfoDetail.purchaseBoxInfoDetailResultVOList.forEach(rowItem => {
        if (rowItem.purchaseBoxInfoList && rowItem.purchaseBoxInfoList) {
          rowItem.purchaseBoxInfoList.forEach(suppItem => {
            let obj = {};
            obj.skuCode = rowItem.skuCode;
            obj.purchaseOrderCode = this.tableRowDetail.purchaseOrderCode;
            obj.amountPerBox = suppItem.amountPerBox;
            obj.boxNumber = suppItem.boxNumber;
            obj.boxAmount = suppItem.boxAmount;
            obj.amount = suppItem.amountPerBox * suppItem.boxAmount;
            obj.grossWeight = suppItem.grossWeight;
            obj.cartonSize = suppItem.cartonSize;
            obj.volume = suppItem.volume;
            obj.remark = suppItem.remark;
            if (suppItem.id) {
              obj.id = suppItem.id;
            }
            arrList.push(obj);
          });
        }
      });
      params.purchaseBoxInfoListJSON = JSON.stringify(arrList);
      console.log(params);
      this.savePurchaseBoxInfo(params);
    },
    // 装箱信息合计
    getComputed(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '-';
          return;
        }
        if (index === 5) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        if (index === 7) {
          sums[index] = '-';
          return;
        }
        data.forEach(item => {
          item.amount = item.amountPerBox * item.boxAmount || 0;
        });
        const values = data.map(item =>
          Number(item[column.property])
        );
        console.log(values);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          if (index !== 0) {
            sums[index] = '-';
          }
        }
      });
      sums.forEach((item, i) => {
        if (item >= 0) {
          sums[i] = Math.round(item * 1000) / 1000;
        }
      });
      console.log(sums);
      return sums;
    },
    // 合计
    getSummaries(param) {
      // console.log(param);
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
        const values = arr.map(item =>
          Number(item[column.property])
        );

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
      sums.forEach((item, i) => {
        if (item >= 0) {
          sums[i] = Math.round(item * 1000) / 1000;
        }
      });
      console.log('sums', sums);
      return sums;
    },
    // 点击删除按钮
    deleteBtn(row) {
      this.$confirm(`删除后数据将不可恢复。`, `您确认要删除吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击作废按钮
    discardBtn(row) {
      this.$confirm(
        `确认后采购单及其相关单据将一并被作废。`,
        `您确认要作废吗?`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.discardUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 入库通知
    warehouseNameNotice(row) {
      this.$confirm(`确认后将产生入库通知单。`, `您确认要入库通知吗?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.warahouseAdvice(row);
          })
          .catch(() => {
            this.$utils.messagetip.infoTip('已取消');
          });
    },
    // 点击冻结按钮
    freezeBtn(row) {
      this.$confirm(`确认后采购单将被冻结。`, `您确认要冻结吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.freezeUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 页码条数改变
    exceptChangeSize(val) {
      this.exceptParams.pageNo = 1;
      this.exceptParams.pageSize = val;
      this.exceptionSkuPage();
    },
    // 当前页码改变
    exceptChangeNumber(val) {
      this.exceptParams.pageNo = val;
      this.exceptionSkuPage();
    },
    // 异常处理
    excepHanding(row) {
      this.isExceptShow = true;
      this.exceptId = row.id;
      this.excepRemark = '';
      this.exceptTableData = [];
      this.exceptTotal = 0;
      this.exceptPurchaseOrderCode = row.purchaseOrderCode;
      this.exceptParams.pageNo = 1;
      this.exceptParams.pageSize = 10;
      this.exceptResult = '1';
      this.exceptionSkuSummary();
      this.exceptionSkuPage();
    },
    exceptionSkuSummary() {
      this.$AXIOS.GET('/purchase/exceptionSkuSummary', {purchaseOrderCode: this.exceptPurchaseOrderCode}).then(res => {
        this.skuLength = res.result.skuNum; // sku数量
        this.diffValueNum = res.result.zpDiff; // 差值
      });
    },
    exceptionSkuPage() {
      this.exceptParams.purchaseOrderCode = this.exceptPurchaseOrderCode;
      this.$AXIOS.LISTGET('/purchase/exceptionSkuPage', this.exceptParams).then(res => {
        this.exceptTableData = res.result;
        this.exceptTotal = res.totalCount;
      });
    },
    radioChange() {
      this.excepRemark = '';
    },
    markSure() {
      if (this.exceptResult === '1' && !this.excepRemark) {
        this.$utils.messagetip.warningTip('请输入处理意见！');
        return;
      }
      this.continueExcept();
    },
    // 处理意见
    continueExcept() {
      let url = '/purchase/finish';
      let params = {};
      if (this.exceptResult === '2') {
        url = '/purchase/continue';
        params = {
          id: this.exceptId
        };
      } else {
        params = {
          id: this.exceptId,
          remark: this.excepRemark
        };
      }
      this.isClick = true;
      this.$AXIOS.POST(url, params).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(res.databuffer);
      }).finally(() => {
        this.isClick = false;
        this.isExceptShow = false;
      });
    },
    // 点击解冻按钮
    disfreezeBtn(row) {
      this.$confirm(`确认后采购单将恢复到冻结前的状态。`, `您确认要解冻吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.disfreezeUpdateState(row);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 点击整行
    tableRowClick(row) {
      this.detailParams.purchaseOrderCode = row.purchaseOrderCode;
      this.detailParams.purchaseStatus = row.status;
      this.getWarehouseNoticeInfo(row.id);
      // this.getWarehouseNoticeDetail(row.id);
      this.getUploadDataList(row.purchaseOrderCode);
      this.code = row.purchaseOrderCode;
      // this.getBoxInfo(row.purchaseOrderCode);
      this.operateParams.entityId = row.id;
      this.getLogInfo();
    },
    // 获取要下载的数据
    downloadPdf() {
      this.printData = [];
      let codeArr = [];
      // this.loading = this.$loading({
      //   // 遮罩对象
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      this.multipleSelection.forEach(item => {
        codeArr.push(item.purchaseOrderCode);
      });
      let params = {codes: codeArr.join()};
      window.open('/scm-web/purchase/purchaseDownloadPDF?codes=' + params.codes, '_self');
      // this.download(codeArr);
      // this.isShow = true;
      // this.$AXIOS.GET('/purchase/purchaseExportPDF', params).then(res => {
      //   loading.close();
      //   this.printData = res.result;
      //   this.getPdf();
      //   console.log(this.printData);
      //   setTimeout(() => {
      //     this.isShow = false;
      //   }, 600);
      // });
      // axios.all(promise).then(
      //   axios.spread((res1, res2) => {
          // loading.close();
          // setTimeout(() => {
            // this.getPdf();
          // }, 10);
        // })
      // );
    },
    download(printArr) {
      let params = {codes: printArr.shift()};
      // this.isShow = true;
      // this.isPrint = false;
      window.open('/scm-web/purchase/purchaseDownloadPDF?codes=' + params.codes, '_self');
      setTimeout(() => {
        if (printArr.length > 0) {
          // this.isPrint = false;
          this.download(printArr);
        }
      }, 1600);
      // this.$AXIOS.GET('/purchase/purchaseExportPDF', params).then(res => {
      //   this.loading.close();
      //   this.printData = res.result;
      //   this.htmlTitle = params.codes;
      //   console.log(this.printData);
      //   let result = [];
      //   let len = Math.ceil((this.printData[0].purchaseDetailList.length - 30) / 50) + 1;
      //   if (this.printData[0].purchaseDetailList.length > 30) {
      //     for (let i = 0; i < len; i++ ) {
      //       if (i === 0) {
      //         this.printData[0].purchaseDetailList0 = this.printData[0].purchaseDetailList.slice(0, 30);
      //         // this.getPdf();
      //       } else {
      //         let num = 50 * (i - 1) + 30;
      //         console.log(this.printData[0].purchaseDetailList.length - num);
      //         if (this.printData[0].purchaseDetailList.length - num >= 50) {
      //           result.push(this.printData[0].purchaseDetailList.slice(num, num + 50));
      //         } else {
      //           result.push(this.printData[0].purchaseDetailList.slice(num, this.printData[0].purchaseDetailList.length));
      //         }
      //         console.log(result);
      //       }
      //     }
      //   } else {
      //     this.printData[0].purchaseDetailList0 = this.printData[0].purchaseDetailList.slice(0, this.printData[0].purchaseDetailList.length);
      //     // this.getPdf();
      //   }
      //   this.printData[0].purchaseDetailList1 = result;
      //   this.getPdf();
      //   setTimeout(() => {
      //     this.isShow = false;
      //     if (printArr.length > 0) {
      //       this.isPrint = false;
      //       this.download(printArr);
      //     }
      //   }, 1600);
      // });
    },
    // 跳转新增页面
    toAddOrEdit(id) {
      if (id === 'add') {
        this.$router.push({path: '/purchaseordermanage/purchaseorderaddoredit/' + id, query: {isadd: 1}});
      } else {
        this.$router.push({path: '/purchaseordermanage/purchaseorderaddoredit/' + id, query: {isadd: 0}});
      }
    },
    addInfo(i) {
      if (this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList && this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList.length) {
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList.push({});
        console.log('111');
      } else {
        this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList = [];
        this.$set(this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[i].purchaseBoxInfoList, 0, {});
        console.log('222');
      }
    },
    // 删除按钮
    deleteListBtn(index, i) {
      this.$confirm(``, `您确认要删除吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
          this.boxInfoDetail.purchaseBoxInfoDetailResultVOList[index].purchaseBoxInfoList.splice(i, 1);
          this.$utils.messagetip.successTip('删除成功');
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
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
    // 筛选条件
    searchFormData() {
      if (
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        skuCode: '', // sku编号
        barCode: '', // sku编号
        purchaseGroupCode: '', // 采购组列表
        purchaseOrderCode: '', // 采购单编号
        supplierName: '', // 供应商名称
        purchaseType: '', // 采购类型
        purchaseName: '', // 采购人
        purchaseStatus: '', // 单据状态
        warehouseNoticeStatus: '', // 入库状态
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 复制按钮
    copy(row) {
      this.$confirm(`确认后将生成一条相同内容的新采购单`, `您确认要复制吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.purchaseOrderCopy(row);
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    toEditBtn() {
      this.toAddOrEdit(this.copyId);
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.initDataList();
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
    // 单据状态翻译
    checkedStatus(status) {
      let statusStr = '';
      if (status === '0') {
        statusStr = '暂存';
      } else if (status === '1') {
        statusStr = '审核驳回';
      } else if (status === '2') {
        statusStr = '审核通过';
      } else if (status === '3') {
        statusStr = '提交审核';
      } else if (status === '6') {
        statusStr = '冻结';
      } else if (status === '7') {
        statusStr = '作废';
      } else if (status === '8') {
        statusStr = '入库通知';
      } else if (status === '9') {
        statusStr = '待重新提交';
      }
      return statusStr;
    },
    // 入库状态翻译
    checkedWarStatus(status) {
      let statusStr = '-';
      if (status === '0') {
        statusStr = '等待入库';
      } else if (status === '1') {
        statusStr = '全部入库';
      } else if (status === '2') {
        statusStr = '部分入库';
      } else if (status === '3') {
        statusStr = '入库异常';
      }
      return statusStr;
    },
    // 完结状态翻译
    checkedfinishStatus(status) {
      let statusStr = '-';
      if (status === '0') {
        statusStr = '未完结';
      } else if (status === '1') {
        statusStr = '处理中';
      } else if (status === '2') {
        statusStr = '已完结';
      }
      return statusStr;
    },
    // 显示装箱信息弹窗
    showInstallInfo() {
      this.getLogiisticsInfoList();
      this.getRestaurantsList();
      this.getBoxInfo(this.code);
      if (this.boxInfoDetail.packingType) {
        this.state1 = this.boxInfoDetail.packingType;
      } else {
        this.state1 = '';
      }
      this.isInstallInfo = true;
    },
    // 自动搜索
    querySearch(queryString, cb) {
      let restaurantsList = this.restaurantsList;
      let results = queryString
        ? restaurantsList.filter(this.createFilter(queryString))
        : restaurantsList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    toPreview(id) {
      this.printData = [];
      this.tableRowPrintList = [];
      this.getWarehouseNoticeDetail(id);
      this.$AXIOS.GET('/purchase/purchaseOrder/' + id).then(res => {
        this.printData.push(res.result);
        this.isPreviewInfo = true;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.purchaseordermanage
  .excep_tip
    line-height: 35px
    .excep_title
      text-align: right
    .excep_content
      padding-left: 20px
  .item
    line-height: 50px
    font-size: 25px
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
  .print_order
    width:780px
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
  .group_btn
    text-align: center
  .paging
    margin-top: 15px
    text-align: right
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
      li.name
        width: 270px
        flex: 0 0 270px
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
  .print_order
    .el-col-6
      height: auto !important
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
</style>
<style lang='stylus'>
.purchaseordermanage
  .el-dialog__body
    padding: 10px 20px
  .price_list
    border: solid 1px #ccc;
    border-top: none;
    tr
      th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(5), th:nth-child(6), th:nth-child(7)
        div::before
          content: '*'
          padding-right: 5px
          color: #ff0000
</style>
