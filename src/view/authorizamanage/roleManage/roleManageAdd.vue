<template>
    <div class="roleManageAdd">
        <div v-if="id" class="title" style="padding:12px 10px;  display:flex; justify-content: space-between; background-color: hsla(220,4%,58%,.1); margin-bottom:20px;">
            <div>基本信息</div>
            <span  @click="openOperateDialog" style="color: #409eff; cursor:pointer;">操作日志</span>
        </div>
       <el-form label-width="160px" size="mini">
            <el-form-item required label="角色名称：">
                <el-input maxlength="32" ref="name" v-model.trim="formData.name"  style="width: 250px;"  placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="角色类型：">
                <el-select @change="roleTypeChange" v-model="formData.roleType" placeholder="请选择">
                    <el-option
                        v-for="item in roleTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="角色权限：">
                <strong v-if="!roleData.length">请选择角色类型</strong>
                 <el-tree
                   v-else
                    style="height:500px; overflow-y:scroll "
                    @check="handleNodeClick"
                    :data="roleData"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="expandedKeys"
                    :default-checked-keys="checkedKeys"
                    :props="defaultProps">
                </el-tree>
            </el-form-item>
            <el-form-item  label="备注：">
                <el-input maxlength="512" ref="remark"  v-model.trim="formData.remark" style="width: 500px;" type="textarea" placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="状态：">
                <el-radio v-model="formData.isValid" :label="1">启用</el-radio>
                <el-radio v-model="formData.isValid" :label="0">停用</el-radio>
            </el-form-item>
       </el-form>
       <div style="text-align:center;padding: 10px 0">
            <el-button type="primary" @click="keepData" size="mini">保存</el-button>
            <el-button type="" @click="back" size="mini">取消</el-button>
        </div>
        <!-- 操作日志弹窗 -->
        <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
            <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" ></operate-table>
        </el-dialog>
    </div>
</template>
<script>
import operateTable from '@/components/operateTable';
let reditName = '';
export default {
    name: 'roleManageAdd',
    data() {
        return {
            dialogVisibleTable: false,
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'AclRole'
            },
            formData: {
                roleType: '',
                name: '',
                remark: '',
                isValid: 1,
                roleJurisdiction: []
            },
            roleTypeOptions: [],
            roleData: [],
            expandedKeys: [],
            checkedKeys: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            id: this.$route.query.id
        };
    },
    mounted: function() {
        this.roleTypeInit();
        if (this.id) this.roleReditInit();
    },
    components: {
        operateTable
    },
    methods: {
        openOperateDialog() {
            this.dialogVisibleTable = true;
        },
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        handleNodeClick(val, obj) {
            if (obj.checkedKeys.length) {
                this.formData.roleJurisdiction = obj.checkedKeys.filter((item) => {
                    return item >= 1000;
                });
                console.log(this.formData.roleJurisdiction);
            } else {
                this.formData.roleJurisdiction = [];
            }
        },
        keepData() {
            if (!this.formData.name) {
                return this.$utils.messagetip.warningTip('请输入角色名称');
            } else {
                if (reditName !== this.formData.name) {
                    this.$AXIOS.GET('/accredit/role', {name: this.formData.name}).then(res => {
                        if (res.result) {
                            this.formData.name = '';
                            return this.$utils.messagetip.warningTip('该角色名称已经存在,请用其他名称！');
                        }
                    });
                }
            }


            if (!this.formData.roleType) {
                return this.$utils.messagetip.warningTip('请选择角色类型');
            } else if (!this.formData.roleJurisdiction.length) {
                return this.$utils.messagetip.warningTip('角色权限至少选择一个');
            } else {
                // 添加节点id
                let arr = [];
                if (this.roleData && this.roleData.length) {
                  this.roleData.forEach(item => {
                    if (item.children && item.children.length) {
                        item.children.forEach(subItem => {
                          if (subItem.children && subItem.children.length) {
                            subItem.children.forEach(supItem => {
                              if (this.formData.roleJurisdiction.indexOf(supItem.id) > -1) {
                                arr.push(subItem.id);
                              }
                            });
                          }
                        });
                    }
                  });
                }
                if (arr && arr.length) {
                  arr.forEach(item => {
                    if (this.formData.roleJurisdiction.indexOf(item) < 0) {
                      this.formData.roleJurisdiction.push(item);
                    }
                  });
                }
                // // 防止页面数据渲染不正确
                let defaultArr = [
                  10609,
                  10610,
                  10411,
                  10412,
                  10611,
                  20301,
                  20306,
                  20701,
                  20702,
                  20601,
                  20602,
                  20603,
                  20604,
                  20605,
                  20606,
                  20614
                ];
                this.formData.roleJurisdiction.forEach((item, i) => {
                  if (defaultArr.indexOf(item) > -1) {
                    // 退货管理
                    if (this.formData.roleJurisdiction.indexOf(20306) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(20307) > -1 &&
                        this.formData.roleJurisdiction.indexOf(20308) > -1 &&
                        this.formData.roleJurisdiction.indexOf(20309) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(20306) > -1);
                      }
                    }

                    // 定价计划
                    if (this.formData.roleJurisdiction.indexOf(20604) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(20610) > -1 &&
                        this.formData.roleJurisdiction.indexOf(20616) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(20604) > -1);
                      }
                    }
                    // 分销商
                    if (this.formData.roleJurisdiction.indexOf(20605) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(20611) > -1 &&
                        this.formData.roleJurisdiction.indexOf(20612) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(20605) > -1);
                      }
                    }
                    // 权限管理
                    if (this.formData.roleJurisdiction.indexOf(10411) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(10403) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10409) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(10411) > -1);
                      }
                    }
                    // 仓库信息管理
                    if (this.formData.roleJurisdiction.indexOf(10609) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(10601) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10603) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(10609) > -1);
                      }
                    }
                    // 仓间调拨管理
                    if (this.formData.roleJurisdiction.indexOf(10610) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(10605) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10606) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10607) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10608) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(10610));
                      }
                    }
                    // 其他出入库管理
                    if (this.formData.roleJurisdiction.indexOf(10611) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(10615) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10614) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10613) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10612) > -1
                      ) {
                        console.log('其他出入库管理');
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(10611));
                      }
                    }
                    // 库存调整
                    if (this.formData.roleJurisdiction.indexOf(10904) > -1) {
                      if (
                        this.formData.roleJurisdiction.indexOf(10906) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10907) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10908) > -1 &&
                        this.formData.roleJurisdiction.indexOf(10909) > -1
                      ) {
                      } else {
                        this.formData.roleJurisdiction.splice(this.formData.roleJurisdiction.indexOf(10904) > -1);
                      }
                    }
                  }
                });
                this.formData.roleJurisdiction = this.formData.roleJurisdiction.join(',');
                if (!this.id) {
                    this.$AXIOS.POST('/accredit/role', this.formData, true).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        this.back();
                    }, error => {
                        if (error.appcode === '0') {
                            this.formData.roleJurisdiction = this.formData.roleJurisdiction.split(',');
                        }
                    });
                } else {
                    this.$AXIOS.PUT('/accredit/role/' + this.id, this.formData, true).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        this.back();
                    }, error => {
                        if (error.appcode === '0') {
                            this.formData.roleJurisdiction = this.formData.roleJurisdiction.split(',');
                        }
                    });
                }
            }
        },
        roleTypeChange(val) {
            this.formData.roleJurisdiction = [];
            this.checkedKeys = [];
            if (val === 'wholeJurisdiction') {
                this.roleDataInit('jurisdictionWholeModule', 1);
            } else if (val === 'channelJurisdiction') {
                this.roleDataInit('jurisdictionChannelModule', 2);
            } else {
                this.roleData = [];
            }
        },
        roleReditInit() {
            this.$AXIOS.GET('/accredit/role/' + this.id).then(res => {
                this.operateParams.entityId = res.result.id;
                this.formData.name = res.result.name;
                reditName = res.result.name;
                this.formData.roleType = res.result.roleType;
                this.formData.remark = res.result.remark;
                this.formData.isValid = res.result.isValid * 1;
                this.roleCheckedInit(res.result);
            });
        },
        roleCheckedInit(res) {
            let flagId;
            if (res.roleType === 'wholeJurisdiction') {
                flagId = 1;
                this.roleDataInit('jurisdictionWholeModule/' + this.id, flagId);
            } else if (res.roleType === 'channelJurisdiction') {
                flagId = 2;
                this.roleDataInit('jurisdictionChannelModule/' + this.id, flagId);
            }
        },
        roleDataInit(str, flagId) {
            this.$AXIOS.GET('/accredit/' + str).then(res => {
                let roleArr = res.result;
                let one = [];

                for (let i = 0; i < roleArr.length;) {
                    if (roleArr[i].parentId === flagId) {
                        one.push({
                            id: roleArr[i].id,
                            label: roleArr[i].name,
                            children: []
                        });
                        this.expandedKeys.push(roleArr[i].id);
                        roleArr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                roleArr.map((childItem, index) => {
                    if (childItem.check === 'true') {
                        this.checkedKeys.push(childItem.id);
                        this.formData.roleJurisdiction.push(childItem.id);
                    }
                    one.map(parItem => {
                        if (childItem.parentId === parItem.id) {
                            parItem.children.push({
                                id: childItem.id,
                                label: childItem.name
                            });
                            this.expandedKeys.push(childItem.id);
                        }
                    });
                });
                roleArr.map((childItem, index) => {
                    one.map(obj => {
                        obj.children.map(parItem => {
                            if (childItem.parentId === parItem.id) {
                                if (parItem.children) {
                                    parItem.children.push({
                                        label: childItem.name,
                                        id: childItem.id
                                    });
                                } else {
                                    parItem.children = [{
                                        label: childItem.name,
                                        id: childItem.id
                                    }];
                                }
                            }
                        });
                    });
                });
                this.roleData = one;
            });
        },
        roleTypeInit() {
            this.$AXIOS.GET('/select/roleType').then(res => {
                this.roleTypeOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.value
                    };
                });
                this.roleTypeOptions.unshift({
                    label: '请选择',
                    value: ''
                });
            });
        },
        back() {
            this.$router.push({
                path: '/roleManage'
            });
        }
    }
};
</script>

