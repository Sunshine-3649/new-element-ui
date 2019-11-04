<template>
  <div class="supplierapplydetail">
    <div class="title">基本信息
        <el-button type="text" @click="openOperateDialog" style="padding:0;margin-right:20px;float:right;">单据日志</el-button>
    </div>
    <el-form label-width="125px" size="medium">
      <el-row>
        <el-col>
          <el-form-item label="申请单编号：" size="mini">
            {{supplierApply.applyCode?supplierApply.applyCode:'保存后自动生成'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="供应商名称：" size="mini">
            {{supplier.supplierName?supplier.supplierName:'请选择供应商'}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="10px" v-if="!applyId">
            <el-button @click="toSelectSupplier" size="mini">选择供应商</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="supplierCode!=''">
      <el-form label-width="125px" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="供应商类型：" size="mini">
              {{checkedType("supplierType",supplier.supplierTypeCode)}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商状态：" size="mini">
              {{checkedType("isValid",supplier.isValid)}}
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
          <el-col v-if="supplier.supplierTypeCode=='internalSupplier'" :span="6">
            <el-form-item label="省份.城市.地区：" size="mini">
              {{checkAddress(supplier.province,supplier.city,supplier.area)}}
            </el-form-item>
          </el-col>
          <el-col v-else-if="supplier.supplierTypeCode=='overseasSupplier'" :span="6">
            <el-form-item label="所在国家：" size="mini">
              {{checkCountry(supplier.country)}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="详细地址：" size="mini">
              {{supplier.address}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="supplier.supplierTypeCode=='internalSupplier'">
          <el-col>
            <el-form-item label="证件类型：" size="mini">
              {{checkedType("certificateType",supplier.certificateTypeId)}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="supplier.supplierTypeCode=='internalSupplier'">
          <el-col>
            <!-- 表格 -->
            <el-form-item label="" size="mini">
              <div class="msgWrap">
                <ul class="head">
                  <li>证件类型</li>
                  <li>证件号</li>
                  <li style="text-align:center">证件有效期</li>
                  <li>证件图片</li>
                </ul>
                <div v-if="supplier.certificateTypeId == 'normalThreeCertificate'">
                  <ul class="body">
                    <li>营业执照</li>
                    <li>
                      <el-form-item style="margin-left:0">
                        {{certificate.businessLicence}}
                      </el-form-item>
                    </li>
                    <li>
                      <el-form-item>
                        {{certificate.businessLicenceStartDate}}至{{certificate.businessLicenceEndDate}}
                      </el-form-item>
                    </li>
                    <li>
                      <div class="showImg" v-show="certificate.businessLicencePic">
                        <img @click="handlePreview(showImg1)" :src="showImg1" />
                      </div>
                    </li>
                  </ul>
                  <ul class="body">
                    <li>组织机构代码证</li>
                    <li>
                      <el-form-item>
                        {{certificate.organRegistraCodeCertificate}}
                      </el-form-item>
                    </li>
                    <li>
                      <el-form-item>
                        {{certificate.organRegistraStartDate}}至{{certificate.organRegistraEndDate}}
                      </el-form-item>
                    </li>
                    <li>
                      <div class="showImg" v-show="certificate.organRegistraCodeCertificatePic">
                        <img @click="handlePreview(showImg2)" :src="showImg2" />
                      </div>
                    </li>
                  </ul>
                  <ul class="body">
                    <li>税务登记证</li>
                    <li>
                      <el-form-item>
                        {{certificate.taxRegistrationCertificate}}
                      </el-form-item>
                    </li>
                    <li>
                      <el-form-item>
                        {{certificate.taxRegistrationStartDate}}至{{certificate.taxRegistrationEndDate}}
                      </el-form-item>
                    </li>
                    <li>
                      <div class="showImg" v-show="certificate.taxRegistrationCertificatePic">
                        <img @click="handlePreview(showImg3)" :src="showImg3" />
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <ul class="body">
                    <li>多证合一</li>
                    <li>
                      <el-form-item>
                        {{certificate.multiCertificateCombineNo}}
                      </el-form-item>
                    </li>
                    <li>
                      <el-form-item>
                        {{certificate.multiCertificateStartDate}}至{{certificate.multiCertificateEndDate}}
                      </el-form-item>
                    </li>
                    <li>
                      <div class="showImg" v-show="certificate.multiCertificateCombinePic">
                        <img style="" @click="handlePreview(showImg4)" :src="showImg4" />
                      </div>
                    </li>
                  </ul>
                </div>
                <ul class="body">
                  <li>法人身份证</li>
                  <li>
                    <el-form-item>
                      {{certificate.legalPersonIdCard}}
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item>
                      {{certificate.idCardStartDate}}至{{certificate.idCardEndDate}}
                    </el-form-item>
                  </li>
                  <li style="display:flex; justify-content: center">
                    <div class="showImg" v-show="certificate.legalPersonIdCardPic1">
                      <img @click="handlePreview(showImg5)" :src="showImg5" />
                    </div>
                    <div class="showImg" v-show="certificate.legalPersonIdCardPic2">
                      <img @click="handlePreview(showImg6)" :src="showImg6" />
                    </div>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注：" size="mini">
              {{supplier.remark}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">供应商其他信息</div>
      <!-- 选项卡 -->
      <div class="tabs" style="padding:0 10px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="代理类目" name="first">
            <!-- 类目表格tableData -->
            <el-table :data="supplierCategorysList" border tooltip-effect="dark">
              <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
              <el-table-column label="类目名称（一级/二级/三级）" prop="categoryName" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="代理品牌" name="second">
            <!-- 品牌表格tableData -->
            <el-table :data="supplierBrandsList" border tooltip-effect="dark">
              <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
              <el-table-column label="品牌名称" prop="brandName" align="center"></el-table-column>
              <el-table-column label="所属类目" prop="categoryName" align="center"></el-table-column>
              <el-table-column label="代理资质" prop="proxyAptitudeId" align="center">
                <template slot-scope="scope">
                  {{proxyAptitude[scope.row.proxyAptitudeId]}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="财务信息" name="third">
            <el-form label-width="125px" size="mini">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="开户银行：">
                    {{supplierFinancialInfo.depositBank}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="银行帐号：">
                    {{supplierFinancialInfo.bankAccount}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="售后信息" name="fourth">
            <el-form label-width="135px" size="mini">
              <el-row :span="20">
                <el-col :span="6">
                  <el-form-item label="退货省份.城市.地区：">
                    {{checkAddress(supplierAfterSaleInfo.saleProvince,supplierAfterSaleInfo.saleCity,supplierAfterSaleInfo.saleArea)}}
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="退货地址：">
                    {{supplierAfterSaleInfo.goodsReturnAddress}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="20">
                <el-col :span="6">
                  <el-form-item label="退货联系人：">
                    {{supplierAfterSaleInfo.goodsReturnContactPerson}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="退货联系电话：">
                    {{supplierAfterSaleInfo.goodsReturnPhone}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="退货策略：">
                    {{supplierAfterSaleInfo.goodsReturnStrategy}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <br/>
    </div>
    <div class="title">申请信息</div>
    <div style="padding:10px 10px;">
      <el-form ref='applyForm' :rules="rules" :model="supplierApply" label-width="115px">
        <el-row :span="20">
          <el-col>
            <el-form-item label="申请说明：" prop="description"  size="mini">
              <span v-if="canEdit==false">{{supplierApply.description}}</span>
              <el-input v-if="canEdit" type="textarea" :rows="5" placeholder="不超过1500个字符" v-model="supplierApply.description"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottonGroup">
      <el-button type="primary" size="mini" @click="saveSupplierApply(1)" v-if="canEdit">提交审核</el-button>
      <el-button size="mini" v-if="canEdit" @click="saveSupplierApply(0)">保存</el-button>
      <!-- <el-button type="primary" size="mini">编辑</el-button> -->
      <el-button size="mini" @click="back">返回</el-button>
    </div>
    <!-- 查看上传图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <img :src="dialogImg" />
    </el-dialog>
    <!-- 供应商选择界面 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="70%">
      <el-form :inline="true" :model="searchParams" size="mini">
        <el-row>
          <el-col>
            <el-form-item label="供应商名称：">
              <el-input v-model.trim="searchParams.supplierName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="供应商编号：">
              <el-input v-model.trim="searchParams.supplierCode" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="供应商性质：">
              <el-select v-model="searchParams.supplierKindCode" filterable placeholder="请选择">
                <el-option v-for="item in supplierKindCodeList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="searchFormData(false)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分页 -->
      <el-row type="flex" justify="space-between">
        <el-col>
        </el-col>
        <el-row class="paging">
          <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.totalCount">
          </el-pagination>
        </el-row>
      </el-row>
      <!-- 表格tableData -->
      <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
        <el-table-column label="" width="55" align="center">
          <template slot-scope="scope">
            <el-radio v-model="radioName" :label="scope.row.supplierCode"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" prop="supplierName" align="center"></el-table-column>
        <el-table-column label="供应商编号" prop="supplierCode" align="center"></el-table-column>
        <el-table-column label="供应商性质" prop="supplierKindCode" align="center">
          <template slot-scope="scope">
            {{checkedType('supplierNature', scope.row.supplierKindCode)}}
          </template>
        </el-table-column>
        <el-table-column label="代理品牌" prop="brandName" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" center>
        <el-button @click="dialogSupplierVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="makeSureAddSupplier" size="mini">确 定</el-button>
      </div>
    </el-dialog>
        <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="dialogLogVisible" width="70%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>
<script>
import operateTable from 'components/operateTable';
export default {
  data() {
    return {
      activeName: 'first',
      radioName: '',
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
        status: ''
      },
      supplierFinancialInfo: { depositBank: '', bankAccount: '' },
      supplierAfterSaleInfo: {
        saleProvince: '',
        saleCity: '',
        saleArea: '',
        goodsReturnAddress: '',
        goodsReturnContactPerson: '',
        goodsReturnPhone: '',
        goodsReturnStrategy: ''
      },
      certificate: {
        businessLicence: '',
        businessLicenceStartDate: '',
        businessLicenceEndDate: '',
        businessLicencePic: '',
        organRegistraCodeCertificate: '',
        organRegistraStartDate: '',
        organRegistraEndDate: '',
        organRegistraCodeCertificatePic: '',
        taxRegistrationCertificate: '',
        taxRegistrationStartDate: '',
        taxRegistrationEndDate: '',
        taxRegistrationCertificatePic: '',
        multiCertificateCombineNo: '',
        multiCertificateStartDate: '',
        multiCertificateEndDate: '',
        multiCertificateCombinePic: '',
        legalPersonIdCard: '',
        idCardStartDate: '',
        idCardEndDate: '',
        legalPersonIdCardPic1: '',
        legalPersonIdCardPic2: ''
      },
      proxyAptitude: {
        brandSubdivision: '品牌方',
        firstAgent: '一级代理',
        secondAgent: '二级代理',
        netGeneralAgent: '网络总代理',
        others: '其他'
      },
      supplierCategorysList: [], // 类目
      supplierBrandsList: [], // 品牌
      dialogVisible: false,
      dialogSupplierVisible: false, // 选择供应商
      dialogLogVisible: false,
      dialogImg: '',
      showImg1: '',
      showImg2: '',
      showImg3: '',
      showImg4: '',
      showImg5: '',
      showImg6: '',
      applyId: this.$route.query.applyId,
      supplierCode: this.$route.query.supplierCode,
      canEdit: this.$route.query.canEdit,
      searchParams: {
        supplierName: '',
        supplierCode: '',
        supplierKindCode: '',
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      operateParams: {
        entityType: 'SupplierApply',
        entityId: this.$route.query.applyId
      },
      isRefresh: 0,  // 是否刷新数据
      tableDataList: [],
      supplierKindCodeList: [],
      rules: {
        description: [{ max: 1500, message: '最多不超过1500个字符', trigger: 'blur' }]
      },
      countryMap: {}
    };
  },
  created() {
    this.initDataList();
    this.supplierKindCodeList = this.$utils.querydiction('supplierNature');
    this.supplierKindCodeList.unshift({ name: '全部', value: '' });
  },
  components: {
    operateTable
  },
  methods: {
    initDataList() {
      // 国家
        this.$AXIOS.LISTGET('/select/country').then(res => {
            res.result.map((item, index) => {
              this.countryMap[item.value] = item.name;
            });
        });
        // 初始化供应商信息
      if (this.supplierCode) {
        this.$AXIOS.LISTGET('/supplier/supplier/' + this.supplierCode).then(res => {
          this.supplier = res.result.supplier;
          this.supplierFinancialInfo = res.result.supplierFinancialInfo;
          this.supplierAfterSaleInfo = res.result.supplierAfterSaleInfo;
          if (res.result.certificate !== null) { this.certificate = res.result.certificate; }
          this.supplierApply.supplierId = this.supplier.id;
          this.supplierApply.supplierCode = this.supplier.supplierCode;
          this.getBatchUrl();
        });
        if (this.applyId) {
          // 供应商申请
          this.$AXIOS.LISTGET('/supplier/supplierApply/' + this.applyId).then(res => {
            this.supplierApply.applyCode = res.result.applyCode;
            this.supplierApply.applyId = res.result.id;
            this.supplierApply.description = res.result.description;
          });
        }
        // 类目
        this.$AXIOS.LISTGET('/supplier/supplierCategorys', { supplierCode: this.supplierCode }).then(res => {
          this.supplierCategorysList = res;
        });
        // 品牌
        this.$AXIOS.LISTGET('/supplier/supplierBrands', { supplierCode: this.supplierCode }).then(res => {
          this.supplierBrandsList = res.result;
        });
      }
    },
    saveSupplierApply(status) {
      if (this.supplierCode === '') {
        this.$utils.messagetip.warningTip('请选择供应商');
        return;
      }

      this.$refs['applyForm'].validate(valid => {
        if (valid) {
          this.supplierApply.status = status;
          if (this.applyId) {
            this.supplierApply.id = this.applyId;
            this.$AXIOS.PUT('/supplier/supplierApply/' + this.applyId, this.supplierApply).then(res => {
              this.$utils.messagetip.successTip(res.databuffer);
              setTimeout(() => {
                this.$router.push({ path: '/supplierapply' });
              }, 500);
            });
          } else {
            this.$AXIOS.POST('/supplier/supplierApply', this.supplierApply).then(res => {
              this.$utils.messagetip.successTip(res.databuffer);
              setTimeout(() => {
                this.$router.push({ path: '/supplierapply' });
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
    checkCountry(value) {
      if (this.countryMap[value]) { return this.countryMap[value]; }
    },
    searchFormData(reset) {
      if (reset) {
        this.searchParams.pageSize = 10;
        this.searchParams.pageNo = 1;
        this.searchParams.start = 0;
        this.radioName = '';
        this.searchParams.supplierCode = '';
        this.searchParams.supplierName = '';
        this.searchParams.supplierKindCode = '';
      }
      this.$AXIOS.LISTGET('/supplier/applySupplierPage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.searchParams.totalCount = res.totalCount;
      });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.searchFormData();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
      this.searchFormData();
    },
    toSelectSupplier() {
      this.dialogSupplierVisible = true;
      this.searchFormData(true);
    },
    makeSureAddSupplier() {
      if (this.radioName) {
        this.supplierCode = this.radioName;
        this.initDataList();
        this.dialogSupplierVisible = false;
      } else {
        this.$utils.messagetip.successTip('请选择供应商');
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 字典翻译仓库
    checkedType(type, val) {
      if (val) {
        return this.$utils.querydiction(type, val);
      }
    },
    handlePreview(file) {
      // 点击查看上传的图片
      this.dialogVisible = true;
      this.dialogImg = file;
    },
    back() {
      this.$router.push({path: '/supplierapply'});
    },
    // 打开操作明细的弹窗
    openOperateDialog() {
        this.isRefresh += 1;
        this.dialogLogVisible = true;
    },
    // 操作日志弹窗关闭
    closeOperate() {
      this.dialogLogVisible = false;
    },
    getBatchUrl() {
      let filenameArray = [];
      if (this.certificate.businessLicencePic) {
        filenameArray.push(this.certificate.businessLicencePic);
      }
      if (this.certificate.organRegistraCodeCertificatePic) {
        filenameArray.push(this.certificate.organRegistraCodeCertificatePic);
      }
      if (this.certificate.taxRegistrationCertificatePic) {
        filenameArray.push(this.certificate.taxRegistrationCertificatePic);
      }
      if (this.certificate.multiCertificateCombinePic) {
        filenameArray.push(this.certificate.multiCertificateCombinePic);
      }
      if (this.certificate.legalPersonIdCardPic1) {
        filenameArray.push(this.certificate.legalPersonIdCardPic1);
      }
      if (this.certificate.legalPersonIdCardPic2) {
        filenameArray.push(this.certificate.legalPersonIdCardPic2);
      }
      if (filenameArray.length < 1) {
        return false;
      }
      let params = { thumbnail: '0', fileNames: filenameArray.join(',') };
      this.$AXIOS.LISTGET('/qinniuPrivate/urls', params).then(res => {
        res.result.forEach(item => {
          if (item.fileKey === this.certificate.businessLicencePic) {
            this.showImg1 = item.url;
          }
          if (item.fileKey === this.certificate.organRegistraCodeCertificatePic) {
            this.showImg2 = item.url;
          }
          if (item.fileKey === this.certificate.taxRegistrationCertificatePic) {
            this.showImg3 = item.url;
          }
          if (item.fileKey === this.certificate.multiCertificateCombinePic) {
            this.showImg4 = item.url;
          }
          if (item.fileKey === this.certificate.legalPersonIdCardPic1) {
            this.showImg5 = item.url;
          }
          if (item.fileKey === this.certificate.legalPersonIdCardPic2) {
            this.showImg6 = item.url;
          }
        });
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.supplierapplydetail
  .title
    padding: 10px
    background-color: #f5f7fa
  .bottonGroup
    text-align: center
    padding-top: 50px
  .page
    text-align: right
    padding: 10px 0
  .requiredItem
    color: red
    position: relative
    top: 21px
    left: 33px
  .requiredItem.a1
    left: 45px
  .requiredItem.a2
    left: 61px
  .requiredItem.a3
    left: 46px
  .requiredItem.a5
    left: 10px
  .requiredItem.a6
    left: 45px
  .msgWrap
    border: 1px solid #ebeef5
    border-bottom: 0
    margin: 0 0 10 0
    ul
      display: flex
      border-bottom: 1px solid #ebeef5
      align-items: center
      li
        width: 22%
        text-align: center
        border-right: 1px solid #ebeef5
        min-height: 45px
        line-height: 45px
      li:nth-child(3)
        width: 33%
        text-align: left
        padding-left: 10px
      li.uploadLi
        display: flex
        justify-content: center
        align-items: center
    ul.head
      height: 40px
      line-height: 40px
  .showImg
    img
      width: 40px
      cursor: pointer
      max-height: 40px
</style>
<style lang="stylus">
.supplierapplydetail
  .el-radio__label
    display none
</style>



