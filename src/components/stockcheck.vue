<template>
  <div>
     <!-- 库存详情弹窗 -->
    <el-dialog
      title="库存详情"
      :visible.sync="stockDetail"
      width="80%"
      :close-on-click-modal='false'
      v-loading='isLoading'
      :show-close='false'
      class="stock-detail"
    >
      <el-row class="stock-origin">
        <span>来源：</span>
        <el-select
          v-model="dataSource"
          @change="changeSource"
          size="mini"
        >
          <el-option
            label="SCM"
            value="1"
          >
          </el-option>
          <el-option
            label="WMS"
            value="2"
          >
          </el-option>
        </el-select>
      </el-row>
      <span class="the-typeof-stock">库存类型：</span>
      <el-tabs
        v-model="activeName"
        label="库存类型"
        @tab-click="handleClick"
        class="el-tabs-stock"
      >
        <el-tab-pane
          label="正品"
          name="first"
        >
          <el-table
            ref="tableMainFirst"
            :data="tableRowList"
            highlight-current-row
          >
            <el-table-column
              type="index"
              label="库存名称"
              align="right"
              class="name-of-ware"
              width="200"
            >
              <el-table-column
                prop="warehouseName"
                label="仓库名称"
                align="left"
                width="200"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              prop="realInventory"
              label="正品_真实总库存"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.isSumInventory || stockDetailParams.dataSource !== 1">
                  {{ scope.row.realInventory }}
                </div>
                <div
                  v-else-if='scope.row.shopFlag'
                >
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                  </div>
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;color:#409EFF; cursor:pointer;border-right: 1px solid #ebeef5"  @click="toStockdetail(scope.row.warehouseCode,scope.row.warehouseName, 8, false)">{{ scope.row.realInventoryForShopSpect }}</span>
                    <span style="display: inline-block; width: 50%;color:#409EFF; cursor:pointer"  @click="toStockdetail(scope.row.warehouseCode,scope.row.warehouseName, 1, false)">{{ scope.row.realInventory }}</span>
                  </div>
                </div>
                <div v-else style="display: inline-block; width: 100%;color:#409EFF; cursor:pointer"  @click="toStockdetail(scope.row.warehouseCode,scope.row.warehouseName, 1, true)">{{ scope.row.realInventory }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="availableInventory"
              label="正品_可用库存"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.isSumInventory && stockDetailParams.dataSource !== 1">
                  {{ scope.row.availableInventory }}
                </div>
                <div
                  v-else-if='scope.row.shopFlag'
                >
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                  </div>
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">{{ scope.row.availableInventoryForShopSpect }}</span>
                    <span style="display: inline-block; width: 50%;">{{ scope.row.availableInventory }}</span>
                  </div>
                </div>
                <div v-else>{{ scope.row.availableInventory }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="stockDetailParams.dataSource === 1"
              prop="frozenInventory"
              label="正品_冻结库存"
              align="center"
            >
              <template slot-scope="scope">
                <div
                  v-if='scope.row.shopFlag'
                >
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                  </div>
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                    <span style="display: inline-block; width: 50%;">{{ scope.row.frozenInventory }}</span>
                  </div>
                </div>
                <div v-else-if='scope.row.warehouseName === "总计" && scope.row.frozenInventory > 0' @click='showDetailClick' style='color: blue;cursor: pointer;text-decoration: underline;' >{{ scope.row.frozenInventory }}</div>
                <div v-else>{{ scope.row.frozenInventory }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="stockDetailParams.dataSource === 1"
              prop="transitInventory"
              label="正品_在途库存"
              align="center"
            ></el-table-column>
            <el-table-column
              v-if="stockDetailParams.dataSource === 1"
              prop="lockTnventory"
              label="正品_锁定库存"
              align="center"
              show-overflow-tooltip
            >
              <el-table-column
                prop="lockingInventoryTotal"
                label="总计"
                align="center"
              >
              <template slot-scope="scope">
                <div
                  v-if='scope.row.shopFlag'
                >
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                    <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                  </div>
                  <div style="display: flex;">
                    <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                    <span style="display: inline-block; width: 50%;">{{ scope.row.lockingInventoryTotal }}</span>
                  </div>
                </div>
                <div v-else>{{ scope.row.lockingInventoryTotal }}</div>
              </template>
              </el-table-column>
              <el-table-column
                prop="lockingInventory1"
                label="销售锁定"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-if='scope.row.shopFlag'
                  >
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                    </div>
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                      <span style="display: inline-block; width: 50%;">{{ scope.row.lockingInventory1 }}</span>
                    </div>
                  </div>
                  <div v-else>{{ scope.row.lockingInventory1 }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="lockingInventory2"
                label="调拨锁定"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-if='scope.row.shopFlag'
                  >
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                    </div>
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                      <span style="display: inline-block; width: 50%;">{{ scope.row.lockingInventory2 }}</span>
                    </div>
                  </div>
                  <div v-else>{{ scope.row.lockingInventory2 }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="lockingInventory3"
                label="退供锁定"
                align="center"
              >
                <template slot-scope="scope">
                    <div
                      v-if='scope.row.shopFlag'
                    >
                      <div style="display: flex;">
                        <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                        <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                      </div>
                      <div style="display: flex;">
                        <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                        <span style="display: inline-block; width: 50%;">{{ scope.row.lockingInventory3 }}</span>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.lockingInventory3 }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="lockingInventory4"
                label="其他锁定"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-if='scope.row.shopFlag'
                  >
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5;border-right: 1px solid #ebeef5">门店专用</span>
                      <span style="display: inline-block; width: 50%;border-bottom: 1px solid #ebeef5">渠道共享</span>
                    </div>
                    <div style="display: flex;">
                      <span style="display: inline-block; width: 50%;border-right: 1px solid #ebeef5">-</span>
                      <span style="display: inline-block; width: 50%;">{{ scope.row.lockingInventory4 }}</span>
                    </div>
                  </div>
                  <div v-else>{{ scope.row.lockingInventory4 }}</div>
              </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="残品"
          name="second"
        >
          <el-table
            ref="tableMain"
            :data="tableRowList"
            highlight-current-row
          >
            <el-table-column
              type="index"
              label="库存名称"
              align="right"
              class="name-of-ware"
              width="200"
              style="margin-right: 20px;"
            >
              <el-table-column
                prop="warehouseName"
                label="仓库名称"
                align="left"
                width="200"
                style="margin-left: 20px;"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              prop="realInventory"
              label="残品_真实总库存"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="availableInventory"
              label="残品_可用库存"
              align="center"
              show-overflow-tooltip
            ></el-table-column>

            <el-table-column
              v-if="stockDetailParams.dataSource === 1"
              prop="transitInventory"
              label="残品_在途库存"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              v-if="stockDetailParams.dataSource === 1"
              prop="lockTnventory"
              label="残品_锁定库存"
              align="center"
              show-overflow-tooltip
            >
              <el-table-column
                prop="lockingInventoryTotal"
                label="总计"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="lockingInventory2"
                label="调拨锁定"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="lockingInventory3"
                label="退供锁定"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="lockingInventory4"
                label="其他锁定"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div style="text-align: center;">
          <el-button
            @click="closeDialog"
            size="mini"
          >关闭</el-button>
        </div>
      </span>
    </el-dialog>

    <el-dialog
      :title='dialogTitle'
      :visible.sync="isCertStockDetail"
      width="1000px"
      :close-on-click-modal='false'
      :show-close='true'
    >
      <el-form
        :model="stockChangeParams"
        ref="queryForm"
        label-width="120px"
        class="search_form"
        size="medium"
      >
        <el-row :span="24">
          <el-col
            :span="7"
            class='input_def'
          >
            <el-form-item
              label="出入库单据编号："
              size="mini"
            >
              <el-input
                v-model.trim="stockChangeParams.outInCode"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="7"
            class='input_def'
          >
            <el-form-item
              label="来源单据编号："
              size="mini"
            >
              <el-input
                v-model.trim="stockChangeParams.sourceCode"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="10"
            class='input_def'
          >
            <el-form-item
              label="库存变动日期："
              size="mini"
            >
              <el-col :span="11">
                <el-date-picker
                  v-model="stockChangeParams.startInventoryDate"
                  :clearable='false'
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-col>
              <el-col
                style="text-align: center"
                :span="2"
              >-</el-col>
              <el-col :span="11">
                <el-date-picker
                  v-model="stockChangeParams.endInventoryDate"
                  type="date"
                  :clearable='false'
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col>
            <el-form-item
              size="mini"
              align="right"
            >
              <el-button
                type="primary"
                icon="search"
                @click="searchStockChangeData"
              >查询</el-button>
              <el-button
                type="default"
                icon="circle-cross"
                @click="resetStockChange"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableStockChangeList"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          class="name-of-ware"
        >
        </el-table-column>
        <el-table-column
          prop="orderSource"
          label="库存变动类型"
          align="center"
          width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="orderNo"
          label="出入库单据编号"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sourceOrder"
          label="来源单据编号"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="quantityDiff"
          label="库存变动数量"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.quantityDiff >0 "> +{{scope.row.quantityDiff}} </span>
            <span v-else> {{scope.row.quantityDiff}} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="变动后库存值"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="date"
          label="库存变动时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <div
        class="page"
        style="text-align:right; padding: 10px 0;"
      >
        <el-pagination
          @size-change="stockChangeSize"
          @current-change="stockChangeNumber"
          :current-page="stockChangeParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="stockChangeParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableStockChangePage<0 ? 0 :tableStockChangePage"
        >
        </el-pagination>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div style="text-align: center;">
          <el-button
            @click="isCertStockDetail = false"
            size="mini"
          >关闭</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      :title="tableDetailTitle"
      :visible.sync="isShowDetail"
      border
      width="60%">
      <div>
         <el-table
          :data="tableDetailData"
          border
          style="width: 100%">
          <el-table-column
            prop="frozenType"
            align="center"
            label="冻结来源">
            <template slot-scope="scope">
              <div v-if='scope.row.frozenType === "1"'>
                <p style='padding-left: 25px;text-align: left'>活动冻结</p>
                <p style='padding-left: 20px;text-align: left'>【活动编号：{{scope.row.orderNo}}】</p>
                <p style='padding-left: 20px;text-align: left'>【冻结渠道：{{scope.row.channelName}}】</p>
              </div>
              <div v-else>普通冻结</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="freezeQuantity"
            align="center"
            label="冻结数量">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button size="mini" @click="isShowDetail = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'stockcheck',
  props: ['isStockDetail', 'skuCodeStr'],
  data() {
    return {
      skuCode: this.skuCodeStr,
      stockDetail: this.isStockDetail, // 库存详情弹窗
      dialogTitle: '', // 标题
      tableStockChangeList: [], // 库存变动明细
      isLoading: false,
      dataSource: '1',
      activeName: 'first', // 当前选中的选项卡
      tableRowList: [], // 详情明细
      isShowDetail: false, // 冻结弹窗
      tableDetailData: [], // 冻结列表详情
      tableDetailTitle: '', // 冻结标题
      isCertStockDetail: false,
      tableStockChangePage: 0, // 库存变动分页数据
      stockDetailParams: {
        inventoryType: 1,
        dataSource: 1
      }, // 库存详情的组合参数
      stockChangeParams: {
        pageNo: 1,
        pageSize: 10,
        start: 0,
        inventoryType: '', // 类型
        warehouseName: '', // 仓库名称
        warehouseCode: '', // 仓库编号
        outInCode: '', // 出入库单据编号
        sourceCode: '', // 来源单据编号
        startInventoryDate: '', // 库存变动起始查询日期
        endInventoryDate: '' // 库存变动结束查询日期
      } // 库存变动明细参数
    };
  },
  created() {
    this.openStockDetailDia(this.skuCode);
  },
  watch: {
    stockDetail(n, o) {
      console.log(n);
      console.log(o);
    }
  },
  methods: {
    closeDialog() {
      this.stockDetail = false;
      this.$emit('closeDetail', false);
    },
    searchStockChangeData() {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = 10;
      // this.getStockChangeData();
    }, // 筛选库存变动明细
    resetStockChange() {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = 10;
      this.stockChangeParams.outInCode = '';
      this.stockChangeParams.sourceCode = '';
      this.stockChangeParams.startInventoryDate = '';
      this.stockChangeParams.endInventoryDate = '';
      // this.getStockChangeData();
    }, // 重置库存变动明细
    openStockDetailDia(skuCode) {
      // 库存详情弹窗
      this.isClick = true;
      this.skuCode = skuCode;
      this.activeName = 'first';
      this.dataSource = '1';
      this.stockDetailParams.inventoryType = 1;
      this.stockDetailParams.dataSource = 1;
      this.getStockDetailData();
    },
    getStockDetailData() {
      this.tableRowList = [];
      this.copyTableRowList = [];
      this.sumTableRowList = {
        warehouseName: '总计',
        realInventory: 0,
        availableInventory: 0,
        frozenInventory: 0,
        lockingInventory1: 0,
        lockingInventory2: 0,
        lockingInventory3: 0,
        lockingInventory4: 0,
        lockingInventoryTotal: 0,
        transitInventory: 0,
        isSumInventory: 1
      };
      this.$AXIOS
        .GET(
          '/inventory/scmInventoryDetail/' + this.skuCode,
          this.stockDetailParams,
          true
        )
        .then(res => {
          this.stockDetail = true;
          this.copyTableRowList = res.result;
          this.copyTableRowList.forEach(item => {
            this.sumTableRowList.realInventory += item.realInventory;
            if (item.realInventoryForShopSpect && this.activeName === 'first') {
              this.sumTableRowList.realInventory += item.realInventoryForShopSpect;
            }
            this.sumTableRowList.availableInventory += item.availableInventory;
            if (item.availableInventoryForShopSpect && this.activeName === 'first') {
              this.sumTableRowList.availableInventory += item.availableInventoryForShopSpect;
            }
            this.sumTableRowList.frozenInventory += item.frozenInventory;
            this.sumTableRowList.transitInventory += item.transitInventory;
            this.sumTableRowList.lockingInventoryTotal +=
              item.lockingInventoryTotal;
            this.sumTableRowList.lockingInventory1 += item.lockingInventory1;
            this.sumTableRowList.lockingInventory2 += item.lockingInventory2;
            this.sumTableRowList.lockingInventory3 += item.lockingInventory3;
            this.sumTableRowList.lockingInventory4 += item.lockingInventory4;
          });
          this.tableRowList.push(this.sumTableRowList);
          this.tableRowList = [...this.tableRowList, ...this.copyTableRowList];
          this.$nextTick(() => {
            this.$refs.tableMainFirst.setCurrentRow(this.tableRowList[0]);
            this.$refs.tableMain.setCurrentRow(this.tableRowList[0]);
          });
        }).finally(() => {
          this.isClick = false;
        });
    },
    // 1-默认渠道共享，8-门店专用
    toStockdetail(warehouseCode, warehouseName, inventoryType, flag) {
      this.isCertStockDetail = true;
      if (inventoryType === 8) {
        this.warehouseTitle = '门店专用';
      } else {
        this.warehouseTitle = '渠道共享';
      }
      this.dialogTitle = '仓库【' + warehouseName + '】中商品【' + this.skuCode + '】' + ' " ' + this.warehouseTitle + ' " ' + '的 "正品_真实总库存" 库存变动明细';
      if (flag) {
        this.warehouseTitle = '';
        this.dialogTitle = '仓库【' + warehouseName + '】中商品【' + this.skuCode + '】' + '的 "正品_真实总库存" 库存变动明细';
      }
      this.stockChangeParams.warehouseCode = warehouseCode;
      this.stockChangeParams.warehouseName = warehouseName;
      this.stockChangeParams.inventoryType = inventoryType;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = 10;
      this.stockChangeParams.start = 0;
      this.stockChangeParams.outInCode = '';
      this.stockChangeParams.sourceCode = '';
      this.stockChangeParams.startInventoryDate = '';
      this.stockChangeParams.endInventoryDate = '';
      this.tableStockChangeList = [];
      this.tableStockChangePage = 0;
      // this.getStockChangeData();
    },
    // 页码条数改变
    stockChangeSize(val) {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = val;
      // this.getStockChangeData();
    },
    // 当前页码改变
    stockChangeNumber(val) {
      this.stockChangeParams.pageNo = val;
      this.stockChangeParams.start =
        (val - 1) * this.stockChangeParams.pageSize;
      // this.getStockChangeData();
    },
    // 售后列表页码条数改变
    afterChangeSize(val) {
      this.afterParams.start = 0;
      this.afterParams.pageNo = 1;
      this.afterParams.pageSize = val;
    },
    changeSource(val) {
      this.stockDetailParams.dataSource = parseInt(val);
      this.getStockDetailData();
    },
    handleClick(tab, event) {
      let sourceIndex = tab.index === '0' ? 1 : 2;
      this.stockDetailParams.inventoryType = sourceIndex;
      this.getStockDetailData();
    }
  }
};
</script>
<style>
.el-tabs-stock .el-table thead.is-group th {
  background: none;
}
.el-tabs-stock .el-table thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.el-tabs-stock
  .el-table
  thead.is-group
  tr:first-of-type
  th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 105px; /*这里需要自己调整，根据td的宽度和高度*/
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-71deg); /*这里需要自己调整，根据线的位置*/
  transform-origin: top;
}
.el-tabs-stock
  .el-table
  thead.is-group
  tr:last-of-type
  th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 105px; /*这里需要自己调整，根据td的宽度和高度*/
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-71deg); /*这里需要自己调整，根据线的位置*/
  transform-origin: bottom;
}
.el-tabs-stock .el-tabs__header {
  width: 50%;
  margin-left: 70px;
  margin-bottom: 10px;
}
.el-tabs-stock .el-tabs__nav-wrap::after {
  height: 0;
}
.el-tabs-stock .el-tabs__active-bar {
  height: 0;
}
.el-tabs-stock .el-tabs__item {
  height: 18px !important;
  line-height: 18px !important;
  font-size: 14px;
  padding-right: 20px;
  margin-top: 15px;
}
.el-tabs-stock .el-tabs__item#tab-first {
  border-right: 1px solid #ccc;
}
.stock-detail .name-of-ware {
  width: 140px;
}
.stock-detail .stock-origin {
  position: absolute;
  right: 20px;
}
.stock-detail .el-tabs {
  margin-top: -40px;
}
.stock-detail .el-dialog__body {
  padding: 5px 20px 30px 20px;
}
.the-typeof-stock {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
#app .stock-detail .el-table td .cell {
  text-align: center;
}
#app .stock-detail .el-table th.is-right .cell {
  padding-right: 20px;
}
#app .stock-detail .el-table th.is-left .cell {
  padding-left: 20px;
}
#app .stock-detail .el-table .current-row {
  font-weight: 700;
}
.line {
  border-bottom: dotted 1px #ccc;
  margin: 10px 0;
}
.width_box {
  max-width: 200px;
}
</style>
<style lang="stylus" scoped>
.goodsstockmanage
  .title
    width: 60px
    line-height: 30px
    display: inline-block
  .content
    width: 200px
    line-height: 30px
    display: inline-block
  .check_list
    margin-left: 63px
  .el-checkbox
    padding-right: 10px
  .el-checkbox+.el-checkbox
    margin-left: 0
  .block
    color: #409EFF
    cursor: pointer
</style>
