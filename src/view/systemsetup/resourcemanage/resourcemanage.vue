<template>
  <!-- 资源管理 -->
  <div class="resourcemanage">
    <el-button type="primary" size="mini" @click="addFirstResource">新增一级资源</el-button>
    <el-button type="primary" size="mini" @click="showAll(0)">展开所有</el-button>
    <el-button type="primary" size="mini" @click="showAll(1)">收起所有</el-button>
    <tree-table ref="recTree" :isShow='isShow' wms='0' :list.sync="treeDataSource" @addFunc="addFunc" @editFunc="editFunc" @handlerExpand="handlerExpand" @orderByFunc="orderByFunc"></tree-table>
    <!-- 类型的弹窗 -->
    <el-dialog :title="title" :visible.sync="isAddorEditShow" style="min-width: 800px;" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false'>
      <el-form :model="form" :rules="formRules" ref="form" style="width: 500px;">
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
        <el-form-item v-if="level === 2 " label="操作类型：" prop="operationType" label-width="120px" size="mini">
          <el-radio v-model="form.operationType" label="1" :disabled="isRadio">查询</el-radio>
          <el-radio v-model="form.operationType" label="2" :disabled="isRadio">新增</el-radio>
          <el-radio v-model="form.operationType" label="3" :disabled="isRadio">修改</el-radio>
          <el-radio v-model="form.operationType" label="4" :disabled="isRadio">删除</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" size="mini">保存</el-button>
        <el-button @click="closeModel" size="mini">关闭</el-button>
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
  </div>
</template>
<script>
// import dataJson from './data.json';
import treeTable from '@/components/tree-table.vue';
export default {
  name: 'resourcemanage',
  data() {
    return {
      isShow: 1,
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
        parentId: '',
        belong: '',
        url: '1',
        method: '1',
        operationType: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        parentName: [{ required: true, message: '请输入上级资源', trigger: 'blur' }],
        url: [{ required: true, message: '请输入Url', trigger: 'blur' }],
        belong: [{ required: true, message: '请选择所属权限', trigger: 'blur' }],
        operationType: [{ required: true, message: '请选择所属权限', trigger: 'blur' }]
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
    getInitDataList() {
      this.$AXIOS.LISTGET('/accredit/jurisdictionTree', this.searchParams).then(res => {
        this.treeDataSource = res.result || [];
      });
    },
    // 新增资源
    addJurisdictionSave() {
      this.$AXIOS.POST('/accredit/jurisdictionSave', this.form).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditShow = false;
          this.getInitDataList();
        }
      });
    },
    // 编辑
    putAclWmsUpdate(params) {
      this.$AXIOS.PUT('/accredit/jurisdictionEdit/' + params.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
          this.isAddorEditShow1 = false;
          this.isAddorEditShow1 = false;
          this.getInitDataList();
      });
    },
    save() {
      if (!this.form.name) {
        this.$utils.messagetip.warningTip('请输入资源名称');
        return;
      }
      if (!this.form.belong) {
        this.$utils.messagetip.warningTip('请选择所属权限');
        return;
      }
      if (this.isEdit) {
        let params = {};
        params.name = this.form.name;
        params.id = this.form.id;
        if (this.isEditShow) {
          params.url = this.form.url;
        }
        this.putAclWmsUpdate(params);
      } else {
        if (this.form.operationType === '1') {
          this.form.method = 'GET';
        } else if (this.form.operationType === '2') {
          this.form.method = 'POST';
        } else if (this.form.operationType === '3') {
          this.form.method = 'PUT';
        } else if (this.form.operationType === '4') {
          this.form.method = 'DELETE';
        }
        this.addJurisdictionSave();
      }
    },
    addFirstResource() {
      this.form = {
        name: '',
        parentName: '',
        parentId: '',
        belong: '',
        url: '1',
        method: '1',
        operationType: ''
      };
      this.title = '新增一级资源';
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
    addFunc(m) {
      // 重置
      this.form.name = '';
      this.form.parentId = '';
      this.form.operationType = '';
      // 页面数据
      this.isRadio = false;
      this.isBelong = true;
      this.urlDisabled = true;
      this.form.parentId = m.code;
      this.form.url = m.url;
      this.form.belong = m.belong.toString();
      this.form.parentName = m.name;
      let title = '新增一级资源';
      if (m.level === 1) {
        title = '新增二级资源';
      } else if (m.level === 2 || m.level === 3) {
        title = '新增三级资源';
      }
      this.title = title;
      if (m.level === 2 || m.level === 3) {
        this.form.url = '';
        this.urlDisabled = false;
        this.isEditShow = 2;
        this.form.operationType = '1';
        this.level = m.level;
      }
      this.isEdit = false;
      this.isAddorEditShow = true;
    },
    editFunc(m) {
      this.title = '编辑 ';
      this.isTypeShow = true;
      this.form = m;
      this.form.belong = m.belong.toString();
      if (m.method === 'GET') {
        this.form.operationType = '1';
      } else if (m.method === 'POST') {
        this.form.operationType = '2';
      } else if (m.method === 'PUT') {
        this.form.operationType = '3';
      } else if (m.method === 'DELETE') {
        this.form.operationType = '4';
      }
      if (m.method === '1') {
        this.isTypeShow = false;
      }
      console.log(this.isTypeShow);
      this.isEdit = true;
      this.isBelong = true;
      if (m.level === 3 || m.level === 4) {
        this.level = m.level;
        this.isEditShow = 2;
        this.urlDisabled = false;
        this.isRadio = true;
      } else {
        this.isEditShow = 1;
        this.isRadio = false;
        this.urlDisabled = true;
      }
      let parentName = '无';
      this.treeDataSource.forEach(item => {
        if (item.code === m.parentId) {
          parentName = item.name;
        }
        if (item.children && item.children.length) {
          item.children.forEach(subItem => {
            if (subItem.code === m.parentId) {
              parentName = subItem.name;
            }
            if (subItem.children && subItem.children.length) {
              subItem.children.forEach(supItem => {
                if (supItem.code === m.parentId) {
                  parentName = supItem.name;
                }
              });
            }
          });
        }
      });
      this.form.parentName = parentName;
      this.isAddorEditShow1 = true;
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
.resourcemanage
  width: 100%
  height: 100%
</style>
