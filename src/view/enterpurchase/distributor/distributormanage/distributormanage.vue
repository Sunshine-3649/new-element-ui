<template>
  <div class="distributormanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="公司名称：" prop="allocateOrderCode" size="mini">
            <el-input v-model.trim="searchParams.companyName" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号：" prop="allocateOrderCode" size="mini">
            <el-input v-model.trim="searchParams.mobile" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号状态：" size="mini">
            <el-select v-model="searchParams.isValid" placeholder="请选择">
              <el-option v-for="item in accountList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="定价计划：" prop="allocateOrderCode" size="mini">
            <!-- <el-input v-model.trim="searchParams.planCode" placeholder=""></el-input> -->
            <el-select filterable v-model="searchParams.planCode" placeholder="请选择">
                <el-option v-for="item in planCodeList" :key="item.value" :label="item.label"  :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="联系人：" prop="allocateOrderCode" size="mini">
            <el-input v-model.trim="searchParams.contact" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="更新时间：" size="mini">
            <el-col :span="11">
              <el-form-item prop="startDate" size="mini">
                <el-date-picker v-model="searchParams.starCreateTime" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate" size="mini">
                <el-date-picker v-model="searchParams.endCreateTime" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchData('distribut')">搜索</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">清空条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <el-row class="btn_group">
      <el-button size="mini" type="primary" @click="toManageAdd('add')">新增分销商</el-button>
      <el-button size="mini" :disabled="checked" @click="settingPlan" type="primary">设置定价计划</el-button>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" @select="selectBox" @select-all="selectAll" :data="tableData.objects" border tooltip-effect="dark" style="width: 100%;margin-top:20px;">
      <el-table-column :selectable="checkSelectable" type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="公司全称" prop="companyName"  align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="登录账号" prop="loginAccount"  align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="" align="center">
          <template slot-scope="scope">
              {{ scope.row.isValid == 0 ? '停用' : '启用'}}
          </template>
      </el-table-column>
      <el-table-column label="定价计划" prop="pricePlanName" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="" align="center">
          <template slot-scope="scope">
              {{ scope.row.createTime | filter-time }}
          </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contact" align="center"></el-table-column>
      <el-table-column label="联系电话" prop="" align="center">
          <template slot-scope="scope">
              {{ scope.row.mobile ? scope.row.mobile : scope.row.phone}}
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="toManageAddOrEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="toggleStatus(scope.$index, scope.row)">
            {{  scope.row.isValid == 0 ? '启用' : '停用' }}
          </el-button>
          <el-button size="mini" type="text" @click="toManageDetail(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
      </el-pagination>
    </el-row>

    <!-- 设置计划弹窗 -->
    <div class="dialogTable">
        <el-dialog :width="planDialogWidth"  title="设置定价计划"  :visible.sync="dialogTableVisible">
            <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
                <el-row :span="20">
                    <el-col :span="8">
                        <el-form-item label="计划名称：" prop="allocateOrderCode" size="mini">
                            <el-input v-model.trim="planSearchParams.pricePlanName" placeholder="请输入计划名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="mini">
                            <el-button type="primary" icon="search" @click="searchData('plan')">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table border :data="planData" >
                <el-table-column width="50" align="center"  property="date"  >
                    <template slot-scope="scope">
                        <el-radio @change="radioChange(scope.row)" v-model="radioSingle" :label="scope.$index"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" type="index" property="date" label="序号" width="150"></el-table-column>
                <el-table-column align="center" property="pricePlanName" label="计划名称" width="200"></el-table-column>
                <el-table-column align="center" property="" label="计划状态">
                    <template slot-scope="scope">
                        {{  scope.row.isValid === '0' ? '停用' : '启用' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" property="relateDistributorNum" label="关联分销商数量"></el-table-column>
                <el-table-column align="center" property="updateTime" label="更新时间"></el-table-column>
            </el-table>
            <el-pagination style="text-align:right; padding:20px 0;" @size-change="changeSize1" @current-change="changeNumber2" :current-page="planSearchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="planSearchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="planSearchParams.recordTotal">
            </el-pagination>
            <el-row class="btn_group" style="text-align:center">
                <el-button size="mini" :disabled="planCode ? false : true" @click="planConfirm" type="primary">设置</el-button>
                <el-button size="mini"  @click="dialogTableVisible = false" >关闭</el-button>
            </el-row>
        </el-dialog>
    </div>

  </div>
</template>

<script>
import thirdSelect from '../../../../components/select';

export default {
  name: 'distributormanage',
  components: { thirdSelect },
  data() {
    return {
      radioSingle: '', // 单选选中
      searchParams: {  // 分销商查询数据
        starCreateTime: '',
        endCreateTime: '',
        mobile: '',
        companyName: '',
        contact: '',
        planCode: '',
        pageSize: 10,
        pageNumber: 1,
        recordTotal: 0
      },
      planSearchParams: { // 计划列表查询数据
        isValid: '1',  // 启用的定价计划
        pricePlanName: '',
        pageSize: 10,
        pageNumber: 1,
        recordTotal: 0
      },
      accountList: [
        {
          value: '0',
          label: '停用'
        },
        {
          value: '1',
          label: '启用'
        }
      ],
      selectUrl: '/category/queryCategory',
      tableData: [], // 分销商列表数据
      planData: [], // 计划列表数据
      checked: true,   // 是否选择了分销商可以设置定价计划
      dialogTableVisible: false, // 计划列表弹窗的显示和隐藏
      planDialogWidth: '60%',
      planCode: '', // 分销商所选的计划code
      distributorCodeList: [], // 分销商编号集合
      planCodeList: []   // 定价计划列表
    };
  },
  mounted: function() {
      this.initDataList(this.searchParams);
      this.planDataListAll();
  },
  methods: {
      // 新增计划弹窗
    settingPlan() {
        this.planCode = '';
        this.radioSingle = '';
        this.planSearchParams.pricePlanName = '';
        this.planDataList(this.planSearchParams);
        this.dialogTableVisible = true;
    },
    // 选择计划事件
    radioChange(val) {
        this.planCode = val.pricePlanCode;
    },
    // 确认设置计划名称
    planConfirm() {
        let data = {
            planCode: this.planCode,
            distributorCodeList: this.distributorCodeList
        };
        this.POST('/busiDistributor/setPricePlan', data).then( res => {
            this.$utils.messagetip.successTip('设置成功');
            this.checked = true;
            this.dialogTableVisible = false;
            this.resetForm();
            this.initDataList(this.searchParams);
        });
    },
    checkSelectable(row, index) {
      // 判断表格单选框是否显示
      return row.isValid === '1';
    },
    // 单个选择事件
    selectBox(selectArr) {
        this.distributorCodeList = [];
        if (selectArr.length > 0) {
            this.checked = false;
            selectArr.map((item, index) => {
                this.distributorCodeList.push(item.distributorCode);
            });
        } else {
            this.checked = true;
        }
    },
    // 全选分销商选择事件
    selectAll(selectArr) {
        this.distributorCodeList = [];
        if (selectArr.length > 0) {
            this.checked = false;
            selectArr.map((item, index) => {
                this.distributorCodeList.push(item.distributorCode);
            });
        } else {
            this.checked = true;
        }
    },
    // 时间过滤
    filterTime(time) {
         let d = new Date(time);
         let times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
         return times;
    },
    // 搜索条件
    searchData(str) {
        this.planCode = '';
        this.radioSingle = '';
        if (str === 'plan') {
            this.planSearchParams.pageNumber = 1;
            this.planDataList(this.planSearchParams);
        } else if (str === 'distribut') {
            if (this.searchParams.starCreateTime && this.searchParams.endCreateTime) {
                if (this.searchParams.starCreateTime > this.searchParams.endCreateTime) {
                    this.$utils.messagetip.warningTip('结束日期不能小于起始日期！');
                    return;
                } else {
                    this.searchParams.starCreateTime = this.searchParams.starCreateTime + ' ' + '00:00:00';
                    this.searchParams.endCreateTime = this.searchParams.endCreateTime + ' ' + '23:59:59';
                }
            }
            this.searchParams.pageNumber = 1;
            this.initDataList(this.searchParams);
        }
    },
    // 分销商列表初始化数据
    initDataList(data) {
        this.GET('/busiDistributor/queryDistributorPage', data).then(res => {
          this.tableData = res.body;
          this.searchParams.recordTotal = res.body.recordTotal;
        });
    },
    // 计划列表数据
    planDataList(data) {
        this.GET('/busiPricePlan/queryPricePlanList', data).then( res => {
            this.planData = res.body.objects;
            this.planSearchParams.recordTotal = res.body.recordTotal;
        });
    },
    // 查询计划的所有列表事件
    planDataListAll() {
        let data = {
            pricePlanName: '',
            pricePlanCode: ''
        };
        this.GET('/busiPricePlan/queryPricePlans', data).then( res => {
            this.planCodeList = res.body.map((item, index) => {
                return {
                    label: item.pricePlanName,
                    value: item.pricePlanCode
                };
            });
        });
    },
    // 重置搜索条件
    resetForm() {
        for (let obj in this.searchParams) {
            if (obj === 'pageSize' || obj === 'pageNumber' || obj === 'recordTotal') {
                continue;
            } else {
                this.searchParams[obj] = '';
            }
        }
        this.initDataList(this.searchParams);
    },
    // 去往编辑页
    toManageAddOrEdit(index, row) {
      this.$router.push({name: 'manageaddoredit', params: { id: row.distributorCode }});
    },
    // 去往新增页
    toManageAdd(str) {
        this.$router.push({name: 'manageaddoredit', params: { id: str }});
    },
    // 详情页
    toManageDetail(id, row) {
      this.$router.push({
        path: '/distributormanage/managedetail/' + row.distributorCode
      });
    },
    // 起停用状态
    toggleStatus(index, row) {
      let isValid, msg;
       if (row.isValid === '0') {
         isValid = '1';
         msg = '启用成功';
       } else if (row.isValid === '1') {
         isValid = '0';
         msg = '停用成功';
       }
      this.GET(`/busiDistributor/updateDistributorSataus/${row.distributorCode}/${isValid}/${row.id}`).then( res => {
          this.initDataList(this.searchParams);
          this.$utils.messagetip.successTip(msg);
      });
    },
    // 分销商页码条数改变
    changeSize(val) {
        this.searchParams.pageSize = val;
        this.initDataList(this.searchParams);
    },
    // 分销商当前页码改变
    changeNumber(val) {
        this.searchParams.pageNumber = val;
        this.initDataList(this.searchParams);
    },
    // 计划列表页码事件
    changeSize1(val) {
        this.planSearchParams.pageSize = val;
        this.planDataList(this.planSearchParams);
    },
    // 计划列表页码事件
    changeNumber2(val) {
        this.planSearchParams.pageNumber = val;
        this.planDataList(this.planSearchParams);
    }
  }
};
</script>

<style lang="stylus" scoped>
.distributormanage
  .paging
    text-align: right
    margin-top: 15px
</style>
