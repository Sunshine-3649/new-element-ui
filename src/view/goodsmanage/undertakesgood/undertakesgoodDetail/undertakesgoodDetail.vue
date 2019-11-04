<template>
    <div class="undertakesgoodDetail">
        <div class="title"><span>一件代发商品信息</span><span @click="dialogVisibleTable = true" style="cursor:pointer">操作日志</span></div>
        <el-form label-width="140px">
            <el-row :span="24">
                <el-col :span="8">
                    <el-form-item label="商品SKU编号：">
                        {{ mainData.skuCode }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="供应商名称：">
                        {{ mainData.supplierName }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="供应商商品状态：">
                        <span v-show="mainData.state == 0">下架</span>
                        <span v-show="mainData.state == 1">上架</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="供应商编号：">
                        {{ mainData.supplierCode }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="供应商商品SKU编号：">
                        {{ mainData.supplierSkuCode }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="24">
                    <el-form-item label="商品名称：">
                        {{ mainData.itemName }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="商品副名称：">
                        {{ mainData.subtitle }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="属性：">
                        {{ mainData.properties }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="品牌：">
                        {{ mainData.brand }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="分类：">
                        {{ mainData.category }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="进货价(元)：">
                        {{ mainData.supplyPrice }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="市场价(元)：">
                        {{ mainData.marketReferencePrice }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="供应商售价(元)：">
                        {{ mainData.supplierPrice }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="条形码：">
                        {{ mainData.barCode }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="产地：">
                        {{ mainData.producingArea }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="发货地：">
                        {{ mainData.placeOfDelivery }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="重量(KG)：">
                        {{ mainData.weight }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="商品类型：">
                        {{ mainData.itemType }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="商品关税税率：">
                       {{ mainData.tariff }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="仓库名：">
                        {{ mainData.warehouse }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="24">
                    <el-form-item label="商品主图：">
                        <img @click="openImg(data)" style="width:60px; height:60px;cursor:pointer;" v-for="(data, index) in mainData.mainPictrue" :key="index"  :src="imgSrc+data" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="24">
                    <el-form-item label="商品详情图：">
                        <img @click="openImg(data)" style="width:60px; height:60px; margin-right:10px;cursor:pointer;" v-for="(data, index) in mainData.detailPictrues" :key="index"  :src="imgSrc+data" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="24">
                    <el-form-item label="商品详情文本：">
                        {{ mainData.detail }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="当前库存：">
                        {{ mainData.stock }}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="最小购买量：">
                        {{ mainData.minBuyCount }}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="text-align:center; padding-top:20px;">
            <el-button type="" @click="back" size="mini">返回</el-button>
        </div>
         
         <!-- 操作日志 -->
         <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
              <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams"></operate-table>
         </el-dialog>
    </div>
</template>
<script>
  import operateTable from '@/components/operateTable';
  export default {
    name: 'undertakesgoodDetail',
    data() {
        return {
            dialogVisibleTable: false,
            operateParams: {
                entityId: '',
                entityType: 'ExternalItemSku',
                operateType: true
            },
            skuCode: this.$route.params.id,
            backLastRouter: this.$route.query.backLastRouter,
            mainData: '',
            imgSrc: 'http://img13.360buyimg.com/n12/'
        };
    },
    components: {
        operateTable
    },
    mounted: function() {
        this.operateParams.entityId = this.$route.query.opeId;
        this.initData();
    },
    methods: {
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        initData() {
            this.$AXIOS.GET('/goods/externalItemSkus', {skuCode: this.skuCode}).then(res => {
                this.mainData = res.result ? res.result[0] : '';
                if (this.mainData.detailPictrues.charAt(this.mainData.detailPictrues.length - 1) === ',') {
                   this.mainData.detailPictrues = this.mainData.detailPictrues.substr(0, this.mainData.detailPictrues.length - 1);
                }
                if (this.mainData.mainPictrue) {
                    this.mainData.mainPictrue = this.mainData.mainPictrue.split(',');
                }
                if (this.mainData.detailPictrues) {
                    this.mainData.detailPictrues = this.mainData.detailPictrues.split(',');
                }
            });
        },
        back() {
            if (this.backLastRouter) {
                this.$router.go(-1);
            } else {
                this.$router.push({path: '/undertakesgood'});
            }
        },
        openImg(src) {
            window.open(this.imgSrc + src);
        }
    }
  };
</script>
<style lang="stylus" scoped>
    .title
        color #409eff
        padding 10px
        background-color rgba(64,158,255,.1)
        display flex
        justify-content space-between
</style>
