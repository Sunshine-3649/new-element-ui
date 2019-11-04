<template>
  <div class="synckingdeemonitor">
    <div class="content">
      <p>
        <span class="title darkblue">累计应同步单据数</span>
        <span class="title darkblue">累计同步成功单据数</span>
        <span class="title darkblue">累计失败单据数</span>
        <span class="title lightblue">当天应同步单据数</span>
        <span class="title lightblue">当天同步成功单据数</span>
        <span class="title lightblue">当天同步失败单据数</span>
      </p>
      <p>
        <span class="title">{{countData.needSynSum}}</span>
        <span class="title">{{countData.needSynSuccessSum}}</span>
        <span class="title">{{countData.needSynFailSum}}</span>
        <span class="title">{{countData.needSynAtDay}}</span>
        <span class="title">{{countData.needSynSuccessAtDay}}</span>
        <span class="title">{{countData.needSynFailAtDay}}</span>
      </p>
    </div>
    <el-form
      label-width="120px"
      size="mini"
    >
      <el-row :span="24">
        <el-col :span="4">
          <el-form-item label="单据类型：">
            <el-select
              v-model="searchParams.trcOperateObject"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in trcOperateObjectList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="同步类型：">
            <el-select
              v-model="searchParams.status"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="单据编号：">
            <el-input
              v-model="searchParams.requestNo"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="首次同步时间：">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker
                  v-model="searchParams.startCreateTime"
                  :clearable='false'
                  type="date"
                  placeholder="开始日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2" >-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker
                  v-model="searchParams.endCreateTime"
                  type="date"
                  :clearable='false'
                  placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最后更新时间：">
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker
                  v-model="searchParams.startUpdateTime"
                  :clearable='false'
                  type="date"
                  placeholder="开始时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              style="text-align: center" :span="2" >-</el-col>
            <el-col :span="11">
              <el-form-item size="mini">
                <el-date-picker
                  v-model="searchParams.endUpdateTime"
                  type="date"
                  :clearable='false'
                  placeholder="结束时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="clear: both">
        <div class="group_btn">
          <el-button
                size="mini"
                type="primary"
                :disabled="orderDisabled"
                icon="circle-cross"
                @click="importExcel"
              >导出</el-button>
        </div>
        <div class="group_btn">
          <p style="line-height: 40px;color: red">说明：此菜单下展示的单据为同步金蝶云成功和失败的单据；若单据中存在过滤商品，则将会在单据中剔除过滤商品后，将剩余商品信息同步到金蝶。</p>
        </div>
        <div class="group_btn group_right">
          <el-button
              size="mini"
              type="primary"
              icon="search"
              @click="search"
            >查询</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="circle-cross"
              @click="resetForm"
            >重置</el-button>
        </div>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width:100%"
    >
    <el-table-column
      align="center"
      type="index"
      label='序号'
      width="50">
    </el-table-column>
      <el-table-column
        align="center"
        prop="trcOperateObjectDesc"
        label="单据类型"
        width="200"
      > </el-table-column>
      <el-table-column
        align="center"
        prop="requestNo"
        label="单据编号"
        width="200"
        show-overflow-tooltip
      > </el-table-column>
      <el-table-column
        align="center"
        prop="statusDesc"
        label="同步状态"
        width="150"
      > </el-table-column>
      <el-table-column
        align="center"
        prop=""
        label="备注"
        show-overflow-tooltip
      >
      <template slot-scope="scope">
        <div>
          <div v-if="scope.row.status === '1'">{{scope.row.msg }}</div>
          <div v-else>-</div>
        </div>
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="首次同步时间"
        width="150"
      > </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        label="最后更新时间"
        width="150"
      > </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1'" size="mini" type="text" @click="resetAgain(scope.row)">重试</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="page"
      style="text-align:right; padding: 10px 0;"
    >
      <el-pagination
        @size-change="changeSize"
        @current-change="changeNumber"
        :current-page="searchParams.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchParams.totalCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'synckingdeemonitor',
  data() {
    return {
      trcOperateObjectList: [
        {
          code: '',
          name: '全部'
        },
        {
          code: '5',
          name: '发货通知单'
        },
        {
          code: '7',
          name: '采购入库单'
        },
        {
          code: '8',
          name: '采购退货出库单'
        },
        {
          code: '9',
          name: '其他出库单'
        },
        {
          code: '10',
          name: '其他入库单'
        },
        {
          code: '11',
          name: '退货入库单'
        },
        {
          code: '12',
          name: '调拨出库单'
        },
        {
          code: '13',
          name: '调拨入库单'
        },
        {
          code: '14',
          name: '入库调整单'
        },
        {
          code: '15',
          name: '出库调整单'
        }
      ],
      statusList: [
        {
          code: '',
          name: '全部'
        },
        {
          code: '1',
          name: '同步失败'
        },
        {
          code: '2',
          name: '同步成功'
        }
      ],
      countData: {
        needSynSum: 0,
        needSynSuccessSum: 0,
        needSynFailSum: 0,
        needSynAtDay: 0,
        needSynSuccessAtDay: 0,
        needSynFailAtDay: 0
      }, // 同步返回的六个字段
      channelsList: [],
      orderDisabled: false,
      searchParams: {
        trcOperateObject: '',
        status: '',
        requestNo: '',
        startCreateTime: '',
        endCreateTime: '',
        startUpdateTime: '',
        endUpdateTime: '',
        pageNo: 1,
        pageSize: 10,
        start: 0,
        totalCount: 0
      },
      tableData: []
    };
  },
  mounted: function() {
    this.currentYear();
  },
  methods: {
    // 页码条数改变
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initData();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.initData();
    },
    search() {
      if (
        this.searchParams.startCreateTime &&
        this.searchParams.endCreateTime &&
        this.searchParams.startCreateTime > this.searchParams.endCreateTime
      ) {
        return this.$utils.messagetip.warningTip('首次同步开始时间不得大于结束时间');
      }
      if (
        this.searchParams.startUpdateTime &&
        this.searchParams.endUpdateTime &&
        this.searchParams.startUpdateTime > this.searchParams.endUpdateTime
      ) {
        return this.$utils.messagetip.warningTip('最后更新开始时间不得大于结束时间');
      }
      if (
        (new Date(this.searchParams.endCreateTime).getTime() - new Date(this.searchParams.startCreateTime).getTime()) > 2592000000
      ) {
        return this.$utils.messagetip.warningTip('首次同步开始时间与结束时间最大间隔为31天');
      }
      if (
        (new Date(this.searchParams.endUpdateTime).getTime() - new Date(this.searchParams.startUpdateTime).getTime()) > 2592000000
      ) {
        return this.$utils.messagetip.warningTip('最后更新开始时间与结束时间最大间隔为31天');
      }
      this.searchParams.pageNo = 1;
      this.initData();
    },
    resetForm() {
      for (let obj in this.searchParams) {
        this.searchParams[obj] = '';
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.totalCount = 0;
      this.searchParams.start = '0';
      this.currentYear();
    },
    resetAgain(row) {
      let params = {
        id: row.id
      };
      this.$AXIOS.PUT('/kingDeeMonitor/artificialRetry', params, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.initData();
        this.getCountData();
      });
    },
    importExcel() {
      if (!this.searchParams.startCreateTime) {
        return this.$utils.messagetip.warningTip('首次同步开始时间不能为空!');
      }
      if (!this.searchParams.endCreateTime) {
        return this.$utils.messagetip.warningTip('首次同步结束时间不能为空!');
      }
      if (
        this.searchParams.startCreateTime &&
        this.searchParams.endCreateTime &&
        this.searchParams.startCreateTime > this.searchParams.endCreateTime
      ) {
        return this.$utils.messagetip.warningTip('首次同步开始时间不得大于结束时间');
      }
      if (
        this.searchParams.startUpdateTime &&
        this.searchParams.endUpdateTime &&
        this.searchParams.startUpdateTime > this.searchParams.endUpdateTime
      ) {
        return this.$utils.messagetip.warningTip('最后更新开始时间不得大于结束时间');
      }
      if (
        (new Date(this.searchParams.endCreateTime).getTime() - new Date(this.searchParams.startCreateTime).getTime()) > 2592000000
      ) {
        return this.$utils.messagetip.warningTip('首次同步开始时间与结束时间最大间隔为31天');
      }
      if (
        (new Date(this.searchParams.endUpdateTime).getTime() - new Date(this.searchParams.startUpdateTime).getTime()) > 2592000000
      ) {
        return this.$utils.messagetip.warningTip('最后更新开始时间与结束时间最大间隔为31天');
      }
      if (!this.tableData.length) {
        return this.$utils.messagetip.warningTip('无数据!');
      }
      this.orderDisabled = true;
      let params = {
        trcOperateObject: this.searchParams.trcOperateObject,
        status: this.searchParams.status,
        requestNo: this.searchParams.requestNo,
        startCreateTime: this.searchParams.startCreateTime,
        endCreateTime: this.searchParams.endCreateTime,
        startUpdateTime: this.searchParams.startUpdateTime,
        endUpdateTime: this.searchParams.endUpdateTime
      };
      this.$AXIOS.EXPORT({url: '/kingDeeMonitor/export', data: params, fileName: '金蝶云单据监控'}).finally(() => {
        this.orderDisabled = false;
      });
    },
    initData() {
      this.$AXIOS
        .LISTGET('/kingDeeMonitor/monitor/page', this.searchParams)
        .then(res => {
          this.tableData = res.result;
          this.searchParams.totalCount = res.totalCount;
        });
      this.getCountData();
    },
    getCountData() {
      this.$AXIOS
        .GET('/kingDeeMonitor/summary')
        .then(res => {
          this.countData = res.result;
        });
    },
    // 默认查询当月信息
    currentYear() {
      let dateArr = new Date().toLocaleDateString().split('/');
      let date = new Date()
        .toLocaleDateString()
        .split('/')
        .join('-');
      dateArr[dateArr.length - 1] = '01';
      dateArr = dateArr.join('-');
      this.searchParams.startCreateTime = dateArr;
      this.searchParams.endCreateTime = date;
      this.initData();
    }
  }
};
</script>
<style lang="stylus" scoped>
.synckingdeemonitor
  .content
    margin-bottom 15px
    font-weight 600
    font-size 20px
    p
      width 75%
      margin 0 auto
      .title
        width: 220px
        display inline-block
        border solid #ccc 1px
        line-height 50px
        text-align center
        margin-right -7px
      .darkblue
        background rgb(102, 153, 255)
      .lightblue
        background rgb(153, 204, 204)
  .group_btn
    display inline-block
    margin-bottom 10px
  .group_right
    float right
  </style>

