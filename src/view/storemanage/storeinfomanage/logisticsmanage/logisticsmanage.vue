<template>
  <div class="logisticsmanage">
    <!-- 表单 -->
    <el-form :inline="true" :model="searchParams" ref="queryForm" class="search_form" size="medium">
      <el-row>
        <el-col>
          <el-form-item label="物流公司名称：" size="mini">
            <el-input v-model.trim="searchParams.logisticsCorporationName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="物流公司编号：" size="mini">
            <el-input v-model.trim="searchParams.logisticsCode" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="状态：" size="mini">
            <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
              <el-option v-for="item in isValidList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流公司类型：" size="mini">
            <el-select v-model="searchParams.logisticsCorporationType" filterable placeholder="请选择">
              <el-option v-for="item in logisticsCorporationTypeList" :key="item.id" :label="item.name" :value="item.id">
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
        <el-button type="primary" v-if="userName == 'admin'" size="mini" @click="toAddOrEdit(null)"> + 新增物流公司</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="物流公司编号" prop="logisticsCode" align="center"></el-table-column>
      <el-table-column label="物流公司名称" prop="logisticsCorporationName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="物流公司类型" prop="logisticsCorporationType" align="center">
        <template slot-scope="scope">
          {{checkedType('logisticsCorporationType', scope.row.logisticsCorporationType)}}
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contacts" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="联系人电话" prop="contactsNumber" align="center"></el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isValid === 1">启用</div>
          <div v-else-if="scope.row.isValid === 0" style="color: orange;">停用</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.logisticsCode.indexOf('WL')>=0 && userName == 'admin'">
            <el-button type="text" size="mini" @click="toAddOrEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toggleIsValid(scope.row.id, scope.row.isValid)">{{ scope.row.isValid === 1 ? '停用' : '启用'}}</el-button>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 自采商品管理列表 弹窗 -->
    <el-dialog title="编辑物流公司" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="125px" class="search_form" size="medium">
        <!-- 第一行 -->
        <el-row :span="24">
          <el-col :span="10">
            <el-form-item label="物流公司编号：" size="mini">
              <el-input v-model.trim="form.logisticsCode" placeholder="保存后自动生成" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="物流公司名称：" :rules="[{ required: true, message: '物流公司名称不能为空', trigger: 'blur' }]" size="mini">
              <el-input v-model.trim="form.logisticsCorporationName" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="20px" size="mini">
              <el-button type="text" v-if="form.id != ''" @click="initLogDataList">操作日志</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="24">
          <el-col :span="10">
            <el-form-item label="物流公司类型：" :rules="[{ required: true, message: '物流公司类型不能为空', trigger: 'blur' }]" size="mini">
              <el-select v-model="form.logisticsCorporationType" filterable placeholder="请选择">
                <el-option v-for="item in logisticsCorporationTypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人：" size="mini">
              <el-input v-model.trim="form.contacts" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-input v-model.trim="form.id" type="hidden"></el-input>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="10">
            <el-form-item label="联系人电话：" size="mini">
              <el-input v-model.trim="form.contactsNumber" placeholder=""  maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态：" :rules="[{ required: true}]" size="mini">
              <el-radio-group v-model="form.isValid">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="20">
            <el-form-item label="备注：" size="mini">
              <el-input v-model.trim="form.remark" type="textarea" :rows="3" placeholder=""  maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" center>
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="makeSureAddLogistic" size="mini">确 定</el-button>
      </div>
      <el-dialog title="操作日志" :visible.sync="dialogLogsVisible" append-to-body>
        <!-- 分页 -->
        <el-row type="flex" justify="space-between">
          <el-col>
          </el-col>
          <el-row class="paging">
            <el-pagination @size-change="changeLogSize" @current-change="changeLogNumber" :current-page="logPager.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="logPager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalLogCount">
            </el-pagination>
          </el-row>
        </el-row>
        <!-- 操作日志表格 -->
        <el-table :data="tableLogDataList" border tooltip-effect="dark">
          <el-table-column label="动作" prop="operation" align="center"></el-table-column>
          <el-table-column label="操作人" prop="operator" align="center"></el-table-column>
          <el-table-column label="操作时间" prop="operateTimeString" align="center"></el-table-column>
          <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" center>
          <el-button type="primary" @click="dialogLogsVisible = false" size="mini">关 闭</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'logisticsmanage',
  data() {
    return {
      userName: '',
      tableDataList: [], // 列表
      tableLogDataList: [], // 列表
      searchParams: {
        logisticsCorporationName: '',
        logisticsCode: '',
        isValid: '',
        logisticsCorporationType: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      form: {
        id: '',
        logisticsCode: '',
        logisticsCorporationName: '',
        logisticsCorporationType: '',
        contacts: '',
        contactsNumber: '',
        isValid: '1',
        remark: ''
      },
      logPager: {
        entityType: 'LogisticsCorporation',
        entityId: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      totalCount: 0, // 总页码
      totalLogCount: 0, // 总页码
      dialogFormVisible: false, // 表单弹窗
      dialogLogsVisible: false, // 日志弹窗
      isValidList: [
        {
          id: '',
          name: '请选择'
        },
        {
          id: '1',
          name: '启用'
        },
        {
          id: '0',
          name: '停用'
        }
      ],
      logisticsCorporationTypeList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '0',
          name: '快递企业'
        },
        {
          id: '1',
          name: '货运企业'
        }
      ]
      // rules: {
      //   logisticsCorporationName: [
      //     { required: true, message: '物流公司名称不能为空', trigger: 'blur' }
      //   ],
      //   logisticsCorporationType: [
      //     { required: true, message: '物流公司类型不能为空', trigger: 'blur' }
      //   ],
      //   isValid: [
      //     { required: true, message: '状态不能为空', trigger: 'blur' }
      //   ]
      // }
    };
  },
  created() {
    this.initDataList();
    this.getUserName();
  },
  methods: {
    getUserName() {
        this.$AXIOS.GET('/accredit/getName').then(res => {
            this.userName = res.result;
        });
    },
    initDataList() {
      this.$AXIOS.LISTGET('/system/logisticsCorporationPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
      });
    },
    initLogDataList() {
      this.dialogLogsVisible = true;
      this.logPager.entityId = this.form.id;
      this.$AXIOS.LISTGET('/logInfoPage', this.logPager).then(res => {
        this.tableLogDataList = res.result;
        this.totalLogCount = res.totalCount;
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
        logisticsCorporationName: '',
        logisticsCode: '',
        isValid: '',
        logisticsCorporationType: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 重置搜索条件
    resetAddOrEditForm() {
      this.form = {
        id: '',
        logisticsCode: '',
        logisticsCorporationName: '',
        logisticsCorporationType: '',
        contacts: '',
        contactsNumber: '',
        isValid: '1',
        remark: ''
      }; // 请求参数
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
    // 页码条数改变
    changeLogSize(val) {
      this.logPager.start = 0;
      this.logPager.pageNo = 1;
      this.logPager.pageSize = val;
      this.initLogDataList();
    },
    // 当前页码改变
    changeLogNumber(val) {
      this.logPager.start = (val - 1) * this.logPager.pageSize;
      this.logPager.pageNo = val;
      this.initLogDataList();
    },
    // 字典翻译仓库
    checkedType(type, val) {
      return this.$utils.querydiction(type, val);
    },
    // 添加/编辑物流公司
    toAddOrEdit(logisticRow) {
      this.resetAddOrEditForm();
      if (logisticRow != null) {
        this.form.id = logisticRow.id;
        this.form.logisticsCode = logisticRow.logisticsCode;
        this.form.logisticsCorporationName = logisticRow.logisticsCorporationName;
        this.form.logisticsCorporationType = logisticRow.logisticsCorporationType;
        this.form.contacts = logisticRow.contacts;
        this.form.contactsNumber = logisticRow.contactsNumber;
        this.form.isValid = logisticRow.isValid + '';
        this.form.remark = logisticRow.remark;
      }
      // this.getbrandNameList(this.searchParams.supplierCode);
      this.dialogFormVisible = true;
    },
    // 切换状态btn
    updateState(id, isValid) {
      this.$AXIOS.PUT('/system/updateState/' + id, { isValid }).then(res => {
        if (res.appcode === '1') {
          this.initDataList();
        }
      });
    },
    toggleIsValid(id, isValid) {
      let isResult = '';
      if (isValid === 1) {
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
          this.updateState(id, isValid);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    makeSureAddLogistic() {
      // 新增
      if (this.form.id === '') {
        this.$AXIOS.POST('/system/logisticsCorporation/', this.form).then(res => {
          this.dialogFormVisible = false;
          this.searchFormData();
        });
      } else {
        // 编辑
        this.$AXIOS.PUT('/system/logisticsCorporation/' + this.form.id, this.form).then(res => {
          this.dialogFormVisible = false;
          this.searchFormData();
        });
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>
