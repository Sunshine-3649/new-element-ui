<template>
    <div class="afterSaleAdd">
        <div class="title">选择商品</div>
        <div class="tip">提示：可退数量为0的商品，不可以创建售后单据</div>
        <el-table id="tableMain" class="requreRed" :data="tableData" border style="width: 100%">
            <el-table-column width="50" align="center"  property="date"  >
                <template slot-scope="scope">
                    <el-radio :disabled="scope.row.maxReturnNum <= 0" @change="radioChange(scope.row, scope.$index)" v-model="selectRadio" :label="scope.$index"  ></el-radio>
                </template>
            </el-table-column>
            <el-table-column align="center" type="index" prop="date" label="序号" width="50">  </el-table-column>
            <el-table-column align="center" prop="date" label="商品图片">
                <template slot-scope="scope">
                    <img style="width:60px;height:60px; margin:10px 0" :src="scope.row.picPath" />
                </template>
            </el-table-column>
            <el-table-column align="center" prop="itemName"  label="SKU名称">
                <template slot-scope="scope">
                    <span style="color:#409eff; cursor:pointer" @click="toShopDetail(scope.row)" type="text">{{ scope.row.itemName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="skuCode" label="SKU编号"> </el-table-column>
            <el-table-column align="center" prop="barCode" label="条形码"> </el-table-column>
            <el-table-column align="center" prop="specNatureInfo" label="规格"> </el-table-column>
            <el-table-column align="center" prop="num" label="下单数量"> </el-table-column>
            <el-table-column align="center" prop="maxReturnNum" label="可退数量"> </el-table-column>
            <el-table-column class="a1" align="center" prop=""   label="退款金额">
                <template slot-scope="scope">
                    <el-input class="place" :disabled="selectRadio != scope.$index"  :placeholder="selectRadio != scope.$index ?  '-' : ''"   v-model.number="scope.row.refundAmont" type="text" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="拟退数量">
                <template slot-scope="scope">
                    <el-input  class="place" :disabled="selectRadio != scope.$index" :placeholder="selectRadio != scope.$index ?  '-' : ''" maxlength="7" v-model.number="scope.row.returnNum" type="text" size="mini"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div class="title">售后信息</div>
        <el-form style="width:700px;" label-width="125px"  size="medium">
            <el-form-item label="图片文件：">
                <el-upload
                    class="upload-demo"
                    :limit="5"
                    :data="imgData"
                    :on-exceed="onExceed"
                    :file-list="fileListShow"
                    :on-remove="onRemove"
                    name="Filedata"
                    action="/scm-web/qinniu/upload/afterSaleOrder"
                    :on-preview="handlePreview"
                    :on-success="onSuccess"
                    :before-upload="beforeUpload"
                    list-type="picture">
                    <el-button size="mini" type="primary">点击上传</el-button>
                    <span>最多限传5张，单张图片限4MB以内，支持JPG、PNG、BMP格式。</span>
                    <!-- <div slot="tip" class="el-upload__tip"></div> -->
                </el-upload>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="searchParams.memo" maxlength="500" placeholder="选填，最多限填500字" style="width:" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="运输信息：">
                <el-row :span="24">
                    <el-col :span="8">
                        <el-select v-model="searchParams.logisticsCorporationCode"  size="mini" filterable placeholder="请选择">
                            <el-option
                                v-for="(item,index) in courierCompanyOptions"
                                @click.native="searchParams.logisticsCorporation = item.label"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-input :disabled="!searchParams.logisticsCorporationCode" v-model="searchParams.waybillNumber" maxlength="50" size="mini" placeholder="请填写单号" style="width:" type="text"></el-input>
                    </el-col>
                    <el-col :span="7">
                        &nbsp;&nbsp;选填，物流单号最多限填50字
                    </el-col>
                </el-row>
            </el-form-item>
            <span style="color:red; position:relative; right:-44px; top:24px;">*</span>
            <el-form-item label="入库仓库：">
                <el-select v-model="searchParams.returnWarehouseCode" size="mini" filterable placeholder="请选择入库仓库">
                    <el-option
                        v-for="item in warehouseOptions"
                        @click.native="searchParams.warehouseName = item.label"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="text-align:center;">
            <el-button size="mini" :disabled="disAbledBtn" @click="confirm" type="primary">提交</el-button>
            <el-button size="mini" @click="back">返回</el-button>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
import returnreceiptVue from '../../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
    data() {
        return {
            searchParams: {
                scmShopOrderCode: '', // 订单号
                picture: '', // 图片数组
                memo: '', // 备注
                returnWarehouseCode: '', // 退货收货仓库编码
                warehouseName: '', // 入库仓库名称
                returnAddress: '', // 收货详细地址
                logisticsCorporationCode: '', // 快递公司编码
                logisticsCorporation: '', // 快递公司名称
                waybillNumber: '', // 运单号
                afterSaleOrderDetailList: '' // 售后单详情
            },
            pictureList: [],
            dialogVisible: '',
            imgData: {},
            tableData: [],
            warehouseOptions: [], // 入库仓库列表
            courierCompanyOptions: [], // 快递公司列表
            orderCode: this.$route.params.code,
            fileListShow: [],
            disAbledBtn: false,  // 控制提交连续点击
            selectRadio: '-1' // 选择商品
        };
    },
    computed: {

    },
    mounted: function() {
        this.searchParams.scmShopOrderCode = this.orderCode;
        this.initOrderData(this.orderCode);
        this.courierCompany();
        this.intoWarehouse();
    },
    methods: {
        back() {
          this.$router.push({path: '/afterSale'});
        },
        radioChange(row, index) {
            // console.log(row, index);
            // // this.selectRadio = index;
            // console.log(this.selectRadio);
        },
        // 预览图片
        handlePreview(option) {
            window.open('https://scm.trc.com/' + option.response.key);
        },
        handleRemove() {

        },
        onExceed(val, list) {
            if (list.length === 5) {
                this.$utils.messagetip.warningTip('最多上传5张图片');
            }
        },
        beforeUpload(file) {
           let fileFormat = file.type;
            if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/bmp') {
                if (file.size > 1024 * 1024 * 4 ) {
                    this.$utils.messagetip.warningTip('文件大小不能大于4M');
                    return false;
                }
            } else {
                this.$utils.messagetip.warningTip('文件类型只能为.JPG,.PNG,.BMP格式');
                return false;
            }
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
        // 上传成功
        onSuccess(file) {
            this.pictureList.push(file.key);
        },
        onRemove(file) {
            let key = file.response.key;
            if (this.pictureList.length) this.pictureList.splice(this.pictureList.indexOf(key), 1);
        },
        // 提交
        confirm() {
            let body = this.searchParams;
            let selectOption = [];
            for (let i = 0; i < this.tableData.length; i++) {
                if (i === this.selectRadio) {
                    let obj = {};
                    obj.refundAmont = this.tableData[i].refundAmont;
                    obj.returnNum = this.tableData[i].returnNum;
                    obj.maxReturnNum = this.tableData[i].maxReturnNum;
                    obj.skuCode = this.tableData[i].skuCode;
                    obj.supplierOrderStatus = this.tableData[i].supplierOrderStatus;
                    body.afterSaleOrderDetailList = [obj];
                    break;
                }
            }

            if ( !this.checkTableData() ) {
                return false;
            } else {
                if ( this.searchParams.logisticsCorporationCode ) {
                    if ( !this.searchParams.waybillNumber ) {
                        this.$utils.messagetip.warningTip('请填写运输单号');
                        return;
                    }
                }

                if (!this.searchParams.returnWarehouseCode) {
                    this.$utils.messagetip.warningTip('请先选择入库仓库再提交');
                } else {
                    if (this.pictureList.length) {
                        body.picture = this.pictureList.join(',');
                    }
                    this.disAbledBtn = true;
                    this.$AXIOS.JSONPOST('/afterSaleOrder/add', body).then(res => {
                        this.$utils.messagetip.successTip('新增售货单成功');
                        setTimeout(() => {
                            this.$router.push({path: '/afterSale'});
                        }, 500);
                    }).finally(res => {
                        this.disAbledBtn = false;
                    });
                }
            }
        },
        // 校验列表数据
        checkTableData() {
            let parent = document.getElementById('tableMain');
            let arr = {
                num: -1,
                index: ''
            };
            let reg = /^\d+(\.\d{1,2})?$/;  // 保留两位小数的正数
            if (this.selectRadio < 0) {
                this.$utils.messagetip.warningTip('至少选择一件商品');
                return;
            }
            for (let i = 0; i < this.tableData.length; i++) {
                if (this.selectRadio === i) {  // 这个是为了单选的
                    //  if (this.tableData[i].refundAmont === '' || this.tableData[i].refundAmont === null) {
                    //     arr.num = i;
                    //     arr.index = 0;
                    //     this.$utils.messagetip.warningTip('请输入退款金额');
                    //     break;
                    // } else if (!reg.test(this.tableData[i].refundAmont)) {
                    //     arr.num = i;
                    //     arr.index = 0;
                    //     this.$utils.messagetip.warningTip('商品的退款金额需输入大于或等于0最多保留两位小数的数字');
                    //     break;
                    // } else
                     if (this.tableData[i].refundAmont && !reg.test(this.tableData[i].refundAmont)) {
                        arr.num = i;
                        arr.index = 0;
                        this.$utils.messagetip.warningTip('商品的退款金额需输入大于或等于0最多保留两位小数的数字');
                        break;
                    } else if (this.tableData[i].refundAmont > 1000000) {
                        arr.num = i;
                        arr.index = 0;
                        this.$utils.messagetip.warningTip('商品的退款金额不得大于1000000元');
                        break;
                    }

                    if (this.tableData[i].returnNum === '' || this.tableData[i].returnNum === null) {
                        arr.num = i;
                        arr.index = 1;
                        this.$utils.messagetip.warningTip('请输入拟退数量');
                        break;
                    } else if ( this.tableData[i].returnNum <= 0 || this.tableData[i].returnNum % 1 !== 0) {
                        arr.num = i;
                        arr.index = 1;
                        this.$utils.messagetip.warningTip('仅限填写正整数');
                        break;
                    }
                } else {
                    continue;
                }
            }
            if (arr.num > -1) {
                let item = parent.getElementsByClassName('el-table__row')[arr.num];
                let input = item.getElementsByTagName('input')[arr.index + 1];
                input.focus();
                return false;
            } else {
                return true;
            }
        },
        /**
         * @param code 订单号
         */
        initOrderData(code) {
            this.$AXIOS.GET('/afterSaleOrder/selectOrderItem', {scmShopOrderCode: code}).then(res => {
                res.result.map((item, index) => {
                    item.returnNum = ''; // 拟退货数量
                    item.refundAmont = ''; // 拟退金额
                });
                this.tableData = res.result;
                if (res.result && res.result.length) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].maxReturnNum > 0) {
                            this.selectRadio = i;
                            break;
                        }
                    }
                }
                // console.log(res);
            });
        },
        // 查询入库仓库
        intoWarehouse() {
            this.$AXIOS.GET('/afterSaleOrder/selectWarehouse').then(res => {
                this.warehouseOptions = res.result.map((item, index) => {
                    return {
                        label: item.warehouseName,
                        value: item.code
                    };
                });
            });
        },
        // 查询快递公司列表
        courierCompany() {
            this.$AXIOS.GET('/afterSaleOrder/selectLogisticsCompany').then(res => {
                this.courierCompanyOptions = res.result.map((item, index) => {
                    return {
                        label: item.companyName,
                        value: item.companyCode
                    };
                });
            });
        }
    }

};
</script>
<style lang="stylus" scoped>
    .afterSaleAdd
        .title
            background-color #ecf8ff
            padding 10px
            margin 10px 0
        .tip
           background-color rgba(255, 255, 204, 1)
           padding 10px
           color #ff0000
</style>
<style scoped>
.requreRed thead tr th:nth-child(5) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}

</style>




