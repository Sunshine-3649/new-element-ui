<template>
  <div class="ownermanage">
    <div class="title">[ {{searchParams.warehouseName}} ] 货主管理</div>
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <div class="tip" v-if="searchParams.ownerWarehouseState !== '通知成功'">！注意：通知仓库状态非“通知成功”的①无法在“仓库信息管理->商品管理”中添加商品②无法在"采购管理->采购单管理"创建采购单时选择该仓库！</div>
      <el-form
        :model="searchParams"
        :rules="rules"
        ref="searchParams"
        label-width="125px"
        class="search_form"
        size="medium"
      >
        <!-- 第一行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="货主ID："
              prop="ownerId"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.ownerId"
                :maxlength="100"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="货主名称："
              prop="ownerName"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.ownerName"
                maxlength="50"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="仓库货主ID："
              prop="warehouseOwnerId"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.warehouseOwnerId"
                maxlength="50"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="备注："
              prop="remark"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.remark"
                type="textarea"
                :rows="3"
                placeholder=""
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="通知仓库状态："
              size="mini"
            >
              <span style="line-height: 28px">{{searchParams.ownerWarehouseState}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="btn_group">
      <el-button size="mini" type="primary" v-if="isShowWarehouse">
        通知仓库
      </el-button>
      <el-button
        size="mini"
        type="primary"
        @click="getWarehouseList"
        v-if="searchParams.isNoticeSuccess === 0"
      >保存</el-button>
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
    </div>
    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <el-table :data="logInfoList" style="width: 100%" border height="400">
        <el-table-column prop="operation" label="动作" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
        <el-table-column prop="operateTimeString" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button type="primary" size="mini" @click="isLogInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'ownermanage',
    data() {
      return {
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'WarehouseOwner',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      searchParams: {},
      rules: {
        ownerName: [
          { required: true, message: '货主名称不能为空！', trigger: 'blur' }
        ],
        warehouseOwnerId: [
          { required: true, message: '仓库货主ID不能为空！', trigger: 'blur' }
        ]
      }
      };
    },
    computed: {
      isShowWarehouse() {
        let isShow = false;
        if ((this.searchParams.ownerWarehouseState === '通知失败' || this.searchParams.ownerWarehouseState === '待通知') && this.searchParams.isNoticeSuccess === 1 ) {
          isShow = true;
        }
        return isShow;
      }
    },
    created() {
      console.log(this.$route.query);
      let ownerData = JSON.parse(window.sessionStorage.owner_data);
      this.operateParams.entityId = ownerData.id;
      this.searchParams = ownerData;
    },
    methods: {
      getWarehouseList() {
        if (!this.searchParams.ownerName) {
          this.$utils.messagetip.warningTip('货主名称不能为空！');
          return;
        }
        if (!this.searchParams.warehouseOwnerId) {
          this.$utils.messagetip.warningTip('仓库货主ID不能为空！');
          return;
        }
        this.save();
      },
      // 新增仓库保存
      save() {
        let params = {};
        params.ownerId = this.searchParams.ownerId;
        params.ownerName = this.searchParams.ownerName;
        params.warehouseOwnerId = this.searchParams.warehouseOwnerId;
        params.remark = this.searchParams.remark;
        params.id = this.searchParams.id;
        params.warehouseId = '';
        this.$AXIOS.PUT('/warehouseInfo/ownerInfo/' + params.id, params).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.$router.push({ path: '/storeinfomanage' });
        });
      },
      openOperateDialog() {
        this.getLogInfo();
        this.isLogInfo = true;
      },
      // 获取日志信息
      getLogInfo() {
        this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
          this.logInfoList = res.result;
          this.logCount = res.totalCount;
        });
      },
      // 页码条数改变
      logChangeSize(val) {
        this.operateParams.start = 0;
        this.operateParams.pageNo = 1;
        this.operateParams.pageSize = val;
        this.getLogInfo();
      },
      // 当前页码改变
      logChangeNumber(val) {
        this.operateParams.pageNo = val;
        this.operateParams.start = (val - 1) * this.operateParams.pageSize;
        this.getLogInfo();
      },
      // 返回按钮
      back() {
        this.$router.push({ path: '/storeinfomanage' });
      }
    }
  };
</script>
<style lang="stylus" scoped>
.ownermanage
  .title
    line-height 40px
    margin-bottom 15px
    padding-left 15px
    background-color: #f5f5f5;
    color: #333333;
    border: 0;
  .tip
    color: #CC6600
    border solid 1px #CC6600
    margin-bottom 20px
    padding-left 20px
    border-radius  5px
    line-height 30px
  .btn_group
    width 40%
    text-align center
    margin-top 15px
  .paging
    margin: 15px 0
    text-align: right
</style>
