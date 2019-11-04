<template>
  <!-- 资源管理 -->
  <div class="classifymanage" v-loading.fullscreen.lock='isLoading'>
    <el-button type="primary" size="mini" @click="addFirstResource">新增一级分类</el-button>
    <el-button type="primary" size="mini" @click="toggleSort()">{{isSort ? '保存排序' : '编辑排序'}}</el-button>
    <el-button type="primary" size="mini" @click="showAll(0)">展开所有</el-button>
    <el-button type="primary" size="mini" @click="showAll(1)">收起所有</el-button>
    <el-button type="text" size="mini" style="float: right;padding-right: 20px" @click="showLog">操作日志</el-button>
    <tree-table ref="recTree" :isShow='isShow' :isSort='isSort' :list.sync="treeDataSource" @addFunc="addFunc" @inputChange2="inputChange" @toggleValid='toggleValid' @editFunc="editFunc" @handlerExpand="handlerExpand" @orderByFunc="orderByFunc"></tree-table>
    <!-- 类型的弹窗 -->
    <el-dialog :title="title" :visible.sync="isAddorEditShow" style="min-width: 800px;" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false'>
      <el-form :model="form" :rules="formRules" ref="form" style="width: 500px;">
        <el-form-item label="分类名称：" prop="name" label-width="120px" size="mini">
          <el-input v-model="form.name" placeholder="不超过10个字符" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="上级分类：" prop="parentName" label-width="120px" size="mini">
          <el-input v-model="form.parentName" placeholder="无" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类描述："  label-width="120px" size="mini">
          <el-input v-model="form.classifyDescribe" placeholder="不超过20个字符" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" label-width="120px" size="mini">
          <el-input v-model="form.sort" placeholder="范围0-9999，数值越小排在越前面" size="mini" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="isValid" label-width="120px" size="mini">
          <el-radio v-model="form.isValid" label="1" :disabled="isRadio">启用</el-radio>
          <el-radio v-model="form.isValid" label="0" :disabled="isRadio">停用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" size="mini" :disabled="isSubmit">保存</el-button>
        <el-button @click="closeModel" size="mini">取消</el-button>
      </div>
    </el-dialog>
    <!-- 类型的弹窗 编辑 -->
    <el-dialog title="编辑" :visible.sync="isAddorEditShow1" style="min-width: 800px;" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false'>
      <el-form :model="form" :rules="formRules" ref="form1" style="width: 500px;">
        <el-form-item label="资源名称：" prop="name" label-width="120px" size="mini">
          <el-input v-model="form.name" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="上级资源：" prop="parentName" label-width="120px" size="mini">
          <el-input v-model="form.parentName" placeholder="无" disabled></el-input>
        </el-form-item>
        <el-form-item label="Url：" prop="url" label-width="120px" size="mini">
          <el-input v-model="form.url" :disabled='urlDisabled'></el-input>
        </el-form-item>
        <el-form-item label="所属权限：" prop="belong" label-width="120px" size="mini">
          <el-radio v-model="form.belong" label="1" :disabled="isBelong && !(form.belong === '1')">全局角色</el-radio>
          <el-radio v-model="form.belong" label="2" :disabled="isBelong && !(form.belong === '2')">渠道角色</el-radio>
        </el-form-item>
        <el-form-item v-if="isTypeShow" label="操作类型：" prop="operationType" label-width="120px" size="mini">
          <el-radio v-model="form.operationType" label="1" :disabled="isRadio && !(form.operationType === '1')">查询</el-radio>
          <el-radio v-model="form.operationType" label="2" :disabled="isRadio && !(form.operationType === '2')">新增</el-radio>
          <el-radio v-model="form.operationType" label="3" :disabled="isRadio && !(form.operationType === '3')">修改</el-radio>
          <el-radio v-model="form.operationType" label="4" :disabled="isRadio && !(form.operationType === '4')">删除</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" size="mini">保存</el-button>
        <el-button @click="closeModel1" size="mini">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 操作日志 -->
    <el-dialog title="操作日志" :visible.sync="isLog" style="min-width: 800px;" >
      <el-table :data="logInfoList" style="width: 100%" border>
          <el-table-column prop="operation" label="动作" align="center"></el-table-column>
          <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="operateTimeString" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
        <div style="text-align: center;">
          <el-button  type="primary" @click="isLog = false" size="mini">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
// import dataJson from './data.json';
import qs from 'qs';
import treeTable from '@/components/tree-table1.vue';
export default {
  name: 'classifymanage',
  data() {
    return {
      isLoading: false, // loading
      isSubmit: false, // 防止多次点击
      isLog: false, // 日志弹窗
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'Category'
      }, // 日志
      logInfoList: [], // 日志信息
      logCount: 0, // 日志条数
      sortList: [], // 需要排序的列表
      isShow: 1,
      isSort: false,
      isTypeShow: true, // 编辑时，默认显示操作类型
      isAddorEditShow: false, // 新增弹窗
      isAddorEditShow1: false, // 编辑弹窗
      level: 0,
      isRadio: false, // 单选框不可点击
      isBelong: false, // 单选框不可点击
      isEdit: false,
      isEditShow: 1, // 默认编辑二级三级不显示操作类型
      urlDisabled: false, // 默认不可输入
      title: '新增一级资源',
      form: {
        name: '',
        parentName: '',
        classifyDescribe: '',
        sort: '0',
        isValid: '1'
      },
      formRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        parentName: [{ required: true, message: '请输入上级分类', trigger: 'blur' }],
        // classifyDescribe: [{ required: true, message: '请输入分类描述', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
        isValid: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      treeDataSource: [],
      searchParams: {
        parentId: '',
        isRecursive: true
      }
    };
  },
  components: {
    treeTable
  },
  created() {
    this.getInitDataList();
  },
  methods: {
    showLog() {
      this.getLogInfo();
      this.isLog = true;
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
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    getInitDataList() {
      this.isLoading = true;
      this.$AXIOS.LISTGET('/productCenter/category/tree', this.searchParams).then(res => {
        this.treeDataSource = res.result || [];
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 新增分类
    addJurisdictionSave() {
      this.$AXIOS.POST('/category/category', this.form).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditShow = false;
          this.getInitDataList();
        }
      });
    },
    // 编辑
    putAclWmsUpdate(params) {
      let data = {
        id: params.id,
        name: params.name,
        expanded: params.expanded,
        sort: params.sort,
        isValid: params.isValid,
        level: params.level,
        categoryCode: params.categoryCode,
        source: params.source,
        classifyDescribe: params.classifyDescribe,
        isExpand: params.isExpand,
        bLeft: params.bLeft,
        Experience: params.Experience,
        parentName: params.parentName
      };
      this.$AXIOS.PUT('/category/category/' + params.id, data).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.isAddorEditShow = false;
        this.getInitDataList();
      });
    },
    // 排序
    putSortUpdate(params) {
      this.$AXIOS.PUT('/category/updateSort', {sortForm: params}).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.getInitDataList();
      });
    },
    // 切换启停用
    updateState(params) {
      this.$AXIOS.PUT('/category/category/updateState/' + params.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.getInitDataList();
      });
    },
    toggleSort() {
      let numReg = /^[0-9]+$/;
      let isTrue = false;
      let temp = [];
      let index = [];
      let l = this.sortList.length;
      let arr = [];
      for (let i = 0; i < l; i++) {
          for (let j = i + 1; j < l; j++) {
              if (this.sortList[i].id === this.sortList[j].id) {
                  i++;
                  j = i;
              }
          }
          temp.push(this.sortList[i]);
      }
      console.log(temp);

      if (temp && temp.length) {
        temp.forEach(item => {
          if (!numReg.test(item.sort) && !isTrue) {
            isTrue = true;
          }
        });
      }
      if (isTrue) {
        this.$utils.messagetip.warningTip('排序值只能为0和正整数');
        return;
      }
      this.isSort = !this.isSort;
      if (!this.isSort) {
        console.log('保存', temp);
        this.putSortUpdate(JSON.stringify(temp));
      } else {
        this.sortList = [];
        console.log('编辑');
      }
    },
    save() {
      if (!this.form.name) {
        this.$utils.messagetip.warningTip('请输入分类名称');
        return;
      }
      let numReg = /^[0-9]+$/;
      if (this.form.sort === '') {
        this.$utils.messagetip.warningTip('排序值不能为空!');
        return;
      }
      if (this.form.sort !== '' && !numReg.test(this.form.sort)) {
        this.$utils.messagetip.warningTip('排序值只能为0和正整数');
        return;
      }
      if (this.form.fullPathId) {
        if (this.form.fullPathId.indexOf('|') > -1) {
          let fullPathIdArr = this.form.fullPathId.split('|');
          this.form.parentId = fullPathIdArr[fullPathIdArr.length - 1];
        } else {
          this.form.parentId = this.form.fullPathId;
        }
      }
      console.log(this.form);
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      this.$AXIOS.POST('/category/checkCategoryName', this.form).then(res => {
        if (this.isEdit) {
          this.putAclWmsUpdate(this.form);
        } else {
          this.addJurisdictionSave();
        }
      });
    },
    addFirstResource() {
      this.form = {
        name: '',
        parentName: '',
        classifyDescribe: '',
        level: '1',
        sort: '0',
        isValid: '1'
      };
      this.title = '新增一级分类';
      this.isBelong = false;
      this.isEdit = false;
      this.isEditShow = 1;
      this.level = 0;
      this.urlDisabled = true;
      this.isAddorEditShow = true;
    },
    showAll(isShow) {
      this.isShow = isShow;
      this.getInitDataList();
    },
    orderByFunc(val) {
      alert('排序');
      alert(val);
    },
    // 获取要排序的值
    inputChange(m) {
      this.sortList.push(m);
      console.log(this.sortList);
    },
    addFunc(m) {
      console.log(m);
      // 重置
      this.form = {
        name: '',
        parentName: '',
        classifyDescribe: '',
        sort: '0',
        isValid: '1',
        fullPathId: m.id
      };
      // 页面数据
      let title = '新增一级资源';
      this.form.level = '';
      if (m.level === 1) {
        title = '新增二级资源';
        this.form.level = '2';
      } else if (m.level === 2) {
        title = '新增三级资源';
        this.form.level = '3';
      }
      let parentName = '';
      this.title = title;
      this.isEdit = false;
      this.treeDataSource.forEach(item => {
        if (item.id === m.id) {
          parentName = item.name;
        }
        if (item.children && item.children.length) {
          item.children.forEach(subItem => {
            if (subItem.id === m.id) {
              parentName = subItem.name;
            }
            if (subItem.children && subItem.children.length) {
              subItem.children.forEach(supItem => {
                if (supItem.id === m.id) {
                  parentName = supItem.name;
                }
              });
            }
          });
        }
      });
      this.form.parentName = parentName;
      this.isAddorEditShow = true;
    },
    // 切换启停用
    toggleValid(m) {
      let isValid = false;
      console.log(m);
      if (m.children && m.children.length) {
        m.children.forEach(item => {
          if (item.isValid === '1') {
            isValid = true;
          }
          if (item.children && item.children.length) {
            item.children.forEach(subItem => {
              if (subItem.isValid === '1') {
                isValid = true;
              }
            });
          }
        });
      }
      if (isValid && m.isValid === '1') {
        this.$utils.messagetip.warningTip('当前分类下还存在启用的子分类，无法停用！');
        return;
      }
      let isResult = ''; // 对应的中文
      if (m.isValid === '1') {
        isResult = '停用';
      } else {
        isResult = '启用';
      }
      this.$confirm(`确定要${isResult}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateState(m);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    editFunc(m) {
      this.title = '编辑 ';
      this.isTypeShow = true;
      this.form = m;
      console.log(m);
      this.isEdit = true;
      let parentName = '无';
      this.treeDataSource.forEach(item => {
        if (item.id === m.id) {
          parentName = '无';
        }
        if (item.children && item.children.length) {
          item.children.forEach(subItem => {
            if (subItem.id === m.id) {
              parentName = item.name;
            }
            if (subItem.children && subItem.children.length) {
              subItem.children.forEach(supItem => {
                if (supItem.id === m.id) {
                  parentName = subItem.name;
                }
              });
            }
          });
        }
      });
      this.form.parentName = parentName;
      this.isAddorEditShow = true;
    },
    handlerExpand(m) {
      m.isExpand = !m.isExpand;
    },
    closeModel() {
      this.isAddorEditShow = false;
      setTimeout(() => {
        this.$refs.form.resetFields();
      }, 20);
      this.getInitDataList();
    },
    closeModel1() {
      this.isAddorEditShow1 = false;
      setTimeout(() => {
        this.$refs.form1.resetFields();
      }, 20);
      this.getInitDataList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.classifymanage
  width: 100%
  height: 100%
  .paging
    margin: 15px 0
    text-align: right
</style>
