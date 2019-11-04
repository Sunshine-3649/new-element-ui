<template>
    <div class="onegoodquery">
        <el-form label-width="150px" size="medium">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="商品SKU编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.skuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="供应商名称：" prop="" size="mini">
                        <el-select v-model="searchParams.supplierCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in supplierOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="商品名称：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.itemName" placeholder=""></el-input>
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
                        <!-- <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in brandOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="最近更新日期：" size="mini">
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商商品状态：" prop="" size="mini">
                        <el-select v-model="searchParams.state" filterable placeholder="请选择">
                            <el-option
                                v-for="item in isValidOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="条形码：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.barCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="6">
                    &nbsp;
                </el-col>
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="primary" @click="resetSearchParams" icon="circle-cross">重置</el-button>
                        <el-button type="primary" :disabled="disabledDownLoad" @click="importExcel" icon="circle-cross">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table  ref="tableMain" :data="tableData" border style="width: 100%">
            <el-table-column align="center" prop="skuCode"    label="商品SKU编号"   >
                <template slot-scope="scope">
                    <span style="color:#409EFF; cursor:pointer;" @click="toSKUDetail(scope.row)">{{ scope.row.skuCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplierName"    label="供应商名称"   > </el-table-column>
            <el-table-column align="center" prop="supplierSkuCode"    label="供应商商品SKU编号"   > </el-table-column>
            <el-table-column align="center" prop="itemName"    label="商品名称"   > </el-table-column>
            <el-table-column align="center" prop="barCode"    label="条形码"   > </el-table-column>
            <el-table-column align="center" prop="supplyPrice"    label="供货价(元)"   > </el-table-column>
            <el-table-column align="center" prop="marketReferencePrice"    label="市场参考价(元)"   > </el-table-column>
            <el-table-column align="center" prop="brand"    label="品牌"   > </el-table-column>
            <el-table-column align="center" prop="stock"    label="库存"   > </el-table-column>
            <el-table-column align="center" prop="state"    label="供应商商品状态"   >
                <template slot-scope="scope">
                    <span v-show="scope.row.state == 1">上架</span>
                    <span v-show="scope.row.state == 0">下架</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="notifyTime"    label="最近同步时间"   > </el-table-column>
            <el-table-column align="center" prop="updateTime"    label="最近更新时间"   > </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount<0 ? 0 :searchParams.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>

export default {
    name: 'onegoodquery',
    data() {
        return {
            searchParams: {
                skuCode: '', // 商品sku编号
                spuCode: '', // 商品SPU编号
                skuName: '', // SKU名称
                itemName: '',
                categoryId: '',
                categoryLevel: '',
                brand: '', // 品牌
                barCode: '', // 条形码
                supplierSkuCode: '',
                supplierCode: '', // 供应商名称
                startDate: '',
                isValid: '', // 商品停启用
                state: '',
                endDate: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            brandOptions: [],
            supplierOptions: [],
            tableData: [],
            disabledDownLoad: false,
            isValidOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '上架',
                value: '1'
            }, {
                label: '下架',
                value: '0'
            }]
        };
    },
    mounted: function() {
        this.initData();
        // this.brandList();
        this.supplierList();
    },
    methods: {
        toSKUDetail(row) {
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
        },
        handleClick(name) {


        },
        selectResult(val) {

        },
        search() {
            if (this.searchParams.startDate && this.searchParams.endDate && this.searchParams.startDate > this.searchParams.endDate) {
                return this.$utils.messagetip.warningTip('开始时间不得大于结束时间');
            }
            console.log(this.searchParams);
            this.searchParams.pageNo = 1;
            this.initData();
        },
        resetSearchParams() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.totalCount = 0;
            this.initData();
        },
        importExcel() {
            if (!this.tableData.length) {
                this.$utils.messagetip.warningTip('暂无数据可导出');
                return;
            }
            this.disabledDownLoad = true;
            this.$AXIOS.EXPORT({url: '/goods/externalItemExport', data: this.searchParams, fileName: '一件代发商品'}).then(res => {

            }).finally(() => {
                this.disabledDownLoad = false;
            });
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData();
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData();
        },
        initData() {
            this.$AXIOS.LISTGET('/goods/externalGoodsPage', this.searchParams).then(res => {
                this.tableData = res.result;
                this.searchParams.totalCount = res.totalCount;
            });
        },
        // 获取品牌列表
        brandList() {
            this.$AXIOS.GET('/category/brands').then(res => {
                this.brandOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });
                this.brandOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        },
        // 获取供应商列表
        supplierList() {
            this.$AXIOS.GET('/goods/suppliersList', {status: 2, supplierKindCode: 'oneAgentSelling'}).then(res => {
                this.supplierOptions = res.result.map(item => {
                    return {
                        label: item.supplierName,
                        value: item.supplierInterfaceId
                    };
                });
                this.supplierOptions.unshift({
                    label: '全部',
                    value: ''
                });
            });
        }
    }
};
</script>

<style scoped>

</style>
