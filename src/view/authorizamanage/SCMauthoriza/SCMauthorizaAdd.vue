<template>
    <div class="SCMauthorizaAdd">
        <div v-if="id" class="title" style="padding:12px 10px;  display:flex; justify-content: space-between; background-color: hsla(220,4%,58%,.1); margin-bottom:20px;">
            <div>基本信息</div>
            <span  @click="openOperateDialog" style="color: #409eff; cursor:pointer;">操作日志</span>
        </div>
        <el-form label-width="160px" size="mini">
            <el-form-item required label="用户姓名：">
                <el-input maxlength="32" ref="name" v-model="formData.name" style="width: 250px;"  placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="手机号：">
                <el-input maxlength="13" :disabled="id ? true : false" ref="phone" v-model="formData.phone" @change="checkPhone" style="width: 250px;" placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="用户类型：">
                <el-select ref="userType" @change="userTypeChange" v-model="formData.userType" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="formData.userType == 'channelUser'||formData.userType == 'mixtureUser'" required label="所属业务线及销售渠道：">
                <el-row :span="24">
                    <el-col :span="18">
                        <el-table :data="channalOptions" border="" :height="480">
                            <el-table-column align="center"    label="所属业务线" >
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.parent.checked">{{ scope.row.parent.channelName }}</el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"    label="所属业务销售渠道" >
                                <template slot-scope="scope">
                                     <el-checkbox-group ref="checkbox" v-model="scope.row.checkedList">
                                        <el-checkbox v-for="data in scope.row.child" :key="data.channelCode" :label="data.channelCode">{{ data.channelName }}</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item required label="角色：">
                <el-row :span="24">
                    <el-col :span="18">
                        <strong v-if="!formData.userType">请选择用户类型</strong>
                        <div v-else>
                            <strong v-if="formData.userType == 'mixtureUser'">渠道用户：</strong>
                            <el-checkbox-group   v-model="roleCheckList" >
                                <el-checkbox @change="judgeRole(data)"    v-for="data in roleOptions" :key="data.value" :label="data.value">{{ data.label }}</el-checkbox>
                            </el-checkbox-group>
                            <strong v-if="formData.userType == 'mixtureUser'">全局用户：</strong>
                            <el-checkbox-group  v-model="roleCheckList">
                                <el-checkbox v-for="data in roleAllOptions" :key="data.value" :label="data.value">{{ data.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item  label="备注：">
                <el-input maxlength="512" ref="remark" v-model="formData.remark"  style="width: 500px;" type="textarea" placeholder=""></el-input>
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
export default {
    name: 'SCMauthorizaAdd',
    data() {
        return {
            dialogVisibleTable: false,
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'AclUserAccreditInfo'
            },
            formData: {
                name: '',
                phone: '',
                userType: '',
                remark: '',
                isValid: 1
            },
            channelMsg: [],
            options: [],
            channalOptions: [],
            roleOptions: [],
            roleCheckList: [],
            roleAllOptions: [],
            id: this.$route.query.id,
            initUserType: ''
        };
    },
    components: {
        operateTable
    },
    mounted: function() {
        this.initOptions();
        if (this.id) {
            this.asynchange();
        } else {
            this.channalInit();
        }
    },
    methods: {
        async asynchange() {
            let res = await this.channalInit();
            this.SCMreditInit();
        },
        judgeRole(val) {
            if (val.label === '采购组员' && this.id) {
                this.$AXIOS.GET('accredit/checkPurchase/' + this.id).then(res => {
                    if (res.result) {
                        this.roleCheckList.push(val.value);
                        this.$confirm(`采购组员已在采购组【${res.result.join(',')}】中，请先将用户从采购组中移除！`, '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            center: true
                        }).then(() => {
                        }).catch(() => {
                        });
                    }
                });
            }
        },
        openOperateDialog() {
            this.dialogVisibleTable = true;
        },
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        // 详情
        SCMreditInit() {
            this.$AXIOS.GET(`/accredit/accreditInfo/${this.id}`, {id: this.id}).then(res => {
                this.operateParams.entityId = res.result.id;
                this.formData.name = res.result.name;
                this.formData.phone = res.result.phone;
                this.formData.userType = res.result.userType;
                this.formData.remark = res.result.remark;
                this.formData.isValid = res.result.isValid * 1;
                this.roleCheckList = JSON.parse(res.result.roleNames);
                this.initUserType = res.result.userType;
                // 重置业务线和销售渠道
                let roleNames = [];

                if (this.formData.userType === 'channelUser') {
                   this.$AXIOS.GET('/accredit/rolelist/', {roleType: 'channelJurisdiction'}).then(res => {
                       this.roleOptions = res.result.map(item => {
                            if (this.roleCheckList.indexOf(item.id) > -1) {
                                roleNames.push(item.id);
                            }
                            return {
                                label: item.name,
                                value: item.id
                            };
                        });
                        this.roleCheckList = roleNames;
                   });
                } else if (this.formData.userType === 'overallUser') {
                    this.$AXIOS.GET('/accredit/rolelist/', {roleType: 'wholeJurisdiction'}).then(res => {
                       this.roleAllOptions = res.result.map(item => {
                            if (this.roleCheckList.indexOf(item.id) > -1) {
                                roleNames.push(item.id);
                            }
                            return {
                                label: item.name,
                                value: item.id
                            };
                        });
                        this.roleCheckList = roleNames;
                   });
                } else if (this.formData.userType === 'mixtureUser') {
                    this.$AXIOS.GET('/accredit/rolelist/', {roleType: ''}).then(res => {
                        res.result.map(item => {
                            if (this.roleCheckList.indexOf(item.id) > -1) {
                                roleNames.push(item.id);
                            }
                            if (item.roleType === 'channelJurisdiction') {
                                this.roleOptions.push({
                                    label: item.name,
                                    value: item.id
                                });
                            } else if (item.roleType === 'wholeJurisdiction') {
                                this.roleAllOptions.push({
                                    label: item.name,
                                    value: item.id
                                });
                            }
                        });
                        this.roleCheckList = roleNames;
                   });
                }

                if (res.result.channelExtList && res.result.channelExtList.length) {
                    this.channalOptions.map(item => {
                        res.result.channelExtList.map(item1 => {
                            if (item.parent.channelCode === item1.code) {
                                item.parent.checked = true;
                                item1.sellChannelList.map(item2 => {
                                    item.checkedList.push(item2.sellCode);
                                });
                            }
                        });
                    });
                }
            });
        },
        userTypeChange(val) {
            if (this.id) {
                this.$AXIOS.GET('accredit/checkPurchase/' + this.id).then(res => {
                    if (res.result) {
                        this.formData.userType = this.initUserType;
                        this.$confirm(`该用户还属于正在使用的【${res.result.join(',')}】中，请先将用户从采购组中移除！`, '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            center: true
                        }).then(() => {
                        }).catch(() => {
                        });
                    } else {
                        this.changeUsertype(val);
                    }
                });
            } else {
                this.changeUsertype(val);
            }
        },
        changeUsertype(val) {
            let data = {roleType: ''};
            this.channalOptions.map((item, index) => {
                item.parent.checked = false;
                item.checkedList = [];
            });
            this.roleCheckList = [];
            if (val === 'channelUser') {
                data.roleType = 'channelJurisdiction';
            } else if (val === 'overallUser') {
                data.roleType = 'wholeJurisdiction';
            } else if (val === 'mixtureUser') {
                data.roleType = '';
            }
            this.$AXIOS.GET('/accredit/rolelist/', data).then(res => {
                this.roleAllOptions = [];
                this.roleOptions = [];
                // this.roleCheckList = [];
                if (data.roleType === 'channelJurisdiction') {
                    this.roleOptions = res.result.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        };
                    });
                } else if (data.roleType === 'wholeJurisdiction') {
                    this.roleAllOptions = res.result.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        };
                    });
                } else if (!data.roleType) {
                    res.result.map(item => {
                        if (item.roleType === 'channelJurisdiction') {
                            this.roleOptions.push({
                                label: item.name,
                                value: item.id
                            });
                        } else if (item.roleType === 'wholeJurisdiction') {
                            this.roleAllOptions.push({
                                label: item.name,
                                value: item.id
                            });
                        }
                    });
                }
            });
        },
        keepData() {
            let channalOptions = [];
            for (let obj in this.formData) {
                if (!this.formData[obj] && obj === 'name') {
                    this.$refs[obj].focus();
                    this.$utils.messagetip.warningTip('请输入用户名');
                    return;
                } else if (!this.formData[obj] && obj === 'phone') {
                    this.checkPhone(this.formData[obj]);
                    return;
                } else if (obj === 'userType' && !this.formData[obj]) {
                    return this.$utils.messagetip.warningTip('请选择用户类型');
                }
            }

            this.channalOptions.map((item, index) => {
                let check = {};
                if (item.parent.checked) {
                    check.channelCode = item.parent.channelCode;
                    check.channelName = item.parent.channelName;
                }
                if (item.checkedList.length) {
                    let arr = [];
                    item.child.map(item2 => {
                        if (item.checkedList.indexOf(item2.channelCode) > -1) {
                            arr.push({
                                sellChannelCode: item2.channelCode,
                                sellChannelName: item2.channelName
                            });
                        }
                    });
                    check.sellChannelList = arr;
                }
                if (JSON.stringify(check) !== '{}') {
                    channalOptions.push(check);
                }
            });

            if (!channalOptions.length && this.formData.userType !== 'overallUser') {
                return this.$utils.messagetip.warningTip('请选择业务线及销售渠道');
            } else if (!this.roleCheckList.length) {
                return this.$utils.messagetip.warningTip('请至少选择一个角色');
            } else {
                let data = this.formData;
                if (this.formData.userType !== 'overallUser') {
                    data.channelMsg = JSON.stringify(channalOptions);
                } else {
                    data.channelMsg = JSON.stringify([]);
                }

                data.roleNames = [...this.roleCheckList].join(',');
                console.log(data);
                if (this.id) {
                    this.$AXIOS.PUT('/accredit/updateaccredit/' + this.id, data, true).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        this.$router.push({path: '/SCMauthoriza'});
                    });
                } else {
                    this.$AXIOS.POST('/accredit/saveaccredit', data, true).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        this.$router.push({path: '/SCMauthoriza'});
                    });
                }
            }
        },
        checkPhone(val) {
            let regexp = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
            if (!regexp.test(val)) {
                let obj = this.$refs['phone'];
                obj.focus();
                this.formData.phone = '';
                return this.$utils.messagetip.warningTip('手机号格式错误');
            } else {
                this.$AXIOS.GET('/accredit/checkPhone', {phone: val}).then(res => {
                    if (res.result) {
                        this.$utils.messagetip.errorTip(res.result);
                        this.formData.phone = '';
                        this.$refs['phone'].focus();
                    }
                });
            }
        },
        channalInit() {
           return this.$AXIOS.GET('/accredit/select/channel', {start: 0, pageIndex: 0}).then(res => {
                this.channalOptions = res.result.map(item => {
                    return {
                        parent: {
                            channelName: item.nameValue.channelName,
                            channelCode: item.nameValue.channelCode,
                            checked: false
                        },
                        child: item.sellChannelList.map(item2 => {
                            return {
                                channelName: item2.sellName,
                                channelCode: item2.sellCode
                            };
                        }),
                        checkedList: []
                    };
                });
            });
        },
        initOptions() {
            this.$AXIOS.GET('/select/userType').then(res => {
                this.options = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.value
                    };
                });
                this.options.unshift({
                    label: '请选择',
                    value: ''
                });
                console.log(this.options);
            });
        },
        back() {
            this.$router.push({path: '/SCMauthoriza'});
        }
    }
};
</script>
