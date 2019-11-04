<template>
  <div class="managedetail">
    <!-- 基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <section class="info">
        <!-- 第一行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">用户ID:</span>
              <span class="desc">{{ tableData.distributorCode }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">登录账号：</span>
              <span class="desc">{{ tableData.loginAccount }}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">公司全称：</span>
              <span class="desc">{{ tableData.companyName }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">公司简称：</span>
              <span class="desc">{{ tableData.companyAbbreviation }}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">分销商状态：</span>
              <span class="desc">{{ tableData.isValid == 0 ? '停用' : '启用' }}</span>
            </p>
          </el-col>
          <el-col :span="12">
           <p>
            <span class="title">地址信息：</span>
            <span class="desc">{{ tableData.province + "-" + tableData.city + "-" + tableData.area +' '+ tableData.address}} </span>
          </p>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">联系人：</span>
              <span class="desc">{{ tableData.contact }}</span>
            </p>
          </el-col>
          <el-col :span="12">
           <p>
            <span class="title">手机号码：</span>
            <span class="desc">{{ tableData.mobile }}</span>
          </p>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">固定电话：</span>
              <span class="desc">{{ tableData.phone }}</span>
            </p>
          </el-col>
          <el-col :span="12">
           <p>
              <span class="title">更新人：</span>
              <span class="desc">{{ tableData.updateOperator }}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">更新时间：</span>
              <span class="desc">{{ tableData.updateTime }}</span>
            </p>
          </el-col>
          <el-col :span="12">
           <p>
              <span class="title">备注：</span>
              <span class="desc">{{ tableData.memo }}</span>
            </p>
          </el-col>
        </el-row>
      </section>
    </el-card>
    <!-- 开票信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>开票信息</span>
      </div>
      <section class="info">
        <p>
          <span class="title">单位名称：</span>
          <span class="desc">{{ tableData.invoiceTitle }}</span>
        </p>
        <p>
          <span class="title">纳税人识别号：</span>
          <span class="desc">{{ tableData.invoiceTaxpayerIdentifiNumber }}</span>
        </p>
        <p>
          <span class="title">地址：</span>
          <span class="desc">{{ tableData.invoiceAddress }}</span>
        </p>
        <p>
          <span class="title">电话：</span>
          <span class="desc">{{ tableData.invoicePhone }}</span>
        </p>
        <p>
          <span class="title">银行账号：</span>
          <span class="desc">{{ tableData.invoiceBankAccount }}</span>
        </p>
        <p>
          <span class="title">开户行：</span>
          <span class="desc">{{ tableData.invoiceBank }}</span>
        </p>
      </section>
    </el-card>
    <!-- 资质信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资质信息</span>
      </div>
      <!-- 表格 -->
      <div class="msgWrap">
        <ul class="head">
          <!-- <li>序号</li> -->
          <li>证件类型</li>
          <li>证件号</li>
          <li>证件有效期</li>
          <li>证件图片</li>
          <li>更新时间</li>
        </ul>
        <div v-if="tableData.multiCertificateCombinePic ? false : true">
          <ul class="body">
            <!-- <li>1</li> -->
            <li>营业执照</li>
            <li>{{ tableData.businessLicence }}</li>
            <li v-if="tableData.businessLicenceIsLongtime == 0">{{ tableData.businessLicenceStartDate }} - {{ tableData.businessLicenceEndDate }}</li>
            <li v-else>长期</li>
            <li>
              <el-button size="mini" @click="lookImg(tableData.businessLicencePic)" type="text">查看</el-button>
              <el-button size="mini" type="text">
                <a target="_blank" download="" :href="tableData.domain+'/'+tableData.businessLicencePic">下载</a>
              </el-button>
            </li>
            <li>{{ tableData.certUpdateTimeStr }}</li>
          </ul>
          <ul class="body">
            <!-- <li>2</li> -->
            <li>组织机构代码证</li>
            <li>{{ tableData.organRegistraCodeCertificate }}</li>
            <li v-if="tableData.multiCertificateIsLongtime == 0">{{ tableData.organRegistraStartDate }} - {{ tableData.organRegistraEndDate }}</li>
            <li v-else>长期</li>
            <li>
              <el-button size="mini" @click="lookImg(tableData.organRegistraCodeCertificatePic)" type="text">查看</el-button>
              <el-button size="mini" type="text">
                <a target="_blank" download="" :href="tableData.domain+'/'+tableData.organRegistraCodeCertificatePic">下载</a>
              </el-button>
            </li>
            <li>{{ tableData.certUpdateTimeStr }}</li>
          </ul>
          <ul class="body">
            <!-- <li>3</li> -->
            <li>税务登记证</li>
            <li>{{ tableData.taxRegistrationCertificate }}</li>
            <li v-if="tableData.taxRegistrationIsLongtime  == 0">{{ tableData.taxRegistrationStartDate }} - {{ tableData.taxRegistrationEndDate }}</li>
            <li v-else>长期</li>
            <li>
              <el-button size="mini" @click="lookImg(tableData.taxRegistrationCertificatePic)" type="text">查看</el-button>
              <el-button size="mini" type="text">
                <a target="_blank" download="" :href="tableData.domain+'/'+tableData.taxRegistrationCertificatePic">下载</a>
              </el-button>
            </li>
            <li>{{ tableData.certUpdateTimeStr }}</li>
          </ul>
        </div>

        <ul v-else class="body">
          <!-- <li>1</li> -->
          <li>多证合一</li>
          <li>{{ tableData.multiCertificateCombineNo }}</li>
          <li v-if="tableData.multiCertificateIsLongtime == 0">{{ tableData.idCardEndDate }} - {{ tableData.idCardStartDate }}</li>
          <li v-else>长期</li>
          <li>
            <el-button size="mini" @click="lookImg(tableData.multiCertificateCombinePic)" type="text">查看</el-button>
            <el-button size="mini" type="text">
              <a target="_blank" download="" :href="tableData.domain+'/'+tableData.multiCertificateCombinePic">下载</a>
            </el-button>
          </li>
          <li>{{ tableData.certUpdateTimeStr }}</li>
        </ul>
        <ul class="body">
          <!-- <li>4</li> -->
          <li>法人身份证</li>
          <li>{{ tableData.legalPersonIdCard }}</li>
          <li v-if="tableData.taxRegistrationIsLongtime  == 0">{{ tableData.taxRegistrationStartDate }} - {{ tableData.taxRegistrationEndDate }}</li>
          <li v-else>长期</li>
          <li>
            <el-button size="mini" @click="lookImg(tableData.legalPersonIdCardPic1)" type="text">查看正面</el-button>
            <el-button size="mini" @click="lookImg(tableData.legalPersonIdCardPic2)" type="text">查看反面</el-button>
            <el-button size="mini" type="text">
              <a target="_blank" download="" :href="tableData.domain+'/'+tableData.legalPersonIdCardPic1">正面下载</a>
            </el-button>
            <el-button size="mini" type="text">
              <a target="_blank" download="" :href="tableData.domain+'/'+tableData.legalPersonIdCardPic2">反面下载</a>
            </el-button>
            <li>{{ tableData.certUpdateTimeStr }}</li>
        </ul>
      </div>
    </el-card>
    <!-- 策略信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>策略信息</span>
      </div>
      <p class="tactics">
        <span class="title">定价计划：</span>
        <span class="desc">{{tableData.pricePlanName}}</span>
      </p>
    </el-card>

    <!-- 查看图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <img :src="dialogImg" />
      <img v-show="legalPersonIdCardPic2 ? true : false" :src="legalPersonIdCardPic2" />
    </el-dialog>

    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button size="mini" @click="toManageRedit" type="primary">编辑</el-button>
      <el-button size="mini" type="primary" @click="stopUse">{{ tableData.isValid == 0 ? '启用' : '停用'}}</el-button>
      <el-button size="mini" @click="toDistributormanage">返回</el-button>
    </div>

  </div>
</template>

<script>
import operateTable from 'components/operateTable';

export default {
  name: 'managedetail',
  data() {
    return {
      port: 'first',
      tableData: [],
      id: this.$route.params.id,
      dialogVisible: false,
      dialogVisibleTable: false, // 操作日志弹窗
      dialogImg: '', // 其他证件图片和省份证正面
      legalPersonIdCardPic2: '', // 身份证反面图片
      operateData: [],
      operateParams: {
        entityType: 'BusiDistributor',
        entityId: ''
      },
      isRefresh: 0  // 是否刷新数据
    };
  },
  components: {
    operateTable
  },
  methods: {
    toDistributormanage() {
      this.$router.back();
    },
    // 改变供应状态
    toggleSupplyStatus() {},
    // 切换移动端和桌面端显示
    togglePort() {},
    // 获取分销商详情数据
    initData(data) {
      this.GET(`/busiDistributor/queryDistributorDetails/${data}`).then(res => {
        for (let data in res.body) {
          if (res.body[data] === null || res.body[data] === undefined || res.body[data] === '') {
            if (data === 'multiCertificateCombinePic') { // 判断选择的是普通证件还是多证合一
              continue;
            } else {
              res.body[data] = '-';
            }
          }
        }
        this.tableData = res.body;
        this.operateParams.entityId = res.body.id;
      });
    },
    // 停启用
    stopUse() {
      let isValid, msg;
      if (this.tableData.isValid === '0') {
        isValid = '1';
        msg = '启用成功';
      } else if (this.tableData.isValid === '1') {
        isValid = '0';
        msg = '停用成功';
      }
      this.GET(
        `/busiDistributor/updateDistributorSataus/${
          this.tableData.distributorCode
        }/${isValid}/${this.tableData.id}`
      ).then(res => {
        this.$utils.messagetip.successTip(msg);
        this.initData(this.id);
      });
    },
    // 查看图片
    lookImg(imgSrc) {
      let img;
      if (imgSrc) {
        img = this.tableData.domain + '/' + imgSrc;
      } else {
        img =
          'http://bpic.588ku.com/element_origin_min_pic/18/06/10/9f4e4820ed3601de89f318447fabeed6.jpg';
      }
      this.dialogImg = img;
      this.dialogVisible = true;
    },
    // 打开操作明细的弹窗
    openOperateDialog() {
        this.isRefresh += 1;
        this.dialogVisibleTable = true;
    },
    // 操作日志弹窗关闭
    closeOperate() {
      this.dialogVisibleTable = false;
    },
    // 前往编辑
    toManageRedit() {
      this.$router.push({
        name: 'manageaddoredit',
        params: { id: this.tableData.distributorCode }
      });
    }
  },
  mounted: function() {
    this.initData(this.id);
  }
};
</script>

<style lang="stylus" scoped>
.managedetail
  font-size: 12px
  .box-card
    margin-bottom: 15px
  .info
    p
      line-height: 26px
      .title
        font-weight: 700
  .btn
    text-align: center
    line-height: 60px
    background-color: rgb(242, 242, 242)
  .name
    font-weight: 700
    font-size: 18px
    line-height: 40px
    padding-left: 20px
    background-color: rgb(242, 242, 242)
    margin-top: 15px
  .main_images
    margin-top: 30px
    margin-bottom: 15px
    .title
      text-align: right
      line-height: 40px
      font-size: 22px
      font-weight: 500
  .tactics
    line-height: 60px
    padding-left: 20px
  .msgWrap
    border: 1px solid #ebeef5
    border-bottom: 0
    margin: 10px 0
    ul
      display: flex
      border-bottom: 1px solid #ebeef5
      align-items: center
      li
        width: 20%
        text-align: center
        height: 40px
        line-height: 40px
        border-right: 1px solid #ebeef5
</style>

