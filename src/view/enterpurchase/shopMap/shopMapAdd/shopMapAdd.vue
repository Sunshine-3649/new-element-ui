<template>
    <div class="shopMapDetail">
        <div class="title">基本信息 <span @click="openOperate" style="float:right; cursor:pointer;color:#409EFF;">操作日志</span></div>
        <div class="mainMsg">
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">计划名称：</el-col>
                <el-col :span="5">{{ tableData.channelName }}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">供应商：</el-col>
                <el-col :span="5">
                    <div style="cursor:pointer; color:#409EFF;"  @click="toDetail"  type="text">{{ tableData.supplierName }}</div>    
                </el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">状态：</el-col>
                <el-col :span="5">{{ tableData.isValid === '1' ? '启用' : '停用' }}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">创建人：</el-col>
                <el-col :span="5">{{ tableData.createOperator }}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">创建时间：</el-col>
                <el-col v-if="tableData.createTime" :span="5">{{ tableData.createTime | formatDate }}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">更新人：</el-col>
                <el-col :span="5">{{ tableData.updateOperator  }}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">更新时间：</el-col>
                <el-col v-if="tableData.updateTime" :span="5">{{ tableData.updateTime | formatDate}}</el-col>
            </el-row>
            <el-row class="msgWrap" :span="20">
                <el-col class="label" :span="2">备注：</el-col>
                <el-col :span="5">{{ tableData.memo  }}</el-col>
            </el-row>
        </div>
        <div class="title">映射信息</div>
        <el-tabs style="padding-top:15px;" v-model="searchParams.ifSetFlag" type="card" @tab-click="handleClick">
             <el-form label-width="125px">
                <el-row :span="24" class="search_cate">
                    <el-col :span="8">
                        <third-select :clear="clear" v-on:shopId="shopId"></third-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="searchParams.name" size="mini" placeholder="请输入商品名称"></el-input>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="6">
                         <el-button @click="searchShopMap" size="mini" type="primary" icon="search">搜索</el-button>
                         <!-- <el-button size="mini" type="default" icon="circle-cross">清空条件</el-button> -->
                    </el-col>
                </el-row>
            </el-form>
            <el-tab-pane label="已设置映射" name="1"></el-tab-pane>
            <el-tab-pane label="未设置映射" name="0"></el-tab-pane>
        </el-tabs>
        <div class="orderTable">
            <ul class="title">
                <li :key="title" v-for="title in orderTitle">{{ title }}</li>
            </ul>
            <div v-show="searchParams.list" :key="index" v-for="(data, index) in searchParams.list" class="main">
                <ul style="background-color:#fff;" class="title">
                    <li>{{ index+1  }}</li>
                    <li>{{ data.firstCategoryName  }}</li>
                    <li>{{ data.secondCategoryName }}</li>
                    <li>{{ data.thirdCategoryName  }}</li>
                    <li>{{ data.brandName  }}</li>
                    <li>
                        <el-button @click="toShopDetail(data)" type="text">{{ data.name  }}</el-button>
                    </li>
                    <li>{{ data.spuCode  }}</li>
                </ul>
                <el-table :data="data.skuVOList" border style="width: 100%">
                    <el-table-column align="center" prop="skuName" label="SKU名称" width="180">  </el-table-column>
                    <el-table-column align="center" prop="specInfo"  label="销售属性" width="300"> </el-table-column>
                    <el-table-column align="center" prop="skuCode" label="小泰sku编码" width="180"> </el-table-column>
                    <el-table-column align="center" prop="channelSkuCode" width="180" label="映射方编码"> </el-table-column>
                    <el-table-column align="center" prop="memo" label="备注"> </el-table-column>
                    <el-table-column align="center" prop="address" width="150" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="editShopMap(data, scope.row)" type="text">编辑</el-button>
                            <el-button @click="deletShopMap(scope.row)" v-show="searchParams.ifSetFlag === '1'" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!searchParams.list" style="text-align:center; padding:50px 0">
                暂无数据
            </div>
            <div class="page" style="text-align:right; padding: 10px 0;">
                <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
                </el-pagination>
            </div>
        </div>
        <div style="text-align:center">
            <el-button type="primary" @click="exportExecl" size="mini">导出</el-button>
            <el-button @click="importExcel" type="primary" size="mini">导入</el-button>
            <el-button @click="toEdit" type="primary" size="mini">编辑</el-button>
            <el-button @click="back" size="mini">返回</el-button>
            <el-button @click="shopMapModeDownLoad"  type="text" size="mini">映射模板下载</el-button>
        </div>

        <!-- 编辑弹窗 -->
        <el-dialog title="设置映射信息" :visible.sync="dialogTableVisible">
            <el-form label-width="125px" size="medium">
                <el-row :span="20">
                    <el-form-item label="类目："  size="mini">
                            {{ shopMapEdit.firstCategoryName }} > {{ shopMapEdit.secondCategoryName }} > {{ shopMapEdit.thirdCategoryName }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="商品名称："  size="mini">
                            {{ shopMapEdit.name }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="品牌："  size="mini">
                            {{ shopMapEdit.brandName }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="SPU编码："  size="mini">
                            {{ shopMapEdit.list.spuCode }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="SKU编码："  size="mini">
                            {{ shopMapEdit.list.skuCode }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="SKU属性："  size="mini">
                            {{ shopMapEdit.list.specInfo }}
                    </el-form-item>
                </el-row>
                <el-row :span="20">
                    <el-col :span="10">
                        <span style="color:red; position:relative; top:20px; left:46px;">*</span>
                        <el-form-item label="映射编码："  size="mini">
                            <el-input v-model="shopMapEdit.channelSkuCode" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="line-height:50px; padding-left:10px;" :span="10">
                        必填，最多限填128字
                    </el-col>
                </el-row>
                <el-row :span="20">
                    <el-form-item label="备注："  size="mini">
                        <el-input v-model="shopMapEdit.memo" type="textarea" size="mini"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div style="text-align:center; padding:10px 0;">
                <el-button @click="keepEdit" size="mini" type="primary">保存</el-button>
                <el-button @click="dialogTableVisible = false" size="mini" >取消</el-button>
            </div>
        </el-dialog>

        <!-- 导入失败或成功 -->
        <el-dialog close="import_dialog" title="导入计划" :visible.sync="dialogImportVisible" width="30%">
            <el-upload ref="upload"   v-show="isResult === 'default'" :on-progress="onProgress" :before-upload="beforeUpload"  class="upload-demo import_dialog" drag :action='uploadUrl' :on-success="uploadSuccess" >
                <i class="el-icon-upload"></i>
                <div v-show="isUpload" class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
                </div>
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <div v-show="isResult === 'success'" class="result import_dialog">
                <span class="el-icon-circle-check-outline icon"></span>
                <p>全部解析成功</p>
                <p>共{{uploadResult.successCount}}条数据</p>
            </div>
            <div v-show="isResult === 'fail'" class="result import_dialog">
                <span class="el-icon-circle-close-outline icon"></span>
                <div v-if="formatError">
                <p>解析成功{{uploadResult.successCount}}条数据，解析失败{{uploadResult.failCount}}条数据。</p>
                <p>请点此
                    <a :href="downloadFail" target="_blank" style="color: red;">下载文件</a>
                    ，修改后重新上传。
                </p>
                </div>
                <div style="padding-top:10px;" v-else>
                    {{errorMessage}} 请
                <a href="/chain-web/itemsRelation/exampleExport" target="_blank" style="color: red;">下载模板</a>并按模板修改后重新提交
                </div>
            </div>
            <span slot="footer" class="dialog-footer import_dialog">
                <div v-show="isResult === 'success'" style="text-align: center;">
                <el-button type="primary" @click="savePrice" size="mini">提交</el-button>
                <el-button @click="resetPrice" size="mini">取消提交</el-button>
                </div>
                <div v-show="isResult === 'fail'" style="text-align: center;">
                <el-button @click="dialogImportVisible = false" size="mini">关闭</el-button>
                </div>
            </span>
        </el-dialog>

        <!-- 操作日志弹窗 -->
        <el-dialog :visible.sync="dialogOperate" width="80%">
            <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :params="operateParams" :isRefresh="isRefresh"></operate-table>
        </el-dialog>
    </div>
</template>

<script>
import operateTable from '@/components/operateTable';
import thirdSelect from '@/components/select';
import {formatDate} from '@/components/date';

import qs from 'qs';
export default {
    data() {
        return {
            dialogOperate: false, // 操作日志弹窗
            dialogTableVisible: false, // 编辑弹窗控制
            dialogImportVisible: false, // 导入弹窗控制
            operateParams: {
                entityType: 'BusiItemsRelation',
                entityId: ''
            },
            isRefresh: 0,
            radio: 1,
            searchParams: {
                id: '',
                pageNumber: 1,
                pageSize: 10,
                recordTotal: 0,
                channelCode: '', // 渠道编号
                ifSetFlag: '1', // 商品是否已经映射(0表示未映射,1表示已经映射)
                firstCategoryId: '', // 一级菜单
                secondCategoryId: '', // 二级菜单
                thirdCategoryId: '', // 三级菜单
                name: '', // 商品名称
                list: []
            },
            orderTitle: ['序号', '一级类目', '二级类目', '三级类目', '品牌', '商品名称', 'SPU编号'],
            tableData: [],  // 基本信息
            shopMapEdit: {
                firstCategoryName: '',
                secondCategoryName: '',
                thirdCategoryName: '',
                channelSkuCode: '', // 渠道商品SKU编号
                channelCode: '',
                skuCode: '',
                spuCode: '',
                memo: '',
                name: '',
                brandName: '',
                list: ''
            },  // 映射信息
            clear: 0,
            pageFlag: 'all', // 判断分页时是调用全部的接口还是搜索的接口
            id: this.$route.params.id,
            importCode: '', // 导出出错的参数
            uploadResult: {}, // 上传成功返回的响应数据
            isResult: 'default', // 默认显示导入文件
            formatError: true, // 是否显示解析模板错误文案
            errorMessage: '', // 错误文案
            isUpload: true,
            uploadUrl: ''
            // uploadData: {   // 上传文件所带的参数
            //     channelCode: ''
            // }
        };
    },
    mounted: function() {
        this.searchParams.id = this.id;
        this.initData(this.searchParams);
    },
    components: { thirdSelect, operateTable },
    computed: {
        // 导入失败下载的地址
        downloadFail() {
            return (
                '/chain-web/itemsRelation/itemsExceptDownload/' + this.importCode
            );
        }
    },
    filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    methods: {
        openOperate() {
            this.dialogOperate = true;
            this.isRefresh += 1;
        },
        closeOperate() {
            this.dialogOperate = false;
        },
        // 导出
        exportExecl() {
            let url = `/chain-web/itemsRelation/exportItems?channelCode=${this.searchParams.channelCode}&ifSetFlag=${this.searchParams.ifSetFlag}`;
            window.open(url);
        },
        // 模板下载
        shopMapModeDownLoad() {
            window.open('/chain-web/itemsRelation/exampleExport');
        },
        // 导入
        importExcel() {
            this.isResult = 'default';
            this.dialogImportVisible = true;
            this.uploadResult = {};
            if (this.$refs.upload) {
                this.$refs.upload.clearFiles();
            }
            this.dialogImportVisible = true;
        },
         // 文件上传中事件
        onProgress(file) {
            this.isUpload = false;
        },
        // 上传之前事件
        beforeUpload(file) {
            if (file.size > 50000000) {
                this.$message.warning('上传的文件不能大于50M');
                return false;
            }
        },
         // 导入成功之后调用
        savePrice() {
            this.GET(`/itemsRelation/itemsGenerate/${this.importCode}/${this.searchParams.channelCode}` ).then(res => {
                this.dialogImportVisible = false;
                this.$message.success('商品映射信息生成成功!');
                this.initData(this.searchParams);
            });
        },
        // 取消提交
        resetPrice() {
            this.$message({
                type: 'info',
                message: '提交取消'
            });
            this.dialogImportVisible = false;
        },
        // 上传成功事件
        uploadSuccess(response, file, fileList) {
            if (response.code === '200') {
                this.formatError = true;
                this.$message({
                    message: '文件解析成功',
                    type: 'success'
                });
                this.uploadResult = response.body;
                this.importCode = this.uploadResult.importCode || '';
                if (this.uploadResult.failCount === '0' || this.uploadResult.failCount === null) {
                   this.isResult = 'success';
                } else {
                   this.isResult = 'fail';
                }
            } else if (response.code === '400') {
                this.formatError = false;
                this.isResult = 'fail';
                this.errorMessage = response.message;
            }
            this.isUpload = true;
        },
        // 供应商管理详情页
        toDetail(row) {
            let obj = {
                hideLogs: '0',
                supplierCode: this.tableData.channelCode,
                flag: '1'
            };
            let config = {
                title: '供应商详情',
                href: 'supplier/supplierDetail.html?' + qs.stringify(obj)
            };
            top.window.addTab(config);
            // window.open(config.href);
        },
        // 商品名称详情
        toShopDetail(data) {
            this.$router.push({name: 'gooddetail', params: {id: data.spuCode}});
        },
        // 去往编辑
        toEdit() {
            this.$router.push({name: 'shopMapDetail', params: {id: this.tableData.id}});
        },
        // 后退按钮
        back() {
            this.$router.go(-1);
        },
        // 映射选项卡切换
        handleClick(active) {
            this.clear += 1; // 清空三级选择框
            this.pageFlag = 'all';
            this.searchParams.name = '';
            if (this.searchParams.ifSetFlag === '1') {
                this.searchParams.list = this.tableData.hasSetPageItemsVo.objects; // 已设置映射列表
                this.searchParams.recordTotal = this.tableData.hasSetPageItemsVo.recordTotal;
            } else if (this.searchParams.ifSetFlag === '0') {
                this.searchParams.list = this.tableData.hasNotSetPageItemsVo.objects; // 已设置映射列表
                this.searchParams.recordTotal = this.tableData.hasNotSetPageItemsVo.recordTotal;
            }
        },
        // 点击编辑时
        editShopMap(row, current) {
            this.dialogTableVisible = true;
            this.shopMapEdit.firstCategoryName = row.firstCategoryName;
            this.shopMapEdit.secondCategoryName = row.secondCategoryName;
            this.shopMapEdit.thirdCategoryName = row.thirdCategoryName;
            this.shopMapEdit.name = row.name;
            this.shopMapEdit.skuCode = current.skuCode;
            this.shopMapEdit.brandName = row.brandName;
            this.shopMapEdit.channelSkuCode = current.channelSkuCode;
            this.shopMapEdit.spuCode = row.spuCode;
            this.shopMapEdit.list = current;
            this.shopMapEdit.memo = current.memo;
        },
        // 删除信息
        deletShopMap(row) {
            this.$confirm('确定删除该条记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    channelCode: this.shopMapEdit.channelCode,
                    skuCode: row.skuCode
                };
                this.DELETE('/itemsRelation/deleteRelation', data).then(res => {
                    this.$message.success('删除成功');
                    setTimeout(() => {
                        this.initData(this.searchParams);
                    }, 500);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 编辑保存
        keepEdit() {
            if (!this.shopMapEdit.channelSkuCode) {
                this.$message.warning('请输入映射编码');
            } else if (this.shopMapEdit.channelSkuCode.length > 128) {
                this.$message.warning('映射编码长度不能超过128字');
            } else {
                let data = {
                    channelSkuCode: this.shopMapEdit.channelSkuCode,
                    channelCode: this.shopMapEdit.channelCode,
                    skuCode: this.shopMapEdit.skuCode,
                    memo: this.shopMapEdit.memo,
                    spuCode: this.shopMapEdit.spuCode
                };
                this.PUT('/itemsRelation/updateRelation', data).then(res => {
                    this.$message.success('保存成功');
                    this.dialogTableVisible = false;
                    this.initData(this.searchParams);
                });
            }
        },
        // 搜索商品映射列表
        searchShopMap() {
            this.searchParams.pageNumber = 1;
            this.pageFlag = 'fillter';
            this.searchShopMapEvent();
        },
        // 查找商品映射事件
        searchShopMapEvent() {
            let data = {};
            for (let obj in this.searchParams) {
                if (obj !== 'list') {
                    data[obj] = this.searchParams[obj];
                }
            }
            this.GET('/itemsRelation/selectItmesPage', data).then(res => {
                this.searchParams.list = res.body.objects;
                this.searchParams.recordTotal = res.body.recordTotal;
            });
        },
        // 三级类目id
        shopId(val) {
            this.searchParams.firstCategoryId = val.firstCategoryId;
            this.searchParams.secondCategoryId = val.secondCategoryId;
            this.searchParams.thirdCategoryId = val.thirdCategoryId;
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            if (this.pageFlag === 'all') {
                this.initData(this.searchParams);
            } else if (this.pageFlag === 'fillter') {
                this.searchShopMapEvent();
            }
        },
        changeNumber(val) {
             this.searchParams.pageNumber = val;
            if (this.pageFlag === 'all') {
                this.initData(this.searchParams);
            } else if (this.pageFlag === 'fillter') {
                this.searchShopMapEvent();
            }
        },
        // 商品信息数据初始化
        initData(data) {
            let obj = {};
            for (let i in data) {
                if (i !== 'list') {
                    obj[i] = data[i];
                }
            }
            this.GET('/itemsRelation/getInfo', obj).then(res => {
                this.tableData = res.body;
                this.shopMapEdit.channelCode = res.body.channelCode;
                this.operateParams.entityId = res.body.id;
                if (this.searchParams.ifSetFlag === '1') {
                    this.searchParams.list = this.tableData.hasSetPageItemsVo.objects; // 已设置映射列表
                    this.searchParams.recordTotal = this.tableData.hasSetPageItemsVo.recordTotal;
                } else if (this.searchParams.ifSetFlag === '0') {
                    this.searchParams.list = this.tableData.hasNotSetPageItemsVo.objects; // 未设置映射列表
                    this.searchParams.recordTotal = this.tableData.hasNotSetPageItemsVo.recordTotal;
                }
                this.searchParams.channelCode = res.body.channelCode;
                this.uploadUrl = '/chain-web/itemsRelation/importItemsData/' + res.body.channelCode;  // 下载地址
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
        .mainMsg
            font-size 13px
            padding 15px 0
            .msgWrap
                padding 8px 0
                .label
                    text-align right 
                    padding 0 15px;
</style>
<style lang="stylus">
.orderTable
    font-size 12px
    .title
        display flex
        text-align center
        background-color #f5f7fa
        align-items content 
        justify-content center
        li{
          width 16%
          text-align center
          padding 10px 0
          line-height 40px
        }
        li:first-child {
          width 5%
        }
        li:nth-child(2) {
          width 27%
        }
    .main
      .table
          li
            display flex
            text-align center
            align-items center
            div
              width 16%
              padding 10px 0

          li
            div:first-child {
              width 5%
            }
          li
            div:nth-child(2) {
              width 27%
            }
            div.shopText{
              cursor pointer
              color #409EFF
            }
      .head
          padding 10px 20px
          background-color #f5f7fa
          margin-top 5px
          span
            padding-right 20px
            label
              color #409EFF
              cursor pointer
      .bottom
           padding 10px 20px
           text-align right
           border-top solid 2px #f5f7fa
.upload-demo
    text-align: center

</style>
<style scoped>
    .import_dialog {
        text-align: center;
    }
    .import_dialog .icon {
        font-size: 120px;
    }
    .import_dialog .icon.success {
        color: #67c23a;
    }
    .import_dialog .icon.error {
        color: #f56c6c;
    }
    .el-radio{
        cursor: auto;
    }
</style>