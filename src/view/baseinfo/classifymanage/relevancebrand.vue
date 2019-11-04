<template>
  <div class="relevancebrand">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          当前分类：
        </el-col>
        <el-col :span="6">
          <p style="line-height: 28px;">{{brandName}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          关联品牌：
        </el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="choseBrand">选择品牌</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          已关联品牌：
        </el-col>
        <el-col :span="6" style="text-align: right; line-height: 28px;">
          <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
        </el-col>
        <el-col :span="6" style="line-height: 28px;">
          <el-button size="mini" type="primary" @click="searchQuery">查询</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="12">
          <el-table :data="tableDataList.slice((searchParams.pageNo-1)*searchParams.pageSize,searchParams.pageNo*searchParams.pageSize)" highlight-current-row border >
            <el-table-column label="品牌名称" prop="brandName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="isValid" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.isValid === '1' ? '启用' : '停用'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="deleteRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
        <el-row :span="14" v-if="tableDataList.length>searchParams.pageSize" justify="space-between">
          <el-col :span="6">
          </el-col>
          <el-col :span="10">
            <el-row class="paging">
              <el-pagination @size-change="tableChangeSize" @current-change="tableChangeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
              </el-pagination>
            </el-row>
          </el-col>
        </el-row>
        </el-col>
      </el-row>
      <el-row class="btn_group">
        <el-col :span="14" style="text-align: center;margin-top: 20px">
          <el-button size="mini" type="primary" @click="saveData" :disabled="isSubmit">保存</el-button>
          <el-button size="mini" @click="back">取消</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 品牌弹窗 -->
    <el-dialog title="关联品牌" :visible.sync="dialogFormVisible">
      <el-form :model="params" >
        <el-form-item label="品牌名称：" prop="name" label-width="120px" size="mini">
          <el-input v-model="params.name" style="width: 200px"></el-input>
          <el-button type="primary" @click="getBrandPageCategory" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="brandList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column property="name" label="品牌名称" align="center"></el-table-column>
        <el-table-column property="alise" label="品牌别名" align="center"></el-table-column>
      </el-table>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="params.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
      <div style="margin-top: 20px;text-align: center">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="makeSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'relevancebrand',
  data() {
    return {
      result: [],
      isSubmit: false, // 多次点击
      deleteRowList: [], // 删除的数组
      delRecordList: [], // 老的
      brandName: '', // 品牌名字
      multipleSelection: [],
      dialogFormVisible: false, // 关联品牌弹窗
      tableDataList: [], // 搜索列表
      brandList: [], // 品牌列表
      totalCount: 0, // 总页码
      searchParams: {
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      params: {
        name: '', // 品牌名称
        isValid: '1',
        pageIds: '',
        start: 0,
        pageSize: 10,
        pageNo: 1
      },
      inputVal: '' // 查询条件
    };
  },
  computed: {
    // 当前表格高度
    currentHeight() {
      let height = 96;
      if (this.tableDataList && this.tableDataList.length) {
        if (this.tableDataList.length > 10) {
          height = 386;
        } else if (this.tableDataList.length > 0 && this.tableDataList.length <= 10) {
          height = 43 * this.tableDataList.length + 36;
        } else {
          height = 71;
        }
      }
      return height;
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.initData();
    this.getCategoryBrands();
  },
  methods: {
    // 获取品牌名字
    initData() {
      this.$AXIOS.LISTGET('/category/query/' + this.id, { id: this.id }).then(res => {
        this.brandName = res.result || '';
      });
    },
    // 获取分类列表
    getCategoryBrands() {
      this.$AXIOS.LISTGET('/category/categoryBrands', { categoryId: this.id }).then(res => {
        this.delRecordList = res.result || [];
        this.tableDataList = res.result || [];
        this.result = res.result || [];
        this.searchParams.totalCount = this.tableDataList.length;
      });
    },
    // 获取品牌名称
    getBrandPageCategory() {
      this.$AXIOS.LISTGET('/category/brandPageCategory', this.params).then(res => {
        this.brandList = res.result || [];
        this.totalCount = res.totalCount;
      });
    },
    // 品牌管理关联保存
    getBrandLink(params) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      this.$AXIOS.POST('/category/link/' + this.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/classifymanage' });
      });
    },
    // 选择品牌
    choseBrand() {
      this.dialogFormVisible = true;
      let arr = [];
      this.tableDataList.forEach(item => {
        arr.push(item.brandId);
      });
      console.log(arr);
      this.params.pageIds = arr.join();
      this.getBrandPageCategory();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    searchQuery() {
      console.log(this.result);
      this.searchParams.pageNo = 1;
      this.tableDataList = this.result.filter(item => {
        return item.brandName.match(this.inputVal);
      });
    },
    deleteRow(i) {
      console.log(i);
      let result = this.tableDataList.splice(i, 1);
      console.log(result);
      this.deleteRowList.push(result[0].brandId);
      this.searchParams.totalCount = this.tableDataList.length;
      let pageNumber = Math.ceil(this.searchParams.totalCount / this.searchParams.pageSize);
      if (this.searchParams.totalCount % this.searchParams.pageSize === 0 && (this.searchParams.pageNo !== pageNumber)) {
        console.log('0000000');
        this.tableChangeNumber(this.searchParams.pageNo - 1);
      }
    },
    // 确定
    makeSure() {
      this.multipleSelection.forEach(item => {
        item.brandName = item.name;
        item.brandId = item.id;
      });
      this.result = [...this.tableDataList, ...this.multipleSelection];
      this.tableDataList = this.result;
      this.dialogFormVisible = false;
      this.searchParams.totalCount = this.tableDataList.length;
      this.tableChangeNumber(1);
    },
    tableChangeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
    },
    tableChangeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
    },
    // 保存
    saveData() {
      console.log(this.tableDataList);
      if (this.tableDataList && !this.tableDataList.length) {
        this.$utils.messagetip.warningTip('请至少选择一条关联品牌');
        return;
      }
      let brandIdList = [];
      let delRecordList = [];
      let arr = [];
      console.log(this.delRecordList);
      this.delRecordList.forEach(item => {
        arr.push(item.brandId);
      });
      this.tableDataList.forEach(item => {
        brandIdList.push(item.brandId);
      });
      console.log(arr);
      console.log(this.deleteRowList);
      // this.deleteRowList.forEach(item => {
      //   if (arr.indexOf(item) > -1) {
      //     delRecordList.push(item);
      //   }
      // });
      let params = {
        brandIds: brandIdList.join(),
        delRecord: this.deleteRowList.join()
      };
      console.log(params);
      this.getBrandLink(params);
    },
    // 页码条数改变
    changeSize(val) {
      this.params.start = 0;
      this.params.pageNo = 1;
      this.params.pageSize = val;
      this.getBrandPageCategory();
    },
    // 当前页码改变
    changeNumber(val) {
      this.params.start = (val - 1) * this.params.pageSize;
      this.params.pageNo = val;
      this.getBrandPageCategory();
    },
    back() {
      this.$router.push({ path: '/classifymanage' });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .paging
    text-align: right
    margin: 15px
</style>
