<template>
    <div class="WMSauthorizaAdd">
        <div v-if="id" class="title" style="padding:12px 10px;  display:flex; justify-content: space-between; background-color: hsla(220,4%,58%,.1); margin-bottom:20px;">
            <div>基本信息</div>
            <span  @click="openOperateDialog" style="color: #409eff; cursor:pointer;">操作日志</span>
        </div>
        <el-form label-width="160px" size="mini">
            <el-form-item required label="用户名称：">
                <el-input maxlength="32" ref="name" v-model="formData.name"   style="width: 250px;"  placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="手机号：">
                <el-input :disabled="this.id" maxlength="32" ref="phone" v-model="formData.phone" @change="checkPhone" style="width: 250px;"  placeholder=""></el-input>
            </el-form-item>
            <el-form-item required label="所属自营仓：">
                <el-checkbox-group v-model="wmsWarehouseChecked" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="data in wmsWarehouseOptions" :label="data.value" :key="data.value">{{data.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item required label="用户权限：">
                <el-tree
                    @check="handleNodeClick"
                    :data="wmsAuthorizaOptions"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="expandedKeys"
                    :default-checked-keys="checkedKeys"
                    :props="defaultProps">
                </el-tree>
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
let reditPhone = '';
export default {
    name: 'WMSauthorizaAdd',
    data() {
        return {
            dialogVisibleTable: false,
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'AclWmsUserAccreditInfo'
            },
            formData: {
                name: '',
                phone: '',
                isValid: 1,
                remark: ''
            },
            expandedKeys: [],
            checkedKeys: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            id: this.$route.query.id,
            wmsWarehouseOptions: [],
            wmsWarehouseChecked: [],
            wmsAuthorizaOptions: [],
            wmsAuthorizaChecked: []
        };
    },
    mounted: function() {
        if (this.id) {
            this.editInitData();
        } else {
            this.authorizaInit();
        }
        this.warehouseInit();
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
        editInitData() {
            this.$AXIOS.GET('/aclWmsUser/aclWmsUserQuery/' + this.id).then(res => {
                this.operateParams.entityId = res.result.id;
                this.formData.name = res.result.name;
                this.formData.phone = res.result.phone;
                this.formData.isValid = res.result.isValid * 1;
                reditPhone = res.result.phone;
                this.formData.remark = res.result.remark;
                res.result.warehouseInfoList.map(item => {
                    this.wmsWarehouseChecked.push(item.code);
                });
                this.changeAuthoriza(res.result.wmsResourceList);
            });
        },
        checkPhone(val) {
            let regexp = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
            if (!regexp.test(val) || !this.formData.phone) {
                this.formData.phone = '';
                return this.$utils.messagetip.warningTip('手机号格式错误');
            } else {
                if (reditPhone !== this.formData.phone) {
                    this.$AXIOS.POST('/aclWmsUser/aclWmsUserPhone', {phone: val}).then(res => {
                        if (res.result !== 1) {
                            this.$utils.messagetip.errorTip(res.result);
                            this.formData.phone = '';
                        }
                    });
                }
            }
        },
        keepData() {
            if (!this.formData.name) {
                return this.$utils.messagetip.warningTip('请填写用户名');
            } else if (this.checkPhone(this.formData.phone)) {

            } else if (!this.wmsWarehouseChecked.length) {
                return this.$utils.messagetip.warningTip('请勾选所属自营仓');
            } else if (!this.wmsAuthorizaChecked.length) {
                return this.$utils.messagetip.warningTip('请勾选用户权限');
            } else {
                let data = this.formData;
                let list = [];
                this.wmsWarehouseChecked.forEach(item => {
                  this.wmsWarehouseOptions.forEach(subItem => {
                    if (item === subItem.value) {
                      list.push(item);
                    }
                  });
                });
                data.warehouseCode = list.join(',');
                data.resourceCode = this.wmsAuthorizaChecked.join(',');
                if (!this.id) {
                    this.$AXIOS.POST('/aclWmsUser/aclWmsUserSave', data, true).then(res => {
                        this.$utils.messagetip.successTip(res.databuffer);
                        this.back();
                    });
                } else {
                    if (reditPhone !== this.formData.phone) {
                        this.$AXIOS.POST('/aclWmsUser/aclWmsUserPhone', {phone: this.formData.phone}).then(res => {
                            if (res.result !== 1) {
                                this.formData.phone = '';
                                return this.$utils.messagetip.errorTip(res.result);
                            } else {
                                this.$AXIOS.PUT('/aclWmsUser/aclWmsUserUpdate/' + this.id, data, true).then(res => {
                                    this.$utils.messagetip.successTip(res.databuffer);
                                    this.back();
                                });
                            }
                        });
                    } else {
                        this.$AXIOS.PUT('/aclWmsUser/aclWmsUserUpdate/' + this.id, data, true).then(res => {
                            this.$utils.messagetip.successTip(res.databuffer);
                            this.back();
                        });
                    }
                }
            }
        },
        back() {
            this.$router.push({
                path: '/WMSauthoriza'
            });
        },
        handleCheckedCitiesChange(val) {

        },
        handleNodeClick(val, obj) {
            this.wmsAuthorizaChecked = [...obj.halfCheckedKeys, ...obj.checkedKeys];
        },
        warehouseInit() {
            this.$AXIOS.GET('/aclWmsUser/aclWmsUserWarehouse').then(res => {
                this.wmsWarehouseOptions = res.result.map(item => {
                    return {
                        label: item.warehouseName,
                        value: item.code
                    };
                });
            });
        },
        changeAuthoriza(obj) {
            let roleArr = obj;
            let one = [];

            for (let i = 0; i < roleArr.length;) {
                if (roleArr[i].parentId === 0) {
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
                if (childItem.check === 'true' && childItem.code > 1000) {
                    this.checkedKeys.push(childItem.code);
                    this.wmsAuthorizaChecked.push(childItem.code);
                }
                one.map(parItem => {
                    if (childItem.parentId === parItem.id) {
                        parItem.children.push({
                            id: childItem.code,
                            label: childItem.name
                        });
                        this.expandedKeys.push(childItem.code);
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
                                    id: childItem.code
                                });
                            } else {
                                parItem.children = [{
                                    label: childItem.name,
                                    id: childItem.code
                                }];
                            }
                        }
                    });
                });
            });
            this.wmsAuthorizaOptions = one;
        },
        authorizaInit() {
            this.$AXIOS.GET('/aclWmsUser/aclWmsUserResource').then(res => {
                this.changeAuthoriza(res.result);
            });
        }
    }
};
</script>

