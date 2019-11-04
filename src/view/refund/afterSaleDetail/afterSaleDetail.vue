<template>
    <div class="afterSaleDetail">
        <div class="title">基本信息</div>
        <el-form class="detail_from"  label-width="125px">
            <el-form-item label="售后单状态：">
                {{changeStatus(tableData.afterSaleOrder.status)}}
            </el-form-item>
            <el-form-item label="售后类型：">
                <span v-show="tableData.afterSaleOrder.afterSaleType == 1">退货</span>
                <span v-show="tableData.afterSaleOrder.afterSaleType == 0">取消发货</span>
                <span v-show="tableData.afterSaleOrder.afterSaleType == 2">换货</span>
                <span v-show="tableData.afterSaleOrder.afterSaleType == 3">维修</span>
            </el-form-item>
            <el-form-item label="用户地址：">
                {{tableData.afterSaleOrder.senderProvince}} - {{tableData.afterSaleOrder.senderCity}} - {{tableData.afterSaleOrder.senderDistrict }} - {{tableData.afterSaleOrder.senderAddress}}  {{ tableData.afterSaleOrder.sender }}  {{ tableData.afterSaleOrder.senderNumber }}
            </el-form-item>
            <!-- <el-form-item label="会员名：">
                {{tableData.afterSaleOrder.userName}}
            </el-form-item> -->
            <el-form-item label="销售渠道：">
                {{tableData.afterSaleOrder.sellName}}
            </el-form-item>
            <el-form-item label="店铺名称：">
                {{tableData.afterSaleOrder.shopName}}
            </el-form-item>
            <el-form-item label="退货仓/店：">
                {{tableData.afterSaleOrder.returnWarehouseName}}
            </el-form-item>
            <el-form-item label="退货地址：" v-if="tableData.afterSaleOrder.returnWarehouseCode != 'JD'">
                {{tableData.afterSaleOrder.receiverProvince}} - {{tableData.afterSaleOrder.receiverCity}} - {{tableData.afterSaleOrder.receiverDistrict }} - {{tableData.afterSaleOrder.receiverAddress }}
            </el-form-item>
            <el-form-item label="退货地址：" v-else>
                {{tableData.afterSaleOrder.serviceAfterSaleAddress}}&nbsp;&nbsp;{{tableData.afterSaleOrder.serviceAfterSaleLinkMan}}&nbsp;&nbsp;{{tableData.afterSaleOrder.serviceAfterSaleTel }} 
            </el-form-item>
            <el-form-item label="创建时间：">
                {{tableData.afterSaleOrder.createTime}}
            </el-form-item>
            <el-form-item label="售后单编号：">
                {{tableData.afterSaleOrder.afterSaleCode}}
                <Copy :msg="tableData.afterSaleOrder.afterSaleCode"></Copy>
            </el-form-item>
            <el-form-item label="系统订单号：">
                {{tableData.afterSaleOrder.scmShopOrderCode}}
                <Copy :msg="tableData.afterSaleOrder.scmShopOrderCode"></Copy>
            </el-form-item>
            <el-form-item label="渠道订单号：">
                {{tableData.afterSaleOrder.shopOrderCode}}
                <Copy :msg="tableData.afterSaleOrder.shopOrderCode"></Copy>
            </el-form-item>
            <el-form-item label="外部服务单编号：">
                <div v-if="tableData.afterSaleOrder.afsServiceId">
                    {{tableData.afterSaleOrder.afsServiceId}} 
                    <Copy :msg="tableData.afterSaleOrder.afsServiceId"></Copy>
                </div>
                <div v-else> - </div>
            </el-form-item>
        </el-form>
        <div class="title">商品信息</div>
        <el-table :data="tableData.afterSaleOrderDetailList" border style="width: 100%">
            <el-table-column align="center" type="index" prop="date" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="picture" label="商品图片">
                <template slot-scope="scope">
                    <img  style="width:70px;height:70px; padding:10px 10px" :src="scope.row.picture"/>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="skuName"  label="SKU名称">
                <template slot-scope="scope">
                    <span  style="color:#409eff; cursor:pointer" type="text" @click="toShopDetail(scope.row)">{{ scope.row.skuName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="skuCode" label="SKU编号"> </el-table-column>
            <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
            <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
            <el-table-column align="center" prop="deliverWarehouseName" label="发货仓/店"> </el-table-column>
            <el-table-column align="center" prop="inNum" label="正品入库数量"> </el-table-column>
            <el-table-column align="center" prop="defectiveInNum" label="残品入库数量"> </el-table-column>
            <el-table-column align="center" prop="returnNum" label="拟退货数量"> </el-table-column>
            <el-table-column align="center" prop="refundAmont" label="退款金额(元)"> </el-table-column>
        </el-table>
        <div class="title">申请信息</div>
        <el-form class="detail_from"  label-width="125px">
            <el-form-item label="图片：">
                <template >
                    <img v-if="imgSrc.length"  :key="index" v-for="(data, index) in imgSrc"  style="width:50px; height:50px; margin: 0 5px;"  :src="httpSorce+data"/>
                </template>
            </el-form-item>
            <el-form-item label="售后单备注：">
                {{ tableData.afterSaleOrder.memo }}
            </el-form-item>
            <el-form-item label="物流公司：">
                {{ tableData.afterSaleOrder.logisticsCorporation }}
            </el-form-item>
            <el-form-item label="物流单号：">
                {{ tableData.afterSaleOrder.waybillNumber }}
            </el-form-item>
            <el-form-item label="运费金额：">
                {{ tableData.afterSaleOrder.postFee !== null ? tableData.afterSaleOrder.postFee : '-' }}
            </el-form-item>
        </el-form>
        <div class="title">退款信息</div>
        <el-form class="detail_from"  label-width="125px">
            <el-form-item label="支付单号：">
                {{ tableData.afterSaleOrder.jdPayId ? tableData.afterSaleOrder.jdPayId : '-' }}
            </el-form-item>
            <el-form-item label="支付方式：">
                <span v-if="tableData.afterSaleOrder.jdPayType == 6">在线支付</span>
                <span v-else-if="tableData.afterSaleOrder.jdPayType == 56">和包支付</span>
                <span v-else> - </span>
            </el-form-item>
            <el-form-item label="退款金额：">
                {{ tableData.afterSaleOrder.jdRefundAbleAmount ? tableData.afterSaleOrder.jdRefundAbleAmount : '-' }}
            </el-form-item>
            <el-form-item label="支付时间：">
                {{ tableData.afterSaleOrder.jdPayTime ? tableData.afterSaleOrder.jdPayTime : '-'}}
            </el-form-item>
        </el-form>
        <div class="title">日志信息</div>
        <div>
            <operate-table :url="'/logInfoPage'" :entityId="entityId" v-if="operateParams.entityId"  :params="operateParams"></operate-table>
        </div>
        <div style="text-align:center; padding: 20px 0">
            <el-button type="" @click="back" size="mini">返回</el-button>
        </div>
    </div>
</template>
<script>
import Copy from '@/components/copy';
import operateTable from '@/components/operateTable';
import qs from 'qs';
export default {
    data() {
        return {
            tableData: {
                afterSaleOrder: ''
            },
            operateParams: {
                entityId: '',
                entityType: 'afterSaleOrder'
            },
            id: this.$route.params.id,
            backLastRouter: this.$route.query.backLastRouter,
            entityId: '',
            imgSrc: [],
            httpSorce: 'https://scm.trc.com/'
        };
    },
    components: {
        operateTable,
        Copy
    },
    mounted: function() {
        this.operateParams.entityId = this.entityId = this.id;
        this.initData();
    },
    methods: {
        back() {
            if (this.backLastRouter) {
                this.$router.go(-1);
            } else {
                this.$router.push({path: '/afterSale'});
            }
        },
        initData() {
            this.$AXIOS.GET('/afterSaleOrder/orderDetail/' + this.id).then(res => {
                this.tableData = res.result;
                console.log(res.result);
                if (res.result.afterSaleOrder.picture && res.result.afterSaleOrder.picture.indexOf('https') > -1) {
                    this.httpSorce = '';
                }
                this.imgSrc = res.result.afterSaleOrder.picture ? res.result.afterSaleOrder.picture.split(',') : [];
                // for (let i = 0; i < this.imgSrc.length; i++) {
                //     if(this.imgSrc[i].indexOf('http'))
                // }
                // console.log(this.imgSrc);
            });
        },
        toShopDetail(row) {
            // let config = {};
            // if (row.skuCode.indexOf('SP0') > -1) {
            //     let obj = {
            //         spuCode: row.spuCode,
            //         skuCode: row.skuCode
            //     };
            //     // 自营
            //     config = {
            //         title: '商品详情',
            //         href: 'goods/goodsSkuDetail.html?' + qs.stringify(obj)
            //     };
            // } else {
            //     let obj = {
            //         flag: 1,
            //         isClose: true,
            //         hideLogs: true,
            //         skuCode: row.skuCode
            //     };
            //     // 代发
            //     config = {
            //         title: '商品详情',
            //         href: 'goods/externalGoodsDetail.html?' + qs.stringify(obj)
            //     };
            // }
            // top.window.addTab(config);
            let config = {};
            if (row.skuCode.indexOf('SP0') > -1) {
                this.$router.push({
                    name: 'goodsquerydetail',
                    params: {
                        id: row.spuCode,
                        skuCode: row.skuCode
                    },
                    query: {
                        backLastRouter: true
                    }
                });
                // this.$store.dispatch('selectChannel/setMuneTab', {
                //     title: '商品查询',
                //     route: '/goodsquery'
                // });
            } else {
                this.$router.push({
                    name: 'undertakesgoodDetail',
                    params: {
                        id: row.skuCode
                    },
                    query: {
                        backLastRouter: true,
                        opeId: row.id
                    }
                });
                // this.$store.dispatch('selectChannel/setMuneTab', {
                //     title: '商品查询',
                //     route: '/goodsquery'
                // });
            }
        },
        changeStatus(str) {
            if (str === 0) {
                return '待客户发货';
            } else if (str === 1) {
                return '客户已发货';
            } else if (str === 2) {
                return '已完成';
            } else if (str === 3) {
                return '已关闭';
            } else if (str === 4) {
                return '申请中';
            } else if (str === 5) {
                return '申请失败';
            } else if (str === 6) {
                return '通知仓库失败';
            } else if (str === 7) {
                return '仓库已收货';
            }
        }
    }
};
</script>
<style lang="stylus" scoped>
    .afterSaleDetail
        .title
            background-color #ecf8ff
            padding 10px
            margin 10px 0
            font-size 14px
        .detail_from
            .el-form-item
                margin-bottom 0px

</style>
<style>
.afterSaleDetail .detail_from .el-form-item__label{
   font-weight: 800;
   color: #000;
   font-size: 13px;
}
</style>



