<template>
  <div class="supplierdetail_component">
    <div class="title">基本信息</div>
    <el-form label-width="125px">
      <el-row :span='24'>
        <el-col :span="6">
          <el-form-item label="供应商编号：" size="mini">
            {{supplier.supplierCode}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称：" size="mini">
            {{supplier.supplierName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商性质：" size="mini">
            {{checkedType("supplierNature",supplier.supplierKindCode)}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商类型：" size="mini">
            {{checkedType("supplierType",supplier.supplierTypeCode)}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="供应商简称：" size="mini">
            {{supplier.supplierShortCall}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人：" size="mini">
            {{supplier.contact}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话：" size="mini">
            {{supplier.phone}}
          </el-form-item>
        </el-col>
        <el-col v-if="supplier.supplierTypeCode=='internalSupplier'" :span="6">
          <el-form-item label="省.市.区：" size="mini">
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
        <el-col :span="12">
          <el-form-item label="可见业务线：" size="mini">
            {{supplierChannelRelations.join(',')}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址：" size="mini">
            {{supplier.address}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-if="supplier.supplierTypeCode=='internalSupplier'">
          <el-form-item label="证件类型：" size="mini">
            {{checkedType("certificateType",supplier.certificateTypeId)}}
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="状态：" size="mini">
            {{checkedType("isValid",supplier.isValid)}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="supplier.supplierTypeCode=='internalSupplier'">
        <el-col>
          <!-- 表格 -->
          <el-form-item label="">
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
          <el-form-item label="备注：">
            {{supplier.remark}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="title">其他信息</div>
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
    <!-- 查看上传图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" append-to-body>
      <img :src="dialogImg" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    supplierCode: {
      type: String
    }
  },
  data() {
    return {
      activeName: 'first',
      dialogVisible: false,
      supplier: {
        supplierCode: '',
        supplierName: '',
        supplierKindCode: '',
        supplierTypeCode: '',
        supplierShortCall: '',
        contact: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        certificateTypeId: '',
        isValid: '',
        remark: ''
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
      supplierCategorysList: [],
      supplierBrandsList: [],
      supplierChannelRelations: [],
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
      dialogImg: '',
      showImg1: '',
      showImg2: '',
      showImg3: '',
      showImg4: '',
      showImg5: '',
      showImg6: '',
      proxyAptitude: {
        brandSubdivision: '品牌方',
        firstAgent: '一级代理',
        secondAgent: '二级代理',
        netGeneralAgent: '网络总代理',
        others: '其他'
      },
      countryMap: {}
    };
  },
  watch: {
    supplierCode(now, old) {
      if (now !== old) {
        this.initDataList();
      }
    }
  },
  methods: {
    initDataList() {
      // 初始化供应商信息
      if (this.supplierCode) {
        this.$AXIOS.LISTGET('/supplier/supplier/' + this.supplierCode).then(res => {
          this.supplier = res.result.supplier;
          this.supplierFinancialInfo = res.result.supplierFinancialInfo;
          this.supplierAfterSaleInfo = res.result.supplierAfterSaleInfo;
          if (res.result.certificate !== null) { this.certificate = res.result.certificate; }
          // this.supplierChannelRelations = res.result.supplierChannelRelations;
          this.getBatchUrl();
        });
        // 类目
        this.$AXIOS.LISTGET('/supplier/supplierCategorys', { supplierCode: this.supplierCode }).then(res => {
          this.supplierCategorysList = res;
        });
        // 品牌
        this.$AXIOS.LISTGET('/supplier/supplierBrands', { supplierCode: this.supplierCode }).then(res => {
          this.supplierBrandsList = res.result;
        });
        // 可见业务线
          this.$AXIOS.LISTGET('/supplier/channels', {supplierCode: this.supplierCode}).then(res => {
            let channelsObj = {};
            if (res.result.length > 0) {
              res.result.map((item, index) => {
                this.supplierChannelRelations.push(item.channelName);
              });
            }
          });
      }
    },
    intiCountry() {
      // 国家
        this.$AXIOS.LISTGET('/select/country').then(res => {
            res.result.map((item, index) => {
              this.countryMap[item.value] = item.name;
            });
        });
    },
    checkedType(type, val) {
      if (val) {
        return this.$utils.querydiction(type, val);
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handlePreview(file) {
      // 点击查看上传的图片
      this.dialogVisible = true;
      this.dialogImg = file;
    },
    checkAddress(pro, city, area) {
      return this.$utils.queryaddress(pro, city, area).join('-');
    },
    checkCountry(value) {
      while (this.countryMap === {}) {
      }
      if (this.countryMap[value]) { return this.countryMap[value]; }
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
  },
  mounted: function() {
    this.intiCountry();
    this.initDataList();
  }
};
</script>
<style lang="stylus" scoped>
.supplierdetail_component
  .title
    padding: 10px
    background-color: #f5f7fa
  .bottonGroup
    text-align: center
    padding-top: 50px
  .page
    text-align: right
    padding: 10px 0
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
      li:nth-child(3)
        width: 33%
      li.uploadLi
        display: flex
        justify-content: center
        align-items: center
    ul.head
      height: 40px
  .showImg
    img
      width: 40px
      cursor: pointer
      max-height: 40px
</style>

