<template>
  <div class="propmanage">
    <!-- 表单 -->
    <el-form :inline="true" :model="searchParams" ref="queryForm" class="search_form" size="medium">
      <el-row>
        <el-col>
          <el-form-item label="属性名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="属性类型：" size="mini">
            <el-select v-model="searchParams.typeCode" filterable placeholder="请选择">
              <el-option v-for="item in typeCodeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" size="mini">
            <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
              <el-option v-for="item in isValidList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" @click="toAddOrEdit('')"> + 新增属性</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="属性名称" prop="name" align="center"></el-table-column>
      <el-table-column label="属性类型" prop="typeCode" align="center">
        <template slot-scope="scope">
          {{checkedType('propertyType', scope.row.typeCode)}}
        </template>
      </el-table-column>
      <el-table-column label="属性值类型" prop="valueType" align="center">
        <template slot-scope="scope">
          {{checkedType('propertyValueType', scope.row.valueType)}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center"></el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isValid === '1'">启用</div>
          <div v-else-if="scope.row.isValid === '0'" style="color: orange;">停用</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="最近更新人" prop="lastEditOperator" align="center"></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.id.toString() === nameId" size="mini" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" :disabled="scope.row.id.toString() === nameId" size="mini" @click="toggleIsValid(scope.row)">{{ scope.row.isValid === '1' ? '停用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'propmanage',
  data() {
    return {
      nameId: '', // 属性为规格的id
      searchParams: {
        name: '',
        typeCode: '',
        isValid: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      tableDataList: [],
      typeCodeList: [],
      isValidList: []
    };
  },
  created() {
    this.$AXIOS.LISTGET('/config/dicts', {typeCode: 'ITEM_DEFAULT_PROPERTY'}).then(res => {
        let result = res.result;
        result.forEach(item => {
          if (item.value === 'PROPERTY_NAME') {
            this.nameId = item.name;
            console.log(this.nameId);
          }
        });
      });
    this.typeCodeList = this.$utils.querydiction('propertyType');
    this.typeCodeList.unshift({name: '全部', value: ''});
    this.isValidList = this.$utils.querydiction('isValid');
    this.isValidList.unshift({name: '全部', value: ''});
    this.initDataList();
  },
  methods: {
    initDataList() {
      this.$AXIOS.LISTGET('/category/propertyPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.searchParams.totalCount = res.totalCount;
      });
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        name: '',
        typeCode: '',
        isValid: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    toAddOrEdit(id) {
        if (id) {
            this.$router.push({name: 'propaddoredit', params: {id: id}, query: {isadd: 0}});
        } else {
            this.$router.push({name: 'propaddoredit', params: {id: 'add'}, query: {isadd: 1}});
        }
    },
    // 字典翻译仓库
    checkedType(type, val) {
      return this.$utils.querydiction(type, val);
    },
    // 切换状态btn
    updateState(rowData) {
      this.$AXIOS.PUT('/category/property/state/' + rowData.id, rowData).then(res => {
        if (res.appcode === '1') {
          this.initDataList();
          this.$utils.messagetip.successTip(res.databuffer);
        }
      });
    },
    toggleIsValid(rowData) {
      let isResult = '';
      if (rowData.isValid === '1') {
        isResult = '停用';
      } else {
        isResult = '启用';
      }
      this.$confirm(`您确认要${isResult}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateState(rowData);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消!');
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>
