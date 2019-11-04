<template>
  <div class="brandmanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="品牌名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌状态：" size="mini">
            <el-select v-model="searchParams.isValid" filterable>
              <el-option v-for="item in isValidList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="更新日期：" size="mini">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.startUpdateTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker v-model="searchParams.endUpdateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toAddOrEdit('add')">新增品牌</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark" height="453" style="width: 100%;margin-top:20px;">
      <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->
      <el-table-column label="品牌名称" prop="name" align="center" show-overflow-tooltip >
        <template slot-scope="scope">
          <div style="white-space: pre">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="品牌别名" prop="alise" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="品牌LOGO" prop="logo" align="center">
        <template slot-scope="scope">
          <div style="width: 50px;margin: 0 auto;cursor: pointer;">
            <img :src="scope.row.logo" alt="" @click="handlePictureCardPreview(scope.row.logo)">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌网址" prop="webUrl" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="scope.row.webUrl" alt="" target='_blank' style="color: blue !important">{{scope.row.webUrl}}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
          {{checkOutValid(scope.row.isValid)}}
        </template>
      </el-table-column>
      <el-table-column label="最近更新人" prop="lastEditOperator" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.isValid === '1'" size="mini" type="text" @click="toggleIsValid(scope.row.isValid, scope.row)">停用</el-button>
          <el-button v-else size="mini" type="text" @click="toggleIsValid(scope.row.isValid, scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'brandmanage',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      tableDataList: [], // 列表
      totalCount: 0,
      searchParams: {
        start: 0,
        name: '', // 品牌名称
        startUpdateTime: '', // 开始时间
        endUpdateTime: '', // 结束时间
        isValid: '1', // 状态
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      isValidList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '启用'
        },
        {
          id: '0',
          name: '停用'
        }
      ]
    };
  },
  created() {
    this.initDataList();
  },
  watch: {

  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },
    toAddOrEdit(id) {
        // this.$store.dispatch('selectChannel/setKeepalive', {
        //     name: 'brandaddoredit',
        //     removeKeepAlive: true
        // });
        if (id === 'add') {
            this.$router.push({path: '/brandmanage/brandaddoredit/' + id, query: {reload: false, isadd: 1}});
        } else {
            this.$router.push({path: '/brandmanage/brandaddoredit/' + id, query: {reload: true, isadd: 0}});
        }
    },
    // 搜索，初始化数据
    initDataList() {
      this.$AXIOS.LISTGET('/category/brandPage', this.searchParams).then(res => {
        console.log('res: ', res);
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
    },
    // 启停用接口
    updateState(isValid, row) {
      let isValidStr = isValid === '0' ? '启用' : '停用';
      this.$AXIOS.PUT(`/category/brand/state/${row.id}`, row).then(res => {
        this.initDataList();
        this.$utils.messagetip.successTip(`已${isValidStr}!`);
      });
    },
    // 切换启停用的状态
    toggleIsValid(isValid, row) {
      let isValidStr = isValid === '0' ? '启用' : '停用';
      let isSureStr = isValid === '0' ? '可' : '将不能';
      this.$confirm('', `您确认要${isValidStr}吗?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.updateState(isValid, row);
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.initDataList();
    },
    // 筛选条件
    searchFormData() {
      if (
        new Date(this.searchParams.startUpdateTime).getTime() >
        new Date(this.searchParams.endUpdateTime).getTime()
      ) {
        this.$utils.messagetip.warningTip('开始日期不得大于结束日期');
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        start: 0,
        name: '', // 品牌名称
        startUpdateTime: '', // 开始时间
        endUpdateTime: '', // 结束时间
        isValid: '', // 状态
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    checkOutValid(isValid) {
      let str = '';
      if (isValid === '0') {
        str = '停用';
      } else if (isValid === '1') {
        str = '启用';
      }
      return str;
    }
  }
};
</script>
<style lang="stylus" scoped>
.brandmanage
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
  .btn
    cursor pointer
    color blue
</style>
