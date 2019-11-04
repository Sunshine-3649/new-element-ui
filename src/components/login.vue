<template>
  <div class="login">
    <div class="login-con">
      <img src="../assets/logo.png">
      <el-form :model="loginByPsw" status-icon :rules="rules" ref="loginByPsw">
        <el-form-item label="手机号" prop="username">
          <el-input v-model="loginByPsw.username" placeholder="请输入手机号" class="username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginByPsw.password" placeholder="请输入密码" auto-complete="off" class="password">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="2">
              <el-button type="primary" :loading="isSubmitting" @click="submitForm('loginByPsw')">登录</el-button>
            </el-col>
            <el-col :span="8">
              <el-button :disabled="isSubmitting" @click="resetForm('loginByPsw')">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const checkUsername = (rule, value, callback) => {
      // TODO: hack code
      if (!value) {
        return callback(new Error('请输入手机号'));
      } else if (!value.match(/1\d{10}/g)) {
        return callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    const checkPassword = (rule, value, callback) => {
      let reg = /[^\u4e00-\u9fa5]/;
      if (!value) {
        return callback(new Error('请输入密码'));
      } else if (!reg.test(value)) {
        return callback(new Error('不能输入中文'));
      } else {
        callback();
      }
    };
    return {
      loginByPsw: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { validator: checkUsername, trigger: 'blur' },
          { max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      isSubmitting: false
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$router.push('/manage');
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     let encrypt = new JSEncrypt.JSEncrypt();
      //     encrypt.setPublicKey(
      //       'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDN5xYYCRJJV7py74srvOs4ODfJJ2cftZY9eNep9qFls4D4v/duR0DZo95VK+5Yp0OekyLbaYi16obz4DBa85Ap/SRcSijWtWC0Z14hAfmpsR2qwve3Jtf72SouNvfXFhOnpcxhHRN9GeND6dlq0Qk40K61CF79wLQbVOEJRXfspwIDAQAB'
      //     );
      //     let encryptData = encrypt.encrypt(
      //       this.$refs[formName].model.password
      //     );
      //     this.login({
      //       phone: this.$refs[formName].model.username,
      //       password: encryptData,
      //       appId: 'uc6c7f06e54ac77f87',
      //       encryptFlag: true,
      //       thirdPartyIdent: ''
      //     });
      //   }
      // });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="stylus" scoped>
.login
  .login-con
    width: 300px
    margin: 50px auto
    text-align: center
    img
      width: 200px
      margin-bottom: 30px
    button
      width: 100%
</style>
