
<template>
    <div class="goodsquery">
        <el-form label-width="150px" size="medium">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item  label="商品SKU编号：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.skuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="商品SPU编号：" prop="" size="mini">
                        <el-input v-model="searchParams.spuCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="SKU名称：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.skuName" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="条形码：" prop="" size="mini">
                        <el-input clearable v-model="searchParams.barCode" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="品牌：" prop="" size="mini">
                        <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in brandOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态：" prop="" size="mini">
                        <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
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
                    <category-select url='productCenter/category/tree' :clear="clear" :isNoFilter='isNoFilter' v-on:selectResult="selectResult"></category-select>
                </el-col>
                <el-col :span="6">
                    <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">搜索</el-button>
                        <el-button type="primary" @click="resetSearchParams" icon="circle-cross">重置</el-button>
                        <el-button type="primary" @click="importExcel" icon="circle-cross">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column align="center" prop="skuCode"   label="商品SKU编号"  >
                <template slot-scope="scope">
                    <span @click="toSKUdetail(scope.row)" style="color:#409EFF; cursor:pointer">
                        {{ scope.row.skuCode }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="skuName"   label="SKU名称"  > </el-table-column>
            <el-table-column align="center" prop="spuCode"   label="SPU编号"  >
                <template slot-scope="scope">
                    <span @click="toSPUdetail(scope.row)" style="color:#409EFF; cursor:pointer">
                        {{ scope.row.spuCode }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="specInfo"   label="规格"  > </el-table-column>
            <el-table-column align="center" prop="barCode"   label="条形码"  > </el-table-column>
            <el-table-column align="center" prop="categoryName"   label="类目"  > </el-table-column>
            <el-table-column align="center" prop="brandName"   label="品牌"  > </el-table-column>
            <!-- <el-table-column align="center" prop="availableInventory"   label="可用正品总库存"  > </el-table-column> -->
            <el-table-column align="center" prop="isValid"   label="商品状态"  >
                <template slot-scope="scope">
                    <span v-if="scope.row.isValid == 1">启用</span>
                    <span v-else>停用</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateTime"   label="最近更新时间"  > </el-table-column>
        </el-table>
        <div class="page" style="text-align:right; padding: 10px 0;">
            <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount<0 ? 0 :searchParams.totalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import categorySelect from '@/components/mainSystemSelect';
  export default {
    name: 'goodsquery',
    data() {
        return {
            isNoFilter: false,
            searchParams: {
                skuCode: '', // 商品sku编号
                spuCode: '', // 商品SPU编号
                skuName: '', // SKU名称
                categoryId: '',
                categoryLevel: '',
                brandId: '', // 品牌
                barCode: '', // 条形码
                startDate: '',
                isValid: '', // 商品停启用
                endDate: '',
                pageSize: 10,
                pageNo: 1,
                start: 0,
                totalCount: 0
            },
            clear: false,
            brandOptions: [],
            isValidOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '启用',
                value: '1'
            }, {
                label: '停用',
                value: '0'
            }],
            tableData: []
        };
    },
    mounted: function() {
        this.brandList();
        this.initData(this.searchParams);
    },
    components: {
        categorySelect
    },
    methods: {
        importExcel() {
            let url = `/scm-web/goods/itemsExport?skuCode=${this.searchParams.skuCode}&spuCode=${this.searchParams.spuCode}&skuName=${this.searchParams.skuName}&isValid=${this.searchParams.isValid}&categoryId=${this.searchParams.categoryId}&brandId=${this.searchParams.brandId}&barCode=${this.searchParams.barCode}&categoryLevel=${this.searchParams.categoryLevel}`;
            top.window.open(url);
        },
        toSPUdetail(row) {
            this.$router.push({
               name: 'minedetail',
               params: {
                   id: row.spuCode,
                   flag: true
               },
               query: {
                   supShow: true,
                   backLastRouter: true
               }
           });
        //    this.$store.dispatch('selectChannel/setMuneTab', {
        //         title: '自采商品详情',
        //         route: '/minegoods'
        //     });
        },
        toSKUdetail(row) {
            this.$router.push({
               name: 'goodsquerydetail',
               params: {
                   id: row.spuCode,
                   skuCode: row.skuCode
               }
           });
        },
        search() {
            this.searchParams.pageNo = 1;
            this.initData(this.searchParams);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData(this.searchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initData(this.searchParams);
        },
        resetSearchParams() {
            this.clear = true;
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageSize = 10;
            this.searchParams.pageNo = 1;
            this.searchParams.start = 0;
            this.searchParams.totalCount = 0;
            this.initData(this.searchParams);
        },
        selectResult(val) {
            this.searchParams.categoryId = val.categoryId;
            this.searchParams.categoryLevel = val.categoryLevel;
            this.clear = false;
        },
        // 获取品牌列表
        brandList() {
            this.$AXIOS.GET('/productCenter/brand/all_list').then(res => {
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
        // 初始化数据
        initData(data) {
            this.$AXIOS.LISTGET('/goods/goodsSkuPage', data).then(res => {
                this.searchParams.totalCount = res.totalCount;
                this.tableData = res.result;
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>

</style>
