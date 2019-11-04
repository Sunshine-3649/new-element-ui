<template>
    <div class="shopMapDetail">
        <div class="title">基本信息</div>
        <el-row :span="20" style="line-height:40px; padding:5px 0;">
            <el-col style="text-align:right; padding-right:10px;" :span="2">
                <span class="requied_red">*</span>
                <span>计划名称：</span>
            </el-col>
            <el-col :span="5">
                <el-input v-model="searchParams.channelName" size="mini" type="text"></el-input>
            </el-col>
            <el-col style="padding-left:5px;" :span="5">
                 必填，不可重复，最多限输入20字
            </el-col>
        </el-row>
        <el-row :span="24" style="line-height:40px; padding:5px 0;">
            <el-col style="text-align:right; padding-right:10px;" :span="2">
                <span class="requied_red">*</span>
                <span>供应商：</span>
            </el-col>
            <el-col :span="5">
                <el-select size="mini" v-model="searchParams.channelCode" filterable placeholder="请选择">
                    <el-option
                        v-for="item in channelOptionsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :span="24" style="line-height:40px;padding:5px 0;">
            <el-col style="text-align:right; padding-right:10px; " :span="2">
                <span class="requied_red">*</span>
                <span>状态：</span>
            </el-col>
            <el-radio-group v-model="searchParams.isValid">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
            </el-radio-group>
        </el-row>
        <el-row :span="24" style="line-height:40px;padding:5px 0;">
            <el-col style="text-align:right; padding-right:10px; " :span="2">
                <span>备注：</span>
            </el-col>
            <el-col :span="8">
                <el-input v-model="searchParams.memo" type="textarea"></el-input>
                <span>选填，最多输入500字</span>
            </el-col>
        </el-row>
        <div style="text-align:center">
            <el-button size="mini" @click="keepData" type="primary">保存</el-button>
            <el-button size="mini" @click="back" type="">取消</el-button>
        </div>
    </div>
</template>

<script>

let planName = '';

export default {
    data() {
        return {
            searchParams: {
                isValid: '1',
                channelName: '', // 计划名称
                channelCode: '', // 供应商id
                memo: '' // 备注
            },
            channelOptionsList: [], // 供应商列表
            radio: 1,
            id: this.$route.params.id
        };
    },
    mounted: function() {
        this.channelOptions();
        if (this.id !== 'add') {
            this.initShopDetail(this.id);
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 保存数据
        keepData() {
            if (!this.searchParams.channelName) {
                this.$message.warning('请输入计划名称');
                return;
            } else if (this.searchParams.channelName.length > 20) {
                this.$message.warning('计划名称不能超过20字');
                return;
            }
            if (this.id === 'add') {
                this.GET('/itemsRelation/checkField/' + this.searchParams.channelName).then(res => {
                    if (res.body === 'success') {
                       this.isRepeatPlanName();
                    } else {
                        this.$message.warning('该计划名称已存在');
                    }
                });
            } else {
                if ( planName !== this.searchParams.channelName) {
                    this.GET('/itemsRelation/checkField/' + this.searchParams.channelName).then(res => {
                        if (res.body === 'success') {
                            this.isRepeatPlanName();
                        } else {
                            this.$message.warning('该计划名称已存在');
                        }
                    });
                } else {
                    this.isRepeatPlanName();
                }
            }
        },
        // 保存成功
        isRepeatPlanName() {
            if (!this.searchParams.channelCode) {
                this.$message.warning('请先选择供应商');
            } else {
                this.POST('/itemsRelation/saveOrEditRelation', this.searchParams).then(res => {
                    this.$message.success('保存成功');
                    setTimeout(() => {
                        this.$router.push({path: '/shopMapManage'});
                    }, 1000);
                });
            }
        },
        // 判断计划名称是否存在
        isRepeatName(name) {
        },
        // 获取供应商列表
        channelOptions() {
            let data = {
                supplierName: ''
            };
            this.GET('/supplierAuthor/queryListByCondition', data).then(res => {
                this.channelOptionsList = res.body.map((item, index) => {
                      return {
                          label: item.supplierName,
                          value: item.supplierCode
                      };
                });
            });
        },
        // 获取详情
        initShopDetail(id) {
            this.GET('/itemsRelation/getRelationInfo/' + id).then(res => {
                this.searchParams = res.body;
                planName = res.body.channelName;
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
    .shopMapDetail
        .title
            background-color #ecf5ff
            padding 10px
        .requied_red 
            color red
</style>
