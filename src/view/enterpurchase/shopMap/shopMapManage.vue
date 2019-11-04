<template>
    <div class="shopMapManage">
        <el-form label-width="120px" size="mini">
            <el-row :span="24">
                <el-col :span="6">
                    <el-form-item label="计划名称：">
                        <el-input v-model="searchParams.channelName" type="text" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商：">
                        <el-select v-model="searchParams.channelCode" filterable placeholder="请选择">
                            <el-option
                                v-for="item in channelOptionsList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="更新时间：">
                        <el-col :span="11">
                            <el-form-item prop="" size="mini">
                                <el-date-picker v-model="searchParams.startDate"  :clearable='true' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="" size="mini">
                                <el-date-picker v-model="searchParams.endDate"   type="date" :clearable='true' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态：">
                        <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col  :span="8">
                    <el-form-item>
                        <el-button size="mini" @click="search" type="primary">查询</el-button>
                        <el-button size="mini" @click="restFrom">清空条件</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row :span="24">
            <el-button type="primary" @click="toShopMapAdd" size="mini"> 新增 </el-button>
        </el-row>
        <el-table :data="tableData" border style="width: 100%; margin:10px 0;">
                <el-table-column type="index" align="center"  label="序号"  width="50">  </el-table-column>
                <el-table-column align="center" prop="channelName " label="计划名称">
                    <template slot-scope="scope">
                        <el-button @click="toShopMapDetail(scope.row)" type="text">{{ scope.row.channelName }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name"  label="供应商">
                    <template slot-scope="scope">
                        <el-button @click="toShopMapsupil(scope.row)" type="text">{{ scope.row.supplierName ? scope.row.supplierName : scope.row.supplierShortCall }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.isValid == 1 ? '启用' : '停用' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updateOperator" label="更新人"> </el-table-column>
                <el-table-column align="center" prop="updateTime" label="更新时间">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toShopMapEdit(scope.row)" size="mini"> 编辑 </el-button>
                        <el-button @click="isValid(scope.row)" type="text" size="mini"> {{ scope.row.isValid == 1 ? '停用' : '启用' }}</el-button>
                    </template>
                </el-table-column>
          </el-table>
          <div class="page" style="text-align:right; padding: 10px 0;">
              <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
              </el-pagination>
          </div>
    </div>
</template>

<script>
import {formatDate} from '@/components/date';
import qs from 'qs';
export default {
    data() {
        return {
            channelOptionsList: [],
            searchParams: {
                channelName: '', // 计划名称
                channelCode: '', // 供应商id
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                isValid: '', // 状态
                pageNumber: 1,
                pageSize: 10,
                recordTotal: 0
            },
            options: [{
                value: '',
                label: '不限'
            }, {
                value: '0',
                label: '停用'
            }, {
                value: '1',
                label: '启用'
            }],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        };
    },
    mounted: function() {
        this.initDataTable(this.searchParams);
        this.channelOptions();
    },
    filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    methods: {
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initDataTable(this.searchParams);
        },
        changeNumber(val) {
            this.searchParams.pageNumber = val;
            this.initDataTable(this.searchParams);
        },
        // 搜索
        search() {
            this.searchParams.pageNumber = 1;
            if (this.searchParams.startDate > this.searchParams.endDate) {
                this.$message.warning('结束时间不能大于开始时间!');
                return;
            };
            if (this.searchParams.startDate) this.searchParams.startDate = this.searchParams.startDate + ' 00:00:00';
            if (this.searchParams.endDate) this.searchParams.endDate = this.searchParams.endDate + ' 23:59:59';
            this.initDataTable(this.searchParams);
        },
        restFrom() {
            for (let obj in this.searchParams) {
                this.searchParams[obj] = '';
            }
            this.searchParams.pageNumber = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.recordTotal = 0;
            this.initDataTable(this.searchParams);
        },
        // 启停用
        isValid(row) {
            let data = {};
            let str, str1;
            if (row.isValid === '1') {
                data.isValid = '0';
                str = '停用成功';
                str1 = '确定停用？';
            } else if (row.isValid === '0') {
                data.isValid = '1';
                str = '启用成功';
                str1 = '确定启用？';
            }
            data.id = row.id;
            this.$confirm(str1, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.PUT('/itemsRelation/updateIsvalid', data).then(res => {
                    this.$message.success(str);
                    setTimeout(() => {
                        this.restFrom();
                    }, 500);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
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
         // 去往编辑页
        toShopMapEdit(row) {
            this.$router.push({name: 'shopMapDetail', params: {id: row.id}});
        },
        // 去往新增页
        toShopMapAdd() {
             this.$router.push({name: 'shopMapDetail', params: {id: 'add'}});
        },
        // 去往详情页
        toShopMapDetail(row) {
            this.$router.push({name: 'shopMapAdd', params: {id: row.id}});
        },
        // 去往供应商的详情
        toShopMapsupil(row) {
             let obj = {
                hideLogs: '0',
                supplierCode: row.channelCode,
                flag: '1'
            };

            let config = {
                title: '供应商详情',
                href: 'supplier/supplierDetail.html?' + qs.stringify(obj)
            };
            top.window.addTab(config);
        },
        // 映射分页列表
        initDataTable(data) {
            this.GET('/itemsRelation/selectItmesRelationPage', data).then(res => {
                this.tableData = res.body.objects;
                this.searchParams.recordTotal = res.body.recordTotal;
            });
        }
    }
};
</script>
<style lang="stylus" scoped>

</style>

