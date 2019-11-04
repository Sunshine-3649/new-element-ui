<template>
  <div class="plandetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>计划信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作日志</el-button> -->
      </div>
      <section class="info">
        <p>
          <span class="title">计划编号：</span>
          <span class="desc">{{ pricePlanVO.pricePlanCode }}</span>
        </p>
        <p>
          <span class="title">计划名称：</span>
          <span class="desc">{{ pricePlanVO.pricePlanName }}</span>
        </p>
        <p>
          <span class="title">关联的分销商数量：</span>
          <span class="desc">{{ pricePlanVO.relateDistributorNum }}</span>
        </p>
        <p>
          <span class="title">创建人：</span>
          <span class="desc">{{ pricePlanVO.createOperator }}</span>
        </p>
        <p>
          <span class="title">创建时间：</span>
          <span class="desc">{{ pricePlanVO.createTimeStr }}</span>
        </p>
      </section>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>计划规则</span>
      </div>
      <section class="info">
        <p>
          <span class="title">计划类型：</span>
          <!-- <el-checkbox v-model="isSetting">基于商品设置</el-checkbox> -->
          <el-radio v-model="isSetting" label="1">基于商品设置</el-radio>
        </p>
      </section>
    </el-card>
    <!-- 商品列表 -->
    <el-card class="box-card">
      <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <third-select :clear="clear" v-on:shopId="shopId"></third-select>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称：" size="mini">
              <el-input v-model.trim="searchParams.itemsName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button type="primary" icon="search" @click="search">搜索</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">清空条件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表格 -->
      <el-table :data="shopTableData" border style="width: 100%" align="center">
        <el-table-column prop="firstCategoryName" label="一级类目" align="center"></el-table-column>
        <el-table-column prop="secondCategoryName" label="二级类目" align="center"></el-table-column>
        <el-table-column prop="thirdCategoryName" label="三级类目" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="spuCode" label="SPU编号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="checkRowDetail(scope.$index, scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" size="mini" @click="save">修改</el-button>
      <el-button type="primary" size="mini" @click="exportExcel">导出</el-button>
      <!-- <el-upload style="display:inline;margin-left:10px;" class="upload-demo"
        ref="uploadFrom"
        action="/chain-web//busiPricePlan/importData"
        :data="uploadData"
        :on-success="importSuccess"
        :before-upload="beforeUpload"
         multiple
         :limit="1"
        accept=".xls,.xlsx,.XLS,.XLSX">
      </el-upload> -->
      <el-button size="mini" @click="importAccount" type="primary">导入</el-button>
      <el-button size="mini" @click="back">返回</el-button>
      <el-button type="text" @click="downLoad">定价计划模板下载</el-button>
    </div>

    <!-- 列表详情内表格展示 -->
    <el-dialog title="明细" width="60%" :visible.sync="dialogTableVisible">
      <el-table :data="skuList" border>
        <!-- <el-table-column type="index" label="序号" prop="date" width="150" align="center"></el-table-column> -->
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU编码" prop="skuCode" align="center"></el-table-column>
        <el-table-column label="商品条码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="折扣率" prop="discountRate" align="center"></el-table-column>
        <el-table-column label="加价金额" prop="priceIncreaseAmount" align="center"></el-table-column>
        <el-table-column label="分销价" prop="distributorPrice" align="center"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 导入失败或成功 -->
    <el-dialog title="导入计划" :visible.sync="dialogImportVisible" width="30%">
      <el-upload ref="upload"  v-show="isResult === 'default'" :on-progress="onProgress" :before-upload="beforeUpload" class="upload-demo" drag action="/chain-web/busiPricePlan/importAnalyzeData" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div v-show="isUpload" class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div v-show="isResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>全部解析成功</p>
        <p>共{{uploadResult.successCount}}条数据</p>
      </div>
      <div v-show="isResult === 'fail'" class="result">
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
          <a href="/chain-web/busiPricePlan/exampleExport" target="_blank" style="color: red;">下载模板</a>并按模板修改后重新提交
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div v-show="isResult === 'success'" style="text-align: center;">
          <el-button type="primary" @click="savePrice" size="mini">提交</el-button>
          <el-button @click="resetPrice" size="mini">取消提交</el-button>
        </div>
        <div v-show="isResult === 'fail'" style="text-align: center;">
          <el-button @click="dialogImportVisible = false" size="mini">关闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import thirdSelect from 'components/select'; // 引用三级联动组件
export default {
  name: 'plandetail',
  data() {
    return {
      dialogTableVisible: false, // 明细弹窗
      dialogImportVisible: false, // 导入文件成功或者失败的弹窗
      searchParams: {
        pageSize: 10,
        pageNumber: 1,
        itemsName: '',
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        planId: '',
        recordTotal: 0
      },
      isSetting: '1', // 设置计划类型
      clear: false,
      options: [], // 三级联动数据
      selectedOptions: [],
      shopTableData: [], // 商品列表
      pricePlanVO: [], // 计划详情
      skuList: [], // 商品明细
      uploadData: {
        planId: ''
      }, // 导入所需要的参数
      uploadImportBack: '',
      loading: '',
      isShowPrice: true,
      importCode: '', // 导出出错的参数
      uploadResult: {}, // 上传成功返回的响应数据
      isResult: 'default', // 默认显示导入文件
      formatError: true, // 是否显示解析模板错误文案
      errorMessage: '', // 错误文案
      isUpload: true
    };
  },
  mounted: function() {
    let code = this.$route.params.id;
    this.searchParams.planId = code;
    this.initDataList(this.searchParams);
  },
  components: { thirdSelect },
  computed: {
    // 导入失败下载的地址
    downloadFail() {
      return (
        '/chain-web/busiPricePlan/exceptionOrderDownload/' + this.importCode
      );
    }
  },
  methods: {
    shopId(id) {
      // 子组件传送数据到父组件所选三级菜单的id
      for (let data in this.searchParams) {
        for (let item in id) {
          if (item === data) {
            this.searchParams[data] = id[item];
          }
        }
      }
    },
    // 初始化数据
    initDataList(data) {
      this.GET('/busiPricePlan/queryPricePlanDetail', data).then(res => {
        this.shopTableData = res.body.itemsBaseVO.objects;
        this.pricePlanVO = res.body.pricePlanVO;
        this.uploadData.planId = res.body.pricePlanVO.id; // 导出要用到
        this.searchParams.recordTotal = res.body.itemsBaseVO.recordTotal;
      });
    },
    // 搜索，
    search() {
      this.initDataList(this.searchParams);
    },
    // 重置搜索条件
    resetForm() {
      this.clear = true; // 重置组件的下的条件
      for (let obj in this.searchParams) {
        if (
          obj === 'pageNumber' ||
          obj === 'pageSize' ||
          obj === 'recordTotal' ||
          obj === 'planId'
        ) {
          continue;
        } else {
          this.searchParams[obj] = '';
        }
      }
      this.initDataList(this.searchParams);
    },
    // 查看表格每一行的明细
    checkRowDetail(index, row) {
      this.dialogTableVisible = true;
      this.skuList = row.pricePlanSkuVOS.map((item, index, arr) => {
        for (let data in item) {
          if (item[data] === null) item[data] = '-';
        }
        return item;
      });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageSize = val;
      this.initDataList(this.searchParams);
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      this.initDataList(this.searchParams);
    },
    // 改变供应状态
    toggleSupplyStatus() {},
    // 切换移动端和桌面端显示
    togglePort() {},
    // 修改按钮
    save() {
      this.$router.push({
        path: '/planandstragy/planaddoredit/' + this.pricePlanVO.id
      });
    },
    // 导出
    exportExcel() {
      window.open(
        '/chain-web/busiPricePlan/exportData?planId=' + this.pricePlanVO.id
      );
    },
    // 导入模板
    importAccount() {
      this.isResult = 'default';
      this.dialogImportVisible = true;
      this.uploadResult = {};
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.dialogImportVisible = true;
    },
    // 取消报价
    resetPrice() {
      this.$message({
        type: 'info',
        message: '提交取消'
      });
      this.dialogImportVisible = false;
    },
    // 导入成功之后调用
    savePrice() {
      let data = {
        planId: this.uploadData.planId,
        importExceptionId: this.importCode
      };
      this.POST('/busiPricePlan/importData', data).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.dialogImportVisible = false;
          this.initDataList(this.searchParams);
        }
      });
    },
    // 上传之前事件
    beforeUpload(file) {
        if (file.size > 50000000) {
            this.$message.warning('上传的文件不能大于50M');
            return false;
        }
    },
    // 文件上传中事件
    onProgress(file) {
        this.isUpload = false;
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === '200') {
        this.formatError = true;
        this.$message({
          message: '文件解析成功',
          type: 'success'
        });
        this.uploadResult = response.body;
        this.importCode = this.uploadResult.importCode || '';
        if (
          this.uploadResult.failCount === '0' ||
          this.uploadResult.failCount === null
        ) {
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
    handlePreview() {},
    handleRemove() {},
    // 上传文件之前事件
    // beforeUpload() {
    // //   this.loading = this.$loading({
    // //     lock: true,
    // //     text: '文件上传中...',
    // //     spinner: 'el-icon-loading',
    // //     background: 'rgba(0, 0, 0, 0.7)'
    // //   });
    // },
    // 模板下载
    downLoad() {
      window.open('/chain-web/busiPricePlan/exampleExport');
    },
    back() {
      this.$router.push({ path: '/planandstragy' });
    }
  }
};
</script>

<style lang="stylus" scoped>
.plandetail
  .upload-demo
    text-align: center
  .result
    text-align: center
    .icon
      font-size: 80px
    p
      line-height: 40px
  font-size: 14px
  .box-card
    margin-bottom: 15px
  .info
    p
      line-height: 26px
      .title
        font-weight: 700
  .paging
    text-align: right
    margin-top: 15px
  .btn
    margin-top: 15px
    text-align: center
    line-height: 60px
    background-color: rgb(242, 242, 242)
  .name
    font-weight: 700
    font-size: 18px
    line-height: 40px
    padding-left: 20px
    background-color: rgb(242, 242, 242)
  .main_images
    margin-top: 30px
    margin-bottom: 15px
    .title
      text-align: right
      line-height: 40px
      font-size: 22px
      font-weight: 500
</style>
<style scoped>
.import_dialog {
  text-align: center;
}
.import_dialog i {
  font-size: 120px;
}
.import_dialog i.success {
  color: #67c23a;
}
.import_dialog i.error {
  color: #f56c6c;
}
.el-radio{
  cursor: auto;
}
</style>

