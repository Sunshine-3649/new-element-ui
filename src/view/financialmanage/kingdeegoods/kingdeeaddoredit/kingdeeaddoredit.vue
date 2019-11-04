<template>
  <div class="clientinfoaddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span v-if="this.$route.params.id !== 'add'">修改过滤商品</span>
        <span v-else>新增过滤商品</span>
        <el-button
          v-if="skuCode && skuCode !== 'add'"
          style="float: right; padding: 3px 0"
          type="text"
          @click="openOperateDialog"
        >操作日志</el-button>
      </div>
      <!-- 第一行 -->
      <el-row
        :span="22"
      >
        <el-col :span="2" class="title tip_red">商品SKU编号：</el-col>
        <el-col :span="4" class="content" >{{searchParams.skuCode}}</el-col>
        <el-col :span="3" class="content" v-if="skuCode === 'add'">
          <el-button type="primary" size="mini" @click="choseGoods">+ 选择商品</el-button>
        </el-col>
      </el-row>
      <!-- 第一行 -->
      <el-row
        :span="22"
      >
        <el-col :span="2" class="title tip_red">商品名称：</el-col>
        <el-col :span="7" class="content">{{searchParams.skuName}}</el-col>
      </el-row>
      <!-- 第一行 -->
      <el-row :span="22">
        <el-col :span="2" class="title tip_red">条形码：</el-col>
        <el-col :span="7" class="content">{{searchParams.barCode}}</el-col>
      </el-row>
      <el-row :span="22" style="margin-top: 15px;">
        <el-col :span="2" class="title">备注：</el-col>
        <el-col :span="7" >
          <el-input
            v-model.trim="searchParams.remark"
            type="textarea"
            :rows="3"
            placeholder=""
            maxlength="300"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :span='22' style="margin-top: 15px;">
        <el-col :span="2" class="title">状态：</el-col>
        <el-col :span="7" style="line-height: 23px">
          <el-radio-group v-model="searchParams.isValid">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-card>

    <div class="btn_group">
      <el-button
        size="mini"
        type="primary"
        :disabled="isClick"
        @click="save"
      >保存</el-button>
      <el-button
        size="mini"
        @click="back"
      >取消</el-button>
    </div>
    <!-- 操作日志弹窗 -->
    <el-dialog
      title="操作日志"
      :visible.sync="isLogInfo"
      width="80%"
    >
      <el-table
        :data="logInfoList"
        style="width: 100%"
        border
        height="400"
      >
        <el-table-column
          prop="operation"
          label="动作"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operateTimeString"
          label="操作时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        >
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination
          @size-change="logChangeSize"
          @current-change="logChangeNumber"
          :current-page="operateParams.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="operateParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logCount"
        >
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button
          type="primary"
          size="mini"
          @click="isLogInfo = false"
        >关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择商品"
      :visible.sync="isChoseGoods"
      width="80%">
      <!-- 表单 -->
      <el-form :model="addParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="商品SKU编号：" size="mini">
              <el-input v-model.trim="addParams.skuCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品SKU名称：" size="mini">
              <el-input v-model.trim="addParams.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条形码：" size="mini">
              <el-input v-model.trim="addParams.barCode" placeholder=""></el-input>
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
      <p style="line-height: 30px; background: yellow; color: red; padding-left: 15px">tip：单击选中要添加的商品。</p>
      <el-table v-loading='isLoading' ref="singleTable" :data="tableDataList" @current-change="handleCurrentChange" highlight-current-row border tooltip-effect="dark">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="商品SKU编号" prop="skuCode" align="center"></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品SKU名称" prop="skuName" align="center"></el-table-column>
        <el-table-column label="规格" prop="specInfo" align="center"></el-table-column>
      </el-table>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="addParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="addParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
      <div style="text-align: center">
        <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
        <el-button @click="isChoseGoods = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { pca, pcaa } from 'area-data'; // v5 or higher
// import returnreceiptVue from '../../../../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
  name: 'clientinfoaddoredit',
  data() {
    return {
      isLoading: false,
      tableDataList: [],
      searchParams: {
        skuCode: '', //
        skuName: '', //
        barCode: '', //
        isValid: '1',
        remark: ''
      },
      addParams: {
        skuCode: '', //
        skuName: '', //
        barCode: '', //
        isValid: '1',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0, // 总页码
      currentRow: null,
      isChoseGoods: false, //
      isClick: false, // 重复点击
      salesChannelTypeList: [{name: '请选择', value: ''}], // 业务线销售渠道列表
      checkList: [], // 多选框选中的
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'KingDeeFilterSku',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      id: '', // 主键
      skuCode: 'add', //
      selected: []
    };
  },
  created() {
    console.log('object');
    if (this.$route.params.id !== 'add') {
      this.skuCode = this.$route.params.id;
      this.getSearchParams();
    }
    // this.getSalesChannelType(); // 获取业务线渠道类型
  },
  filters: {
    tofixed(val) {
      let num = val.toString();
      if (num.indexOf('.') > -1 && num.split('.')[1].length > 4) {
        num = Number(num).toFixed(4);
        return num;
      }
      return num;
    }
  },
  methods: {
    makeSure() {
      if (this.currentRow === null) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的商品！'
        });
        return;
      }
      this.isChoseGoods = false;
      this.searchParams.skuCode = this.currentRow.skuCode;
      this.searchParams.skuName = this.currentRow.skuName;
      this.searchParams.barCode = this.currentRow.barCode;
    },
    // 获取审核列表数据
    initDataList() {
      this.isLoading = true;
      this.$AXIOS.LISTGET('/kingdee/skufilter/skus', this.addParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 筛选条件
    searchFormData() {
      this.addParams.pageSize = 10;
      this.addParams.pageNo = 1;
      this.addParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.addParams = {
        skuCode: '', //
        skuName: '', //
        barCode: '', //
        isValid: '', // 启停用
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.addParams.start = 0;
      this.addParams.pageNo = 1;
      this.addParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.addParams.start = (val - 1) * this.addParams.pageSize;
      this.addParams.pageNo = val;
      this.initDataList();
    },
    choseGoods() {
      this.isChoseGoods = true;
      this.resetForm();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    sellTypeChange(val) {
      this.searchParams.storeId = '';
    },
    openOperateDialog() {
      this.getLogInfo();
      this.isLogInfo = true;
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    // 页码条数改变
    logChangeSize(val) {
      this.operateParams.start = 0;
      this.operateParams.pageNo = 1;
      this.operateParams.pageSize = val;
      this.getLogInfo();
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.operateParams.pageNo = val;
      this.operateParams.start = (val - 1) * this.operateParams.pageSize;
      this.getLogInfo();
    },
    // 实时查询业务线名称
    onBlur() {
      this.$AXIOS
        .GET('/system/sellChannelName', { name: this.searchParams.sellName })
        .then(res => {
          console.log(res);
        });
    },
    // 销售渠道
    getSalesChannelType() {
      this.$AXIOS.GET('/select/selectByTypeCode/salesChannelType').then(res => {
        this.salesChannelTypeList = [...this.salesChannelTypeList, ...res.result];
      });
    },
    // 查询仓库
    save() {
      if (!this.searchParams.skuCode) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的商品！'
        });
        return;
      }
      if (!this.searchParams.skuName) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的商品！'
        });
        return;
      }
      if (!this.searchParams.barCode) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的商品！'
        });
        return;
      }
      this.isClick = true;
      this.$AXIOS
        .POST('/kingdee/skufilter/save', this.searchParams)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.$router.push({ path: '/kingdeegoods', query: {reload: true} });
        }).finally(() => {
          this.isClick = false;
        });
    },
    // 获取业务线绑定渠道列表
    getSearchParams() {
      let params = {
        skuCode: this.skuCode,
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.$AXIOS.LISTGET('/kingdee/skufilter/page', params).then(res => {
        this.searchParams = res.result[0];
        this.operateParams.entityId = this.searchParams.id;
      });
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/kingdeegoods', query: {reload: true} });
    }
  }
};
</script>
<style lang="stylus" scoped>
.clientinfoaddoredit
  .title, .content
    display: inline-block
    line-height 23px
  .title
    width: 150px
    text-align: right
    text-align right
    vertical-align top
  .content
    height: 47px
    overflow-y: auto
  .btn_group
    width: 50%
    margin-top: 15px
    text-align: center
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: yellow
    color: red
    text-align: center
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
</style>
<style lang='stylus'>
.salechanneladdoredit
  .btn_group
    width: 50%
    margin-top: 15px
    text-align: center
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: yellow
    color: red
    text-align: center
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
</style>

