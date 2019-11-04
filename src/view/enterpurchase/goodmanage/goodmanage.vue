<template>
  <div class="goodmanage">
    <!-- 表单 -->
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6" :gutter="20">
          <el-form-item label="商品类目：" size="mini">
            <el-col :span="8">
              <el-select v-model="searchParams.firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                <el-option v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="searchParams.secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="searchParams.thirdCategoryId" :disabled="isSecondLevel" filterable placeholder="请选择">
                <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品条码：" size="mini">
            <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU编码：" size="mini">
            <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌：" size="mini">
            <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
              <el-option v-for="item in brandNameList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="SPU编号：" size="mini">
            <el-input v-model.trim="searchParams.spuCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toggleSupply('1')">开放供应</el-button>
      <el-button size="mini" type="primary" @click="toggleSupply('0')">停止供应</el-button>
      <el-button size="mini" type="primary" :disabled="isDisable" @click="downLoadUrl">导出商品</el-button>

    </el-row>
    <!-- tab切换 -->
    <el-tabs class="tab_group" v-model="activeName" type="card" @tab-click="toggleTab">
      <el-tab-pane label="开放供应的商品" name="1"></el-tab-pane>
      <el-tab-pane label="停止供应的商品" name="0"></el-tab-pane>
    </el-tabs>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark" height="453" style="width: 100%;margin-top:20px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column prop="spuCode" label="SPU编号" align="center"></el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="scope">{{ scope.row.brandName }}</template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="类目" prop="address" align="center">
        <template slot-scope="scope">{{ scope.row.firstCategoryName }}>{{ scope.row.secondCategoryName }}>{{ scope.row.thirdCategoryName }}</template>
      </el-table-column>
      <el-table-column label="供应状态" prop="address" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isValid === '0'">停止供应</div>
          <div v-if="scope.row.isValid === '1'">开放供应</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.isValid === '0'" @click="toggleSpuSupply(scope.row.spuCode, scope.row.isValid)">开放供应</el-button>
          <el-button size="mini" type="text" v-if="scope.row.isValid === '1'" @click="toggleSpuSupply(scope.row.spuCode, scope.row.isValid)">停止供应</el-button>
          <el-button size="mini" type="text" @click="checkRowDetail(scope.row.skuVOList, scope.$index)">查看明细</el-button>
          <el-button size="mini" type="text" @click="toGoodDetail(scope.row.spuCode)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-row>

    <!-- 列表详情内表格展示 -->
    <el-dialog title="明细" :visible.sync="dialogTableVisible" :before-close="skuListClose">
      <el-table ref="detailTable" :data="skuList" border highlight-current-row>
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" width="200" align="center"></el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" align="center" width="160"></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" align="center"></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="供应状态" align="center" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.isValid === '0'">停止供应</div>
            <div v-else-if="scope.row.isValid === '1'">开放供应</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.isValid === '0'" @click="toggleSupplyStatus(scope.row.skuCode, scope.row.isValid, scope.$index)">开放供应</el-button>
            <el-button size="mini" type="text" v-else-if="scope.row.isValid === '1'" @click="toggleSupplyStatus(scope.row.skuCode, scope.row.isValid, scope.$index)">停止供应</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'goodmanage',
  data() {
    return {
      arr: [], // 数组列表
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
      totalCount: 0, // 列表条数
      searchParams: {
        firstCategoryId: '', // 搜索条件一级id
        secondCategoryId: '', // 搜索条件二级id
        thirdCategoryId: '', // 搜索条件三级id
        brandId: '', // 品牌名称
        name: '', // 商品名称
        skuCode: '', // 商品skuCode
        spuCode: '', // 商品SPU编号
        barCode: '', // 商品条形码
        isValid: '1', // 默认开放供应的商品状态
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      }, // 请求参数
      activeName: '1', // tab切换name
      multipleSelection: [] // 多选框选中
    };
  },
  computed: {
    isDisable() {
      if (this.tableDataList && this.tableDataList.length) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.initDataList();
    this.getBrandName();
    this.getSelectItmesPage({ level: '1' });
  },
  methods: {
    downLoadUrl() {
      let params = {};
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key] !== '') {
          params[key] = this.searchParams[key];
        }
      });
      window.open('/chain-web/busiItems/exportItems?' + qs.stringify(params));
    },
    // 商品品牌
    getBrandName() {
      this.GET('/brandManage/queryBrandList').then(res => {
        if (res.code === '200') {
          this.brandNameList = res.body;
        }
      });
    },
    // 搜索，初始化数据
    initDataList() {
      this.GET('/busiItems/selectItmesPage', this.searchParams).then(res => {
        if (res.code === '200') {
          this.tableDataList = res.body.objects;
          this.totalCount = res.body.pageTotal;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            }, 20);
          }
        }
      });
    },
    // 更改spu级别列表状态
    updateSpuIsvalid(isValid) {
      const params = {
        isValid: isValid,
        spuCodeList: this.spuCodeList
      };
      this.POST('/busiItems/updateSpuIsvalid', params).then(res => {
        if (res.code === '200') {
          this.$utils.messagetip.successTip('更改状态成功');
          this.resetForm();
        }
      });
    },
    // 更改sku级别列表状态
    updateSkuIsvalid(isValid) {
      const params = {
        isValid: isValid,
        skuCodeList: this.skuCodeList
      };
      this.POST('/busiSkusManage/updateSkuIsvalid', params).then(res => {
        if (res.code === '200') {
          const firstIndex = this.currentTableIndex[0] * 1;
          const secondIndex = this.currentTableIndex[1] * 1;
          this.tableDataList[firstIndex].skuVOList[secondIndex].isValid = isValid;
          this.$utils.messagetip.successTip('更改状态成功!');
        }
      });
    },
    // 获取类目信息
    getSelectItmesPage(params) {
      this.GET('/category/queryCategory', params).then(res => {
        if (res.code === '200') {
          if (params.level === '1') {
            this.firstCateList = res.body;
          } else if (params.level === '2') {
            this.secondCateList = res.body;
            // this.searchParams.secondCategoryId = this.secondCateList[0].id;
            // if (this.secondCateList.length) {
            //   this.getSelectItmesPage({level: '3', parentId: this.secondCateList[0].id});
            //   this.isSecondLevel = false;
            // }
          } else if (params.level === '3') {
            this.thirdCateList = res.body;
            // this.searchParams.thirdCategoryId = this.thirdCateList[0].id;
          }
        }
      });
    },
    // 一级分类改变
    firstCateChange(val) {
      if (val) {
        this.isFirstLevel = false;
        this.searchParams.secondCategoryId = '';
        this.getSelectItmesPage({ level: '2', parentId: val });
      } else {
        this.isFirstLevel = true;
      }
    },
    // 二级分类改变
    secondCateChange(val) {
      if (val) {
        this.isSecondLevel = false;
        this.searchParams.thirdCategoryId = '';
        this.getSelectItmesPage({ level: '3', parentId: val });
      } else {
        this.isSecondLevel = true;
      }
    },
    // 关闭查看明细,重新获取列表数据
    skuListClose(done) {
      this.initDataList();
      done();
    },
    // 切换spu状态
    toggleSpuSupply(spuCode, isValid) {
      let isResult = ''; // 对应的中文
      isValid = isValid === '0' ? '1' : '0';
      this.spuCodeList = [];
      this.spuCodeList.push(spuCode);
      if (isValid === '1') {
        isResult = '开放';
      } else {
        isResult = '停止';
      }
      this.$confirm(`${isResult}供应选中的商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateSpuIsvalid(isValid);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消删除');
        });
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNumber = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.activeName = '1';
      this.isFirstLevel = this.isSecondLevel = true;
      this.searchParams = {
        firstCategoryId: '', // 搜索条件一级id
        secondCategoryId: '', // 搜索条件二级id
        thirdCategoryId: '', // 搜索条件三级id
        brandId: '', // 品牌名称
        name: '', // 商品名称
        skuCode: '', // 商品skuCode
        spuCode: '', // 商品SPU编号
        barCode: '', // 商品条形码
        isValid: '1', // 默认开放供应的商品状态
        pageSize: 10, // 默认10条
        pageNumber: 1 // 默认第一页
      };
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNumber = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      this.initDataList();
    },
    // 批量开放供应
    toggleSupply(isValid) {
      let isResult = ''; // 对应的中文
      if (!this.multipleSelection.length) {
        this.$utils.messagetip.warningTip('至少选中一条商品');
        return;
      }
      this.spuCodeList = [];
      this.multipleSelection.forEach(item => {
        this.spuCodeList.push(item.spuCode);
      });
      if (isValid === '1') {
        isResult = '开放';
      } else {
        isResult = '停止';
      }
      if (isValid === this.searchParams.isValid) {
        this.$utils.messagetip.warningTip(`已处于${isResult}状态`);
        return;
      }
      this.$confirm(`${isResult}供应选中的商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateSpuIsvalid(isValid);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消删除');
        });
    },
    // 三级联动触发事件
    choseLevelMenu(value) {
      console.log(value);
    },
    // 切换tab
    toggleTab(tab, event) {
      this.searchParams.isValid = this.activeName;
      this.initDataList();
    },
    // 多选框选中的每一项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看明细
    checkRowDetail(skuList, index) {
      console.log(skuList);
      // 取数组中的索引值
      this.currentTableIndex = [];
      this.currentTableIndex.push(index);
      this.skuList = skuList;
      if (this.skuList.length) {
        setTimeout(() => {
          this.$refs.detailTable.setCurrentRow(this.skuList[0]);
        }, 20);
      }
      this.dialogTableVisible = true;
    },
    // 跳转到详情页
    toGoodDetail(spuCode) {
      this.$router.push({
        path: '/goodmanage/gooddetail/' + spuCode
      });
    },
    // 改变供应状态
    toggleSupplyStatus(skuCode, isValid, index) {
      let isResult = '';
      if (this.currentTableIndex.length > 1) {
        this.currentTableIndex[1] = index;
      } else {
        this.currentTableIndex.push(index);
      }
      isValid = isValid === '0' ? '1' : '0';
      if (isValid === '1') {
        isResult = '开放';
      } else {
        isResult = '停止';
      }
      // 重置入参
      this.skuCodeList = [];
      this.skuCodeList.push(skuCode);
      this.$confirm(`${isResult}供应选中的商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateSkuIsvalid(isValid);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消删除');
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.goodmanage
  .tab_group
    margin-top: 15px
  .demo-table-expand
    font-size: 0
  .demo-table-expand label
    width: 90px
    color: #99a9bf
  .demo-table-expand .el-form-item
    padding-left: 55px
    box-sizing: border-box
    margin-right: 0
    margin-bottom: 0
    width: 50%
  .paging
    text-align: right
    margin-top: 15px
</style>
