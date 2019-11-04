<template>
  <div class="lineaddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>修改属性</span>
        <el-button
          v-if="id && id !== 'add'"
          style="float: right; padding: 3px 0"
          type="text"
          @click="openOperateDialog"
        >操作日志</el-button>
      </div>
      <!-- 第一行 -->
      <el-row
        :span="22"
        v-if="this.$route.params.id !== 'add'"
      >
        <el-col :span="2" class="title tip_red">业务线编号：</el-col>
        <el-col :span="7" class="content">{{searchParams.code ? searchParams.code : '保存后系统自动生成'}}</el-col>
      </el-row>
      <!-- 第一行 -->
      <el-row :span="22">
        <el-col :span="2" class="title tip_red">业务线名称：</el-col>
        <el-col :span="7" class="content">
          <el-input
            v-model.trim="searchParams.name"
            maxlength="100"
            placeholder=""
            size="mini"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :span="22">
        <el-col :span="2" class="title tip_red">业务销售渠道：</el-col>
        <el-col :span="20" >
          <el-checkbox-group v-model="checkList">
            <el-checkbox style="width: 140px; margin-left: 0" class="text_hide" v-for="(item, i) in storeCorrespondChannelList" :key="i" :label="item.sellCode" >
              <el-tooltip v-if="item.sellName.toString().length > 10" class="item" effect="dark" :content="item.sellName" placement="top">
                <span >{{item.sellName}}</span>
              </el-tooltip>
              <span v-else>{{item.sellName}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row :span="22" style="margin-top: 15px;">
        <el-col :span="2" class="title">备注：</el-col>
        <el-col :span="7" >
          <el-input
            v-model.trim="searchParams.remark"
            type="textarea"
            :rows="3"
            placeholder=""
            maxlength="300"
          ></el-input>
        </el-col>
      </el-row>
    </el-card>

    <div class="btn_group">
      <el-button
        size="mini"
        type="primary"
        :disabled="isClick"
        @click="getWarehouseList"
      >保存</el-button>
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
    </div>
    <!-- 操作日志弹窗 -->
    <el-dialog
      title="操作日志"
      :visible.sync="isLogInfo"
      width="80%"
    >
      <el-table
        :data="logInfoList"
        style="width: 100%"
        border
        height="400"
      >
        <el-table-column
          prop="operation"
          label="动作"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operateTimeString"
          label="操作时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        >
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination
          @size-change="logChangeSize"
          @current-change="logChangeNumber"
          :current-page="operateParams.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="operateParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logCount"
        >
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button
          type="primary"
          size="mini"
          @click="isLogInfo = false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { pca, pcaa } from 'area-data'; // v5 or higher
// import returnreceiptVue from '../../../../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
  name: 'lineaddoredit',
  data() {
    return {
      isClick: false, // 重复点击
      storeCorrespondChannelList: [], // 销售渠道列表
      checkList: [], // 多选框选中的
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'Channel',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      id: '', // 主键
      selected: [],
      searchParams: {
        code: '', // 编号
        name: '', // 名称
        remark: '' // 备注
      }
    };
  },
  created() {
    if (this.$route.params.id !== 'add') {
      this.id = this.$route.params.id;
      this.getSearchParams();
      this.operateParams.entityId = this.id;
    }
    this.getStoreCorrespondChannelList(); // 获取销售渠道
  },
  filters: {
    tofixed(val) {
      let num = val.toString();
      if (num.indexOf('.') > -1 && num.split('.')[1].length > 4) {
        num = Number(num).toFixed(4);
        return num;
      }
      return num;
    }
  },
  methods: {
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
    // 实时查询业务线名称
    onBlur() {
      this.$AXIOS
        .GET('/system/channel', { name: this.searchParams.name })
        .then(res => {
          console.log(res);
        });
    },
    // 查询仓库
    getWarehouseList() {
      if (!this.searchParams.name) {
        this.$utils.messagetip.warningTip('业务线名称不能为空！');
        return;
      }
      if (this.checkList && !this.checkList.length) {
        this.$utils.messagetip.warningTip('请选择业务销售渠道！');
        return;
      }
      this.isClick = true;
      this.$AXIOS
        .GET('/system/channel', { name: this.searchParams.name })
        .then(res => {
          if (this.searchParams.code) {
            this.updateSave();
          } else {
            this.save();
          }
        });
    },
    // 新增仓库保存
    save() {
      let params = {};
      params.name = this.searchParams.name;
      params.sellChannel = this.checkList.join();
      params.remark = this.searchParams.remark;
      this.$AXIOS.POST('/system/channel', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/linemanage' });
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 更新业务线
    updateSave() {
      let params = {};
      params.code = this.searchParams.code;
      params.name = this.searchParams.name;
      params.sellChannel = this.checkList.join();
      params.id = this.searchParams.id;
      params.remark = this.searchParams.remark;
      this.$AXIOS
        .PUT('/system/channel/' + params.id, params)
        .then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          this.$router.push({ path: '/linemanage' });
        }).finally(() => {
        this.isClick = false;
      });
    },
    // 销售渠道
    getStoreCorrespondChannelList() {
      this.$AXIOS.GET('/system/channelList').then(res => {
        this.storeCorrespondChannelList = res.result;
      });
    },
    // 获取业务线绑定渠道列表
    getSearchParams() {
      this.$AXIOS.GET('/system/channelInSellChannel/' + this.id).then(res => {
        this.searchParams = res.result;
        this.searchParams.sellChannelList.forEach(item => {
          this.checkList.push(item.sellCode);
        });
      });
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/linemanage' });
    }
  }
};
</script>
<style lang="stylus" scoped>
.lineaddoredit
  .title, .content
    display: inline-block
    line-height 23px
  .title
    width: 150px
    text-align: right
    text-align right
    vertical-align top
  .content
    height: 47px
    overflow-y: auto
  .btn_group
    width: 50%
    margin-top: 15px
    text-align: center
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: yellow
    color: red
    text-align: center
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
</style>
<style lang='stylus'>
.lineaddoredit
  .btn_group
    width: 50%
    margin-top: 15px
    text-align: center
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: yellow
    color: red
    text-align: center
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
</style>

