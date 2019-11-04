<template>
  <div class="stockadjustauditdetail">
    <div>库存调整单审核</div>
    <div class="title">基本信息</div>
    <el-form label-width="125px" size="mini">
      <el-form-item label="库存调整单编号：">
        {{ searchParams.stockAdjustCode }}
      </el-form-item>
      <el-form-item label="调整仓库：">
        {{ checkedType(searchParams.adjustWarehouseCode) }}
      </el-form-item>
      <el-form-item label="业务类型：">
        {{ searchParams.businessTypeDesc }}
      </el-form-item>
      <el-form-item label="调整说明：">
        {{ searchParams.adjustInstruction }}
      </el-form-item>
      <div class="title">商品明细</div>
      <el-table class="price_list" :data="tableDataList" style="width: 100%;" border>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column v-if="searchParams.businessType == 3" prop="skuCode" label="SKU编号" align="center" width="230" :key="Math.random()">
          <template slot-scope="scope">
            <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span align="center">原SKU</span><span class="targatSkuCode">{{scope.row.skuCode}}</span></div>
            <div class="oringinDiv"><span align="center">目标SKU</span><span class="targatSkuCode">{{scope.row.targetSkuCode}}</span></div>
          </template>
        </el-table-column>
        <el-table-column v-else prop="skuCode" label="SKU编号" align="center" :key="Math.random()"></el-table-column>

        <el-table-column v-if="searchParams.businessType == 3" prop="skuName" label="SKU名称" align="center" :key="Math.random()">
          <template slot-scope="scope">
            <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.skuName}}</span></div>
            <div><span>{{scope.row.targetSkuName}}</span></div>
          </template>
        </el-table-column>
        <el-table-column v-else prop="skuName" label="SKU名称" align="center" :key="Math.random()"></el-table-column>

        <el-table-column v-if="searchParams.businessType == 3" prop="specNatureInfo" label="规格" align="center" :key="Math.random()">
          <template slot-scope="scope">
            <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.specNatureInfo}}</span></div>
            <div><span>{{scope.row.targetSpecNatureInfo}}</span></div>
          </template>
        </el-table-column>
        <el-table-column v-else prop="specNatureInfo" label="规格" align="center" :key="Math.random()"></el-table-column>

        <el-table-column  v-if="searchParams.businessType == 3" prop="barCode" label="条形码" align="center" :key="Math.random()">
          <template slot-scope="scope">
            <div style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.barCode}}</span></div>
            <div><span>{{scope.row.targetBarCode}}</span></div>
          </template>
        </el-table-column>
        <el-table-column v-else prop="barCode" label="条形码" align="center" :key="Math.random()"></el-table-column>
        <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center"></el-table-column>
        <el-table-column v-if='[0,1].indexOf(searchParams.adjustInventoryObject)!==-1' prop="adjustInventoryObjectDesc" label="调整库存对象（门店）" align="center" :key="Math.random()"></el-table-column>

        <el-table-column v-if="searchParams.businessType == 3" prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
          <template slot-scope="scope">
            <div style="border-bottom: 1px solid #ebeef5">
              <span>减少</span>
              <span>{{scope.row.adjustNum}}</span>
            </div>
            <div>
              <span>增加</span>
              <span>{{scope.row.targetAdjustNum}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
        </el-table-column>
      </el-table>
      <div class="title radiut">审核信息</div>
      <div v-show="!editOrDetail">
        <el-form-item label="审核记录：" v-if="auditLog.length > 0">
          <el-table :data="auditLog" border style="width: 100%">
            <el-table-column align="center" prop="operation" label="审核结果" ></el-table-column>
            <el-table-column align="center" prop="operator" label="审核人" > </el-table-column>
            <el-table-column align="center" prop="operateTimeString" label="审核时间" > </el-table-column>
            <el-table-column align="center" prop="remark" label="审核意见" > </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="审核意见：">
          <el-input v-model="auditOpinion" maxlength="500" type="textarea"></el-input>
          驳回时必填,最多不超过500个字符
        </el-form-item>
        <div style="text-align:center;">
          <el-button size="mini" :disabled="disableBtn || disableBtn1" @click="confirm('0')" type="primary">通过</el-button>
          <el-button size="mini" :disabled="disableBtn1" @click="confirm('1')" type="primary">驳回</el-button>
          <el-button @click="back()" size="mini">取消</el-button>
        </div>
      </div>
      <div v-show="editOrDetail">
        <ul class="audit_status">
          <li>
            <span>当前状态：</span>
            <span v-show="searchParams.reviewStatus == 1">已审核</span>
            <span v-show="searchParams.reviewStatus == 0">待审核</span>
          </li>
          <li>
            <span>当前审核结果：</span>
            <span v-if="searchParams.docStatus === 3 || searchParams.docStatus === 4" style="color:rgb(0, 153, 0);">审核通过</span>
            <span v-else-if="searchParams.docStatus === 1" style="color:rgb(255, 0, 0);">{{ searchParams.docStatusDesc }}</span>
            <span v-else>无</span>
          </li>
        </ul>
        <div v-if="auditLog.length > 0" style="padding: 10px 0">审核记录：</div>
        <el-table :data="auditLog" v-if="auditLog.length > 0" border style="width: 100%">
          <el-table-column align="center" prop="operation" label="审核结果" ></el-table-column>
          <el-table-column align="center" prop="operator" label="审核人" > </el-table-column>
          <el-table-column align="center" prop="operateTimeString" label="审核时间" > </el-table-column>
          <el-table-column align="center" prop="remark" label="审核意见" > </el-table-column>
        </el-table>
        <div style="text-align:center; margin:20px 0">
          <el-button v-if="searchParams.reviewStatus == 0" size="mini" @click="toAudit" type="primary">审核</el-button>
          <el-button @click="back()" size="mini">返回</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
  export default {
    name: 'stockadjustauditdetail',
    data() {
      return {
        auditLog: [], // 审核记录
        searchParams: {
          stockAdjustCode: '', // 库存调整单号
          adjustWarehouseCode: '', // 库存调整仓库编码
          businessType: '', // 库存调整业务类型
          adjustInventoryType: '', // 库存调整库存类型
          adjustInstruction: '', // 调整说明
          reviewStatus: '' // 是否审核
        },
        operateParams: {
          start: 0,
          pageNo: 1,
          pageSize: 10,
          filterFlag: 1,
          operateType: 0,
          entityType: 'StockAdjustOrder',
          entityId: ''
        }, // 日志
        tableDataList: [],
        id: this.$route.params.id, // 库存调整单id
        editOrDetail: this.$route.params.flag ? this.$route.params.flag : false, // true是detail
        auditOpinion: '',
        disableBtn: false,
        disableBtn1: false,
        warehouseList: [], // 仓库信息
        auditOption: 0 // 审核通过与否
      };
    },
    mounted: function() {
      this.initDetailData();
      this.getWarehouseList();
    },
    methods: {
      // 获取调整仓库信息
      getWarehouseList() {
        this.$AXIOS.GET('/stockadjust/warehouseList').then(res => {
          this.warehouseList = res.result;
        });
      },
      checkedType(type) {
        let typeStr = '';
        this.warehouseList.forEach( item => {
          if (type === item.code) {
            typeStr = item.warehouseName;
          }
        });
        return typeStr;
      },
      toAudit() {
        this.editOrDetail = false;
      },
      back() {
        this.$router.push({
          path: '/stockadjustaudit'
        });
      },
      initDetailData() {
        this.tableDataList = [];
        this.$AXIOS.GET('/stockadjust/edit/' + this.id).then(res => {
          this.searchParams = res.result;
          this.operateParams.entityId = res.result.stockAdjustCode;
          this.tableDataList = res.result.stockAdjustSkuDetails;
          this.getLogInfo();
        });
      },
      confirm(flag) {
        if (flag === '1' && !this.auditOpinion) {
          this.$utils.messagetip.warningTip('请填写审核意见');
          return;
        }
        let data = {
          id: this.id,
          auditOpinion: this.auditOpinion,
          auditOption: flag
        };
        this.disableBtn1 = true;
        this.$AXIOS.PUT('/stockadjust/auditPass/' + this.id, data, true).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.back();
      }).finally(() => {
          this.disableBtn1 = false;
      });
      },
      // 获取日志信息
      getLogInfo() {
        this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
          this.auditLog = res.result;
        });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stockadjustauditdetail
    .title
      background-color #f5f7fa;
      color #909399
      padding 10px
      font-size 14px
      margin 10px 0
    .title.radiut
      color #409eff
      background-color #ecf8ff
    .audit_status
      display flex
      padding 10px
      margin 20px 0 10px 0
      border solid 1px #999
      li
        padding-right 50px

    .price_list
      .oringinDiv
        text-align:right;
        span
          padding:2px 10px;
        .targatSkuCode
          display:inline-block;
          border-left: 1px solid #ebeef5;
          width: 150px;
          text-align: center;
</style>

