<template>
  <div class="relevanceprop">
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
          关联属性：
        </el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="choseBrand">选择属性</el-button>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          已关联品牌：
        </el-col>
        <el-col :span="6" style="text-align: right; line-height: 28px;">
          <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
        </el-col>
        <el-col :span="6" style="line-height: 28px;">
          <el-button size="mini" type="primary" @click="searchQuery">查询</el-button>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="12">
          <el-table :data="tableDataList.slice((searchParams.pageNo-1)*searchParams.pageSize,searchParams.pageNo*searchParams.pageSize)" highlight-current-row border >
            <el-table-column label="属性名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="isValid" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.isValid === '1' ? '启用' : '停用'}}
              </template>
            </el-table-column>
            <el-table-column label="属性名称" prop="typeCode" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{checkProp(scope.row.typeCode)}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="moveUp(scope.$index)">上移</el-button>
                <el-button type="text" @click="moveDown(scope.$index)">下移</el-button>
                <el-button type="text" @click="deleteRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
      <el-row class="btn_group">
        <el-col :span="14" style="text-align: center;margin-top: 20px">
          <el-button size="mini" type="primary" @click="saveData" :disabled="isSubmit">保存</el-button>
          <el-button size="mini" @click="back">取消</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 品牌弹窗 -->
    <el-dialog title="关联属性" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="params">
        <el-form-item label="属性查询：" prop="name" label-width="120px" size="mini">
          <el-input v-model="queryString" style="width: 200px"></el-input>
          <el-button type="primary" @click="getBrandPageCategory" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <p style="width: 36%;line-height: 30px;display:inline-block;margin: 0 50px;text-align:center">属性名称</p>
        <p style="width: 36%;line-height: 30px;display:inline-block;margin: 0 50px;text-align:center">属性值</p>
      </div>
      <div style="width: 36%;height: 400px;display: inline-block;vertical-align: top;border: solid 1px #ccc;margin: 0 50px;padding: 10px 50px;overflow-y: scroll">
        <p v-for="item in propsList" :key="item.id">
          <el-radio v-model="inputVal" :label="item.id" @change='propChange' v-show="!item.isShow">{{item.name}}</el-radio>
        </p>
      </div>
      <div style="width: 36%;height: 400px;display: inline-block;vertical-align: top;border: solid 1px #ccc;margin: 0 50px;overflow-y: scroll">
        <div v-for="(item, i) in propNameList" :key="i" style="margin: 15px">
          <span style="width: 100px;display: inline-block;vertical-align: top;line-height: 28px;">{{item.value}}</span>
          <span style="width: 60px; height: 60px;display: inline-block;overflow: hidden;" v-if="item.picture">
            <img style="display: inline-block;margin: 0 auto;width: 100%" @click="showBig(item.picture)" :src="'https://scm.trc.com/' + item.picture" alt="">
          </span>
        </div>
      </div>
      <!-- <el-row :gutter="20">
        <el-col :span="3" class="tip_red" style="text-align: right; line-height: 28px;">
          属性名称：
        </el-col>
        <el-col :span="6">
          <el-select v-model="inputVal" placeholder="请选择属性名称" size="mini" filterable @change='propChange'>
            <el-option v-for="item in propsList" :disabled="item.isShow" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" style="text-align: right; line-height: 28px;">
          属性值：
        </el-col>
        <el-col :span="18">
          <div v-for="(item, i) in propNameList" :key="i" style="display: inline-block; vertical-align: top;margin-right: 10px">
            <div style="width: 100px;height: 100px; overflow: hidden">
              <img style="display: block;margin: 0 auto;width: 100%" v-if="item.picture" :src="'https://scm.trc.com/' + item.picture" alt="">
            </div>
            <p style="text-align: center;line-height: 28px;">{{item.value}}</p>
          </div>
        </el-col>
      </el-row> -->
      <div style="margin-top: 20px;text-align: center">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="makeSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow">
      <img width="100%" :src="'https://scm.trc.com/' + dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'relevanceprop',
  data() {
    return {
      searchParams: {
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      isSubmit: false, // 多次点击
      dialogImageUrl: '', // 大图路径
      imgShow: false, // 大图弹窗
      queryString: '', // 查询参数
      choseedList: [], // 已添加的属性列表
      propsList: [], // 属性列表
      propNameList: [], // 属性值列表
      result: [],
      deleteRowList: [], // 删除的数组
      delRecordList: [], // 老的
      brandName: '', // 品牌名字
      multipleSelection: [],
      dialogFormVisible: false, // 关联品牌弹窗
      tableDataList: [], // 搜索列表
      propList: [], // 品牌列表
      totalCount: 0, // 总页码
      params: {
        name: '', // 品牌名称
        pageIds: ''
        // start: 0,
        // pageSize: 10,
        // pageNo: 1
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
    this.categoryProperty();
  },
  methods: {
    showBig(url) {
      this.dialogImageUrl = url;
      this.imgShow = true;
    },
    // 获取品牌名字
    initData() {
      this.$AXIOS.LISTGET('/category/query/' + this.id, { id: this.id }).then(res => {
        this.brandName = res.result || '';
      });
    },
    // 获取分类列表
    categoryProperty() {
      this.$AXIOS.LISTGET('/category/categoryProperty/' + this.id).then(res => {
        this.delRecordList = res.result || [];
        this.tableDataList = res.result || [];
        this.result = res.result || [];
        this.tableDataList.forEach(item => {
          item.source = 0;
          item.status = 2;
          item.sortStatus = 1;
          item.propertySort = 0;
        });
        this.searchParams.totalCount = this.tableDataList.length;
      });
    },
    // 获取属性列表
    getBrandPageCategory() {
      this.propNameList = [];
      this.$AXIOS.LISTGET('/category/propertyall', { queryString: this.queryString }).then(res => {
        this.propsList = res.result || [];
        console.log(this.choseedList);
        this.propsList.forEach(item => {
          if (this.choseedList.indexOf(item.id) > -1) {
            item.isShow = true;
          } else {
            item.isShow = false;
          }
        });
      });
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
    // 选择属性名称
    getSearchProp(propertyId) {
      this.$AXIOS.LISTGET('/category/propertyValues/search', { propertyId }).then(res => {
        this.propNameList = res.result || [];
      });
    },
    // 品牌管理关联保存
    getBrandLink(params) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      this.$AXIOS.PUT('/category/updateProperty/' + this.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/classifymanage' });
      });
    },
    // 获取属性值
    propChange(val) {
      this.inputVal = val;
      this.getSearchProp(val);
    },
    // 选择品牌
    choseBrand() {
      this.dialogFormVisible = true;
      this.inputVal = '';
      this.queryString = '';
      this.propNameList = [];
      let arr = [];
      this.tableDataList.forEach(item => {
        arr.push(item.propertyId);
      });
      this.choseedList = arr;
      this.getBrandPageCategory();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    searchQuery() {
      this.tableDataList = this.result.filter(item => {
        return item.brandName.match(this.inputVal);
      });
    },
    // 字典翻译
    checkProp(type) {
      return this.$utils.querydiction('propertyType', type);
    },
    // 向上移动
    moveUp(i) {
      let len = this.tableDataList.length;
      if (i === 0 && this.searchParams.pageNo === 1) {
        this.$utils.messagetip.warningTip('已经到顶部了！');
        return;
      }
      let moveList = this.tableDataList.splice(((this.searchParams.pageNo - 1) * this.searchParams.pageSize) + i, 1);
      console.log(moveList);
      moveList[0].status = 2;
      moveList[0].sortStatus = 1;
      this.tableDataList.splice(((this.searchParams.pageNo - 1) * this.searchParams.pageSize) + i - 1, 0, moveList[0]);
    },
    // 向下移动
    moveDown(i) {
      let len = this.tableDataList.length;
      let count = Math.ceil(len / this.searchParams.pageSize);
      let pageSize = len % this.searchParams.pageSize;
      console.log(count);
      console.log(pageSize);
      if (count === this.searchParams.pageNo && i === (pageSize - 1)) {
        this.$utils.messagetip.warningTip('已经到底部了！');
        return;
      }
      let moveList = this.tableDataList.splice(((this.searchParams.pageNo - 1) * this.searchParams.pageSize) + i, 1);
      moveList[0].status = 2;
      moveList[0].sortStatus = 1;
      this.tableDataList.splice(((this.searchParams.pageNo - 1) * this.searchParams.pageSize) + i + 1, 0, moveList[0]);
    },
    deleteRow(i) {
      console.log(i);
      let result = this.tableDataList.splice(i, 1);
      console.log(result);
      this.deleteRowList.push(result[0]);
      this.searchParams.totalCount = this.tableDataList.length;
      let pageNumber = Math.ceil(this.searchParams.totalCount / this.searchParams.pageSize);
      if (this.searchParams.totalCount % this.searchParams.pageSize === 0 && (this.searchParams.pageNo !== pageNumber)) {
        console.log('0000000');
        this.tableChangeNumber(this.searchParams.pageNo - 1);
      }
    },
    // 确定
    makeSure() {
      if (this.inputVal === '') {
        this.$utils.messagetip.warningTip('请至少选择一条关联属性');
        return;
      }
      this.propsList.forEach(item => {
        if (item.id === this.inputVal) {
          let obj = {
            id: item.id,
            propertyId: item.id,
            isValid: item.isValid,
            isDeleted: item.isDeleted,
            name: item.name,
            typeCode: item.typeCode,
            source: '1', // source:0-查询的数据,1-新增的数据
            status: '1', // status:0-未更新,1-新增,2-已更新,3-已删除
            sortStatus: '1', // sortStatus:0-排序字段未更新,1-排序字段已更新
            propertySort: 0
          };
          this.tableDataList.unshift(obj);
        }
      });
      this.dialogFormVisible = false;
      this.searchParams.totalCount = this.tableDataList.length;
      this.tableChangeNumber(1);
    },
    // 保存
    saveData() {
      console.log(this.tableDataList);
      if (this.tableDataList && !this.tableDataList.length) {
        this.$utils.messagetip.warningTip('请至少选择一条关联属性');
        return;
      }
      console.log(this.delRecordList);
      this.deleteRowList.forEach(item => {
        item.status = 3;
      });
      this.tableDataList.forEach((item, i) => {
        item.propertySort = i;
      });
      let params = {
        jsonDate: JSON.stringify([...this.tableDataList, ...this.deleteRowList])
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
<style lang='stylus'>
.paging
  text-align: right
  margin: 15px
</style>

