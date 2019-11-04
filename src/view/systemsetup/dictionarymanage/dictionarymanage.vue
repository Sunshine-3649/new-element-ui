<template>
  <!-- 字典管理 -->
  <div class="dictionarymanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="类型名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
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
        <el-button size="mini" type="primary" @click="typeFormAddShow">新增类型</el-button>
        <el-button size="mini" type="primary" @click="dicFormAddShow">新增字典</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" :height="currentHeight">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="类型编码" prop="code" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="类型名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="说明" prop="description" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scoped">
          <el-button type="text" size="mini" @click="typeFormEditShow(scoped.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="dicParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="dicParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRowCount">
        </el-pagination>
      </el-col>
      <el-tab-pane label="字典明细" name="1">
        <el-table :data="tableRowDataList" ref="multipleRowTable" highlight-current-row border style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="类型名称" prop="typeName" align="center"></el-table-column>
          <el-table-column label="字典名称" prop="name" align="center"></el-table-column>
          <el-table-column label="字典值" prop="value" align="center"></el-table-column>
          <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scoped">
              <el-button type="text" size="mini" @click="dicFormEShow(scoped.row.id)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 类型的弹窗 -->
    <el-dialog :title="title" :visible.sync="isAddorEditShow" style="min-width: 800px;" :close-on-click-modal='false'>
      <el-form :model="typeForm" :rules="typeFormRules" ref="typeForm" style="width: 500px;">
        <el-form-item label="类型编码：" prop="code" label-width="120px" size="mini">
          <el-input v-model="typeForm.code" :maxlength="32" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="类型名称：" prop="name" label-width="120px" size="mini">
          <el-input v-model="typeForm.name" :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="说明：" label-width="120px" size="mini">
          <el-input v-model="typeForm.description" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAddorEidt" size="mini">取 消</el-button>
        <el-button type="primary" :disabled="isSure" @click="makeSureAddOrEdit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 字典的弹窗 -->
    <el-dialog :title="title" :visible.sync="isAddorEditDicShow" style="min-width: 800px;" :close-on-click-modal='false'>
      <el-form :model="dicForm" :rules="dicFormRules" ref="dicForm" style="width: 500px;">
        <el-form-item label="类型名称：" prop="typeCode" label-width="120px" size="mini">
          <el-select v-model="dicForm.typeCode" filterable placeholder="请选择">
            <el-option v-for="(item, i) in dictTypes" :key="i" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称：" prop="name" label-width="120px" size="mini">
          <el-input v-model="dicForm.name" :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="字典值：" label-width="120px" prop="value" size="mini">
          <el-input v-model="dicForm.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAddorEidt" size="mini">取 消</el-button>
        <el-button type="primary" :disabled="isSure" @click="makeSureDicAddOrEdit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dictionarymanage',
  data() {
    return {
      isEdit: false, // 默认类型可编辑
      title: '新增', // 新增类型
      isSure: false, // 确定按钮可点击一次
      isAddorEditShow: false, // 新增编辑显示
      isAddorEditDicShow: false, // 新增编辑显示
      typeForm: {
        code: '',
        name: '',
        description: ''
      },
      dicForm: {
        typeCode: '',
        name: '',
        value: ''
      },
      typeFormRules: {
        code: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
      },
      dicFormRules: {
        typeCode: [{ required: true, message: '请选择类型名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
      },
      dictTypes: [], // 下拉列表
      activeName: '1', // tab切换
      tableDataList: [], // 初始化列表数据
      totalCount: 0, // 列表条数
      tableRowDataList: [], // 初始化列表数据
      totalRowCount: 0, // 列表条数
      searchParams: {
        name: '',
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      dicParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        typeCode: ''
      } // 日志
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
          height = 35 * this.tableDataList.length + 36;
        } else {
          height = 71;
        }
      }
      return height;
    }
  },
  created() {
    this.initDataList();
  },
  methods: {
    searchFormData() {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = 10;
      this.searchParams.start = 0;
      this.initDataList();
    },
    resetForm() {
      this.searchParams = {
        name: '',
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.initDataList();
    },
    initDataList() {
      this.tableRowDataList = [];
      this.totalRowCount = 0;
      this.$AXIOS.LISTGET('/config/dictTypePage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          this.dicParams.typeCode = this.tableDataList[0].code;
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.getRowDataList();
          }, 20);
        }
      });
    },
    getRowDataList() {
      this.tableRowDataList = [];
      this.$AXIOS.LISTGET('/config/dictPage', this.dicParams).then(res => {
        this.tableRowDataList = res.result;
        this.totalRowCount = res.totalCount;
        if (this.tableRowDataList && this.tableRowDataList.length) {
          setTimeout(() => {
            this.$refs.multipleRowTable.setCurrentRow(this.tableRowDataList[0]);
          }, 20);
        }
      });
    },
    // 获取类型下拉列表
    getDictTypesList() {
      this.$AXIOS.LISTGET('/config/dictTypes').then(res => {
        this.dictTypes = res.result;
      });
    },
    // 增加类型
    addDictType() {
      this.isSure = true;
      this.$AXIOS.POST('/config/dictType', this.typeForm).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditShow = false;
          this.initDataList();
        }
      }).finally(() => {
        this.isSure = false;
      });
    },
    // 编辑类型
    editDictType() {
      this.isSure = true;
      this.$AXIOS.PUT('/config/dictType/' + this.typeForm.id, this.typeForm).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditShow = false;
          this.initDataList();
        }
      }).finally(() => {
        this.isSure = false;
      });
    },
    // 类型数据回显
    getDictType(id) {
      this.$AXIOS.GET('/config/dictType/' + id).then(res => {
        this.typeForm = res.result;
      });
    },
    // 增加字典
    addDict() {
      this.isSure = true;
      this.$AXIOS.POST('/config/dict', this.dicForm).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditDicShow = false;
          this.initDataList();
        }
      }).finally(() => {
        this.isSure = false;
      });
    },
    // 编辑类型
    editDict() {
      this.isSure = true;
      this.$AXIOS.PUT('/config/dict/' + this.dicForm.id, this.dicForm).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditDicShow = false;
          this.initDataList();
        }
      }).finally(() => {
        this.isSure = false;
      });
    },
    // 类型数据回显
    getDict(id) {
      this.$AXIOS.GET('config/dict/' + id).then(res => {
        this.dicForm = res.result;
      });
    },
    // 确定增加或者编辑
    makeSureAddOrEdit() {
      if (!this.typeForm.code) {
        this.$utils.messagetip.warningTip('请输入类型编码！');
        return;
      }
      if (!this.typeForm.name) {
        this.$utils.messagetip.warningTip('请输入类型名称');
        return;
      }
      if (this.typeForm.id) {
        this.editDictType();
      } else {
        this.addDictType();
      }
    },
    // 确定增加或者编辑字典
    makeSureDicAddOrEdit() {
      if (!this.dicForm.typeCode) {
        this.$utils.messagetip.warningTip('请选择类型名称！');
        return;
      }
      if (!this.dicForm.name) {
        this.$utils.messagetip.warningTip('请输入字典名称');
        return;
      }
      if (!this.dicForm.value) {
        this.$utils.messagetip.warningTip('请输入字典值');
        return;
      }
      if (this.dicForm.id) {
        this.editDict();
      } else {
        this.addDict();
      }
    },
    // 点击整行
    tableRowClick(row) {
      if (row.code) {
        this.dicParams.typeCode = row.code;
        this.getRowDataList();
      } else {
        this.tableRowDataList = [];
        this.totalRowCount = 0;
      }
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    // 页码条数改变
    logChangeSize(val) {
      this.dicParams.start = 0;
      this.dicParams.pageNo = 1;
      this.dicParams.pageSize = val;
      this.getLogInfo();
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.dicParams.pageNo = val;
      this.dicParams.start = (val - 1) * this.dicParams.pageSize;
      this.getLogInfo();
    },
    // 新增类型弹窗
    typeFormAddShow() {
      this.isAddorEditShow = true;
      this.isSure = false;
      this.isEdit = false;
      this.title = '新增';
      this.typeForm = {
        code: '',
        name: '',
        description: ''
      };
      setTimeout(() => {
        this.$refs.typeForm.resetFields();
      }, 20);
    },
    // 新增字典弹窗
    dicFormAddShow() {
      this.getDictTypesList();
      this.isAddorEditDicShow = true;
      this.isSure = false;
      this.title = '新增';
      this.dicForm = {
        typeCode: '',
        name: '',
        value: ''
      };
      setTimeout(() => {
        this.$refs.dicForm.resetFields();
      }, 20);
    },
    // 编辑类型弹窗
    typeFormEditShow(id) {
      this.isAddorEditShow = true;
      this.isSure = false;
      this.isEdit = true;
      this.title = '编辑';
      this.getDictType(id);
    },
    // 编辑字典弹窗
    dicFormEShow(id) {
      this.isAddorEditDicShow = true;
      this.isSure = false;
      this.title = '编辑';
      this.getDict(id);
    },
    // 取消
    resetAddorEidt() {
      this.isAddorEditShow = false;
      this.isAddorEditDicShow = false;
      setTimeout(() => {
        this.$refs.typeForm.resetFields();
        this.$refs.dicForm.resetFields();
      }, 20);
    }
  }
};
</script>
<style lang="stylus" scoped>
.dictionarymanage
  .paging
    margin-top: 15px
    text-align: right
</style>
