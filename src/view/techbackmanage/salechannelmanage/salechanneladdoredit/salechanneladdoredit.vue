<template>
  <div class="salechanneladdoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span v-if="this.$route.params.id !== 'add'">修改销售渠道</span>
        <span v-else>新增销售渠道</span>
        <el-button
          v-if="id && id !== 'add'"
          style="float: right; padding: 3px 0"
          type="text"
          @click="openOperateDialog"
        >操作日志</el-button>
      </div>
      <!-- 第一行 -->
      <el-row
        :span="22"
        v-if="this.$route.params.id !== 'add'"
      >
        <el-col :span="2" class="title tip_red">销售渠道编号：</el-col>
        <el-col :span="7" class="content">{{searchParams.sellCode ? searchParams.sellCode : '保存后系统自动生成'}}</el-col>
      </el-row>
      <!-- 第一行 -->
      <el-row :span="22">
        <el-col :span="2" class="title tip_red">销售渠道名称：</el-col>
        <el-col :span="7" class="content">
          <el-input
            v-model.trim="searchParams.sellName"
            maxlength="100"
            placeholder=""
            size="mini"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :span="22">
        <el-col :span="2" class="title tip_red">销售渠道类型：</el-col>
        <el-col :span="7" >
          <el-select v-model="searchParams.sellType" placeholder="请选择" @change='sellTypeChange' size="mini">
            <el-option
                v-for="item in salesChannelTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="2" class="title tip_red" v-if="searchParams.sellType === '2'">门店销售系统内门店ID：</el-col>
        <el-col :span="7"  v-if="searchParams.sellType === '2'">
          <el-input
            v-model.trim="searchParams.storeId"
            maxlength="32"
            placeholder=""
            size="mini"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :span="22" style="margin-top: 15px">
        <el-col :span="2" class="title tip_red">渠道关联客户：</el-col>
        <el-col :span="7" class="content">
          <el-select v-model="searchParams.customerCode" filterable placeholder="请选择" size="mini">
            <el-option
                v-for="item in customList"
                :key="item.customerCode"
                :label="item.customerName"
                :value="item.customerCode">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :span="22" >
        <el-col :span="2" class="title tip_red">渠道关联组织：</el-col>
        <el-col :span="7" class="content">
          <el-select v-model="searchParams.organizationCode" filterable placeholder="请选择" size="mini">
            <el-option
                v-for="item in organList"
                :key="item.organizationCode"
                :label="item.organizationName"
                :value="item.organizationCode">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :span="22" >
        <el-col :span="2" class="title tip_red">渠道关联部门：</el-col>
        <el-col :span="7" class="content">
          <el-select v-model="searchParams.departmentCode" filterable placeholder="请选择" size="mini">
            <el-option
                v-for="item in departmentList"
                :key="item.departmentCode"
                :label="item.departmentName"
                :value="item.departmentCode">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :span="22" >
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
        @click="getWarehouseList"
      >保存</el-button>
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
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
  </div>
</template>
<script>
// import { pca, pcaa } from 'area-data'; // v5 or higher
// import returnreceiptVue from '../../../../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
  name: 'salechanneladdoredit',
  data() {
    return {
      isClick: false, // 重复点击
      salesChannelTypeList: [{name: '请选择', value: ''}], // 业务线销售渠道列表
      customList: [],
      organList: [],
      departmentList: [], // 部门列表
      checkList: [], // 多选框选中的
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'SellChannel',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      id: '', // 主键
      selected: [],
      searchParams: {
        customerCode: '',
        organizationCode: '',
        departmentCode: '',
        isValid: '1',
        code: '', // 编号
        name: '', // 名称
        sellType: '', // 类型
        remark: '' // 备注
      }
    };
  },
  created() {
    if (this.$route.params.id !== 'add') {
      this.id = this.$route.params.id;
      this.getSearchParams();
      this.operateParams.entityId = this.id;
    }
    this.getSalesChannelType(); // 获取业务线渠道类型
    this.getCustomList(); //
    this.getOrganList(); //
    this.getDepartmentList(); //
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
    getCustomList() {
      this.$AXIOS.GET('/customer/list').then(res => {
        this.customList = res.result;
      });
    },
    getOrganList() {
      this.$AXIOS.GET('/organization/list').then(res => {
        this.organList = res.result;
      });
    },
    getDepartmentList() {
      this.$AXIOS.GET('/department/list').then(res => {
        this.departmentList = res.result;
      });
    },
    // 查询仓库
    getWarehouseList() {
      if (!this.searchParams.sellName) {
        this.$utils.messagetip.warningTip('销售渠道名称不能为空！');
        return;
      }
      if (this.searchParams.sellType === '' || this.searchParams.sellType === null) {
        this.$utils.messagetip.warningTip('请选择销售渠道类型！');
        return;
      }
      if (this.searchParams.sellType === '2') {
        if (!this.searchParams.storeId) {
          this.$utils.messagetip.warningTip('门店销售系统内门店ID不能为空！');
        return;
        }
      }
      if (this.searchParams.customerCode === '' || this.searchParams.customerCode === null) {
        this.$message({
          type: 'warning',
          message: '请选择渠道关联客户！'
        });
        return;
      }
      if (this.searchParams.organizationCode === '' || this.searchParams.organizationCode === null) {
        this.$message({
          type: 'warning',
          message: '请选择渠道关联组织！'
        });
        return;
      }
      if (this.searchParams.departmentCode === '' || this.searchParams.departmentCode === null) {
        this.$message({
          type: 'warning',
          message: '请选择渠道关联部门！'
        });
        return;
      }
      this.isClick = true;
      let params = {};
      params.name = this.searchParams.sellName;
      if (this.id !== 'add') {
        params.id = this.id;
      }
      this.$AXIOS
        .GET('/system/sellChannelName', params)
        .then(res => {
          if (this.searchParams.sellCode) {
            this.updateSave();
          } else {
            this.save();
          }
        });
    },
    // 新增仓库保存
    save() {
      let params = {};
      params.customerCode = this.searchParams.customerCode;
      params.isValid = this.searchParams.isValid;
      params.sellName = this.searchParams.sellName;
      params.sellType = this.searchParams.sellType;
      params.organizationCode = this.searchParams.organizationCode;
      params.departmentCode = this.searchParams.departmentCode;
      if (this.searchParams.sellType === '2') {
        params.storeId = this.searchParams.storeId;
      }
      params.remark = this.searchParams.remark;
      this.$AXIOS.POST('/system/save/sellChannel', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/salechannelmanage' });
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 更新业务线
    updateSave() {
      let params = {};
      params.customerCode = this.searchParams.customerCode;
      params.isValid = this.searchParams.isValid;
      params.sellCode = this.searchParams.sellCode;
      params.sellName = this.searchParams.sellName;
      params.sellType = this.searchParams.sellType;
      params.organizationCode = this.searchParams.organizationCode;
      params.departmentCode = this.searchParams.departmentCode;
      if (this.searchParams.sellType === '2') {
        params.storeId = this.searchParams.storeId;
      }
      params.id = this.searchParams.id;
      params.remark = this.searchParams.remark;
      this.$AXIOS
        .PUT('/system/update/sellChannel/' + params.id, params)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.$router.push({ path: '/salechannelmanage' });
        }).finally(() => {
          this.isClick = false;
        });
    },
    // 获取业务线绑定渠道列表
    getSearchParams() {
      this.$AXIOS.GET('/system/sellChannel/' + this.id).then(res => {
        this.searchParams = res.result;
      });
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/salechannelmanage' });
    }
  }
};
</script>
<style lang="stylus" scoped>
.salechanneladdoredit
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

