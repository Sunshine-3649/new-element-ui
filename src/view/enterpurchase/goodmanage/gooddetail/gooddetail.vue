<template>
  <div class="gooddetail">
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
              <span class="title">商品类目：</span>
              <span class="desc">{{ goodDetail.firstCategoryName }}>{{ goodDetail.secondCategoryName }}>{{ goodDetail.thirdCategoryName }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">商品名称：</span>
              <span class="desc">{{goodDetail.name}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">状态管理：</span>
              <span class="desc">{{goodDetail.isValidStr}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">商品品牌：</span>
              <span class="desc">{{goodDetail.brandName}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">SPU编号：</span>
              <span class="desc">{{goodDetail.spuCode}}</span>
              <copy :msg="goodDetail.spuCode"></copy>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">货号：</span>
              <span class="desc">{{goodDetail.itemNo}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">商品重量：</span>
              <span class="desc">-</span>
              <!-- <span class="desc">{{goodDetail.weight}}</span> -->
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">生产商：</span>
              <span class="desc">{{goodDetail.producer}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">是否具有保质期管理：</span>
              <span class="desc">{{goodDetail.isQuality}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="title">添加时间：</span>
              <span class="desc">{{goodDetail.createTime}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row class="info_row">
          <el-col :span="12" v-for="(item, key) in goodDetail.dynamicProperties" :key="key">
            <p>
              <span class="title">{{key}}：</span>
              <span class="desc">{{item}}</span>
            </p>
          </el-col>
        </el-row>
        <!-- 第七行 -->
        <el-row class="info_row">
          <el-col :span="12">
            <p>
              <span class="title">备注：</span>
              <span class="desc">{{goodDetail.remark}}</span>
            </p>
          </el-col>

        </el-row>
      </section>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售属性信息</span>
      </div>
      <!-- 表格 -->
      <el-table ref="detaiTable" :data="goodDetail.skuVOList" border style="width: 100%" align="center">
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
        <el-table-column prop="skuCode" label="SKU编号" align="center"></el-table-column>
        <el-table-column prop="specInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="barCode" label="商品条码" align="center"></el-table-column>
        <el-table-column prop="isValidStr" label="供应状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.isValid === '0'" @click="toggleSupplyStatus(scope.row.skuCode, scope.row.isValid)">开放供应</el-button>
            <el-button size="mini" type="text" v-if="scope.row.isValid === '1'" @click="toggleSupplyStatus(scope.row.skuCode, scope.row.isValid)">停止供应</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <!-- 主图 -->
      <el-row class="main_images">
        <el-col :span="2" class="title">
          主&nbsp;&nbsp;&nbsp;&nbsp;图：
        </el-col>
        <el-col :span="19">
          <el-col :span="3" v-for="(data, index) in goodDetail.mainPictureList" :key="index" class="content">
            <div class="img_wrapper">
              <img :src="goodDetail.domain + '/' + data" class="image">
            </div>
          </el-col>
        </el-col>
        <el-col :span="3" >
          <downloadzip :imgList='goodDetail.mainPictureList' :domain="goodDetail.domain" name="主图">下载所有主图</downloadzip>
        </el-col>
      </el-row>
      <!-- 规格图 -->
      <el-row class="main_images">
        <el-col :span="2" class="title">
          规格图：
        </el-col>
        <el-col :span="19">
          <el-col :span="3" v-for="(data, index) in goodDetail.skuPicList" :key="index" class="content">
            <div class="img_wrapper">
              <img :src="goodDetail.domain + '/' + data" :alt="data.fileKey" class="image">
            </div>
          </el-col>
        </el-col>
        <el-col :span="3" >
          <downloadzip :imgList='goodDetail.skuPicList' :domain="goodDetail.domain" name="规格图">下载所有规格图</downloadzip>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑 -->
    <div class="btn">
      <el-button @click="back" size="mini">返回</el-button>
    </div>
    <!-- 停止供应 -->
    <!-- <div class="btn">
      <el-button type="primary">停止供应</el-button>
    </div> -->
    <!-- 操作日志弹窗 -->
    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId" :params="operateParams" :isRefresh="isRefresh"></operate-table>
    </el-dialog>
  </div>
</template>

<script>
import copy from 'components/copy';
import downloadzip from 'components/downloadzip';
import operateTable from 'components/operateTable';
export default {
  name: 'gooddetail',
  components: {
    copy,
    downloadzip,
    operateTable
  },
  data() {
    return {
      operateParams: {
        entityType: 'BusiItems',
        entityId: ''
      }, // 日志
      isLogInfo: false, // 日志弹窗
      skuCodeList: [], // sku状态更改列表
      goodDetail: {}, // 列表项详情
      spuCode: '', // 列表传过来的参数
      SPUPictureUrl: [], // 主图图片地址
      SKUPictureUrl: [], // 规格图片地址
      isRefresh: 0  // 是否刷新数据
    };
  },
  methods: {
    // 获取详情
    initDataDetail() {
      this.GET(`/busiItems/queryItemsInfo/${this.spuCode}`).then(res => {
        if (res.code === '200') {
          this.goodDetail = res.body;
          this.operateParams.entityId = res.body.id;
          if (this.goodDetail.skuVOList.length) {
            setTimeout(() => {
              this.$refs.detaiTable.setCurrentRow(this.goodDetail.skuVOList[0]);
            }, 20);
          }
          if (
            this.goodDetail.pictrue &&
            this.goodDetail.pictrue.indexOf(',') > -1
          ) {
            this.goodDetail.pictrueList = this.goodDetail.pictrue.split(',');
          } else if (this.goodDetail.pictrue) {
            this.goodDetail.pictrueList = [];
            this.goodDetail.pictrueList.push(this.goodDetail.pictrue);
          } else {
            this.goodDetail.pictrueList = [];
          }
          if (
            this.goodDetail.mainPicture &&
            this.goodDetail.mainPicture.indexOf(',') > -1
          ) {
            this.goodDetail.mainPictureList = this.goodDetail.mainPicture.split(
              ','
            );
          } else if (this.goodDetail.mainPicture) {
            this.goodDetail.mainPictureList = [];
            this.goodDetail.mainPictureList.push(this.goodDetail.mainPicture);
          } else {
            this.goodDetail.mainPictureList = [];
          }
        }
        console.log(this.goodDetail);
      });
    },
    // 更新sku级别状态
    updateSkuIsvalid(isValid) {
      const params = {
        isValid: isValid,
        skuCodeList: this.skuCodeList
      };
      this.POST('/busiSkusManage/updateSkuIsvalid', params).then(res => {
        if (res.code === '200') {
          this.initDataDetail();
          this.$utils.messagetip.successTip('更改状态成功');
        }
      });
    },
    // 操作日志弹窗关闭
    closeOperate() {
      this.isLogInfo = false;
    },
    // 打开操作明细的弹窗
    openOperateDialog() {
        this.isRefresh += 1;
        this.isLogInfo = true;
    },
    // 改变供应状态
    toggleSupplyStatus(skuCode, isValid) {
      let isResult = ''; // 对应的中文
      isValid = isValid === '0' ? '1' : '0';
      // 重置入参
      this.skuCodeList = [];
      this.skuCodeList.push(skuCode);
      if (isValid === '1') {
        isResult = '开放';
      } else {
        isResult = '停止';
      }
      this.$confirm(`${isResult}供应选中的商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateSkuIsvalid(isValid);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消删除');
        });
    },
    back() {
      this.$router.back();
    }
  },

  mounted: function() {
    this.spuCode = this.$route.params.id;
    this.initDataDetail();
  }
};
</script>

<style lang="stylus" scoped>
img
  width 100%
  height 100%
  display inline-block
.gooddetail
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
    line-height: 40px
    padding-left: 20px
    background-color: rgb(242, 242, 242)
  .main_images
    margin-top: 30px
    margin-bottom: 15px
    .title
      text-align: right
      line-height: 40px
      font-weight: 500
    .img_wrapper
      width: 100px
      height: 100px
      margin: 0 auto
      overflow: hidden
    .content
      margin-bottom 20px
</style>
