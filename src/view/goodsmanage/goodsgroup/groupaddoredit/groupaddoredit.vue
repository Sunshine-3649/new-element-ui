<template>
  <div class="groupaddoredit">

      <!-- 商品组编辑或详情 -->
      <el-card v-if="flag == 'redit' || id == 'add'" class="box-card">
        <div slot="header" class="clearfix">
            <span>基本信息</span>
            <el-button  @click="openOperateDialog" v-show="id !== 'add'"  style="float: right; padding: 3px 0" type="text">操作日志</el-button>
        </div>
        <el-form label-width="125px" v-model="searchParams" size="medium">
            <el-row v-if="id !== 'add'" :span="24">
                <el-col :span="6">
                    <el-form-item label="商品组编号：" prop="" size="mini">
                        {{ searchParams.itemGroupCode }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <span class="requiredItem">*</span>
                    <el-form-item label="商品组名称：" prop="" size="mini">
                        <el-input  v-model.trim="searchParams.itemGroupName"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <span class="requiredItem a1">*</span>
                    <el-form-item label="商品组员：" prop="" size="mini">
                        <el-button @click="addMember"  placeholder="">添加组员</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="12">
                    <el-form-item id="shopTable" label="" prop="" size="mini">
                        <el-table class="group_table" :data="tableData" border style="width: 100%">
                            <el-table-column align="center" prop="name" label="姓名" >
                                <template slot-scope="scope">
                                    <el-input placeholder="请输入名称" v-model="scope.row.name" type="text"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="phoneNumber" label="手机号" >
                                <template slot-scope="scope">
                                    <el-input placeholder="请输入手机号码" v-model="scope.row.phoneNumber" type="text"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="" label="选为组长(多选)" >
                                <template slot-scope="scope">
                                    <el-checkbox @change="changeCheckbox(scope.row,scope.row.isLeader=='1')" v-model="tableChecked[scope.$index]" :checked="scope.row.isLeader=='1'" label="1"> &nbsp; </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="date" label="删除" >
                                <template slot-scope="scope">
                                    <i @click="deleteRow(scope.$index)" style="color:red" class="el-icon-close"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="12">
                    <el-form-item label="备注：" prop="" size="mini">
                        <el-input v-model="searchParams.remark" type="textarea" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="6">
                <span class="requiredItem a2">*</span>
                <el-form-item label="状态：" prop="" size="mini">
                    <el-radio-group v-model="searchParams.isValid">
                        <el-radio :label="'1'">启用</el-radio>
                        <el-radio :label="'0'">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
        </el-form>
      </el-card>

     <!-- 商品详情 -->
    <el-card v-if="flag == 'detail' " class="box-card">
        <div slot="header" class="clearfix">
            <span>基本信息</span>
            <el-button @click="openOperateDialog"  style="float: right; padding: 3px 0" type="text">操作日志</el-button>
        </div>
        <el-form label-width="125px" v-model="searchParams" size="medium">
            <el-row v-if="id !== 'add'" :span="24">
                <el-col :span="6">
                    <el-form-item label="商品组编号：" prop="" size="mini">
                        {{ searchParams.itemGroupCode }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="商品组名称：" prop="" size="mini">
                        {{ searchParams.itemGroupName }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="12">
                    <el-form-item label="商品组员：" prop="" size="mini">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column align="center" prop="name" label="姓名" >
                            </el-table-column>
                            <el-table-column align="center" prop="phoneNumber" label="手机号" >
                            </el-table-column>
                            <el-table-column align="center" prop="" label="选为组长(多选)" >
                                <template slot-scope="scope">
                                    {{ scope.row.isLeader === '1' ? '是' : '否' }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">

            </el-row>
            <el-row :span="24">
                <el-col :span="12">
                    <el-form-item label="备注：" prop="" size="mini">
                        {{ searchParams.remark }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="6">
                <el-form-item label="状态：" prop="" size="mini">
                    {{ searchParams.isValid === '1' ? '启用' : '停用' }}
                </el-form-item>
            </el-row>
        </el-form>
      </el-card>
    <div v-if="flag == 'redit' || id == 'add'" style="text-align:center;margin:30px 0;">
        <el-button  @click="keepData" type="primary" size="mini">保存</el-button>
        <el-button  @click="back" size="mini">取消</el-button>
    </div>
    <div v-else style="text-align:center;margin:30px 0;">
        <el-button @click="back" type="primary" size="mini">确定</el-button>
    </div>

    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>
<script>
import operateTable from '@/components/operateTable';
  export default {
    name: 'goodsgroupredit',
    data() {
        return {
            searchParams: {
                itemGroupCode: '', // 商品组编号
                itemGroupName: '', // 商品组名称
                isValid: '1', // 是否停启用
                leaderName: '', // 组长名称
                memberName: '', // 组员名字
                remark: '', // 备注
                channelCode: '', // 业务线编码
                id: '' // 商品id
            },
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'itemGroup'
            },
            isRefresh: 0, // 每次点击重新获取日志数据
            dialogVisibleTable: false,
            tableData: [],
            id: this.$route.params.id,  // 获取从列表页传过来的参数
            flag: '', // 有是详情 没有为编辑
            tableChecked: {}
        };
    },
    mounted: function() {
        let route = this.$route.params.id.indexOf('_');
        if (route > -1) {
            this.id = this.$route.params.id.split('_')[1];
            this.flag = this.$route.params.id.split('_')[0];
        } else {
            this.id = 'add';
        }
        if ( this.id !== 'add' ) {
            this.initDataDetail(this.id);
        }
        console.log(this.id);
    },
    components: {
        operateTable
    },
    methods: {
        changeCheckbox(sRow, checked) {
          sRow.isLeader = checked ? '0' : '1';
        },
        // 添加成员
        addMember() {
            let data = {
                name: '',
                phoneNumber: '',
                isLeader: 0,
                createOperator: '',
                channelCode: ''
            };
            this.tableData.push(data);
        },
        // 删除列表的某一项
        deleteRow(index) {
            this.$confirm( `您确认要删除此组员?`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
              .then(() => {
                 this.tableData.splice(index, 1);
                 this.tableChecked = {};
                 this.searchParams.leaderName = '';
                 let leaders = [];
                 this.tableData.map((item, index) => {
                     this.tableChecked[index] = (item.isLeader === '1');
                     if (item.isLeader === '1') { leaders.push(item.name); }
                 });
                 this.searchParams.leaderName = leaders.join(',');
            })
              .catch(() => {
                this.$utils.messagetip.infoTip('已取消');
            });
        },
        back() {
            this.$router.push({ path: '/goodsgroup' });
        },
        // 保存数据
        keepData() {
            if ( !this.searchParams.itemGroupName ) {
                this.$utils.messagetip.warningTip('请输入商品组名称');
            } else if (this.searchParams.itemGroupName.length > 20) {
                this.$utils.messagetip.warningTip('商品组名称不能超过20字');
            } else if (this.searchParams.isValid === '') {
                this.$utils.messagetip.warningTip('请选择商品组状态');
            } else if (!this.tableData.length ) {
                this.$utils.messagetip.warningTip('请先添加组成员后再保存');
            } else {
                let str = '';
                this.searchParams.leaderName = '';
                let leaders = [];
                this.tableData.map((item, index) => {
                    if (item.isLeader === true)item.isLeader = '1';
                    if (item.isLeader === false)item.isLeader = '0';
                      if (item.isLeader === '1') {
                        leaders.push(item.name);
                     }
                     if (index === this.tableData.length - 1) {
                         str += item.name;
                     } else {
                         str += item.name + ',';
                     }
                });
                this.searchParams.leaderName = leaders.join(',');
                if (!this.comfirm()) {
                    return;
                } else if (!this.searchParams.leaderName) {
                     this.$utils.messagetip.warningTip('请选择一个组员为组长');
                    return;
                }
                this.searchParams.memberName = str;
                let data = {
                    itemGroup: this.searchParams,
                    groupUserList: this.tableData
                };
                if (this.id === 'add') { // 增加商品组
                    this.$AXIOS.JSONPOST('/itemGroup/itemGroupSave', data).then(res => {
                            this.$utils.messagetip.successTip(res.databuffer);
                            setTimeout(() => {
                                this.$router.push({path: '/goodsgroup'});
                            }, 1000);
                        });
                } else {  // 更新商品组
                    this.$AXIOS.JSONPUT('/itemGroup/itemGroupEdit', data).then(res => {
                            this.$utils.messagetip.successTip(res.databuffer);
                            setTimeout(() => {
                                this.$router.push({path: '/goodsgroup'});
                            }, 1000);
                        });
                }
            }
        },
        // 校验表格名称和手机号码
        comfirm() {
            let flag = false;
            let num = -1; let index = '';
            let parent = document.getElementById('shopTable');
            let re = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);  // 验证手机号正则
            for (let i = 0; i < this.tableData.length; i++) {
                if (!this.tableData[i].name) {
                    num = i;
                    index = 0;
                    this.$utils.messagetip.warningTip('请填写组员名称');
                    break;
                } else if (this.tableData[i].name.length > 10) {
                    this.$utils.messagetip.warningTip('组员名称不能超过10字');
                    num = i;
                    index = 0;
                    break;
                } else if (!this.tableData[i].phoneNumber) {
                    num = i;
                    index = 1;
                    this.$utils.messagetip.warningTip('请填写组员手机号码');
                    break;
                } else if (!re.test(this.tableData[i].phoneNumber)) {
                    num = i;
                    index = 1;
                    this.$utils.messagetip.warningTip('手机号码格式不正确');
                    break;
                }
            }
            if (num > -1) {
                let item = parent.getElementsByClassName('el-table__row')[num];
                let input = item.getElementsByTagName('input')[index];
                input.focus();
            } else {
                flag = true;
            }
            return flag;
        },
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        openOperateDialog() {
            this.dialogVisibleTable = true;
            this.isRefresh += 1;
        },
        initDataDetail(id) {
            console.log(id);
            this.$AXIOS.GET('/itemGroup/itemGroupDetailQuery', { itemGroupCode: id }).then(res => {  // 查询商品组信息
                this.searchParams = res.result;
                this.operateParams.entityId = res.result.id;
                this.$AXIOS.GET('/itemGroup/itemGroupUsersQuery', { itemGroupCode: id }).then( res => { // 查询商品组员信息
                    this.tableData = res.result;
                    this.tableData.map((item, index) => {
                        this.tableChecked[index] = (item.isLeader === '1');
                    });
                });
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>
    .groupaddoredit
       .requiredItem
            color red
            position: relative;
            top: 21px;
            left: 33px;
        .requiredItem.a1
            left 46px
        .requiredItem.a2
            left 69px

</style>

<style lang="stylus" >
    .groupaddoredit
        .group_table
            tr
                th:nth-child(1), th:nth-child(2), th:nth-child(3)
                    div::before
                        content: '*'
                        padding-right: 5px
                        color: #ff0000
</style>

