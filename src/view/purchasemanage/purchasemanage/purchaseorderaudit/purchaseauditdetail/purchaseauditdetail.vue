<template>
  <div class="purchaseauditdetail" v-show="isShow">
    <!-- 基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <!-- <el-button v-if="id && id !== 'add'" style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">审核记录</el-button> -->
      </div>
      <div class="info">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">采购单编号：</div>
            <div class="content">{{itemDetail.purchaseOrderCode}}</div>
          </el-col>
          <el-col :span="6" v-if="isFlag">
            <div class="title">审核状态：</div>
            <div class="content" style="color: blue;">{{isAuditStatus === '1' ? '待审核' : '已审核' }}</div>
          </el-col>
          <el-col :span="6">
            <div class=""></div>
          </el-col>
          <el-col :span="6">
            <div class=""></div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">供应商名称：</div>
            <div class="content">{{itemDetail.supplierName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">采购合同：</div>
            <div class="content">{{itemDetail.contractCode}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">归属采购组：</div>
            <div class="content">{{itemDetail.purchaseGroupName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">归属采购人：</div>
            <div class="content">{{itemDetail.purchasePerson}}</div>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">采购类型：</div>
            <div class="content">{{itemDetail.purchaseTypeName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">币制：</div>
            <div class="content">{{itemDetail.currencyTypeName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">付款方式：</div>
            <div class="content">{{itemDetail.payType}}</div>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">收货仓库：</div>
            <div class="content">{{itemDetail.warehouseName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">收货地址：</div>
            <div class="content">{{itemDetail.receiveAddress}}</div>
          </el-col>
          <el-col :span="6">
            <div class=""></div>
          </el-col>
          <el-col :span="6">
            <div class="title">提运单号：</div>
            <div class="content">{{itemDetail.takeGoodsNo}}</div>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">收货人：</div>
            <div class="content">{{itemDetail.receiver}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">收货人手机：</div>
            <div class="content">{{itemDetail.receiverNumber}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">发件人：</div>
            <div class="content">{{itemDetail.sender}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">发件方手机：</div>
            <div class="content">{{itemDetail.senderNumber}}</div>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">发件方省份.城市：</div>
            <div class="content">{{itemDetail.senderProvinceName}}.{{itemDetail.senderCityName}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">发件方详细地址：</div>
            <div class="content">{{itemDetail.senderAddress}}</div>
          </el-col>
          <el-col :span="6">
            <div class=""></div>
          </el-col>
          <el-col :span="6">
            <div class="title ">运输费用承担方：</div>
            <div class="content">{{itemDetail.transportFeeDestIdName}}</div>
          </el-col>
        </el-row>
        <!-- 第七行 -->
        <el-row>
          <el-col :span="6">
            <div class="title ">要求到货日期：</div>
            <div class="content">{{itemDetail.requriedReceiveDate}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">截至到货日期：</div>
            <div class="content">{{itemDetail.endReceiveDate}}</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">处理优先级：</div>
            <div class="content">{{itemDetail.handlerPriorityName}}级</div>
          </el-col>
          <el-col :span="6">
            <div class="title ">采购总金额：</div>
            <div class="content">{{itemDetail.totalFee}}元</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;margin-bottom: 15px;" >
      <el-tab-pane label="商品明细" name="1">
        <div style="text-align: center;margin: 15px 0;"><span>采购总金额：{{totalFeeD}} 元</span> <em style="display: inline-block;margin:0 20px;height: 20px;border-left: 1px solid;width: 1px;vertical-align: middle;"></em> <span>采购总数量：{{purchaseCount}}</span></div>
        <el-table ref="multipleTable" :data="itemDetailList" highlight-current-row border tooltip-effect="dark">
          <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
          <el-table-column label="商品SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="商品SKU编号" prop="skuCode" width="130" align="center"></el-table-column>
          <el-table-column label="规格" prop="specNatureInfo" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="货号" prop="itemNo" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="含税单价(元)" prop="purchasePrice" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="采购税率" prop="taxRate" align="center">
            <template slot-scope="scope">
              {{scope.row.taxRate}}%
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="purchasingQuantity" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="采购总金额(元)" prop="totalPurchaseAmount" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="批次号" prop="batchCode" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="生产编码" prop="produceCode" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="生产日期" prop="productDate" align="center" v-if="isFlag" show-overflow-tooltip></el-table-column>
          <el-table-column label="截止保质日期" prop="expireDate" align="center" v-if="isFlag" show-overflow-tooltip></el-table-column>
          <el-table-column label="理论保质期限(天)" prop="shelfLifeDays" align="center" v-if="isFlag" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="2">
        <el-table :data="fileDataList" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="附件名称" align="center">
            <template slot-scope="scope">
              <div>装箱单</div>
            </template>
          </el-table-column>
          <el-table-column prop="skuName" label="附件内容" align="center">
            <template slot-scope="scope">
              <div class='btn' @click='uploadFile(scope.row.uploadFileName)'>{{scope.row.fileName}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他" name="3">
        <div class="info">
          <el-row>
            <el-col :span="12">
              <div class="title">退换货地址：</div>
              <div class="content">{{itemDetail.goodsReturnAddress}}</div>
            </el-col>
            <el-col :span="12">
              <div class="title">质保期：</div>
              <div class="content">{{itemDetail.guaranteePeriod}}</div>
            </el-col>
          </el-row>
          <el-row :span="20">
            <el-col :span="12">
              <div class="title">纸箱唛头：</div>
              <div class="content" style="height: auto;overflow-y: visible;">
                <el-col :span="12">
                  <div class="paper-box-mark" style="margin-right: 10px;">
                    <span>正唛</span>
                    <ul>
                      <li>
                        <div class="title">箱唛：</div>
                        <div class="content">{{itemDetail.mainMarkBox}}</div>
                      </li>
                      <li>
                        <div class="title">品名：</div>
                        <div class="content">{{itemDetail.mainMarkName}}</div>
                      </li>
                      <li>
                        <div class="title">规格：</div>
                        <div class="content">{{itemDetail.mainMarkSpec}}</div>
                      </li>
                      <li>
                        <div class="title">颜色：</div>
                        <div class="content">{{itemDetail.mainMarkColor}}</div>
                      </li>
                      <li>
                        <div class="title">数量：</div>
                        <div class="content">{{itemDetail.mainMarkNum}}</div>
                      </li>
                      <li>
                        <div class="title">条形码：</div>
                        <div class="content">{{itemDetail.mainMarkBarcode}}</div>
                      </li>
                      <li>
                        <div class="title">箱号：</div>
                        <div class="content">{{itemDetail.mainMarkCn}}</div>
                      </li>
                    </ul>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="paper-box-mark">
                    <span>侧唛</span>
                    <ul>
                      <li>
                        <div class="title">箱唛：</div>
                        <div class="content">{{itemDetail.sideMarkBox}}</div>
                      </li>
                      <li>
                        <div class="title">品名：</div>
                        <div class="content">{{itemDetail.sideMarkName}}</div>
                      </li>
                      <li>
                        <div class="title">条形码：</div>
                        <div class="content">{{itemDetail.sideMarkBarcode}}</div>
                      </li>
                      <li>
                        <div class="title">数量：</div>
                        <div class="content">{{itemDetail.sideMarkNum}}</div>
                      </li>
                      <li>
                        <div class="title">毛重：</div>
                        <div class="content">{{itemDetail.sideMarkWeight}}</div>
                      </li>
                      <li>
                        <div class="title">外箱规格：</div>
                        <div class="content">{{itemDetail.sideMarkSpec}}</div>
                      </li>
                      <li>
                        <div class="title">箱号：</div>
                        <div class="content">{{itemDetail.sideMarkCn}}</div>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="title">验货标准：</div>
              <div class="content" style="height: auto">{{itemDetail.acceptanceStandard}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="ql-snow">
              <div class="title" style="margin-top: 10px;">备注：</div>
              <div class="content ql-editor" v-html="itemDetail.remark" style="height: auto;border:1px solid #dcdfe6;padding: 10px;line-height: normal;">{{itemDetail.remark}}</div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 审核意见 -->
    <el-card class="info">
      <div slot="header" class="clearfix">
        <span>审核信息</span>
      </div>
      <!-- 查看详情时显示： -->
      <el-row v-if="isFlag" style="height: 30px; line-height: 30px;border: solid 1px #ccc">
        <el-col :span="6">
          <div class="title">当前状态：</div>
          <div class="content">{{isAuditStatus === '1' ? '待审核' : '已审核' }}</div>
        </el-col>
        <el-col :span="6">
          <div class="title">当前审核结果：</div>
          <div class="content" v-if="isAuditStatus === '2' || isAuditStatus === '3'" :class="isAuditStatus === '2' ? 'isGreen' : 'isRed'">{{checkedStatus(isAuditStatus)}}</div>
          <div class="content" v-else>无</div>
        </el-col>
        <el-col :span="6">
          <div class="title"></div>
          <div class="content"></div>
        </el-col>
        <el-col :span="6">
          <div class="title"></div>
          <div class="content"></div>
        </el-col>
      </el-row>
      <!-- <el-row v-if="isFlag" style="line-height: 47px;">
        <el-col :span="6">
          <div class="title">审核意见：</div>
          <div class="content">{{itemDetail.auditOpinion}}</div>
        </el-col>
        <el-col :span="6">
          <div class="title"></div>
          <div class="content"></div>
        </el-col>
        <el-col :span="6">
          <div class="title"></div>
          <div class="content"></div>
        </el-col>
        <el-col :span="6">
          <div class="title"></div>
          <div class="content"></div>
        </el-col>
      </el-row> -->
      <el-row v-if="isFlag">
        <el-col :span="6">
          <div class="title">审核记录：</div>
        </el-col>
      </el-row>
      <el-row v-if="isFlag">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="19">
          <el-table :data="logInfoList" style="width: 100%; margin-bottom: 10px" border >
            <el-table-column prop="operation" label="审核结果" align="center"></el-table-column>
            <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
            <el-table-column prop="operateTimeString" label="审核时间" align="center"></el-table-column>
            <el-table-column prop="remark" label="审核意见" align="center">
              <template slot-scope='scope'>
                <div v-html='scope.row.remark'></div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 审核时显示： -->
      <el-row v-if="!isFlag && logInfoList.length">
        <el-col :span="2">
          <div style="text-align: right;">审核记录：</div>
        </el-col>
        <el-col :span="19">
          <el-table :data="logInfoList" style="width: 100%; margin-bottom: 10px" border >
            <el-table-column prop="operation" label="审核结果" align="center"></el-table-column>
            <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
            <el-table-column prop="operateTimeString" label="审核时间" align="center"></el-table-column>
            <el-table-column prop="remark" label="审核意见" align="center">
              <template slot-scope='scope'>
                <div v-html='scope.row.remark'></div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="!isFlag">
        <el-col :span="2">
          <div style="text-align: right;">审核意见：</div>
        </el-col>
        <el-col :span="19">
          <el-input v-if="!purchId" type="textarea" :rows="4" maxlength="1500" placeholder="驳回时必填，最多不超过1500个字符" v-model="textarea">
          </el-input>
          <span v-else>{{textarea}}</span>
        </el-col>
      </el-row>
    </el-card>
    <div class="group_btn" v-if="!purchId">
      <el-button type="primary" size="mini" v-if="isFlag && isAuditStatus === '1'" @click="toPurchaseDetail()">审核</el-button>
      <el-button size="mini" v-if="isFlag" @click="toList">返回</el-button>
      <el-button type="primary" size="mini" v-if="!isFlag" @click="passPurchaseAudit">通过</el-button>
      <el-button type="primary" size="mini" v-if="!isFlag" @click="returnPurchaseAudit">驳回</el-button>
      <el-button size="mini" v-if="!isFlag" @click="toBack">取消</el-button>
    </div>
    <div class="group_btn" v-else>
      <el-button size="mini" v-if="!isFlag" @click="toClose">关闭</el-button>
    </div>
    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <el-table :data="logInfoList" style="width: 100%" border height="400">
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
      <div style="margin: 15px; text-align: center;">
        <el-button type="primary" size="mini" @click="isLogInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  name: 'purchaseauditdetail',
  props: ['purchId', 'status'],
  data() {
    return {
      activeName: '1', // tab框显示
      fileDataList: [], // 上传文件列表
      isShow: true, // 默认显示
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        // operateType: 0,
        entityType: 'PurchaseOrder',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      id: '', // 主键
      isAuditStatus: '', // 审核结果
      isFlag: false, // 显示详情
      itemDetail: {}, // 详情数据
      itemDetailList: [], // 详情数据商品明细
      textarea: '', // 审核意见
      totalFeeD: 0, // 商品明细总金额
      purchaseCount: 0 // 商品明细总数量
    };
  },
  created() {
    this.id = this.purchId || this.$route.params.id;
    console.log(this.id);
    this.operateParams.entityId = this.id;
    if (this.status || this.$route.query.isAuditStatus) {
      this.isAuditStatus = this.status || this.$route.query.isAuditStatus;
    }
    console.log(this.$route);
    if (this.$route.query.flag === '1') {
      this.isFlag = true;
    }
    this.initDetail();
    this.getDetailList();
    this.getLogInfo();
  },
  methods: {
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
    openOperateDialog() {
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
    // 详情信息
    initDetail() {
      this.$AXIOS.GET('/purchase/purchaseOrder/' + this.id).then(res => {
        if (res.appcode === '1') {
          this.itemDetail = res.result;
          this.getUploadDataList(this.itemDetail.purchaseOrderCode);
        }
      });
    },
    // 详情内商品明细
    getDetailList() {
      let params = {
        purchaseId: this.id,
        start: 0,
        pageIndex: 0
      };
      let result = 0;
      let resultCount = 0;
      this.$AXIOS.LISTGET('/purchase/purchaseDetail', params).then(res => {
        this.itemDetailList = res;
        if (this.itemDetailList && this.itemDetailList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.itemDetailList[0]);
          }, 20);
          this.itemDetailList.forEach(item => {
            if (item.purchasePriceD && item.purchasingQuantity) {
              result += item.purchasePriceD * item.purchasingQuantity;
            }
            if (item.purchasingQuantity) {
              resultCount += item.purchasingQuantity * 1;
            }
          });
        }
        this.totalFeeD = result;
        this.purchaseCount = resultCount;
      });
    },
    // 通过/驳回 接口
    putPurchaseOrderAudit(params) {
      this.$AXIOS.PUT('purchase/purchaseOrderAudit', params).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.$router.push({ path: '/purchaseorderaudit' });
          }, 600);
        }
      });
    },
    // 页面翻译字段
    checkedStatus(status) {
      let statusStr = '无';
      if (status === '1') {
        statusStr = '待审核';
      } else if (status === '2') {
        statusStr = '审核通过';
      } else if (status === '3') {
        statusStr = '审核驳回';
      }
      return statusStr;
    },
    // 通过btn
    passPurchaseAudit() {
      let params = {
        purchaseOrderCode: this.itemDetail.purchaseOrderCode,
        payType: this.itemDetail.payType,
        auditOpinion: this.textarea,
        status: '2'
      };
      this.$confirm('', '确认要通过吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putPurchaseOrderAudit(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 驳回btn
    returnPurchaseAudit() {
      let params = {
        purchaseOrderCode: this.itemDetail.purchaseOrderCode,
        payType: this.itemDetail.payType,
        auditOpinion: this.textarea,
        status: '3'
      };
      if (!params.auditOpinion) {
        this.$utils.messagetip.warningTip('审核意见不能为空');
        return;
      }
      this.$confirm('', '确认要驳回吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putPurchaseOrderAudit(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 跳转审核页面
    toPurchaseDetail() {
      this.isFlag = false;
    },
    // 返回列表
    toList() {
      this.$router.push({ path: '/purchaseorderaudit' });
    },
    // 取消返回
    toBack() {
      this.$router.push({ path: '/purchaseorderaudit' });
    },
    toClose() {
      this.$emit('purseClose');
    }
  }
};
</script>
<style lang="stylus" scoped>
.purchaseauditdetail
  .el-card,.el-tabs
    margin-bottom: 15px
    .title, .content
      display: inline-block
      line-height: 30px
    .title
      width: 150px
      text-align: right
      width: 30%
      text-align: right
      vertical-align: top
    .content
      width: 69%
      height: 47px
      overflow-y: auto
  .el-tabs
    .title
      width: 120px;
    .content
      width: 80%;
  .group_btn
    text-align: center
    margin: 20px 0
  .paging
    margin-top: 15px
    text-align: right
  .btn
    color: blue
    cursor: pointer
  .isGreen
    color green
  .isRed
    color red
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
      .content,.title
        height: 45px;
        line-height: 45px;
      .title
        border-right: 1px solid #dcdfe6
        text-align: center
        width: 100px
      .content
        width: 60%
</style>
