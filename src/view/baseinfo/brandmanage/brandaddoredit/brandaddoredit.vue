<template >
  <div v-if="flagShow"  class="brandaddoredit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button v-if="id && id !== 'add'" style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          品牌名称：
        </el-col>
        <el-col :span="6">
          <el-input v-model.trim="searchParams.name" placeholder="不超过50个字符" size="mini" maxlength="50"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          品牌别名：
        </el-col>
        <el-col :span="6">
          <el-input v-model.trim="searchParams.alise" placeholder="不超过50个字符" size="mini" maxlength="50"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;" maxlength="50">
          品牌网址：
        </el-col>
        <el-col :span="6">
          <el-input v-model.trim="searchParams.webUrl" placeholder="不超过200个字符" size="mini" maxlength="200"></el-input>
        </el-col>
        <el-col :span="5">
          <p style="line-height: 28px">网页前请加"http://"</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          品牌LOGO：
        </el-col>
        <el-col :span="12">
          <p style="line-height: 28px">最多允许上传1个文件（注：最多上传1张图片，支持JPG、JPEG、BMP和PNG图片格式，尺寸150px×150px，大小不超过2M）</p>
        </el-col>
      </el-row>
      <div style="margin: 0 0 15px 142px">
        <el-upload ref="uploadlog" :action='uploadUrl' v-show="isUpload" name='Filedata' :before-upload='beforeUpload' :on-success='handleSuccess'>
          <el-button size="small" type="primary">上传</el-button>
        </el-upload>
        <div style="width: 100px; height: 100px;position: relative;left: 0; top: 0" v-if="searchParams.logo && !isUpload">
          <span @click="clearUpload" style="position: absolute; right: -3px; top: -8px;text-align: center;cursor: pointer;background: #ccc; width: 20px;line-height: 20px;border-radius: 50%">X</span>
          <img width="100%" @click="handlePictureCardPreview" :src="'https://scm.trc.com/' + searchParams.logo" alt="">
        </div>
      </div>
      <el-row :gutter="20" style="margin-top: 15px;">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          状态：
        </el-col>
        <el-col :span="6" style="line-height: 28px;">
          <el-radio v-model="searchParams.isValid" label="1">启用</el-radio>
          <el-radio v-model="searchParams.isValid" label="0">停用</el-radio>
        </el-col>
      </el-row>
      <el-row class="btn_group">
        <el-col :span="20" style="text-align: center;">
          <el-button size="mini" type="primary" @click="saveData" :disabled="isSubmit">提交</el-button>
          <el-button size="mini" @click="back">返回</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="'https://scm.trc.com/' + searchParams.logo" alt="">
    </el-dialog>
    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <el-table :data="logInfoList" style="width: 100%" border height="400">
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
      <div style="margin: 15px; text-align: center;">
        <el-button type="primary" size="mini" @click="isLogInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'brandaddoredit',
  inject: ['reload'],
  data() {
    return {
      isUpload: true, // 文件上传是否显示
      isSubmit: false, // 防止多次点击
      uploadUrl: '/scm-web/qinniu/upload/brand',
      dialogImageUrl: '',
      dialogVisible: false,
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'Brand',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      tableDataList: [],
      defaulDataList: [],
      id: '',
      deleteList: [],
      radioList: [],
      isRadio: '',
      checkedList: [],
      disabledList: [],
      isValid: '1',
      isGroupShow: false, // 采购组弹窗
      groupData: [], // 采购组员维护
      searchParams: {
        name: '', // 品牌名称
        alise: '', // 品牌别名
        webUrl: '', // 品牌网址
        logo: '', // logo
        isValid: '1' // isValid
      },
      flagShow: true
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getInitData();
  },
  watch: {
      $route(to, from) {
          if (to.query.reload && this.id === 'add') {
              this.reload();
            // for (let i in this.searchParams) {
            //     this.searchParams[i] = '';
            // }
            // this.searchParams['isValid'] = '1';
          }
      }
  },
  methods: {
    clearUpload() {
      this.isUpload = true;
      this.$refs.uploadlog.clearFiles();
    },
    beforeUpload(file) {
      let fileFormat = file.type;
      if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
        if (file.size > 1024 * 1024 * 2) {
           this.$utils.messagetip.warningTip('文件大小不能大于2M');
          return false;
        }
      } else {
         this.$utils.messagetip.warningTip('文件类型只能为.png,.jpg,.jpeg,.bmp');
        return false;
      }
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
    // 获取采购组成员列表
    getInitData() {
      if (this.id !== 'add') {
        this.getCurrentData(this.id);
        this.operateParams.entityId = this.id;
      }
    },
    // 获取采购组成员列表
    getCurrentData(id) {
      this.$AXIOS.GET('/category/brand/' + id).then(res => {
        if (res.appcode === '1') {
          this.searchParams = res.result || {};
          if (this.searchParams.logo) {
            this.isUpload = false;
          }
        }
      });
    },
    // 验证保存的品牌名称
    getPurchaseGroupName(params) {
      this.isSubmit = true;
      setTimeout(() => {
        this.isSubmit = false;
      }, 2000);
      this.$AXIOS.POST('/category/brand/checkName', { name: params.name, id: params.id }).then(res => {
        if (res.appcode === '1') {
          if (this.id !== 'add') {
            this.updatePurchaseGroupData(params);
          } else {
            this.savePurchaseGroupData(params);
          }
        } else {
          this.$utils.messagetip.warningTip(res.databuffer);
        }
      });
    },
    // 保存采购组
    savePurchaseGroupData(params) {
      this.$AXIOS.POST('/category/brand', params).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.$router.push({path: '/brandmanage'});
          }, 20);
        }
      });
    },
    // 修改采购组
    updatePurchaseGroupData(params) {
      this.$AXIOS.PUT('/category/brand/' + this.id, params).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.$router.push({path: '/brandmanage'});
          }, 20);
        }
      });
    },
    // 新增用户保存
    addPurchaseGroupUser(params) {
      this.$AXIOS.PUT('/purchase/purchaseGroupUserNew', params).then(res => {
        if (res.appcode === '1') {
          this.isGroupShow = false;
          this.getInitData();
        }
      });
    },
    // 姓名校验
    checkedName(val) {
      console.log('222');
      console.log(val);
      if (!val) {
        this.$utils.messagetip.warningTip('姓名不能为空！');
      }
    },
    // 手机号校验
    checkedPhone(val) {
      if (!val) {
        this.$utils.messagetip.warningTip('手机号不能为空！');
        return;
      }
      let numReg = /^[0-9]+$/;
      let typeReg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
      if (val.length !== 11 || !numReg.test(val) || !typeReg.test(val)) {
        this.$utils.messagetip.warningTip('手机号格式不正确！');
      }
    },
    // 采购组员维护(弹窗)
    addPurchaseGroup() {
      this.groupData = this.tableDataList;
      this.deleteList = [];
      this.groupData.forEach(item => {
        item.status = '0';
      });
      this.isGroupShow = true;
    },
    deleteGroup(i, row) {
      if (row.id) {
        row.status = '3';
        this.deleteList.push(row);
      }
      this.groupData.splice(i, 1);
    },
    addUser() {
      const obj = {
        name: '',
        phoneNumber: '',
        status: '1'
      };
      this.groupData.unshift(obj);
    },
    // 保存要修改的数据
    saveUserInfo() {
      let isName = false;
      let isNumber = false;
      let isNumberType = false;
      let numReg = /^[0-9]+$/;
      let typeReg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/;
      this.groupData.forEach(item => {
        if (!item.name) {
          isName = true;
        }
        if (!item.phoneNumber) {
          isNumber = true;
        }
        console.log(item.phoneNumber.length);
        console.log(item.phoneNumber.length !== 11);
        console.log(!numReg.test(item.phoneNumber));
        if (item.phoneNumber.length !== 11 || !numReg.test(item.phoneNumber) || !typeReg.test(item.phoneNumber)) {
          isNumberType = true;
        }
      });
      if (isName) {
        this.$utils.messagetip.warningTip('姓名不能为空！');
        return;
      }
      if (isNumber) {
        this.$utils.messagetip.warningTip('手机号不能为空！');
        return;
      }
      if (isNumberType) {
        this.$utils.messagetip.warningTip('手机号格式不正确！');
        return;
      }
      const params = {
        code: this.searchParams.code,
        gridValue: JSON.stringify([...this.groupData, ...this.deleteList])
      };
      this.addPurchaseGroupUser(params);
    },
    // 取消采购组员维护
    resetUserInfo() {
      console.log('关闭模态框');
      this.isGroupShow = false;
      this.getInitData();
      // let indexTop = '';
      // this.groupData.forEach((item, i) => {
      //   if (!item.id) {
      //     indexTop = i;
      //   }
      // });
      // if (indexTop) {
      //   this.groupData.splice(0, indexTop + 1);
      // }
    },
    // 单选
    toggleRadio(i) {
      this.isRadio = i;
      console.log(this.isRadio);
      this.disabledList = [];
      this.tableDataList.forEach(item => {
        this.disabledList.push(false);
      });
      this.$set(this.checkedList, i, false);
      this.$set(this.disabledList, i, true);
      console.log(this.checkedList);
    },
    saveData() {
      if (!this.searchParams.name) {
        this.$utils.messagetip.warningTip('品牌名称不能为空！');
        return;
      }
      let re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      if (this.searchParams.webUrl && !this.searchParams.webUrl.match(re)) {
        this.$utils.messagetip.warningTip('网址格式不正确！');
        return;
      }
      if (this.id !== 'add') {
        this.searchParams.id = this.id;
      }
      this.getPurchaseGroupName(this.searchParams);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      console.log(response);
      this.isUpload = false;
      this.searchParams.logo = response.key;
    },
    back() {
      this.$router.push({path: '/brandmanage', query: {reload: true}});
    }
  }
};
</script>
<style lang="stylus" scoped>
.brandaddoredit
  .paging
    margin-top: 15px
    text-align: right
</style>
<style lang="stylus">
.brandaddoredit
  .paging
    margin-top: 15px
    text-align: right
</style>
