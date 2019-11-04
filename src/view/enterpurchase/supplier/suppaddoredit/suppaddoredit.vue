<template>
  <div class="accredaddoredit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <section class="info">
        <el-row>
          <el-col :span="2">
            <span class="title tip_red">用户姓名：</span>
          </el-col>
          <el-col :span="6">
            <el-input size="mini" v-model.trim="formParams.userName" placeholder="请输入用户姓名" :maxlength="10"></el-input>
          </el-col>
          <el-col :span="6">
            <div style="padding-left: 10px;line-height: 28px;">必填，最大10个字</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <span class="title tip_red">手机号：</span>
          </el-col>
          <el-col :span="6">
            <el-input size="mini" v-model.trim="formParams.mobile" :disabled="isDisable" placeholder="请输入手机号"></el-input>
          </el-col>
          <el-col :span="6">
            <div style="padding-left: 10px;line-height: 28px;">手机号需为泰然城注册用户</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <span class="title tip_red">所属供应商：</span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formParams.supplierCode" placeholder="请选择" size="mini" filterable>
              <el-option v-for="item in supplierList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
              </el-option>
            </el-select>
            <!-- <el-input size="mini" v-model="formParams.supplierCode" placeholder="请输入内容"></el-input> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <span class="title tip_red">状态:</span>
          </el-col>
          <el-col :span="6">
            <el-radio-group v-model="formParams.isValid">
              <el-radio label="0">停用</el-radio>
              <el-radio label="1">启用</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <span class="title">&nbsp;&nbsp;&nbsp;备注：</span>
          </el-col>
          <el-col :span="6">
            <el-input size="mini" type="textarea" :rows="2" placeholder="请输入内容" v-model="formParams.memo" :maxlength="200">
            </el-input>
          </el-col>
          <el-col :span="6">
            <div style="padding-left: 10px;line-height: 28px;">限200字以内</div>
          </el-col>
        </el-row>
      </section>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="saveData" size="mini">保存</el-button>
      <el-button @click="back" size="mini">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accredaddoredit',
  data() {
    return {
      isDisable: false, // 编辑不可更改
      supplierList: [], // 分销商下拉列表
      radio: '', // 单选
      formParams: {
        // id: '', // 主键
        userName: '', // 用户名
        mobile: '', // 手机号
        supplierCode: '', // 分销商编号
        isValid: '1', // 用户状态
        memo: '' // 备注
      },
      input: '', // input输入框
      textarea: '' // 备注
    };
  },
  mounted() {
    if (this.$route.params.id !== 'add' && this.$route.params) {
      this.id = this.$route.params.id;
      this.isDisable = true;
      this.supplierAuthorDetail();
      this.getSupplierList();
    } else {
      this.getSupplierList();
    }
  },
  methods: {
    // 获取数据详情
    supplierAuthorDetail() {
      this.GET('/supplierAuthor/supplierAuthorDetail/' + this.id).then(res => {
        if (res.code === '200') {
          this.formParams.id = this.id;
          this.formParams.userName = res.body.userName;
          this.formParams.mobile = res.body.mobile;
          this.formParams.supplierCode = res.body.supplierCode;
          this.formParams.isValid = res.body.isValid;
          this.formParams.memo = res.body.memo;
        }
      });
    },
    // 验证手机号
    checkPhone() {
      if (!this.formParams.userName) {
        this.$message({
          type: 'warning',
          message: '用户姓名不能为空!'
        });
        return;
      }
      if (!this.formParams.mobile) {
        this.$message({
          type: 'warning',
          message: '手机号不能为空!'
        });
        return;
      }
      let numReg = /^[0-9]+$/;
      if (!numReg.test(this.formParams.mobile)) {
        this.$message({
          type: 'info',
          message: '手机号只能为纯数字！'
        });
        return;
      }
      if (this.formParams.mobile.length !== '11') {
        this.$message({
          type: 'info',
          message: '手机号格式不正确！'
        });
        return;
      }
      if (!this.formParams.supplierCode) {
        this.$message({
          type: 'warning',
          message: '请选择所属供应商！'
        });
        return;
      }
      this.POST('/supplierAuthor/checkPhone/' + this.formParams.mobile).then(res => {
        if (res.code === '200') {
          this.saveData();
        }
      });
    },
    // 判断是新增还是修改
    addOrEdit() {
      if (this.formParams.id) {
        this.updateSupplierAuthor();
      } else {
        this.addSupplierAuthor();
      }
    },
    // 新增保存
    addSupplierAuthor() {
      console.log(this.formParams);
      this.POST(
        '/supplierAuthor/add/supplierAuthor',
        this.formParams
      ).then(res => {
        if (res.code === '200') {
          const id = res.body.id;
          this.$utils.messagetip.successTip('新增成功');
          setTimeout(() => {
            this.$router.replace({
              name: 'supplierdetail',
              params: {
                id
              }
            });
          }, 800);
        }
      });
    },
    // 修改保存
    updateSupplierAuthor() {
      console.log(this.formParams);
      this.PUT(
        '/supplierAuthor/update/supplierAuthor',
        this.formParams
      ).then(res => {
        if (res.code === '200') {
          this.$utils.messagetip.successTip('修改成功');
          console.log(this.id);
          setTimeout(() => {
            this.$router.replace({
              name: 'supplierdetail',
              params: {
                id: this.id
              }
            });
          }, 800);
        }
      });
    },
    // 获取供应商列表
    getSupplierList(state = '3') {
      this.GET('/supplierAuthor/supplierList/' + state).then(res => {
        if (res.code === '200') {
          console.log(res.body);
          this.supplierList = res.body;
        }
      });
    },
    // 保存数据
    saveData() {
      this.$confirm('确定要保存当前数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.addOrEdit();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 返回
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="stylus" scoped>
.box-card
  margin-bottom: 15px
.info
  .title
    line-height: 28px
.btn
  text-align: center
  line-height: 60px
  background-color: rgb(242, 242, 242)
</style>
