<template>
    <div class="undertakesgood">
        <el-form label-width="150px" size="medium">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="供应商名称：" prop="" size="mini">
                        <el-select clearable v-model="searchParams.supplierCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in supplierCodeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="商品SKU编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.skuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="商品名称：" prop="" size="mini">
                        <el-input v-model="searchParams.itemName" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商商品SKU编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.supplierSkuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="品牌：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.brand" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="条形码：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.barCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商商品状态：" prop="" size="mini">
                        <el-select v-model="searchParams.state" filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="最后更新日期："  size="mini">
                        <el-col :span="11">
                            <el-form-item prop="" size="mini">
                                <el-date-picker  v-model="searchParams.startDate" :clearable='true' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="" size="mini">
                                <el-date-picker v-model="searchParams.endDate"  type="date" :clearable='true' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="default" @click="resetSearchParams" icon="circle-cross">清空条件</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row style="margin:10px 0">
            <el-button type="primary" @click="addShopDialog" size="mini" icon="search">新增代发商品</el-button>
        </el-row>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column align="center" prop="skuCode" width="150"  label="商品SKU编号" >
                <template slot-scope="scope">
                    <span @click="toDetail(scope.row)" style="color:#409eff;cursor:pointer">{{ scope.row.skuCode }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplierName"   label="供应商名称" > </el-table-column>
            <el-table-column align="center" prop="supplierSkuCode"  width="180" label="供应商商品SKU编号" >
            </el-table-column>
            <el-table-column align="center" prop="itemName" width="350"  label="商品名称">
            </el-table-column>
            <el-table-column align="center" prop="barCode" width="150"  label="条形码"  >
                <template  slot-scope="scope">
                    <span v-if="scope.row.isChangeBarcode" @dblclick="changeBarcode(scope.row)">{{ scope.row.barCode }}</span>
                    <el-input @blur="scope.row.isChangeBarcode = true" v-else type="text" size="mini" @change="keepChangeBarcode(scope.row)" v-model="scope.row.barCode" ></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplyPrice"  label="供货价(元)" > </el-table-column>
            <el-table-column  align="center" prop="marketReferencePrice" width="100" label="市场参考价(元)">
            </el-table-column>
            <el-table-column  align="center" prop="warehouse"  label="仓库名称">
            </el-table-column>
            <el-table-column  align="center" prop="stock"  label="库存">
            </el-table-column>
            <el-table-column  align="center" prop="marketReferencePrice" width="100"  label="供应商商品状态">
                <template slot-scope="scope">
                    <span v-show="scope.row.state == 1">上架</span>
                    <span v-show="scope.row.state == 0">下架</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="notifyTime" width="150"  label="最后同步时间">
            </el-table-column>
            <el-table-column  align="center" prop="updateTime" width="150" label="最后更新时间">
            </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
            </el-pagination>
        </div>

        <!-- 新增代发商品 -->
        <el-dialog class="dialog" title="选择一件代发商品" :visible.sync="dialogAddShop" width="80%">
            <el-form label-width="120px" size="medium">
                <el-row :span="20">
                    <el-col :span="5">
                        <el-form-item  label="供应商名称：" prop="" size="mini">
                            <el-select clearable v-model="dialogSearchParams.supplierCode" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in supplierCodeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item  label="商品SKU编号：" prop="" size="mini">
                            <el-input clearable v-model="dialogSearchParams.supplySku" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item  label="商品名称：" prop="" size="mini">
                            <el-input clearable v-model="dialogSearchParams.skuName" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item  label="品牌：" prop="" size="mini">
                            <el-input clearable v-model="dialogSearchParams.brand" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item  label="" prop="" size="mini">
                            <el-button type="primary" @click="dialogSearch" icon="search">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table @selection-change="handleSelectionChange" :data="dialogTableData" border style="width: 100%">
                <el-table-column  type="selection" align="center" prop="" width="50"  label="" >
                </el-table-column>
                <el-table-column align="center" prop="supplyName"   label="供应商名称" >
                </el-table-column>
                <el-table-column align="center" prop="skuName" width="300"   label="商品名称" > </el-table-column>
                <el-table-column align="center" prop="supplySku"  width="180" label="商品SKU编号" >
                </el-table-column>
                <el-table-column align="center" prop="brand" width="150"  label="品牌">
                </el-table-column>
                <el-table-column align="center" prop="supplyPrice"   label="供货价(元)"  > </el-table-column>
                <el-table-column align="center" prop="marketPrice"  label="市场价(元)" > </el-table-column>
                <el-table-column align="center" prop="minBuyCount"  label="最小购买量" > </el-table-column>
                <el-table-column align="center" prop="supplyPrice"  label="商品图片" >
                    <template slot-scope="scope">
                        <el-button @click="lookCurrentImg(scope.row)" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page" style="text-align:right; padding: 10px 0;">
                <el-pagination @size-change="dialogChangeSize" @current-change="dialogChangeNumber" :current-page="dialogSearchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="dialogSearchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dialogSearchParams.totalCount">
                </el-pagination>
            </div>
            <div style="text-align:center; padding-top:20px;">
                <el-button size="mini" @click="confirmSelectShop" type="primary">确定</el-button>
                <el-button size="mini" @click="quitSelect"  type="">取消</el-button>
            </div>
        </el-dialog>

        <!-- 查看图片 -->
        <el-dialog class="dialog" title="商品详情图片" :visible.sync="dialogImgs" width="80%">
            <el-carousel style="height:500px;" :interval="5000" arrow="always">
                <el-carousel-item style="height:500px;"  v-for="item in detailImgArr" :key="item">
                <!-- <h3>{{ item }}</h3> -->
                    <img style="width:100%; height:100%;" :src="'http://img13.360buyimg.com/n12/'+item"/>
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    name: 'undertakesgood',
    data() {
        return {
            dialogImgs: false,
            dialogAddShop: false,
            detailImgArr: [], // 商品图片详情
            noChangeBarcode: '',
            searchParams: {
                state: '', // 商品发货商品状态
                skuCode: '', // 商品sku编号
                itemName: '', // 商品名称
                supplierCode: '', // 供应商名称
                supplierSkuCode: '', // 供应商商品SKU编号
                brand: '', // 品牌
                barCode: '', // 条形码
                startDate: '',
                endDate: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            dialogSearchParams: {
                supplierCode: '', // 供应商名称
                supplySku: '', // 商品SKU编号
                skuName: '', // 商品名称
                brand: '', // 品牌
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            selectShopList: [],
            tableData: [],
            dialogTableData: [],
            options: [{
                value: '0',
                label: '下架'
            }, {
                value: '1',
                label: '上架'
            }],
            supplierCodeOptions: []
        };
    },
    mounted: function() {
        this.supplierCodeList();
        this.initData(this.searchParams);
    },
    methods: {
        dialogChangeSize(val) {
            this.dialogSearchParams.pageSize = val;
            this.dialogInitData(this.dialogSearchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData(this.searchParams);
        },
        dialogChangeNumber(val) {
            this.dialogSearchParams.pageNo = val;
            this.dialogSearchParams.start = (val - 1) * 10;
            this.dialogInitData(this.dialogSearchParams);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData(this.searchParams);
        },
        search() {
            this.searchParams.pageNo = 1;
            this.initData(this.searchParams);
        },
        dialogSearch() {
            this.dialogSearchParams.pageNo = 1;
            this.dialogSearchParams.start = 0;
            this.dialogInitData(this.dialogSearchParams);
        },
        resetSearchParams() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.totalCount = 0;
            this.searchParams.start = 0;
            this.initData(this.searchParams);
        },
        changeBarcode(row) {
            row.isChangeBarcode = false;
            this.noChangeBarcode = row.barCode;
        },
        keepChangeBarcode(row) {
            let regexp = new RegExp(/^[0-9a-zA-Z-#,]+$/);// 条形码验证
            if (regexp.test(row.barCode)) {
                this.$AXIOS.PUT('/goods/externalItemSku/' + row.id, {barCode: row.barCode}).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    row.isChangeBarcode = true;
                    this.initData(this.searchParams);
                });
            } else {
                this.$utils.messagetip.warningTip('条形码格式错误');
                row.barCode = this.noChangeBarcode;
                row.isChangeBarcode = true;
            }
        },
        // 取消
        quitSelect() {
            this.dialogAddShop = false;
        },
        // 前往代发商品详情
        toDetail(row) {
            this.$router.push({
                name: 'undertakesgoodDetail',
                params: {
                    id: row.skuCode
                },
                query: {
                    opeId: row.id
                }
            });
        },
        // 确定
        confirmSelectShop() {
            this.$AXIOS.POST('/goods/externalItemSku', {supplySkus: JSON.stringify(this.selectShopList)}, true).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                this.dialogAddShop = false;
                this.selectShopList = [];
                this.searchParams.pageNo = 1;
                this.initData(this.searchParams);
            });
        },
        // 新增代发商品
        addShopDialog() {
            for (let obj in this.dialogSearchParams) {
                this.dialogSearchParams[obj] = '';
            }
            this.dialogSearchParams.pageSize = 10;
            this.dialogSearchParams.pageNo = 1;
            this.dialogSearchParams.start = 0;
            this.dialogSearchParams.totalCount = 0;
            this.dialogAddShop = true;
            this.dialogInitData(this.dialogSearchParams);
        },
        // 选择代发商品
        handleSelectionChange(arr) {
            this.selectShopList = arr;
        },
        // 查看详情图片
        lookCurrentImg(row) {
            let strImg = row.detailImagePath ? row.detailImagePath.split(',') : '';
            strImg.splice(strImg.length - 1, 1);
            this.detailImgArr = strImg;
            this.dialogImgs = true;
        },
        supplierCodeList() {
            this.$AXIOS.GET('/goods/suppliersList', {supplierKindCode: 'oneAgentSelling'}).then(res => {
                if (res.result && res.result.length) {
                    this.supplierCodeOptions = res.result.map(item => {
                        return {
                            label: item.supplierName,
                            value: item.supplierInterfaceId
                        };
                    });
                } else {
                    this.supplierCodeOptions = [];
                }
                this.supplierCodeOptions.unshift({
                    value: '',
                    label: '全部'
                });
            });
        },
        // 初始化数据列表
        initData(data) {
            this.$AXIOS.LISTGET('/goods/externalGoodsPage', data).then(res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result.map((item, index, obj) => {
                    for (let i in item) {
                        if (item[i] === '' || item[i] === null) {
                            item[i] = '-';
                        }
                    }
                    item.isChangeBarcode = true;
                    return item;
                });
            });
        },
        // 新增代发商品初始化
        dialogInitData(data) {
            this.$AXIOS.LISTGET('/goods/externalGoodsPage2', data).then(res => {
                this.dialogSearchParams.totalCount = res.totalCount;
                this.dialogTableData = res.result.map((item, index, obj) => {
                    // for (let i in item) {
                    //     if (item[i] === '' || item[i] === null) {
                    //         item[i] = '-';
                    //     }
                    // }
                    return item;
                });
            });
        }

    }
  };
</script>
<style lang="stylus" scoped>

</style>
