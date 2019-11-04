<template>
  <div class="shipwarehousematch">
    <div style="background: rgb(255, 204, 163); border: solid 1px #000;text-align: center;line-height: 30px;margin-bottom: 15px">
      说明：订单中商品匹配发货仓库时，系统先根据“按SKU设置”再根据“默认设置”来确定发货仓库
    </div>
    <div class="nav">
      <div class="tab" :class="isActive === 1 ? 'active' : ''" @click="tabClick(1)">默认设置</div>
      <div class="tab" :class="isActive === 2 ? 'active' : ''" @click="tabClick(2)">按SKU设置</div>
    </div>
    <div class="line"></div>
    <!-- 默认显示默认设置 -->
    <div v-show="isActive === 1">
      <!-- 分页 -->
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button size="mini" type="primary" @click="addWarehouse"> + 新增发货仓</el-button>
          <el-button size="mini" type="primary" @click="setRange">仓库对应辐射范围和匹配等级设置</el-button>
        </el-col>
        <el-col class='paging' style="margin: 10px;">
          <el-button size="mini" type="text" @click="getLogInfoModel">操作日志</el-button>
          <!-- <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination> -->
        </el-col>
      </el-row>
      <div class="tip">！注意：请确保至少一个仓库处于启用状态。</div>
      <!-- 表格tableData -->
      <el-table :data="tableDataList" ref="multipleTable" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark">
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="仓库名称" prop="warehouseName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库类型-仓库等级" prop="warehouseTypeAndWarehouseLevel" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="辐射范围" prop="coverageArea" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="发货匹配等级" prop="matchLevel" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="checkedArr[scope.$index]">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="移除" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="!checkedArr[scope.$index]" @click='removeTableRow(scope.$index)'>移除</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 15px">
        <el-button size="mini" type="primary" @click="saveDataList" :disabled="hasDisabled">保存</el-button>
      </div>
    </div>
    <div v-show="isActive === 2">
      <!-- 表单 -->
      <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="SKU名称：" size="mini">
              <el-input v-model.trim="searchParams.skuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- <el-select v-model="searchParams.categoryId" filterable>
                <el-option v-for="item in skuStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select> -->
            <el-form-item label="所属类目：" size="mini">
              <el-col :span="8">
                <el-select v-model="searchParams.firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                  <el-option v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id" style="height: 28px">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="searchParams.secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                  <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id" style="height: 28px">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="searchParams.thirdCategoryId" :disabled="isSecondLevel" @change="thirdCateChange" filterable placeholder="请选择">
                  <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id" style="height: 28px">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU状态：" size="mini">
              <el-select v-model="searchParams.isValid" filterable>
                <el-option v-for="item in skuStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货仓库：" size="mini">
              <el-select v-model="searchParams.warehouseCode" filterable>
                <el-option v-for="item in warehouseArray" :key="item.code" :label="item.warehouseName" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="SKU编号：" size="mini">
              <el-input type="textarea" :rows="1" v-model.trim="searchParams.skuCode" placeholder="多个请用英文“,”隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条形码：" size="mini">
              <el-input type="textarea"  :rows="1" v-model.trim="searchParams.barCode" placeholder="多个请用英文“,”隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分页 -->
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button size="mini" type="primary" @click="configWarehouseAll" :disabled="multipleSelection && multipleSelection.length < 1">批量设置</el-button>
          <el-button size="mini" type="primary" @click="closeAll" :disabled="multipleSelection && multipleSelection.length < 1">批量关闭</el-button>
        </el-col>
        <el-col class='paging'>
          <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </el-col>
      </el-row>
      <el-tabs v-model="searchParams.tab" type="card" @tab-click="searchFormData">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="已设置" name="2"></el-tab-pane>
      </el-tabs>
      <!-- 表格tableData -->
      <el-table :data="skutableDataList" ref="multipleTable1" highlight-current-row border  @selection-change="handleSelectionChange" tooltip-effect="dark">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格" prop="specInfo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="条形码" prop="barCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="类目" prop="categoryName" align="center"></el-table-column>
        <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
        <el-table-column label="发货仓库" prop="warehouseName" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.valid === '1'">{{scope.row.warehouseName}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="btn" @click="configWarehouse(scope.row)">设置</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增发货仓 -->
    <el-dialog title="新增发货仓" :visible.sync="isAdd">
      <el-row>
        <el-col :span="3">
          <div class="left tip_red">仓库名称：</div>
        </el-col>
        <el-col :span="8">
          <el-select v-model="warehouseCode" filterable size="mini" >
            <el-option v-for="(item, i) in warehouseList" :key="i" :label="item.warehouseName" :value="item.code" :disabled="item.hasTrue">
              <span style="float: left">{{ item.warehouseName }}</span>
              <span style="float: right; color: pink; font-size: 10px;">{{ item.reason }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="3">
          <div class="left">启用：</div>
        </el-col>
        <el-col :span="8">
          <div class="right">
            <el-checkbox v-model="warehouseValid"></el-checkbox>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: center;margin-top: 100px">
        <el-button size="mini" type="primary" @click="saveWarehouse">保存</el-button>
        <el-button size="mini" @click="isAdd = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 仓库对应辐射范围和匹配等级设置 -->
    <el-dialog title="仓库对应辐射范围和匹配等级设置" :visible.sync="isWarehouse">
      <div class="data_list">
        <div class="tip">
          说明：系统在匹配发货仓库时，会先根据收货地址确定在辐射范围内的仓库，然后再按匹配等级从大到小（1级最大，10级最小）依次匹配，匹配等级相同时，优先匹配距离更近的那个仓库。
        </div>
        <el-table :data="deliverWarehouseConfigList" highlight-current-row border tooltip-effect="dark" :span-method="objectSpanMethod">
          <el-table-column label="仓库类型" prop="warehouseTypeName" align="center" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="仓库等级" prop="warehouseLevelName" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="辐射范围" align="center" >
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.coverageArea" size="mini">
                <el-radio label="1" @change='radioChange(scope.$index)'>全国</el-radio>
                <el-radio label="2">特定范围：<el-input v-model="scope.row.coverageAreaKm" :disabled="scope.row.coverageArea === '1'" placeholder="" size="mini" style="width: 120px" :maxlength="10"></el-input>公里</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="匹配等级" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-model="scope.row.matchLevel" filterable size="mini" placeholder="请选择">
                <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 100px">
          <el-button size="mini" type="primary" @click="saveRange">保存</el-button>
          <el-button size="mini" @click="isWarehouse = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 设置发货仓库优先级 -->
    <el-dialog title="设置发货仓库优先级" :visible.sync="isRanking" :close-on-click-modal='false'>
      <p class="btn" style="text-align: right;" v-if="warehouseTableList && warehouseTableList.length < 2"  @click="getLogInfoRankModel">操作日志</p>
      <p class="title">
        <span class="tip_blue"></span>
        <span class="tip_title">已选商品</span>
        <span class="tip_line"></span>
      </p>
      <el-table :data="warehouseTableList" ref="multipleTable2" highlight-current-row border tooltip-effect="dark" :height='386'>
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="SKU编号" prop="skuCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" prop="description" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if='warehouseTableList && warehouseTableList.length > 1' class="btn" @click="deleteList(scope.$index)">删除</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <p class="title">
        <span class="tip_blue"></span>
        <span class="tip_title">设置发货仓库</span>
        <span class="tip_line"></span>
      </p>
      <el-row>
        <el-col :span="2">
          <div class="left tip_red">发货仓库：</div>
        </el-col>
        <el-col :span="5">
          <el-select v-model="deliveryWarehouseCode" filterable size="mini">
            <el-option v-for="item in deliveryWarehouseList" :key="item.code" :label="item.warehouseName" :value="item.code"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="line-height: 28px">
          注：已过滤掉未在【仓库信息管理】中与所选商品进行绑定的仓库
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="2">
          <div class="left tip_red">启用设置：</div>
        </el-col>
        <el-col :span="8">
          <div class="right">
            <el-radio-group v-model="deliveryValid">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: center;margin-top: 100px">
        <el-button size="mini" type="primary" @click='saveDeliveryWarehouse'>保存</el-button>
        <el-button size="mini" @click="cancelModel">取消</el-button>
      </div>
    </el-dialog>
    <!-- 操作日志 -->
    <el-dialog title="操作日志" :visible.sync="isLog">
      <el-table :data="logInfoList" style="width: 100%" border>
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
      <div style="text-align: center;margin-top: 15px">
        <el-button type="primary" size="mini" @click="isLog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'shipwarehousematch',
  data() {
    return {
      spliceList: [], // 删除的数组
      removeList: [], // 删除的数组
      warehouseArray: [], // 搜索下拉菜单列表
      multipleSelection: [],
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单是否禁用
      isSecondLevel: true, // 关联三级菜单是否禁用
      isChecked: false,
      len: 0,
      warehouseCode: '', // 新增发货仓绑定的字段
      deliveryWarehouseCode: '', // 发货仓库
      deliveryValid: '0', // 启用设置
      warehouseValid: false, // 新增发货仓绑定的启停用
      checkedArr: [], // 启用的列表
      isRanking: false, // 设置优先级弹窗
      isAdd: false, // 新增发货仓弹窗
      isWarehouse: false, // 仓库对应辐射范围和匹配等级设置弹窗
      isLog: false, // 操作日志弹窗
      isActive: 1,
      deliverWarehouseConfigList: [], // 等级列表
      deliveryWarehouseList: [], // 发货仓库下拉列表
      warehouseList: [], // 仓库下拉列表
      tableDataList: [], // 初始化列表数据
      warehouseTableList: [], // 发货仓列表数据
      skutableDataList: [], // sku列表数据
      totalCount: 0,
      searchParams: {
        tab: '1',
        warehouseCode: '',
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '', // skuCode
        skuName: '', // sku名称
        barCode: '', // 条形码
        categoryId: '', // 类目id
        categoryLevel: '', // 类目等级
        isValid: '1', // 启停用
        pageFlag: '1', // 分页标识，1分页，2不分页
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      searchParams11: {
        tab: '1',
        warehouseCode: '',
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '', // skuCode
        skuName: '', // sku名称
        barCode: '', // 条形码
        categoryId: '', // 类目id
        categoryLevel: '', // 类目等级
        valid: '', // 启停用
        pageFlag: '2', // 分页标识，1分页，2不分页
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      },
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        operateType: 0,
        entityType: 'WarehousePriority',
        entityId: ''
      }, // 日志
      skuStatusList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '启用'
        },
        {
          id: '0',
          name: '停用'
        }
      ],
      levelList: [
        {
          id: '1',
          name: '1级'
        },
        {
          id: '2',
          name: '2级'
        },
        {
          id: '3',
          name: '3级'
        },
        {
          id: '4',
          name: '4级'
        },
        {
          id: '5',
          name: '5级'
        },
        {
          id: '6',
          name: '6级'
        },
        {
          id: '7',
          name: '7级'
        },
        {
          id: '8',
          name: '8级'
        },
        {
          id: '9',
          name: '9级'
        },
        {
          id: '10',
          name: '10级'
        }
      ]
    };
  },
  computed: {
    hasDisabled() {
      let isBool = true;
      if (this.tableDataList && this.tableDataList.length) {
        isBool = false;
      } else {
        isBool = true;
      }
      return isBool;
    }
  },
  created() {
    this.initDataList();
    this.initCateData({ parentId: '', isRecursive: false }).then(res => {
      this.firstCateList = res.result;
    });
  },
  methods: {
    removeTableRow(i) {
      this.checkedArr.splice(i, 1);
      let arr = this.tableDataList.splice(i, 1);
      if (arr[0].id) {
        let obj = {};
        obj.id = arr[0].id;
        obj.isDeleted = '1';
        obj.warehouseCode = arr[0].warehouseCode;
        obj.warehouseName = arr[0].warehouseName;
        obj.isValid = '0';
        this.spliceList.push(obj);
        arr[0].code = arr[0].warehouseCode;
        this.removeList.push(arr[0]);
      }
    },
    tableRowClick(row) {
      // this.operateParams.entityId = row.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取全部类目事件
    initCateData(val) {
      return this.$AXIOS.GET('/productCenter/category/tree', val);
    },
    // 一级类目事件
    firstCateChange(val) {
      this.searchParams.categoryId = val;
      this.searchParams.categoryLevel = '1';
      this.initCateData({ parentId: val, isRecursive: false }).then(res => {
        this.searchParams.secondCategoryId = '';
        this.searchParams.thirdCategoryId = '';
        this.secondCateList = res.result;
        this.isFirstLevel = false;
        this.isSecondLevel = true;
      });
    },
    // 二级类目事件
    secondCateChange(val) {
      this.searchParams.categoryId = val;
      this.searchParams.categoryLevel = '2';
      this.initCateData({ parentId: val, isRecursive: false }).then(res => {
        this.searchParams.thirdCategoryId = '';
        this.thirdCateList = res.result;
        this.isSecondLevel = false;
      });
    },
    // 三级类目事件
    thirdCateChange(val) {
      this.searchParams.categoryLevel = '3';
      this.searchParams.categoryId = val;
    },
    // 重置公里数
    radioChange(i) {
      this.deliverWarehouseConfigList[i].coverageAreaKm = '';
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row);
      if (columnIndex === 0) {
        if (rowIndex % this.len === 0) {
          return {
            rowspan: this.len,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    initDataList() {
      this.tableDataList = [];
      this.checkedArr = [];
      this.$AXIOS.LISTGET('/warehousePriority/warehousePriorityList', {}).then(res => {
        this.spliceList = [];
        this.removeList = [];
        this.tableDataList = res.result;
        if (this.tableDataList.length) {
          this.tableDataList.forEach(item => {
            if (item.isValid === '1') {
              this.checkedArr.push(true);
            } else {
              this.checkedArr.push(false);
            }
          });
        }
        console.log(this.tableDataList);
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            // this.operateParams.entityId = this.tableDataList[0].id;
          }, 20);
        }
      });
    },
    // 获取下拉列表
    getWarehouseList() {
      this.$AXIOS.LISTGET('/warehousePriority/warehouseList').then(res => {
        this.warehouseList = [...res.result, ...this.removeList];
        let arr = [];
        this.warehouseList.forEach(item => {
          let isTrue = false;
          this.tableDataList.forEach(subItem => {
            if (subItem.warehouseCode === item.code) {
             isTrue = true;
             return false;
            }
          });
          if (!isTrue) {
            arr.push(item);
          }
        });
        console.log(arr);
        this.warehouseList = arr;
        this.warehouseList.forEach(item => {
          if (item.coverageArea && item.matchLevel && item.warehouseTypeAndWarehouseLevel) {
            item.hasTrue = false;
            item.reason = '';
          } else {
            item.hasTrue = true;
            item.reason = '未设置仓库等级';
          }
        });
      });
    },
    // 保存列表数据到后台
    updateTableDataList() {
      let arr = [];
      this.tableDataList.forEach(item => {
        let obj = {};
        if (item.id) {
          obj.id = item.id;
        }
        obj.isDeleted = item.isDeleted;
        obj.warehouseCode = item.warehouseCode;
        obj.warehouseName = item.warehouseName;
        obj.isValid = item.isValid;
        arr.push(obj);
      });
      let warehousePriorityInfo = [...arr, ...this.spliceList];
      this.$AXIOS.JSONPOST('/warehousePriority/warehousePriority', warehousePriorityInfo).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.initDataList();
      });
    },
    // 保存仓库范围和等级设置列表数据到后台
    updateDeliverWarehouseConfigList() {
      let data = {
        list: this.deliverWarehouseConfigList
      };
      this.$AXIOS.JSONPUT('/deliverWarehouseConfig/updateDeliverWarehouseConfig', data).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.isWarehouse = false;
        this.initDataList();
      });
    },
    // 保存发货仓库优先级数据到后台
    updatePriority(params) {
      this.$AXIOS.JSONPUT('/warehousePriority/updatePriority', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.isRanking = false;
        this.getSkuDataList();
      });
    },
    // 获取仓库等级及距离数据
    getDeliverWarehouseConfigList() {
      this.$AXIOS.LISTGET('/deliverWarehouseConfig/deliverWarehouseConfigList').then(res => {
        this.deliverWarehouseConfigList = res.result;
        let len = this.deliverWarehouseConfigList.length / 4;
        this.len = len;
      });
    },
    // 获取发货仓库
    getDeliveryWarehouseList(params) {
      this.$AXIOS.LISTGET('/warehousePriority/warehouseAll', params).then(res => {
        this.deliveryWarehouseList = res.result;
      });
    },
    // 获取发货仓库-下拉
    getWarehouseArray() {
      this.$AXIOS.LISTGET('/warehousePriority/warehouseAll').then(res => {
        this.warehouseArray = [...[{warehouseName: '全部', code: ''}], ...res.result];
      });
    },
    // 按sku设置列表数据
    getSkuDataList() {
      this.skutableDataList = [];
      this.searchParams.pageFlag = '1';
      this.$AXIOS.LISTGET('/warehousePriority/skuPriorityList', this.searchParams).then(res => {
        this.skutableDataList = res.result;
        this.totalCount = res.totalCount;
        console.log(this.skutableDataList);
        if (this.skutableDataList && this.skutableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable1.setCurrentRow(this.skutableDataList[0]);
          }, 20);
        }
      });
    },
    // 获取全部的skuCode
    getSkuDataListAll() {
      let result = [];
      this.$AXIOS.LISTGET('/warehousePriority/skuPriorityList', this.searchParams11).then(res => {
        result = res.result;
        result.forEach(item => {
          this.warehouseTableList.push(item);
        });
      });
    },
    // 关闭全部接口
    putCloseAll(params) {
      this.$AXIOS.JSONPUT('/warehousePriority/closeAll', params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.getSkuDataList();
      });
    },
    searchFormData() {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = 10;
      this.searchParams.start = 0;
      this.searchParams11 = {
        tab: this.searchParams.tab,
        warehouseCode: this.searchParams.warehouseCode,
        firstCategoryId: this.searchParams.firstCategoryId,
        secondCategoryId: this.searchParams.secondCategoryId,
        thirdCategoryId: this.searchParams.thirdCategoryId,
        skuCode: this.searchParams.skuCode, // skuCode
        skuName: this.searchParams.skuName, // sku名称
        barCode: this.searchParams.barCode, // 条形码
        categoryId: this.searchParams.categoryId, // 类目id
        categoryLevel: this.searchParams.categoryLevel, // 类目等级
        valid: this.searchParams.valid, // 启停用
        pageFlag: '1', // 分页标识，1分页，2不分页
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.getSkuDataList();
    },
    // 保存列表数据
    saveDataList() {
      console.log(this.checkedArr);
      this.checkedArr.forEach((item, i) => {
        if (item) {
          this.tableDataList[i].isValid = '1';
        } else {
          this.tableDataList[i].isValid = '0';
        }
      });
      console.log(this.tableDataList);
      this.updateTableDataList();
    },
    resetForm() {
      this.searchParams = {
        tab: '1',
        warehouseCode: '',
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '', // skuCode
        skuName: '', // sku名称
        barCode: '', // 条形码
        categoryId: '', // 类目id
        categoryLevel: '', // 类目等级
        isValid: '', // 启停用
        pageFlag: '1', // 分页标识，1分页，2不分页
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.searchParams11 = {
        tab: '1',
        warehouseCode: '',
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '', // skuCode
        skuName: '', // sku名称
        barCode: '', // 条形码
        categoryId: '', // 类目id
        categoryLevel: '', // 类目等级
        valid: '', // 启停用
        pageFlag: '2', // 分页标识，1分页，2不分页
        start: 0, // 开始页面
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      };
      this.isFirstLevel = true; // 关联二级菜单是否禁用
      this.isSecondLevel = true; // 关联三级菜单是否禁用
      this.getSkuDataList();
    },
    // 新增仓库弹窗
    addWarehouse() {
      this.warehouseCode = '';
      this.warehouseValid = false;
      this.isAdd = true;
      this.getWarehouseList();
    },
    // 保存仓库
    saveWarehouse() {
      if (!this.warehouseCode) {
        this.$utils.messagetip.warningTip('仓库名称不能为空！');
        return;
      }
      this.addWarehouseToList();
    },
    addWarehouseToList() {
      let isValid = this.warehouseValid ? '1' : '0';
      let obj = { isValid: isValid, source: '1' };
      this.warehouseList.forEach(item => {
        if (item.code === this.warehouseCode) {
          obj.warehouseName = item.warehouseName;
          obj.warehouseCode = item.code;
          obj.coverageArea = item.coverageArea;
          obj.matchLevel = item.matchLevel;
          obj.warehouseTypeAndWarehouseLevel = item.warehouseTypeAndWarehouseLevel;
        }
      });
      if (isValid === '1') {
		this.checkedArr.push(true);
      } else {
		this.checkedArr.push(false);
      }
      this.tableDataList.push(obj);
      this.isAdd = false;
     /** // 添加选择框
      this.checkedArr = [];
      if (this.tableDataList.length) {
        this.tableDataList.forEach(item => {
          if (item.isValid === '1') {
            this.checkedArr.push(true);
          } else {
            this.checkedArr.push(false);
          }
        });
      }**/
    },
    // 设置范围
    setRange() {
      this.isWarehouse = true;
      this.getDeliverWarehouseConfigList();
    },
    // 保存辐射范围表格数据到后台
    saveRange() {
      let isNull = false;
      let isRange = false;
      let isFormat = false;
      let isLevel = false;
      let rangeReg = /^[0-9.]+$/;
      this.deliverWarehouseConfigList.forEach(item => {
        if (item.coverageArea === '2' && !item.coverageAreaKm && !isNull) {
          isNull = true;
        }
        if (item.coverageAreaKm && !rangeReg.test(item.coverageAreaKm)) {
          isFormat = true;
        }
        if (item.coverageAreaKm && item.coverageAreaKm.indexOf('.') > -1 && item.coverageAreaKm.split('.')[1].length > 1 && !isRange) {
          isRange = true;
        }
        if (!item.matchLevel) {
          isLevel = true;
        }
      });
      if (isNull) {
        this.$utils.messagetip.warningTip('辐射范围为特定范围的公里数不能为空！');
        return;
      }
      if (isFormat) {
        this.$utils.messagetip.warningTip('辐射范围为特定范围的公里数类型只能为数字！');
        return;
      }
      if (isRange) {
        this.$utils.messagetip.warningTip('范围最多1位小数！');
        return;
      }
      if (isLevel) {
        this.$utils.messagetip.warningTip('匹配等级不能为空！');
        return;
      }
      console.log(this.deliverWarehouseConfigList);
      this.updateDeliverWarehouseConfigList();
    },
    tabClick(i) {
      this.isActive = i;
      if (i === 1) {
        this.initDataList();
      } else {
        this.getSkuDataList();
        this.getWarehouseArray();
      }
    },
    closeAll() {
      let params = {};
      let arr = [];
      this.multipleSelection.forEach(item => {
        arr.push(item.skuCode);
      });
      params.skus = arr;
      this.$confirm('关闭后已设置的发货仓库将失效。', '您确认关闭全部吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.putCloseAll(params);
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消关闭');
        });
    },
    // 设置全部
    configWarehouseAll(row) {
      this.warehouseTableList = [];
      this.deliveryWarehouseCode = '';
      this.deliveryValid = '0';
      this.warehouseTableList = this.multipleSelection;
      let params = {};
      let arr = [];
      this.warehouseTableList.forEach(item => {
        arr.push(item.skuCode);
      });
      params.skus = arr.join();
      this.getDeliveryWarehouseList(params);
      // this.getSkuDataListAll();
      this.isRanking = true;
    },
    // 列表点击单个设置
    configWarehouse(row) {
      this.warehouseTableList = [];
      this.warehouseTableList.push(row);
      this.deliveryWarehouseCode = '';
      this.deliveryValid = '0';
      console.log(this.deliveryValid);
      if (row.valid) {
        this.deliveryValid = row.valid;
      }
      console.log(this.deliveryValid);
      if (row.warehouseCode) {
        this.deliveryWarehouseCode = row.warehouseCode;
      }
      console.log(row);
      // this.operateParams.entityId = this.warehouseTableList[0].skuCode;
      this.getDeliveryWarehouseList({skus: this.warehouseTableList[0].skuCode});
      this.isRanking = true;
    },
    // 取消弹窗
    cancelModel() {
      this.isRanking = false;
      this.getSkuDataList();
    },
    // 设置仓库优先级保存
    saveDeliveryWarehouse() {
      let params = {};
      let skuArr = [];
      this.warehouseTableList.forEach(item => {
        skuArr.push(item.skuCode);
      });
      params.warehouseCode = this.deliveryWarehouseCode;
      params.valid = this.deliveryValid;
      params.skus = skuArr;
      if (params.warehouseCode === '') {
        this.$utils.messagetip.warningTip('请选择发货仓库！');
        return;
      }
      if (params.valid === '') {
        this.$utils.messagetip.warningTip('请选择启用设置！');
        return;
      }
      this.updatePriority(params);
    },
    // 删除
    deleteList(i) {
      console.log(i);
      let result = this.warehouseTableList;
      result.splice(i, 1);
      this.warehouseTableList = result;
      console.log(this.warehouseTableList);
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.getSkuDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNo = val;
      this.getSkuDataList();
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
    // 日志弹窗
    getLogInfoModel() {
      this.isLog = true;
      this.operateParams.entityType = 'WarehousePriority';
      this.operateParams.entityId = '';
      this.getLogInfo();
    },
    // 等级设置日志弹窗
    getLogInfoRankModel() {
      this.isLog = true;
      this.operateParams.entityType = 'MatchStrategyConfig';
      this.operateParams.entityId = this.warehouseTableList[0].skuCode;
      this.getLogInfo();
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.shipwarehousematch
  .paging
    text-align: right
  .nav
    width: 30%
    margin: 0 auto
    padding-bottom: 15px
    font-size: 0px
    .tab
      width: 49%
      display: inline-block
      line-height: 30px
      font-size: 14px
      box-sizing: border-box
      text-align: center
      vertical-align: top
      border: solid 1px rgb(88, 174, 252)
      cursor: pointer
    .active
      background-color: rgb(88, 174, 252)
      color: #ffffff
  .line
    border-bottom: dotted 1px rgb(88, 174, 252)
    margin-bottom: 15px
  .tip
    color: rgb(255, 136, 0)
    border: solid 1px rgb(255, 136, 0)
    border-radius: 5px
    padding: 0 20px
    line-height: 30px
    margin: 10px 0 20px 0
  .btn
    cursor: pointer
    color: blue
  .left
    text-align: right
    line-height: 28px
  .right
    line-height: 28px
  .title
    width: 100%
    line-height: 28px
    margin: 10px 0
    span
      vertical-align: top
      display: inline-block
    .tip_blue
      width: 14px
      height: 28px
      background-color: rgb(25, 158, 216)
    .tip_title
      width: 8%
      text-align: center
    .tip_line
      width: 89%
      height: 1px
      background-color: rgb(25, 158, 216)
      position: relative
      top: 10px
</style>
<style lang="stylus">
.shipwarehousematch
  .el-dialog
    width 1200px !important
  .el-input--mini .el-input__inner
    min-height 28px !important
  .el-message-box__title
    font-size: 16px
    font-weight: 600
  .data_list thead tr th:nth-child(3) div::before
    content: '*'
    padding-right: 5px
    color: #ff0000
  .data_list thead tr th:nth-child(4) div::before
    content: '*'
    padding-right: 5px
    color: #ff0000
</style>
