<template>
  <div class="goodsstockmanage">
    <!-- 表单 -->
    <el-form
      :model="searchParams"
      ref="queryForm"
      label-width="125px"
      class="search_form"
      size="medium"
    >
      <el-row :span="20">
        <el-col
          :span="6"
          class='input_def'
        >
          <el-form-item
            label="条形码："
            size="mini"
          >
            <el-input
              v-model.trim="searchParams.barCode"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          class='input_def'
        >
          <el-form-item
            label="SKU编号："
            size="mini"
          >
            <el-input
              v-model.trim="searchParams.skuCode"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          class='input_def'
        >
          <el-form-item
            label="SKU名称："
            size="mini"
          >
            <el-input
              v-model.trim="searchParams.skuName"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          class='input_def'
        >
          <el-form-item
            label="品牌："
            size="mini"
          >
            <el-select
              v-model="searchParams.brandId"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in brand.list"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col
          :span="6"
          class='input_def'
        >
          <el-form-item
            label="类目："
            size="mini"
          >
            <el-col :span="8">
              <el-select
                v-model="searchParams.firstCategoryId"
                filterable
                placeholder="请选择"
                @change="firstCateChange"
              >
                <el-option
                  v-for="item in firstCateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="searchParams.secondCategoryId"
                :disabled="isFirstLevel"
                @change="secondCateChange"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in secondCateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="searchParams.thirdCategoryId"
                :disabled="isSecondLevel"
                @change="thirdCateChange"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in thirdCateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="商品类别："
            size="mini"
          >
            <el-select
              v-model="searchParams.itemType"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in itemTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button
              type="primary"
              icon="search"
              @click="searchFormData"
            >查询</el-button>
            <el-button
              type="default"
              icon="circle-cross"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row
      type="flex"
      justify="space-between"
    >
      <el-col>
        <el-button
          type="primary"
          @click="exportShow"
          icon="circle-cross"
          size="mini"
          :loading="disabledDownLoad"
          :disabled='isTableDisabled'
        >{{disabledDownLoad?'下载中':'导出'}}</el-button>
        <el-button
          type="primary"
          @click="exportStockShow"
          icon="circle-cross"
          size="mini"
          :loading="disabledStockDownLoad"
        >按库存导出</el-button>
      </el-col>
      <el-col
        class='paging'
        align="right"
      >
        <el-pagination
          @size-change="changeSize"
          @current-change="changeNumber"
          :current-page="searchParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table
      :data="tableDataList"
      ref="multipleTable"
      highlight-current-row
      border
      tooltip-effect="dark"
    >
      <el-table-column
        label="序号"
        type="index"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        label="SKU编号"
        prop="skuCode"
        align="center"
        width="190"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="SKU名称"
        prop="skuName"
        align="center"
        width='150'
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="条形码"
        prop="barCode"
        align="center"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="规格"
        prop="specInfo"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="类目"
        prop="categoryName"
        align="center"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="品牌"
        prop="brandName"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        label="商品类别"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.itemType === '0'">小泰良品（自销）</span>
            <span v-else-if="scope.row.itemType === '1'">非小泰良品（自销）</span>
            <span v-else-if="scope.row.itemType === '2'">代销商品</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="正品_真实总库存_总计"
        prop="realInventoryTotal"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="正品_可用库存_总计"
        prop="availableInventoryTotal"
        align="center"
        width='150'
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="正品_在途库存_总计"
        prop="transitInventoryTotal"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="库存详情"
        prop="itemNum"
        align="center"
        width="75"
      >
        <template slot-scope="scope">
          <el-button
            :disabled='isClick'
            @click="openStockDetailDia(scope.row.skuCode)"
            type="text"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="导出模板设定"
      :visible.sync="isShow"
      width="80%"
      :close-on-click-modal='false'
      :show-close='false'
      v-loading='disabledDownLoad'
      element-loading-text="拼命下载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-row>
        <div>
          <span class="title">库存来源：</span>
          <span class="content">SCM</span>
        </div>
        <p class="line"></p>
        <div>
          <span class="title">库存类型：</span>
          <span class="content">
            <el-checkbox-group v-model="invetoryTypeList">
              <el-checkbox label="1">正品</el-checkbox>
              <el-checkbox label="2">残品</el-checkbox>
            </el-checkbox-group>
          </span>
        </div>
        <p class="line"></p>
        <div>
          <span class="title">库存名称：</span>
          <span style="display: inline-block">
            <el-checkbox-group v-model="invetoryClassifyList">
              <el-checkbox label="1">真实总库存</el-checkbox>
              <el-checkbox label="2">可用库存</el-checkbox>
              <el-checkbox label="3">冻结库存</el-checkbox>
              <el-checkbox label="4">在途库存</el-checkbox>
              <el-checkbox label="5">锁定库存（总计）</el-checkbox>
              <el-checkbox label="6">销售锁定库存</el-checkbox>
              <el-checkbox label="7">调拨锁定库存</el-checkbox>
              <el-checkbox label="8">退供锁定库存</el-checkbox>
              <el-checkbox label="9">其他锁定库存</el-checkbox>
            </el-checkbox-group>
          </span>
        </div>
        <p class="line"></p>
        <div>
          <span class="title">仓库对象：</span>
          <span>
            （<el-button
              type="text"
              style="margin-right: 10px"
              @click="checkAll"
            >全选</el-button>|
            <el-button type="text" @click="otherChecked">反选</el-button>）
          </span>
          <span style="display: inline-block;margin-right: 15px">
            <el-checkbox v-model="countFlag">总计</el-checkbox>
          </span>
          <span style="display: inline-block">
            <el-checkbox-group
              v-model="warehouseCodeList"
              class="check_list"
            >
              <el-checkbox
                v-for="(item, i) in warehouseCodeArray"
                :key="i"
                :label="item.code"
              >{{item.warehouseName}}</el-checkbox>
            </el-checkbox-group>
          </span>
        </div>
        <p class="line"></p>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
        style="text-align: center"
      >
        <el-button
          size="mini"
          type="primary"
          :loading="disabledDownLoad"
          :disabled='isTableDisabled'
          @click="exportOrder"
        >{{disabledDownLoad?'下载中':'确 定'}}</el-button>
        <el-button
          size="mini"
          @click="isShow = false"
          :disabled="disabledDownLoad"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- 按库存导出 -->
    <el-dialog
      title="按库存导出"
      :visible.sync="isStockExcept"
      v-loading='disabledStockDownLoad'
      element-loading-text="拼命下载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      width="50%">
      <div style="height: 100px">
        <el-row>
          <el-col span="6" style="line-height: 28px;text-align: right">
            正品_真实总库存小于等于：
          </el-col>
          <el-col span="6">
            <el-input
              v-model.trim="minNum"
              size="mini"
              :maxlength='9'
              placeholder=""
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center">
        <el-button @click="isStockExcept = false" size="mini" :disabled="disabledStockDownLoad">取消</el-button>
        <el-button type="primary" @click="downloadStock" size="mini" :disabled="disabledStockDownLoad">导出</el-button>
      </div>
    </el-dialog>
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
            @click="stockDetail = false"
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
import axios from 'axios';
import qs from 'qs';
export default {
  name: 'goodsstocklist',
  data() {
    return {
      tableDetailTitle: '', // 冻结标题
      tableDetailData: [], // 冻结列表详情
      isShowDetail: false, // 冻结弹窗
      dialogTitle: '', // 标题
      isClick: false, // 重复点击
      invetoryTypeList: [], // 库存类型列表
      invetoryClassifyList: [], // 库存类别列表
      warehouseCodeList: [], // 仓库列表
      warehouseCodeArray: [], // 后台返回的仓库列表
      countFlag: true, // 总计列
      isShow: false, // 显示弹窗
      itemTypeOptions: [
        {
          value: '0',
          label: '小泰良品（自销）'
        },
        {
          value: '1',
          label: '非小泰良品（自销）'
        },
        {
          value: '2',
          label: '代销商品'
        }
      ],
      dataSource: '1',
      minNum: '', // 最小库存下载数量
      isStockExcept: false, // 按库存导出弹窗
      disabledStockDownLoad: false, // 按库存导出
      isTableDisabled: false, // 订单是否可导出
      disabledDownLoad: false,
      isLoading: false,
      stockDetail: false, // 库存详情弹窗
      brand: {
        // 品牌
        list: [],
        id: ''
      },
      activeName: 'first', // 当前选中的选项卡
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单
      isSecondLevel: true, // 关联三级菜单
      dialogTableVisible: false, // 弹窗
      currentTableIndex: [], // 当前列表对应子列表的sku项
      skuList: [], // sku列表
      spuCodeList: [], // spu更改状态列表
      skuCodeList: [], // sku更改状态列表
      tableDataList: [], // 初始化列表数据
      tableRowList: [], // 详情明细
      copyTableRowList: [], // 数据拷贝
      sumTableRowList: {}, // 详情明细总计
      tableStockChangeList: [], // 库存变动明细
      tableStockChangePage: 0, // 库存变动分页数据
      totalCount: 0, // 列表条数
      skuCode: 0,
      warehouseTitle: '渠道共享', // 仓库标题
      changeSkuCode: 0,
      searchParams: {
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        barCode: '', // 条形码
        skuCode: '', // sku编号
        skuName: '', // sku名称
        brandId: '', // 品牌id
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
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
      }, // 库存变动明细参数
      isCertStockDetail: false,
      columnNameData: [
        {
          code: 'realInventory',
          name: '正品_真实总库存',
          isDetail: true
        },
        {
          code: 'availableInventory',
          name: '正品_可用库存'
        },
        {
          code: 'frozenInventory',
          name: '正品_冻结库存'
        },
        {
          code: 'transitInventory',
          name: '正品_在途库存'
        },
        {
          code: 'lockTnventory',
          name: '正品_真实总库存',
          children: [
            {
              code: 'lockingInventory1',
              name: '销售锁定'
            },
            {
              code: 'lockingInventory2',
              name: '调拨锁定'
            },
            {
              code: 'lockingInventory3',
              name: '退供锁定'
            },
            {
              code: 'lockingInventory4',
              name: '其他锁定'
            }
          ]
        }
      ] // 库存详情列表表头
    };
  },
  created() {
    this.channelCookie = localStorage.getItem('channelCookie');
    if (this.$route.query.supplierOrderStatus !== '') {
      this.searchParams.supplierOrderStatus = this.$route.query.supplierOrderStatus;
    }
    if (this.$route.query.time !== '') {
      this.searchParams.startCreateTime = this.$route.query.time;
      this.searchParams.endCreateTime = this.$route.query.time;
    }
    this.initDataList();
    this.initCateData({ parentId: '', isRecursive: false }).then(res => {
      this.firstCateList = res.result;
    });
    this.initBrand({ categoryId: '' });
  },
  computed: {
    // 导入失败下载的地址
    downloadFail() {
      return '/scm-web/order/downloadErrorOrder/' + this.orderCode;
    },
    // 模板的下载地址
    downloadDefault() {
      return '/scm-web/order/downloadErrorOrder/' + this.orderCode;
    }
  },
  methods: {
    // 显示冻结库存详情
    showDetailClick() {
      let arr = [];
      if (this.copyTableRowList && this.copyTableRowList.length) {
        this.copyTableRowList.forEach(item => {
          arr.push(item.warehouseCode);
        });
      }
      let params = {};
      params.skuCode = this.skuCode;
      params.warehouseCodeList = arr.join();
      this.tableDetailTitle = '商品【' + this.skuCode + '】“正品_冻结库存”明细信息';
      this.isShowDetail = true;
      this.tableDetailData = [];
      this.$AXIOS.POST('/inventory/frozenInventoryDetail', params).then(res => {
        this.tableDetailData = res.result;
      });
    },
    checkAll() {
      let result = [];
      this.warehouseCodeArray.forEach(item => {
        result.push(item.code);
      });
      this.warehouseCodeList = result;
    },
    otherChecked() {
      let result = [];
      this.warehouseCodeArray.forEach(item => {
        if (this.warehouseCodeList.indexOf(item.code) < 0) {
          result.push(item.code);
        }
      });
      this.warehouseCodeList = result;
    },
    // 收货仓库下拉列表
    getwarehouseCodeList() {
      this.$AXIOS.GET('/inventory/warehouse').then(res => {
        this.warehouseCodeArray = res.result;
      });
    },
    // 跳转到商品详情
    toGoodDetail(row) {
      if (row.skuCode.indexOf('SP0') > -1) {
        this.$router.push({
          name: 'goodsquerydetail',
          params: {
            id: row.spuCode,
            skuCode: row.skuCode
          },
          query: {
            backLastRouter: true
          }
        });
      } else {
        this.$router.push({
          name: 'undertakesgoodDetail',
          params: {
            id: row.skuCode
          },
          query: {
            backLastRouter: true,
            opeId: row.id
          }
        });
      }
    },
    downloadUrl() {
      window.open('./orderTemplate.xls');
    },
    // 显示弹窗
    exportShow() {
      this.isShow = true;
      this.invetoryTypeList = ['1'];
      this.invetoryClassifyList = ['2'];
      this.warehouseCodeList = [];
      this.countFlag = true;
      this.getwarehouseCodeList();
    },
    // 按库存导出
    exportStockShow() {
      this.isStockExcept = true;
      this.minNum = '';
    },
    downloadStock() {
      let numReg2 = /^[0-9]+$/;
      if (this.minNum === 0 || this.minNum === '0') {

      } else {
        if (this.minNum === '') {
           this.$utils.messagetip.warningTip('正品_真实总库存不能为空！');
            return;
        }
        if (this.minNum && !numReg2.test(this.minNum)) {
          this.$utils.messagetip.warningTip('正品_真实总库存只能为0或正整数！');
            return;
        }
      }

      let params = {};
      this.disabledStockDownLoad = true;
      Object.keys(this.searchParams).forEach(key => {
        if (
          this.searchParams[key] !== '' &&
          this.searchParams[key] !== undefined
        ) {
          params[key] = this.searchParams[key];
        }
      });
      params.minNum = this.minNum;
      this.$AXIOS
        .EXPORT({ url: '/inventory/export/special', data: params, fileName: '库存导出' })
        .then(res => {
          this.isStockExcept = false;
        })
        .finally(() => {
          this.disabledStockDownLoad = false;
        });
    },
    // 导出订单
    exportOrder() {
      if (this.invetoryTypeList && !this.invetoryTypeList.length) {
        this.$utils.messagetip.warningTip('请选择库存类型！');
        return;
      }
      if (this.invetoryClassifyList && !this.invetoryClassifyList.length) {
        this.$utils.messagetip.warningTip('请选择库存名称！');
        return;
      }
      if ((this.warehouseCodeList && !this.warehouseCodeList.length) && !this.countFlag) {
        this.$utils.messagetip.warningTip('请选择仓库！');
        return;
      }
      let params = {};
      this.disabledDownLoad = true;
      Object.keys(this.searchParams).forEach(key => {
        if (
          this.searchParams[key] !== '' &&
          this.searchParams[key] !== undefined
        ) {
          params[key] = this.searchParams[key];
        }
      });
      params.dataSource = '1';
      params.invetoryType = this.invetoryTypeList.join();
      params.invetoryClassify = this.invetoryClassifyList.join();
      params.countFlag = this.countFlag ? '1' : '2';
      params.warehouseCode = this.warehouseCodeList.join();
      console.log(params);
      this.$AXIOS
        .EXPORT({ url: '/inventory/export', data: params, fileName: '库存单' })
        .then(res => {
          this.isShow = false;
        })
        .finally(() => {
          this.disabledDownLoad = false;
        });
    },
    // 获取自采商品库存列表
    initDataList() {
      this.tableRowList = [];
      this.isTableDisabled = false;
      this.$AXIOS
        .GET('/inventory/scmInventoryPage', this.searchParams)
        .then(res => {
          this.tableDataList = res.result.result;
          this.totalCount = res.result.totalCount;
          if (this.tableDataList && this.tableDataList.length) {
          } else {
            this.isTableDisabled = true;
          }
        });
    },
    // 获取所有品牌
    initBrand(data) {
      this.$AXIOS.GET('/productCenter/brand/all_list').then(res => {
        this.brand.list = res.result;
      });
    },
    // 获取全部类目
    initCateData(val) {
      return this.$AXIOS.GET('/productCenter/category/tree', val);
    },
    // 页码条数改变
    stockChangeSize(val) {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = val;
      this.getStockChangeData();
    },
    // 当前页码改变
    stockChangeNumber(val) {
      this.stockChangeParams.pageNo = val;
      this.stockChangeParams.start =
        (val - 1) * this.stockChangeParams.pageSize;
      this.getStockChangeData();
    },
    // 售后列表页码条数改变
    afterChangeSize(val) {
      this.afterParams.start = 0;
      this.afterParams.pageNo = 1;
      this.afterParams.pageSize = val;
    },
    // 售后列表当前页码改变
    afterChangeNumber(val) {
      this.afterParams.pageNo = val;
      this.afterParams.start = (val - 1) * this.afterParams.pageSize;
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    searchStockChangeData() {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = 10;
      this.getStockChangeData();
    }, // 筛选库存变动明细
    resetStockChange() {
      this.stockChangeParams.start = 0;
      this.stockChangeParams.pageNo = 1;
      this.stockChangeParams.pageSize = 10;
      this.stockChangeParams.outInCode = '';
      this.stockChangeParams.sourceCode = '';
      this.stockChangeParams.startInventoryDate = '';
      this.stockChangeParams.endInventoryDate = '';
      this.getStockChangeData();
    }, // 重置库存变动明细
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        barCode: '', // 条形码
        skuCode: '', // sku编号
        skuName: '', // sku名称
        brandId: '', // 品牌
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.isFirstLevel = true; // 关联二级菜单是否禁用
      this.isSecondLevel = true; // 关联三级菜单是否禁用
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.initDataList();
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
      this.getStockChangeData();
    },
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
    getStockChangeData() {
      // 库存变动明细分页
      this.$AXIOS
        .GET(
          '/inventory/scmInventoryOutInDetail/' + this.skuCode,
          this.stockChangeParams
        )
        .then(res => {
          this.tableStockChangeList = res.result.result;
          this.tableStockChangePage = res.result.totalCount;
          this.tableStockChangeList.forEach(item => {
            if (item.orderNo.indexOf('MD') > -1 && this.stockChangeParams.inventoryType === 8) {
              item.orderSource = '门店专用库存调整';
            }
            if (item.orderNo.indexOf('MD') > -1 && this.stockChangeParams.inventoryType === 1) {
              item.orderSource = '渠道共享库存调整';
            }
          });
        });
    },
    // 一级类目事件
    firstCateChange(val) {
      this.searchParams.categoryId = val;
      this.searchParams.categoryLevel = 1;
      this.initCateData({ parentId: val, isRecursive: false }).then(res => {
        this.searchParams.secondCategoryId = '';
        this.searchParams.thirdCategoryId = '';
        this.secondCateList = res.result;
        this.isFirstLevel = false;
      });
    },
    // 二级类目事件
    secondCateChange(val) {
      this.searchParams.categoryId = val;
      this.searchParams.categoryLevel = 2;
      this.initCateData({ parentId: val, isRecursive: false }).then(res => {
        this.searchParams.thirdCategoryId = '';
        this.thirdCateList = res.result;
        this.isSecondLevel = false;
      });
    },
    // 三级类目事件
    thirdCateChange(val) {
      this.searchParams.categoryLevel = 3;
      this.searchParams.categoryId = val;
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
