<template>
  <div class="otherdetail">
        <div v-if="editOrDetail">其他出入库审核详情</div>
        <div v-else>其他出入库审核</div>
        <div class="title">基本信息</div>
        <el-form label-width="125px" size="mini">
            <el-form-item label="其他出入库编号：">
                {{ searchParams.outInCode }}
            </el-form-item>
            <el-form-item label="出入库类型：">
                <span v-show="searchParams.outInType == '1'">其他入库</span>
                <span v-show="searchParams.outInType == '2'">其他出库</span>
            </el-form-item>
            <el-form-item label="仓库名称：">
                {{ searchParams.warehouseName }}
            </el-form-item>
            <el-form-item label="入库/出库原因：">
                {{ searchParams.outInCause }}
            </el-form-item>
            <el-form-item label="备注：">
                {{ searchParams.remark }}
            </el-form-item>
            <div class="title" >收发件人信息</div>
            <!-- 第一行 -->
            <el-row v-if='searchParams.outInType === "1"'>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1" style="width: 25%">发件人：</div>
                <div class="content">{{searchParams.sender}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">发件方手机：</div>
                <div class="content">{{searchParams.senderMobile}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">发件方省份.城市.地区：</div>
                <div class="content">{{searchParams.senderProvinceName}}.{{searchParams.senderCityName}}.{{searchParams.senderAreaName}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">发件方详细地址：</div>
                <div class="content">{{searchParams.senderAddress}}</div>
              </el-col>
            </el-row>
            <!-- 第二行 -->
            <el-row v-if='searchParams.outInType === "2"'>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">收件人：</div>
                <div class="content">{{searchParams.receiver}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">收件方手机：</div>
                <div class="content">{{searchParams.receiverMobile}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">收件方省份.城市.地区：</div>
                <div class="content">{{searchParams.receiverProvinceName}}.{{searchParams.receiverCityName}}.{{searchParams.receiverAreaName}}</div>
              </el-col>
              <el-col :span="6" style="height: auto;line-height: 30px;">
                <div class="title1">收件方详细地址：</div>
                <div class="content">{{searchParams.receiverAddress}}</div>
              </el-col>
            </el-row>
            <div class="title">商品明细</div>
            <el-table :data="searchParams.outInOrderDetailList" border style="width: 100%">
                <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
                <el-table-column align="center" prop="skuName" label="SKU名称" > </el-table-column>
                <el-table-column align="center" prop="skuCode" label="SKU编号" > </el-table-column>
                <el-table-column align="center" prop="barCode" label="条形码" > </el-table-column>
                <el-table-column align="center" prop="" label="库存类型" >
                    <template slot-scope="scope">
                        <span v-show="scope.row.inventoryType == '1'">正品</span>
                        <span v-show="scope.row.inventoryType == '2'">残品</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="searchParams.outInType == '2'" align="center" prop="inventoryNum" :label="searchParams.auditStatus == 1 ? '当前可用库存' : '审核时可用库存'" >
                    <template slot-scope="scope" >
                        <div v-if="searchParams.auditStatus == 1 && scope.row.inventoryNum !== '' && scope.row.inventoryNum !== null" :style="scope.row.inventoryNum*1 < scope.row.planOutInNum ? 'background:red;color:#ffffff' : ''">{{ scope.row.inventoryNum }}</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="planOutInNum" :label="searchParams.outInType == '1' ? '入库数量': '出库数量'" > </el-table-column>
                <el-table-column align="center" prop="inPrice" label="入库单价（元）" v-if="searchParams.outInType == '1'">
                  <template slot-scope="scope" >
                    <div v-if="scope.row.priceFlag === '0'">{{scope.row.inPrice}}</div>
                    <div v-if="scope.row.priceFlag === '1'">等于仓内成本金额</div>
                  </template>
                </el-table-column>
            </el-table>
            <div class="title radiut">审核信息</div>
            <div v-show="!editOrDetail">
                <el-form-item v-if="searchParams.auditLogs && searchParams.auditLogs.length" label="审核记录：">
                    <el-table :data="searchParams.auditLogs" border style="width: 100%">
                        <el-table-column align="center" prop="auditResult" label="审核结果" ></el-table-column>
                        <el-table-column align="center" prop="auditOperator" label="审核人" > </el-table-column>
                        <el-table-column align="center" prop="auditTime" label="审核时间" > </el-table-column>
                        <el-table-column align="center" prop="auditOpinion" label="审核意见" > </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="审核意见：">
                    <el-input v-model="auditOpinion" maxlength="500" type="textarea"></el-input>
                    驳回时必填,最多不超过500个字符
                </el-form-item>
                <div style="text-align:center;">
                    <el-button size="mini" :disabled="disableBtn || disableBtn1" @click="confirm('0')" type="primary">通过</el-button>
                    <el-button size="mini" :disabled="disableBtn1" @click="confirm('1')" type="primary">驳回</el-button>
                    <el-button @click="back()" size="mini">取消</el-button>
                </div>
            </div>
            <div v-show="editOrDetail">
                <ul class="audit_status">
                    <li>
                        <span>当前状态：</span>
                        <span v-show="searchParams.auditStatus == 1">待审核</span>
                        <span v-show="searchParams.auditStatus == 2">已审核</span>
                    </li>
                    <li>
                        <span>当前审核结果：</span>
                        <span v-if="searchParams.auditResult === '审核通过'" style="color:rgb(0, 153, 0);">{{ searchParams.auditResult }}</span>
                        <span v-else-if="searchParams.auditResult === '审核驳回'" style="color:rgb(255, 0, 0);">{{ searchParams.auditResult }}</span>
                        <span v-else>{{ searchParams.auditResult }}</span>
                    </li>
                </ul>
                <div style="padding: 10px 0">审核记录：</div>
                <el-table :data="searchParams.auditLogs" border style="width: 100%">
                    <el-table-column align="center" prop="auditResult" label="审核结果" ></el-table-column>
                    <el-table-column align="center" prop="auditOperator" label="审核人" > </el-table-column>
                    <el-table-column align="center" prop="auditTime" label="审核时间" > </el-table-column>
                    <el-table-column align="center" prop="auditOpinion" label="审核意见" > </el-table-column>
                </el-table>
                <div style="text-align:center; margin:20px 0">
                    <el-button v-if="searchParams.auditStatus == 1" size="mini" @click="toAudit" type="primary">审核</el-button>
                    <el-button @click="back()" size="mini">返回</el-button>
                </div>
            </div>
        </el-form>

  </div>
</template>
<script>
    export default {
        name: 'otherdetail',
        data() {
            return {
                searchParams: {

                },
                tableData: [],
                code: this.$route.params.id,
                editOrDetail: this.$route.query.flag ? this.$route.query.flag : false,
                auditOpinion: '',
                disableBtn: false,
                disableBtn1: false
            };
        },
        mounted: function() {
            this.initDetailData();
        },
        methods: {
            toAudit() {
               this.editOrDetail = false;
            },
            back() {
                this.$router.push({
                    path: '/otheraudit'
                });
            },
            initDetailData() {
                this.$AXIOS.GET('/OtherOutIn/query_detail/' + this.code).then(res => {
                    this.searchParams = res.result;
                    this.searchParams.outInOrderDetailList.map(item => {
                        if (item.inventoryNum < item.planOutInNum && this.searchParams.outInType === '2') {
                            this.auditOpinion = '当前可用库存不足！';
                            this.disableBtn = true;
                        }
                    });
                });
            },
            confirm(flag) {
                if (flag === '1' && !this.auditOpinion) {
                    this.$utils.messagetip.warningTip('请填写审核意见');
                    return;
                }
                let data = {
                    auditOpinion: this.auditOpinion,
                    flag
                };
                this.disableBtn1 = true;
                this.$AXIOS.PUT('/OtherOutIn/audit/' + this.code, data, true).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    this.back();
                }).finally(() => {
                    this.disableBtn1 = false;
                });
            }
        }
    };
</script>
<style lang="stylus" scoped>
    .otherdetail
        .title1, .content
          display: inline-block
          line-height 23px
        .title1
          text-align: right
          width: 30%
          text-align right
          vertical-align top
        .content
          width: 69%
          height: 47px
          overflow-y: auto
        .title
            background-color #f5f7fa;
            color #909399
            padding 10px
            font-size 14px
            margin 10px 0
        .title.radiut
            color #409eff
            background-color #ecf8ff
        .audit_status
            display flex
            padding 10px
            margin 20px 0 10px 0
            border solid 1px #999
            li
                padding-right 50px
</style>
