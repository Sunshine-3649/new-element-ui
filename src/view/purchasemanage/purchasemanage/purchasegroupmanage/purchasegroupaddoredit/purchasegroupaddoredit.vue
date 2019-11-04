<template>
  <div class="purchasegroupaddoredit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button v-if="id && id !== 'add'" style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <el-row :gutter="20" v-if="searchParams.code">
        <el-col :span="2" style="text-align: right; line-height: 28px;">
          采购组编号：
        </el-col>
        <el-col :span="6">
          <el-input v-model.trim="searchParams.code" disabled placeholder="" size="mini"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          采购组名称：
        </el-col>
        <el-col :span="6">
          <el-input v-model.trim="searchParams.name" placeholder="" size="mini"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          采购组员：
        </el-col>
        <el-col :span="18">
          <!-- 表格tableData -->
          <el-button type="primary" size="mini" style="margin-bottom: 15px;" @click="addPurchaseGroup">采购组员维护</el-button>
          <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
            <el-table-column label="姓名" prop="name" align="center"></el-table-column>
            <el-table-column label="选为组员(多选)" align="center">
              <template slot-scope="scope">
                <div>
                  <el-checkbox v-model="checkedList[scope.$index]" :disabled="disabledList[scope.$index]"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="选为组长(单选)" align="center">
              <template slot-scope="scope">
                <div class="hide_radio">
                  <el-radio v-model="isRadio" :label="scope.$index" @change="toggleRadio(scope.$index)"></el-radio>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 15px;">
        <el-col :span="2" class="tip_red" style="text-align: right; line-height: 28px;">
          状态：
        </el-col>
        <el-col :span="6" style="line-height: 28px;">
          <el-radio v-model="isValid" label="1">启用</el-radio>
          <el-radio v-model="isValid" label="0">停用</el-radio>
        </el-col>
      </el-row>
      <el-row class="btn_group">
        <el-col :span="20" style="text-align: center;">
          <el-button size="mini" type="primary" @click="saveData">保存</el-button>
          <el-button size="mini" @click="back">取消</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog title="采购组员维护" :visible.sync="isGroupShow" :close-on-click-modal='false'>
      <el-button type="primary" size="mini" style="margin-bottom: 15px;" @click="addUser">新增组员</el-button>
      <el-table :data="groupData" border class="group_table">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column property="name" label="姓名" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入姓名" @change="checkedName" :disabled="scope.row.id > 0" size="mini" maxlength="10"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phoneNumber" @change="checkedPhone" placeholder="请收入手机号" :disabled="scope.row.id > 0" size="mini" maxlength="11"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteGroup(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="saveUserInfo" size="mini">保存</el-button>
        <el-button @click="resetUserInfo" size="mini">取消</el-button>
      </div>
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
import operateTable from 'components/operateTable';
export default {
  name: 'purchasegroupaddoredit',
  data() {
    return {
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'PurchaseGroup',
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
        code: '',
        name: ''
      }
    };
  },
  components: {
    operateTable
  },
  created() {
    this.id = this.$route.params.id;
    this.getInitData();
  },
  methods: {
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
      this.tableDataList = [];
      this.disabledList = [];
      this.checkedList = [];
      this.isRadio = '';
      this.$AXIOS.GET('/purchase/purchaseGroupUserNew').then(res => {
        if (res.appcode === '1') {
          this.tableDataList = res.result;
          this.tableDataList.forEach((item, i) => {
            this.disabledList[i] = this.checkedList[i] = false;
          });
          // 编辑状态，数据回显
          if (this.id !== 'add') {
            this.getCurrentData(this.id);
            this.operateParams.entityId = this.id;
          }
        }
      });
    },
    // 获取采购组成员列表
    getCurrentData(id) {
      this.$AXIOS.GET('purchase/purchaseGroup/' + id).then(res => {
        if (res.appcode === '1') {
          const result = res.result || {};
          this.searchParams.name = result.name;
          this.searchParams.code = result.code;
          // 获取组长
          this.tableDataList.forEach((item, index) => {
            if (item.id.toString() === result.leaderUserId) {
              this.isRadio = index;
              this.disabledList[this.isRadio] = true;
            }
          });
          // 获取成员
          let memberUserIdList =
            result.memberUserId.indexOf(',') > -1
              ? result.memberUserId.split(',')
              : [result.memberUserId];
          memberUserIdList.forEach(item => {
            this.tableDataList.forEach((subItem, i) => {
              if (item === subItem.id.toString()) {
                this.checkedList[i] = true;
              }
            });
          });
          this.isValid = result.isValid;
          console.log(this.isRadio);
          console.log(this.checkedList);
        }
      });
    },
    // 验证保存的采购组名称
    getPurchaseGroupName(params) {
      this.$AXIOS
        .GET('/purchase/purchaseGroup', { name: params.name })
        .then(res => {
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
      this.$AXIOS.POST('/purchase/purchaseGroup', params).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip('新增采购组成功');
          setTimeout(() => {
            this.$router.push({path: '/purchasesgroup'});
          }, 600);
        }
      });
    },
    // 修改采购组
    updatePurchaseGroupData(params) {
      this.$AXIOS
        .PUT('/purchase/purchaseGroup/' + this.id, params)
        .then(res => {
          if (res.appcode === '1') {
            this.$utils.messagetip.successTip('修改采购组成功');
            setTimeout(() => {
              this.$router.push({path: '/purchasesgroup'});
            }, 600);
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
      let typeReg = /^1[0-9][0-9]\d{4,8}$/;
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
      let typeReg = /^1[0-9][0-9]\d{4,8}$/;
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
        this.$utils.messagetip.warningTip('采购组名称不能为空！');
        return;
      }
      if (this.isRadio === '') {
        this.$utils.messagetip.warningTip('请选择组长！');
        return;
      }
      let memberUserIdList = [];
      let memberNameList = [];
      let leaderUserId = this.tableDataList[this.isRadio].id
        ? this.tableDataList[this.isRadio].id
        : '';
      let leaderName = this.tableDataList[this.isRadio].name
        ? this.tableDataList[this.isRadio].name
        : '';
      this.tableDataList.forEach((item, i) => {
        if (this.checkedList[i]) {
          memberNameList.push(item.name);
          memberUserIdList.push(item.id);
        }
      });
      let params = {
        name: this.searchParams.name,
        isValid: this.isValid,
        leaderUserId,
        leaderName,
        memberName: memberNameList.join(),
        memberUserId: memberUserIdList.join()
      };
      console.log(params);
      if (this.id !== 'add') {
        params.id = this.id;
        params.code = this.searchParams.code;
      }
      this.getPurchaseGroupName(params);
    },
    back() {
      this.$router.push({path: '/purchasesgroup'});
    }
  }
};
</script>
<style lang="stylus" scoped>
.purchasegroupaddoredit
  .paging
    margin-top 15px
    text-align right
</style>
<style lang="stylus">
.group_table
  tr
    th:nth-child(2), th:nth-child(3)
      div::before
        content: '*'
        padding-right: 5px
        color: #ff0000
.hide_radio
  .el-radio__label
    display none
</style>
