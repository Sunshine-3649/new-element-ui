<template>
  <div class="returnordeauditdetail">
   <!-- 基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button @click="openOperate" style="float: right; padding: 3px 0" type="text">审核记录</el-button>
      </div>
      <div class="info">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">采购退货单编号：</div>
            <div class="content">{{ searchParams.purchaseOutboundOrderCode }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">单据类型：</div>
            <div class="content">{{ checkedBillType(searchParams.billType) }}</div>
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
            <div class="title">供应商名称：</div>
            <div class="content">{{ searchParams.supplierName }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">退货仓库：</div>
            <div class="content">{{ searchParams.warehouseName }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">退货类型：</div>
            <div class="content">{{ searchParams.returnOrderType === '1' ? '正品' : '残品' }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">提货方式：</div>
            <div class="content">{{ pickType(searchParams.pickType) }}</div>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">退货收货人：</div>
            <div class="content">{{ searchParams.receiver }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">收货人手机：</div>
            <div class="content">{{ searchParams.receiverNumber }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">退货省份.城市.地区：</div>
            <div v-if="searchParams.receiverAreaName" class="content">{{ searchParams.receiverProvinceName}}-{{searchParams.receiverCityName}}-{{searchParams.receiverAreaName }}</div>
            <div v-else class="content">{{ searchParams.receiverProvinceName}}-{{searchParams.receiverCityName }}</div>
          </el-col>
          <el-col :span="6">
            <div class="title">退货详细地址：</div>
            <div class="content">{{ searchParams.receiverAddress }}</div>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">退货总金额：</div>
            <div class="content">{{ searchParams.totalFee }}元</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="title">退货说明：</div>
            <div class="content">{{ searchParams.returnPolicy }}</div>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row>
          <el-col :span="6">
            <div class="title">备注：</div>
            <div class="content">{{ searchParams.remark }}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 商品明细 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>退货商品明细</span>
      </div>
      <el-table ref="multipleTable" :data="searchParams.purchaseOutboundDetailList" highlight-current-row border tooltip-effect="dark">
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="商品SKU名称" prop="skuName" align="center"></el-table-column>
        <el-table-column label="商品SKU编号" prop="skuCode" align="center"></el-table-column>
        <el-table-column label="规格" prop="specNatureInfo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="brandName" align="center"></el-table-column>
        <el-table-column label="库存类型" prop="address" align="center" width="200">
            <template slot-scope="scope">
                {{ scope.row.returnOrderType === '1' ? '正品' : '残品' }}
            </template>
        </el-table-column>
        <el-table-column  :label="searchParams.auditStatus === '1' ? '当前可退数量' : '审核时可退数量'" prop="canBackQuantity" align="center">
            <template  slot-scope="scope">
                <div v-if="flag">
                    <div v-if="searchParams.auditStatus === '1'">{{ scope.row.canBackQuantity }}</div>
                    <div v-else-if="searchParams.auditStatus === '2' || searchParams.auditStatus === '3'">{{ scope.row.auditQuantity }}</div>
                </div>
                <div v-else>
                     <div v-if="scope.row.canBackQuantity < scope.row.outboundQuantity " style="background-color:red; color:#fff;">{{ scope.row.canBackQuantity }}</div>
                     <div v-else> {{ scope.row.canBackQuantity }}</div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="退货数量" prop="outboundQuantity" align="center">
        </el-table-column>
        <el-table-column label="含税退货单价(元)" prop="price" align="center"></el-table-column>
        <el-table-column label="退货税率" prop="taxRate" align="center">
            <template slot-scope="scope">
                {{ scope.row.taxRate }} %
            </template>
        </el-table-column>
        <el-table-column label="退货总金额(元)" prop="totalAmount" align="center"></el-table-column>
      </el-table>
    </el-card>
    <!-- 审核意见 -->
    <el-card class="info">
        <div slot="header" class="clearfix">
            <span>审核信息</span>
        </div>
      <!-- 审核时显示： -->
      <el-row v-if="!flag">
        <el-col style="margin-right:20px;"  :span="2">
          <div style="text-align:right" class="">审核意见：</div>
        </el-col>
        <el-col :span="18">
          <el-input v-model="searchParams.auditOpinion" type="textarea" :rows="4" placeholder="请输入内容" >
          </el-input>
          <div style="padding-top:8px;">驳回时必填，最多不超过1500个字符</div>
        </el-col>
      </el-row>
      <template v-else>
            <el-row>
                <el-col style="margin-right:20px;"  :span="2">
                    <div  style="text-align:right" class="">审核结果：</div>
                </el-col>
                <el-col v-if="searchParams.auditStatus === '1'" :span="18">
                    待审核
                </el-col>
                <el-col v-else-if="searchParams.auditStatus === '2'" :span="18">
                    审核驳回
                </el-col>
                <el-col v-else-if="searchParams.auditStatus === '3'" :span="18">
                    审核通过
                </el-col>
            </el-row>
            <el-row v-show="searchParams.auditStatus !== '1' " style="padding-top:20px;">
                <el-col style="margin-right:20px;"  :span="2">
                    <div style="text-align:right"  class="">审核意见：</div>
                </el-col>
                <el-col :span="18">
                    {{searchParams.auditOpinion}}
                </el-col>
            </el-row>
      </template>

    </el-card>
    <div class="group_btn">
        <template v-if="flag">
             <el-button v-show="searchParams.auditStatus === '1'" type="primary" @click="toReviewPage" :disabled="isDisabled" size="mini">审核</el-button>
        </template>
        <template v-else>
            <el-button type="primary" @click="review(3)" :disabled="isDisabled" size="mini">通过</el-button>
            <el-button type="primary" @click="review(2)" size="mini">驳回</el-button>
        </template>
        <el-button @click="back" size="mini">返回</el-button>
    </div>
     <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>

<script>
import operateTable from '@/components/operateTable';
export default {
    name: 'returnordeauditdetail',
    data() {
        return {
            dialogVisibleTable: false, // 日志弹窗
            operateParams: {
                entityId: '',
                entityType: 'purchaseOutboundOrder',
                operateType: true   // 为true时意思是不需要operateType参数
            },
            isRefresh: 0,
            searchParams: {
                purchaseOutboundOrderCode: '', // 采购退货单编号
                supplierCode: '', // 供应商code
                warehouseInfoId: '', //  仓库id
                returnOrderType: '', // 退货类型
                auditStatus: '' // 审核状态
            },
            textarea: '', // 审核意见
            tableData: [],
            id: this.$route.params.id,
            flag: this.$route.params.flag,
            isDisabled: false
        };
    },
    mounted: function() {
        if (this.flag) {
            this.initTableData(this.id);
        } else {
            this.editInitTableData(this.id);
        }
    },
    components: {
        operateTable
    },
    methods: {
      checkedBillType(billType) {
          if (billType === 1) {
              return '实退';
          } else if (billType === 2) {
              return '修正';
          }
        },
        pickType(str) {
            if (str === '1') {
                return '到仓自提';
            } else if (str === '2') {
                return '京东配送';
            } else if (str === '3') {
                return '其他物流';
            }
        },
        back() {
            this.$router.push({path: '/purchreturnordeaudit'});
        },
        // 关闭日志弹窗
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        // 打开弹窗
        openOperate() {
            this.dialogVisibleTable = true;
            this.isRefresh += 1;
        },
        // 前往审核
        toReviewPage() {
            this.flag = '';
            this.editInitTableData(this.id);
        },
        // 审核
        review(str) {
            if (str === 2 && !this.searchParams.auditOpinion) {
                this.$utils.messagetip.warningTip('审核意见不能为空');
                return;
            }
            let data = {
                id: this.id,
                auditStatus: str,
                auditOpinion: this.searchParams.auditOpinion
            };
            this.$AXIOS.JSONPUT('/purchaseOutboundOrder/audit', data, true).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                setTimeout(() => {
                    this.$router.push({path: '/purchreturnordeaudit'});
                }, 500);
            });
        },
        // 去详情调的接口
        initTableData(id) {
            this.operateParams.entityId = this.id;
            this.$AXIOS.GET('/purchaseOutboundOrder/getOrder/' + id ).then(res => {
                this.searchParams = res.result;
                // res.result.purchaseOutboundDetailList.map((item, index) => {
                //     if (item.canBackQuantity < item.outboundQuantity) {
                //         this.isDisabled = true;
                //         this.searchParams.auditOpinion = '当前可退数量不足！';
                //     }
                // });
            });
        },
        // 去编辑调的接口
        editInitTableData(id) {
            this.operateParams.entityId = this.id;
            this.$AXIOS.GET('/purchaseOutboundOrder/getAudit/' + id ).then(res => {
                this.searchParams = res.result;
                res.result.purchaseOutboundDetailList.map((item, index) => {
                    if (item.canBackQuantity < item.outboundQuantity) {
                        this.isDisabled = true;
                        this.searchParams.auditOpinion = '当前可退数量不足！';
                    }
                });
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
.returnordeauditdetail
  .el-card
    margin-bottom: 15px
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
</style>


