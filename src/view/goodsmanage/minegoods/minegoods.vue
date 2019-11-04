<template>
  <div class="minegoods">
      <el-form label-width="125px" size="medium">
           <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="商品SPU编号：" prop="allocateOrderCode" size="mini">
                        <el-input v-model="searchParams.spuCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="商品SKU编号：" prop="allocateOrderCode" size="mini">
                        <el-input v-model="searchParams.skuCode"  placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="商品名称：" prop="allocateOrderCode" size="mini">
                        <el-input v-model="searchParams.name" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态："  size="mini">
                        <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
                            <el-option
                                v-for="item in shopStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
           </el-row>
           <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="所属类目：" size="mini">
                        <el-col :span="8">
                            <el-select v-model="searchParams.firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                                <el-option v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                            </el-col>
                            <el-col :span="8">
                            <el-select v-model="searchParams.secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                                <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                            </el-col>
                            <el-col :span="8">
                            <el-select v-model="searchParams.thirdCategoryId"  :disabled="isSecondLevel"  @change="thirdCateChange"  filterable placeholder="请选择">
                                <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="品牌："  size="mini">
                        <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in brand.list"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                   <el-form-item label="条形码：" prop="allocateOrderCode" size="mini">
                        <el-input v-model="searchParams.barCode"  placeholder=""></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="6">
                   <el-form-item size="mini">
                        <el-button type="primary" @click="search" icon="search">查询</el-button>
                        <el-button type="default" @click="resetSearchParams" icon="circle-cross">重置</el-button>
                   </el-form-item>
               </el-col>
           </el-row>
      </el-form>
      <el-row class="btn_group">
            <el-button @click="addOrder" size="mini" type="primary">
                <i class="el-icon-circle-plus-outline" style="padding-right:2px;"></i>
                新增商品
            </el-button>
            <el-button type="primary" size="mini" @click="importGood" v-if="userName == 'admin'">导入商品</el-button>
      </el-row>
      <div class="mainTable" style="margin:10px 0">
           <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="expand" align="center" prop="" label="" width="50">
                    <template slot-scope="props">
                        <el-table class="background_none" :data="props.row.records" border >
                            <el-table-column align="center" prop="skuCode"  label="SKU编号"  > </el-table-column>
                            <el-table-column align="center" prop="skuName"  label="SKU名称"  > </el-table-column>
                            <el-table-column align="center" prop="specInfo"  label="规格"  > </el-table-column>
                            <el-table-column align="center" prop="barCode"  label="条形码"  > </el-table-column>
                            <el-table-column align="center" prop=""  label="状态"  >
                                <template slot-scope="scope">
                                    {{ scope.row.isValid == 1 ? '启用' : '停用' }}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop=""  label="操作"  >
                                 <template slot-scope="scope">
                                    <el-button  v-if="scope.row.updateAuth == 1" @click="SKUIsValid(scope.row)" type="text">
                                        {{ scope.row.isValid === '1' ? '停用' : '启用' }}
                                    </el-button>
                                    <div v-else>
                                        <el-button @click="noUpdateAuth" type="text" style="color:#c4c4c4">
                                            {{ scope.row.isValid === '1' ? '停用' : '启用' }}
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="spuCode" label="商品SPU编号" width="180">
                    <template slot-scope="scope">
                        <span @click="toMineDetail(scope.row)" style="color:#409EFF; cursor:pointer">
                            {{ scope.row.spuCode }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name"  label="商品名称"  width="180"> </el-table-column>
                <el-table-column align="center" prop="brandName" label="品牌"> </el-table-column>
                <el-table-column align="center" prop="categoryName" label="类目"> </el-table-column>
                <el-table-column align="center" prop="itemNo" label="商品货号"> </el-table-column>
                <el-table-column align="center" prop="address" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.isValid === '1' ? '启用' : '停用' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updateTime" label="最近更新时间"> </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.updateAuth == 1">
                            <el-button @click="toMineRedit(scope.row)" type="text">
                                编辑
                            </el-button>
                            <el-button @click="SPUIsValid(scope.row)" type="text">
                                {{ scope.row.isValid === '1' ? '停用' : '启用' }}
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button @click="noUpdateAuth" style="color:#c4c4c4" type="text">
                                编辑
                            </el-button>
                            <el-button  @click="noUpdateAuth" type="text" style="color:#c4c4c4">
                                {{ scope.row.isValid === '1' ? '停用' : '启用' }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
           </el-table>
           <div class="page" style="text-align:right; padding: 10px 0;">
              <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
              </el-pagination>
          </div>
      </div>
    <!-- 导入商品弹窗 -->
    <el-dialog title="导入商品" :visible.sync="isShopGood" :close-on-click-modal='false' :show-close='false' v-loading='loading'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :on-error='uploadError' drag action='/scm-web/goods/goodsImport' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <p style="line-height: 20px;">1、导入文件格式必须与模板完全一致（一条数据对应一个SKU）；<a :href='downloadDefault' style="color: blue;" target='_blank'>模板下载</a></p>
          <p style="line-height: 20px;">2、每次只能上传1个文件，每个文件不超过2,000条数据；</p>
          <p style="color: red;line-height: 20px;">3、导入时若“规格（采购属性）”字段未填写，系统将赋值一个默认规格，可在界面进行修改；</p>
          <p style="color: red;line-height: 20px;">4、导入时若“贸易类型”字段未填写，系统将默认为“一般贸易”；</p>
          <p style="color: red;line-height: 20px;">5、导入时若“状态”字段未填写，系统将默认为“启用”；</p>
          <p style="line-height: 20px;">6、导入只支持新增，不支持修改，若商品已存在，则将导入失败。</p>
        </div>
      </el-upload>
      <div v-show="isGoodResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>导入成功</p>
      </div>
      <div v-show="isGoodResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
        <p>请点此
          <!-- <span @click="downloadFail(errorJson)" style="color: red;cursor: pointer;">下载文件</span> -->
          <el-button type="text" @click="downloadFail(errorJson)" icon="circle-cross" :disabled="disabledDownLoad" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer" >
        <div style="text-align: center;">
          <el-button @click="closeGoodUpload" size="mini" :disabled="isClick">关闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios';
  import qs from 'qs';
  export default {
    name: 'minegoods',
    data() {
        return {
            userName: window.sessionStorage.userName,
            isClick: false, // 关闭按钮可点
            disabledDownLoad: false,
            errorMsg: '', // 错误信息
            isGoodResult: 'default', // 默认显示导入商品明细
            loading: false, // 上传loading
            isShopGood: false, // 导入商品明细
            firstCateList: [], // 类目一级列表
            secondCateList: [], // 类目二级列表
            thirdCateList: [], // 类目三级列表
            isFirstLevel: true, // 关联二级菜单是否禁用
            isSecondLevel: true, // 关联三级菜单是否禁用
            brand: {  // 品牌
                list: [],
                id: ''
            },
            searchParams: {
                firstCategoryId: '',
                secondCategoryId: '',
                thirdCategoryId: '',
                spuCode: '', // 商品SPU编号
                pageNo: 1,  // 当前页
                pageSize: 10, // 页面大小
                start: 0,  // 起始页
                skuCode: '', // 商品SKU编号
                name: '', // 商品名称
                isValid: '', // 状态
                categoryId: '', // 所属类目
                brandId: '', // 品牌
                categoryLevel: '', // 类目等级
                barCode: '', // 条形码
                totalCount: 0 // 总条数
            },
            value: '',
            selectValue: '',
            shopStatus: [{  // 商品状态
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '停用'
            }, {
                value: '1',
                label: '启用'
            }],
            tableData: []
        };
    },
    mounted: function() {
        this.initTableData(this.searchParams);
        this.initCateData({parentId: '', isRecursive: false}).then( res => {
            this.firstCateList = res.result;
        });
        this.initBrand({categoryId: ''});
    },
    computed: {
      downloadDefault() {
        return (
          '/scm-web/goods/goodsTempExport'
        );
      }
    },
    methods: {
        importGood() {
          this.isGoodResult = 'default';
          this.uploadResult = {};
          if (this.$refs.uploadGood) {
            this.$refs.uploadGood.clearFiles();
          }
          this.isClick = false;
          this.isShopGood = true;
        },
        // 文件上传之前
        beforeAvatarUpload(file) {
          const isExcel = file.type === 'application/vnd.ms-excel';
          const isLt10M = file.size / 1024 / 1024 <= 10;
          if (!isLt10M) {
            this.$utils.messagetip.errorTip('上传文件大小不能超过 10MB!');
          }
          return isLt10M;
        },
        uploadError(err, file, fileList) {
          this.loading = false;
          console.log(err);
          let obj = err.toString().substr(err.toString().indexOf('{'));
          let objErr = JSON.parse(obj);
          this.$utils.messagetip.errorTip(objErr.databuffer);
          this.isShopGood = false;
        },
        // 文件上传中
        uploadProgress(event, file, fileList) {
          this.loading = true;
        },
        // 商品上传成功
        uploadGoodSuccess(response, file, fileList) {
          console.log('上传成功');
          console.log(response);
          console.log(file);
          console.log(fileList);
          this.loading = false;
          if (response.appcode === '1' && response.result.errorList && !response.result.errorList.length ) {
            this.uploadResult = response.result;
            this.isGoodResult = 'success';
          } else {
            this.uploadResult = response.result;
            let successNum = response.result.successList ? response.result.successList.length : 0;
            let errorNum = response.result.errorList.length ? response.result.errorList.length : 0;
            this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
            let errorList = response.result.errorList;
            this.errorJson = JSON.stringify(errorList);
            this.isGoodResult = 'fail';
            // this.errorJson = errorList;
            this.$utils.messagetip.warningTip(response.databuffer);
          }
        },
        downloadFail(errorJson) {
          this.disabledDownLoad = true;
          this.$AXIOS.POST('goods/getGoodsErrorJson', {errorJson: errorJson}).then(res => {
            // window.open('/scm-web/OtherOutIn/export_error_item?errorJsonUid=' + res.result);
            let url = '/scm-web/goods/goodsErrorExport?errorJsonUid=' + res.result;
            this.moduleDownLoad(url);
          });
        },
        moduleDownLoad(url) {
          axios({ // 用axios发送post请求
            method: 'get',
            url: url, // 请求地址
            responseType: 'blob', // 表明返回服务器返回的数据类型
            headers: {
            'Content-Type': 'application/json'
            }
          }).then(res => { // 处理返回的文件流
            const blob = new Blob([res.data]);// new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
            const fileName = '异常数据.xls';// 下载文件名称
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
            this.disabledDownLoad = false;
          });
        },
        closeGoodUpload() {
          this.isClick = true;
          this.isShopGood = false;
          this.initTableData(this.searchParams);
        },
        noUpdateAuth() {
            this.$utils.messagetip.warningTip('尚无操作权限');
        },
        // 重置条件
        resetSearchParams() {
            for (let obj in this.searchParams) {
                if (obj === 'pageNo') {
                    this.searchParams[obj] = 1;
                } else if (obj === 'pageSize') {
                    this.searchParams[obj] = 10;
                } else if (obj === 'start') {
                    this.searchParams[obj] = 0;
                } else if (obj === 'totalCount') {
                    this.searchParams[obj] = 0;
                } else {
                    this.searchParams[obj] = '';
                }
            }
            this.isFirstLevel = true;
            this.isSecondLevel = true;
            this.initTableData(this.searchParams);
        },
        // 前往新增商品页面
        addOrder() {
            this.$router.push({name: 'mineadd', query: {isadd: 1}});
        },
        toMineRedit(row) {
           this.$router.push({
               name: 'mineredit',
               params: {
                   id: row.spuCode
               },
              query: {isadd: 0}
           });
        },
        toMineDetail(row) {
           this.$router.push({
               name: 'minedetail',
               params: {
                   id: row.spuCode,
                   flag: false
               }
           });
        },
        // SPU启停用
        SPUIsValid(row) {
            this.$AXIOS.PUT(`/goods/isValid/${row.id}`, {isValid: row.isValid}).then( res => {
                this.$utils.messagetip.successTip(res.databuffer);
                setTimeout(() => {
                    this.initTableData(this.searchParams);
                });
            });
        },
        // SKU启停用
        SKUIsValid(row) {
            this.$AXIOS.PUT(`/goods/skuValid/${row.id}`, {isValid: row.isValid, spuCode: row.spuCode}).then( res => {
                this.$utils.messagetip.successTip(res.databuffer);
                setTimeout(() => {
                    this.initTableData(this.searchParams);
                });
            });
        },
        // 获取所以品牌
        initBrand(data) {
            this.$AXIOS.GET('/category/brands').then( res => {
                this.brand.list = res.result;
            });
        },
        // 获取全部类目事件
        initCateData(val) {
            return this.$AXIOS.GET('/category/tree', val);
        },
        // 一级类目事件
        firstCateChange(val) {
            this.searchParams.categoryId = val;
            this.searchParams.categoryLevel = 1;
            this.initCateData({parentId: val, isRecursive: false}).then( res => {
                this.searchParams.secondCategoryId = '';
                this.searchParams.thirdCategoryId = '';
                this.secondCateList = res.result;
                this.isFirstLevel = false;
            });
        },
        // 二级类目事件
        secondCateChange(val) {
            this.searchParams.categoryId = val;
            this.searchParams.categoryLevel = 2;
            this.initCateData({parentId: val, isRecursive: false}).then( res => {
                this.searchParams.thirdCategoryId = '';
                this.thirdCateList = res.result;
                this.isSecondLevel = false;
            });
        },
        // 三级类目事件
        thirdCateChange(val) {
            this.searchParams.categoryLevel = 3;
            this.searchParams.categoryId = val;
        },
        // 查询
        search() {
            this.searchParams.pageNo = 1;
            this.initTableData(this.searchParams);
        },
        // 每页显示多少条
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initTableData(this.searchParams);
        },
        // 第几页
        changeNumber(val) {
            this.searchParams.pageNo = val;
            this.initTableData(this.searchParams);
        },
        initTableData(data) {
            this.$AXIOS.LISTGET('/goods/goodsPage', data ).then(res => {
               this.searchParams.totalCount = res.totalCount;
               this.tableData = res.result;
               this.tableData.map(item => {
                   item.records.map(item1 => {
                       item1.updateAuth = item.updateAuth;
                   });
               });
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>
.minegoods
  .el-dialog
    width: 800px !important
    color red
  .upload-demo
    text-align: center
    .el-upload__tip
      width 500px
      margin-left: 200px
      text-align: left
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
</style>
<style lang='stylus'>
.minegoods
  .el-dialog
    width: 800px !important
    color red
  .demo-table-expand
    font-size: 0;
    padding: 20px 50px;

  .demo-table-expand label
    width: 90px;
    color: #99a9bf;

  .demo-table-expand .el-form-item
    margin-right: 0;
    margin-bottom: 0;
    width: 20%;

</style>
