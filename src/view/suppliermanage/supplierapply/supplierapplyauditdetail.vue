<template>
  <div class="supplierapplyauditdetail">
    <div class="title">申请信息</div>
    <el-form label-width="125px">
      <el-row>
        <el-col>
          <el-form-item label="申请方" size="mini">
            {{channelName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="申请说明" size="mini">
            {{supplierApply.description}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="title">供应商信息</div>
    <el-form label-width="125px" size="mini">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="供应商名称：" size="mini">
            {{supplier.supplierName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商编号：" size="mini">
            {{supplier.supplierCode}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商性质：" size="mini">
            {{checkedType("supplierNature",supplier.supplierKindCode)}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="联系人：" size="mini">
            {{supplier.contact}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人电话：" size="mini">
            {{supplier.phone}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="省份.城市.地区：" size="mini">
            {{checkAddress(supplier.province,supplier.city,supplier.area)}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="供应商代理品牌：" size="mini">
            {{supplierBrandsString}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="" size="mini">
            <el-button size="mini" @click="dialogFormVisible=true">供应商详细信息</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="title">审批信息</div>
    <div style="padding:10px 10px;">
      <el-form v-if="!canEdit" label-width="115px">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="当前状态：" size="mini">
              <span v-if="supplierApply.status=='1'">待审批</span>
              <span v-else>已审批</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="当前审批结果：" size="mini">
              <span style="color:#FF0000" v-if="supplierApply.status=='3'">审批驳回</span>
              <span style="color:#009933" v-else-if="supplierApply.status=='2'">审批通过</span>
              <span v-else>无</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="115px">
        <el-row>
          <el-col>
            <el-form-item label="审批记录：" size="mini">
              <!-- 表格tableData -->
              <el-table ref="multipleTable" :data="tableDataList" border tooltip-effect="dark">
                <el-table-column label="审批结果" prop="operation" align="center"></el-table-column>
                <el-table-column label="审批人" prop="operator" align="center"></el-table-column>
                <el-table-column label="审批时间" prop="operateTimeString" align="center"></el-table-column>
                <el-table-column label="审批意见" prop="remark" align="center"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref='memoForm' :model="supplierApply" v-if="canEdit" :rules="rules" label-width="115px">
        <el-row>
          <el-col>
            <el-form-item label="审批意见：" prop="auditOpinion" size="mini">
              <el-input type="textarea" :rows="5" placeholder="驳回时必填，最多不超过1500个字符" v-model="supplierApply.auditOpinion"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottonGroup">
      <el-button type="primary" size="mini" @click="saveSupplierApply(2)" v-if="canEdit">通过</el-button>
      <el-button type="primary" size="mini" v-if="canEdit" @click="saveSupplierApply(3)">驳回</el-button>
      <el-button type="primary" size="mini" v-if="canEdit===false&&supplierApply.status=='1'" @click="canEdit=true">审批</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
    <el-dialog title="供应商详情" :visible.sync="dialogFormVisible">
      <supplier-detail :supplierCode="supplierCode"></supplier-detail>
      <div style="text-align:center;margin-top:10px;">
        <el-button @click="dialogFormVisible=false" size="mini" type="primary"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import supplierDetail from 'components/supplierDetail';
export default {
  data() {
    return {
      dialogFormVisible: false,
      supplier: {
        supplierCode: '',
        supplierKindCode: '',
        supplierTypeCode: '',
        supplierName: '',
        contact: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        certificateTypeId: '',
        country: '',
        remark: ''
      },
      supplierApply: {
        applyCode: '',
        description: '',
        supplierId: '',
        id: 0,
        status: '',
        auditOpinion: ''
      },
      supplierBrandsList: [], // 品牌
      supplierBrandsString: '',
      applyId: this.$route.query.applyId,
      supplierCode: this.$route.query.supplierCode,
      channelName: this.$route.query.channelName,
      canEdit: this.$route.query.canEdit,
      searchParams: {
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      tableDataList: [],
      logPager: {
        entityType: 'SupplierApply',
        entityId: this.$route.query.applyId,
        start: 0, // 默认参数
        pageSize: 100, // 默认10条
        pageNo: 1 // 默认第一页
      },
      rules: {
        auditOpinion: [{ max: 1500, message: '最多不超过1500个字符', trigger: 'blur' }]
      }
    };
  },
  components: {
    supplierDetail
  },
  created() {
    this.initDataList();
  },
  methods: {
    initDataList() {
      // 初始化供应商信息
      if (this.supplierCode) {
        this.$AXIOS.LISTGET('/supplier/supplier/' + this.supplierCode).then(res => {
          this.supplier = res.result.supplier;
          this.supplierApply.supplierId = this.supplier.id;
          this.supplierApply.supplierCode = this.supplier.supplierCode;
        });
        if (this.applyId) {
          // 供应商申请
          this.$AXIOS.LISTGET('/supplier/supplierApply/' + this.applyId).then(res => {
            this.supplierApply.applyCode = res.result.applyCode;
            this.supplierApply.applyId = res.result.id;
            this.supplierApply.description = res.result.description;
            this.supplierApply.status = res.result.status;
          });
        }
        // 品牌
        this.$AXIOS.LISTGET('/supplier/supplierBrands', { supplierCode: this.supplierCode }).then(res => {
          this.supplierBrandsList = res.result;
          this.supplierBrandsString = this.checkSupplierBrands();
        });
        // 日志
        this.$AXIOS.LISTGET('/logInfoPage', this.logPager).then(res => {
          this.tableDataList = res.result;
        });
      }
    },
    saveSupplierApply(status) {
      if (status === 3 && !this.supplierApply.auditOpinion) {
        this.$utils.messagetip.warningTip('驳回时必须填写审核意见！');
        return;
      }
      this.$refs['memoForm'].validate(valid => {
        if (valid) {
          this.supplierApply.status = status;
          if (this.applyId) {
            this.supplierApply.id = this.applyId;
            this.$AXIOS.PUT('/supplier/supplierApplyAudit/' + this.applyId, this.supplierApply).then(res => {
              this.$utils.messagetip.successTip(res.databuffer);
              setTimeout(() => {
                this.$router.push({ path: '/supplierapplyaudit' });
              }, 500);
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    checkAddress(pro, city, area) {
      return this.$utils.queryaddress(pro, city, area).join('-');
    },
    checkSupplierBrands() {
      let brandsArr = [];
      this.supplierBrandsList.forEach(element => {
        brandsArr.push(element.brandName);
      });
      return brandsArr.join(',');
    },
    toSelectSupplier() {
      this.dialogSupplierVisible = true;
      this.searchFormData(true);
    },
    // 字典翻译仓库
    checkedType(type, val) {
      if (val) {
        return this.$utils.querydiction(type, val);
      }
    },
    back() {
      this.$router.push({ path: '/supplierapplyaudit' });
    }
  }
};
</script>
<style lang="stylus" scoped>
.supplierapplyauditdetail
  .title
    padding: 10px
    background-color: #f5f7fa
  .bottonGroup
    text-align: center
    padding-top: 50px
  .page
    text-align: right
    padding: 10px 0
</style>


