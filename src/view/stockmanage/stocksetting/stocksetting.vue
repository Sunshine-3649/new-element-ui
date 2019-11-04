<template>
  <div class="stocksetting">
    <div class="left">
        <p style="margin: 15px 0;text-align: center;"><el-button size="mini" :type="isType === 1 ? 'primary': 'defaul'" @click="toggle(1)">普通冻结</el-button></p>
        <p style="margin: 15px 0;text-align: center;"><el-button size="mini" :type="isType === 2 ? 'primary': 'defaul'" @click="toggle(2)">活动冻结</el-button></p>
        <div class="tip"  v-if="isPermission == '1'">
          <p style="margin: 15px 0;">Tips：</p>
          <p style="line-height: 30px;">
            <span style="color: red; font-weight: 700; display: inline-block;">A-普通冻结</span>
            <span style="display: inline-block;">面向线上所有渠道，过临期/禁售/储备等非特定活动形式的库存冻结。</span>
            <span style="font-weight: 700;">冻结时所有渠道所有场景均不可使用</span>
          </p>
          <p style="line-height: 30px;">
            <span style="color: red; font-weight: 700; display: inline-block;">B-活动冻结</span>
            <span style="display: inline-block;">面向线上特定渠道，基于渠道自身特定活动或需要而预先储备的库存。</span>
            <span style="font-weight: 700;">冻结时，特定渠道通过在订单特定商品中告知活动编号即可消耗活动冻结的库存</span>
          </p>
          <p style="margin: 15px 0;text-align: center;"><el-button size="mini" @click="hideTip" >关闭</el-button></p>
          <p style="margin: 15px 0;text-align: center;"><el-checkbox v-model="isShowTip">不再提示</el-checkbox></p>
          <p></p>
        </div>
        <p v-if="isPermission == '0' && isShowTip" style="margin: 15px 0;text-align: center;"><el-button size="mini" type="text" @click="postPermission">显示tip</el-button></p>

    </div>
    <div class="right" v-if="isType === 1">
      <!-- 表单 -->
      <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="6" class='input_def'>
            <el-form-item label="SKU编号：" size="mini">
              <el-input v-model.trim="searchParams.skuCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class='input_def'>
            <el-form-item label="条形码：" size="mini">
              <el-input v-model.trim="searchParams.barCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class='input_def'>
            <el-form-item label="SKU名称：" size="mini">
              <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分页 -->
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary"  icon="circle-cross" size="mini" @click="openFreezeSetDia">冻结设置</el-button>
          <el-button  size="mini" type="primary" @click="importAccount">批量导入设置</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1">
          <el-row type="flex" justify="space-between">
            <el-col></el-col>
            <el-col class='paging'>
              <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </el-col>
          </el-row>
          <el-table :data="tableDataList" highlight-current-row border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuName" label="商品SKU名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="commonFrozenInventoryTotal" label="冻结数量" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="inventoryFrozenTime" label="最近更新时间" align="center"></el-table-column>
            <el-table-column prop="taxRate" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="openFreezeSetDialog(scope.row.skuCode)" type="text">
                  设置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="冻结中" name="2">
          <el-row type="flex" justify="space-between">
            <el-col></el-col>
            <el-col class='paging'>
              <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </el-col>
          </el-row>
          <el-table :data="tableDataList" highlight-current-row border>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="skuCode" label="商品SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuName" label="商品SKU名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="brandName" label="冻结情况" align="center" show-overflow-tooltip>
              <el-table-column prop="warehouseName" label="仓库名称" align="center">
                <template slot-scope="scope">
                  <el-table :data="scope.row.inventoryForWarehouseList" :show-header="false" class="frozenTable" empty-text=" ">
                    <el-table-column prop="warehouseName" align="center"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="commonFrozenInventory" label="冻结数量" align="center">
                <template slot-scope="scope">
                  <el-table :data="scope.row.inventoryForWarehouseList" :show-header="false" class="frozenTable" empty-text=" ">
                    <el-table-column prop="commonFrozenInventory" align="center"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="inventoryFrozenTime" label="最近更新时间" align="center"></el-table-column>
            <el-table-column prop="taxRate" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="openFreezeSetDialog(scope.row.skuCode)" type="text">
                  设置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class='right' v-else>
      <active-freeze></active-freeze>
    </div>
    <!--冻结设置-->
    <el-dialog title="冻结设置" :visible.sync="isFreezeDia" width="30%" :close-on-click-modal='false'>
      <el-form>
        <el-row :span="20">
          <el-col>
            <el-form-item label="请输入SKU编号或条形码：" size="mini">
              <el-input  placeholder="" v-model.trim="code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="setFreezeTrue">确定</el-button>
            <el-button  size="mini" type="primary" @click="isFreezeDia = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="冻结设置" :visible.sync="isFreezeSettingDia" width="60%" :close-on-click-modal='false'>
        <el-row type="flex" justify="space-between">
          <el-col>
            <span>SKU名称：</span>
            {{tableFreezeInfo.skuName}}
          </el-col>
          <el-col align="right">
            <el-button @click="openOpreationLogDig()" type="text" style="padding-top: 0">
              操作日志
            </el-button>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <span>SKU编号：</span>
            {{tableFreezeInfo.skuCode}}
          </el-col>
          <el-col :span="6">
            <span>条形码：</span>
            {{tableFreezeInfo.barCode}}
          </el-col>
        </el-row>
        <el-table :data="tableFreezeList" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="availableInventory" label="当前“正品_可用库存”" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commonFrozenInventory" label="已冻结数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column :render-header="renderHeader" label="本次冻结数量,（解冻请输入负数）" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-row :span="20">
                <el-col :span="10">
                  <el-input v-model.trim="scope.row.frozenQuantity" placeholder=""   size="mini" style="margin-top: 3px;margin-left:10px;"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-button v-if="scope.row.commonFrozenInventory > 0" @click="setUnFrozenQuantity(scope.row.commonFrozenInventory, scope.$index)" type="text">
                    解冻全部
                  </el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button type="primary" size="mini" icon="search" @click="saveUnFrozenQuantity">保存</el-button>
          <el-button type="default" size="mini" icon="circle-cross" @click="isFreezeSettingDia = false">取消</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 批量导入设置 -->
    <el-dialog title="库存冻结批量导入设置" :visible.sync="isAccount" width="60%" :close-on-click-modal='false' :show-close='true' v-loading='isLoading'>
      <!--注意事项-->
      <div class="el-upload__tip" v-show="isResult === 'default'" style="padding:20px;border:1px solid #606266;border-radius: 5px;position: relative;">
        <span style="position: absolute;display: block;width: 140px;height: 40px;line-height: 40px;text-align: center;top:-20px;left:50%;margin-left:-70px;background-color: #fff;font-size: 15px;font-weight: 700;color: #333;">注意事项</span>
        <p style="line-height: 40px;">1、导入文件格式必须与模板完全一致；<el-button type="primary" plain size="mini"><a :href="downloadDefault">库存冻结导入设置模板</a></el-button></p>
        <p style="line-height: 40px;">2、每次只能上传1个文件，每个文件不超过2000条数据；</p>
        <p style="line-height: 40px;">3、导入时需填写仓库编码 <el-button @click="openSearchWmsDia" type="primary" plain size="mini">仓库编码查询</el-button></p>
      </div>
      <el-upload ref="upload" v-show="isResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" drag action="/scm-web/inventory/scmInventoryImport" :on-success="uploadSuccess" :on-progress='uploadProgress' :on-error='uploadDefaul' :on-preview="handlePreview" :on-remove="handleRemove" style="margin-top: 20px;">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>订单导入成功</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
        <p>请点此
          <el-button type="text" @click="underDownloadFail(errorJson)" icon="circle-cross" :disabled="disabledDownLoadfail" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button @click="closeUpload" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
    <!--仓库编码对照表-->
    <el-dialog title="仓库编码对照表" :visible.sync="searchWmsDia" width="30%" :close-on-click-modal='false' :show-close='true'>
      <el-form :model="searchParams" class="search_form" size="medium">
        <el-row :span="24">
          <el-col :span="24" class='input_def'>
            <el-form-item label="" size="mini">
              <el-input v-model.trim="searchWarehouseCode" placeholder="" @input="searchWarehouseData"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="warehouseList" border>
        <el-table-column prop="name" label="仓库名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="仓库编码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
            <el-button type="text" v-clipboard:copy="scope.row.code" v-clipboard:success="onCopyCode" v-clipboard:error="onError">
              复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button @click="searchWmsDia = false" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
    <!--操作日志-->
    <el-dialog title="操作日志" :visible.sync="opreationLogDig" width="50%" :close-on-click-modal='false'>
      <el-table :data="logInfoList" border>
        <el-table-column prop="operation" label="动作" align="center" width="140"></el-table-column>
        <el-table-column prop="operator" label="操作人" align="center" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operateTimeString" label="操作时间" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-html="scope.row.remark"></div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center;">
          <el-button @click="opreationLogDig = false" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios';
  import qs from 'qs';
  import activeFreeze from './activityfreeze';
  export default {
    name: 'stocksetting',
    data() {
      return {
        isPermission: '0', // 默认显示
        isType: 1, // 是否显示tip
        isShowTip: false, // 是否显示tip
        leftSide: true,
        rightSide: true,
        code: '', // sku编码或者是条形码
        searchVal: '', // 仓库名称查询仓库编码
        searchWmsDia: false, // 仓库编码对照表弹窗
        isTableDisabled: false, // 订单是否可导出
        errorMsg: '', // 错误信息
        errorJson: '', // 导入错误列表
        loading: false, // 上传loading
        isLoading: false,
        underDisabledDownLoad: false, // 导出错误文件
        disabledDownLoad: false,
        disabledDownLoadfail: false,
        warehouseList: [], // 仓库查询(弹窗)
        copyWarehouseList: [], // 仓库查询复制
        uploadResult: {}, // 上传成功返回的响应数据
        isResult: 'default', // 默认显示导入文件
        isAccount: false, // 导入库存
        operateParams: {
          start: 0,
          pageNo: 1,
          pageSize: 10,
          operateType: 0,
          entityType: 'scmInventory',
          entityId: ''
        }, // 日志
        activeName: '1', // 当前选中的选项卡
        currentTableIndex: [], // 当前列表对应子列表的sku项
        tableDataList: [], // 初始化列表数据全部
        tableDataListCopy: [],
        tableRowList: [], // 详情明细
        tableRowDetail: {}, // 详情
        tableFreezeInfo: {}, // 商品冻结库存
        tableFreezeList: [], // 商品冻结库存列表
        logInfoList: [], // 日志信息
        logCount: 0, // 日志条数
        isFreezeDia: false, // 冻结弹窗的查询显示
        isFreezeSettingDia: false, // 冻结弹窗的设置显示
        opreationLogDig: false, // 操作日志
        totalCount: 0, // 列表条数
        searchParams: {
          isFrozeningFlag: '', // 冻结中还是全部
          skuCode: '', // sku编号
          skuName: '', // sku名称
          barCode: '', // 条形码
          start: 0, // 开始页面
          pageSize: 10, // 默认10条
          pageNo: 1 // 默认第一页
        }, // 请求参数
        requestList: [], // 保存冻结数据参数
        searchWarehouseCode: '' // 仓库名称
      };
    },
    components: {
      activeFreeze
    },
    created() {
      if (this.$route.query.activeName) {
        this.toggle(2);
      } else {
        this.initDataList();
      }
      this.getPermission();
    },
    computed: {
      // 当前表格高度
      currentHeight() {
        let height = 96;
        if (this.tableDataList && this.tableDataList.length) {
          if (this.tableDataList.length > 10) {
            height = 386;
          } else if (this.tableDataList.length > 0 && this.tableDataList.length <= 10) {
            height = 35 * this.tableDataList.length + 36;
          } else {
            height = 71;
          }
        }
        return height;
      },
      // 模板的下载地址
      downloadDefault() {
        return (
          '/scm-web/inventory/exampleExport/'
        );
      }
    },
    methods: {
      hideTip() {
        if (this.isShowTip) {
          this.postPermission();
        } else {
          this.isPermission = '0';
        }
      },
      getPermission() {
        this.$AXIOS.GET('/eventFrozen/getTipsMsg').then(res => {
          console.log(res);
          this.isPermission = res.result;
          if (this.isPermission === '1') {
            this.isShowTip = false;
          } else {
            this.isShowTip = true;
          }
        });
      },
      postPermission() {
        this.$AXIOS.POST('/eventFrozen/updateTipsMsg').then(res => {
          // this.$message.success('已隐藏！');
          this.getPermission();
        });
      },
      toggle(i) {
        this.isType = i;
        if (i === 1) {
          this.initDataList();
        }
      },
      renderHeader(createElement, { column, _self }) { // 表头重置
        const label = column.label;
        const labelArr = label.split(',');
        return createElement(
          'span', [
            createElement('span', {
              attrs: { type: 'text' }
            }, [labelArr[0]]),
            createElement('p', {
              attrs: { type: 'text', style: 'color:#f00;line-height:20px;' }
            }, [labelArr[1] || ''] )
          ]
        );
      },
      beforeAvatarUpload(file) {
        const isExcel = file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
          this.$utils.messagetip.errorTip('上传文件只能是 xls 格式!');
        }
        return isExcel;
      },
      // 文件上传中
      uploadProgress(event, file, fileList) {
        console.log('上传中');
        this.isLoading = true;
      },
      // 导入模板
      importAccount() {
        this.isResult = 'default';
        this.sellCode = '';
        this.uploadResult = {};
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles();
        }
        this.isAccount = true;
        this.warehouseCode = '';
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      uploadSuccess(response, file, fileList) {
        this.isLoading = false;
        if (response.appcode === '1' && (!response.result.errorList || response.result.errorList.length === 0 )) {
          this.isResult = 'success';
        } else {
          let successNum = response.result.successList ? response.result.successList.length : 0;
          let errorNum = response.result.errorList.length ? response.result.errorList.length : 0;
          this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
          let errorList = response.result.errorList;
          this.errorJson = JSON.stringify(errorList);
          this.isResult = 'fail';
          this.$utils.messagetip.warningTip(response.databuffer);
        }
      },
      closeUpload() {
        this.initDataList();
        this.isAccount = false;
      },
      uploadDefaul(err, file, fileList) {
        this.isLoading = false;
        let obj = err.toString().substr(err.toString().indexOf('{'));
        let objErr = JSON.parse(obj);
        this.$utils.messagetip.errorTip(objErr.databuffer);
        this.isAccount = false;
      },
      // 错误列表下载
      underDownloadFail(errorJson) {
        this.underDisabledDownLoad = true;
        this.$AXIOS.POST('/inventory/getErrorJson', {errorJson: errorJson}).then(res => {
          let url = '/scm-web/inventory/errorDataExport?errorJsonUid=' + res.result;
          this.underModuleDownLoad(url);
        });
      },
      underModuleDownLoad(url) {
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
        this.underDisabledDownLoad = false;
      });
      },
      // 获取库存数据列表
      initDataList() {
        let inventoryForWarehouseList = [];
        this.tableDataList = [];
        this.tableRowDetail = [];
        this.tableRowList = [];
        this.logInfoList = [];
        this.logCount = 0;
        this.isTableDisabled = false;
        this.$AXIOS.LISTGET('/inventory/scmInventoryConfigPage', this.searchParams).then(res => {
          this.tableDataListCopy = res.result.result;
          this.totalCount = res.result.totalCount;
        if (this.tableDataListCopy && this.tableDataListCopy.length) {
          this.operateParams.entityId = this.tableDataListCopy[0].skuCode;
          this.tableDataListCopy.forEach(item => {
            inventoryForWarehouseList = [];
            item.inventoryForWarehouseList.forEach(key => {
              if (key.commonFrozenInventory > 0) {
                inventoryForWarehouseList.push(key);
              }
            });
            item.inventoryForWarehouseList = [...inventoryForWarehouseList];
          });
          this.tableDataList = [...this.tableDataListCopy];
        } else {
          this.isTableDisabled = true;
        }
      });
      },
      // 上传文件-仓库编码查询列表
      getWarehouseList() {
        this.$AXIOS.GET('/warehouseInfo/selectWarehouseName').then(res => {
          this.warehouseList = res.result;
          this.copyWarehouseList = res.result;
      });
      },
      openFreezeSetDia() {
        this.isFreezeDia = true;
        this.code = '';
      },
      // 库存设置弹窗信息
      openFreezeSetDialog(skuCode) {
        this.code = skuCode;
        this.operateParams.entityId = skuCode;
        this.getFreezeList();
      },
      openOpreationLogDig() {
        this.getLogInfo();
        this.opreationLogDig = true;
      },
      // 获取库存冻结设置信息
      getFreezeList() {
        this.$AXIOS.GET('/inventory/scmInventoryFrozen', {code: this.code}).then(res => {
          this.tableFreezeInfo = res.result;
          this.tableFreezeList = res.result.list;
          if (this.tableFreezeInfo) {
            this.isFreezeDia = false;
            this.isFreezeSettingDia = true;
            this.operateParams.entityId = this.tableFreezeInfo.skuCode;
            this.code = this.tableFreezeInfo.skuCode; // 更新搜索的code
          } else {
            this.$utils.messagetip.errorTip(res.databuffer);
          }
          this.logCount = res.totalCount;
        });
      },
      // 设置解冻数量
      setUnFrozenQuantity(quantity, i) {
        this.$set(this.tableFreezeList[i], 'frozenQuantity', '-' + quantity);
        console.log(this.tableFreezeList);
      },
      // 保存解冻的数量
      saveUnFrozenQuantity() {
        let frozenNum = 0;
        let isZero = false;
        let isSkuCode = '';
        this.requestList = [];
        this.tableFreezeList.forEach(item => {
          let requestObj = {
            warehouseCode: item.warehouseCode,
            frozenQuantity: item.frozenQuantity
          };
          if ((item.frozenQuantity === '0' || item.frozenQuantity === '-0') && !isSkuCode) {
            isZero = true;
            isSkuCode = item.warehouseName;
          }
          if (item.frozenQuantity) {
            frozenNum = frozenNum + 1;
            this.requestList.push(requestObj);
          }
        });
        if (isZero) {
          this.$utils.messagetip.errorTip('请检查数据输入数值数据是否太长或输入格式是否正确等！');
          return;
        }
        if (frozenNum === 0) {
          this.$utils.messagetip.errorTip('请至少填写一项内容');
          return;
        };
        this.$AXIOS.POST('/inventory/updateFrozenInventory/' + this.code, {requestList: JSON.stringify(this.requestList)}).then(res => {
          if (res) {
            this.isFreezeSettingDia = false;
            this.initDataList();
          } else {
            this.$utils.messagetip.errorTip(res.databuffer);
          }
        });
      },
      // 校验输入的冻结数量
      checkUnfrozenQuantity(num, anum, fnum) {
        let rnum = Math.abs(num);
        if (!/^-?\d+$/.test(rnum)) {
          this.$utils.messagetip.errorTip('必须输入整数！');
        } else if ((num > 0) && (rnum > anum)) {
          this.$utils.messagetip.errorTip('本次冻结数量不能大于可用库存');
        } else if ((num < 0) && (rnum > fnum)) {
          this.$utils.messagetip.errorTip('解冻数量不能大于已冻结数量');
        }
      },
      // 获取日志信息
      getLogInfo() {
        this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
          this.logInfoList = res.result;
          this.logCount = res.totalCount;
        });
      },
      // 筛选条件
      searchFormData() {
        this.searchParams.pageSize = 10;
        this.searchParams.pageNo = 1;
        this.searchParams.start = 0;
        this.initDataList();
      },
      // 重置搜索条件
      resetForm() {
        this.searchParams.skuCode = ''; // sku编号
        this.searchParams.barCode = ''; // 条形码
        this.searchParams.skuName = ''; // sku名称
        this.searchParams.start = 0; // 开始页面
        this.searchParams.pageSize = 10; // 默认10条
        this.searchParams.pageNo = 1; // 默认第一页
        this.initDataList();
      },
      // 页码条数改变
      changeSize(val) {
        this.searchParams.pageNo = 1;
        this.searchParams.pageSize = val;
        this.initDataList();
      },
      // 当前页码改变
      changeNumber(val) {
        this.searchParams.pageNo = val;
        this.initDataList();
      },
      // 冻结设置弹窗的确定按钮
      setFreezeTrue() {
        if (!this.code) {
          this.$utils.messagetip.warningTip('请输入SKU编号或条形码！');
          return;
        }
        this.getFreezeList();
      },
      // 打开仓库编码查询的弹窗
      openSearchWmsDia() {
        this.searchWmsDia = true;
        this.getWarehouseList();
      },
      // 仓库编码对照表边输边查
      searchWarehouseData() {
        this.warehouseList = [];
        this.copyWarehouseList.forEach(item => {
          let itemName = item.name;
          if (itemName.indexOf(this.searchWarehouseCode) !== -1) {
            this.warehouseList.push(item);
          }
        });
      },
      handleClick(tab, event) {
        let sourceIndex = tab.index === '0' ? 0 : 1;
        this.searchParams.isFrozeningFlag = sourceIndex;
        this.searchParams.pageSize = 10;
        this.searchParams.pageNo = 1;
        this.searchParams.start = 0;
        this.initDataList();
      },
      onCopyCode(e) {
        this.$utils.messagetip.successTip('复制成功');
        console.log(e);
      },
      onError(e) {
        this.$utils.messagetip.errorTip('复制失败');
      }
    }
  };
</script>
<style lang="less" scoped>
.stocksetting {
  .tip {
    padding: 10px;
    margin: 10px;
    background: rgba(255, 208, 176, 1);
  }
  .left {
    width: 10%;
    height: 100vh;
    border-right: 1px #cccccc solid;
    display: inline-block;
    vertical-align: top;
  }
  .right {
    width: 89%;
    margin-left: 10px;
    height: 100vh;
    display: inline-block;
  }
  .noleft {
    width: 100%;
    display: inline-block;
    background-color: #0f0;
  }
}
.stocksetting .el-pagination{
  padding-bottom: 20px;
  text-align: right;
}
.stocksetting .el-tabs__content{
  margin-top: -55px;
}
.stocksetting .result {
  text-align: center;
}
.stocksetting .result .icon{
    font-size: 80px;
}
.stocksetting .result p{
    line-height: 40px;
}
.stocksetting .frozenTable .cell{
  height: 32px;
  line-height: 32px;
}
.stocksetting .frozenTable .el-table__empty-block{
  min-height: 0;
  height: 0;
}
.el-dialog__body{
  padding: 5px 20px 20px;
}
</style>
